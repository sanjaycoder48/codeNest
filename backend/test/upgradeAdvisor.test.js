const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { buildRecommendations, buildReadiness } = require('../services/repositoryAnalyzer');

describe('AI Upgrade Advisor Engine', () => {
  it('generates evidence-backed recommendations across 6 mandatory categories', () => {
    const readiness = buildReadiness({
      files: [{ path: 'README.md' }, { path: 'package.json' }],
      packages: [{ manifest: { scripts: { build: 'vite build' }, dependencies: { react: '^19.0.0', openai: '^4.0.0' } } }],
      dependencies: ['react', 'openai', 'tailwindcss', 'express'],
      environments: [{ name: 'VITE_API_URL', file: 'src/api.ts' }],
      frameworks: ['React', 'Express', 'Tailwind CSS']
    });

    const recommendations = buildRecommendations({
      dependencies: ['react', 'openai', 'tailwindcss', 'express'],
      frameworks: ['React', 'Express', 'Tailwind CSS'],
      readiness
    });

    assert.ok(Array.isArray(recommendations), 'recommendations must be an array');
    assert.ok(recommendations.length >= 6, 'must return recommendations for all 6 categories');

    const categories = recommendations.map(r => r.category);
    assert.ok(categories.includes('Security'), 'must include Security category');
    assert.ok(categories.includes('Dependencies'), 'must include Dependencies category');
    assert.ok(categories.includes('Code'), 'must include Code category');
    assert.ok(categories.includes('AI Models'), 'must include AI Models category');
    assert.ok(categories.includes('UI/Design'), 'must include UI/Design category');
    assert.ok(categories.includes('Performance'), 'must include Performance category');

    for (const rec of recommendations) {
      assert.ok(typeof rec.category === 'string' && rec.category.length > 0, 'category must be non-empty string');
      assert.ok(typeof rec.title === 'string' && rec.title.length > 0, 'title must be non-empty string');
      assert.ok(typeof rec.current === 'string' && rec.current.length > 0, 'current state must be non-empty string');
      assert.ok(typeof rec.recommended === 'string' && rec.recommended.length > 0, 'recommended change must be non-empty string');
      assert.ok(typeof rec.why === 'string' && rec.why.length > 0, 'why (reason) must be non-empty string');
      assert.ok(typeof rec.benefit === 'string' && rec.benefit.length > 0, 'benefit must be non-empty string');
      assert.ok(typeof rec.compatibility === 'string' && rec.compatibility.length > 0, 'compatibility must be non-empty string');
      assert.ok(['Low', 'Medium', 'High'].includes(rec.migrationRisk), 'migrationRisk must be Low, Medium, or High');
      assert.ok(Array.isArray(rec.migrationPlan) && rec.migrationPlan.length > 0, 'migrationPlan must be non-empty array');
      assert.ok(typeof rec.evidence === 'string' && rec.evidence.length > 0, 'evidence file reference must be present');
    }
  });
});
