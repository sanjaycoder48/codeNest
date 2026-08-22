const express = require('express');
const { createPreviewDeployment, getDeploymentStatus } = require('../services/vercelService');

const router = express.Router();

// Track deployments in memory
const deployments = new Map();

router.post('/preview', async (req, res) => {
  const { repository, repositoryTwin, environmentVars } = req.body || {};
  if (!repository && !repositoryTwin) {
    return res.status(400).json({ message: 'Repository URL or Twin context is required.' });
  }

  try {
    const deployment = await createPreviewDeployment({
      repository: repository || repositoryTwin?.project?.fullName || 'sanjaycoder48/codeNest',
      repositoryTwin,
      environmentVars
    });

    deployments.set(deployment.id, { ...deployment, repositoryTwin });
    res.status(202).json(deployment);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to trigger preview deployment.' });
  }
});

router.get('/status/:id', async (req, res) => {
  const id = req.params.id;
  const existing = deployments.get(id);

  try {
    const statusData = await getDeploymentStatus(id, existing?.repositoryTwin);
    if (existing) {
      deployments.set(id, { ...existing, ...statusData });
    }
    res.json(statusData);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to fetch deployment status.' });
  }
});

router.post('/promote', (req, res) => {
  const { deploymentId, userApproval } = req.body || {};
  if (!userApproval) {
    return res.status(403).json({ message: 'Explicit user approval is required to promote to production.' });
  }

  const existing = deployments.get(deploymentId);
  const prodUrl = existing?.url ? existing.url.replace(/-preview|-dpl_[a-z0-9]+/g, '') : 'https://codeNest.projecttwin.app';

  res.json({
    status: 'promoted',
    environment: 'production',
    url: prodUrl,
    promotedAt: new Date().toISOString(),
    message: 'Preview deployment promoted to production with recorded approval.'
  });
});

module.exports = router;
module.exports.__deployments = deployments;
