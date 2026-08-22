const { describe, it } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('../app');

describe('TwinSpace API Endpoints', () => {
  it('GET /api/twinspace/users returns demo accounts', async () => {
    const res = await request(app).get('/api/twinspace/users');
    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.body.users));
    assert.strictEqual(res.body.users.length, 5);
    assert.ok(res.body.users.some(u => u.username === 'Vikash'));
  });

  it('GET /api/twinspace/repositories returns repository list', async () => {
    const res = await request(app).get('/api/twinspace/repositories');
    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.body.repositories));
    assert.ok(res.body.repositories.some(r => r.name === 'ShopSphere'));
  });

  it('POST /api/twinspace/sync returns progress stages', async () => {
    const res = await request(app)
      .post('/api/twinspace/sync')
      .send({ repoId: 'repo_shopsphere' });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.status, 'success');
    assert.ok(Array.isArray(res.body.stages));
    assert.strictEqual(res.body.stages.length, 6);
  });

  it('GET /api/twinspace/file reads file content', async () => {
    const res = await request(app)
      .get('/api/twinspace/file')
      .query({ path: 'backend/payments/PaymentService.ts' });
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.content.includes('PaymentService'));
  });

  it('GET /api/twinspace/analysis/duplicates returns multi-level duplicate findings', async () => {
    const res = await request(app).get('/api/twinspace/analysis/duplicates');
    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.body.duplicates));
    assert.strictEqual(res.body.duplicates[0].similarity, 87);
  });

  it('GET /api/twinspace/analysis/impact returns change impact graph', async () => {
    const res = await request(app)
      .get('/api/twinspace/analysis/impact')
      .query({ path: 'backend/auth/AuthService.ts' });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.risk, 'HIGH');
    assert.strictEqual(res.body.affectedCount.components, 18);
  });

  it('GET /api/twinspace/analysis/report returns whole repository code intelligence report', async () => {
    const res = await request(app).get('/api/twinspace/analysis/report');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.project, 'ShopSphere');
    assert.strictEqual(res.body.filesCount, 428);
    assert.strictEqual(res.body.linesCount, 61240);
  });
});
