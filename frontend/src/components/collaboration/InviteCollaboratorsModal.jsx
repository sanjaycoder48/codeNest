import React, { useState } from 'react';
import { UserPlus, Copy, Check, X, Link, Mail, ChevronDown, ChevronUp, RefreshCw, Shield } from 'lucide-react';

export function InviteCollaboratorsModal({ open, onClose, repoName = 'CampusCare' }) {
  const [activeTab, setActiveTab] = useState('email'); // 'email' | 'link'
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Developer');
  const [linkRole, setLinkRole] = useState('Developer');
  const [expiration, setExpiration] = useState('7 days');
  const [linkDisabled, setLinkDisabled] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [copied, setCopied] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  if (!open) return null;

  const joinCode = 'abc123';
  const inviteUrl = `projecttwin.app/join/${joinCode}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`https://${inviteUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
    }
  };

  const handleSendEmailInvite = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setStatusMsg(`Invitation sent to ${email.trim()} as ${role}!`);
      setEmail('');
      setTimeout(() => setStatusMsg(''), 4000);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(5px)', display: 'grid', placeItems: 'center', padding: '16px' }}>
      <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: '12px', width: '520px', maxWidth: '95vw', boxShadow: '0 24px 60px rgba(0,0,0,0.8)', color: '#c9d1d9', overflow: 'hidden' }}>
        
        {/* Header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #30363d', background: '#0d1117', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#f0f6fc', margin: 0 }}>Invite People</h3>
            <span style={{ fontSize: '0.72rem', color: '#8b949e' }}>Work together on <strong>{repoName}</strong></span>
          </div>

          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#8b949e', cursor: 'pointer', padding: '4px' }}>
            <X size={18} />
          </button>
        </div>

        {/* Tab Selector */}
        <div style={{ display: 'flex', borderBottom: '1px solid #21262d', background: '#0d1117' }}>
          <button
            onClick={() => setActiveTab('email')}
            style={{
              flex: 1,
              padding: '10px',
              border: 'none',
              borderBottom: activeTab === 'email' ? '2px solid #58a6ff' : '2px solid transparent',
              background: 'transparent',
              color: activeTab === 'email' ? '#f0f6fc' : '#8b949e',
              fontSize: '0.8rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Mail size={15} /> Invite by Email
          </button>
          <button
            onClick={() => setActiveTab('link')}
            style={{
              flex: 1,
              padding: '10px',
              border: 'none',
              borderBottom: activeTab === 'link' ? '2px solid #58a6ff' : '2px solid transparent',
              background: 'transparent',
              color: activeTab === 'link' ? '#f0f6fc' : '#8b949e',
              fontSize: '0.8rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Link size={15} /> Invite by Link
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {statusMsg && (
            <div style={{ background: '#23863622', border: '1px solid #23863666', color: '#3fb950', padding: '8px 12px', borderRadius: '6px', fontSize: '0.78rem' }}>
              ✓ {statusMsg}
            </div>
          )}

          {activeTab === 'email' ? (
            /* Invite by Email */
            <form onSubmit={handleSendEmailInvite} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#c9d1d9', display: 'block', marginBottom: '6px' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="colleague@university.edu..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', background: '#0d1117', border: '1px solid #30363d', color: '#f0f6fc', padding: '8px 12px', borderRadius: '6px', fontSize: '0.82rem', outline: 'none' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#c9d1d9', display: 'block', marginBottom: '6px' }}>
                  Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  style={{ width: '100%', background: '#0d1117', border: '1px solid #30363d', color: '#f0f6fc', padding: '8px 12px', borderRadius: '6px', fontSize: '0.82rem' }}
                >
                  <option value="Owner">Owner — Full project control</option>
                  <option value="Developer">Developer — Tasks, discussions, reviews</option>
                  <option value="Designer">Designer — Tasks, UI & design collaboration</option>
                  <option value="Viewer">Viewer — Read-only project access</option>
                </select>
              </div>

              <button
                type="submit"
                style={{
                  marginTop: '6px',
                  background: '#238636',
                  border: 'none',
                  color: '#fff',
                  borderRadius: '6px',
                  padding: '10px',
                  fontSize: '0.82rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <UserPlus size={16} /> Send Invite
              </button>
            </form>
          ) : (
            /* Invite by Link */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#c9d1d9', display: 'block', marginBottom: '6px' }}>
                  Project Invitation Link
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    readOnly
                    value={linkDisabled ? 'Link disabled' : inviteUrl}
                    style={{ flex: 1, background: '#0d1117', border: '1px solid #30363d', color: linkDisabled ? '#f85149' : '#58a6ff', padding: '8px 12px', borderRadius: '6px', fontSize: '0.82rem', fontWeight: '600' }}
                  />
                  <button
                    onClick={handleCopyLink}
                    disabled={linkDisabled}
                    style={{
                      background: copied ? '#238636' : '#1f6feb',
                      border: 'none',
                      color: '#fff',
                      borderRadius: '6px',
                      padding: '8px 16px',
                      fontSize: '0.8rem',
                      fontWeight: '700',
                      cursor: linkDisabled ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    {copied ? <Check size={15} /> : <Copy size={15} />}
                    <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                  </button>
                </div>
              </div>

              {/* Link options */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.72rem', color: '#8b949e', display: 'block', marginBottom: '4px' }}>Default Role</label>
                  <select
                    value={linkRole}
                    onChange={(e) => setLinkRole(e.target.value)}
                    style={{ width: '100%', background: '#0d1117', border: '1px solid #30363d', color: '#f0f6fc', padding: '6px 8px', borderRadius: '6px', fontSize: '0.78rem' }}
                  >
                    <option value="Developer">Developer</option>
                    <option value="Designer">Designer</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.72rem', color: '#8b949e', display: 'block', marginBottom: '4px' }}>Link Expiration</label>
                  <select
                    value={expiration}
                    onChange={(e) => setExpiration(e.target.value)}
                    style={{ width: '100%', background: '#0d1117', border: '1px solid #30363d', color: '#f0f6fc', padding: '6px 8px', borderRadius: '6px', fontSize: '0.78rem' }}
                  >
                    <option value="7 days">7 days</option>
                    <option value="30 days">30 days</option>
                    <option value="Never">Never</option>
                  </select>
                </div>
              </div>

              <button
                onClick={() => setLinkDisabled(!linkDisabled)}
                style={{
                  background: 'transparent',
                  border: '1px solid #30363d',
                  color: linkDisabled ? '#3fb950' : '#f85149',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  alignSelf: 'flex-start'
                }}
              >
                {linkDisabled ? 'Enable Invite Link' : 'Disable Invite Link'}
              </button>

              {/* Advanced Permissions Collapsible */}
              <div style={{ borderTop: '1px solid #21262d', paddingTop: '10px', marginTop: '4px' }}>
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  style={{ background: 'transparent', border: 'none', color: '#8b949e', fontSize: '0.75rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Shield size={13} />
                  <span>Advanced permissions</span>
                  {showAdvanced ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                </button>

                {showAdvanced && (
                  <div style={{ marginTop: '8px', padding: '10px', background: '#0d1117', border: '1px solid #21262d', borderRadius: '6px', fontSize: '0.75rem', color: '#8b949e', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div><strong style={{ color: '#c9d1d9' }}>Owner:</strong> Full project control and member management.</div>
                    <div><strong style={{ color: '#c9d1d9' }}>Developer:</strong> Tasks, discussions, project changes, reviews.</div>
                    <div><strong style={{ color: '#c9d1d9' }}>Designer:</strong> Tasks, discussions, design-related collaboration.</div>
                    <div><strong style={{ color: '#c9d1d9' }}>Viewer:</strong> Read-only project access and discussions where permitted.</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 20px', borderTop: '1px solid #30363d', background: '#0d1117', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ background: '#21262d', border: '1px solid #30363d', color: '#c9d1d9', padding: '6px 16px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
