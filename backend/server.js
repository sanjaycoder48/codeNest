const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/analysis', require('./routes/analysis'));

// Basic Route
app.get('/', (req, res) => {
    res.json({ name: 'Project Twin API', status: 'running' });
});

app.listen(PORT, () => console.log(`Project Twin API running on port ${PORT}`));

// Repository analysis remains available without a database; account features connect when configured.
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/codenest', {
    serverSelectionTimeoutMS: 3000
}).then(() => console.log('MongoDB connected'))
    .catch(() => console.warn('MongoDB unavailable; authentication and saved projects are disabled.'));
