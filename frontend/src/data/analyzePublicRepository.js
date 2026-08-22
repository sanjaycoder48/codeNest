const SOURCE_EXTENSIONS = new Set([
  "js", "jsx", "ts", "tsx", "mjs", "cjs", "py", "go", "rs", "java",
  "kt", "rb", "php", "cs", "vue", "svelte", "sql", "prisma",
]);

const LANGUAGE_BY_EXTENSION = {
  js: "JavaScript", jsx: "JavaScript", mjs: "JavaScript", cjs: "JavaScript",
  ts: "TypeScript", tsx: "TypeScript", py: "Python", go: "Go", rs: "Rust",
  java: "Java", kt: "Kotlin", rb: "Ruby", php: "PHP", cs: "C#", vue: "Vue",
  svelte: "Svelte", sql: "SQL", prisma: "Prisma",
};

const FRAMEWORK_SIGNALS = {
  next: "Next.js", react: "React", vite: "Vite", express: "Express", fastify: "Fastify",
  "@nestjs/core": "NestJS", vue: "Vue", nuxt: "Nuxt", svelte: "Svelte",
  "@sveltejs/kit": "SvelteKit", angular: "Angular", tailwindcss: "Tailwind CSS",
  prisma: "Prisma", mongoose: "Mongoose", pg: "PostgreSQL", mysql2: "MySQL",
  redis: "Redis", "@supabase/supabase-js": "Supabase",
};

function parseRepository(input) {
  const normalized = String(input || "").trim().replace(/\.git$/, "").replace(/\/$/, "");
  const match = normalized.match(/(?:github\.com[/:])?([\w.-]+)\/([\w.-]+)$/i);
  if (!match) throw new Error("Enter a GitHub repository as owner/name or a GitHub URL.");
  return { owner: match[1], repo: match[2] };
}

async function githubRequest(url) {
  const response = await fetch(url, { headers: { Accept: "application/vnd.github+json" } });
  if (!response.ok) {
    if (response.status === 404) throw new Error("Repository not found or it is private.");
    if (response.status === 403) throw new Error("GitHub's public API limit was reached. Try again in a few minutes.");
    throw new Error(`GitHub returned ${response.status} while reading the repository.`);
  }
  return response.json();
}

function extension(filePath) {
  const match = filePath.toLowerCase().match(/\.([^./]+)$/);
  return match?.[1] || "";
}

function basename(filePath) {
  return filePath.split("/").pop() || filePath;
}

function decodeBase64(value) {
  const bytes = Uint8Array.from(atob(value.replace(/\s/g, "")), (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function classifyFiles(entries) {
  const files = entries.filter((entry) => entry.type === "blob");
  const sourceFiles = files.filter((file) => SOURCE_EXTENSIONS.has(extension(file.path)));
  const components = sourceFiles.filter((file) => /(^|\/)(components?|ui)\//i.test(file.path)
    || (!/(^|\/)(pages|app|routes)\//i.test(file.path) && /^[A-Z]/.test(basename(file.path)) && /\.(jsx|tsx|vue|svelte)$/i.test(file.path)));
  const pages = sourceFiles.filter((file) => /(^|\/)(pages|app|routes)\//i.test(file.path) && !/api/i.test(file.path));
  const apiFiles = sourceFiles.filter((file) => /(^|\/)(api|routes?|controllers?)\//i.test(file.path));
  const models = sourceFiles.filter((file) => /(^|\/)(models?|schemas?|entities)\//i.test(file.path) || /schema\.prisma$/i.test(file.path));
  return { files, sourceFiles, components, pages, apiFiles, models };
}

function selectEvidenceFiles(files) {
  const priority = [
    /(^|\/)package\.json$/i, /requirements\.txt$/i, /pyproject\.toml$/i, /schema\.prisma$/i,
    /dockerfile$/i, /vercel\.json$/i, /(^|\/)readme/i, /\.env\.example$/i,
    /(^|\/)(routes?|api|auth|config|services?)\//i, /(vite|next|tailwind)\.config/i,
  ];
  return files
    .filter((file) => file.size < 120000)
    .map((file) => ({ file, rank: priority.findIndex((rule) => rule.test(file.path)) }))
    .filter(({ rank }) => rank !== -1)
    .sort((a, b) => a.rank - b.rank || a.file.size - b.file.size)
    .slice(0, 14)
    .map(({ file }) => file);
}

async function fetchEvidence(owner, repo, files) {
  const entries = await Promise.all(files.map(async (file) => {
    const blob = await githubRequest(`https://api.github.com/repos/${owner}/${repo}/git/blobs/${file.sha}`);
    return [file.path, blob.encoding === "base64" ? decodeBase64(blob.content) : ""];
  }));
  return Object.fromEntries(entries);
}

function packageData(evidence) {
  const manifests = Object.entries(evidence).flatMap(([filePath, content]) => {
    if (!/(^|\/)package\.json$/i.test(filePath)) return [];
    try { return [{ filePath, manifest: JSON.parse(content) }]; } catch { return []; }
  });
  const dependencies = [...new Set(manifests.flatMap(({ manifest }) => [
    ...Object.keys(manifest.dependencies || {}), ...Object.keys(manifest.devDependencies || {}),
  ]))].sort();
  return { manifests, dependencies };
}

function extractEnvironment(evidence) {
  const found = new Map();
  const patterns = [/process\.env\.([A-Z][A-Z0-9_]*)/g, /import\.meta\.env\.([A-Z][A-Z0-9_]*)/g];
  Object.entries(evidence).forEach(([filePath, content]) => patterns.forEach((pattern) => {
    let match;
    while ((match = pattern.exec(content))) found.set(match[1], filePath);
  }));
  return [...found].map(([name, file]) => ({ name, file, sensitive: /KEY|SECRET|TOKEN|PASSWORD|URI/.test(name) }));
}

function extractRoutes(evidence, apiFiles) {
  const routes = [];
  const pattern = /\.(get|post|put|patch|delete)\s*\(\s*['"`]([^'"`]+)['"`]/gi;
  apiFiles.forEach((file) => {
    const content = evidence[file.path] || "";
    let match;
    while ((match = pattern.exec(content)) && routes.length < 60) routes.push({ method: match[1].toUpperCase(), path: match[2], file: file.path });
  });
  return routes;
}

function inferFeatures(files, dependencies) {
  const corpus = `${files.map((file) => file.path).join(" ")} ${dependencies.join(" ")}`.toLowerCase();
  return [
    ["Authentication", /auth|passport|clerk|jwt/], ["Project management", /projects?|workspace/],
    ["Payments", /stripe|payments?|checkout/], ["File uploads", /upload|multer|storage|s3/],
    ["AI assistance", /openai|anthropic|ai-sdk|chat|assistant/], ["Analytics", /analytics|insights|metrics/],
    ["Deployment", /vercel|deploy|docker|render\.yaml/], ["Testing", /test|spec|vitest|jest|playwright/],
  ].filter(([, matcher]) => matcher.test(corpus)).map(([name]) => name);
}

function readinessFor({ files, manifests, environments, frameworks }) {
  const paths = files.map((file) => file.path.toLowerCase());
  const scripts = Object.assign({}, ...manifests.map(({ manifest }) => manifest.scripts || {}));
  const checks = [
    ["build", "Build", 16, Boolean(scripts.build), "critical", "No build command is defined", "Preview and production deployments need a repeatable build.", "Add a deterministic build script and verify it in CI."],
    ["lockfile", "Dependency health", 10, paths.some((item) => /(^|\/)(package-lock|pnpm-lock|yarn\.lock|bun\.lock)/.test(item)), "high", "No dependency lockfile was detected", "Dependency trees can change between builds.", "Commit the selected package manager lockfile."],
    ["tests", "Code quality", 12, Boolean(scripts.test) || paths.some((item) => /(__tests__|\.test\.|\.spec\.)/.test(item)), "high", "Automated tests were not detected", "Changes cannot be verified confidently before release.", "Add focused tests for the critical user flow."],
    ["ci", "Deployment readiness", 10, paths.some((item) => item.startsWith(".github/workflows/")), "medium", "No continuous integration workflow was detected", "Checks may be skipped before merging.", "Add a workflow that lints, tests, and builds."],
    ["env", "Configuration", 12, environments.length === 0 || paths.some((item) => /\.env\.example$|\.env\.sample$/.test(item)), "high", "Environment variables are undocumented", "Missing configuration commonly breaks deployments.", "Document variable names in .env.example without values."],
    ["readme", "Documentation", 10, paths.some((item) => /(^|\/)readme(\.|$)/.test(item)), "medium", "Project setup documentation was not detected", "Contributors need reproducible setup steps.", "Add setup, build, test, and deployment instructions."],
    ["gitignore", "Security", 8, paths.includes(".gitignore"), "high", "No .gitignore file was detected", "Secrets can be committed accidentally.", "Add a framework-appropriate .gitignore."],
    ["lint", "Code quality", 8, Boolean(scripts.lint), "medium", "No lint command is defined", "Common correctness issues may reach production.", "Configure a linter and expose a lint script."],
    ["deploy", "Deployment readiness", 8, paths.some((item) => /vercel\.json|netlify\.toml|render\.yaml|dockerfile|fly\.toml/.test(item)) || frameworks.includes("Next.js"), "low", "No explicit deployment configuration was detected", "Provider defaults may miss runtime requirements.", "Document and configure the deployment target."],
    ["license", "Documentation", 6, paths.some((item) => /(^|\/)license(\.|$)/.test(item)), "low", "No license was detected", "Reuse and contribution terms are unclear.", "Choose and add an appropriate license."],
  ].map(([id, area, weight, pass, severity, problem, why, solution]) => ({ id, area, weight, pass, severity, problem, why, solution }));
  const total = checks.reduce((sum, check) => sum + check.weight, 0);
  const earned = checks.filter((check) => check.pass).reduce((sum, check) => sum + check.weight, 0);
  return {
    score: Math.round((earned / total) * 100), checks,
    findings: checks.filter((check) => !check.pass).map((check) => ({
      ...check, file: check.id === "env" ? environments[0]?.file || "repository root" : "repository root",
      risk: check.severity === "critical" ? "Release blocked" : check.severity === "high" ? "Likely release failure" : "Reduced confidence", confidence: 96,
    })),
  };
}

function recommendationsFor(readiness, frameworks) {
  return readiness.findings.slice(0, 4).map((finding) => ({
    category: finding.area, title: finding.solution.replace(/\.$/, ""), current: finding.problem,
    recommended: finding.solution, why: finding.why,
    benefit: ["critical", "high"].includes(finding.severity) ? "Higher release confidence" : "More reliable maintenance",
    compatibility: `Fits the detected ${frameworks.slice(0, 2).join(" + ") || "repository"} setup`,
    migrationRisk: finding.severity === "critical" ? "Medium" : "Low",
    migrationPlan: ["Create an isolated branch", "Apply the smallest change", "Run build and tests", "Review the diff before creating a PR"],
    evidence: finding.file,
  }));
}

function architectureFor(frameworks) {
  const nodes = [];
  const client = frameworks.find((item) => ["Next.js", "React", "Nuxt", "Vue", "SvelteKit", "Svelte", "Angular"].includes(item));
  const api = frameworks.find((item) => ["Express", "Fastify", "NestJS", "Django", "Flask"].includes(item));
  const database = frameworks.find((item) => ["PostgreSQL", "MySQL", "Prisma", "Mongoose", "Supabase"].includes(item));
  if (client) nodes.push({ id: "client", label: client, type: "interface" });
  if (api) nodes.push({ id: "api", label: api, type: "service" });
  if (database) nodes.push({ id: "data", label: database, type: "data" });
  if (!nodes.length) nodes.push({ id: "repo", label: frameworks[0] || "Application", type: "interface" });
  return { nodes, edges: nodes.slice(1).map((node, index) => ({ from: nodes[index].id, to: node.id, label: index === 0 ? "requests" : "reads / writes" })) };
}

export async function analyzePublicRepository(input, onProgress = () => {}) {
  const API_URL = import.meta.env.VITE_API_URL || "";
  
  // Single Source of Truth: Attempt backend API analysis first
  try {
    onProgress(15, "Connecting to backend analysis engine...");
    const response = await fetch(`${API_URL}/api/analysis`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ repository: input }),
    });

    if (response.ok) {
      const initialJob = await response.json();
      let currentJob = initialJob;

      // Poll backend job until complete or failed
      while (currentJob.status === "queued" || currentJob.status === "analyzing") {
        onProgress(currentJob.progress || 40, currentJob.stage || "Analyzing repository");
        await new Promise((resolve) => setTimeout(resolve, 800));
        
        const pollRes = await fetch(`${API_URL}/api/analysis/${currentJob.id}`);
        if (pollRes.ok) {
          currentJob = await pollRes.json();
        } else {
          break;
        }
      }

      if (currentJob.status === "complete" && currentJob.twin) {
        onProgress(100, "Project Twin ready");
        return currentJob.twin;
      }
    }
  } catch {
    // Graceful fallback to client analyzer if backend server is offline or unreachable
  }

  // Standalone offline analyzer fallback
  const { owner, repo } = parseRepository(input);
  onProgress(20, "Reading repository metadata");
  const metadata = await githubRequest(`https://api.github.com/repos/${owner}/${repo}`);
  onProgress(40, "Classifying repository files");
  const tree = await githubRequest(`https://api.github.com/repos/${owner}/${repo}/git/trees/${encodeURIComponent(metadata.default_branch)}?recursive=1`);
  if (tree.truncated) throw new Error("This repository is too large for browser analysis.");

  const classified = classifyFiles(tree.tree || []);
  const evidenceFiles = selectEvidenceFiles(classified.files);
  onProgress(65, "Extracting high-signal evidence");
  const evidence = await fetchEvidence(owner, repo, evidenceFiles);
  const { manifests, dependencies } = packageData(evidence);
  const frameworks = [...new Set(dependencies.map((name) => FRAMEWORK_SIGNALS[name]).filter(Boolean))];
  const languages = Object.entries(classified.sourceFiles.reduce((counts, file) => {
    const language = LANGUAGE_BY_EXTENSION[extension(file.path)];
    if (language) counts[language] = (counts[language] || 0) + 1;
    return counts;
  }, {})).sort((a, b) => b[1] - a[1]).map(([name, files]) => ({ name, files }));
  const environment = extractEnvironment(evidence);
  const apiRoutes = extractRoutes(evidence, classified.apiFiles);
  const readiness = readinessFor({ files: classified.files, manifests, environments: environment, frameworks });
  onProgress(90, "Building Project Twin context");

  return {
    id: `${owner}-${repo}`.toLowerCase(),
    project: { name: metadata.name, fullName: metadata.full_name, description: metadata.description || "No repository description provided.", repositoryUrl: metadata.html_url, defaultBranch: metadata.default_branch, visibility: metadata.private ? "private" : "public", stars: metadata.stargazers_count, updatedAt: metadata.updated_at },
    summary: { files: classified.files.length, sourceFiles: classified.sourceFiles.length, components: classified.components.length, pages: classified.pages.length, apiRoutes: apiRoutes.length || classified.apiFiles.length, models: classified.models.length, dependencies: dependencies.length },
    languages, frameworks: frameworks.length ? frameworks : languages.slice(0, 3).map((item) => item.name), dependencies,
    components: classified.components.slice(0, 40).map((file) => file.path), pages: classified.pages.slice(0, 40).map((file) => file.path),
    apiRoutes, models: classified.models.slice(0, 30).map((file) => file.path), environment,
    features: inferFeatures(classified.files, dependencies), architecture: architectureFor(frameworks), readiness,
    recommendations: recommendationsFor(readiness, frameworks), evidence: evidenceFiles.map((file) => file.path), generatedAt: new Date().toISOString(),
  };
}
