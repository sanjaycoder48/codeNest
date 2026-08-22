import React from 'react';
import { GitCommit, ExternalLink, ShieldCheck, AlertTriangle, CheckCircle2, MessageSquare, ThumbsUp } from 'lucide-react';

export function ChangeSummaryCard({ change, onDiscuss, onApprove }) {
  return (
    <div style={{ background: '#0d1117', border: '1px solid #30363d', borderRadius: '10px', padding: '14px', marginBottom: '14px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <GitCommit size={16} style={{ color: '#a855f7' }} />
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: '#f0f6fc', margin: 0 }}>{change.title}</h4>
            <span style={{ fontSize: '0.7rem', color: '#8b949e' }}>
              Author: <strong>{change.author}</strong> • Commit <code>{change.commitHash}</code> • {change.timeAgo}
            </span>
          </div>
        </div>
        <span style={{
          fontSize: '0.65rem',
          fontWeight: '800',
          background: change.risk === 'High' ? '#da363333' : change.risk === 'Medium' ? '#eab30833' : '#23863633',
          color: change.risk === 'High' ? '#f85149' : change.risk === 'Medium' ? '#eab308' : '#3fb950',
          padding: '2px 8px',
          borderRadius: '4px',
          border: `1px solid ${change.risk === 'High' ? '#da363366' : change.risk === 'Medium' ? '#eab30866' : '#23863666'}`
        }}>
          Risk: {change.risk}
        </span>
      </div>

      {/* Changes & Affected lists */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', margin: '10px 0', fontSize: '0.75rem' }}>
        <div style={{ background: '#161b22', borderRadius: '6px', padding: '8px' }}>
          <strong style={{ color: '#8b949e', display: 'block', marginBottom: '4px', fontSize: '0.68rem', textTransform: 'uppercase' }}>What Changed</strong>
          <ul style={{ margin: 0, paddingLeft: '14px', color: '#c9d1d9' }}>
            {change.changesList?.map((item, idx) => <li key={idx}>{item}</li>)}
          </ul>
        </div>

        <div style={{ background: '#161b22', borderRadius: '6px', padding: '8px' }}>
          <strong style={{ color: '#8b949e', display: 'block', marginBottom: '4px', fontSize: '0.68rem', textTransform: 'uppercase' }}>Affected Modules</strong>
          <ul style={{ margin: 0, paddingLeft: '14px', color: '#58a6ff' }}>
            {change.affectedList?.map((item, idx) => <li key={idx}><code>{item}</code></li>)}
          </ul>
        </div>
      </div>

      {/* Recommended Tests */}
      <div style={{ background: '#161b22', borderRadius: '6px', padding: '6px 10px', fontSize: '0.72rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ color: '#8b949e', fontWeight: '700' }}>Testing Recommended:</span>
        <span style={{ color: '#38bdf8' }}>{change.recommendedTests?.join(', ')}</span>
      </div>

      {/* Footer Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #21262d', paddingTop: '8px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => onDiscuss(change)}
            style={{ background: '#21262d', border: '1px solid #30363d', color: '#c9d1d9', borderRadius: '6px', padding: '4px 10px', fontSize: '0.72rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <MessageSquare size={12} /> Discuss
          </button>
          <button
            onClick={() => onApprove(change)}
            style={{ background: '#1f6feb22', border: '1px solid #1f6feb66', color: '#58a6ff', borderRadius: '6px', padding: '4px 10px', fontSize: '0.72rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <ThumbsUp size={12} /> Approve
          </button>
        </div>

        <a
          href={`https://github.com/${change.repo || 'sanjaycoder48/codeNest'}/commit/${change.commitHash || 'main'}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#8b949e', fontSize: '0.72rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          <span>View on GitHub</span>
          <ExternalLink size={12} />
        </a>
      </div>
    </div>
  );
}
