const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const supertest = require('supertest');
const app = require('../app');
const { generatePublicShowcase } = require('../services/showcaseGenerator');

describe('Auto Showcase Generator Engine', () => {
  const sampleTwin = {
    project: { name: 'ShopSphere', description: 'E-commerce platform', repositoryUrl: 'https://github.com/demo/ShopSphere' },
    frameworks: ['Express', 'React', 'PostgreSQL'],
    languages: [{ name: 'TypeScript' }, { name: 'SQL' }],
    features: ['Authentication', 'Payments'],
    readiness: { score: 92, checks: [{ pass: true }, { pass: true }], findings: [] },
    environment: [
      { name: 'VITE_API_URL', file: 'src/api.ts', sensitive: false },
      { name: 'DATABASE_SECRET', file: 'config/db.ts', sensitive: true }
    ],
    summary: { apiRoutes: 14, dependencies: 28 },
    generatedAt: new Date().toISOString()
  };

  it('generates a public showcase grounded in verified repository evidence', () => {
    const showcase = generatePublicShowcase({
      repositoryTwin: sampleTwin,
      deploymentUrl: 'https://shopsphere.vercel.app'
    });

    assert.equal(showcase.title, 'ShopSphere');
    assert.equal(showcase.liveUrl, 'https://shopsphere.vercel.app');
    assert.equal(showcase.readinessSummary.score, 92);
    assert.ok(showcase.techStack.frameworks.includes('Express'));
    assert.ok(showcase.features.includes('Payments'));
    assert.ok(showcase.editable, 'showcase must be editable before publishing');
    assert.ok(showcase.askThisProjectEnabled, 'must enable Ask This Project launcher');
  });

  it('excludes sensitive secrets from public showcase environment', () => {
    const showcase = generatePublicShowcase({ repositoryTwin: sampleTwin });
    const envNames = showcase.publicEnvironment.map(e => e.name);

    assert.ok(envNames.includes('VITE_API_URL'), 'public safe env var should be present');
    assert.ok(!envNames.includes('DATABASE_SECRET'), 'sensitive secret must be excluded');
  });

  it('POST /api/twinspace/showcase/generate generates showcase via API endpoint', async () => {
    const res = await supertest(app)
      .post('/api/twinspace/showcase/generate')
      .send({ repositoryTwin: sampleTwin, deploymentUrl: 'https://shopsphere.vercel.app' });

    assert.equal(res.status, 200);
    assert.equal(res.body.title, 'ShopSphere');
    assert.equal(res.body.liveUrl, 'https://shopsphere.vercel.app');
  });
});
