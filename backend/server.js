const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Fail loudly rather than silently signing tokens with a guessable key.
if (!process.env.JWT_SECRET) {
    console.error('FATAL: JWT_SECRET is not set. Copy .env.example to .env and fill it in.');
    process.exit(1);
}

const app = require('./app');
const PORT = process.env.PORT || 5000;

// Listen first: repository analysis does not need a database, so the API stays
// useful even when MongoDB is unreachable. Only the account and saved-project
// features depend on the connection below.
const server = app.listen(PORT, () => console.log(`Project Twin API running on port ${PORT}`));

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/codenest', {
    serverSelectionTimeoutMS: 3000
})
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.warn(
        `MongoDB unavailable (${err.message}); authentication and saved projects are disabled.`
    ));

mongoose.connection.on('disconnected', () => console.warn('MongoDB disconnected'));

const shutdown = (signal) => {
    console.log(`\n${signal} received, shutting down.`);
    server.close(async () => {
        await mongoose.connection.close().catch(() => { });
        process.exit(0);
    });
    // Do not hang forever if a connection refuses to drain.
    setTimeout(() => process.exit(1), 10000).unref();
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
