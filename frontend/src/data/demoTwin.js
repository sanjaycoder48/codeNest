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

export const reactTwin = {
  id: "facebook-react",
  project: {
    name: "React",
    fullName: "facebook/react",
    description: "The library for web and native user interfaces.",
    repositoryUrl: "https://github.com/facebook/react",
    defaultBranch: "main",
    visibility: "public",
    stars: 228000,
    updatedAt: new Date().toISOString(),
  },
  summary: { files: 890, sourceFiles: 620, components: 42, pages: 0, apiRoutes: 0, models: 0, dependencies: 32 },
  languages: [{ name: "JavaScript", files: 410 }, { name: "TypeScript", files: 210 }],
  frameworks: ["React"],
  dependencies: ["loose-envify", "object-assign", "scheduler"],
  components: ["packages/react/src/React.js", "packages/react-dom/src/client/ReactDOM.js"],
  pages: [],
  apiRoutes: [],
  models: [],
  environment: [{ name: "NODE_ENV", file: "packages/react/index.js", sensitive: false }],
  features: ["Concurrent rendering", "Server components", "Hooks state model", "Synthetic event system"],
  architecture: {
    nodes: [
      { id: "reconciler", label: "Fiber Reconciler", type: "service" },
      { id: "scheduler", label: "Priority Scheduler", type: "interface" },
      { id: "dom", label: "ReactDOM Renderer", type: "service" },
    ],
    edges: [
      { from: "reconciler", to: "scheduler", label: "Work scheduling" },
      { from: "reconciler", to: "dom", label: "DOM mutations" },
    ],
  },
  readiness: {
    score: 98,
    checks: [],
    findings: [],
  },
  recommendations: [
    { category: "Quality", title: "Strict Compiler Rules", current: "Manual memoization hooks", recommended: "Adopt React Compiler automated memoization", why: "Eliminates boilerplate useMemo and useCallback calls.", benefit: "Automatic performance optimization", compatibility: "Fully compatible", migrationRisk: "Low", migrationPlan: ["Install eslint-plugin-react-compiler", "Enable compiler transform in build tool"], evidence: "packages/react/src/React.js" },
  ],
  evidence: ["package.json", "README.md", "packages/react/package.json"],
  generatedAt: new Date().toISOString(),
};

export const nextjsTwin = {
  id: "vercel-next.js",
  project: {
    name: "Next.js",
    fullName: "vercel/next.js",
    description: "The React Framework for the Web.",
    repositoryUrl: "https://github.com/vercel/next.js",
    defaultBranch: "canary",
    visibility: "public",
    stars: 125000,
    updatedAt: new Date().toISOString(),
  },
  summary: { files: 1240, sourceFiles: 950, components: 88, pages: 34, apiRoutes: 62, models: 12, dependencies: 58 },
  languages: [{ name: "TypeScript", files: 720 }, { name: "Rust", files: 180 }, { name: "JavaScript", files: 50 }],
  frameworks: ["Next.js", "React", "Turbopack"],
  dependencies: ["react", "react-dom", "styled-jsx", "caniuse-lite", "postcss"],
  components: ["packages/next/src/client/components/app-router.tsx"],
  pages: ["packages/next/src/build/webpack/loaders/next-app-loader.ts"],
  apiRoutes: [{ method: "ALL", path: "app-router", file: "packages/next/src/server/app-render.tsx" }],
  models: [],
  environment: [{ name: "NEXT_PUBLIC_API_HOST", file: "packages/next/src/client/components/headers.ts", sensitive: false }],
  features: ["App Router & Server Actions", "Turbopack Rust Bundler", "Hybrid SSR & SSG", "Image & Font Optimization"],
  architecture: {
    nodes: [
      { id: "app-router", label: "App Router", type: "interface" },
      { id: "turbopack", label: "Turbopack Engine (Rust)", type: "service" },
      { id: "edge", label: "Edge Middleware", type: "service" },
    ],
    edges: [
      { from: "app-router", to: "turbopack", label: "Fast HMR / Build" },
      { from: "app-router", to: "edge", label: "Request routing" },
    ],
  },
  readiness: {
    score: 96,
    checks: [],
    findings: [],
  },
  recommendations: [
    { category: "Performance", title: "Enable Turbopack in Production", current: "Webpack bundler", recommended: "Use Turbopack production builds", why: "Dramatically speeds up build times and cold starts.", benefit: "Faster builds & cold starts", compatibility: "Next.js 15+", migrationRisk: "Low", migrationPlan: ["Enable next build --turbo", "Verify custom webpack configs"], evidence: "packages/next/src/server/config.ts" },
  ],
  evidence: ["package.json", "README.md", "packages/next/package.json"],
  generatedAt: new Date().toISOString(),
};

export const tailwindTwin = {
  id: "tailwindlabs-tailwindcss",
  project: {
    name: "Tailwind CSS",
    fullName: "tailwindlabs/tailwindcss",
    description: "A utility-first CSS framework for rapid UI development.",
    repositoryUrl: "https://github.com/tailwindlabs/tailwindcss",
    defaultBranch: "main",
    visibility: "public",
    stars: 82500,
    updatedAt: new Date().toISOString(),
  },
  summary: { files: 310, sourceFiles: 240, components: 0, pages: 0, apiRoutes: 0, models: 0, dependencies: 18 },
  languages: [{ name: "TypeScript", files: 190 }, { name: "CSS", files: 50 }],
  frameworks: ["Tailwind CSS", "Lightning CSS"],
  dependencies: ["lightningcss", "browserslist", "postcss"],
  components: [],
  pages: [],
  apiRoutes: [],
  models: [],
  environment: [],
  features: ["Utility engine v4", "LightningCSS integration", "Container queries", "CSS-first configuration"],
  architecture: {
    nodes: [
      { id: "parser", label: "CSS Parser & Scanner", type: "service" },
      { id: "engine", label: "LightningCSS Engine", type: "service" },
      { id: "output", label: "Compiled CSS Bundle", type: "interface" },
    ],
    edges: [
      { from: "parser", to: "engine", label: "Token stream" },
      { from: "engine", to: "output", label: "Optimized CSS" },
    ],
  },
  readiness: {
    score: 97,
    checks: [],
    findings: [],
  },
  recommendations: [
    { category: "Build Speed", title: "Adopt v4 CSS-first config", current: "JS tailwind.config.js", recommended: "Use @theme CSS block in v4", why: "Removes JS parsing overhead and simplifies setup.", benefit: "Faster builds & zero config JS", compatibility: "Tailwind v4", migrationRisk: "Low", migrationPlan: ["Migrate theme to @theme directive in CSS", "Remove tailwind.config.js"], evidence: "packages/tailwindcss/src/index.ts" },
  ],
  evidence: ["package.json", "README.md", "packages/tailwindcss/package.json"],
  generatedAt: new Date().toISOString(),
};

export const showcaseProjects = [codeNestTwin, campusCareTwin, expressTwin, reactTwin, nextjsTwin, tailwindTwin];
export const demoTwin = codeNestTwin;
