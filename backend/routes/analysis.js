const express = require('express');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const { analyzeRepository } = require('../services/repositoryAnalyzer');

const router = express.Router();

// Jobs are held in memory, so the store has to be bounded: each completed job
// carries a full twin object, and an unbounded Map grows until the process is
// killed. Entries expire, and the oldest is dropped once the cap is reached.
const JOB_TTL_MS = Number(process.env.ANALYSIS_JOB_TTL_MS) || 30 * 60 * 1000;
const MAX_JOBS = Number(process.env.ANALYSIS_MAX_JOBS) || 500;
const jobs = new Map();

function pruneJobs() {
    const cutoff = Date.now() - JOB_TTL_MS;
    for (const [id, job] of jobs) {
        if (new Date(job.createdAt).getTime() < cutoff) jobs.delete(id);
    }
    // Map preserves insertion order, so the first key is the oldest job.
    while (jobs.size > MAX_JOBS) {
        jobs.delete(jobs.keys().next().value);
    }
}

// Every analysis spends the server's GitHub API quota, so it is limited even
// though the endpoint is unauthenticated.
const analysisLimiter = rateLimit({
    windowMs: Number(process.env.ANALYSIS_RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: Number(process.env.ANALYSIS_RATE_LIMIT_MAX) || 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many analysis requests. Try again shortly.' }
});

router.post('/', analysisLimiter, (req, res) => {
    const repository = req.body?.repository;
    if (typeof repository !== 'string' || !repository.trim()) {
        return res.status(400).json({ message: 'Repository URL is required.' });
    }
    if (repository.length > 200) {
        return res.status(400).json({ message: 'Repository reference is too long.' });
    }

    pruneJobs();

    const id = crypto.randomUUID();
    jobs.set(id, {
        id, repository, status: 'queued', progress: 5,
        stage: 'Preparing analysis', createdAt: new Date().toISOString()
    });
    res.status(202).json(jobs.get(id));

    setImmediate(async () => {
        try {
            const queued = jobs.get(id);
            if (!queued) return; // pruned or cancelled before work began
            jobs.set(id, { ...queued, status: 'analyzing', progress: 24, stage: 'Classifying repository files' });

            const twin = await analyzeRepository(repository);

            const current = jobs.get(id);
            if (!current) return;
            jobs.set(id, {
                ...current, status: 'complete', progress: 100,
                stage: 'Project Twin ready', twin, completedAt: new Date().toISOString()
            });
        } catch (error) {
            const current = jobs.get(id);
            if (!current) return;
            // The analyzer throws messages written for users. Anything else is
            // internal and must not be echoed back to the caller.
            const safe = error instanceof Error && error.message && error.message.length < 200
                ? error.message
                : 'Analysis failed.';
            if (process.env.NODE_ENV !== 'test') console.error(`analysis ${id} failed:`, error);
            jobs.set(id, { ...current, status: 'failed', progress: 100, stage: 'Analysis failed', error: safe });
        }
    });
});

router.get('/:id', (req, res) => {
    const job = jobs.get(req.params.id);
    if (!job) return res.status(404).json({ message: 'Analysis job not found.' });
    res.json(job);
});

router.post('/deployment/diagnose', (req, res) => {
    const { logs = '', environment = [], requiredEnvironment = [] } = req.body || {};
    const configured = new Set(Array.isArray(environment) ? environment : []);
    const required = Array.isArray(requiredEnvironment) ? requiredEnvironment : [];
    const missing = required.find((item) => item && !configured.has(item.name));
    const logMatch = String(logs).slice(0, 20000).match(/(?:missing|undefined|not defined)[:\s]+([A-Z][A-Z0-9_]*)/i);
    const variable = missing?.name || logMatch?.[1];

    if (!variable) {
        return res.json({ status: 'needs-review', confidence: 64, cause: 'No single configuration failure could be verified.', actions: ['Inspect full build log', 'Compare build and local runtime versions'] });
    }

    res.json({
        status: 'diagnosed', confidence: missing ? 98 : 83,
        cause: `${variable} is missing from the deployment environment.`,
        affected: missing?.file || 'Build configuration',
        explanation: `The repository references ${variable}, but only the variable name was inspected. No secret value was read or exposed.`,
        actions: ['Locate reference', 'Configure variable', 'Retry preview deployment']
    });
});

module.exports = router;
module.exports.__jobs = jobs;
