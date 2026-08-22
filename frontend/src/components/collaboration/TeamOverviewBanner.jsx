import React from 'react';
import { Sparkles, Users, AlertCircle, CheckCircle2, Clock, Bell, UserPlus } from 'lucide-react';

export function TeamOverviewBanner({ teamMembers, stats, brief, onToggleNotifications, unreadCount, onOpenInvite }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
      {/* Top Header Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#f0f6fc', margin: 0 }}>Team Control Room</h2>
            <span style={{ fontSize: '0.7rem', background: '#1f6feb22', border: '1px solid #1f6feb66', color: '#58a6ff', padding: '2px 8px', borderRadius: '12px', fontWeight: '600' }}>
              Project Twin Collaborate
            </span>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#8b949e', margin: '2px 0 0 0' }}>
            Shared team space to track changes, assign tasks, discuss architecture, and approve deployments.
          </p>
        </div>

        {/* Right side: Team avatars, Invite & Notifications */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Team Avatars */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {teamMembers.map((m, idx) => (
              <img
                key={m.id}
                src={m.avatar}
                alt={m.name}
                title={`${m.name} (${m.role}) — ${m.status}`}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  border: '2px solid #0d1117',
                  marginLeft: idx === 0 ? 0 : '-8px',
                  objectFit: 'cover'
                }}
              />
            ))}
          </div>

          {/* Invite GitHub Collaborators Button */}
          <button
            onClick={onOpenInvite}
            style={{
              background: '#238636',
              border: 'none',
              borderRadius: '8px',
              padding: '6px 12px',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.78rem',
              fontWeight: '700'
            }}
          >
            <UserPlus size={15} />
            <span>Invite Collaborators</span>
          </button>

          {/* Quick Notification Bell */}
          <button
            onClick={onToggleNotifications}
            style={{
              position: 'relative',
              background: '#161b22',
              border: '1px solid #30363d',
              borderRadius: '8px',
              padding: '6px 10px',
              color: '#c9d1d9',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.78rem'
            }}
          >
            <Bell size={15} style={{ color: unreadCount > 0 ? '#eab308' : '#8b949e' }} />
            <span>Alerts</span>
            {unreadCount > 0 && (
              <span style={{ background: '#f85149', color: '#fff', fontSize: '0.65rem', fontWeight: '800', borderRadius: '10px', padding: '1px 5px' }}>
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Stats Metric Chips */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
        <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: '8px', padding: '10px 12px' }}>
          <div style={{ fontSize: '0.7rem', color: '#8b949e', textTransform: 'uppercase' }}>Active Tasks</div>
          <strong style={{ fontSize: '1.1rem', color: '#58a6ff' }}>{stats.activeTasks} Tasks</strong>
        </div>
        <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: '8px', padding: '10px 12px' }}>
          <div style={{ fontSize: '0.7rem', color: '#8b949e', textTransform: 'uppercase' }}>Blocked Tasks</div>
          <strong style={{ fontSize: '1.1rem', color: '#f85149' }}>{stats.blockedTasks} Blocked</strong>
        </div>
        <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: '8px', padding: '10px 12px' }}>
          <div style={{ fontSize: '0.7rem', color: '#8b949e', textTransform: 'uppercase' }}>Pending Reviews</div>
          <strong style={{ fontSize: '1.1rem', color: '#eab308' }}>{stats.pendingReviews} Pending</strong>
        </div>
        <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: '8px', padding: '10px 12px' }}>
          <div style={{ fontSize: '0.7rem', color: '#8b949e', textTransform: 'uppercase' }}>Repo Changes</div>
          <strong style={{ fontSize: '1.1rem', color: '#a855f7' }}>{stats.recentChanges} Commits</strong>
        </div>
        <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: '8px', padding: '10px 12px' }}>
          <div style={{ fontSize: '0.7rem', color: '#8b949e', textTransform: 'uppercase' }}>Deployment</div>
          <strong style={{ fontSize: '1.1rem', color: stats.deploymentStatus === 'Healthy' ? '#3fb950' : '#e3b341' }}>
            {stats.deploymentStatus}
          </strong>
        </div>
      </div>

      {/* AI Team Brief Box */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(168, 85, 247, 0.12) 100%)',
        border: '1px solid rgba(168, 85, 247, 0.3)',
        borderRadius: '10px',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px'
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
          display: 'grid',
          placeItems: 'center',
          color: '#fff',
          flexShrink: 0
        }}>
          <Sparkles size={16} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
            <strong style={{ fontSize: '0.82rem', color: '#f0f6fc' }}>Today’s AI Team Brief</strong>
            <span style={{ fontSize: '0.65rem', color: '#a855f7', fontWeight: '700' }}>Updated 12 mins ago</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#c9d1d9', margin: 0, lineHeight: '1.4' }}>
            &quot;{brief}&quot;
          </p>
        </div>
      </div>
    </div>
  );
}
