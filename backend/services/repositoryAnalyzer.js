const path = require('path');

const SOURCE_EXTENSIONS = new Set([
    '.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs', '.py', '.go', '.rs', '.java',
    '.kt', '.rb', '.php', '.cs', '.vue', '.svelte', '.sql', '.prisma'
]);

const LANGUAGE_BY_EXTENSION = {
    '.js': 'JavaScript', '.jsx': 'JavaScript', '.mjs': 'JavaScript', '.cjs': 'JavaScript',
    '.ts': 'TypeScript', '.tsx': 'TypeScript', '.py': 'Python', '.go': 'Go',
    '.rs': 'Rust', '.java': 'Java', '.kt': 'Kotlin', '.rb': 'Ruby', '.php': 'PHP',
    '.cs': 'C#', '.vue': 'Vue', '.svelte': 'Svelte', '.sql': 'SQL', '.prisma': 'Prisma'
};

const FRAMEWORK_SIGNALS = {
    next: 'Next.js', react: 'React', vite: 'Vite', express: 'Express', fastify: 'Fastify',
    '@nestjs/core': 'NestJS', vue: 'Vue', nuxt: 'Nuxt', svelte: 'Svelte',
    '@sveltejs/kit': 'SvelteKit', angular: 'Angular', django: 'Django', flask: 'Flask',
    tailwindcss: 'Tailwind CSS', prisma: 'Prisma', mongoose: 'Mongoose', pg: 'PostgreSQL',
    mysql2: 'MySQL', redis: 'Redis', '@supabase/supabase-js': 'Supabase'
};

// GitHub's own rules: owners are alphanumeric with single hyphens (max 39);
// repository names allow dot, underscore and hyphen (max 100).
const OWNER_PATTERN = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?$/;
const REPO_PATTERN = /^[A-Za-z0-9._-]{1,100}$/;

function parseRepository(input) {
    const normalized = String(input || '').trim().replace(/\.git$/, '').replace(/\/$/, '');
    const match = normalized.match(/(?:github\.com[/:])?([\w.-]+)\/([\w.-]+)$/i);
    if (!match) throw new Error('Enter a GitHub repository as owner/name or a GitHub URL.');

    const [, owner, repo] = match;

    // Without this, an owner of ".." makes the request URL collapse under path
    // normalisation: /repos/../user becomes /user, which would send the
    // server's GitHub token to an endpoint the caller chose.
    if (!OWNER_PATTERN.test(owner) || !REPO_PATTERN.test(repo) || repo === '.' || repo === '..') {
        throw new Error('Enter a GitHub repository as owner/name or a GitHub URL.');
    }

    return { owner, repo };
}

const GITHUB_API = 'https://api.github.com';
const REQUEST_TIMEOUT_MS = Number(process.env.GITHUB_TIMEOUT_MS) || 15000;
const MAX_BLOB_BYTES = 256 * 1024;

async function githubRequest(url, token) {
    // Defence in depth: parseRepository already rejects traversal, but a bug
    // anywhere upstream must not be able to redirect an authenticated request.
    const target = new URL(url);
    if (target.origin !== GITHUB_API) {
        throw new Error('Refusing to send an authenticated request off github.com.');
    }

    // Without a timeout a stalled connection pins the job forever.
    const response = await fetch(target, {
        redirect: 'error',
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        headers: {
            Accept: 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
            'User-Agent': 'project-twin-analyzer',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
    }).catch((err) => {
        if (err.name === 'TimeoutError') throw new Error('GitHub did not respond in time.');
        throw new Error('Could not reach GitHub.');
    });

    if (!response.ok) {
        // Rate limiting is the failure people actually hit; say so plainly.
        if (response.status === 403 && response.headers.get('x-ratelimit-remaining') === '0') {
            throw new Error('GitHub API rate limit reached. Try again shortly or configure GITHUB_TOKEN.');
        }
        const message = response.status === 404
            ? 'Repository not found or it is private.'
            : `GitHub returned ${response.status} while reading the repository.`;
        throw new Error(message);
    }
    return response.json();
}

function classifyFiles(entries) {
    const files = entries.filter((entry) => entry.type === 'blob');
    const sourceFiles = files.filter((file) => SOURCE_EXTENSIONS.has(path.extname(file.path).toLowerCase()));
    const components = sourceFiles.filter((file) => {
        const name = path.basename(file.path, path.extname(file.path));
        return /(^|\/)(components?|ui)\//i.test(file.path) || (
            !/(^|\/)(pages|app|routes)\//i.test(file.path) &&
            /^[A-Z]/.test(name) &&
            /\.(jsx|tsx|vue|svelte)$/i.test(file.path)
        );
    });
    const pages = sourceFiles.filter((file) => /(^|\/)(pages|app|routes)\//i.test(file.path) && !/api/i.test(file.path));
    const apiFiles = sourceFiles.filter((file) => /(^|\/)(api|routes?|controllers?)\//i.test(file.path));
    const models = sourceFiles.filter((file) => /(^|\/)(models?|schemas?|entities)\//i.test(file.path) || /schema\.prisma$/i.test(file.path));

    return { files, sourceFiles, components, pages, apiFiles, models };
}

function selectEvidenceFiles(files) {
    const priority = [
        /(^|\/)package\.json$/i, /requirements\.txt$/i, /pyproject\.toml$/i,
        /schema\.prisma$/i, /dockerfile$/i, /vercel\.json$/i, /render\.yaml$/i,
        /(^|\/)readme/i, /\.env\.example$/i, /(^|\/)(routes?|api|models?|schemas?)\//i,
        /(^|\/)(auth|config|services?)\//i, /(vite|next|webpack|tailwind)\.config/i
    ];

    return files
        .filter((file) => file.size < 120000)
        .map((file) => ({ file, rank: priority.findIndex((rule) => rule.test(file.path)) }))
        .filter(({ rank }) => rank !== -1)
        .sort((a, b) => a.rank - b.rank || a.file.size - b.file.size)
        .slice(0, 32)
        .map(({ file }) => file);
}

async function fetchEvidence(owner, repo, files, token) {
    const evidence = {};
    let cursor = 0;
    const workers = Array.from({ length: 6 }, async () => {
        while (cursor < files.length) {
            const file = files[cursor++];
            // A single generated or vendored file can be tens of megabytes;
            // reading them all into one object is how this runs out of memory.
            if (file.size && file.size > MAX_BLOB_BYTES) continue;

            const blob = await githubRequest(`${GITHUB_API}/repos/${owner}/${repo}/git/blobs/${file.sha}`, token);
            if (blob.encoding === 'base64') {
                evidence[file.path] = Buffer.from(blob.content, 'base64')
                    .toString('utf8')
                    .slice(0, MAX_BLOB_BYTES);
            }
        }
    });
    await Promise.all(workers);
    return evidence;
}

function readPackageFiles(evidence) {
    const packages = [];
    for (const [filePath, content] of Object.entries(evidence)) {
        if (!/(^|\/)package\.json$/i.test(filePath)) continue;
        try {
            const manifest = JSON.parse(content);
            packages.push({ filePath, manifest });
        } catch {
            // Invalid manifests are surfaced by build tooling; analysis continues with file evidence.
        }
    }
    return packages;
}

function collectDependencies(packages) {
    const values = new Set();
    for (const { manifest } of packages) {
        Object.keys(manifest.dependencies || {}).forEach((name) => values.add(name));
        Object.keys(manifest.devDependencies || {}).forEach((name) => values.add(name));
    }
    return [...values].sort();
}

function extractApiRoutes(evidence, apiFiles) {
    const routes = [];
    const routePattern = /\.(get|post|put|patch|delete)\s*\(\s*['"`]([^'"`]+)['"`]/gi;
    for (const file of apiFiles) {
        const content = evidence[file.path];
        if (!content) continue;
        let match;
        while ((match = routePattern.exec(content)) && routes.length < 80) {
            routes.push({ method: match[1].toUpperCase(), path: match[2], file: file.path });
        }
    }
    return routes;
}

function extractEnvironment(evidence) {
    const found = new Map();
    const patterns = [
        /process\.env\.([A-Z][A-Z0-9_]*)/g,
        /import\.meta\.env\.([A-Z][A-Z0-9_]*)/g,
        /(?:Deno|Bun)\.env\.get\(['"]([A-Z][A-Z0-9_]*)['"]\)/g
    ];
    for (const [filePath, content] of Object.entries(evidence)) {
        for (const pattern of patterns) {
            let match;
            while ((match = pattern.exec(content))) found.set(match[1], filePath);
        }
    }
    return [...found].map(([name, file]) => ({ name, file, sensitive: /KEY|SECRET|TOKEN|PASSWORD|URI/.test(name) }));
}

function inferFeatures(files, dependencies) {
    const corpus = `${files.map((file) => file.path).join(' ')} ${dependencies.join(' ')}`.toLowerCase();
    const signals = [
        ['Authentication', /auth|passport|next-auth|clerk|jwt/],
        ['Project management', /projects?|workspace/],
        ['Payments', /stripe|payments?|checkout/],
        ['File uploads', /upload|multer|storage|s3/],
        ['AI assistance', /openai|anthropic|ai-sdk|chat|assistant/],
        ['Analytics', /analytics|insights|metrics/],
        ['Email', /resend|sendgrid|nodemailer|email/],
        ['Deployment', /vercel|deploy|docker|render\.yaml/],
        ['Testing', /test|spec|vitest|jest|playwright/]
    ];
    return signals.filter(([, matcher]) => matcher.test(corpus)).map(([name]) => name);
}

function buildReadiness({ files, packages, dependencies, environments, frameworks }) {
    const paths = files.map((file) => file.path.toLowerCase());
    const scripts = Object.assign({}, ...packages.map(({ manifest }) => manifest.scripts || {}));
    const checks = [
        { id: 'build', area: 'Build', weight: 16, pass: Boolean(scripts.build), severity: 'critical', problem: 'No build command is defined', why: 'Preview and production deployments need a repeatable build.', solution: 'Add a deterministic build script and verify it in CI.' },
        { id: 'lockfile', area: 'Dependency health', weight: 10, pass: paths.some((item) => /(^|\/)(package-lock|pnpm-lock|yarn\.lock|bun\.lock)/.test(item)), severity: 'high', problem: 'No dependency lockfile was detected', why: 'Unpinned dependency trees can change between builds.', solution: 'Commit the lockfile produced by the selected package manager.' },
        { id: 'tests', area: 'Code quality', weight: 12, pass: Boolean(scripts.test) || paths.some((item) => /(__tests__|\.test\.|\.spec\.)/.test(item)), severity: 'high', problem: 'Automated tests were not detected', why: 'Changes cannot be verified confidently before release.', solution: 'Add focused tests for the critical user flow and run them in CI.' },
        { id: 'ci', area: 'Deployment readiness', weight: 10, pass: paths.some((item) => item.startsWith('.github/workflows/') || /gitlab-ci|circleci|azure-pipelines/.test(item)), severity: 'medium', problem: 'No continuous integration workflow was detected', why: 'Build and test checks may be skipped before merging.', solution: 'Add a workflow that installs, lints, tests, and builds the project.' },
        { id: 'env', area: 'Configuration', weight: 12, pass: environments.length === 0 || paths.some((item) => /\.env\.example$|\.env\.sample$/.test(item)), severity: 'high', problem: 'Environment variables are used but no example file was detected', why: 'Missing configuration is a common cause of failed deployments.', solution: 'Document variable names in .env.example without including secret values.' },
        { id: 'readme', area: 'Documentation', weight: 10, pass: paths.some((item) => /(^|\/)readme(\.|$)/.test(item)), severity: 'medium', problem: 'Project setup documentation was not detected', why: 'Contributors and deployment systems need reproducible setup steps.', solution: 'Add setup, build, test, and deployment instructions to the README.' },
        { id: 'gitignore', area: 'Security', weight: 8, pass: paths.includes('.gitignore'), severity: 'high', problem: 'No .gitignore file was detected', why: 'Secrets and generated files can be committed accidentally.', solution: 'Add a framework-appropriate .gitignore including environment files.' },
        { id: 'lint', area: 'Code quality', weight: 8, pass: Boolean(scripts.lint), severity: 'medium', problem: 'No lint command is defined', why: 'Common correctness and consistency problems may reach production.', solution: 'Configure a linter and expose it through the lint script.' },
        { id: 'deploy', area: 'Deployment readiness', weight: 8, pass: paths.some((item) => /vercel\.json|netlify\.toml|render\.yaml|dockerfile|fly\.toml/.test(item)) || frameworks.includes('Next.js'), severity: 'low', problem: 'No explicit deployment configuration was detected', why: 'Platform defaults may not capture runtime and routing requirements.', solution: 'Add provider configuration and document the deployment target.' },
        { id: 'license', area: 'Documentation', weight: 6, pass: paths.some((item) => /(^|\/)license(\.|$)/.test(item)), severity: 'low', problem: 'No license was detected', why: 'Reuse and contribution terms are unclear.', solution: 'Choose and add a license appropriate for the project.' }
    ];
    const total = checks.reduce((sum, check) => sum + check.weight, 0);
    const earned = checks.filter((check) => check.pass).reduce((sum, check) => sum + check.weight, 0);
    const score = Math.round((earned / total) * 100);
    const findings = checks.filter((check) => !check.pass).map((check) => ({
        ...check,
        file: check.id === 'env' ? environments[0]?.file || 'repository root' : 'repository root',
        risk: check.severity === 'critical' ? 'Release blocked' : check.severity === 'high' ? 'Likely release failure' : 'Reduced confidence',
        confidence: 96
    }));
    return { score, checks, findings };
}

function buildRecommendations({ dependencies, frameworks, readiness }) {
    const recommendations = readiness.findings.slice(0, 3).map((finding) => ({
        category: finding.area,
        title: finding.solution.replace(/\.$/, ''),
        current: finding.problem,
        recommended: finding.solution,
        why: finding.why,
        benefit: finding.severity === 'critical' || finding.severity === 'high' ? 'Higher release confidence' : 'Faster, more reliable maintenance',
        compatibility: `Fits the detected ${frameworks.slice(0, 2).join(' + ') || 'repository'} setup`,
        migrationRisk: finding.severity === 'critical' ? 'Medium' : 'Low',
        migrationPlan: ['Create an isolated branch', 'Apply the smallest configuration change', 'Run build and tests', 'Review the diff before creating a PR'],
        evidence: finding.file
    }));

    if (dependencies.includes('react') && !dependencies.some((item) => /vitest|jest/.test(item))) {
        recommendations.push({
            category: 'Code', title: 'Add component-level verification', current: 'React is present without a detected test runner',
            recommended: 'Add Vitest and Testing Library for critical interactions', why: 'The interface has no automated regression signal.',
            benefit: 'Safer UI changes', compatibility: 'Native fit for Vite and React', migrationRisk: 'Low',
            migrationPlan: ['Install test dependencies', 'Add a test configuration', 'Cover one critical flow', 'Run tests in CI'], evidence: 'package.json'
        });
    }
    return recommendations.slice(0, 5);
}

function architectureFrom(frameworks, dependencies) {
    const nodes = [];
    if (frameworks.some((item) => ['React', 'Next.js', 'Vue', 'Nuxt', 'Svelte', 'SvelteKit', 'Angular'].includes(item))) nodes.push({ id: 'client', label: frameworks.find((item) => ['Next.js', 'React', 'Nuxt', 'Vue', 'SvelteKit', 'Svelte', 'Angular'].includes(item)), type: 'interface' });
    if (frameworks.some((item) => ['Express', 'Fastify', 'NestJS', 'Django', 'Flask'].includes(item))) nodes.push({ id: 'api', label: frameworks.find((item) => ['Express', 'Fastify', 'NestJS', 'Django', 'Flask'].includes(item)), type: 'service' });
    const database = frameworks.find((item) => ['PostgreSQL', 'MySQL', 'Prisma', 'Mongoose', 'Supabase'].includes(item));
    if (database) nodes.push({ id: 'data', label: database, type: 'data' });
    if (dependencies.some((item) => /openai|anthropic|ai/.test(item))) nodes.push({ id: 'ai', label: 'AI provider', type: 'external' });
    return {
        nodes,
        edges: nodes.slice(1).map((node, index) => ({ from: nodes[index].id, to: node.id, label: index === 0 ? 'requests' : 'reads / writes' }))
    };
}

async function analyzeRepository(input, options = {}) {
    const { owner, repo } = parseRepository(input);
    const token = options.token || process.env.GITHUB_TOKEN;
    const metadata = await githubRequest(`${GITHUB_API}/repos/${owner}/${repo}`, token);
    const tree = await githubRequest(`${GITHUB_API}/repos/${owner}/${repo}/git/trees/${encodeURIComponent(metadata.default_branch)}?recursive=1`, token);
    if (tree.truncated) throw new Error('This repository is too large for the current analysis limit.');

    const classified = classifyFiles(tree.tree || []);
    const evidenceFiles = selectEvidenceFiles(classified.files);
    const evidence = await fetchEvidence(owner, repo, evidenceFiles, token);
    const packages = readPackageFiles(evidence);
    const dependencies = collectDependencies(packages);
    const frameworks = [...new Set(dependencies.map((name) => FRAMEWORK_SIGNALS[name]).filter(Boolean))];
    const languages = Object.entries(classified.sourceFiles.reduce((acc, file) => {
        const language = LANGUAGE_BY_EXTENSION[path.extname(file.path).toLowerCase()];
        if (language) acc[language] = (acc[language] || 0) + 1;
        return acc;
    }, {})).sort((a, b) => b[1] - a[1]).map(([name, files]) => ({ name, files }));
    const environments = extractEnvironment(evidence);
    const apiRoutes = extractApiRoutes(evidence, classified.apiFiles);
    const features = inferFeatures(classified.files, dependencies);
    const readiness = buildReadiness({ files: classified.files, packages, dependencies, environments, frameworks });

    const twin = {
        id: `${owner}-${repo}`.toLowerCase(),
        project: {
            name: metadata.name,
            fullName: metadata.full_name,
            description: metadata.description || 'No repository description provided.',
            repositoryUrl: metadata.html_url,
            defaultBranch: metadata.default_branch,
            visibility: metadata.private ? 'private' : 'public',
            stars: metadata.stargazers_count,
            updatedAt: metadata.updated_at
        },
        summary: {
            files: classified.files.length,
            sourceFiles: classified.sourceFiles.length,
            components: classified.components.length,
            pages: classified.pages.length,
            apiRoutes: apiRoutes.length || classified.apiFiles.length,
            models: classified.models.length,
            dependencies: dependencies.length
        },
        languages,
        frameworks,
        dependencies,
        components: classified.components.slice(0, 40).map((file) => file.path),
        pages: classified.pages.slice(0, 40).map((file) => file.path),
        apiRoutes,
        models: classified.models.slice(0, 30).map((file) => file.path),
        environment: environments,
        features,
        architecture: architectureFrom(frameworks, dependencies),
        readiness,
        recommendations: buildRecommendations({ dependencies, frameworks, readiness }),
        evidence: evidenceFiles.map((file) => file.path),
        generatedAt: new Date().toISOString()
    };
    return twin;
}

module.exports = {
    analyzeRepository,
    buildReadiness,
    classifyFiles,
    extractEnvironment,
    parseRepository
};
