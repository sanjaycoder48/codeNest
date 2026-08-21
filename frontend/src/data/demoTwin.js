export const campusCareTwin = {
  id: "demo-campus-care",
  project: {
    name: "CampusCare",
    fullName: "demo/campus-care",
    description: "A connected campus support platform for service requests, announcements, and student operations.",
    repositoryUrl: "https://github.com/demo/campus-care",
    defaultBranch: "main",
    visibility: "private",
    stars: 142,
    updatedAt: new Date().toISOString(),
  },
  summary: { files: 184, sourceFiles: 127, components: 37, pages: 14, apiRoutes: 21, models: 8, dependencies: 46 },
  languages: [{ name: "TypeScript", files: 112 }, { name: "SQL", files: 9 }, { name: "CSS", files: 6 }],
  frameworks: ["React", "Vite", "Express", "PostgreSQL"],
  dependencies: ["react", "vite", "express", "pg", "jsonwebtoken", "zod", "tailwindcss"],
  components: ["src/components/RequestCard.tsx", "src/components/ServiceQueue.tsx", "src/components/AnnouncementPanel.tsx"],
  pages: ["src/pages/Dashboard.tsx", "src/pages/Requests.tsx", "src/pages/Announcements.tsx"],
  apiRoutes: [
    { method: "POST", path: "/api/auth/login", file: "server/routes/auth.ts" },
    { method: "GET", path: "/api/requests", file: "server/routes/requests.ts" },
    { method: "PATCH", path: "/api/requests/:id", file: "server/routes/requests.ts" },
  ],
  models: ["server/models/User.ts", "server/models/Request.ts", "server/models/Department.ts"],
  environment: [
    { name: "DATABASE_URL", file: "server/db/index.ts", sensitive: true },
    { name: "JWT_SECRET", file: "server/auth/session.ts", sensitive: true },
    { name: "VITE_API_URL", file: "src/services/api.ts", sensitive: false },
  ],
  features: ["Role-based authentication", "Service request workflow", "Campus announcements", "Department routing", "Audit history"],
  architecture: {
    nodes: [
      { id: "client", label: "React + Vite", type: "interface" },
      { id: "api", label: "Express REST API", type: "service" },
      { id: "data", label: "PostgreSQL", type: "data" },
    ],
    edges: [{ from: "client", to: "api", label: "HTTPS / JSON" }, { from: "api", to: "data", label: "SQL queries" }],
  },
  readiness: {
    score: 78,
    checks: [],
    findings: [
      { id: "env", severity: "high", area: "Configuration", problem: "Production API URL is not configured", why: "The frontend cannot reach the API after deployment.", file: "src/services/api.ts", solution: "Add VITE_API_URL to the preview and production environments.", risk: "Preview deployment failure", confidence: 99 },
      { id: "tests", severity: "medium", area: "Code quality", problem: "Request escalation has no integration test", why: "A permissions regression could expose restricted actions.", file: "server/routes/requests.ts", solution: "Cover the staff escalation path with an authenticated API test.", risk: "Reduced release confidence", confidence: 91 },
      { id: "headers", severity: "low", area: "Security", problem: "Security headers are not configured", why: "Browser hardening is left to provider defaults.", file: "server/index.ts", solution: "Add and configure Helmet for the Express application.", risk: "Reduced defense in depth", confidence: 88 },
    ],
  },
  recommendations: [
    { category: "Reliability", title: "Verify the request workflow before every release", current: "The escalation route is only manually tested", recommended: "Add an authenticated integration test for create, assign, and escalate", why: "This is the highest-risk workflow in the repository.", benefit: "Safer releases", compatibility: "Uses the existing Vitest setup", migrationRisk: "Low", migrationPlan: ["Create an isolated branch", "Add API fixtures", "Cover the escalation path", "Run the complete test suite"], evidence: "server/routes/requests.ts" },
    { category: "Security", title: "Add explicit HTTP security headers", current: "Express relies on platform defaults", recommended: "Configure Helmet with a project-specific content security policy", why: "The project serves authenticated user data.", benefit: "Better browser hardening", compatibility: "Compatible with Express 5", migrationRisk: "Low", migrationPlan: ["Add Helmet", "Define allowed origins", "Verify local assets", "Review the generated diff"], evidence: "server/index.ts" },
  ],
  evidence: ["package.json", "vite.config.ts", "src/services/api.ts", "server/routes/auth.ts", "server/routes/requests.ts", "server/db/schema.sql"],
  generatedAt: new Date().toISOString(),
};

export const codeNestTwin = {
  id: "sanjaycoder48-codenest",
  project: {
    name: "codeNest",
    fullName: "sanjaycoder48/codeNest",
    description: "Project Twin transforms GitHub repositories into evidence-grounded models with architecture visualization and readiness scoring.",
    repositoryUrl: "https://github.com/sanjaycoder48/codeNest",
    defaultBranch: "main",
    visibility: "public",
    stars: 38,
    updatedAt: new Date().toISOString(),
  },
  summary: { files: 49, sourceFiles: 28, components: 8, pages: 5, apiRoutes: 3, models: 2, dependencies: 18 },
  languages: [{ name: "JavaScript", files: 22 }, { name: "CSS", files: 4 }, { name: "HTML", files: 2 }],
  frameworks: ["React", "Vite", "Express", "Mongoose", "Tailwind CSS"],
  dependencies: ["react", "vite", "express", "mongoose", "jsonwebtoken", "bcryptjs", "tailwindcss", "framer-motion"],
  components: ["frontend/src/App.jsx", "frontend/src/components/Navbar.jsx", "frontend/src/components/Hero.jsx", "frontend/src/components/Features.jsx"],
  pages: ["frontend/src/pages/Home.jsx", "frontend/src/pages/Dashboard.jsx", "frontend/src/pages/Login.jsx", "frontend/src/pages/Register.jsx"],
  apiRoutes: [
    { method: "POST", path: "/api/analysis", file: "backend/routes/analysis.js" },
    { method: "POST", path: "/api/auth/login", file: "backend/routes/auth.js" },
    { method: "GET", path: "/api/projects", file: "backend/routes/projects.js" },
  ],
  models: ["backend/models/User.js", "backend/models/Project.js"],
  environment: [
    { name: "MONGO_URI", file: "backend/server.js", sensitive: true },
    { name: "JWT_SECRET", file: "backend/routes/auth.js", sensitive: true },
    { name: "VITE_API_URL", file: "frontend/src/App.jsx", sensitive: false },
  ],
  features: ["GitHub repository analysis", "Deterministic file classification", "Launch readiness scoring", "Deployment Doctor diagnosis", "Interactive showcase builder"],
  architecture: {
    nodes: [
      { id: "frontend", label: "React + Vite Workspace", type: "interface" },
      { id: "express", label: "Express Analysis API", type: "service" },
      { id: "github", label: "GitHub REST API", type: "service" },
      { id: "db", label: "MongoDB / Mongoose", type: "data" },
    ],
    edges: [
      { from: "frontend", to: "express", label: "REST / JSON" },
      { from: "express", to: "github", label: "Tree & Blob API" },
      { from: "express", to: "db", label: "User Accounts" },
    ],
  },
  readiness: {
    score: 88,
    checks: [],
    findings: [
      { id: "auth", severity: "medium", area: "Security", problem: "MongoDB URI fallback relies on local default", why: "Production environments should explicitly define MONGO_URI.", file: "backend/server.js", solution: "Set MONGO_URI in deployment environment secrets.", risk: "Database connection failure in cloud", confidence: 95 },
    ],
  },
  recommendations: [
    { category: "Architecture", title: "Migrate analysis jobs to PostgreSQL + Worker Queue", current: "In-memory job processing", recommended: "Use PostgreSQL with durable Redis worker queue", why: "Ensures durability during high-traffic import bursts.", benefit: "Enterprise job reliability", compatibility: "Fully compatible", migrationRisk: "Low", migrationPlan: ["Setup BullMQ queue", "Persist Project Twin snapshots", "Add audit event logs"], evidence: "backend/routes/analysis.js" },
  ],
  evidence: ["README.md", "package.json", "backend/server.js", "backend/services/repositoryAnalyzer.js", "frontend/src/App.jsx"],
  generatedAt: new Date().toISOString(),
};

export const expressTwin = {
  id: "expressjs-express",
  project: {
    name: "Express",
    fullName: "expressjs/express",
    description: "Fast, unopinionated, minimalist web framework for Node.js.",
    repositoryUrl: "https://github.com/expressjs/express",
    defaultBranch: "master",
    visibility: "public",
    stars: 64200,
    updatedAt: new Date().toISOString(),
  },
  summary: { files: 142, sourceFiles: 86, components: 0, pages: 0, apiRoutes: 48, models: 0, dependencies: 24 },
  languages: [{ name: "JavaScript", files: 86 }],
  frameworks: ["Express"],
  dependencies: ["accepts", "cookie", "debug", "finalhandler", "router", "send", "serve-static"],
  components: [],
  pages: [],
  apiRoutes: [
    { method: "GET", path: "router/index.js", file: "lib/router/index.js" },
    { method: "USE", path: "middleware/init.js", file: "lib/middleware/init.js" },
  ],
  models: [],
  environment: [{ name: "NODE_ENV", file: "lib/express.js", sensitive: false }],
  features: ["Robust routing", "HTTP helpers", "Middleware pipeline", "Content negotiation"],
  architecture: {
    nodes: [
      { id: "core", label: "Express Core Router", type: "service" },
      { id: "middleware", label: "Middleware Pipeline", type: "interface" },
      { id: "http", label: "Node.js HTTP Server", type: "service" },
    ],
    edges: [
      { from: "http", to: "middleware", label: "Incoming request" },
      { from: "middleware", to: "core", label: "Route dispatch" },
    ],
  },
  readiness: {
    score: 95,
    checks: [],
    findings: [],
  },
  recommendations: [
    { category: "Performance", title: "Adopt HTTP/2 & async handlers", current: "Callbacks and HTTP/1.1", recommended: "Use Express 5 async route error handling", why: "Simplifies async code without unhandled promise rejections.", benefit: "Simpler async code", compatibility: "Express 5 natively supports async handlers", migrationRisk: "Low", migrationPlan: ["Upgrade route signatures", "Remove redundant next(err) in async functions"], evidence: "lib/router/index.js" },
  ],
  evidence: ["package.json", "Readme.md", "lib/express.js", "lib/router/index.js"],
  generatedAt: new Date().toISOString(),
};

export const showcaseProjects = [codeNestTwin, campusCareTwin, expressTwin];
export const demoTwin = codeNestTwin;
