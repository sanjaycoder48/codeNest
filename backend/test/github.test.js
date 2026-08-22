const { describe, it } = require('node:test');
const assert = require('node:assert');
const githubService = require('../services/githubService');
const Repository = require('../models/Repository');
const AnalysisResult = require('../models/AnalysisResult');

describe('GitHub Service & Database Models', () => {
  it('instantiates Octokit client correctly', () => {
    const octokit = githubService.getOctokit('dummy_test_token');
    assert.ok(octokit);
    assert.ok(octokit.rest);
    assert.ok(octokit.rest.repos);
  });

  it('handles offline or invalid repository lookup gracefully', async () => {
    const res = await githubService.getRepository('invalid-owner-xyz-999', 'invalid-repo-abc-888');
    assert.strictEqual(res.success, false);
    assert.ok(res.error);
  });

  it('instantiates Repository model correctly', () => {
    const repo = new Repository({
      fullName: 'sanjaycoder48/codeNest',
      owner: 'sanjaycoder48',
      repoName: 'codeNest',
      defaultBranch: 'main',
      starsCount: 42,
      readinessScore: 92
    });

    assert.strictEqual(repo.fullName, 'sanjaycoder48/codeNest');
    assert.strictEqual(repo.readinessScore, 92);
  });

  it('instantiates AnalysisResult model correctly', () => {
    const analysis = new AnalysisResult({
      repositoryId: 'sanjaycoder48-codenest',
      branch: 'feature/payment-validation',
      risk: 'MEDIUM',
      confidence: 94,
      filesChanged: ['backend/payments/PaymentService.ts'],
      impact: { components: 18, apis: 7, tests: 12, workflows: 3 }
    });

    assert.strictEqual(analysis.repositoryId, 'sanjaycoder48-codenest');
    assert.strictEqual(analysis.confidence, 94);
    assert.strictEqual(analysis.impact.components, 18);
  });
});
