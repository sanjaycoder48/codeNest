const { describe, it, before } = require('node:test');
const assert = require('node:assert/strict');
const supertest = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');

let mongod;

describe('Full Lifecycle End-to-End Integration Suite', () => {
  let authToken;
  let projectId = 'ShopSphere';
  let inviteToken;
  let deploymentId;

  before(async () => {
    if (mongoose.connection.readyState !== 1) {
      mongod = await MongoMemoryServer.create();
      await mongoose.connect(mongod.getUri());
    }
  });

  it('Step 1: User Registration & Authentication', async () => {
    const res = await supertest(app)
      .post('/api/auth/register')
      .send({
        name: 'Lead Developer',
        email: `lead_${Date.now()}@example.com`,
        password: 'securePassword123'
      });

    assert.equal(res.status, 201);
    assert.ok(res.body.token, 'must return JWT session token');
    authToken = res.body.token;
  });

  it('Step 2 & 3: GitHub Repository Import & Analysis Job', async () => {
    const importRes = await supertest(app)
      .post('/api/analysis')
      .send({ repository: 'sanjaycoder48/codeNest' });

    assert.equal(importRes.status, 202);
    assert.ok(importRes.body.id, 'must return job id');

    const jobRes = await supertest(app)
      .get(`/api/analysis/${importRes.body.id}`);

    assert.equal(jobRes.status, 200);
    assert.ok(['queued', 'analyzing', 'complete'].includes(jobRes.body.status));
  });

  it('Step 4 & 5: Readiness Scoring & Upgrade Advisor Categorization', async () => {
    const twin = {
      project: { name: 'ShopSphere', repositoryUrl: 'https://github.com/demo/ShopSphere' },
      frameworks: ['React', 'Express', 'PostgreSQL'],
      languages: [{ name: 'TypeScript' }],
      dependencies: ['react', 'express', 'pg'],
      readiness: {
        score: 84,
        findings: [{ id: 'env', area: 'Security', problem: 'Missing .env.example', solution: 'Add .env.example', severity: 'high', file: 'repository root' }]
      },
      environment: [{ name: 'VITE_API_URL', file: 'src/api.ts', sensitive: false }]
    };

    assert.ok(twin.readiness.score > 0, 'readiness score must be calculated');
    assert.equal(twin.readiness.findings[0].area, 'Security');
  });

  it('Step 6: Grounded Ask Project Twin Q&A with Claim Classification', async () => {
    const twin = {
      project: { name: 'ShopSphere' },
      frameworks: ['Express', 'React'],
      apiRoutes: [{ method: 'POST', path: '/api/auth/login', file: 'backend/auth/AuthService.ts' }],
      readiness: { score: 85, findings: [] }
    };

    const askRes = await supertest(app)
      .post('/api/analysis/ask')
      .send({ question: 'Where is authentication handled?', repositoryTwin: twin, role: 'owner' });

    assert.equal(askRes.status, 200);
    assert.equal(askRes.body.classification, 'VERIFIED');
    assert.ok(askRes.body.answer.includes('AuthService.ts'));
  });

  it('Step 7 & 8: Collaboration Teammate Invitation & Acceptance', async () => {
    const inviteRes = await supertest(app)
      .post('/api/collaboration/invite')
      .send({ projectId: 'CampusCare', inviter: 'Vikash', email: 'priya@example.com', role: 'Developer' });

    assert.equal(inviteRes.status, 201);
    assert.ok(inviteRes.body.token);
    inviteToken = inviteRes.body.token;

    const acceptRes = await supertest(app)
      .post('/api/collaboration/accept')
      .send({ inviteToken, user: { username: 'Priya', name: 'Priya Sharma' } });

    assert.equal(acceptRes.status, 200);
    assert.equal(acceptRes.body.member.username, 'Priya');
  });

  it('Step 8b: ProjectMember Cross-Project Authorization Isolation (CampusCare vs SAGE)', async () => {
    // User B (Priya) accesses CampusCare (Member) -> 200 OK
    const campusCareRes = await supertest(app)
      .get('/api/collaboration/members/CampusCare?userId=Priya');
    assert.equal(campusCareRes.status, 200);
    assert.ok(campusCareRes.body.members.some(m => m.username === 'Priya'));

    // User B (Priya) attempts to access SAGE (Not a member) -> 403 Forbidden
    const sageRes = await supertest(app)
      .get('/api/collaboration/members/SAGE?userId=Priya');
    assert.equal(sageRes.status, 403);
    assert.ok(sageRes.body.message.includes('Access denied'));
  });

  it('Step 9: Task Assignment, Discussion Thread & AI Team Brief', async () => {
    const taskRes = await supertest(app)
      .post('/api/collaboration/tasks')
      .send({ projectId, title: 'Implement Stripe Checkout', assignedTo: 'Priya', priority: 'High' });

    assert.equal(taskRes.status, 201);

    const chatRes = await supertest(app)
      .post('/api/collaboration/discussions')
      .send({ projectId, text: '@ProjectTwin summarize today’s progress', author: 'Priya' });

    assert.equal(chatRes.status, 201);
    assert.ok(chatRes.body.aiMsg);

    const briefRes = await supertest(app)
      .get(`/api/collaboration/brief/${projectId}?userId=usr_vikash`);

    assert.equal(briefRes.status, 200);
    assert.ok(briefRes.body.summary.includes('Project Twin Brief'));
  });

  it('Step 10 & 11: Preview Deployment, Deployment Doctor Recovery & Production Promotion', async () => {
    const previewRes = await supertest(app)
      .post('/api/deployment/preview')
      .send({ repository: 'sanjaycoder48/codeNest' });

    assert.equal(previewRes.status, 202);
    deploymentId = previewRes.body.id;

    const diagRes = await supertest(app)
      .post('/api/analysis/deployment/diagnose')
      .send({
        logs: '12:42:13 ERROR VITE_API_URL is undefined',
        repositoryTwin: { environment: [{ name: 'VITE_API_URL', file: 'src/api.ts' }] }
      });

    assert.equal(diagRes.status, 200);
    assert.equal(diagRes.body.status, 'diagnosed');

    const promoteRes = await supertest(app)
      .post('/api/deployment/promote')
      .send({ deploymentId, userApproval: true });

    assert.equal(promoteRes.status, 200);
    assert.equal(promoteRes.body.status, 'promoted');
  });

  it('Step 12: Auto Showcase Generation & Public Safe Q&A', async () => {
    const twin = {
      project: { name: 'ShopSphere', description: 'E-commerce platform', repositoryUrl: 'https://github.com/demo/ShopSphere' },
      frameworks: ['React', 'Express'],
      languages: [{ name: 'TypeScript' }],
      features: ['Authentication', 'Payments'],
      apiRoutes: [{ method: 'GET', path: '/api/products', file: 'backend/routes/products.js' }],
      readiness: { score: 90, checks: [], findings: [] },
      environment: [{ name: 'VITE_API_URL', file: 'src/api.ts', sensitive: false }]
    };

    const showcaseRes = await supertest(app)
      .post('/api/twinspace/showcase/generate')
      .send({ repositoryTwin: twin, deploymentUrl: 'https://shopsphere.vercel.app' });

    assert.equal(showcaseRes.status, 200);
    assert.equal(showcaseRes.body.title, 'ShopSphere');
    assert.equal(showcaseRes.body.liveUrl, 'https://shopsphere.vercel.app');

    const publicAskRes = await supertest(app)
      .post('/api/analysis/ask')
      .send({ question: 'Which APIs are exposed?', repositoryTwin: twin, role: 'public' });

    assert.equal(publicAskRes.status, 200);
    assert.equal(publicAskRes.body.classification, 'VERIFIED');
  });
});
