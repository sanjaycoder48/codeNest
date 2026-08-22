import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

export function AddTaskModal({ open, onClose, onAddTask, teamMembers = [] }) {
  const [title, setTitle] = useState('');
  const [assignee, setAssignee] = useState(teamMembers[0]?.name || 'Rahul');
  const [status, setStatus] = useState('To Do');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      const newTask = {
        id: 'TASK-' + Math.floor(100 + Math.random() * 900),
        title: title.trim(),
        assignee: assignee,
        status: status,
        description: description.trim() || 'No detailed description provided.',
        priority: priority,
        dueDate: dueDate || 'Next Sprint',
        aiContext: 'Created in team workspace'
      };
      onAddTask(newTask);
      setTitle('');
      setDescription('');
      onClose();
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)', display: 'grid', placeItems: 'center', padding: '16px' }}>
      <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: '12px', width: '480px', maxWidth: '95vw', boxShadow: '0 24px 60px rgba(0,0,0,0.8)', color: '#c9d1d9', overflow: 'hidden' }}>
        
        {/* Header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #30363d', background: '#0d1117', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#f0f6fc', margin: 0 }}>Add New Task</h3>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#8b949e', cursor: 'pointer', padding: '4px' }}>
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          {/* Required: Task Name */}
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#c9d1d9', display: 'block', marginBottom: '6px' }}>
              Task Name <span style={{ color: '#f85149' }}>*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Mobile Responsive UI"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: '100%', background: '#0d1117', border: '1px solid #30363d', color: '#f0f6fc', padding: '8px 12px', borderRadius: '6px', fontSize: '0.82rem', outline: 'none' }}
              required
              autoFocus
            />
          </div>

          {/* Required: Assign to & Status */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#c9d1d9', display: 'block', marginBottom: '6px' }}>
                Assign to <span style={{ color: '#f85149' }}>*</span>
              </label>
              <select
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                style={{ width: '100%', background: '#0d1117', border: '1px solid #30363d', color: '#f0f6fc', padding: '8px 12px', borderRadius: '6px', fontSize: '0.82rem' }}
              >
                {teamMembers.length > 0 ? (
                  teamMembers.map(m => <option key={m.id} value={m.name}>{m.name}</option>)
                ) : (
                  <>
                    <option value="Rahul">Rahul</option>
                    <option value="Priya">Priya</option>
                    <option value="Sanjay">Sanjay</option>
                    <option value="Arun">Arun</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#c9d1d9', display: 'block', marginBottom: '6px' }}>
                Status <span style={{ color: '#f85149' }}>*</span>
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={{ width: '100%', background: '#0d1117', border: '1px solid #30363d', color: '#f0f6fc', padding: '8px 12px', borderRadius: '6px', fontSize: '0.82rem' }}
              >
                <option value="To Do">○ To Do</option>
                <option value="In Progress">◐ In Progress</option>
                <option value="Done">✓ Completed</option>
              </select>
            </div>
          </div>

          {/* Optional: Description */}
          <div>
            <label style={{ fontSize: '0.75rem', color: '#8b949e', display: 'block', marginBottom: '4px' }}>
              Description (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Brief details about what needs to be done..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ width: '100%', background: '#0d1117', border: '1px solid #30363d', color: '#f0f6fc', padding: '8px 12px', borderRadius: '6px', fontSize: '0.8rem', resize: 'vertical', outline: 'none' }}
            />
          </div>

          {/* Optional: Priority & Due date */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: '#8b949e', display: 'block', marginBottom: '4px' }}>Priority (Optional)</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                style={{ width: '100%', background: '#0d1117', border: '1px solid #30363d', color: '#f0f6fc', padding: '6px 8px', borderRadius: '6px', fontSize: '0.78rem' }}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: '#8b949e', display: 'block', marginBottom: '4px' }}>Due Date (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Aug 28"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                style={{ width: '100%', background: '#0d1117', border: '1px solid #30363d', color: '#f0f6fc', padding: '6px 8px', borderRadius: '6px', fontSize: '0.78rem' }}
              />
            </div>
          </div>

          {/* Buttons */}
          <div style={{ borderTop: '1px solid #21262d', paddingTop: '14px', marginTop: '6px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{ background: '#21262d', border: '1px solid #30363d', color: '#c9d1d9', padding: '7px 14px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: '600', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{ background: '#238636', border: 'none', color: '#fff', padding: '7px 16px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <Plus size={15} /> Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
