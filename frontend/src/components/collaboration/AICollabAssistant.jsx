import React, { useState } from 'react';
import { Bot, Send, Sparkles, MessageSquare } from 'lucide-react';

export function AICollabAssistant({ twin }) {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');

  const sampleQuestions = [
    'What changed today?',
    'What is blocking deployment?',
    'Who is working on authentication?',
    'Summarize this week’s progress'
  ];

  const handleAsk = (qText) => {
    const q = qText || query;
    if (!q.trim()) return;

    setQuery(q);

    if (q.toLowerCase().includes('blocking') || q.toLowerCase().includes('deploy')) {
      setAnswer('Deployment to preview environment is blocked by missing environment variable "API_URL" in Render config.');
    } else if (q.toLowerCase().includes('changed') || q.toLowerCase().includes('today')) {
      setAnswer('4 important repository changes detected today: Authentication updated with refresh tokens, 3 API routes modified, and payment validation logic reinforced.');
    } else if (q.toLowerCase().includes('authentication') || q.toLowerCase().includes('who')) {
      setAnswer('Sanjay is currently working on Authentication Refresh task (Review stage). Priya & Arun reviewed the JWT rotation implementation.');
    } else {
      setAnswer(`Project Twin Team Intel for "${q}": The repository is scoring ${twin?.readiness?.score || 86}/100 with 3 active tasks, 1 blocked release, and 2 pending approvals.`);
    }
  };

  return (
    <div style={{ background: '#0d1117', border: '1px solid #30363d', borderRadius: '10px', padding: '14px', marginBottom: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
        <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', display: 'grid', placeItems: 'center', color: '#fff' }}>
          <Bot size={14} />
        </div>
        <div>
          <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: '#f0f6fc', margin: 0 }}>AI Team Collaboration Assistant</h4>
          <span style={{ fontSize: '0.68rem', color: '#8b949e' }}>Ask grounded questions about your team & repository state</span>
        </div>
      </div>

      {/* Quick Chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
        {sampleQuestions.map((q, i) => (
          <button
            key={i}
            onClick={() => handleAsk(q)}
            style={{
              background: '#161b22',
              border: '1px solid #30363d',
              color: '#58a6ff',
              borderRadius: '12px',
              padding: '3px 9px',
              fontSize: '0.7rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Answer Box */}
      {answer && (
        <div style={{ background: '#161b22', border: '1px solid #1f6feb44', borderRadius: '8px', padding: '10px 12px', fontSize: '0.78rem', color: '#f0f6fc', marginBottom: '10px', lineHeight: '1.4' }}>
          <strong style={{ color: '#38bdf8', display: 'block', marginBottom: '2px', fontSize: '0.7rem' }}>PROJECT TWIN ANSWER:</strong>
          {answer}
        </div>
      )}

      {/* Input */}
      <form onSubmit={(e) => { e.preventDefault(); handleAsk(); }} style={{ display: 'flex', gap: '6px' }}>
        <input
          type="text"
          placeholder="Ask Project Twin about your team..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ flex: 1, background: '#161b22', border: '1px solid #30363d', color: '#f0f6fc', padding: '7px 10px', borderRadius: '6px', fontSize: '0.78rem', outline: 'none' }}
        />
        <button type="submit" style={{ background: '#238636', border: 'none', color: '#fff', padding: '7px 12px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: '700', cursor: 'pointer' }}>
          Ask
        </button>
      </form>
    </div>
  );
}
