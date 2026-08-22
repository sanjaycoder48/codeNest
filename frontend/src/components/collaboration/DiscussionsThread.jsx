import React, { useState } from 'react';
import { MessageSquare, Send, Sparkles, User } from 'lucide-react';

export function DiscussionsThread({ discussions, onAddComment, currentUser }) {
  const [newComment, setNewComment] = useState('');
  const [summary, setSummary] = useState('');

  const handlePost = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment({
        id: 'disc_' + Date.now(),
        user: currentUser?.name || 'Sanjay',
        avatar: currentUser?.avatar || 'https://avatars.githubusercontent.com/u/583231?v=4',
        message: newComment.trim(),
        timestamp: 'Just now',
        topic: 'Architecture & Change Reviews'
      });
      setNewComment('');
    }
  };

  const handleSummarize = () => {
    setSummary(`AI Discussion Summary: Team aligned on API parameter validation boundary. @Arun confirmed security check before production merge.`);
  };

  const renderFormattedMessage = (msg) => {
    const parts = msg.split(/(@\w+)/g);
    return parts.map((part, i) => {
      if (part.startsWith('@')) {
        return (
          <span key={i} style={{ background: '#1f6feb33', color: '#58a6ff', padding: '1px 4px', borderRadius: '4px', fontWeight: '700' }}>
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div style={{ background: '#0d1117', border: '1px solid #30363d', borderRadius: '10px', padding: '16px', marginBottom: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MessageSquare size={16} style={{ color: '#58a6ff' }} />
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#f0f6fc', margin: 0 }}>Team Discussions & @mentions</h4>
            <span style={{ fontSize: '0.7rem', color: '#8b949e' }}>Collaborative decision threads attached to tasks & PRs</span>
          </div>
        </div>
        <button
          onClick={handleSummarize}
          style={{
            background: '#161b22',
            border: '1px solid #30363d',
            color: '#a855f7',
            borderRadius: '6px',
            padding: '4px 10px',
            fontSize: '0.72rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <Sparkles size={12} /> Summarize Thread
        </button>
      </div>

      {/* AI Summary Banner */}
      {summary && (
        <div style={{ background: '#1f6feb11', border: '1px solid #1f6feb44', borderRadius: '6px', padding: '8px 12px', fontSize: '0.75rem', color: '#38bdf8', marginBottom: '12px' }}>
          {summary}
        </div>
      )}

      {/* Comments List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '280px', overflowY: 'auto', marginBottom: '12px' }}>
        {discussions.map(item => (
          <div key={item.id} style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: '8px', padding: '10px', display: 'flex', gap: '10px' }}>
            <img src={item.avatar || 'https://avatars.githubusercontent.com/u/583231?v=4'} alt={item.user} style={{ width: '28px', height: '28px', borderRadius: '50%' }} />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                <strong style={{ fontSize: '0.8rem', color: '#f0f6fc' }}>{item.user}</strong>
                <span style={{ fontSize: '0.68rem', color: '#8b949e' }}>{item.timestamp}</span>
              </div>
              <div style={{ fontSize: '0.78rem', color: '#c9d1d9', lineHeight: '1.4' }}>
                {renderFormattedMessage(item.message)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Comment Input */}
      <form onSubmit={handlePost} style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          placeholder="Write a message or @mention a teammate (e.g. @Arun can you review this?)..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          style={{ flex: 1, background: '#161b22', border: '1px solid #30363d', color: '#f0f6fc', padding: '8px 12px', borderRadius: '6px', fontSize: '0.8rem', outline: 'none' }}
        />
        <button
          type="submit"
          style={{ background: '#238636', color: '#fff', border: 'none', borderRadius: '6px', padding: '8px 14px', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          <Send size={14} /> Send
        </button>
      </form>
    </div>
  );
}
