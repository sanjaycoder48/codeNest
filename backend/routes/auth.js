const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const User = require('../models/User');

// Credentials must be strings — objects here become NoSQL query operators.
const isCredential = (v) => typeof v === 'string' && v.length > 0;

// Configurable so the test suite can raise it; 10 per 15 minutes in normal use.
const authLimiter = rateLimit({
    windowMs: Number(process.env.AUTH_RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: Number(process.env.AUTH_RATE_LIMIT_MAX) || 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many attempts. Try again in 15 minutes.' }
});

const signToken = (user) =>
    jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET, {
        algorithm: 'HS256',
        expiresIn: '1d'
    });

const publicUser = (user) => ({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
});

// Register
router.post('/register', authLimiter, async (req, res, next) => {
    const { name, email, password } = req.body;

    if (!isCredential(name) || !isCredential(email) || !isCredential(password)) {
        return res.status(400).json({ message: 'Name, email and password are required.' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ message: 'Enter a valid email address.' });
    }
    if (password.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters.' });
    }

    try {
        const normalisedEmail = email.toLowerCase().trim();
        const existing = await User.findOne({ email: normalisedEmail });
        if (existing) return res.status(400).json({ message: 'User already exists' });

        const hashed = await bcrypt.hash(password, await bcrypt.genSalt(10));
        const user = await User.create({ name, email: normalisedEmail, password: hashed });

        // Log the user straight in — no reason to make them retype what they just entered.
        res.status(201).json({ token: signToken(user), user: publicUser(user) });
    } catch (err) {
        // The unique index is the real guarantee; the check above only races.
        if (err.code === 11000) return res.status(400).json({ message: 'User already exists' });
        next(err);
    }
});

// Login
router.post('/login', authLimiter, async (req, res, next) => {
    const { email, password } = req.body;

    if (!isCredential(email) || !isCredential(password)) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    try {
        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        res.json({ token: signToken(user), user: publicUser(user) });
    } catch (err) {
        next(err);
    }
});

// Current user — lets the client verify a stored token is still good.
router.get('/me', require('../middleware/auth'), async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ user: publicUser(user) });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
