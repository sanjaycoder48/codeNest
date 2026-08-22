const { describe, it } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('../app');

describe('GitHub OAuth Routes', () => {
  it('GET /api/auth/github/url returns GitHub OAuth authorization link', async () => {
    const res = await request(app).get('/api/auth/github/url');
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.url);
    assert.ok(res.body.url.includes('github.com/login/oauth/authorize'));
  });

  it('POST /api/auth/github/callback rejects missing code', async () => {
    const res = await request(app).post('/api/auth/github/callback').send({});
    assert.strictEqual(res.status, 400);
    assert.ok(res.body.message.includes('code'));
  });

  it('POST /api/auth/github/callback exchanges code and returns user JWT session', async () => {
    const res = await request(app)
      .post('/api/auth/github/callback')
      .send({ code: 'valid_mock_oauth_code_123' });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.status, 'success');
    assert.ok(res.body.token);
    assert.ok(res.body.githubToken);
    assert.ok(res.body.user);
    assert.strictEqual(res.body.user.username, 'octocat');
  });
});
