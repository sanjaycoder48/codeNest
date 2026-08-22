import React, { useState, useEffect } from 'react';
import { TopBar } from './components/TopBar';
import { LeftSidebar } from './components/LeftSidebar';
import { CenterEditor } from './components/CenterEditor';
import { RightSidebar } from './components/RightSidebar';
import { CommitModal, PushModal, CreatePRModal, PRReviewModal, DemoTourModal, ConnectDeveloperModal, RepoSearchModal } from './components/Modals';
import { IntelligenceReport } from './components/IntelligenceReport';
import { io } from 'socket.io-client';
import {
  Github,
  GitBranch,
  Sparkles,
  CheckCircle2,
  FolderGit2,
  Search,
  Play,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Layers,
  Database,
  Terminal,
  Activity
} from 'lucide-react';

export function TwinSpaceApp() {
  const [viewState, setViewState] = useState('workspace'); // auth, repo-select, sync, workspace
  const [syncProgress, setSyncProgress] = useState(0);
  const [syncStage, setSyncStage] = useState('');

  // Domain State
  const [users, setUsers] = useState([
    { id: 'usr_vikash', username: 'Vikash', name: 'Vikash L', role: 'Owner', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces', activeFile: 'frontend/pages/Checkout.tsx', status: 'active' },
    { id: 'usr_priya', username: 'Priya', name: 'Priya Sharma', role: 'Lead Developer', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces', activeFile: 'backend/auth/AuthService.ts', status: 'active' },
    { id: 'usr_rahul', username: 'Rahul', name: 'Rahul Verma', role: 'Full-Stack Developer', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces', activeFile: 'backend/payments/PaymentService.ts', status: 'active' },
    { id: 'usr_kavin', username: 'Kavin', name: 'Kavin Kumar', role: 'Backend Engineer', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces', activeFile: 'database/schema.sql', status: 'active' },
    { id: 'usr_arun', username: 'Arun', name: 'Arun Patel', role: 'Tech Lead', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces', activeFile: 'README.md', status: 'active' },
  ]);
  const [currentUser, setCurrentUser] = useState(users[2]); // Default: Rahul

  const [repositories] = useState([
    { id: 'repo_shopsphere', name: 'ShopSphere', owner: 'demo', fullName: 'demo/ShopSphere', defaultBranch: 'main', languages: ['TypeScript', 'SQL', 'HTML/CSS', 'Dockerfile'], stars: 342, updatedAt: 'Just now', contributorsCount: 5, branchesCount: 4, openPRs: 1, isConnected: true },
    { id: 'repo_healthtrack', name: 'HealthTrack', owner: 'demo', fullName: 'demo/HealthTrack', defaultBranch: 'main', languages: ['TypeScript', 'Python'], stars: 189, updatedAt: '2 days ago', contributorsCount: 3, branchesCount: 2, openPRs: 0, isConnected: false },
    { id: 'repo_eduflow', name: 'EduFlow', owner: 'demo', fullName: 'demo/EduFlow', defaultBranch: 'main', languages: ['JavaScript', 'React'], stars: 94, updatedAt: '1 week ago', contributorsCount: 4, branchesCount: 3, openPRs: 2, isConnected: false },
    { id: 'repo_paymentcore', name: 'PaymentCore', owner: 'demo', fullName: 'demo/PaymentCore', defaultBranch: 'main', languages: ['Go', 'SQL'], stars: 512, updatedAt: '3 days ago', contributorsCount: 6, branchesCount: 5, openPRs: 1, isConnected: false },
  ]);
  const [activeRepo, setActiveRepo] = useState(repositories[0]);

  const [branches, setBranches] = useState([
    { name: 'main', isDefault: true, commit: 'a83f21c', protected: true },
    { name: 'feature/authentication', isDefault: false, commit: '71b92de', protected: false },
    { name: 'feature/payment-validation', isDefault: false, commit: 'a83f21c', protected: false },
    { name: 'bugfix/login-error', isDefault: false, commit: '91af2aa', protected: false },
  ]);
  const [currentBranch, setCurrentBranch] = useState('feature/payment-validation');

  const [files, setFiles] = useState({
    'backend/auth/AuthService.ts': `import { generateToken, verifyToken } from './JWTMiddleware';
import { Database } from '../../database/db';

export class AuthService {
  private db = new Database();

  public async authenticateUser(credentials: { email: string; passHash: string }) {
    if (!credentials.email || !credentials.passHash) {
      throw new Error('Email and password required');
    }
    const user = await this.db.query('SELECT * FROM users WHERE email = ?', [credentials.email]);
    if (!user || user.passHash !== credentials.passHash) {
      throw new Error('Invalid credentials');
    }
    const token = generateToken({ id: user.id, email: user.email, role: user.role });
    return { user, token };
  }

  public async validateSession(token: string) {
    const payload = verifyToken(token);
    return payload;
  }
}`,
    'backend/payments/PaymentService.ts': `import { validatePaymentDetails } from './PaymentValidator';

export interface PaymentRequest {
  orderId: string;
  amount: number;
  currency: string;
  cardToken: string;
}

export class PaymentService {
  public async processPayment(req: PaymentRequest) {
    // TwinSpace Live Edit Buffer
    const isValid = validatePaymentDetails(req);
    if (!isValid) {
      throw new Error('Invalid payment request parameters');
    }
    
    // Process transaction securely
    console.log(\`Processing payment \${req.amount} \${req.currency} for order \${req.orderId}\`);
    return { status: 'SUCCESS', transactionId: 'tx_' + Math.random().toString(36).substring(2, 9) };
  }

  public async refundPayment(transactionId: string, amount: number) {
    if (amount <= 0) throw new Error('Refund amount must be positive');
    return { status: 'REFUNDED', transactionId, amount };
  }
}`,
    'backend/payments/PaymentValidator.ts': `export function validatePaymentDetails(req: any): boolean {
  if (!req.orderId || typeof req.orderId !== 'string') return false;
  if (!req.amount || req.amount <= 0) return false;
  if (!req.currency || req.currency.length !== 3) return false;
  if (!req.cardToken || req.cardToken.length < 10) return false;
  return true;
}`,
    'backend/orders/OrderValidator.ts': `export function validateOrderItems(req: any): boolean {
  if (!req.orderId || typeof req.orderId !== 'string') return false;
  if (!req.amount || req.amount <= 0) return false;
  if (!req.currency || req.currency.length !== 3) return false;
  if (!req.cardToken || req.cardToken.length < 10) return false;
  return true;
}`,
    'database/schema.sql': `CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  pass_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) REFERENCES users(id),
  total_amount NUMERIC(10, 2) NOT NULL,
  status VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`,
    'frontend/pages/Checkout.tsx': `import React from 'react';

export function Checkout() {
  return <div>Checkout Flow Connected to PaymentService</div>;
}`,
    'package.json': `{\n  "name": "shopsphere",\n  "version": "1.2.0",\n  "dependencies": {\n    "express": "^4.19.2",\n    "jsonwebtoken": "^9.0.2",\n    "pg": "^8.11.5"\n  }\n}`,
    'README.md': `# ShopSphere\nConnected to Project Twin & TwinSpace.`
  });

  const [openTabs, setOpenTabs] = useState([
    'backend/payments/PaymentService.ts',
    'backend/auth/AuthService.ts',
    'database/schema.sql'
  ]);
  const [activeTabPath, setActiveTabPath] = useState('backend/payments/PaymentService.ts');

  const [commits, setCommits] = useState([
    { hash: 'a83f21c', message: 'Update payment validation logic and error guards', author: 'Rahul', timestamp: '15 minutes ago', branch: 'feature/payment-validation', filesChanged: 3, additions: 42, deletions: 11 },
    { hash: '71b92de', message: 'Refactor payment API session validation', author: 'Priya', timestamp: '2 hours ago', branch: 'feature/authentication', filesChanged: 2, additions: 28, deletions: 5 },
    { hash: '91af2aa', message: 'Fix refund handling boundary check in OrderService', author: 'Arun', timestamp: 'Yesterday', branch: 'main', filesChanged: 1, additions: 14, deletions: 2 },
  ]);

  const [pullRequests, setPullRequests] = useState([
    {
      id: 42,
      number: 42,
      title: 'Add payment validation and token security checks',
      author: 'Rahul',
      sourceBranch: 'feature/payment-validation',
      targetBranch: 'main',
      status: 'Open',
      createdAt: 'Just now',
      summary: '3 files changed (+42 / -11), 6 APIs potentially affected, 1 duplicate implementation detected.',
      risk: 'MEDIUM',
      commits: ['a83f21c'],
      reviews: [{ author: 'Arun', state: 'Approved', comment: 'Looks solid. Code impact analysis confirms tests pass.' }]
    }
  ]);

  const [tasks, setTasks] = useState([
    { id: 'TASK-42', title: 'Add payment validation & duplicate code cleanup', assignedTo: 'Rahul', branch: 'feature/payment-validation', status: 'In Progress', priority: 'High' },
    { id: 'TASK-43', title: 'Implement JWT refresh token rotation', assignedTo: 'Priya', branch: 'feature/authentication', status: 'In Progress', priority: 'Medium' },
    { id: 'TASK-44', title: 'Optimize SQL index on orders table', assignedTo: 'Kavin', branch: 'main', status: 'Completed', priority: 'Low' },
  ]);

  const [activities, setActivities] = useState([
    { id: 'act_1', user: 'Rahul', action: 'pushed commit a83f21c', target: 'feature/payment-validation', timestamp: '15 mins ago' },
    { id: 'act_2', user: 'Priya', action: 'opened Pull Request #42', target: 'Add payment validation', timestamp: '30 mins ago' },
    { id: 'act_3', user: 'Arun', action: 'approved Pull Request #42', target: 'PR #42', timestamp: '1 hour ago' },
  ]);

  // Modal Controls
  const [commitModalOpen, setCommitModalOpen] = useState(false);
  const [pushModalOpen, setPushModalOpen] = useState(false);
  const [createPRModalOpen, setCreatePRModalOpen] = useState(false);
  const [selectedPR, setSelectedPR] = useState(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [tourModalOpen, setTourModalOpen] = useState(false);
  const [connectDevModalOpen, setConnectDevModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchModalOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleDeveloperConnected = (newDev) => {
    setUsers(prev => {
      const exists = prev.some(u => u.id === newDev.id || u.username.toLowerCase() === newDev.username.toLowerCase());
      if (exists) return prev.map(u => (u.id === newDev.id || u.username.toLowerCase() === newDev.username.toLowerCase()) ? newDev : u);
      return [...prev, newDev];
    });
    setCurrentUser(newDev);
    setActivities(prev => [
      { id: 'act_' + Date.now(), user: newDev.username, action: 'connected GitHub developer profile', target: newDev.name, timestamp: 'Just now' },
      ...prev
    ]);
  };

  // Sync animation handler
  const startRepoSync = (repo) => {
    setActiveRepo(repo);
    setViewState('sync');
    setSyncProgress(10);
    setSyncStage('Downloading repository metadata');

    setTimeout(() => { setSyncProgress(30); setSyncStage('Indexing files'); }, 400);
    setTimeout(() => { setSyncProgress(55); setSyncStage('Reading Git history'); }, 800);
    setTimeout(() => { setSyncProgress(75); setSyncStage('Detecting dependencies & mapping components'); }, 1200);
    setTimeout(() => { setSyncProgress(100); setSyncStage('Building project relationships'); }, 1600);
    setTimeout(() => { setViewState('workspace'); }, 2000);
  };

  // Tab Handlers
  const handleOpenFile = (filePath, initialContent = '') => {
    if (!openTabs.includes(filePath)) {
      setOpenTabs([...openTabs, filePath]);
    }
    setActiveTabPath(filePath);
    if (initialContent && files[filePath] === undefined) {
      setFiles({ ...files, [filePath]: initialContent });
    }
  };

  const handleCloseTab = (filePath) => {
    const nextTabs = openTabs.filter(t => t !== filePath);
    setOpenTabs(nextTabs);
    if (activeTabPath === filePath) {
      setActiveTabPath(nextTabs[nextTabs.length - 1] || '');
    }
  };

  const handleChangeContent = (filePath, newContent) => {
    setFiles({ ...files, [filePath]: newContent });
  };

  // Branch Handlers
  const handleCreateBranch = (branchName) => {
    if (!branches.some(b => b.name === branchName)) {
      const nextBranches = [...branches, { name: branchName, isDefault: false, commit: 'a83f21c', protected: false }];
      setBranches(nextBranches);
      setCurrentBranch(branchName);
    }
  };

  // Commit & Push Handlers
  const handleCommit = (commitMessage) => {
    const hash = Math.random().toString(16).substring(2, 9);
    const newCommit = {
      hash,
      message: commitMessage,
      author: currentUser.name,
      timestamp: 'Just now',
      branch: currentBranch,
      filesChanged: 2,
      additions: 15,
      deletions: 3
    };
    setCommits([newCommit, ...commits]);
    setActivities([{ id: 'act_' + Date.now(), user: currentUser.name, action: `committed ${hash}`, target: commitMessage, timestamp: 'Just now' }, ...activities]);
  };

  const handlePush = () => {
    setActivities([{ id: 'act_' + Date.now(), user: currentUser.name, action: `pushed branch`, target: currentBranch, timestamp: 'Just now' }, ...activities]);
  };

  const handleCreatePR = (prData) => {
    const newPR = {
      id: pullRequests.length + 42,
      number: pullRequests.length + 42,
      title: prData.title,
      author: prData.author,
      sourceBranch: prData.sourceBranch,
      targetBranch: prData.targetBranch,
      status: 'Open',
      createdAt: 'Just now',
      summary: prData.summary,
      risk: prData.risk,
      commits: ['a83f21c'],
      reviews: []
    };
    setPullRequests([newPR, ...pullRequests]);
    setActivities([{ id: 'act_' + Date.now(), user: prData.author, action: `opened Pull Request #${newPR.number}`, target: newPR.title, timestamp: 'Just now' }, ...activities]);
  };

  const handleMergePR = (prNumber) => {
    setPullRequests(pullRequests.map(p => p.number === prNumber ? { ...p, status: 'Merged' } : p));
    setActivities([{ id: 'act_' + Date.now(), user: currentUser.name, action: `merged Pull Request #${prNumber}`, target: `PR #${prNumber}`, timestamp: 'Just now' }, ...activities]);
  };

  const handleCreateTask = (taskData) => {
    const newTask = {
      id: `TASK-${tasks.length + 42}`,
      ...taskData,
      status: 'In Progress'
    };
    setTasks([newTask, ...tasks]);
  };

  // Socket.IO Real-time Connection
  useEffect(() => {
    try {
      const socket = io();
      socket.emit('join-room', { user: currentUser });
      socket.emit('active-file', { user: currentUser, activeFile: activeTabPath });
      return () => socket.disconnect();
    } catch {
      // Graceful fallback
    }
  }, [currentUser, activeTabPath]);

  return (
    <div className="twinspace-app-container" style={{ width: '100%', height: '100%', background: '#0d1117', color: '#c9d1d9', display: 'flex', flexDirection: 'column', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {/* VIEW 1: REPOSITORY SELECTION SCREEN */}
      {viewState === 'repo-select' && (
        <div style={{ flex: 1, padding: '40px 20px', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#1f6feb22', color: '#58a6ff', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', marginBottom: '12px' }}>
              <Github size={14} /> GITHUB REPOSITORIES
            </div>
            <h1 style={{ fontSize: '2rem', color: '#f0f6fc', fontWeight: '800', margin: 0 }}>Select a GitHub Repository for TwinSpace</h1>
            <p style={{ color: '#8b949e', fontSize: '0.95rem', marginTop: '6px' }}>Project Twin will index repository metadata and launch the collaborative workspace.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '16px' }}>
            {repositories.map(repo => (
              <div key={repo.id} style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: '10px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <strong style={{ fontSize: '1.1rem', color: '#58a6ff' }}>{repo.fullName}</strong>
                    <span style={{ fontSize: '0.7rem', background: '#30363d', color: '#c9d1d9', padding: '2px 8px', borderRadius: '12px' }}>★ {repo.stars}</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#8b949e', marginBottom: '16px' }}>
                    Default branch: <code>{repo.defaultBranch}</code> | {repo.contributorsCount} contributors
                  </p>
                  <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
                    {repo.languages.map(l => <span key={l} style={{ fontSize: '0.7rem', background: '#0d1117', border: '1px solid #30363d', padding: '2px 6px', borderRadius: '4px' }}>{l}</span>)}
                  </div>
                </div>

                <button
                  onClick={() => startRepoSync(repo)}
                  style={{ width: '100%', background: '#238636', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '10px', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <Sparkles size={16} /> OPEN IN TWINSPACE
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 2: SYNCHRONIZATION SCREEN */}
      {viewState === 'sync' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '20px' }}>
          <FolderGit2 size={48} style={{ color: '#58a6ff', marginBottom: '16px' }} className="spin" />
          <h2 style={{ fontSize: '1.5rem', color: '#f0f6fc', fontWeight: '700', marginBottom: '8px' }}>SYNCING REPOSITORY — {activeRepo?.name}</h2>
          <p style={{ color: '#8b949e', fontSize: '0.9rem', marginBottom: '24px' }}>Project Twin is indexing codebase metadata and relationship graphs...</p>

          <div style={{ width: '400px', height: '8px', background: '#21262d', borderRadius: '4px', overflow: 'hidden', marginBottom: '16px' }}>
            <div style={{ width: `${syncProgress}%`, height: '100%', background: 'linear-gradient(90deg, #6366f1, #a855f7)', transition: 'width 0.3s ease' }} />
          </div>

          <div style={{ fontSize: '0.8rem', color: '#3fb950', fontWeight: '600' }}>✓ {syncStage}</div>
        </div>
      )}

      {/* VIEW 3: MAIN TWINSPACE WORKSPACE */}
      {viewState === 'workspace' && (
        <>
          <TopBar
            currentUser={currentUser}
            users={users}
            onSwitchUser={setCurrentUser}
            repo={activeRepo}
            branches={branches}
            currentBranch={currentBranch}
            onSelectBranch={setCurrentBranch}
            onCreateBranch={handleCreateBranch}
            onOpenCommit={() => setCommitModalOpen(true)}
            onOpenPush={() => setPushModalOpen(true)}
            onOpenPR={() => setCreatePRModalOpen(true)}
            onOpenReport={() => setReportModalOpen(true)}
            onOpenDemoTour={() => setTourModalOpen(true)}
            onOpenConnectDev={() => setConnectDevModalOpen(true)}
            onSearch={() => setSearchModalOpen(true)}
          />

          <div style={{ flex: 1, display: 'flex', overflow: 'hidden', width: '100%' }}>
            <LeftSidebar
              files={files}
              activeFile={activeTabPath}
              onOpenFile={handleOpenFile}
              branches={branches}
              currentBranch={currentBranch}
              onSelectBranch={setCurrentBranch}
              onCreateBranch={handleCreateBranch}
              commits={commits}
              pullRequests={pullRequests}
              onOpenPRDetails={setSelectedPR}
              tasks={tasks}
              onCreateTask={handleCreateTask}
              activities={activities}
            />

            <CenterEditor
              openTabs={openTabs}
              activeTabPath={activeTabPath}
              onSelectTab={setActiveTabPath}
              onCloseTab={handleCloseTab}
              fileContent={files[activeTabPath]}
              onChangeContent={handleChangeContent}
              activeCollaborators={users}
              currentUser={currentUser}
            />

            <RightSidebar
              activeFile={activeTabPath}
              impactData={{
                affectedNodes: ['AuthService.ts', 'JWTMiddleware.ts', 'POST /api/auth/login', 'User Service', 'Admin API', 'Protected Client Routes'],
                recommendedReviewers: ['Arun (Tech Lead)', 'Priya (Security Lead)'],
                recommendedTests: ['auth.integration.test.ts', 'jwt.rotation.test.ts', 'session.expire.test.ts']
              }}
              duplicatesData={[
                {
                  id: 'dup_1',
                  level: 'LEVEL 4: Functional & Structural Duplication',
                  similarity: 87,
                  fileA: 'backend/payments/PaymentValidator.ts',
                  linesA: 'lines 1–6',
                  fileB: 'backend/orders/OrderValidator.ts',
                  linesB: 'lines 1–6',
                  type: 'Functional duplication',
                  explanation: 'Both functions perform identical parameter validation on orderId, amount, currency, and cardToken structures.',
                  recommendation: 'Extract shared validation logic into a centralized ValidationService module.'
                }
              ]}
              users={users}
              currentUser={currentUser}
            />
          </div>
        </>
      )}

      {/* Modals & Dialogs */}
      <CommitModal open={commitModalOpen} onClose={() => setCommitModalOpen(false)} onCommit={handleCommit} currentBranch={currentBranch} currentUser={currentUser} />
      <PushModal open={pushModalOpen} onClose={() => setPushModalOpen(false)} onPush={handlePush} currentBranch={currentBranch} />
      <CreatePRModal open={createPRModalOpen} onClose={() => setCreatePRModalOpen(false)} onCreatePR={handleCreatePR} currentBranch={currentBranch} currentUser={currentUser} />
      <PRReviewModal pr={selectedPR} open={!!selectedPR} onClose={() => setSelectedPR(null)} onMerge={handleMergePR} />
      <IntelligenceReport open={reportModalOpen} onClose={() => setReportModalOpen(false)} />
      <DemoTourModal open={tourModalOpen} onClose={() => setTourModalOpen(false)} />
      <ConnectDeveloperModal open={connectDevModalOpen} onClose={() => setConnectDevModalOpen(false)} onDeveloperConnected={handleDeveloperConnected} />
      <RepoSearchModal open={searchModalOpen} onClose={() => setSearchModalOpen(false)} files={files} onOpenFile={handleOpenFile} />
    </div>
  );
}
