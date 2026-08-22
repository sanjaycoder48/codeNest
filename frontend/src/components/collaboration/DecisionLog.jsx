import React, { useState } from 'react';
import { BookOpen, Plus, CheckCircle2, Sparkles } from 'lucide-react';

export function DecisionLog({ initialDecisions }) {
  const [decisions, setDecisions] = useState(initialDecisions || [
    {
      id: 'adr-1',
      title: 'Use PostgreSQL instead of MongoDB for payment ledger',
      reason: 'Strict ACID transactions and typed schema constraints match financial ledger rules better.',
      createdBy: 'Arun & Rahul',
      status: 'Accepted',
      date: '22 Aug 2026'
    },
    {
      id: 'adr-2',
      title: 'Centralize parameter validation in ValidationService',
      reason: 'Eliminates structural code duplication across OrderValidator and PaymentValidator.',
      createdBy: 'Team',
      status: 'Accepted',
      date: '21 Aug 2026'
    }
  ]);

  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState('');
  const [reason, setReason] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (title.trim()) {
      setDecisions(prev => [
        {
          id: 'adr-' + Date.now(),
          title: title.trim(),
          reason: reason.trim() || 'Recorded during team architectural review.',
          createdBy: 'Sanjay',
          status: 'Accepted',
          date: 'Today'
        },
        ...prev
      ]);
      setTitle('');
      setReason('');
      setShowAdd(false);
    }
  };

  return (
    <div style={{ background: '#0d1117', border: '1px solid #30363d', borderRadius: '10px', padding: '16px', marginBottom: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BookOpen size={16} style={{ color: '#38bdf8' }} />
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#f0f6fc', margin: 0 }}>Project Architectural Decision Log (ADRs)</h4>
            <span style={{ fontSize: '0.7rem', color: '#8b949e' }}>Lightweight record of technical & architectural decisions</span>
          </div>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          style={{ background: '#161b22', border: '1px solid #30363d', color: '#58a6ff', borderRadius: '6px', padding: '4px 10px', fontSize: '0.72rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          <Plus size={12} /> Log Decision
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {decisions.map(item => (
          <div key={item.id} style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: '8px', padding: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
              <strong style={{ fontSize: '0.85rem', color: '#f0f6fc' }}>{item.title}</strong>
              <span style={{ fontSize: '0.65rem', background: '#23863622', color: '#3fb950', border: '1px solid #23863644', padding: '1px 6px', borderRadius: '4px', fontWeight: '700' }}>
                {item.status}
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#c9d1d9', margin: '4px 0 8px 0', lineHeight: '1.4' }}>
              <strong>Reason:</strong> {item.reason}
            </p>
            <div style={{ fontSize: '0.7rem', color: '#8b949e' }}>
              Logged by <strong>{item.createdBy}</strong> • {item.date}
            </div>
          </div>
        ))}
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} style={{ marginTop: '12px', background: '#161b22', border: '1px solid #30363d', borderRadius: '8px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <input
            type="text"
            placeholder="Decision Title (e.g. Adopt Redis for token revocation list)..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ background: '#0d1117', border: '1px solid #30363d', color: '#f0f6fc', padding: '6px 10px', borderRadius: '4px', fontSize: '0.8rem', outline: 'none' }}
            required
          />
          <textarea
            placeholder="Reason & technical rationale..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            style={{ background: '#0d1117', border: '1px solid #30363d', color: '#f0f6fc', padding: '6px 10px', borderRadius: '4px', fontSize: '0.8rem', outline: 'none', height: '50px' }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
            <button type="button" onClick={() => setShowAdd(false)} style={{ background: '#21262d', border: '1px solid #30363d', color: '#c9d1d9', padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem' }}>Cancel</button>
            <button type="submit" style={{ background: '#238636', border: 'none', color: '#fff', padding: '4px 12px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '700' }}>Save Decision</button>
          </div>
        </form>
      )}
    </div>
  );
}
