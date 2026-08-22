const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const supertest = require('supertest');
const app = require('../app');
const {
  createInvite,
  acceptInvite,
  revokeInvite,
  createTask,
  updateTaskStatus,
  addDiscussionMessage,
  generateTeamBrief,
  verifyMemberAccess
} = require('../services/collaborationService');

describe('Persistent Collaboration Engine & Authorization Routes', () => {
  it('creates an invitation token with role and expiration', () => {
    const invite = createInvite({
      projectId: 'ShopSphere',
      inviter: 'Vikash',
      email: 'arun@example.com',
      role: 'Developer'
    });

    assert.ok(invite.token.startsWith('inv_'), 'token must start with inv_');
    assert.equal(invite.role, 'Developer');
    assert.equal(invite.email, 'arun@example.com');
    assert.equal(invite.revoked, false);
  });

  it('allows teammate to accept invite token and join project', () => {
    const invite = createInvite({ projectId: 'ShopSphere', inviter: 'Vikash', role: 'Designer' });
    const result = acceptInvite({ inviteToken: invite.token, user: { username: 'Arun', name: 'Arun Patel' } });

    assert.equal(result.member.username, 'Arun');
    assert.equal(result.member.role, 'Designer');
    assert.ok(result.project.members.some(m => m.username === 'Arun'));
  });

  it('rejects expired or revoked invite tokens', () => {
    const invite = createInvite({ projectId: 'ShopSphere', inviter: 'Vikash', expiresInHours: -1 });
    assert.throws(() => acceptInvite({ inviteToken: invite.token, user: { username: 'Late' } }), /expired/);

    const activeInvite = createInvite({ projectId: 'ShopSphere', inviter: 'Vikash' });
    revokeInvite({ projectId: 'ShopSphere', inviteId: activeInvite.id, owner: 'Vikash' });
    assert.throws(() => acceptInvite({ inviteToken: activeInvite.token, user: { username: 'Revoked' } }), /revoked/);
  });

  it('creates task and updates status', () => {
    const task = createTask({ projectId: 'ShopSphere', title: 'Setup Redis cache', assignedTo: 'Priya' });
    assert.equal(task.title, 'Setup Redis cache');
    assert.equal(task.status, 'To Do');

    const updated = updateTaskStatus({ projectId: 'ShopSphere', taskId: task.id, status: 'In Progress', user: 'Priya' });
    assert.equal(updated.status, 'In Progress');
  });

  it('posts discussion message and generates @ProjectTwin AI reply', () => {
    const result = addDiscussionMessage({
      projectId: 'ShopSphere',
      text: '@ProjectTwin summarize today’s work',
      author: 'Vikash'
    });

    assert.equal(result.userMsg.text, '@ProjectTwin summarize today’s work');
    assert.ok(result.aiMsg, 'must trigger AI reply on @ProjectTwin mention');
    assert.ok(result.aiMsg.text.includes('Project Twin Brief'));
  });

  it('generates an evidence-grounded Team Brief', () => {
    const brief = generateTeamBrief('ShopSphere');
    assert.equal(brief.projectId, 'ShopSphere');
    assert.ok(brief.membersCount >= 3);
    assert.ok(brief.summary.includes('Project Twin Brief'));
  });

  it('enforces project-level authorization for non-members', () => {
    assert.throws(() => verifyMemberAccess('ShopSphere', 'non_member_user_xyz'), /Access denied/);
  });

  it('GET /api/collaboration/members/:projectId rejects non-members', async () => {
    const res = await supertest(app)
      .get('/api/collaboration/members/ShopSphere?userId=unknown_intruder');

    assert.equal(res.status, 403);
    assert.ok(res.body.message.includes('Access denied'));
  });
});
