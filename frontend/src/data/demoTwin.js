export const demoTwin = {
  id: "project-twin-demo",
  project: {
    name: "CampusCare",
    fullName: "demo/campus-care",
    description: "A connected campus support platform for service requests, announcements, and student operations.",
    repositoryUrl: "https://github.com/demo/campus-care",
    defaultBranch: "main",
    visibility: "private",
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
