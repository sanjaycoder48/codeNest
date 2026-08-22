const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');

// The Express app is built here and started in server.js, so tests can mount it
// without opening a port or connecting to a database.
const app = express();

// Behind a proxy (Render, Railway, Fly, Nginx) req.ip is the proxy's address
// unless this is set, which would put every client in one rate-limit bucket.
// Opt in explicitly — trusting the header unconditionally allows IP spoofing.
if (process.env.TRUST_PROXY) {
    app.set('trust proxy', Number(process.env.TRUST_PROXY) || process.env.TRUST_PROXY);
}

// Query operators ($gt, $ne, ...) arriving inside a request body must never
// reach a filter. Set here rather than in server.js so it travels with the app
// and the test suite exercises the real wiring.
mongoose.set('sanitizeFilter', true);

// Comma-separated allowlist so a deployed frontend (for example GitHub Pages)
// can be permitted alongside the local dev server.
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

app.use(helmet());
app.use(cors({
    origin(origin, callback) {
        // Requests with no Origin (curl, server-to-server, same-origin) are allowed.
        if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(null, false);
    },
    credentials: true,
}));
app.use(express.json({ limit: '100kb' }));
if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/analysis', require('./routes/analysis'));
app.use('/api/twinspace', require('./routes/twinspace'));
app.use('/api/deployment', require('./routes/deployment'));

app.get('/', (req, res) => {
    res.json({ name: 'Project Twin API', status: 'running' });
});

app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
});

// Central error handler: log the detail, return a safe message.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    if (process.env.NODE_ENV !== 'test') {
        console.error(`${req.method} ${req.originalUrl} ->`, err);
    }
    // express.json() rejects malformed bodies with a 400; saying "Server error"
    // for a client mistake sends the caller looking in the wrong place.
    if (err.type === 'entity.parse.failed' || err instanceof SyntaxError) {
        return res.status(400).json({ message: 'Malformed JSON in request body.' });
    }
    if (err.type === 'entity.too.large') {
        return res.status(413).json({ message: 'Request body is too large.' });
    }
    res.status(err.status && err.status >= 400 && err.status < 600 ? err.status : 500)
        .json({ message: 'Server error' });
});

module.exports = app;
