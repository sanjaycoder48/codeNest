const test = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-not-used-anywhere-real';
// The limiter is exercised by its own test file; keep it out of the way here.
process.env.AUTH_RATE_LIMIT_MAX = '10000';

// sanitizeFilter is deliberately NOT set here — app.js must wire it, so this
// suite fails if that protection is ever removed from the application.
const app = require('../app');
const User = require('../models/User');
const Project = require('../models/Project');

let mongod;

test.before(async () => {
    mongod = await MongoMemoryServer.create();
    await mongoose.connect(mongod.getUri());
});

test.after(async () => {
    await mongoose.disconnect();
    await mongod.stop();
});

test.beforeEach(async () => {
    await User.deleteMany({});
    await Project.deleteMany({});
});

const register = (overrides = {}) =>
    request(app).post('/api/auth/register').send({
        name: 'Sam Dev',
        email: 'sam@example.com',
        password: 'correct-horse',
        ...overrides,
    });

test('register creates a user and returns a usable token', async () => {
    const res = await register();
    assert.equal(res.status, 201);
    assert.ok(res.body.token, 'expected a token');
    assert.equal(res.body.user.email, 'sam@example.com');
    assert.equal(res.body.user.password, undefined, 'password must never be returned');
});

test('register rejects a password under 8 characters', async () => {
    const res = await register({ password: 'short' });
    assert.equal(res.status, 400);
    assert.match(res.body.message, /8 characters/);
});

test('register normalises email case, so duplicates are caught', async () => {
    await register({ email: 'Sam@Example.com' });
    const dup = await register({ email: 'sam@example.com' });
    assert.equal(dup.status, 400);
    assert.match(dup.body.message, /already exists/);
});

test('login succeeds with correct credentials and rejects a wrong password', async () => {
    await register();

    const ok = await request(app)
        .post('/api/auth/login')
        .send({ email: 'sam@example.com', password: 'correct-horse' });
    assert.equal(ok.status, 200);
    assert.ok(ok.body.token);

    const bad = await request(app)
        .post('/api/auth/login')
        .send({ email: 'sam@example.com', password: 'wrong-password' });
    assert.equal(bad.status, 400);
    assert.equal(bad.body.message, 'Invalid credentials');
});

test('login rejects a NoSQL operator in place of an email', async () => {
    await register();

    const res = await request(app)
        .post('/api/auth/login')
        .send({ email: { $gt: '' }, password: 'correct-horse' });

    assert.equal(res.status, 400, 'operator injection must not reach the query');
    assert.equal(res.body.message, 'Invalid credentials');
});

test('projects require a token', async () => {
    const noToken = await request(app).get('/api/projects');
    assert.equal(noToken.status, 401);

    const badScheme = await request(app)
        .get('/api/projects')
        .set('Authorization', 'Basic abc.def.ghi');
    assert.equal(badScheme.status, 401, 'a non-Bearer scheme must be rejected');
});

test('a signed-in user can create, search, update and delete a project', async () => {
    const { body: { token } } = await register();
    const auth = (req) => req.set('Authorization', `Bearer ${token}`);

    const created = await auth(request(app).post('/api/projects')).send({
        title: 'CloudSync Pro',
        description: 'Infrastructure syncing.',
        techStack: 'React, Node, React',
    });
    assert.equal(created.status, 201);
    assert.deepEqual(created.body.techStack, ['React', 'Node'], 'duplicates are removed');

    const list = await auth(request(app).get('/api/projects'));
    assert.equal(list.status, 200);
    assert.equal(list.body.projects.length, 1);
    assert.equal(list.body.total, 1);

    const hit = await auth(request(app).get('/api/projects?q=cloudsync'));
    assert.equal(hit.body.projects.length, 1);

    const miss = await auth(request(app).get('/api/projects?q=nothingmatches'));
    assert.equal(miss.body.projects.length, 0);

    const updated = await auth(request(app).patch(`/api/projects/${created.body._id}`)).send({
        title: 'CloudSync Enterprise',
        description: 'Infrastructure syncing.',
        techStack: ['React'],
    });
    assert.equal(updated.status, 200);
    assert.equal(updated.body.title, 'CloudSync Enterprise');

    const removed = await auth(request(app).delete(`/api/projects/${created.body._id}`));
    assert.equal(removed.status, 200);

    const after = await auth(request(app).get('/api/projects'));
    assert.equal(after.body.projects.length, 0);
});

test('a user cannot read, update or delete another user\'s project', async () => {
    const owner = await register({ email: 'owner@example.com' });
    const intruder = await register({ email: 'intruder@example.com' });

    const created = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${owner.body.token}`)
        .send({ title: 'Private', description: 'Not yours.', techStack: [] });

    const id = created.body._id;
    const asIntruder = `Bearer ${intruder.body.token}`;

    const read = await request(app).get(`/api/projects/${id}`).set('Authorization', asIntruder);
    assert.equal(read.status, 404);

    const patch = await request(app)
        .patch(`/api/projects/${id}`)
        .set('Authorization', asIntruder)
        .send({ title: 'Hijacked', description: 'Mine now.' });
    assert.equal(patch.status, 404);

    const del = await request(app).delete(`/api/projects/${id}`).set('Authorization', asIntruder);
    assert.equal(del.status, 404);

    // The project must still be intact and owned by the original user.
    const stillThere = await request(app)
        .get(`/api/projects/${id}`)
        .set('Authorization', `Bearer ${owner.body.token}`);
    assert.equal(stillThere.status, 200);
    assert.equal(stillThere.body.title, 'Private');
});

test('a malformed project id returns 404, not 500', async () => {
    const { body: { token } } = await register();
    const res = await request(app)
        .delete('/api/projects/not-a-valid-object-id')
        .set('Authorization', `Bearer ${token}`);

    assert.equal(res.status, 404);
    assert.equal(res.body.message, 'Project not found');
});

test('creating a project without a title is rejected', async () => {
    const { body: { token } } = await register();
    const res = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${token}`)
        .send({ description: 'No title here.' });

    assert.equal(res.status, 400);
    assert.match(res.body.message, /Title is required/);
});

test('health endpoint reports database state', async () => {
    const res = await request(app).get('/health');
    assert.equal(res.status, 200);
    assert.equal(res.body.status, 'ok');
    assert.equal(res.body.db, 'connected');
});

test('an unknown API route returns a JSON 404', async () => {
    const res = await request(app).get('/api/does-not-exist');
    assert.equal(res.status, 404);
    assert.equal(res.body.message, 'Not found');
});

test('app.js wires sanitizeFilter, not just the route-level guards', async () => {
    assert.equal(mongoose.get('sanitizeFilter'), true,
        'requiring ../app must enable sanitizeFilter');
});

test('PATCH is a partial update and does not erase omitted fields', async () => {
    const { body: { token } } = await register({ email: 'patch@example.com' });
    const auth = (req) => req.set('Authorization', `Bearer ${token}`);

    const created = await auth(request(app).post('/api/projects')).send({
        title: 'Original',
        description: 'Original description.',
        techStack: ['React', 'Node'],
    });

    // Title only — description and techStack must survive.
    const patched = await auth(request(app).patch(`/api/projects/${created.body._id}`))
        .send({ title: 'Renamed' });

    assert.equal(patched.status, 200, 'a partial PATCH must be accepted');
    assert.equal(patched.body.title, 'Renamed');
    assert.equal(patched.body.description, 'Original description.');
    assert.deepEqual(patched.body.techStack, ['React', 'Node'], 'techStack must not be wiped');

    const empty = await auth(request(app).patch(`/api/projects/${created.body._id}`)).send({});
    assert.equal(empty.status, 400);
    assert.match(empty.body.message, /Nothing to update/);
});

test('a negative limit does not reach the query', async () => {
    const { body: { token } } = await register({ email: 'limit@example.com' });
    const res = await request(app)
        .get('/api/projects?limit=-5')
        .set('Authorization', `Bearer ${token}`);

    assert.equal(res.status, 200);
    assert.ok(res.body.limit >= 1, `limit was ${res.body.limit}, expected >= 1`);
});

test('malformed JSON reports a client error, not a server error', async () => {
    const res = await request(app)
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send('{"email": "a@b.c", ');

    assert.equal(res.status, 400);
    assert.match(res.body.message, /Malformed JSON/);
});

test('login takes similar time whether or not the email exists', async () => {
    await register({ email: 'timing@example.com' });

    const time = async (body) => {
        const started = process.hrtime.bigint();
        await request(app).post('/api/auth/login').send(body);
        return Number(process.hrtime.bigint() - started) / 1e6;
    };

    let unknown = 0, known = 0;
    for (let i = 0; i < 4; i++) {
        unknown += await time({ email: `ghost${i}@example.com`, password: 'not-the-password' });
        known += await time({ email: 'timing@example.com', password: 'not-the-password' });
    }
    unknown /= 4; known /= 4;

    // Before the fix the unknown-email path skipped bcrypt entirely and answered
    // roughly 8x faster, which enumerates registered addresses.
    const ratio = Math.max(unknown, known) / Math.min(unknown, known);
    assert.ok(ratio < 3,
        `timing ratio ${ratio.toFixed(2)} (unknown ${unknown.toFixed(0)}ms vs known ${known.toFixed(0)}ms) leaks account existence`);
});
