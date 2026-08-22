import React from 'react';
import { ShieldCheck, CheckCircle2, XCircle, Clock, AlertTriangle } from 'lucide-react';

export function ApprovalQueue({ approvals, onApproveAction, onRejectAction }) {
  return (
    <div style={{ background: '#0d1117', border: '1px solid #30363d', borderRadius: '10px', padding: '16px', marginBottom: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={16} style={{ color: '#eab308' }} />
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#f0f6fc', margin: 0 }}>Team Approval Workflow</h4>
            <span style={{ fontSize: '0.7rem', color: '#8b949e' }}>Proposed → Review → Approved → Execute</span>
          </div>
        </div>
        <span style={{ fontSize: '0.7rem', background: '#0d1117', border: '1px solid #30363d', color: '#eab308', padding: '2px 8px', borderRadius: '10px', fontWeight: '700' }}>
          {approvals.filter(a => a.status === 'Review' || a.status === 'Proposed').length} Pending
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {approvals.map(item => (
          <div key={item.id} style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: '8px', padding: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
              <div>
                <strong style={{ fontSize: '0.85rem', color: '#f0f6fc' }}>{item.title}</strong>
                <div style={{ fontSize: '0.7rem', color: '#8b949e' }}>
                  Requested by <strong>{item.requestedBy}</strong> • {item.timestamp}
                </div>
              </div>
              <span style={{
                fontSize: '0.65rem',
                fontWeight: '800',
                background: item.status === 'Approved' ? '#23863633' : '#eab30833',
                color: item.status === 'Approved' ? '#3fb950' : '#eab308',
                padding: '2px 6px',
                borderRadius: '4px',
                border: `1px solid ${item.status === 'Approved' ? '#23863666' : '#eab30866'}`
              }}>
                {item.status}
              </span>
            </div>

            <p style={{ fontSize: '0.75rem', color: '#c9d1d9', margin: '4px 0 8px 0' }}>{item.summary}</p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem', color: '#8b949e', borderTop: '1px solid #21262d', paddingTop: '8px' }}>
              <div>
                <span>Required Reviewers: </span>
                <strong style={{ color: '#c9d1d9' }}>{item.requiredReviewers?.join(', ')}</strong>
              </div>

              {item.status !== 'Approved' ? (
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => onRejectAction(item.id)}
                    style={{ background: '#da363322', border: '1px solid #da363366', color: '#f85149', borderRadius: '4px', padding: '2px 8px', fontSize: '0.7rem', cursor: 'pointer' }}
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => onApproveAction(item.id)}
                    style={{ background: '#238636', border: 'none', color: '#fff', borderRadius: '4px', padding: '2px 10px', fontSize: '0.7rem', fontWeight: '700', cursor: 'pointer' }}
                  >
                    Approve Action
                  </button>
                </div>
              ) : (
                <span style={{ color: '#3fb950', fontWeight: '700' }}>✓ Action Approved & Queued</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
