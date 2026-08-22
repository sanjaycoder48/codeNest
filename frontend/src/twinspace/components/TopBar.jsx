import React, { useState } from 'react';
import {
  GitBranch,
  Search,
  CheckCircle2,
  GitCommit,
  UploadCloud,
  GitPullRequest,
  Plus,
  FileText,
  Play,
  UserCheck
} from 'lucide-react';

export function TopBar({
  currentUser,
  users,
  onSwitchUser,
  repo,
  branches,
  currentBranch,
  onSelectBranch,
  onCreateBranch,
  onOpenCommit,
  onOpenPush,
  onOpenPR,
  onOpenReport,
  onOpenDemoTour,
  onSearch
}) {
  const [userDropdown, setUserDropdown] = useState(false);
  const [branchDropdown, setBranchDropdown] = useState(false);
  const [newBranchInput, setNewBranchInput] = useState('');
  const [showNewBranch, setShowNewBranch] = useState(false);

  const handleCreateBranchSubmit = (e) => {
    e.preventDefault();
    if (newBranchInput.trim()) {
      onCreateBranch(newBranchInput.trim());
      setNewBranchInput('');
      setShowNewBranch(false);
      setBranchDropdown(false);
    }
  };

  return (
    <header className="twinspace-topbar" style={{
      height: '56px',
      background: '#0d1117',
      borderBottom: '1px solid #30363d',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px',
      color: '#c9d1d9',
      fontSize: '0.85rem'
    }}>
      {/* Left section: Identity & Repo & Branch */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', color: '#f0f6fc' }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '6px',
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: '900',
            color: '#fff'
          }}>TS</div>
          <span>TwinSpace</span>
          <span style={{ fontSize: '0.75rem', color: '#8b949e', fontWeight: '400' }}>by Project Twin</span>
        </div>

        <div style={{ height: '20px', width: '1px', background: '#30363d' }} />

        {/* Repository selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ color: '#8b949e' }}>Repo:</span>
          <strong style={{ color: '#58a6ff' }}>{repo?.fullName || 'demo/ShopSphere'}</strong>
        </div>

        {/* Branch dropdown */}
        <div style={{ relative: 'relative' }}>
          <button
            onClick={() => setBranchDropdown(!branchDropdown)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#21262d',
              border: '1px solid #30363d',
              borderRadius: '6px',
              padding: '4px 10px',
              color: '#c9d1d9',
              fontSize: '0.8rem',
              cursor: 'pointer'
            }}
          >
            <GitBranch size={14} style={{ color: '#238636' }} />
            <strong>{currentBranch}</strong>
          </button>

          {branchDropdown && (
            <div style={{
              position: 'absolute',
              top: '48px',
              left: '260px',
              zIndex: 100,
              background: '#161b22',
              border: '1px solid #30363d',
              borderRadius: '8px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
              width: '260px',
              padding: '8px'
            }}>
              <div style={{ fontSize: '0.75rem', color: '#8b949e', padding: '4px 8px', fontWeight: '600' }}>SWITCH BRANCH</div>
              {branches.map(b => (
                <button
                  key={b.name}
                  onClick={() => { onSelectBranch(b.name); setBranchDropdown(false); }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '6px 8px',
                    background: b.name === currentBranch ? '#1f6feb22' : 'transparent',
                    border: 'none',
                    borderRadius: '4px',
                    color: b.name === currentBranch ? '#58a6ff' : '#c9d1d9',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span>{b.name}</span>
                  {b.isDefault && <span style={{ fontSize: '0.65rem', background: '#30363d', padding: '1px 5px', borderRadius: '4px' }}>default</span>}
                </button>
              ))}
              <div style={{ height: '1px', background: '#30363d', margin: '6px 0' }} />
              {!showNewBranch ? (
                <button
                  onClick={() => setShowNewBranch(true)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '6px 8px',
                    background: 'transparent',
                    border: 'none',
                    color: '#2f81f7',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Plus size={14} /> Create Branch
                </button>
              ) : (
                <form onSubmit={handleCreateBranchSubmit} style={{ display: 'flex', gap: '4px', padding: '4px' }}>
                  <input
                    type="text"
                    placeholder="branch-name"
                    value={newBranchInput}
                    onChange={e => setNewBranchInput(e.target.value)}
                    style={{
                      flex: 1,
                      background: '#0d1117',
                      border: '1px solid #30363d',
                      borderRadius: '4px',
                      color: '#c9d1d9',
                      padding: '4px 6px',
                      fontSize: '0.75rem'
                    }}
                    autoFocus
                  />
                  <button type="submit" style={{ background: '#238636', color: '#fff', border: 'none', borderRadius: '4px', padding: '4px 8px', fontSize: '0.75rem' }}>Create</button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Quick search button */}
        <button
          onClick={onSearch}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: '#161b22',
            border: '1px solid #30363d',
            borderRadius: '6px',
            padding: '4px 10px',
            color: '#8b949e',
            fontSize: '0.75rem',
            cursor: 'pointer'
          }}
        >
          <Search size={13} />
          <span>Search repo (Ctrl+K)</span>
        </button>
      </div>

      {/* Right section: Collaborators Presence, User Switcher, & Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Active Collaborators Presence */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '-6px' }}>
          {users.map(u => (
            <div
              key={u.id}
              title={`${u.name} (${u.role}) — Editing ${u.activeFile}`}
              style={{
                position: 'relative',
                marginLeft: '-6px',
                border: u.id === currentUser?.id ? '2px solid #58a6ff' : '2px solid #0d1117',
                borderRadius: '50%'
              }}
            >
              <img
                src={u.avatar}
                alt={u.name}
                style={{ width: '26px', height: '26px', borderRadius: '50%', objectFit: 'cover', display: 'block' }}
              />
              <span style={{
                position: 'absolute',
                bottom: '0',
                right: '0',
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: '#238636',
                border: '1px solid #0d1117'
              }} />
            </div>
          ))}
        </div>

        {/* Developer User Switcher Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setUserDropdown(!userDropdown)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#1f6feb22',
              border: '1px solid #1f6feb66',
              borderRadius: '20px',
              padding: '3px 10px',
              color: '#58a6ff',
              fontSize: '0.75rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            <UserCheck size={13} />
            <span>Developer: {currentUser?.username || 'Vikash'}</span>
          </button>

          {userDropdown && (
            <div style={{
              position: 'absolute',
              top: '40px',
              right: '0',
              zIndex: 100,
              background: '#161b22',
              border: '1px solid #30363d',
              borderRadius: '8px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
              width: '220px',
              padding: '8px'
            }}>
              <div style={{ fontSize: '0.7rem', color: '#8b949e', padding: '4px 8px', fontWeight: '600' }}>SWITCH DEVELOPER ACCOUNT</div>
              {users.map(u => (
                <button
                  key={u.id}
                  onClick={() => { onSwitchUser(u); setUserDropdown(false); }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '6px 8px',
                    background: u.id === currentUser?.id ? '#1f6feb33' : 'transparent',
                    border: 'none',
                    borderRadius: '6px',
                    color: u.id === currentUser?.id ? '#58a6ff' : '#c9d1d9',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <img src={u.avatar} alt={u.name} style={{ width: '20px', height: '20px', borderRadius: '50%' }} />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <strong style={{ fontSize: '0.8rem' }}>{u.name}</strong>
                    <span style={{ fontSize: '0.65rem', color: '#8b949e' }}>{u.role}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div style={{ height: '20px', width: '1px', background: '#30363d' }} />

        {/* Git Action Buttons */}
        <button
          onClick={onOpenCommit}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            background: '#21262d',
            border: '1px solid #30363d',
            borderRadius: '6px',
            padding: '5px 10px',
            color: '#c9d1d9',
            fontSize: '0.75rem',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          <GitCommit size={14} style={{ color: '#a855f7' }} />
          <span>Commit</span>
        </button>

        <button
          onClick={onOpenPush}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            background: '#21262d',
            border: '1px solid #30363d',
            borderRadius: '6px',
            padding: '5px 10px',
            color: '#c9d1d9',
            fontSize: '0.75rem',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          <UploadCloud size={14} style={{ color: '#38bdf8' }} />
          <span>Push</span>
        </button>

        <button
          onClick={onOpenPR}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            background: '#238636',
            border: 'none',
            borderRadius: '6px',
            padding: '5px 12px',
            color: '#ffffff',
            fontSize: '0.75rem',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          <GitPullRequest size={14} />
          <span>Pull Request</span>
        </button>

        <button
          onClick={onOpenReport}
          title="Whole Repository Code Intelligence Report"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            background: '#30363d',
            border: 'none',
            borderRadius: '6px',
            padding: '5px 10px',
            color: '#f0f6fc',
            fontSize: '0.75rem',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          <FileText size={14} style={{ color: '#eab308' }} />
          <span>Report</span>
        </button>

        <button
          onClick={onOpenDemoTour}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
            border: 'none',
            borderRadius: '6px',
            padding: '5px 12px',
            color: '#ffffff',
            fontSize: '0.75rem',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          <Play size={13} />
          <span>Demo Tour (3–5m)</span>
        </button>
      </div>
    </header>
  );
}
