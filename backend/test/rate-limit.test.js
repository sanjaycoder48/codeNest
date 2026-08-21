const test = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');

// Runs in its own file so the low limit set here cannot leak into the other
// suite — the limiter is built once, when routes/auth.js is first required.
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-not-used-anywhere-real';
process.env.AUTH_RATE_LIMIT_MAX = '3';

const app = require('../app');

let mongod;

test.before(async () => {
    mongod = await MongoMemoryServer.create();
    await mongoose.connect(mongod.getUri());
});

test.after(async () => {
    await mongoose.disconnect();
    await mongod.stop();
});

test('repeated login attempts are rate limited', async () => {
    const attempt = () =>
        request(app)
            .post('/api/auth/login')
            .send({ email: 'nobody@example.com', password: 'guessing-away' });

    // Within the limit: rejected on credentials, not throttled.
    for (let i = 0; i < 3; i++) {
        const res = await attempt();
        assert.equal(res.status, 400, `attempt ${i + 1} should fail on credentials`);
    }

    // Over the limit: throttled.
    const blocked = await attempt();
    assert.equal(blocked.status, 429, 'the fourth attempt must be rate limited');
    assert.match(blocked.body.message, /Too many attempts/);
});
