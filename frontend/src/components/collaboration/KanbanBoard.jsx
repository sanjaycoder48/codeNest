import React, { useState } from 'react';
import { Plus, User, Calendar, Tag, ArrowRight, MessageSquare, Sparkles, CheckCircle2 } from 'lucide-react';

export function KanbanBoard({ tasks, onMoveTask, onCreateTask, teamMembers }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignee, setAssignee] = useState(teamMembers[0]?.name || 'Sanjay');
  const [priority, setPriority] = useState('Medium');
  const [relatedFeature, setRelatedFeature] = useState('Authentication');

  const columns = ['To Do', 'In Progress', 'Review', 'Done'];

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      onCreateTask({
        id: 'TASK-' + (tasks.length + 45),
        title: title.trim(),
        description: description.trim() || 'No description provided.',
        assignee,
        priority,
        status: 'To Do',
        dueDate: 'Aug 28',
        relatedFeature,
        githubIssue: `#${Math.floor(Math.random() * 50 + 10)}`,
        commentsCount: 0,
        aiContext: `Task created for ${relatedFeature}. Project Twin indexed related files.`
      });
      setTitle('');
      setDescription('');
      setShowAddModal(false);
    }
  };

  const getPriorityColor = (p) => {
    if (p === 'High') return { bg: '#da363322', text: '#f85149', border: '#da363344' };
    if (p === 'Medium') return { bg: '#eab30822', text: '#eab308', border: '#eab30844' };
    return { bg: '#23863622', text: '#3fb950', border: '#23863644' };
  };

  return (
    <div style={{ background: '#0d1117', border: '1px solid #30363d', borderRadius: '10px', padding: '16px', marginBottom: '20px' }}>
      {/* Board Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#f0f6fc', margin: 0 }}>Task & Feature Board</h3>
          <span style={{ fontSize: '0.72rem', color: '#8b949e' }}>Kanban workflow linked to repository modules</span>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          style={{
            background: '#238636',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            padding: '5px 12px',
            fontSize: '0.78rem',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <Plus size={14} /> Add Task
        </button>
      </div>

      {/* Columns Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
        {columns.map(col => {
          const colTasks = tasks.filter(t => t.status === col);
          return (
            <div key={col} style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: '8px', padding: '10px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', borderBottom: '1px solid #30363d', paddingBottom: '6px' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#c9d1d9' }}>{col}</span>
                <span style={{ fontSize: '0.65rem', background: '#0d1117', border: '1px solid #30363d', padding: '1px 6px', borderRadius: '10px', color: '#8b949e' }}>
                  {colTasks.length}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                {colTasks.map(task => {
                  const prioStyle = getPriorityColor(task.priority);
                  return (
                    <div
                      key={task.id}
                      style={{
                        background: '#0d1117',
                        border: '1px solid #30363d',
                        borderRadius: '6px',
                        padding: '10px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.65rem', color: '#58a6ff', fontWeight: '700' }}>{task.id}</span>
                        <span style={{ fontSize: '0.6rem', background: prioStyle.bg, color: prioStyle.text, border: `1px solid ${prioStyle.border}`, padding: '1px 5px', borderRadius: '4px', fontWeight: '700' }}>
                          {task.priority}
                        </span>
                      </div>

                      <strong style={{ fontSize: '0.82rem', color: '#f0f6fc', lineHeight: '1.3' }}>{task.title}</strong>
                      <p style={{ fontSize: '0.72rem', color: '#8b949e', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {task.description}
                      </p>

                      {/* AI Context Snippet */}
                      {task.aiContext && (
                        <div style={{ background: '#1f6feb11', border: '1px solid #1f6feb33', borderRadius: '4px', padding: '4px 6px', fontSize: '0.68rem', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Sparkles size={11} style={{ flexShrink: 0 }} />
                          <span>{task.aiContext}</span>
                        </div>
                      )}

                      {/* Footer Info */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px', fontSize: '0.7rem', color: '#8b949e', borderTop: '1px solid #21262d', paddingTop: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <User size={12} />
                          <span>{task.assignee}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {task.githubIssue && <span style={{ color: '#a855f7' }}>{task.githubIssue}</span>}
                          {/* Move Column Control */}
                          <select
                            value={task.status}
                            onChange={(e) => onMoveTask(task.id, e.target.value)}
                            style={{ background: '#161b22', border: '1px solid #30363d', color: '#c9d1d9', borderRadius: '4px', fontSize: '0.65rem', padding: '1px 4px', cursor: 'pointer' }}
                          >
                            {columns.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'grid', placeItems: 'center' }}>
          <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: '10px', padding: '20px', width: '420px', maxWidth: '90vw', color: '#c9d1d9' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: '800', color: '#f0f6fc', marginBottom: '14px' }}>Create New Team Task</h4>
            <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', display: 'block', marginBottom: '4px' }}>Task Title</label>
                <input
                  type="text"
                  placeholder="e.g., Implement JWT refresh token rotation"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{ width: '100%', background: '#0d1117', border: '1px solid #30363d', color: '#f0f6fc', padding: '8px', borderRadius: '6px', fontSize: '0.8rem', outline: 'none' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', display: 'block', marginBottom: '4px' }}>Description</label>
                <textarea
                  placeholder="Describe task scope and related APIs..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ width: '100%', background: '#0d1117', border: '1px solid #30363d', color: '#f0f6fc', padding: '8px', borderRadius: '6px', fontSize: '0.8rem', outline: 'none', height: '60px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', display: 'block', marginBottom: '4px' }}>Assignee</label>
                  <select
                    value={assignee}
                    onChange={(e) => setAssignee(e.target.value)}
                    style={{ width: '100%', background: '#0d1117', border: '1px solid #30363d', color: '#f0f6fc', padding: '6px', borderRadius: '6px', fontSize: '0.78rem' }}
                  >
                    {teamMembers.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', display: 'block', marginBottom: '4px' }}>Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    style={{ width: '100%', background: '#0d1117', border: '1px solid #30363d', color: '#f0f6fc', padding: '6px', borderRadius: '6px', fontSize: '0.78rem' }}
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', display: 'block', marginBottom: '4px' }}>Feature</label>
                  <input
                    type="text"
                    value={relatedFeature}
                    onChange={(e) => setRelatedFeature(e.target.value)}
                    style={{ width: '100%', background: '#0d1117', border: '1px solid #30363d', color: '#f0f6fc', padding: '6px', borderRadius: '6px', fontSize: '0.78rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{ background: '#21262d', border: '1px solid #30363d', color: '#c9d1d9', borderRadius: '6px', padding: '6px 12px', fontSize: '0.8rem', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ background: '#238636', border: 'none', color: '#fff', borderRadius: '6px', padding: '6px 14px', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer' }}
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
