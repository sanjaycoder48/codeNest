const express = require('express');
const {
  getOrCreateProjectState,
  verifyMemberAccess,
  createInvite,
  acceptInvite,
  revokeInvite,
  createTask,
  updateTaskStatus,
  addDiscussionMessage,
  generateTeamBrief
} = require('../services/collaborationService');

const router = express.Router();

// GET project members
router.get('/members/:projectId', (req, res) => {
  const { projectId } = req.params;
  const userId = req.query.userId;
  try {
    const project = verifyMemberAccess(projectId, userId);
    res.json({ members: project.members, invites: project.invites });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
});

// Create invitation
router.post('/invite', (req, res) => {
  const { projectId = 'ShopSphere', inviter = 'Vikash', email, role = 'Developer', expiresInHours = 168 } = req.body || {};
  try {
    const invite = createInvite({ projectId, inviter, email, role, expiresInHours });
    res.status(201).json(invite);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Accept invitation
router.post('/accept', (req, res) => {
  const { inviteToken, user } = req.body || {};
  if (!inviteToken) {
    return res.status(400).json({ message: 'Invitation token is required.' });
  }

  try {
    const result = acceptInvite({ inviteToken, user });
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Revoke invitation
router.post('/revoke', (req, res) => {
  const { projectId = 'ShopSphere', inviteId, owner = 'Vikash' } = req.body || {};
  try {
    const invite = revokeInvite({ projectId, inviteId, owner });
    res.json(invite);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Create task
router.post('/tasks', (req, res) => {
  const { projectId = 'ShopSphere', title, assignedTo, priority = 'Medium', author = 'Vikash' } = req.body || {};
  if (!title) return res.status(400).json({ message: 'Task title is required.' });

  try {
    const task = createTask({ projectId, title, assignedTo, priority, author });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update task status
router.patch('/tasks/:taskId', (req, res) => {
  const { taskId } = req.params;
  const { projectId = 'ShopSphere', status, user = 'Vikash' } = req.body || {};
  try {
    const task = updateTaskStatus({ projectId, taskId, status, user });
    res.json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Add discussion message
router.post('/discussions', (req, res) => {
  const { projectId = 'ShopSphere', text, author = 'Vikash', repositoryTwin } = req.body || {};
  if (!text) return res.status(400).json({ message: 'Message text is required.' });

  try {
    const result = addDiscussionMessage({ projectId, text, author, repositoryTwin });
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET activity feed
router.get('/activity/:projectId', (req, res) => {
  const { projectId } = req.params;
  const userId = req.query.userId;
  try {
    const project = verifyMemberAccess(projectId, userId);
    res.json({ activities: project.activities });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
});

// GET AI Team Brief
router.get('/brief/:projectId', (req, res) => {
  const { projectId } = req.params;
  const userId = req.query.userId;
  try {
    verifyMemberAccess(projectId, userId);
    const brief = generateTeamBrief(projectId);
    res.json(brief);
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
});

module.exports = router;
