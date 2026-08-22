import React, { useState } from 'react';
import { TeamOverviewBanner } from './TeamOverviewBanner';
import { KanbanBoard } from './KanbanBoard';
import { AIStandup } from './AIStandup';
import { ChangeSummaryCard } from './ChangeSummaryCard';
import { DiscussionsThread } from './DiscussionsThread';
import { ApprovalQueue } from './ApprovalQueue';
import { ActivityTimeline } from './ActivityTimeline';
import { DecisionLog } from './DecisionLog';
import { AICollabAssistant } from './AICollabAssistant';
import { Bell, X, Check } from 'lucide-react';

export function CollaborationWorkspace({ twin, currentUser }) {
  const [showNotifications, setShowNotifications] = useState(false);

  const [teamMembers] = useState([
    { id: 'usr_1', name: 'Sanjay', role: 'Full-Stack Developer', avatar: 'https://avatars.githubusercontent.com/u/583231?v=4', status: 'Online' },
    { id: 'usr_2', name: 'Rahul', role: 'Payment Systems Lead', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', status: 'Online' },
    { id: 'usr_3', name: 'Priya', role: 'Security & Auth Specialist', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', status: 'Online' },
    { id: 'usr_4', name: 'Arun', role: 'Tech Lead / Architect', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', status: 'Online' },
    { id: 'usr_5', name: 'Kavin', role: 'Database Engineer', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', status: 'Offline' }
  ]);

  const [notifications, setNotifications] = useState([
    { id: 'n1', title: 'You were mentioned by Arun', body: '@Sanjay can you verify this API change before deployment?', read: false, time: '10 mins ago' },
    { id: 'n2', title: 'Review Requested', body: 'AuthService.ts refactoring requires approval', read: false, time: '25 mins ago' },
    { id: 'n3', title: 'Deployment Alert', body: 'Preview deployment blocked by missing API_URL variable', read: false, time: '1 hour ago' }
  ]);

  const [tasks, setTasks] = useState([
    { id: 'TASK-42', title: 'Add payment validation & duplicate code cleanup', description: 'Refactor duplicated validation logic in PaymentValidator and OrderValidator into a shared module.', assignee: 'Rahul', priority: 'High', status: 'In Progress', dueDate: 'Aug 24', relatedFeature: 'Payments', githubIssue: '#42', commentsCount: 3, aiContext: 'Affects PaymentService and 3 API endpoints.' },
    { id: 'TASK-43', title: 'Implement JWT refresh token rotation', description: 'Rotate access tokens on client session refresh without forcing re-login.', assignee: 'Priya', priority: 'High', status: 'Review', dueDate: 'Aug 23', relatedFeature: 'Authentication', githubIssue: '#43', commentsCount: 5, aiContext: 'Modifies JWTMiddleware and auth.ts.' },
    { id: 'TASK-44', title: 'Optimize SQL index on orders table', description: 'Add composite index on userId and createdAt to speed up dashboard queries.', assignee: 'Kavin', priority: 'Medium', status: 'Done', dueDate: 'Aug 20', relatedFeature: 'Database', githubIssue: '#39', commentsCount: 1, aiContext: 'Indexed schema.sql primary keys.' },
    { id: 'TASK-45', title: 'Lost & Found item claim workflow UI', description: 'Create accessible claim form with evidence upload for lost items.', assignee: 'Sanjay', priority: 'Medium', status: 'To Do', dueDate: 'Aug 26', relatedFeature: 'Showcase', githubIssue: '#48', commentsCount: 2, aiContext: 'Linked to frontend/pages/ClaimForm.tsx.' }
  ]);

  const [changes] = useState([
    {
      id: 'chg_1',
      title: 'Authentication Updated',
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
    },
    {
      id: 'app_2',
      title: 'Configure API_URL Environment Variable for Preview Deployment',
      requestedBy: 'System AI',
      requiredReviewers: ['Sanjay'],
      status: 'Review',
      summary: 'Add missing API_URL environment variable in Render preview configuration to unblock deployment.',
      timestamp: 'Today, 15:00'
    }
  ]);

  const [discussions, setDiscussions] = useState([
    { id: 'd1', user: 'Arun', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', message: '@Sanjay can you verify this API change before deployment?', timestamp: '10 mins ago' },
    { id: 'd2', user: 'Priya', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', message: 'JWT refresh token rotation passes integration tests. Ready for review.', timestamp: '20 mins ago' }
  ]);

  const [events] = useState([
    { id: 'ev1', type: 'commit', actor: 'Sanjay', description: 'Pushed authentication refresh update to feature/authentication branch', time: '09:42' },
    { id: 'ev2', type: 'ai', actor: 'Project Twin', description: 'Analyzed repository changes and updated launch readiness score to 86/100', time: '10:05' },
    { id: 'ev3', type: 'task', actor: 'Rahul', description: 'Moved Login Testing task to Review stage', time: '10:10' },
    { id: 'ev4', type: 'deploy', actor: 'Deployment Doctor', description: 'Identified missing API_URL environment variable in preview config', time: '10:42' }
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

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div style={{ padding: '24px 0', color: '#c9d1d9' }}>
      {/* Top Banner */}
      <TeamOverviewBanner
        teamMembers={teamMembers}
        stats={{
          activeTasks: tasks.filter(t => t.status === 'In Progress').length,
          blockedTasks: tasks.filter(t => t.priority === 'High' && t.status !== 'Done').length,
          pendingReviews: tasks.filter(t => t.status === 'Review').length,
          recentChanges: 4,
          deploymentStatus: 'Blocked (API_URL)'
        }}
        brief="4 important changes detected since yesterday. Authentication updated, 3 API routes changed, and preview deployment is currently blocked by one missing environment variable."
        onToggleNotifications={() => setShowNotifications(!showNotifications)}
        unreadCount={unreadCount}
      />

      {/* Notifications Drawer Popover */}
      {showNotifications && (
        <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: '10px', padding: '14px', marginBottom: '20px', boxShadow: '0 12px 28px rgba(0,0,0,0.6)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <strong style={{ fontSize: '0.85rem', color: '#f0f6fc' }}>Team Notifications ({unreadCount} unread)</strong>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={markAllRead} style={{ background: '#21262d', border: '1px solid #30363d', color: '#58a6ff', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', cursor: 'pointer' }}>Mark all read</button>
              <button onClick={() => setShowNotifications(false)} style={{ background: 'transparent', border: 'none', color: '#8b949e', cursor: 'pointer' }}><X size={16} /></button>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {notifications.map(n => (
              <div key={n.id} style={{ background: n.read ? '#0d1117' : '#1f6feb1a', border: '1px solid #30363d', borderRadius: '6px', padding: '8px 10px', fontSize: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#f0f6fc', fontWeight: '700' }}>
                  <span>{n.title}</span>
                  <span style={{ fontSize: '0.65rem', color: '#8b949e' }}>{n.time}</span>
                </div>
                <div style={{ color: '#c9d1d9', marginTop: '2px' }}>{n.body}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Grid: Left Column (Tasks & Changes) vs Right Column (Standup & Activity) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '20px', alignItems: 'flex-start' }}>
        {/* Main Left Column */}
        <div>
          {/* Kanban Board */}
          <KanbanBoard
            tasks={tasks}
            onMoveTask={handleMoveTask}
            onCreateTask={handleCreateTask}
            teamMembers={teamMembers}
          />

          {/* AI Change Summary */}
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#f0f6fc', marginBottom: '10px' }}>AI Human-Readable Change Summaries</h3>
            {changes.map(chg => (
              <ChangeSummaryCard
                key={chg.id}
                change={chg}
                onDiscuss={(c) => setDiscussions(prev => [...prev, { id: 'd_' + Date.now(), user: currentUser?.name || 'Sanjay', avatar: 'https://avatars.githubusercontent.com/u/583231?v=4', message: `@Arun discussion started on commit ${c.commitHash}: ${c.title}`, timestamp: 'Just now' }])}
                onApprove={(c) => setApprovals(prev => [{ id: 'app_' + Date.now(), title: `Approve Change: ${c.title}`, requestedBy: c.author, requiredReviewers: ['Arun'], status: 'Approved', summary: `Change approved for deployment: ${c.changesList.join(', ')}`, timestamp: 'Just now' }, ...prev])}
              />
            ))}
          </div>

          {/* Approval Queue */}
          <ApprovalQueue
            approvals={approvals}
            onApproveAction={handleApproveAction}
            onRejectAction={handleRejectAction}
          />
        </div>

        {/* Main Right Column */}
        <div>
          {/* AI Collaboration Assistant */}
          <AICollabAssistant twin={twin} />

          {/* AI Daily Standup */}
          <AIStandup />

          {/* Team Activity Timeline */}
          <ActivityTimeline events={events} />
        </div>
      </div>

      {/* Bottom Row: Discussions & Decision Log */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '10px' }}>
        <DiscussionsThread
          discussions={discussions}
          onAddComment={handleAddComment}
          currentUser={currentUser}
        />
        <DecisionLog />
      </div>
    </div>
  );
}
