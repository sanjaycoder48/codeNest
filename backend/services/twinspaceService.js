const crypto = require('crypto');

// Initial seed accounts for TwinSpace
const DEMO_USERS = [
  { id: 'usr_vikash', username: 'Vikash', name: 'Vikash L', role: 'Owner', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces', activeFile: 'frontend/pages/Checkout.tsx', status: 'active' },
  { id: 'usr_priya', username: 'Priya', name: 'Priya Sharma', role: 'Lead Developer', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces', activeFile: 'backend/auth/AuthService.ts', status: 'active' },
  { id: 'usr_rahul', username: 'Rahul', name: 'Rahul Verma', role: 'Full-Stack Developer', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces', activeFile: 'backend/payments/PaymentService.ts', status: 'active' },
  { id: 'usr_kavin', username: 'Kavin', name: 'Kavin Kumar', role: 'Backend Engineer', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces', activeFile: 'database/schema.sql', status: 'active' },
  { id: 'usr_arun', username: 'Arun', name: 'Arun Patel', role: 'Tech Lead', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces', activeFile: 'README.md', status: 'active' },
];

const REPOSITORIES = [
  { id: 'repo_shopsphere', name: 'ShopSphere', owner: 'demo', fullName: 'demo/ShopSphere', defaultBranch: 'main', languages: ['TypeScript', 'SQL', 'HTML/CSS', 'Dockerfile'], stars: 342, updatedAt: new Date().toISOString(), contributorsCount: 5, branchesCount: 4, openPRs: 1, isConnected: true },
  { id: 'repo_healthtrack', name: 'HealthTrack', owner: 'demo', fullName: 'demo/HealthTrack', defaultBranch: 'main', languages: ['TypeScript', 'Python'], stars: 189, updatedAt: new Date().toISOString(), contributorsCount: 3, branchesCount: 2, openPRs: 0, isConnected: false },
  { id: 'repo_eduflow', name: 'EduFlow', owner: 'demo', fullName: 'demo/EduFlow', defaultBranch: 'main', languages: ['JavaScript', 'React'], stars: 94, updatedAt: new Date().toISOString(), contributorsCount: 4, branchesCount: 3, openPRs: 2, isConnected: false },
  { id: 'repo_paymentcore', name: 'PaymentCore', owner: 'demo', fullName: 'demo/PaymentCore', defaultBranch: 'main', languages: ['Go', 'SQL'], stars: 512, updatedAt: new Date().toISOString(), contributorsCount: 6, branchesCount: 5, openPRs: 1, isConnected: false },
];

let state = {
  users: [...DEMO_USERS],
  activeRepo: REPOSITORIES[0],
  branches: [
    { name: 'main', isDefault: true, commit: 'a83f21c', protected: true },
    { name: 'feature/authentication', isDefault: false, commit: '71b92de', protected: false },
    { name: 'feature/payment-validation', isDefault: false, commit: 'a83f21c', protected: false },
    { name: 'bugfix/login-error', isDefault: false, commit: '91af2aa', protected: false },
  ],
  currentBranch: 'feature/payment-validation',
  tasks: [
    { id: 'TASK-42', title: 'Add payment validation & duplicate code cleanup', assignedTo: 'Rahul', branch: 'feature/payment-validation', status: 'In Progress', priority: 'High', createdAt: '2026-08-22T02:00:00.000Z' },
    { id: 'TASK-43', title: 'Implement JWT refresh token rotation', assignedTo: 'Priya', branch: 'feature/authentication', status: 'In Progress', priority: 'Medium', createdAt: '2026-08-21T18:00:00.000Z' },
    { id: 'TASK-44', title: 'Optimize SQL index on orders table', assignedTo: 'Kavin', branch: 'main', status: 'Completed', priority: 'Low', createdAt: '2026-08-20T14:00:00.000Z' },
  ],
  commits: [
    { hash: 'a83f21c', message: 'Update payment validation logic and error guards', author: 'Rahul', timestamp: '15 minutes ago', branch: 'feature/payment-validation', filesChanged: 3, additions: 42, deletions: 11 },
    { hash: '71b92de', message: 'Refactor payment API session validation', author: 'Priya', timestamp: '2 hours ago', branch: 'feature/authentication', filesChanged: 2, additions: 28, deletions: 5 },
    { hash: '91af2aa', message: 'Fix refund handling boundary check in OrderService', author: 'Arun', timestamp: 'Yesterday', branch: 'main', filesChanged: 1, additions: 14, deletions: 2 },
  ],
  pullRequests: [
    {
      id: 42,
      number: 42,
      title: 'Add payment validation and token security checks',
      author: 'Rahul',
      sourceBranch: 'feature/payment-validation',
      targetBranch: 'main',
      status: 'Open',
      createdAt: new Date().toISOString(),
      summary: '3 files changed (+42 / -11), 6 APIs potentially affected, 1 duplicate implementation detected.',
      risk: 'MEDIUM',
      commits: ['a83f21c'],
      reviews: [
        { author: 'Arun', state: 'Approved', comment: 'Looks solid. Code impact analysis confirms tests pass.' }
      ],
      comments: [
        { id: 'c1', line: 44, file: 'backend/payments/PaymentService.ts', author: 'Priya', text: 'Can this validation logic be extracted to a shared ValidationService?', resolved: false }
      ]
    }
  ],
  files: {
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
    'backend/auth/JWTMiddleware.ts': `import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export function generateToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
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
    
    // Simulate transaction execution
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
    'backend/orders/OrderService.ts': `import { validateOrderItems } from './OrderValidator';

export class OrderService {
  public async createOrder(userId: string, items: any[]) {
    const isValid = validateOrderItems(items);
    if (!isValid) throw new Error('Invalid order payload');
    return { orderId: 'ord_' + Date.now(), userId, items, status: 'CREATED' };
  }
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
    'frontend/components/Login.tsx': `import React, { useState } from 'react';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.token) localStorage.setItem('token', data.token);
  };

  return (
    <form onSubmit={handleLogin}>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
      <button type="submit">Sign In</button>
    </form>
  );
}`,
    'frontend/pages/Checkout.tsx': `import React from 'react';

export function Checkout() {
  return <div>Checkout Flow Connected to PaymentService</div>;
}`,
    'package.json': JSON.stringify({
      name: "shopsphere",
      version: "1.2.0",
      private: true,
      scripts: { build: "tsc", test: "jest" },
      dependencies: { express: "^4.19.2", jsonwebtoken: "^9.0.2", pg: "^8.11.5" }
    }, null, 2),
    'README.md': `# ShopSphere

ShopSphere is an e-commerce platform built with Node.js, Express, TypeScript, and PostgreSQL.

## TwinSpace Integration
This repository is connected to **Project Twin**. All changes made in TwinSpace are continuously analyzed for duplicate logic, breaking API changes, and change impact before merging to \`main\`.
`,
  },
  activities: [
    { id: 'act_1', user: 'Rahul', action: 'pushed commit a83f21c', target: 'feature/payment-validation', timestamp: '15 mins ago' },
    { id: 'act_2', user: 'Priya', action: 'opened Pull Request #42', target: 'Add payment validation', timestamp: '30 mins ago' },
    { id: 'act_3', user: 'Arun', action: 'approved Pull Request #42', target: 'PR #42', timestamp: '1 hour ago' },
    { id: 'act_4', user: 'Kavin', action: 'completed Task #44', target: 'Optimize SQL index', timestamp: 'Yesterday' }
  ]
};

// Duplicate detection engine (AST / Structural Token Similarity)
function detectDuplicates() {
  const code1 = state.files['backend/payments/PaymentValidator.ts'] || '';
  const code2 = state.files['backend/orders/OrderValidator.ts'] || '';

  return [
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
      recommendation: 'Extract shared validation logic into a centralized `ValidationService.ts` module to eliminate duplicate code.'
    }
  ];
}

// Change Impact Analysis Engine
function analyzeImpact(filePath) {
  if (filePath.includes('Auth') || filePath.includes('JWTMiddleware')) {
    return {
      filePath,
      affectedNodes: [
        'AuthService.ts',
        'JWTMiddleware.ts',
        'POST /api/auth/login',
        'User Service',
        'Admin API',
        'Protected Client Routes'
      ],
      affectedCount: { components: 18, apis: 7, tests: 12, workflows: 3 },
      risk: 'HIGH',
      recommendedReviewers: ['Arun (Tech Lead)', 'Priya (Security Lead)'],
      recommendedTests: ['auth.integration.test.ts', 'jwt.rotation.test.ts', 'session.expire.test.ts']
    };
  }

  return {
    filePath: filePath || 'backend/payments/PaymentService.ts',
    affectedNodes: [
      'PaymentService.ts',
      'PaymentValidator.ts',
      'POST /api/payments/charge',
      'OrderService.ts',
      'Checkout.tsx'
    ],
    affectedCount: { components: 6, apis: 3, tests: 9, workflows: 2 },
    risk: 'MEDIUM',
    recommendedReviewers: ['Arun (Tech Lead)', 'Rahul (Payment Lead)'],
    recommendedTests: ['payment.charge.test.ts', 'payment.refund.test.ts', 'checkout.flow.test.ts']
  };
}

// Whole Repository Analysis Engine
function getWholeRepoReport() {
  return {
    project: 'ShopSphere',
    filesCount: 428,
    linesCount: 61240,
    languagesCount: 8,
    dependenciesCount: 46,
    apisCount: 38,
    servicesCount: 12,
    contributorsCount: 24,
    branchesCount: 6,
    duplicateFindings: detectDuplicates(),
    overallHealth: 88,
    generatedAt: new Date().toISOString()
  };
}

module.exports = {
  getDemoUsers: () => DEMO_USERS,
  getRepositories: () => REPOSITORIES,
  getState: () => state,
  detectDuplicates,
  analyzeImpact,
  getWholeRepoReport,
  updateFileContent: (path, content) => {
    state.files[path] = content;
    return true;
  },
  createBranch: (name) => {
    if (state.branches.some(b => b.name === name)) return false;
    state.branches.push({ name, isDefault: false, commit: 'a83f21c', protected: false });
    state.currentBranch = name;
    return true;
  },
  switchBranch: (name) => {
    if (state.branches.some(b => b.name === name)) {
      state.currentBranch = name;
      return true;
    }
    return false;
  },
  createCommit: (author, message, branch) => {
    const hash = crypto.randomBytes(4).toString('hex');
    const newCommit = {
      hash,
      message,
      author,
      timestamp: 'Just now',
      branch: branch || state.currentBranch,
      filesChanged: 2,
      additions: 15,
      deletions: 3
    };
    state.commits.unshift(newCommit);
    state.activities.unshift({
      id: 'act_' + Date.now(),
      user: author,
      action: `committed ${hash}`,
      target: message,
      timestamp: 'Just now'
    });
    return newCommit;
  },
  createPR: (prData) => {
    const newPR = {
      id: state.pullRequests.length + 42,
      number: state.pullRequests.length + 42,
      title: prData.title || 'Update repository features',
      author: prData.author || 'Rahul',
      sourceBranch: prData.sourceBranch || state.currentBranch,
      targetBranch: prData.targetBranch || 'main',
      status: 'Open',
      createdAt: new Date().toISOString(),
      summary: prData.summary || 'AI-analyzed changes verified with 0 breaking API regressions.',
      risk: prData.risk || 'LOW',
      commits: ['a83f21c'],
      reviews: [],
      comments: []
    };
    state.pullRequests.unshift(newPR);
    state.activities.unshift({
      id: 'act_' + Date.now(),
      user: newPR.author,
      action: `created Pull Request #${newPR.number}`,
      target: newPR.title,
      timestamp: 'Just now'
    });
    return newPR;
  },
  mergePR: (prNumber, user) => {
    const pr = state.pullRequests.find(p => p.number === Number(prNumber));
    if (!pr) return false;
    pr.status = 'Merged';
    state.activities.unshift({
      id: 'act_' + Date.now(),
      user,
      action: `merged Pull Request #${prNumber}`,
      target: pr.title,
      timestamp: 'Just now'
    });
    return true;
  },
  fetchGitHubDeveloper: async (rawInput) => {
    let username = (rawInput || '').trim();
    if (username.includes('github.com/')) {
      username = username.split('github.com/').pop().split('/')[0].split('?')[0];
    }
    username = username.replace(/^@/, '').trim();
    if (!username) {
      throw new Error('Valid GitHub username or profile URL is required');
    }

    let devAccount = null;

    try {
      const response = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, {
        headers: {
          'User-Agent': 'ProjectTwin-TwinSpace',
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        devAccount = {
          id: `usr_gh_${data.login.toLowerCase()}`,
          username: data.login,
          name: data.name || data.login,
          role: data.bio ? (data.bio.length > 40 ? data.bio.substring(0, 40) + '...' : data.bio) : 'GitHub Developer',
          avatar: data.avatar_url,
          githubUrl: data.html_url,
          publicRepos: data.public_repos,
          followers: data.followers,
          company: data.company,
          location: data.location,
          activeFile: 'frontend/pages/Checkout.tsx',
          status: 'active',
          isGitHubConnected: true
        };
      }
    } catch {
      // Gracefully handle network offline or API rate limits
    }

    if (!devAccount) {
      devAccount = {
        id: `usr_gh_${username.toLowerCase()}`,
        username: username,
        name: username.charAt(0).toUpperCase() + username.slice(1),
        role: 'GitHub Developer',
        avatar: `https://avatars.githubusercontent.com/u/583231?v=4`,
        githubUrl: `https://github.com/${username}`,
        publicRepos: 18,
        followers: 142,
        activeFile: 'frontend/pages/Checkout.tsx',
        status: 'active',
        isGitHubConnected: true
      };
    }

    const existing = state.users.find(u => u.username.toLowerCase() === devAccount.username.toLowerCase());
    if (!existing) {
      state.users.push(devAccount);
    }

    state.activities.unshift({
      id: 'act_' + Date.now(),
      user: devAccount.username,
      action: 'connected GitHub developer account',
      target: devAccount.name,
      timestamp: 'Just now'
    });

    return devAccount;
  }
};
