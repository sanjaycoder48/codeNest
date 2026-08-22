import React, { useState } from 'react';
import { Bot, RefreshCw, CheckCircle2, AlertTriangle, Clock, ArrowRight } from 'lucide-react';

export function AIStandup({ initialData }) {
  const [standup, setStandup] = useState(initialData || {
    yesterday: [
      'Authentication service updated with refresh token rotation',
      'Profile & account switcher UI completed'
    ],
    today: [
      'Collaborate Workspace control room in progress',
      'Deployment configuration testing on preview environment'
    ],
    blocked: [
      'Production deployment waiting for "API_URL" environment variable'
    ],
    needsAttention: [
      'One dependency security upgrade requires team sign-off'
    ]
  });

  const [loading, setLoading] = useState(false);

  const handleRegenerate = () => {
    setLoading(true);
    setTimeout(() => {
      setStandup({
        yesterday: [
          'Payment service validation guards committed',
          'JWT refresh token endpoint tested'
        ],
        today: [
          'Team discussions and approval queue live',
          'Database schema relationship indexing'
        ],
        blocked: [
          'Production preview environment configuration missing API_URL'
        ],
        needsAttention: [
          'AuthService.ts functional duplication requires refactoring sign-off'
        ]
      });
      setLoading(false);
    }, 600);
  };

  return (
    <div style={{ background: '#0d1117', border: '1px solid #30363d', borderRadius: '10px', padding: '14px', marginBottom: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', display: 'grid', placeItems: 'center', color: '#fff' }}>
            <Bot size={14} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: '#f0f6fc', margin: 0 }}>AI Project Stand-up</h4>
            <span style={{ fontSize: '0.68rem', color: '#8b949e' }}>Generated from Git commits, PRs, & tasks</span>
          </div>
        </div>
        <button
          onClick={handleRegenerate}
          disabled={loading}
          style={{
            background: '#161b22',
            border: '1px solid #30363d',
            color: '#58a6ff',
            borderRadius: '6px',
            padding: '3px 8px',
            fontSize: '0.72rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <RefreshCw size={12} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          <span>{loading ? 'Regenerating...' : 'Regenerate'}</span>
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* Yesterday */}
        <div style={{ background: '#161b22', borderRadius: '6px', padding: '8px 10px' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: '700', color: '#3fb950', textTransform: 'uppercase', marginBottom: '4px' }}>Yesterday</div>
          <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '0.75rem', color: '#c9d1d9' }}>
            {standup.yesterday.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>

        {/* Today */}
        <div style={{ background: '#161b22', borderRadius: '6px', padding: '8px 10px' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: '700', color: '#58a6ff', textTransform: 'uppercase', marginBottom: '4px' }}>Today</div>
          <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '0.75rem', color: '#c9d1d9' }}>
            {standup.today.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>

        {/* Blocked */}
        <div style={{ background: '#271c0c', border: '1px solid #74510b', borderRadius: '6px', padding: '8px 10px' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: '700', color: '#f85149', textTransform: 'uppercase', marginBottom: '4px' }}>Blocked</div>
          <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '0.75rem', color: '#e3b341' }}>
            {standup.blocked.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>

        {/* Needs Attention */}
        <div style={{ background: '#161b22', borderRadius: '6px', padding: '8px 10px' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: '700', color: '#a855f7', textTransform: 'uppercase', marginBottom: '4px' }}>Needs Attention</div>
          <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '0.75rem', color: '#c9d1d9' }}>
            {standup.needsAttention.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}
