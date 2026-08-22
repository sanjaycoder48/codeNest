import React, { useState } from 'react';
import {
  Folder,
  FolderOpen,
  FileCode2,
  GitBranch,
  GitCommit,
  GitPullRequest,
  CheckSquare,
  Activity,
  Search,
  Plus,
  Trash2,
  Clock,
  ChevronRight,
  ChevronDown
} from 'lucide-react';

export function LeftSidebar({
  files,
  activeFile,
  onOpenFile,
  branches,
  currentBranch,
  onSelectBranch,
  _onCreateBranch,
  commits,
  pullRequests,
  onOpenPRDetails,
  tasks,
  onCreateTask,
  activities
}) {
  const [activeTab, setActiveTab] = useState('explorer'); // explorer, branches, commits, prs, tasks, activity
  const [searchQuery, setSearchQuery] = useState('');
  const [_expandedFolders, _setExpandedFolders] = useState({
    'backend': true,
    'backend/auth': true,
    'backend/payments': true,
    'backend/orders': true,
    'database': true,
    'frontend': true,
    'frontend/components': true,
    'frontend/pages': true
  });

  const _toggleFolder = (folderPath) => {
    _setExpandedFolders(prev => ({ ...prev, [folderPath]: !prev[folderPath] }));
  };

  // Build tree structure from files keys
  const filePaths = Object.keys(files || {});
  const filteredPaths = filePaths.filter(p => p.toLowerCase().includes(searchQuery.toLowerCase()));

  // Task creation form state
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskAssignee, setTaskAssignee] = useState('Rahul');

  const handleTaskSubmit = (e) => {
    e.preventDefault();
    if (taskTitle.trim()) {
      onCreateTask({ title: taskTitle.trim(), assignedTo: taskAssignee, branch: currentBranch, priority: 'Medium' });
      setTaskTitle('');
      setShowNewTaskForm(false);
    }
  };

  return (
    <aside className="twinspace-left-sidebar" style={{
      width: '260px',
      flexShrink: 0,
      background: '#161b22',
      borderRight: '1px solid #30363d',
      display: 'flex',
      flexDirection: 'column',
      color: '#c9d1d9',
      fontSize: '0.8rem',
      userSelect: 'none'
    }}>
      {/* Sidebar Navigation Icons Bar */}
      <div style={{
        height: '36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        background: '#161b22',
        borderBottom: '1px solid #30363d',
        padding: '0 4px',
        boxSizing: 'border-box'
      }}>
        <button
          onClick={() => setActiveTab('explorer')}
          title="Repository Explorer"
          style={{
            background: activeTab === 'explorer' ? '#1f6feb33' : 'transparent',
            border: 'none',
            color: activeTab === 'explorer' ? '#58a6ff' : '#8b949e',
            padding: '6px 10px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          <Folder size={16} />
        </button>

        <button
          onClick={() => setActiveTab('branches')}
          title="Git Branches"
          style={{
            background: activeTab === 'branches' ? '#1f6feb33' : 'transparent',
            border: 'none',
            color: activeTab === 'branches' ? '#58a6ff' : '#8b949e',
            padding: '6px 10px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          <GitBranch size={16} />
        </button>

        <button
          onClick={() => setActiveTab('commits')}
          title="Commit History"
          style={{
            background: activeTab === 'commits' ? '#1f6feb33' : 'transparent',
            border: 'none',
            color: activeTab === 'commits' ? '#58a6ff' : '#8b949e',
            padding: '6px 10px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          <GitCommit size={16} />
        </button>

        <button
          onClick={() => setActiveTab('prs')}
          title="Pull Requests"
          style={{
            background: activeTab === 'prs' ? '#1f6feb33' : 'transparent',
            border: 'none',
            color: activeTab === 'prs' ? '#58a6ff' : '#8b949e',
            padding: '6px 10px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          <GitPullRequest size={16} />
        </button>

        <button
          onClick={() => setActiveTab('tasks')}
          title="Development Tasks"
          style={{
            background: activeTab === 'tasks' ? '#1f6feb33' : 'transparent',
            border: 'none',
            color: activeTab === 'tasks' ? '#58a6ff' : '#8b949e',
            padding: '6px 10px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          <CheckSquare size={16} />
        </button>

        <button
          onClick={() => setActiveTab('activity')}
          title="Live Activity Stream"
          style={{
            background: activeTab === 'activity' ? '#1f6feb33' : 'transparent',
            border: 'none',
            color: activeTab === 'activity' ? '#58a6ff' : '#8b949e',
            padding: '6px 10px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          <Activity size={16} />
        </button>
      </div>

      {/* Tab Content Container */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
        {/* TAB 1: REPOSITORY EXPLORER */}
        {activeTab === 'explorer' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#8b949e', textTransform: 'uppercase' }}>Explorer — ShopSphere</span>
              <button
                onClick={() => {
                  const name = prompt('Enter new file path (e.g. backend/services/AuthHelper.ts):');
                  if (name) onOpenFile(name, '// New file created in TwinSpace\n');
                }}
                title="Create file"
                style={{ background: 'transparent', border: 'none', color: '#58a6ff', cursor: 'pointer' }}
              >
                <Plus size={14} />
              </button>
            </div>

            <div style={{ position: 'relative', marginBottom: '10px' }}>
              <input
                type="text"
                placeholder="Filter files..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  background: '#0d1117',
                  border: '1px solid #30363d',
                  borderRadius: '4px',
                  color: '#c9d1d9',
                  padding: '4px 8px 4px 24px',
                  fontSize: '0.75rem'
                }}
              />
              <Search size={12} style={{ position: 'absolute', left: '8px', top: '7px', color: '#8b949e' }} />
            </div>

            {/* Tree listing */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {filteredPaths.map(path => {
                const isSelected = activeFile === path;
                const folderDepth = path.split('/').length - 1;

                return (
                  <button
                    key={path}
                    onClick={() => onOpenFile(path)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '4px 8px',
                      paddingLeft: `${folderDepth * 12 + 8}px`,
                      background: isSelected ? '#1f6feb33' : 'transparent',
                      border: 'none',
                      borderRadius: '4px',
                      color: isSelected ? '#58a6ff' : '#c9d1d9',
                      fontSize: '0.75rem',
                      textAlign: 'left',
                      cursor: 'pointer',
                      width: '100%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <FileCode2 size={13} style={{ color: path.endsWith('.sql') ? '#eab308' : path.endsWith('.json') ? '#a855f7' : '#38bdf8', flexShrink: 0 }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{path}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: BRANCHES */}
        {activeTab === 'branches' && (
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: '700', color: '#8b949e', textTransform: 'uppercase', marginBottom: '8px' }}>
              Git Branches ({branches?.length || 0})
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {branches?.map(b => (
                <div
                  key={b.name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px',
                    background: b.name === currentBranch ? '#1f6feb22' : '#0d1117',
                    border: b.name === currentBranch ? '1px solid #1f6feb66' : '1px solid #30363d',
                    borderRadius: '6px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <GitBranch size={14} style={{ color: b.name === currentBranch ? '#238636' : '#8b949e' }} />
                    <strong style={{ fontSize: '0.75rem', color: b.name === currentBranch ? '#58a6ff' : '#c9d1d9' }}>{b.name}</strong>
                  </div>
                  {b.name !== currentBranch && (
                    <button
                      onClick={() => onSelectBranch(b.name)}
                      style={{ background: '#21262d', border: '1px solid #30363d', color: '#c9d1d9', borderRadius: '4px', padding: '2px 6px', fontSize: '0.65rem', cursor: 'pointer' }}
                    >
                      Checkout
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: COMMITS */}
        {activeTab === 'commits' && (
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: '700', color: '#8b949e', textTransform: 'uppercase', marginBottom: '8px' }}>
              Commit History
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {commits?.map(c => (
                <div key={c.hash} style={{ background: '#0d1117', border: '1px solid #30363d', borderRadius: '6px', padding: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontFamily: 'monospace', color: '#a855f7', fontSize: '0.75rem', fontWeight: '700' }}>{c.hash}</span>
                    <span style={{ fontSize: '0.65rem', color: '#8b949e' }}>{c.timestamp}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#c9d1d9', marginBottom: '4px' }}>{c.message}</div>
                  <div style={{ fontSize: '0.65rem', color: '#8b949e', display: 'flex', gap: '8px' }}>
                    <span>By {c.author}</span>
                    <span>•</span>
                    <span style={{ color: '#238636' }}>+{c.additions}</span>
                    <span style={{ color: '#f85149' }}>-{c.deletions}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: PULL REQUESTS */}
        {activeTab === 'prs' && (
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: '700', color: '#8b949e', textTransform: 'uppercase', marginBottom: '8px' }}>
              Pull Requests ({pullRequests?.length || 0})
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {pullRequests?.map(pr => (
                <div
                  key={pr.id}
                  onClick={() => onOpenPRDetails(pr)}
                  style={{
                    background: '#0d1117',
                    border: '1px solid #30363d',
                    borderRadius: '6px',
                    padding: '8px',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ color: '#238636', fontWeight: '700', fontSize: '0.75rem' }}>#{pr.number} {pr.title}</span>
                    <span style={{ fontSize: '0.65rem', background: pr.status === 'Merged' ? '#8957e533' : '#23863633', color: pr.status === 'Merged' ? '#a855f7' : '#3fb950', padding: '1px 5px', borderRadius: '4px' }}>
                      {pr.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.65rem', color: '#8b949e' }}>
                    {pr.sourceBranch} → {pr.targetBranch} by {pr.author}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: TASKS */}
        {activeTab === 'tasks' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#8b949e', textTransform: 'uppercase' }}>Tasks</span>
              <button
                onClick={() => setShowNewTaskForm(!showNewTaskForm)}
                style={{ background: 'transparent', border: 'none', color: '#58a6ff', cursor: 'pointer' }}
              >
                <Plus size={14} />
              </button>
            </div>

            {showNewTaskForm && (
              <form onSubmit={handleTaskSubmit} style={{ background: '#0d1117', border: '1px solid #30363d', borderRadius: '6px', padding: '8px', marginBottom: '10px' }}>
                <input
                  type="text"
                  placeholder="Task title..."
                  value={taskTitle}
                  onChange={e => setTaskTitle(e.target.value)}
                  style={{ width: '100%', background: '#161b22', border: '1px solid #30363d', borderRadius: '4px', color: '#c9d1d9', padding: '4px', fontSize: '0.75rem', marginBottom: '6px' }}
                />
                <select
                  value={taskAssignee}
                  onChange={e => setTaskAssignee(e.target.value)}
                  style={{ width: '100%', background: '#161b22', border: '1px solid #30363d', borderRadius: '4px', color: '#c9d1d9', padding: '4px', fontSize: '0.75rem', marginBottom: '6px' }}
                >
                  <option value="Rahul">Assign to Rahul</option>
                  <option value="Priya">Assign to Priya</option>
                  <option value="Kavin">Assign to Kavin</option>
                  <option value="Vikash">Assign to Vikash</option>
                  <option value="Arun">Assign to Arun</option>
                </select>
                <button type="submit" style={{ width: '100%', background: '#238636', color: '#fff', border: 'none', borderRadius: '4px', padding: '4px', fontSize: '0.75rem' }}>Create Task</button>
              </form>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {tasks?.map(t => (
                <div key={t.id} style={{ background: '#0d1117', border: '1px solid #30363d', borderRadius: '6px', padding: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '0.75rem', color: '#58a6ff' }}>{t.id}: {t.title}</strong>
                    <span style={{ fontSize: '0.65rem', color: t.status === 'Completed' ? '#3fb950' : '#eab308' }}>{t.status}</span>
                  </div>
                  <div style={{ fontSize: '0.65rem', color: '#8b949e', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Assigned: {t.assignedTo}</span>
                    <span>Branch: {t.branch}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: ACTIVITY STREAM */}
        {activeTab === 'activity' && (
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: '700', color: '#8b949e', textTransform: 'uppercase', marginBottom: '8px' }}>
              Live Team Activity
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {activities?.map(a => (
                <div key={a.id} style={{ background: '#0d1117', border: '1px solid #30363d', borderRadius: '6px', padding: '8px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#c9d1d9' }}>
                    <strong style={{ color: '#58a6ff' }}>{a.user}</strong> {a.action} <span style={{ color: '#a855f7' }}>{a.target}</span>
                  </div>
                  <div style={{ fontSize: '0.65rem', color: '#8b949e', marginTop: '2px' }}>{a.timestamp}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
