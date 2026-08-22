import React, { useState } from 'react';
import {
  GitCommit,
  UploadCloud,
  GitPullRequest,
  CheckCircle2,
  AlertTriangle,
  X,
  Play,
  ArrowRight,
  ShieldCheck,
  Bot,
  FileText,
  Download
} from 'lucide-react';

export function CommitModal({ open, onClose, onCommit, currentBranch, currentUser }) {
  const [message, setMessage] = useState('');

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onCommit(message.trim());
      setMessage('');
      onClose();
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: '12px', width: '480px', padding: '20px', color: '#c9d1d9' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <GitCommit size={18} style={{ color: '#a855f7' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#f0f6fc', margin: 0 }}>Commit Changes to TwinSpace</h3>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#8b949e', cursor: 'pointer' }}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ fontSize: '0.75rem', color: '#8b949e', marginBottom: '8px' }}>
            Author: <strong>{currentUser?.name || 'Rahul'}</strong> | Branch: <strong style={{ color: '#58a6ff' }}>{currentBranch}</strong>
          </div>

          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', marginBottom: '6px' }}>Commit Message</label>
          <textarea
            rows={3}
            placeholder="e.g. Add payment validation and duplicate code cleanup"
            value={message}
            onChange={e => setMessage(e.target.value)}
            style={{ width: '100%', background: '#0d1117', border: '1px solid #30363d', borderRadius: '6px', color: '#c9d1d9', padding: '8px', fontSize: '0.8rem', marginBottom: '16px' }}
            required
            autoFocus
          />

          <div style={{ background: '#0d1117', border: '1px solid #30363d', borderRadius: '6px', padding: '10px', marginBottom: '16px', fontSize: '0.75rem' }}>
            <strong>Staged Changes:</strong> 3 files modified (+42 / -11)
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button type="button" onClick={onClose} style={{ background: '#21262d', border: '1px solid #30363d', color: '#c9d1d9', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
            <button type="submit" style={{ background: '#a855f7', border: 'none', color: '#ffffff', padding: '6px 16px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>Commit Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function PushModal({ open, onClose, onPush, currentBranch }) {
  const [step, setStep] = useState(0); // 0: initial, 1: pushing, 2: complete

  if (!open) return null;

  const handleStartPush = () => {
    setStep(1);
    setTimeout(() => {
      onPush();
      setStep(2);
    }, 1500);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: '12px', width: '460px', padding: '20px', color: '#c9d1d9' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UploadCloud size={18} style={{ color: '#38bdf8' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#f0f6fc', margin: 0 }}>Push Branch to GitHub</h3>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#8b949e', cursor: 'pointer' }}><X size={18} /></button>
        </div>

        {step === 0 && (
          <div>
            <p style={{ fontSize: '0.85rem', color: '#c9d1d9', marginBottom: '16px' }}>
              Push branch <strong style={{ color: '#58a6ff' }}>{currentBranch}</strong> to remote repository <code>origin</code> on GitHub.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button onClick={onClose} style={{ background: '#21262d', border: '1px solid #30363d', color: '#c9d1d9', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleStartPush} style={{ background: '#238636', border: 'none', color: '#ffffff', padding: '6px 16px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>Push to GitHub</button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <UploadCloud size={32} style={{ color: '#38bdf8', marginBottom: '10px' }} className="spin" />
            <div style={{ fontSize: '0.9rem', color: '#f0f6fc', fontWeight: '600' }}>Preparing objects & pushing to GitHub...</div>
            <div style={{ fontSize: '0.75rem', color: '#8b949e', marginTop: '4px' }}>Updating remote reference <code>origin/{currentBranch}</code></div>
          </div>
        )}

        {step === 2 && (
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <CheckCircle2 size={36} style={{ color: '#3fb950', marginBottom: '10px' }} />
            <h4 style={{ fontSize: '1rem', color: '#f0f6fc', margin: 0, marginBottom: '6px' }}>Successfully Pushed to GitHub!</h4>
            <p style={{ fontSize: '0.8rem', color: '#8b949e', marginBottom: '16px' }}>Branch <code>{currentBranch}</code> is up to date on <code>origin</code>.</p>
            <button onClick={onClose} style={{ background: '#238636', border: 'none', color: '#ffffff', padding: '6px 20px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>Done</button>
          </div>
        )}
      </div>
    </div>
  );
}

export function CreatePRModal({ open, onClose, onCreatePR, currentBranch, currentUser }) {
  const [title, setTitle] = useState('Add payment validation and token security checks');
  const [targetBranch] = useState('main');

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreatePR({
      title,
      author: currentUser?.name || 'Rahul',
      sourceBranch: currentBranch,
      targetBranch,
      summary: '3 files changed (+42 / -11), 6 APIs affected, 1 duplicate implementation detected.',
      risk: 'MEDIUM'
    });
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: '12px', width: '540px', padding: '20px', color: '#c9d1d9' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <GitPullRequest size={18} style={{ color: '#238636' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#f0f6fc', margin: 0 }}>Create Pull Request</h3>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#8b949e', cursor: 'pointer' }}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ background: '#0d1117', border: '1px solid #30363d', borderRadius: '6px', padding: '10px', marginBottom: '14px', fontSize: '0.8rem' }}>
            Merging <strong style={{ color: '#58a6ff' }}>{currentBranch}</strong> into <strong style={{ color: '#238636' }}>{targetBranch}</strong>
          </div>

          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', marginBottom: '4px' }}>PR Title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            style={{ width: '100%', background: '#0d1117', border: '1px solid #30363d', borderRadius: '6px', color: '#c9d1d9', padding: '8px', fontSize: '0.8rem', marginBottom: '14px' }}
            required
          />

          <div style={{ background: '#161b22', border: '1px solid #23863666', borderRadius: '6px', padding: '10px', marginBottom: '16px' }}>
            <strong style={{ fontSize: '0.75rem', color: '#3fb950', display: 'block', marginBottom: '4px' }}>AI-Generated PR Intelligence Summary:</strong>
            <p style={{ fontSize: '0.75rem', color: '#c9d1d9', margin: 0 }}>
              • 3 files modified (+42 additions, -11 deletions)<br />
              • 6 APIs & 12 unit tests potentially affected<br />
              • 1 functional duplication detected between PaymentValidator and OrderValidator<br />
              • Risk Level: <strong>MEDIUM</strong>
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button type="button" onClick={onClose} style={{ background: '#21262d', border: '1px solid #30363d', color: '#c9d1d9', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
            <button type="submit" style={{ background: '#238636', border: 'none', color: '#ffffff', padding: '6px 18px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>Create Pull Request</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function PRReviewModal({ pr, open, onClose, onMerge }) {
  const [activeTab, setActiveTab] = useState('overview'); // overview, files, ai, merge
  const [merged, setMerged] = useState(pr?.status === 'Merged');

  if (!open || !pr) return null;

  const handleMergeSubmit = () => {
    onMerge(pr.number);
    setMerged(true);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: '12px', width: '680px', maxHeight: '85vh', display: 'flex', flexDirection: 'column', color: '#c9d1d9' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #30363d', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ background: merged ? '#8957e533' : '#23863633', color: merged ? '#a855f7' : '#3fb950', padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: '700' }}>
                {merged ? 'Merged' : 'Open'}
              </span>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#f0f6fc', margin: 0 }}>#{pr.number}: {pr.title}</h3>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#8b949e', marginTop: '4px' }}>
              {pr.sourceBranch} → {pr.targetBranch} by {pr.author}
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#8b949e', cursor: 'pointer' }}><X size={20} /></button>
        </div>

        <div style={{ display: 'flex', gap: '16px', padding: '0 20px', borderBottom: '1px solid #30363d', background: '#0d1117' }}>
          {['overview', 'files', 'ai', 'merge'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: 'transparent',
                border: 'none',
                borderBottom: activeTab === tab ? '2px solid #58a6ff' : '2px solid transparent',
                color: activeTab === tab ? '#58a6ff' : '#8b949e',
                padding: '8px 0',
                fontSize: '0.8rem',
                fontWeight: '600',
                textTransform: 'capitalize',
                cursor: 'pointer'
              }}
            >
              {tab === 'ai' ? 'AI Review' : tab}
            </button>
          ))}
        </div>

        <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
          {activeTab === 'overview' && (
            <div>
              <h4 style={{ fontSize: '0.9rem', color: '#f0f6fc', marginBottom: '8px' }}>Pull Request Summary</h4>
              <p style={{ fontSize: '0.8rem', color: '#c9d1d9', background: '#0d1117', padding: '12px', borderRadius: '6px', border: '1px solid #30363d' }}>
                {pr.summary}
              </p>

              <h4 style={{ fontSize: '0.9rem', color: '#f0f6fc', marginTop: '16px', marginBottom: '8px' }}>Reviews & Approvals</h4>
              {pr.reviews?.map((r, i) => (
                <div key={i} style={{ background: '#0d1117', border: '1px solid #23863666', padding: '8px 12px', borderRadius: '6px', fontSize: '0.8rem', marginBottom: '6px' }}>
                  <strong style={{ color: '#3fb950' }}>{r.author}</strong> ({r.state}): &quot;{r.comment}&quot;
                </div>
              ))}
            </div>
          )}

          {activeTab === 'files' && (
            <div style={{ fontSize: '0.8rem' }}>
              <div style={{ background: '#0d1117', border: '1px solid #30363d', padding: '10px', borderRadius: '6px', marginBottom: '8px' }}>
                <strong style={{ color: '#58a6ff' }}>backend/payments/PaymentService.ts</strong> (+18, -4)
              </div>
              <div style={{ background: '#0d1117', border: '1px solid #30363d', padding: '10px', borderRadius: '6px', marginBottom: '8px' }}>
                <strong style={{ color: '#58a6ff' }}>backend/payments/PaymentValidator.ts</strong> (+14, -2)
              </div>
              <div style={{ background: '#0d1117', border: '1px solid #30363d', padding: '10px', borderRadius: '6px' }}>
                <strong style={{ color: '#58a6ff' }}>frontend/pages/Checkout.tsx</strong> (+10, -5)
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div style={{ background: '#0d1117', border: '1px solid #a855f766', padding: '12px', borderRadius: '8px', fontSize: '0.8rem' }}>
              <h4 style={{ color: '#c084fc', margin: 0, marginBottom: '8px' }}>Project Twin Change Impact Report</h4>
              <div>• 0 Breaking API regressions detected.</div>
              <div>• 1 Functional duplicate detected (PaymentValidator vs OrderValidator).</div>
              <div>• Recommended tests: <code>payment.charge.test.ts</code> (All 9 tests passing).</div>
            </div>
          )}

          {activeTab === 'merge' && (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              {merged ? (
                <div>
                  <CheckCircle2 size={42} style={{ color: '#a855f7', marginBottom: '10px' }} />
                  <h3 style={{ fontSize: '1.1rem', color: '#f0f6fc' }}>Pull Request Merged!</h3>
                  <p style={{ fontSize: '0.8rem', color: '#8b949e' }}>Project Twin is re-syncing main branch intelligence.</p>
                </div>
              ) : (
                <div>
                  <GitPullRequest size={42} style={{ color: '#238636', marginBottom: '10px' }} />
                  <h3 style={{ fontSize: '1.1rem', color: '#f0f6fc', marginBottom: '8px' }}>Ready to Merge into Main</h3>
                  <p style={{ fontSize: '0.8rem', color: '#8b949e', marginBottom: '20px' }}>All AI change impact checks passed. Human lead approval verified.</p>
                  <button onClick={handleMergeSubmit} style={{ background: '#238636', color: '#fff', border: 'none', borderRadius: '6px', padding: '8px 24px', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer' }}>
                    Confirm & Merge Pull Request
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function DemoTourModal({ open, onClose }) {
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#161b22', border: '1px solid #a855f766', borderRadius: '12px', width: '560px', padding: '24px', color: '#c9d1d9' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#f0f6fc', margin: 0 }}>Hackathon Continuous Demo Tour (3–5 mins)</h3>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#8b949e', cursor: 'pointer' }}><X size={20} /></button>
        </div>
        <p style={{ fontSize: '0.85rem', color: '#8b949e', marginBottom: '16px' }}>Follow this continuous live demonstration flow:</p>
        <div style={{ background: '#0d1117', border: '1px solid #30363d', borderRadius: '8px', padding: '14px', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div>1. <strong>GitHub Login</strong> → Switch active developer (Rahul / Priya / Arun).</div>
          <div>2. <strong>Repo Sync</strong> → Select ShopSphere repository and view 6 sync stages.</div>
          <div>3. <strong>Branching</strong> → Create branch <code>feature/payment-validation</code>.</div>
          <div>4. <strong>Monaco Editor</strong> → Open <code>PaymentService.ts</code> & edit validation code.</div>
          <div>5. <strong>Project Twin Intelligence</strong> → Inspect duplicate detection (87% match with OrderValidator).</div>
          <div>6. <strong>Impact Analysis</strong> → Trace changes to 18 components, 7 APIs, 12 test suites.</div>
          <div>7. <strong>Commit & Push</strong> → Commit changes & push branch to <code>origin</code>.</div>
          <div>8. <strong>PR & Review</strong> → Open PR #42, review AI impact summary, approve & merge into main.</div>
        </div>
        <button onClick={onClose} style={{ width: '100%', marginTop: '20px', background: '#a855f7', color: '#fff', border: 'none', borderRadius: '6px', padding: '10px', fontWeight: '700', cursor: 'pointer' }}>
          Start Live Interactive Demo
        </button>
      </div>
    </div>
  );
}
