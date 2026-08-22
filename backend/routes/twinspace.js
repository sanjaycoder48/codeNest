const express = require('express');
const router = express.Router();
const twinspaceService = require('../services/twinspaceService');

// Get all demo accounts
router.get('/users', (req, res) => {
  res.json({ users: twinspaceService.getDemoUsers() });
});

// Get user repositories
router.get('/repositories', (req, res) => {
  res.json({ repositories: twinspaceService.getRepositories() });
});

// Simulate repository synchronization
router.post('/sync', (req, res) => {
  const { repoId } = req.body;
  const stages = [
    'Downloading repository metadata',
    'Indexing files',
    'Reading Git history',
    'Detecting dependencies',
    'Mapping components',
    'Building project relationships'
  ];
  res.json({ status: 'success', repoId, stages, ready: true });
});

// Get current TwinSpace workspace state
router.get('/state', (req, res) => {
  res.json(twinspaceService.getState());
});

// Read file content
router.get('/file', (req, res) => {
  const filePath = req.query.path;
  const state = twinspaceService.getState();
  const content = state.files[filePath];
  if (content === undefined) {
    return res.status(404).json({ message: 'File not found' });
  }
  res.json({ path: filePath, content });
});

// Save file content
router.post('/file', (req, res) => {
  const { path, content } = req.body;
  if (!path) return res.status(400).json({ message: 'Path required' });
  twinspaceService.updateFileContent(path, content);
  res.json({ status: 'success', path });
});

// Create branch
router.post('/branches', (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'Branch name required' });
  const ok = twinspaceService.createBranch(name);
  if (!ok) return res.status(400).json({ message: 'Branch already exists' });
  res.json({ status: 'success', branch: name, branches: twinspaceService.getState().branches });
});

// Switch branch
router.post('/branches/switch', (req, res) => {
  const { name } = req.body;
  const ok = twinspaceService.switchBranch(name);
  if (!ok) return res.status(404).json({ message: 'Branch not found' });
  res.json({ status: 'success', currentBranch: name });
});

// Create commit
router.post('/commit', (req, res) => {
  const { author, message, branch } = req.body;
  if (!message) return res.status(400).json({ message: 'Commit message required' });
  const commit = twinspaceService.createCommit(author || 'Rahul', message, branch);
  res.json({ status: 'success', commit });
});

// Push to GitHub
router.post('/push', (req, res) => {
  const { branch, commit } = req.body;
  res.json({
    status: 'success',
    branch: branch || twinspaceService.getState().currentBranch,
    commit: commit || 'a83f21c',
    remote: 'origin',
    message: 'Successfully pushed branch to GitHub.'
  });
});

// Get or Create Pull Request
router.get('/pull-requests', (req, res) => {
  res.json({ pullRequests: twinspaceService.getState().pullRequests });
});

router.post('/pull-requests', (req, res) => {
  const pr = twinspaceService.createPR(req.body);
  res.json({ status: 'success', pullRequest: pr });
});

router.post('/pull-requests/merge', (req, res) => {
  const { prNumber, user } = req.body;
  const ok = twinspaceService.mergePR(prNumber, user || 'Arun');
  if (!ok) return res.status(404).json({ message: 'Pull request not found' });
  res.json({ status: 'success', message: `Pull Request #${prNumber} merged cleanly into main.` });
});

// Change impact analysis
router.get('/analysis/impact', (req, res) => {
  const filePath = req.query.path || 'backend/payments/PaymentService.ts';
  res.json(twinspaceService.analyzeImpact(filePath));
});

// Duplicate code detection
router.get('/analysis/duplicates', (req, res) => {
  res.json({ duplicates: twinspaceService.detectDuplicates() });
});

// Whole Repository Code Intelligence Report
router.get('/analysis/report', (req, res) => {
  res.json(twinspaceService.getWholeRepoReport());
});

module.exports = router;
