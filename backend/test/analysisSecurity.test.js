const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'analysis-security-test-secret';
process.env.ANALYSIS_RATE_LIMIT_MAX = '5';

const app = require('../app');
const { parseRepository } = require('../services/repositoryAnalyzer');

test('repository input cannot escape the /repos namespace', () => {
    // "../user" once produced https://api.github.com/repos/../user, which URL
    // normalisation collapses to https://api.github.com/user — sending the
    // server's GitHub token to an endpoint the caller picked.
    const traversal = ['../user', '../../user', 'a/../../user', '../repos', '../orgs'];

    for (const input of traversal) {
        assert.throws(() => parseRepository(input), /GitHub repository/,
            `"${input}" must be rejected`);
    }
});

test('parsed owner and repo always resolve inside /repos', () => {
    const accepted = ['sanjaycoder48/codeNest', 'https://github.com/facebook/react', 'git@github.com:vercel/next.js.git'];

    for (const input of accepted) {
        const { owner, repo } = parseRepository(input);
        const url = new URL(`https://api.github.com/repos/${owner}/${repo}`);
        assert.ok(url.pathname.startsWith('/repos/'),
            `"${input}" resolved to ${url.pathname}`);
        assert.doesNotMatch(owner, /\.\./);
        assert.doesNotMatch(repo, /\.\./);
    }
});

test('a hyphen-leading or over-long owner is rejected', () => {
    assert.throws(() => parseRepository('-bad/repo'), /GitHub repository/);
    assert.throws(() => parseRepository(`${'a'.repeat(40)}/repo`), /GitHub repository/);
});

test('the analysis endpoint validates its input', async () => {
    const missing = await request(app).post('/api/analysis').send({});
    assert.equal(missing.status, 400);

    const wrongType = await request(app).post('/api/analysis').send({ repository: { $ne: null } });
    assert.equal(wrongType.status, 400, 'a non-string repository must be rejected');

    const tooLong = await request(app).post('/api/analysis').send({ repository: 'a/'.repeat(300) });
    assert.equal(tooLong.status, 400);
});

test('analysis requests are rate limited', async () => {
    const attempt = () => request(app).post('/api/analysis').send({ repository: 'octocat/Hello-World' });

    let limited = false;
    for (let i = 0; i < 12; i++) {
        const res = await attempt();
        if (res.status === 429) { limited = true; break; }
    }
    assert.ok(limited, 'analysis endpoint must be rate limited — it spends the GitHub quota');
});

test('an unknown job id returns 404', async () => {
    const res = await request(app).get('/api/analysis/00000000-0000-0000-0000-000000000000');
    assert.equal(res.status, 404);
});

test('the job store is bounded and does not grow without limit', async () => {
    const jobs = require('../routes/analysis').__jobs;
    const cap = Number(process.env.ANALYSIS_MAX_JOBS) || 500;
    assert.ok(jobs.size <= cap, `job store held ${jobs.size} entries, cap is ${cap}`);
});
