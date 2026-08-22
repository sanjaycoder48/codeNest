import React, { useState } from 'react';
import {
  GitBranch,
  Search,
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
  onOpenConnectDev,
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
      height: '52px',
      background: '#0d1117',
      borderBottom: '1px solid #30363d',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 14px',
      color: '#c9d1d9',
      fontSize: '0.8rem',
      flexShrink: 0
    }}>
      {/* Left section: Branding, Repo & Branch */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', color: '#f0f6fc', flexShrink: 0 }}>
          <div style={{
            width: '26px',
            height: '26px',
            borderRadius: '6px',
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '11px',
            fontWeight: '900',
            color: '#fff'
          }}>TS</div>
          <span style={{ fontSize: '0.85rem' }}>TwinSpace</span>
          <span style={{ fontSize: '0.7rem', color: '#8b949e', fontWeight: '400' }}>by Project Twin</span>
        </div>

        <div style={{ height: '18px', width: '1px', background: '#30363d', flexShrink: 0 }} />

        {/* Repository info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
          <span style={{ color: '#8b949e', fontSize: '0.75rem' }}>Repo:</span>
          <strong style={{ color: '#58a6ff', fontSize: '0.8rem' }}>{repo?.fullName || 'demo/ShopSphere'}</strong>
        </div>

        {/* Branch Selector */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <button
            onClick={() => setBranchDropdown(!branchDropdown)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#21262d',
              border: '1px solid #30363d',
              borderRadius: '6px',
              padding: '3px 9px',
              color: '#c9d1d9',
              fontSize: '0.75rem',
              cursor: 'pointer'
            }}
          >
            <GitBranch size={13} style={{ color: '#238636' }} />
            <strong>{currentBranch}</strong>
          </button>

          {branchDropdown && (
            <div style={{
              position: 'absolute',
              top: '36px',
              left: 0,
              zIndex: 100,
              background: '#161b22',
              border: '1px solid #30363d',
              borderRadius: '8px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
              width: '240px',
              padding: '8px'
            }}>
              <div style={{ fontSize: '0.7rem', color: '#8b949e', padding: '4px 6px', fontWeight: '600' }}>SWITCH BRANCH</div>
              {branches.map(b => (
                <button
                  key={b.name}
                  onClick={() => { onSelectBranch(b.name); setBranchDropdown(false); }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '5px 8px',
                    background: b.name === currentBranch ? '#1f6feb22' : 'transparent',
                    border: 'none',
                    borderRadius: '4px',
                    color: b.name === currentBranch ? '#58a6ff' : '#c9d1d9',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span>{b.name}</span>
                  {b.isDefault && <span style={{ fontSize: '0.6rem', background: '#30363d', padding: '1px 4px', borderRadius: '4px' }}>default</span>}
                </button>
              ))}
              <div style={{ height: '1px', background: '#30363d', margin: '6px 0' }} />
              {!showNewBranch ? (
                <button
                  onClick={() => setShowNewBranch(true)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '5px 8px',
                    background: 'transparent',
                    border: 'none',
                    color: '#2f81f7',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Plus size={13} /> Create Branch
                </button>
              ) : (
                <form onSubmit={handleCreateBranchSubmit} style={{ display: 'flex', gap: '4px', padding: '2px' }}>
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
            padding: '3px 8px',
            color: '#8b949e',
            fontSize: '0.75rem',
            cursor: 'pointer',
            flexShrink: 0
          }}
        >
          <Search size={12} />
          <span>Search repo (Ctrl+K)</span>
        </button>
      </div>

      {/* Right section: Collaborators Presence, User Switcher, & Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
        {/* Active Collaborators Presence */}
        <div style={{ display: 'flex', alignItems: 'center', marginLeft: '4px' }}>
          {users.map(u => (
            <div
              key={u.id}
              title={`${u.name} (${u.role}) — Editing ${u.activeFile}`}
              style={{
                position: 'relative',
                marginLeft: '-5px',
                border: u.id === currentUser?.id ? '2px solid #58a6ff' : '2px solid #0d1117',
                borderRadius: '50%'
              }}
            >
              <img
                src={u.avatar}
                alt={u.name}
                style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover', display: 'block' }}
              />
              <span style={{
                position: 'absolute',
                bottom: '0',
                right: '0',
                width: '6px',
                height: '6px',
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
              gap: '5px',
              background: '#1f6feb22',
              border: '1px solid #1f6feb66',
              borderRadius: '16px',
              padding: '3px 8px',
              color: '#58a6ff',
              fontSize: '0.72rem',
              fontWeight: '600',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            <UserCheck size={12} />
            <span>Developer: {currentUser?.username || 'Vikash'}</span>
          </button>

          {userDropdown && (
            <div style={{
              position: 'absolute',
              top: '36px',
              right: 0,
              zIndex: 100,
              background: '#161b22',
              border: '1px solid #30363d',
              borderRadius: '8px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
              width: '210px',
              padding: '6px'
            }}>
              <div style={{ fontSize: '0.68rem', color: '#8b949e', padding: '4px 6px', fontWeight: '600' }}>SWITCH DEVELOPER ACCOUNT</div>
              {users.map(u => (
                <button
                  key={u.id}
                  onClick={() => { onSwitchUser(u); setUserDropdown(false); }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '5px 6px',
                    background: u.id === currentUser?.id ? '#1f6feb33' : 'transparent',
                    border: 'none',
                    borderRadius: '5px',
                    color: u.id === currentUser?.id ? '#58a6ff' : '#c9d1d9',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <img src={u.avatar} alt={u.name} style={{ width: '20px', height: '20px', borderRadius: '50%' }} />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <strong style={{ fontSize: '0.75rem' }}>{u.name}</strong>
                    <span style={{ fontSize: '0.62rem', color: '#8b949e' }}>{u.role}</span>
                  </div>
                </button>
              ))}
              <div style={{ height: '1px', background: '#30363d', margin: '4px 0' }} />
              <button
                onClick={() => { setUserDropdown(false); onOpenConnectDev(); }}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '5px 6px',
                  background: 'transparent',
                  border: 'none',
                  color: '#2f81f7',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Plus size={13} /> Connect GitHub Developer
              </button>
            </div>
          )}
        </div>

        <div style={{ height: '18px', width: '1px', background: '#30363d' }} />

        {/* Git Action Buttons */}
        <button
          onClick={onOpenCommit}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: '#21262d',
            border: '1px solid #30363d',
            borderRadius: '6px',
            padding: '4px 9px',
            color: '#c9d1d9',
            fontSize: '0.72rem',
            fontWeight: '600',
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          <GitCommit size={13} style={{ color: '#a855f7' }} />
          <span>Commit</span>
        </button>

        <button
          onClick={onOpenPush}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: '#21262d',
            border: '1px solid #30363d',
            borderRadius: '6px',
            padding: '4px 9px',
            color: '#c9d1d9',
            fontSize: '0.72rem',
            fontWeight: '600',
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          <UploadCloud size={13} style={{ color: '#38bdf8' }} />
          <span>Push</span>
        </button>

        <button
          onClick={onOpenPR}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: '#238636',
            border: 'none',
            borderRadius: '6px',
            padding: '4px 10px',
            color: '#ffffff',
            fontSize: '0.72rem',
            fontWeight: '600',
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          <GitPullRequest size={13} />
          <span>Pull Request</span>
        </button>

        <button
          onClick={onOpenReport}
          title="Whole Repository Code Intelligence Report"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: '#30363d',
            border: 'none',
            borderRadius: '6px',
            padding: '4px 9px',
            color: '#f0f6fc',
            fontSize: '0.72rem',
            fontWeight: '600',
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          <FileText size={13} style={{ color: '#eab308' }} />
          <span>Report</span>
        </button>

        <button
          onClick={onOpenDemoTour}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
            border: 'none',
            borderRadius: '6px',
            padding: '4px 10px',
            color: '#ffffff',
            fontSize: '0.72rem',
            fontWeight: '700',
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          <Play size={12} />
          <span>Demo Tour</span>
        </button>
      </div>
    </header>
  );
}
