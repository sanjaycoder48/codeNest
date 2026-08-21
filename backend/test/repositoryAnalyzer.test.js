const test = require('node:test');
const assert = require('node:assert/strict');
const { buildReadiness, classifyFiles, extractEnvironment, parseRepository } = require('../services/repositoryAnalyzer');

test('parses supported GitHub repository inputs', () => {
    assert.deepEqual(parseRepository('https://github.com/openai/openai-node.git'), { owner: 'openai', repo: 'openai-node' });
    assert.deepEqual(parseRepository('openai/openai-node'), { owner: 'openai', repo: 'openai-node' });
});

test('classifies source files into project concepts', () => {
    const result = classifyFiles([
        { type: 'blob', path: 'src/components/Header.tsx' },
        { type: 'blob', path: 'src/pages/Home.tsx' },
        { type: 'blob', path: 'api/routes/auth.js' },
        { type: 'blob', path: 'models/User.js' }
    ]);
    assert.equal(result.components.length, 1);
    assert.equal(result.pages.length, 1);
    assert.equal(result.apiFiles.length, 1);
    assert.equal(result.models.length, 1);
});

test('extracts environment names without exposing values', () => {
    const result = extractEnvironment({
        'src/api.ts': 'const url = import.meta.env.VITE_API_URL; const key = process.env.API_SECRET;'
    });
    assert.deepEqual(result.map((item) => item.name).sort(), ['API_SECRET', 'VITE_API_URL']);
    assert.equal(result.find((item) => item.name === 'API_SECRET').sensitive, true);
});

test('readiness score is derived from weighted checks', () => {
    const result = buildReadiness({
        files: [{ path: 'README.md' }, { path: '.gitignore' }, { path: 'package-lock.json' }],
        packages: [{ manifest: { scripts: { build: 'vite build', lint: 'eslint .' } } }],
        dependencies: [], environments: [], frameworks: ['Vite']
    });
    assert.equal(result.score, 64);
    assert.ok(result.findings.some((finding) => finding.id === 'tests'));
});
