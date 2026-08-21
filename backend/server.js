const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Fail loudly at startup rather than silently signing tokens with a guessable key.
if (!process.env.JWT_SECRET) {
    console.error('FATAL: JWT_SECRET is not set. Copy .env.example to .env and fill it in.');
    process.exit(1);
}

// Reject query operators ($gt, $ne, ...) arriving from request bodies.
mongoose.set('sanitizeFilter', true);

const app = require('./app');
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/codenest')
    .then(() => {
        console.log('MongoDB Connected');
        const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

        const shutdown = async (signal) => {
            console.log(`\n${signal} received, shutting down.`);
            server.close(async () => {
                await mongoose.connection.close();
                process.exit(0);
            });
        };
        process.on('SIGINT', () => shutdown('SIGINT'));
        process.on('SIGTERM', () => shutdown('SIGTERM'));
    })
    .catch(err => {
        // Exit non-zero so a process manager restarts us instead of leaving a
        // "healthy" process bound to nothing.
        console.error('MongoDB connection failed:', err.message);
        process.exit(1);
    });

mongoose.connection.on('disconnected', () => console.warn('MongoDB disconnected'));
