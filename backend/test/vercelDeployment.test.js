const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const supertest = require('supertest');
const app = require('../app');
const { createPreviewDeployment, getDeploymentStatus } = require('../services/vercelService');

describe('Vercel Preview Deployment Engine & Routes', () => {
  it('creates a preview deployment without exposing Vercel tokens to client', async () => {
    const deployment = await createPreviewDeployment({
      repository: 'sanjaycoder48/codeNest',
      repositoryTwin: { project: { fullName: 'sanjaycoder48/codeNest', defaultBranch: 'main' } }
    });

    assert.ok(deployment.id, 'must return deployment id');
    assert.ok(deployment.status, 'must return deployment status');
    assert.ok(!deployment.token, 'token must never be returned or exposed');
  });

  it('polls deployment status and returns Deployment Doctor diagnosis on failure', async () => {
    const statusData = await getDeploymentStatus('dpl_runner_failed_123', {
      readiness: { score: 45 }
    });

    assert.equal(statusData.status, 'ERROR');
    assert.ok(statusData.diagnosis, 'must include Deployment Doctor diagnosis on failure');
    assert.ok(statusData.diagnosis.rootCause, 'must specify rootCause');
  });

  it('POST /api/deployment/preview initiates preview deployment', async () => {
    const res = await supertest(app)
      .post('/api/deployment/preview')
      .send({ repository: 'sanjaycoder48/codeNest' });

    assert.equal(res.status, 202);
    assert.ok(res.body.id);
    assert.ok(res.body.status);
  });

  it('GET /api/deployment/status/:id fetches deployment status', async () => {
    const createRes = await supertest(app)
      .post('/api/deployment/preview')
      .send({ repository: 'sanjaycoder48/codeNest' });

    const statusRes = await supertest(app)
      .get(`/api/deployment/status/${createRes.body.id}`);

    assert.equal(statusRes.status, 200);
    assert.equal(statusRes.body.id, createRes.body.id);
  });

  it('POST /api/deployment/promote requires explicit user approval', async () => {
    const unapprovedRes = await supertest(app)
      .post('/api/deployment/promote')
      .send({ deploymentId: 'dpl_123', userApproval: false });

    assert.equal(unapprovedRes.status, 403);
    assert.ok(unapprovedRes.body.message.toLowerCase().includes('explicit user approval is required'));

    const approvedRes = await supertest(app)
      .post('/api/deployment/promote')
      .send({ deploymentId: 'dpl_123', userApproval: true });

    assert.equal(approvedRes.status, 200);
    assert.equal(approvedRes.body.status, 'promoted');
    assert.equal(approvedRes.body.environment, 'production');
  });
});
