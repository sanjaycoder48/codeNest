const crypto = require('crypto');

// Initial in-memory collaboration store for projects
const projectsStore = new Map();

function getOrCreateProjectState(projectId) {
  if (!projectsStore.has(projectId)) {
    projectsStore.set(projectId, {
      id: projectId,
      ownerId: 'usr_vikash',
      members: [
        { id: 'usr_vikash', username: 'Vikash', name: 'Vikash L', role: 'Owner', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces', status: 'active' },
        { id: 'usr_priya', username: 'Priya', name: 'Priya Sharma', role: 'Developer', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces', status: 'active' },
        { id: 'usr_rahul', username: 'Rahul', name: 'Rahul Verma', role: 'Developer', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces', status: 'active' }
      ],
      invites: [],
      tasks: [
        { id: 'TASK-42', title: 'Add payment validation & duplicate code cleanup', assignedTo: 'Rahul', status: 'In Progress', priority: 'High', createdAt: new Date().toISOString() },
        { id: 'TASK-43', title: 'Implement JWT refresh token rotation', assignedTo: 'Priya', status: 'In Progress', priority: 'Medium', createdAt: new Date().toISOString() },
        { id: 'TASK-44', title: 'Optimize SQL index on orders table', assignedTo: 'Vikash', status: 'Completed', priority: 'Low', createdAt: new Date().toISOString() }
      ],
      discussions: [
        { id: 'msg_1', author: 'Priya', text: 'Pushed feature branch for authentication tests. Ready for review.', timestamp: '1 hour ago' },
        { id: 'msg_2', author: 'Rahul', text: '@ProjectTwin can you summarize today’s progress?', timestamp: '30 minutes ago' },
        { id: 'msg_3', author: 'ProjectTwin', text: '✦ Project Twin Brief: 3 active tasks (1 completed, 2 in progress). Change impact risk is MEDIUM across payment & auth services.', timestamp: '29 minutes ago', isAI: true }
      ],
      activities: [
        { id: 'act_1', user: 'Rahul', action: 'updated task status', target: 'TASK-42', timestamp: '15 mins ago' },
        { id: 'act_2', user: 'Priya', action: 'posted in discussion thread', target: 'feature/auth', timestamp: '1 hour ago' }
      ]
    });
  }
  return projectsStore.get(projectId);
}

function verifyMemberAccess(projectId, userId) {
  const project = getOrCreateProjectState(projectId);
  if (!userId) return project;
  const isMember = project.members.some(m => m.id === userId || m.username.toLowerCase() === String(userId).toLowerCase());
  if (!isMember) {
    const error = new Error('Access denied. You are not a member of this project.');
    error.statusCode = 403;
    throw error;
  }
  return project;
}

function createInvite({ projectId, inviter, email, role = 'Developer', expiresInHours = 168 }) {
  const project = getOrCreateProjectState(projectId);
  const token = 'inv_' + crypto.randomBytes(12).toString('hex');
  const expiresAt = new Date(Date.now() + expiresInHours * 3600 * 1000).toISOString();

  const newInvite = {
    id: 'inv_id_' + crypto.randomBytes(4).toString('hex'),
    token,
    projectId,
    email: email ? String(email).toLowerCase() : null,
    role,
    inviter: inviter || 'Owner',
    expiresAt,
    revoked: false,
    createdAt: new Date().toISOString()
  };

  project.invites.push(newInvite);
  project.activities.unshift({
    id: 'act_' + Date.now(),
    user: inviter || 'Owner',
    action: `created ${role} invite ${email ? `for ${email}` : 'link'}`,
    target: project.id,
    timestamp: 'Just now'
  });

  return newInvite;
}

function acceptInvite({ inviteToken, user }) {
  let matchedProject = null;
  let matchedInvite = null;

  for (const project of projectsStore.values()) {
    const inv = project.invites.find(i => i.token === inviteToken);
    if (inv) {
      matchedProject = project;
      matchedInvite = inv;
      break;
    }
  }

  if (!matchedInvite || !matchedProject) {
    throw new Error('Invalid or non-existent invitation token.');
  }

  if (matchedInvite.revoked) {
    throw new Error('This invitation token has been revoked by the project owner.');
  }

  if (new Date(matchedInvite.expiresAt).getTime() < Date.now()) {
    throw new Error('This invitation token has expired.');
  }

  const username = user?.username || user?.name || 'Teammate';
  const userId = user?.id || 'usr_' + username.toLowerCase().replace(/[^a-z0-9]/g, '');

  const existingMember = matchedProject.members.find(m => m.id === userId || m.username.toLowerCase() === username.toLowerCase());
  if (existingMember) {
    return { member: existingMember, project: matchedProject, alreadyMember: true };
  }

  const newMember = {
    id: userId,
    username,
    name: user?.name || username,
    role: matchedInvite.role || 'Developer',
    avatar: user?.avatar || `https://avatars.githubusercontent.com/u/583231?v=4`,
    status: 'active'
  };

  matchedProject.members.push(newMember);
  matchedProject.activities.unshift({
    id: 'act_' + Date.now(),
    user: username,
    action: `joined project as ${newMember.role}`,
    target: matchedProject.id,
    timestamp: 'Just now'
  });

  return { member: newMember, project: matchedProject, alreadyMember: false };
}

function revokeInvite({ projectId, inviteId, owner }) {
  const project = getOrCreateProjectState(projectId);
  const invite = project.invites.find(i => i.id === inviteId || i.token === inviteId);
  if (!invite) throw new Error('Invite not found.');

  invite.revoked = true;
  project.activities.unshift({
    id: 'act_' + Date.now(),
    user: owner || 'Owner',
    action: 'revoked invitation token',
    target: invite.id,
    timestamp: 'Just now'
  });

  return invite;
}

function createTask({ projectId, title, assignedTo, priority = 'Medium', author = 'Owner' }) {
  const project = getOrCreateProjectState(projectId);
  const taskId = 'TASK-' + (project.tasks.length + 45);

  const newTask = {
    id: taskId,
    title,
    assignedTo: assignedTo || author,
    status: 'To Do',
    priority,
    createdAt: new Date().toISOString()
  };

  project.tasks.unshift(newTask);
  project.activities.unshift({
    id: 'act_' + Date.now(),
    user: author,
    action: `created task ${taskId}`,
    target: title,
    timestamp: 'Just now'
  });

  return newTask;
}

function updateTaskStatus({ projectId, taskId, status, user = 'Teammate' }) {
  const project = getOrCreateProjectState(projectId);
  const task = project.tasks.find(t => t.id === taskId);
  if (!task) throw new Error('Task not found.');

  task.status = status;
  project.activities.unshift({
    id: 'act_' + Date.now(),
    user,
    action: `updated ${taskId} to ${status}`,
    target: task.title,
    timestamp: 'Just now'
  });

  return task;
}

function addDiscussionMessage({ projectId, text, author = 'Teammate', repositoryTwin = null }) {
  const project = getOrCreateProjectState(projectId);
  const userMsg = {
    id: 'msg_' + Date.now(),
    author,
    text,
    timestamp: 'Just now'
  };

  project.discussions.push(userMsg);

  // If text mentions @ProjectTwin or asks for brief, generate AI reply
  if (text.includes('@ProjectTwin') || text.toLowerCase().includes('summarize') || text.toLowerCase().includes('brief')) {
    const inProgressCount = project.tasks.filter(t => t.status === 'In Progress').length;
    const completedCount = project.tasks.filter(t => t.status === 'Completed').length;
    const readinessScore = repositoryTwin?.readiness?.score || 85;

    const aiMsg = {
      id: 'msg_ai_' + Date.now(),
      author: 'ProjectTwin',
      text: `✦ Project Twin Brief: ${project.members.length} team members active. ${project.tasks.length} tasks tracked (${completedCount} completed, ${inProgressCount} in progress). Repository readiness score is ${readinessScore}/100.`,
      timestamp: 'Just now',
      isAI: true
    };

    project.discussions.push(aiMsg);
    return { userMsg, aiMsg };
  }

  return { userMsg };
}

function generateTeamBrief(projectId, repositoryTwin = null) {
  const project = getOrCreateProjectState(projectId);
  const inProgress = project.tasks.filter(t => t.status === 'In Progress');
  const completed = project.tasks.filter(t => t.status === 'Completed');
  const score = repositoryTwin?.readiness?.score || 85;

  return {
    projectId,
    membersCount: project.members.length,
    activeTasks: project.tasks.length,
    inProgressCount: inProgress.length,
    completedCount: completed.length,
    readinessScore: score,
    summary: `✦ Project Twin Brief: Team of ${project.members.length} working on ${project.id}. ${completed.length} tasks completed, ${inProgress.length} in progress. Readiness score ${score}/100.`,
    generatedAt: new Date().toISOString()
  };
}

module.exports = {
  getOrCreateProjectState,
  verifyMemberAccess,
  createInvite,
  acceptInvite,
  revokeInvite,
  createTask,
  updateTaskStatus,
  addDiscussionMessage,
  generateTeamBrief
};
