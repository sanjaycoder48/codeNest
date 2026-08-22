import React from 'react';
import { Clock, GitCommit, GitPullRequest, CheckCircle2, Rocket, Sparkles, UserPlus } from 'lucide-react';

export function ActivityTimeline({ events }) {
  const getIcon = (type) => {
    if (type === 'commit') return <GitCommit size={13} style={{ color: '#a855f7' }} />;
    if (type === 'pr') return <GitPullRequest size={13} style={{ color: '#38bdf8' }} />;
    if (type === 'task') return <CheckCircle2 size={13} style={{ color: '#3fb950' }} />;
    if (type === 'deploy') return <Rocket size={13} style={{ color: '#eab308' }} />;
    if (type === 'join') return <UserPlus size={13} style={{ color: '#ec4899' }} />;
    return <Sparkles size={13} style={{ color: '#58a6ff' }} />;
  };

  return (
    <div style={{ background: '#0d1117', border: '1px solid #30363d', borderRadius: '10px', padding: '14px', marginBottom: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <Clock size={16} style={{ color: '#58a6ff' }} />
        <div>
          <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: '#f0f6fc', margin: 0 }}>Team Activity Timeline</h4>
          <span style={{ fontSize: '0.68rem', color: '#8b949e' }}>Real-time repository & team event stream</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '10px', bottom: '10px', left: '11px', width: '1px', background: '#30363d' }} />

        {events.map(ev => (
          <div key={ev.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', position: 'relative', zIndex: 1 }}>
            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#161b22', border: '1px solid #30363d', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
              {getIcon(ev.type)}
            </div>
            <div style={{ flex: 1, background: '#161b22', border: '1px solid #21262d', borderRadius: '6px', padding: '6px 10px', fontSize: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                <strong style={{ color: '#f0f6fc' }}>{ev.actor}</strong>
                <span style={{ fontSize: '0.68rem', color: '#8b949e' }}>{ev.time}</span>
              </div>
              <div style={{ color: '#c9d1d9' }}>{ev.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
