const express = require('express');
const crypto = require('crypto');
const { analyzeRepository } = require('../services/repositoryAnalyzer');

const router = express.Router();
const jobs = new Map();

router.post('/', (req, res) => {
    const repository = req.body?.repository;
    if (!repository) return res.status(400).json({ message: 'Repository URL is required.' });

    const id = crypto.randomUUID();
    jobs.set(id, { id, repository, status: 'queued', progress: 5, stage: 'Preparing analysis', createdAt: new Date().toISOString() });
    res.status(202).json(jobs.get(id));

    setImmediate(async () => {
        try {
            jobs.set(id, { ...jobs.get(id), status: 'analyzing', progress: 24, stage: 'Classifying repository files' });
            const twin = await analyzeRepository(repository);
            jobs.set(id, { ...jobs.get(id), status: 'complete', progress: 100, stage: 'Project Twin ready', twin, completedAt: new Date().toISOString() });
        } catch (error) {
            jobs.set(id, { ...jobs.get(id), status: 'failed', progress: 100, stage: 'Analysis failed', error: error.message });
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
    const configured = new Set(environment);
    const missing = requiredEnvironment.find((item) => !configured.has(item.name));
    const logMatch = String(logs).match(/(?:missing|undefined|not defined)[:\s]+([A-Z][A-Z0-9_]*)/i);
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
