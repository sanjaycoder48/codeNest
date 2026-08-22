import React, { useState } from 'react';
import { TeamOverviewBanner } from './TeamOverviewBanner';
import { KanbanBoard } from './KanbanBoard';
import { AIStandup } from './AIStandup';
import { ChangeSummaryCard } from './ChangeSummaryCard';
import { DiscussionsThread } from './DiscussionsThread';
import { ApprovalQueue } from './ApprovalQueue';
import { ActivityTimeline } from './ActivityTimeline';
import { AICollabAssistant } from './AICollabAssistant';
import { InviteCollaboratorsModal } from './InviteCollaboratorsModal';
import { LayoutGrid, MessageSquare, ShieldCheck, Sparkles, X } from 'lucide-react';

export function CollaborationWorkspace({ twin, currentUser }) {
  const [activeSubTab, setActiveSubTab] = useState('board'); // 'board' | 'discussions'
  const [showNotifications, setShowNotifications] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);

  const [teamMembers] = useState([
    { id: 'usr_1', name: 'Sanjay', role: 'Full-Stack Developer', avatar: 'https://avatars.githubusercontent.com/u/583231?v=4', status: 'Online' },
    { id: 'usr_2', name: 'Rahul', role: 'Payment Systems Lead', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', status: 'Online' },
    { id: 'usr_3', name: 'Priya', role: 'Security Specialist', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', status: 'Online' },
    { id: 'usr_4', name: 'Arun', role: 'Tech Lead', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', status: 'Online' }
  ]);

  const [notifications] = useState([
    { id: 'n1', title: 'You were mentioned by Arun', body: '@Sanjay can you verify this API change before deployment?', read: false, time: '10 mins ago' },
    { id: 'n2', title: 'Review Requested', body: 'AuthService.ts refactoring requires approval', read: false, time: '25 mins ago' }
  ]);

  const [tasks, setTasks] = useState([
    { id: 'TASK-42', title: 'Payment validation & duplicate code cleanup', description: 'Refactor duplicated validation logic in PaymentValidator into shared module.', assignee: 'Rahul', priority: 'High', status: 'In Progress', dueDate: 'Aug 24', relatedFeature: 'Payments', githubIssue: '#42', commentsCount: 3, aiContext: 'Affects PaymentService and 3 API endpoints.' },
    { id: 'TASK-43', title: 'JWT refresh token rotation', description: 'Rotate access tokens on client session refresh without forcing re-login.', assignee: 'Priya', priority: 'High', status: 'Review', dueDate: 'Aug 23', relatedFeature: 'Authentication', githubIssue: '#43', commentsCount: 5, aiContext: 'Modifies JWTMiddleware and auth.ts.' },
    { id: 'TASK-44', title: 'SQL index optimization on orders', description: 'Add composite index on userId and createdAt to speed up queries.', assignee: 'Sanjay', priority: 'Medium', status: 'Done', dueDate: 'Aug 20', relatedFeature: 'Database', githubIssue: '#39', commentsCount: 1, aiContext: 'Indexed schema.sql primary keys.' }
  ]);

  const [changes] = useState([
    {
      id: 'chg_1',
      title: 'Authentication & Session Refresh Updated',
      author: 'Priya',
      commitHash: 'a83f21c',
      timeAgo: '15 mins ago',
      risk: 'Low',
      changesList: ['Refresh token rotation added', 'Login service updated', 'Auth API modified'],
      affectedList: ['frontend/auth', 'backend/routes/auth.js', 'User session management'],
      recommendedTests: ['Login', 'Token refresh', 'Logout'],
      repo: 'sanjaycoder48/codeNest'
    }
  ]);

  const [approvals, setApprovals] = useState([
    {
      id: 'app_1',
      title: 'Apply AI Refactoring on PaymentValidator.ts',
      requestedBy: 'Rahul',
      requiredReviewers: ['Arun (Tech Lead)', 'Priya'],
      status: 'Proposed',
      summary: 'Extract shared parameter validation logic into PaymentValidationService.ts to eliminate 87% duplicate code.',
      timestamp: 'Today, 14:20'
    }
  ]);

  const [discussions, setDiscussions] = useState([
    { id: 'd1', user: 'Arun', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', message: '@Sanjay can you verify this API change before deployment?', timestamp: '10 mins ago' },
    { id: 'd2', user: 'Priya', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', message: 'JWT refresh token rotation passes integration tests. Ready for review.', timestamp: '20 mins ago' }
  ]);

  const [events] = useState([
    { id: 'ev1', type: 'commit', actor: 'Sanjay', description: 'Pushed authentication refresh update to feature/authentication branch', time: '09:42' },
    { id: 'ev2', type: 'ai', actor: 'Project Twin', description: 'Analyzed repository changes and updated launch readiness score to 86/100', time: '10:05' },
    { id: 'ev3', type: 'task', actor: 'Rahul', description: 'Moved Login Testing task to Review stage', time: '10:10' }
  ]);

  const handleMoveTask = (taskId, newStatus) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  const handleCreateTask = (newTask) => {
    setTasks(prev => [newTask, ...prev]);
  };

  const handleApproveAction = (approvalId) => {
    setApprovals(prev => prev.map(a => a.id === approvalId ? { ...a, status: 'Approved' } : a));
  };

  const handleRejectAction = (approvalId) => {
    setApprovals(prev => prev.filter(a => a.id !== approvalId));
  };

  const handleAddComment = (newComment) => {
    setDiscussions(prev => [...prev, newComment]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div style={{ padding: '16px 0', color: '#c9d1d9', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Top Banner Overview */}
      <TeamOverviewBanner
        teamMembers={teamMembers}
        stats={{
          activeTasks: tasks.filter(t => t.status === 'In Progress').length,
          blockedTasks: tasks.filter(t => t.priority === 'High' && t.status !== 'Done').length,
          pendingReviews: tasks.filter(t => t.status === 'Review').length,
          recentChanges: 3,
          deploymentStatus: 'Healthy'
        }}
        brief="3 important changes detected today. Authentication was updated with token rotation, and 2 pending reviews are awaiting team sign-off."
        onToggleNotifications={() => setShowNotifications(!showNotifications)}
        unreadCount={unreadCount}
        onOpenInvite={() => setShowInviteModal(true)}
      />

      <InviteCollaboratorsModal
        open={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        repoName={twin?.project?.fullName || 'sanjaycoder48/codeNest'}
      />

      {/* Notifications Drawer */}
      {showNotifications && (
        <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <strong style={{ fontSize: '0.82rem', color: '#f0f6fc' }}>Team Notifications</strong>
            <button onClick={() => setShowNotifications(false)} style={{ background: 'transparent', border: 'none', color: '#8b949e', cursor: 'pointer' }}><X size={15} /></button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {notifications.map(n => (
              <div key={n.id} style={{ background: '#0d1117', border: '1px solid #30363d', borderRadius: '6px', padding: '8px 10px', fontSize: '0.75rem' }}>
                <strong style={{ color: '#f0f6fc', display: 'block' }}>{n.title}</strong>
                <span style={{ color: '#8b949e' }}>{n.body}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-Navigation Selector (Simple & Clean) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #21262d', paddingBottom: '10px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setActiveSubTab('board')}
            style={{
              background: activeSubTab === 'board' ? '#1f6feb22' : 'transparent',
              border: `1px solid ${activeSubTab === 'board' ? '#1f6feb66' : 'transparent'}`,
              color: activeSubTab === 'board' ? '#58a6ff' : '#8b949e',
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '0.82rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <LayoutGrid size={15} /> Task Board & Changes
          </button>
          <button
            onClick={() => setActiveSubTab('discussions')}
            style={{
              background: activeSubTab === 'discussions' ? '#1f6feb22' : 'transparent',
              border: `1px solid ${activeSubTab === 'discussions' ? '#1f6feb66' : 'transparent'}`,
              color: activeSubTab === 'discussions' ? '#58a6ff' : '#8b949e',
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '0.82rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <MessageSquare size={15} /> Discussions & Stand-up
          </button>
        </div>

        <span style={{ fontSize: '0.72rem', color: '#8b949e' }}>
          Team Control Room • Simple & Fast
        </span>
      </div>

      {/* View 1: Task Board & Changes */}
      {activeSubTab === 'board' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <KanbanBoard
            tasks={tasks}
            onMoveTask={handleMoveTask}
            onCreateTask={handleCreateTask}
            teamMembers={teamMembers}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', alignItems: 'flex-start' }}>
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: '#f0f6fc', marginBottom: '8px' }}>Recent AI Change Summaries</h4>
              {changes.map(chg => (
                <ChangeSummaryCard
                  key={chg.id}
                  change={chg}
                  onDiscuss={() => setActiveSubTab('discussions')}
                  onApprove={(c) => setApprovals(prev => [{ id: 'app_' + Date.now(), title: `Approve Change: ${c.title}`, requestedBy: c.author, requiredReviewers: ['Arun'], status: 'Approved', summary: `Approved: ${c.changesList.join(', ')}`, timestamp: 'Just now' }, ...prev])}
                />
              ))}
            </div>

            <div>
              <ApprovalQueue
                approvals={approvals}
                onApproveAction={handleApproveAction}
                onRejectAction={handleRejectAction}
              />
            </div>
          </div>
        </div>
      )}

      {/* View 2: Discussions & Stand-up */}
      {activeSubTab === 'discussions' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '16px', alignItems: 'flex-start' }}>
          <div>
            <DiscussionsThread
              discussions={discussions}
              onAddComment={handleAddComment}
              currentUser={currentUser}
            />

            <AICollabAssistant twin={twin} />
          </div>

          <div>
            <AIStandup />
            <ActivityTimeline events={events} />
          </div>
        </div>
      )}
    </div>
  );
}
