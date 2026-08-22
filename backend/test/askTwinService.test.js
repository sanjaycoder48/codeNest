const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const supertest = require('supertest');
const app = require('../app');
const { answerProjectQuestion } = require('../services/askTwinService');

describe('Repository-Grounded Ask Project Twin Engine', () => {
  const sampleTwin = {
    project: { name: 'ShopSphere' },
    frameworks: ['Express', 'React', 'PostgreSQL'],
    apiRoutes: [
      { method: 'POST', path: '/api/auth/login', file: 'backend/auth/AuthService.ts' },
      { method: 'GET', path: '/api/payments/charge', file: 'backend/payments/PaymentService.ts' }
    ],
    readiness: {
      score: 82,
      findings: [
        { area: 'Security', severity: 'critical', problem: 'No .gitignore file was detected', why: 'Secrets can be committed accidentally.', solution: 'Add a framework-appropriate .gitignore', file: 'repository root' }
      ]
    },
    recommendations: [
      { category: 'Code', title: 'Add component-level verification', recommended: 'Add Vitest', benefit: 'Safer UI changes', evidence: 'package.json' }
    ],
    evidence: ['backend/auth/AuthService.ts', 'backend/payments/PaymentService.ts', 'README.md'],
    environment: [
      { name: 'VITE_API_URL', file: 'src/api.ts', sensitive: false },
      { name: 'JWT_SECRET', file: 'backend/auth/AuthService.ts', sensitive: true }
    ],
    architecture: {
      nodes: [{ id: 'client', label: 'React' }, { id: 'api', label: 'Express' }]
    }
  };

  it('classifies claim as VERIFIED with file evidence for authentication questions', () => {
    const res = answerProjectQuestion({ question: 'Where is authentication handled?', repositoryTwin: sampleTwin, role: 'owner' });

    assert.equal(res.classification, 'VERIFIED');
    assert.ok(res.answer.includes('AuthService.ts'));
    assert.ok(res.evidence.some(e => e.reference.includes('AuthService.ts')));
  });

  it('classifies claim as VERIFIED with readiness evidence for risk questions', () => {
    const res = answerProjectQuestion({ question: 'What could break in production?', repositoryTwin: sampleTwin, role: 'owner' });

    assert.equal(res.classification, 'VERIFIED');
    assert.ok(res.answer.includes('No .gitignore file was detected'));
    assert.ok(res.evidence.some(e => e.reference.includes('Security')));
  });

  it('returns UNKNOWN classification for questions outside indexed evidence', () => {
    const res = answerProjectQuestion({ question: 'What is the owner’s home phone number?', repositoryTwin: sampleTwin, role: 'public' });

    assert.equal(res.classification, 'UNKNOWN');
    assert.ok(res.answer.includes('cannot be verified'));
  });

  it('masks private file paths and excludes secret keys for public role', () => {
    const res = answerProjectQuestion({ question: 'Show environment variables and secrets', repositoryTwin: sampleTwin, role: 'public' });

    assert.equal(res.classification, 'VERIFIED');
    assert.ok(res.answer.includes('VITE_API_URL'));
    assert.ok(!res.answer.includes('JWT_SECRET'), 'sensitive JWT_SECRET must be excluded from public view');
  });

  it('POST /api/analysis/ask answers questions via API endpoint', async () => {
    const res = await supertest(app)
      .post('/api/analysis/ask')
      .send({ question: 'Which APIs are exposed?', repositoryTwin: sampleTwin, role: 'owner' });

    assert.equal(res.status, 200);
    assert.equal(res.body.classification, 'VERIFIED');
    assert.ok(res.body.answer.includes('POST /api/auth/login'));
  });
});
