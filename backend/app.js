const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');

// The Express app is built here and started in server.js, so tests can mount it
// without opening a port or connecting to a database.
const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '100kb' }));
if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));

app.get('/', (req, res) => {
    res.send('CodeNest API Running...');
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

// Central error handler: log the detail, return the generic message.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    if (process.env.NODE_ENV !== 'test') {
        console.error(`${req.method} ${req.originalUrl} ->`, err);
    }
    res.status(err.status || 500).json({ message: 'Server error' });
});

module.exports = app;
