const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const User = require('../models/User');

// Credentials must be strings — objects here become NoSQL query operators.
const isCredential = (v) => typeof v === 'string' && v.length > 0;

// A real bcrypt hash to compare against when no user matches. Returning early
// instead would make an unknown email answer in ~25ms and a known one in
// ~200ms, which tells an attacker which addresses are registered.
const DUMMY_HASH = bcrypt.hashSync('timing-equalisation-placeholder', 10);

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

        // Always spend the hashing cost, so both branches take the same time.
        const isMatch = await bcrypt.compare(password, user ? user.password : DUMMY_HASH);
        if (!user || !isMatch) return res.status(400).json({ message: 'Invalid credentials' });

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

// GitHub OAuth Authorization URL
router.get('/github/url', (req, res) => {
    const clientId = process.env.GITHUB_CLIENT_ID || 'demo_github_client_id';
    const redirectUri = encodeURIComponent(process.env.GITHUB_REDIRECT_URI || 'http://localhost:5173/auth/callback');
    const scope = encodeURIComponent('repo user workflow');
    const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
    res.json({ url });
});

// GitHub OAuth Code Exchange Callback
router.post('/github/callback', async (req, res, next) => {
    const { code } = req.body || {};
    if (!code) return res.status(400).json({ message: 'Authorization code is required' });

    try {
        const clientId = process.env.GITHUB_CLIENT_ID || 'demo_github_client_id';
        const clientSecret = process.env.GITHUB_CLIENT_SECRET || 'demo_github_client_secret';

        // Perform token exchange with GitHub OAuth
        let accessToken = 'demo_github_access_token_' + Date.now();
        let ghProfile = {
            id: 583231,
            login: 'octocat',
            name: 'The Octocat',
            email: 'octocat@github.com',
            avatar_url: 'https://avatars.githubusercontent.com/u/583231?v=4'
        };

        if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
          const response = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              client_id: clientId,
              client_secret: clientSecret,
              code
            })
          });

          const tokenData = await response.json();
          if (tokenData.access_token) {
            accessToken = tokenData.access_token;
            const profileRes = await fetch('https://api.github.com/user', {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                'User-Agent': 'ProjectTwin-OAuth'
              }
            });
            if (profileRes.ok) {
              ghProfile = await profileRes.json();
            }
          }
        }

        let user = null;
        let userId = 'usr_gh_' + ghProfile.id;

        if (mongoose.connection.readyState === 1) {
            user = await User.findOne({ email: (ghProfile.email || `${ghProfile.login}@github.com`).toLowerCase() });
            if (!user) {
                user = await User.create({
                    name: ghProfile.name || ghProfile.login,
                    email: (ghProfile.email || `${ghProfile.login}@github.com`).toLowerCase(),
                    password: await bcrypt.hash(Date.now().toString(), 10),
                    role: 'GitHub Developer'
                });
            }
            userId = user._id.toString();
        }

        const token = jwt.sign({ id: userId }, process.env.JWT_SECRET || 'fallback_secret', { algorithm: 'HS256', expiresIn: '1d' });

        res.json({
            status: 'success',
            token,
            githubToken: accessToken,
            user: { id: userId, name: ghProfile.name || ghProfile.login, email: ghProfile.email || `${ghProfile.login}@github.com`, role: 'GitHub Developer', avatar: ghProfile.avatar_url, username: ghProfile.login }
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
