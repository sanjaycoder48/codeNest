import React, { useState } from 'react';
import {
  BrainCircuit,
  Copy,
  GitPullRequest,
  ShieldAlert,
  Users,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Zap,
  Layers,
  GitCommit,
  ExternalLink,
  FileText
} from 'lucide-react';

export function RightSidebar({
  activeFile,
  impactData,
  duplicatesData,
  users,
  currentUser,
  onOpenFile
}) {
  const [activeTab, setActiveTab] = useState('context'); // context, duplicates, impact, review, presence

  return (
    <aside className="twinspace-right-sidebar" style={{
      width: '280px',
      flexShrink: 0,
      background: '#161b22',
      borderLeft: '1px solid #30363d',
      display: 'flex',
      flexDirection: 'column',
      color: '#c9d1d9',
      fontSize: '0.8rem'
    }}>
      {/* Sidebar Navigation Tabs Header */}
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
          onClick={() => setActiveTab('context')}
          title="Project Twin Context"
          style={{
            background: activeTab === 'context' ? '#1f6feb33' : 'transparent',
            border: 'none',
            color: activeTab === 'context' ? '#58a6ff' : '#8b949e',
            padding: '6px 8px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          <BrainCircuit size={15} />
        </button>

        <button
          onClick={() => setActiveTab('duplicates')}
          title="Duplicate Code Detection"
          style={{
            background: activeTab === 'duplicates' ? '#1f6feb33' : 'transparent',
            border: 'none',
            color: activeTab === 'duplicates' ? '#58a6ff' : '#8b949e',
            padding: '6px 8px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          <Copy size={15} />
        </button>

        <button
          onClick={() => setActiveTab('impact')}
          title="Change Impact Analysis"
          style={{
            background: activeTab === 'impact' ? '#1f6feb33' : 'transparent',
            border: 'none',
            color: activeTab === 'impact' ? '#58a6ff' : '#8b949e',
            padding: '6px 8px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          <Layers size={15} />
        </button>

        <button
          onClick={() => setActiveTab('review')}
          title="AI Code Review"
          style={{
            background: activeTab === 'review' ? '#1f6feb33' : 'transparent',
            border: 'none',
            color: activeTab === 'review' ? '#58a6ff' : '#8b949e',
            padding: '6px 8px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          <ShieldAlert size={15} />
        </button>

        <button
          onClick={() => setActiveTab('presence')}
          title="Team Collaborators"
          style={{
            background: activeTab === 'presence' ? '#1f6feb33' : 'transparent',
            border: 'none',
            color: activeTab === 'presence' ? '#58a6ff' : '#8b949e',
            padding: '6px 8px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          <Users size={15} />
        </button>
      </div>

      {/* Sidebar Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
        {/* TAB 1: PROJECT TWIN CONTEXT */}
        {activeTab === 'context' && (
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: '700', color: '#8b949e', textTransform: 'uppercase', marginBottom: '8px' }}>
              Project Twin Context
            </div>

            <div style={{ background: '#0d1117', border: '1px solid #30363d', borderRadius: '6px', padding: '10px', marginBottom: '10px' }}>
              <div style={{ fontSize: '0.75rem', color: '#8b949e', marginBottom: '2px' }}>OPEN FILE</div>
              <strong style={{ fontSize: '0.85rem', color: '#58a6ff' }}>{activeFile || 'backend/payments/PaymentService.ts'}</strong>
              <div style={{ display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>
                <span style={{ background: '#23863633', color: '#3fb950', padding: '2px 6px', borderRadius: '4px', fontSize: '0.65rem', fontWeight: '700' }}>Health: 78/100</span>
                <span style={{ background: '#30363d', color: '#c9d1d9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.65rem' }}>342 Lines</span>
                <span style={{ background: '#30363d', color: '#c9d1d9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.65rem' }}>18 Functions</span>
                <span style={{ background: '#30363d', color: '#c9d1d9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.65rem' }}>63% Coverage</span>
              </div>
            </div>

            <div style={{ background: '#0d1117', border: '1px solid #30363d', borderRadius: '6px', padding: '10px', marginBottom: '10px' }}>
              <strong style={{ fontSize: '0.75rem', color: '#8b949e', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>USED BY</strong>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                <span style={{ background: '#161b22', border: '1px solid #30363d', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', color: '#c9d1d9' }}>Login API</span>
                <span style={{ background: '#161b22', border: '1px solid #30363d', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', color: '#c9d1d9' }}>User API</span>
                <span style={{ background: '#161b22', border: '1px solid #30363d', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', color: '#c9d1d9' }}>Admin API</span>
              </div>
            </div>

            <div style={{ background: '#0d1117', border: '1px solid #30363d', borderRadius: '6px', padding: '10px', marginBottom: '10px' }}>
              <strong style={{ fontSize: '0.75rem', color: '#8b949e', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>DEPENDS ON</strong>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                <span style={{ background: '#161b22', border: '1px solid #30363d', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', color: '#c9d1d9' }}>JWTMiddleware</span>
                <span style={{ background: '#161b22', border: '1px solid #30363d', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', color: '#c9d1d9' }}>PostgreSQL DB</span>
              </div>
            </div>

            <div style={{ background: '#271c0c', border: '1px solid #74510b', borderRadius: '6px', padding: '10px', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#e3b341', fontWeight: '700', fontSize: '0.75rem' }}>
                  <AlertTriangle size={14} />
                  <span>CHANGE IMPACT</span>
                </div>
                <span style={{ background: '#da3633', color: '#fff', fontSize: '0.6rem', fontWeight: '800', padding: '1px 5px', borderRadius: '3px' }}>RISK: HIGH</span>
              </div>
              <p style={{ fontSize: '0.7rem', color: '#c9d1d9', margin: 0 }}>
                Potentially affected: <strong>18 components</strong>, <strong>7 APIs</strong>, <strong>12 test suites</strong>.
              </p>
            </div>

            {/* DUPLICATE FINDING PREVIEW */}
            <div style={{ background: '#0d1117', border: '1px solid #a855f766', borderRadius: '6px', padding: '10px', marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#eab308' }}>⚠ DUPLICATE DETECTED</span>
                <span style={{ fontSize: '0.65rem', background: '#a855f733', color: '#c084fc', padding: '1px 5px', borderRadius: '4px', fontWeight: '700' }}>87% match</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: '#c9d1d9', marginBottom: '6px' }}>
                Similar logic found in <code>backend/orders/OrderValidator.ts</code>
              </div>
              <button
                onClick={() => onOpenFile && onOpenFile('backend/orders/OrderValidator.ts')}
                style={{
                  width: '100%',
                  background: '#1f6feb22',
                  border: '1px solid #1f6feb66',
                  borderRadius: '4px',
                  color: '#58a6ff',
                  padding: '4px 8px',
                  fontSize: '0.72rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px'
                }}
              >
                <FileText size={12} /> View Finding (OrderValidator.ts:91-130)
              </button>
            </div>

            {/* RECENT GIT HISTORY */}
            <div style={{ background: '#0d1117', border: '1px solid #30363d', borderRadius: '6px', padding: '10px' }}>
              <strong style={{ fontSize: '0.72rem', color: '#8b949e', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>RECENT GIT HISTORY</strong>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ borderBottom: '1px solid #21262d', paddingBottom: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem' }}>
                    <code style={{ color: '#58a6ff' }}>a83f21c</code>
                    <span style={{ color: '#8b949e' }}>Rahul • Today</span>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#c9d1d9' }}>Update payment validation</div>
                </div>
                <div style={{ borderBottom: '1px solid #21262d', paddingBottom: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem' }}>
                    <code style={{ color: '#58a6ff' }}>71b92de</code>
                    <span style={{ color: '#8b949e' }}>Priya • Yesterday</span>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#c9d1d9' }}>Refactor payment API</div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem' }}>
                    <code style={{ color: '#58a6ff' }}>91af2aa</code>
                    <span style={{ color: '#8b949e' }}>Arun • Aug 19</span>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#c9d1d9' }}>Fix refund handling</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DUPLICATE CODE DETECTION */}
        {activeTab === 'duplicates' && (
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: '700', color: '#8b949e', textTransform: 'uppercase', marginBottom: '8px' }}>
              Multi-Level Duplicate Code Detection
            </div>

            {duplicatesData?.map(dup => (
              <div key={dup.id} style={{ background: '#0d1117', border: '1px solid #a855f766', borderRadius: '6px', padding: '10px', marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.65rem', background: '#a855f733', color: '#c084fc', padding: '2px 6px', borderRadius: '4px', fontWeight: '700' }}>{dup.level}</span>
                  <strong style={{ fontSize: '0.85rem', color: '#f43f5e' }}>{dup.similarity}% match</strong>
                </div>

                <div style={{ fontSize: '0.75rem', color: '#f0f6fc', marginBottom: '6px' }}>
                  <code>{dup.fileA}</code> ({dup.linesA})
                  <br />
                  <span style={{ color: '#8b949e' }}>vs</span>
                  <br />
                  <code>{dup.fileB}</code> ({dup.linesB})
                </div>

                <p style={{ fontSize: '0.7rem', color: '#8b949e', marginBottom: '8px' }}>{dup.explanation}</p>

                <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: '4px', padding: '6px', fontSize: '0.7rem', color: '#38bdf8' }}>
                  <strong>Recommendation:</strong> {dup.recommendation}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: CHANGE IMPACT ANALYSIS */}
        {activeTab === 'impact' && (
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: '700', color: '#8b949e', textTransform: 'uppercase', marginBottom: '8px' }}>
              Change Impact Analysis
            </div>

            <div style={{ background: '#0d1117', border: '1px solid #30363d', borderRadius: '6px', padding: '10px', marginBottom: '10px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#f0f6fc', marginBottom: '6px' }}>Impact Trace Graph</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {impactData?.affectedNodes?.map((node, i) => (
                  <div key={node} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem' }}>
                    <span style={{ width: '16px', height: '16px', borderRadius: '50%', background: i === 0 ? '#238636' : '#30363d', color: '#fff', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</span>
                    <span style={{ color: i === 0 ? '#58a6ff' : '#c9d1d9', fontWeight: i === 0 ? '700' : '400' }}>{node}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: '#0d1117', border: '1px solid #30363d', borderRadius: '6px', padding: '10px' }}>
              <strong style={{ fontSize: '0.75rem', color: '#f0f6fc', display: 'block', marginBottom: '6px' }}>Recommended Reviewers & Tests:</strong>
              <ul style={{ paddingLeft: '16px', margin: 0, fontSize: '0.7rem', color: '#8b949e' }}>
                {impactData?.recommendedReviewers?.map(r => <li key={r}>{r}</li>)}
                {impactData?.recommendedTests?.map(t => <li key={t} style={{ color: '#38bdf8' }}>Test: {t}</li>)}
              </ul>
            </div>
          </div>
        )}

        {/* TAB 4: AI CODE REVIEW */}
        {activeTab === 'review' && (
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: '700', color: '#8b949e', textTransform: 'uppercase', marginBottom: '8px' }}>
              AI-Assisted Code Review
            </div>

            <div style={{ background: '#0d1117', border: '1px solid #23863666', borderRadius: '6px', padding: '10px', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#3fb950', fontWeight: '700', fontSize: '0.75rem', marginBottom: '4px' }}>
                <CheckCircle2 size={14} />
                <span>0 Breaking API Regressions</span>
              </div>
              <p style={{ fontSize: '0.7rem', color: '#8b949e', margin: 0 }}>API route signatures match existing client caller contracts.</p>
            </div>

            <div style={{ background: '#0d1117', border: '1px solid #30363d', borderRadius: '6px', padding: '10px' }}>
              <strong style={{ fontSize: '0.75rem', color: '#f0f6fc', display: 'block', marginBottom: '6px' }}>Verified Evidence Findings:</strong>
              <div style={{ fontSize: '0.7rem', color: '#c9d1d9', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div>• Security: JWT expiration strategy verified in <code>JWTMiddleware.ts</code>.</div>
                <div>• Performance: SQL queries in <code>schema.sql</code> contain indexed primary keys.</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: TEAM PRESENCE */}
        {activeTab === 'presence' && (
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: '700', color: '#8b949e', textTransform: 'uppercase', marginBottom: '8px' }}>
              👥 ACTIVE DEVELOPERS ({users?.length || 0})
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {users?.map(u => (
                <div
                  key={u.id}
                  onClick={() => onOpenFile && u.activeFile && onOpenFile(u.activeFile)}
                  title={`Click to open ${u.name}'s active file (${u.activeFile})`}
                  style={{
                    background: u.id === currentUser?.id ? '#1f6feb22' : '#0d1117',
                    border: u.id === currentUser?.id ? '1px solid #1f6feb66' : '1px solid #30363d',
                    borderRadius: '6px',
                    padding: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer'
                  }}
                >
                  <img src={u.avatar} alt={u.name} style={{ width: '28px', height: '28px', borderRadius: '50%' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <strong style={{ fontSize: '0.75rem', color: '#f0f6fc' }}>{u.name}</strong>
                      <span style={{ fontSize: '0.65rem', color: '#238636', fontWeight: '700' }}>🟢 Online</span>
                    </div>
                    <div style={{ fontSize: '0.65rem', color: '#8b949e' }}>
                      {u.role}
                    </div>
                    <div style={{ fontSize: '0.65rem', color: '#58a6ff', marginTop: '2px' }}>
                      Editing: <code>{u.activeFile}</code>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
