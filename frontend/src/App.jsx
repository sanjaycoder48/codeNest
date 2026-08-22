import { createElement, useEffect, useState } from "react";
import {
  Activity, AlertTriangle, ArrowLeft, ArrowRight, Bot, Box, Braces, Check, CheckCircle2,
  ChevronDown, CircleDot, Code2, Database, ExternalLink, FileCode2, Github,
  FileDiff, GitPullRequest, Globe2, Home, Layers3, Link, ListChecks, LoaderCircle,
  LockKeyhole, Menu, Moon, PackageCheck, Plus, Rocket, Search, Send, Server,
  Settings, ShieldCheck, Sparkles, Star, Sun, TestTube2, UploadCloud,
  WandSparkles, X, Zap,
} from "lucide-react";
import { demoTwin, showcaseProjects } from "./data/demoTwin";
import { analyzePublicRepository } from "./data/analyzePublicRepository";
import { TwinSpaceApp } from "./twinspace/TwinSpaceApp";
import { CollaborationWorkspace } from "./components/collaboration/CollaborationWorkspace";

const API_URL = import.meta.env.VITE_API_URL || "";
const tabs = ["Overview", "Intelligence", "Readiness", "Upgrades", "Deploy", "Collaborate"];
const discoveryProjects = [
  { id: "ledger-loop", name: "LedgerLoop", owner: "maya-dev", description: "Open-source billing operations with typed workflows and a resilient event ledger.", stack: ["Next.js", "PostgreSQL", "Stripe"], category: "SaaS", score: 91, signal: "Strong architecture" },
  { id: "ship-shape", name: "ShipShape", owner: "build-labs", description: "A deployment observability toolkit that explains failed releases from logs and config.", stack: ["React", "Go", "ClickHouse"], category: "Developer tools", score: 87, signal: "12 verified features" },
  { id: "atlas-docs", name: "Atlas Docs", owner: "community-labs", description: "Living product documentation generated from source, schemas, and release history.", stack: ["SvelteKit", "Python", "pgvector"], category: "AI", score: 83, signal: "Evidence grounded" },
  { id: "pulse-board", name: "PulseBoard", owner: "nora-code", description: "Privacy-first product analytics with real-time funnels and release annotations.", stack: ["Vue", "Fastify", "PostgreSQL"], category: "Analytics", score: 79, signal: "Recently updated" },
];

const activityEvents = [
  { id: "analysis", type: "Analysis", title: "Project Twin analysis completed", detail: "Architecture, dependencies, routes, and environment requirements were indexed.", time: "12 minutes ago", target: "Intelligence", icon: Sparkles },
  { id: "readiness", type: "Analysis", title: "Launch readiness recalculated", detail: "Three evidence-backed findings changed the project score to 78/100.", time: "24 minutes ago", target: "Readiness", icon: ShieldCheck },
  { id: "upgrade", type: "Changes", title: "Upgrade recommendation created", detail: "An authenticated integration test was recommended for the escalation workflow.", time: "Today, 16:08", target: "Upgrades", icon: Zap },
  { id: "preview", type: "Deployments", title: "Preview deployment needs attention", detail: "Deployment Doctor verified that VITE_API_URL is missing from the preview environment.", time: "Today, 15:42", target: "Deploy", icon: Rocket },
  { id: "import", type: "Changes", title: "Repository imported", detail: "The main branch was connected and the initial Project Twin context was created.", time: "Yesterday, 18:20", target: "Overview", icon: Github },
];

function getDeploymentFinding(twin) {
  return twin.readiness.findings.find((item) => /deploy|config|environment|build|api url/i.test(`${item.problem} ${item.file}`)) || null;
}

function buildAIInsight(twin, type) {
  const path = twin.architecture.nodes.map((node) => node.label).join(" → ") || "No runtime path verified";
  const finding = twin.readiness.findings[0];
  const deploymentFinding = getDeploymentFinding(twin);
  const evidence = [...new Set(twin.evidence)].slice(0, 5);
  const insights = {
    architecture: {
      eyebrow: "Architecture Explainer", title: `${twin.project.name} system narrative`, target: "Intelligence",
      summary: `${twin.project.name} follows a verified ${twin.architecture.nodes.length}-layer runtime path: ${path}. The explanation is limited to relationships supported by indexed files.`,
      sections: [
        ["Entry layer", twin.architecture.nodes[0]?.label || "Application entry not verified"],
        ["Runtime boundary", twin.architecture.edges[0]?.label || "No explicit boundary verified"],
        ["Repository surface", `${twin.summary.components} components, ${twin.summary.apiRoutes} API routes, ${twin.summary.models} data models`],
      ], confidence: twin.architecture.nodes.length > 1 ? 94 : 72, evidence,
    },
    readiness: {
      eyebrow: "Production Analyst", title: "Prioritized launch plan", target: "Readiness",
      summary: `The repository scores ${twin.readiness.score}/100 from deterministic checks. The fastest evidence-backed path forward starts with ${finding?.problem?.toLowerCase() || "maintaining the passing quality gates"}.`,
      sections: twin.readiness.findings.slice(0, 3).map((item, index) => [`Priority ${index + 1} · ${item.severity}`, `${item.solution} (${item.file})`]),
      confidence: finding?.confidence || 95, evidence: [...new Set(twin.readiness.findings.slice(0, 4).map((item) => item.file))],
    },
    dependencies: {
      eyebrow: "Dependency Analyst", title: "Dependency posture", target: "Intelligence",
      summary: `${twin.dependencies.length} dependencies and ${twin.frameworks.length} framework signals were verified from repository manifests. Registry age and active advisories are intentionally not inferred without a live package audit.`,
      sections: [
        ["Primary stack", twin.frameworks.slice(0, 5).join(", ") || "No framework signal verified"],
        ["Manifest surface", `${twin.dependencies.length} direct development and runtime packages`],
        ["Recommended next check", "Run a live registry audit before approving dependency upgrades"],
      ], confidence: twin.dependencies.length ? 97 : 68, evidence: twin.evidence.filter((file) => /package|requirements|pyproject/i.test(file)).slice(0, 5),
    },
    deployment: {
      eyebrow: "Deployment Doctor", title: "Failure explanation", target: "Deploy",
      summary: deploymentFinding ? `${deploymentFinding.problem}. ${deploymentFinding.why}` : "No active deployment blocker was verified from the analyzed repository.",
      sections: deploymentFinding ? [["Affected evidence", deploymentFinding.file], ["Recommended action", deploymentFinding.solution], ["Release risk", deploymentFinding.risk]] : [["Status", "Preview checks can proceed"], ["Safety note", "Secrets and protected environment values were not inspected"]],
      confidence: deploymentFinding?.confidence || 92, evidence: deploymentFinding ? [deploymentFinding.file] : evidence.slice(0, 2),
    },
  };
  return insights[type] || insights.architecture;
}

const SHOWCASE_DRAFT_KEY = "codenest:showcase-drafts";
const TAGLINE_MAX = 90;
const DESCRIPTION_MAX = 320;

const defaultShowcaseCopy = (twin) => ({
  tagline: `${twin.features[0] || twin.project.name}, made clear and launch-ready.`,
  description: twin.project.description,
});

const defaultSections = () => ({
  Features: true, Technology: true, Architecture: true,
  "Technical highlights": true, "Ask this project": true,
});

// Drafts are keyed by project, so switching twins in the gallery and coming
// back does not lose what you wrote. Storage can be unavailable (private mode,
// disabled cookies), so every access is guarded.
function readShowcaseDrafts() {
  try { return JSON.parse(localStorage.getItem(SHOWCASE_DRAFT_KEY) || "{}"); }
  catch { return {}; }
}

function writeShowcaseDraft(id, draft) {
  try {
    const all = readShowcaseDrafts();
    all[id] = draft;
    localStorage.setItem(SHOWCASE_DRAFT_KEY, JSON.stringify(all));
  } catch { /* storage unavailable; the draft simply stays in memory */ }
}

// 228000 -> "228k". Raw six-digit counts are noise in a card footer.
function formatCount(value) {
  if (typeof value !== "number" || !Number.isFinite(value)) return "—";
  if (value >= 1000000) return `${(value / 1000000).toFixed(1).replace(/\.0$/, "")}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1).replace(/\.0$/, "")}k`;
  return String(value);
}

function Button({ children, variant = "primary", className = "", ...props }) {
  return <button className={`button button-${variant} ${className}`} {...props}>{children}</button>;
}

function Badge({ children, tone = "neutral" }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

function BrandMark() {
  return <div className="brand-mark"><Layers3 size={18} strokeWidth={2.4} /></div>;
}

function ImportDialog({ open, onClose, onComplete }) {
  const [repository, setRepository] = useState("sanjaycoder48/codeNest");
  const [job, setJob] = useState(null);
  const [error, setError] = useState("");

  const quickRepos = [
    { label: "codeNest", repo: "sanjaycoder48/codeNest", desc: "Project Twin (Current)" },
    { label: "React", repo: "facebook/react", desc: "UI Library" },
    { label: "Next.js", repo: "vercel/next.js", desc: "React Framework" },
    { label: "Express", repo: "expressjs/express", desc: "Node.js Framework" },
    { label: "Tailwind", repo: "tailwindlabs/tailwindcss", desc: "CSS Framework" },
  ];

  useEffect(() => {
    if (!open) {
      setJob(null);
      setError("");
    }
  }, [open]);

  useEffect(() => {
    if (!job?.id || ["complete", "failed"].includes(job.status)) return undefined;
    const timer = setInterval(async () => {
      try {
        const response = await fetch(`${API_URL}/api/analysis/${job.id}`);
        const next = await response.json();
        if (!response.ok) throw new Error(next.message);
        setJob(next);
        if (next.status === "complete") {
          clearInterval(timer);
          setTimeout(() => { setJob(null); onComplete(next.twin); }, 500);
        }
        if (next.status === "failed") setError(next.error);
      } catch (requestError) {
        setError(requestError.message || "Analysis could not be completed.");
        clearInterval(timer);
      }
    }, 900);
    return () => clearInterval(timer);
  }, [job?.id, job?.status, onComplete]);

  if (!open) return null;

  const startAnalysis = async (event, repoInput) => {
    if (event) event.preventDefault();
    const targetRepo = repoInput || repository;
    setError("");
    setJob({ status: "queued", progress: 4, stage: "Connecting to GitHub" });
    try {
      if (!API_URL) {
        const twin = await analyzePublicRepository(targetRepo, (progress, stage) => setJob({ status: "analyzing", progress, stage }));
        setJob({ status: "complete", progress: 100, stage: "Project Twin ready", twin });
        setTimeout(() => { setJob(null); onComplete(twin); }, 500);
        return;
      }
      const response = await fetch(`${API_URL}/api/analysis`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ repository: targetRepo }),
      });
      const next = await response.json();
      if (!response.ok) throw new Error(next.message);
      setJob(next);
    } catch (requestError) {
      setJob(null);
      setError(requestError.message === "Failed to fetch" ? "The analysis service could not be reached." : requestError.message);
    }
  };

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="import-title">
        <header className="modal-header">
          <div><p className="eyebrow">New project twin</p><h2 id="import-title">Import from GitHub</h2></div>
          <button className="icon-button" onClick={onClose} aria-label="Close"><X size={18} /></button>
        </header>
        {!job ? (
          <form onSubmit={(e) => startAnalysis(e)}>
            <label className="field-label" htmlFor="repository">Repository</label>
            <div className="input-shell"><Github size={18} /><input id="repository" value={repository} onChange={(event) => setRepository(event.target.value)} placeholder="owner/repository" autoFocus /></div>
            <div className="quick-repos-strip" style={{ display: "flex", gap: "6px", flexWrap: "wrap", margin: "10px 0" }}>
              {quickRepos.map((item) => (
                <button
                  type="button"
                  key={item.repo}
                  className="quick-chip"
                  style={{ fontSize: "12px", padding: "4px 10px", borderRadius: "16px", border: "1px solid var(--border-color, #e2e8f0)", background: repository === item.repo ? "var(--accent-bg, #f1f5f9)" : "transparent", cursor: "pointer" }}
                  onClick={() => { setRepository(item.repo); startAnalysis(null, item.repo); }}
                >
                  ⚡ {item.label}
                </button>
              ))}
            </div>
            <p className="field-help">Public repositories work immediately. Private access can use a server-side GitHub token.</p>
            {error && <div className="inline-alert"><AlertTriangle size={17} /><span>{error}</span></div>}
            <div className="trust-list">
              <div><ShieldCheck size={17} /><span>Repository files are inspected, never executed</span></div>
              <div><LockKeyhole size={17} /><span>Environment values and secrets are never requested</span></div>
            </div>
            <Button type="submit" className="full-width"><Sparkles size={17} /> Generate Project Twin</Button>
          </form>
        ) : (
          <div className="analysis-progress">
            <div className="scan-visual"><div className="scan-core"><Braces size={27} /></div><div className="scan-orbit" /></div>
            <Badge tone="violet"><LoaderCircle className="spin" size={13} /> Analyzing</Badge>
            <h3>{job.stage}</h3>
            <p>Building a verified map of structure, dependencies, routes, configuration, and release requirements.</p>
            <div className="progress-track"><span style={{ width: `${job.progress || 18}%` }} /></div>
            <div className="progress-meta"><span>{job.progress || 18}% complete</span><span>Read only</span></div>
            {error && <div className="inline-alert"><AlertTriangle size={17} /><span>{error}</span></div>}
          </div>
        )}
      </section>
    </div>
  );
}

function ConfirmDialog({ state, onClose, onConfirm }) {
  if (!state) return null;
  return <div className="modal-backdrop"><section className="modal modal-small" role="alertdialog" aria-modal="true"><div className="confirm-icon"><AlertTriangle size={21} /></div><h2>{state.title}</h2><p>{state.description}</p><div className="modal-actions"><Button variant="ghost" onClick={onClose}>Cancel</Button><Button onClick={onConfirm}>{state.action}</Button></div></section></div>;
}

function AIInsightDialog({ insight, onClose, onNavigate, onAsk }) {
  if (!insight) return null;
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><section className="modal ai-insight-modal" role="dialog" aria-modal="true" aria-labelledby="ai-insight-title"><header className="modal-header"><div><p className="eyebrow">{insight.eyebrow}</p><h2 id="ai-insight-title">{insight.title}</h2></div><button className="icon-button" onClick={onClose} aria-label="Close AI insight"><X size={18} /></button></header><div className="ai-confidence"><span className="assistant-mark"><Sparkles size={17} /></span><div><strong>Grounded synthesis</strong><small>{insight.confidence}% confidence from verified project context</small></div><Badge tone="violet">AI</Badge></div><p className="ai-insight-summary">{insight.summary}</p><div className="ai-insight-sections">{insight.sections.map(([label, value]) => <div key={label}><span>{label}</span><p>{value}</p></div>)}</div><div className="ai-evidence"><span>Repository evidence</span><div>{insight.evidence.length ? insight.evidence.map((file) => <code key={file}>{file}</code>) : <small>No direct file evidence was verified for this answer.</small>}</div></div><div className="modal-actions"><Button variant="ghost" onClick={() => { onClose(); onAsk(); }}><Bot size={15} /> Continue in Ask</Button><Button onClick={() => { onClose(); onNavigate(insight.target); }}>Open {insight.target}</Button></div></section></div>;
}

function SearchDialog({ twin, open, onClose, onSelect }) {
  const [query, setQuery] = useState("");
  if (!open) return null;
  const entries = [
    ...tabs.map((label) => ({ label, detail: `${label} workspace`, target: label, icon: Layers3 })),
    ...twin.features.map((label) => ({ label, detail: "Verified feature", target: "Overview", icon: CheckCircle2 })),
    ...twin.readiness.findings.map((item) => ({ label: item.problem, detail: item.file, target: "Readiness", icon: AlertTriangle })),
    ...twin.recommendations.map((item) => ({ label: item.title, detail: item.category, target: "Upgrades", icon: Zap })),
    ...twin.evidence.map((label) => ({ label, detail: "Indexed evidence", target: "Intelligence", icon: FileCode2 })),
  ];
  const normalized = query.trim().toLowerCase();
  const results = entries.filter((item) => !normalized || `${item.label} ${item.detail}`.toLowerCase().includes(normalized)).slice(0, 9);
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><section className="modal search-modal" role="dialog" aria-modal="true" aria-label="Search Project Twin"><div className="command-input"><Search size={18} /><input aria-label="Search project context" placeholder="Search pages, findings, features, or files" value={query} onChange={(event) => setQuery(event.target.value)} autoFocus /><kbd>Esc</kbd></div><div className="search-results">{results.map((item, index) => { const Icon = item.icon; return <button key={`${item.target}-${item.label}-${index}`} onClick={() => { onSelect(item.target); onClose(); }}><span><Icon size={16} /></span><div><strong>{item.label}</strong><small>{item.detail}</small></div><ArrowRight size={14} /></button>; })}{!results.length ? <div className="empty-state search-empty"><Search size={22} /><strong>No matching project context</strong><p>Try a route, finding, feature, or evidence file.</p></div> : null}</div></section></div>;
}

function SettingsDialog({ open, onClose, theme, onTheme, notify }) {
  const [releaseAlerts, setReleaseAlerts] = useState(true);
  const [analysisAlerts, setAnalysisAlerts] = useState(true);
  if (!open) return null;
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><section className="modal settings-modal" role="dialog" aria-modal="true" aria-labelledby="settings-title"><header className="modal-header"><div><p className="eyebrow">Developer workspace</p><h2 id="settings-title">Settings</h2></div><button className="icon-button" onClick={onClose} aria-label="Close settings"><X size={18} /></button></header><div className="settings-profile"><span className="avatar">SK</span><div><strong>Sanjay Kumar</strong><small>Developer workspace</small></div></div><div className="settings-row"><div><strong>Appearance</strong><small>Choose the workspace color theme.</small></div><div className="segmented"><button className={theme === "dark" ? "active" : ""} onClick={() => onTheme("dark")}><Moon size={14} /> Dark</button><button className={theme === "light" ? "active" : ""} onClick={() => onTheme("light")}><Sun size={14} /> Light</button></div></div><div className="settings-row"><div><strong>Release alerts</strong><small>Preview and production status changes.</small></div><button className={`switch ${releaseAlerts ? "active" : ""}`} role="switch" aria-checked={releaseAlerts} onClick={() => setReleaseAlerts((value) => !value)}><span /></button></div><div className="settings-row"><div><strong>Analysis alerts</strong><small>Repository analysis and recommendation updates.</small></div><button className={`switch ${analysisAlerts ? "active" : ""}`} role="switch" aria-checked={analysisAlerts} onClick={() => setAnalysisAlerts((value) => !value)}><span /></button></div><div className="modal-actions"><Button variant="ghost" onClick={onClose}>Cancel</Button><Button onClick={() => { notify("Workspace settings saved"); onClose(); }}>Save settings</Button></div></section></div>;
}

function Sidebar({ active, onChange, onImport, onSettings, mobileOpen, setMobileOpen, unreadActivity }) {
  const selectWorkspace = (label) => {
    onChange(label === "Projects" ? "Overview" : label);
    setMobileOpen(false);
  };
  return <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
    <div className="brand"><BrandMark /><span>CodeNest</span><button className="sidebar-close" aria-label="Close navigation" onClick={() => setMobileOpen(false)}><X size={18} /></button></div>
    <Button variant="secondary" className="new-project" onClick={onImport}><Plus size={16} /> New project</Button>
    <nav aria-label="Main navigation">
      <p className="nav-label">Workspace</p>
      {[["Projects", Home], ["Discover", Globe2], ["Activity", Activity]].map(([label, icon]) => <button key={label} className={(label === "Projects" ? tabs.includes(active) : active === label) ? "nav-item active" : "nav-item"} onClick={() => selectWorkspace(label)}>{createElement(icon, { size: 17 })}{label}{label === "Activity" && unreadActivity > 0 ? <span className="nav-count">{unreadActivity}</span> : null}</button>)}
      <p className="nav-label nav-label-spaced">Project</p>
      {tabs.map((tab) => <button key={tab} className={active === tab ? "nav-item active" : "nav-item"} onClick={() => { onChange(tab); setMobileOpen(false); }}><CircleDot size={15} />{tab}</button>)}
    </nav>
    <button className="sidebar-footer" onClick={onSettings}><div className="avatar">SK</div><div><strong>Sanjay Kumar</strong><span>Developer workspace</span></div><Settings size={15} /></button>
  </aside>;
}

function Topbar({ twin, onSelectTwin, onImport, onMobileMenu, onSearch, theme, onToggleTheme, onChange }) {
  const [projectOpen, setProjectOpen] = useState(false);
  return <header className="topbar">
    <button className="mobile-menu" onClick={onMobileMenu} aria-label="Open navigation"><Menu size={19} /></button>
    <div className="project-switcher-wrap">
      <button className="project-switcher" onClick={() => setProjectOpen((value) => !value)} aria-expanded={projectOpen}>
        <span className="project-avatar">{twin.project.name.slice(0, 2).toUpperCase()}</span>
        <span className="project-switcher-copy"><strong>{twin.project.name}</strong><small>{twin.project.fullName}</small></span>
        <ChevronDown size={15} />
      </button>
      {projectOpen ? (
        <div className="project-menu panel">
          <p className="nav-label">Current project</p>
          <button onClick={() => { onChange("Overview"); setProjectOpen(false); }}>
            <Home size={15} /><span><strong>{twin.project.name}</strong><small>Open project overview</small></span>
          </button>
          <button onClick={() => { window.open(twin.project.repositoryUrl, "_blank", "noopener,noreferrer"); setProjectOpen(false); }}>
            <Github size={15} /><span><strong>Repository</strong><small>{twin.project.fullName}</small></span>
          </button>
          <p className="nav-label nav-label-spaced">Featured Showcase Projects</p>
          {showcaseProjects.map((item) => (
            <button key={item.id} onClick={() => { onSelectTwin(item); onChange("Overview"); setProjectOpen(false); }}>
              <Sparkles size={15} /><span><strong>{item.project.name}</strong><small>{item.project.fullName}</small></span>
            </button>
          ))}
          <div style={{ borderTop: "1px solid var(--border-color, #e2e8f0)", marginTop: "6px", paddingTop: "6px" }}>
            <button onClick={() => { onImport(); setProjectOpen(false); }}>
              <Plus size={15} /><span><strong>Import custom GitHub repo</strong><small>Analyze any public repository URL</small></span>
            </button>
          </div>
        </div>
      ) : null}
    </div>
    <div className="topbar-actions"><button className="command-search" onClick={onSearch}><Search size={16} /><span>Search project</span><kbd>Ctrl K</kbd></button><button className="icon-button mobile-search" onClick={onSearch} aria-label="Search project"><Search size={17} /></button><button className="icon-button theme-toggle" onClick={onToggleTheme} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}>{theme === "dark" ? <Moon size={17} /> : <Sun size={17} />}</button><Button variant="secondary" onClick={onImport}><Github size={16} /> Import repository</Button></div>
  </header>;
}

function ScoreRing({ score, small = false }) {
  return <div className={`score-ring ${small ? "score-ring-small" : ""}`} style={{ "--score": `${Math.round(score * 3.6)}deg` }}><div><strong>{score}</strong><span>/100</span></div></div>;
}

function PageTitle({ eyebrow, title, description, action }) {
  return <section className="page-title"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{description}</p></div>{action}</section>;
}

function Architecture({ twin, detailed = false, onSelect }) {
  const nodes = twin.architecture.nodes.length ? twin.architecture.nodes : [{ id: "repo", label: "Application", type: "interface" }];
  return <div className={`architecture ${detailed ? "architecture-detailed" : ""}`}>{nodes.map((node, index) => <div className="architecture-step" key={node.id}><button type="button" className={`architecture-node node-${node.type}`} onClick={() => onSelect?.(node)}><span>{node.type === "data" ? <Database size={20} /> : node.type === "service" ? <Server size={20} /> : <Code2 size={20} />}</span><div><small>{node.type}</small><strong>{node.label}</strong></div><ChevronDown size={14} /></button>{index < nodes.length - 1 && <div className="architecture-link"><span>{twin.architecture.edges[index]?.label || "connects"}</span><ArrowRight size={17} /></div>}</div>)}</div>;
}

// The Overview tab has two levels: an index of every project twin, and the
// detailed view for whichever one you open.
function Overview({ twin, setActive, onAI, opened, onOpen, onBack, requestConfirm, notify, onAsk, view, setView }) {
  if (!opened) return <OverviewIndex twin={twin} onOpen={onOpen} />;

  return <div className="page-stack">
    <button type="button" className="text-button back-link" onClick={onBack}>
      <ArrowLeft size={14} /> All projects
    </button>
    <div className="subnav project-subnav">
      {["Overview", "Case study"].map((item) => (
        <button key={item} className={view === item ? "active" : ""} onClick={() => setView(item)}>{item}</button>
      ))}
    </div>
    {view === "Case study"
      ? <Showcase key={twin.id} twin={twin} requestConfirm={requestConfirm} notify={notify} onAsk={onAsk} />
      : <OverviewDetail twin={twin} setActive={setActive} onAI={onAI} onCaseStudy={() => setView("Case study")} />}
  </div>;
}

function OverviewIndex({ twin, onOpen }) {
  const average = Math.round(showcaseProjects.reduce((total, item) => total + item.readiness.score, 0) / showcaseProjects.length);
  return <div className="page-stack">
    <PageTitle
      eyebrow="Projects"
      title="All project twins"
      description={`${showcaseProjects.length} analysed repositories · ${average}/100 average launch readiness. Open one to see its full overview.`}
    />
    <section className="panel gallery">
      <div className="gallery-grid">
        {showcaseProjects.map((item) => (
          <ProjectCard key={item.id} item={item} active={twin.id === item.id} onOpen={onOpen} />
        ))}
      </div>
    </section>
  </div>;
}

function OverviewDetail({ twin, setActive, onAI, onCaseStudy }) {
  const majorFinding = twin.readiness.findings[0];
  const aiActions = [
    ["architecture", "Explain architecture", "Trace runtime layers and evidence", Layers3],
    ["readiness", "Plan launch fixes", "Prioritize verified readiness gaps", ShieldCheck],
    ["dependencies", "Review dependencies", "Summarize the manifest surface", PackageCheck],
  ];
  return <div className="page-stack">
    <section className="project-heading"><div><div className="heading-meta"><Badge tone="green"><CheckCircle2 size={13} /> Analysis complete</Badge><span>Updated {new Date(twin.generatedAt).toLocaleDateString()}</span></div><h1>CodeNest <span>— {twin.project.name}</span></h1><p>{twin.project.description}</p><div className="stack-row">{twin.frameworks.slice(0, 5).map((item) => <Badge key={item}>{item}</Badge>)}</div></div><div className="heading-actions"><Button variant="ghost" onClick={() => window.open(twin.project.repositoryUrl, "_blank", "noopener,noreferrer")}><ExternalLink size={16} /> Repository</Button><Button onClick={() => setActive("Deploy")}><Rocket size={16} /> Create preview</Button></div></section>
    <section className="readiness-banner"><ScoreRing score={twin.readiness.score} /><div className="readiness-copy"><p className="eyebrow">Launch readiness</p><h2>{twin.readiness.score >= 80 ? "Nearly ready to ship" : "A few issues need attention"}</h2><p>{twin.readiness.findings.length} evidence-backed findings across configuration, quality, security, and deployment.</p></div><div className="readiness-priority"><span>Highest priority</span><strong>{majorFinding?.problem || "No blocking issues detected"}</strong><button onClick={() => setActive("Readiness")}>Review findings <ArrowRight size={14} /></button></div></section>
    <div className="metric-strip">{[["Components", twin.summary.components, Box], ["Pages", twin.summary.pages, FileCode2], ["API routes", twin.summary.apiRoutes, Braces], ["Data models", twin.summary.models, Database], ["Dependencies", twin.summary.dependencies, PackageCheck]].map(([label, value, icon]) => <div key={label}>{createElement(icon, { size: 18 })}<span>{label}</span><strong>{value}</strong></div>)}</div>
    <section className="panel ai-command-panel"><header><div><span className="assistant-mark"><Sparkles size={17} /></span><div><p className="eyebrow">AI project actions</p><h2>Work from verified context</h2></div></div><Badge tone="green"><ShieldCheck size={12} /> Evidence grounded</Badge></header><div className="ai-command-grid">{aiActions.map(([type, label, detail, icon]) => <button key={type} onClick={() => onAI(type)}><span>{createElement(icon, { size: 16 })}</span><div><strong>{label}</strong><small>{detail}</small></div><ArrowRight size={14} /></button>)}<button onClick={onCaseStudy}><span><WandSparkles size={16} /></span><div><strong>Draft showcase</strong><small>Turn project context into a case study</small></div><ArrowRight size={14} /></button></div></section>
    <div className="content-grid"><section className="panel architecture-panel"><div className="panel-header"><div><p className="eyebrow">System map</p><h2>Architecture</h2></div><button className="text-button" onClick={() => setActive("Intelligence")}>Explore map <ArrowRight size={14} /></button></div><Architecture twin={twin} onSelect={() => setActive("Intelligence")} /><p className="architecture-summary">The interface communicates with the application service over defined boundaries, which owns persistence and external integrations.</p></section><section className="panel"><div className="panel-header"><div><p className="eyebrow">What it does</p><h2>Detected features</h2></div><Badge>{twin.features.length} verified</Badge></div><div className="feature-list">{twin.features.slice(0, 5).map((feature, index) => <div key={feature}><span>{String(index + 1).padStart(2, "0")}</span><strong>{feature}</strong><Check size={15} /></div>)}</div></section></div>
    <div className="content-grid lower-grid"><section className="panel"><div className="panel-header"><div><p className="eyebrow">Recent signal</p><h2>Recommendations</h2></div><button className="text-button" onClick={() => setActive("Upgrades")}>View all <ArrowRight size={14} /></button></div>{twin.recommendations.slice(0, 2).map((item) => <button className="recommendation-row" onClick={() => setActive("Upgrades")} key={item.title}><span className="recommendation-icon"><Zap size={16} /></span><span><strong>{item.title}</strong><small>{item.benefit} · {item.migrationRisk} migration risk</small></span><ArrowRight size={15} /></button>)}</section><section className="panel"><div className="panel-header"><div><p className="eyebrow">Latest deployment</p><h2>Preview environment</h2></div><Badge tone="red">Failed</Badge></div><div className="deployment-brief"><div><AlertTriangle size={20} /><span><strong>Build stopped</strong><small>Missing VITE_API_URL</small></span></div><button className="text-button" onClick={() => setActive("Deploy")}>Open Deployment Doctor <ArrowRight size={14} /></button></div></section></div>
  </div>;
}

function Discover({ twin, setActive }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState(null);
  const currentProject = {
    id: twin.id,
    name: twin.project.name,
    owner: twin.project.fullName.split("/")[0],
    description: twin.project.description,
    stack: twin.frameworks.slice(0, 3),
    category: "Your project",
    score: twin.readiness.score,
    signal: `${twin.summary.apiRoutes} API routes verified`,
    current: true,
  };
  const projects = [currentProject, ...discoveryProjects];
  const normalizedQuery = query.trim().toLowerCase();
  const visibleProjects = projects.filter((project) => {
    const matchesCategory = category === "All" || project.category === category;
    const matchesQuery = !normalizedQuery || `${project.name} ${project.owner} ${project.description} ${project.stack.join(" ")}`.toLowerCase().includes(normalizedQuery);
    return matchesCategory && matchesQuery;
  });

  return <div className="page-stack"><PageTitle eyebrow="Community intelligence" title="Discover projects" description="Explore public Project Twins through verified architecture, technology, and readiness signals." action={<Button onClick={() => setActive("Overview")}><Home size={16} /> Open your project</Button>} />
    <section className="discover-toolbar panel"><div className="discover-search"><Search size={17} /><input aria-label="Search discovered projects" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search projects, technologies, or owners" />{query ? <button aria-label="Clear discovery search" onClick={() => setQuery("")}><X size={15} /></button> : null}</div><div className="filter-row discover-filters">{["All", "Developer tools", "AI", "SaaS", "Analytics"].map((item) => <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>)}</div></section>
    <div className="discover-meta"><span>{visibleProjects.length} projects</span><span>Ranked by verified project context</span></div>
    {visibleProjects.length ? <section className="discover-grid">{visibleProjects.map((project) => <article className="discover-card panel" key={project.id}><header><span className="discover-mark">{project.name.slice(0, 2).toUpperCase()}</span><div><h2>{project.name}</h2><p>{project.owner}</p></div>{project.current ? <Badge tone="violet">Your Twin</Badge> : <Badge tone="green">{project.score}/100</Badge>}</header><p className="discover-description">{project.description}</p><div className="stack-row">{project.stack.map((item) => <Badge key={item}>{item}</Badge>)}</div><footer><span><CircleDot size={12} /> {project.signal}</span><Button variant="ghost" onClick={() => project.current ? setActive("Overview") : setSelected(project)}>{project.current ? "Open Twin" : "Inspect"} <ArrowRight size={14} /></Button></footer></article>)}</section> : <section className="panel empty-state"><Search size={23} /><strong>No projects match those filters</strong><p>Try a technology, owner, or a different category.</p><Button variant="ghost" onClick={() => { setQuery(""); setCategory("All"); }}>Clear filters</Button></section>}
    {selected ? <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setSelected(null)}><section className="modal discover-detail" role="dialog" aria-modal="true" aria-labelledby="discover-project-title"><header className="modal-header"><div><p className="eyebrow">Public Project Twin</p><h2 id="discover-project-title">{selected.name}</h2></div><button className="icon-button" aria-label="Close discovered project" onClick={() => setSelected(null)}><X size={18} /></button></header><p>{selected.description}</p><div className="discovery-score"><ScoreRing score={selected.score} small /><div><span>Launch readiness</span><strong>{selected.signal}</strong><p>Based on public repository evidence available to Project Twin.</p></div></div><div className="stack-row">{selected.stack.map((item) => <Badge key={item}>{item}</Badge>)}</div><div className="modal-actions"><Button variant="ghost" onClick={() => setSelected(null)}>Close</Button><Button onClick={() => window.open(`https://github.com/${selected.owner}`, "_blank", "noopener,noreferrer")}><Github size={15} /> View owner</Button></div></section></div> : null}
  </div>;
}

function ActivityView({ twin, setActive, notify }) {
  const [filter, setFilter] = useState("All");
  const events = activityEvents.map((event) => event.id === "analysis" ? { ...event, detail: `${twin.summary.files} repository files were classified and ${twin.evidence.length} high-signal files were indexed.` } : event);
  const visibleEvents = events.filter((event) => filter === "All" || event.type === filter);
  return <div className="page-stack"><PageTitle eyebrow="Project evolution" title="Activity" description={`A chronological record of analysis, recommendations, deployments, and important changes for ${twin.project.name}.`} action={<Button variant="secondary" onClick={() => notify("All activity marked as read")}><Check size={16} /> Mark all read</Button>} />
    <div className="activity-summary"><div><Activity size={17} /><span>Events this week</span><strong>{events.length}</strong></div><div><Sparkles size={17} /><span>Analysis updates</span><strong>2</strong></div><div><Rocket size={17} /><span>Deployments</span><strong>1</strong></div></div>
    <section className="activity-layout"><aside className="panel activity-filter"><p className="nav-label">Filter activity</p>{["All", "Analysis", "Deployments", "Changes"].map((item) => <button key={item} className={filter === item ? "active" : ""} onClick={() => setFilter(item)}><span>{item}</span><small>{item === "All" ? events.length : events.filter((event) => event.type === item).length}</small></button>)}</aside><div className="activity-timeline">{visibleEvents.map((event, index) => { const Icon = event.icon; return <article className="activity-event panel" key={event.id}><div className="activity-rail"><span className={`activity-icon activity-icon-${event.type.toLowerCase()}`}><Icon size={16} /></span>{index < visibleEvents.length - 1 ? <i /> : null}</div><div><div className="activity-event-meta"><Badge tone={event.type === "Deployments" ? "amber" : event.type === "Analysis" ? "violet" : "neutral"}>{event.type}</Badge><time>{event.time}</time></div><h2>{event.title}</h2><p>{event.detail}</p><button className="text-button" onClick={() => setActive(event.target)}>Open {event.target} <ArrowRight size={13} /></button></div></article>; })}</div></section>
  </div>;
}

function DataTable({ headers, rows, empty, nested = false }) {
  const content = rows.length ? <div className="data-table"><div className="table-row table-head">{headers.map((header) => <span key={header}>{header}</span>)}</div>{rows.map((row, index) => <div className="table-row" key={index}>{row.map((cell, cellIndex) => <span key={cellIndex}>{cell}</span>)}</div>)}</div> : <div className="empty-state"><Search size={22} /><strong>Nothing verified here yet</strong><p>{empty}</p></div>;
  return nested ? content : <section className="panel table-panel">{content}</section>;
}

function Intelligence({ twin, onAI }) {
  const [selected, setSelected] = useState("Architecture");
  const [inspectedNode, setInspectedNode] = useState(null);
  const groups = ["Architecture", "Routes & APIs", "Components", "Configuration", "Evidence"];
  const nodeEvidence = inspectedNode?.type === "service" ? twin.apiRoutes.map((route) => route.file) : inspectedNode?.type === "data" ? twin.models : [...twin.pages, ...twin.components];
  return <div className="page-stack"><PageTitle eyebrow="Repository intelligence" title="A working map of the project" description={`Grounded in ${twin.evidence.length} high-signal files and ${twin.summary.files} repository entries.`} action={<Button variant="secondary" onClick={() => onAI("architecture")}><Sparkles size={16} /> Explain with AI</Button>} /><div className="subnav">{groups.map((item) => <button key={item} className={selected === item ? "active" : ""} onClick={() => setSelected(item)}>{item}</button>)}</div>
    {selected === "Architecture" && <section className="panel intelligence-map"><div className="panel-header"><div><h2>Architecture graph</h2><p>Important runtime layers and verified relationships.</p></div><Badge tone="green"><CircleDot size={12} /> Live context</Badge></div><Architecture twin={twin} detailed onSelect={setInspectedNode} /><div className="insight-callout"><Sparkles size={18} /><div><strong>Architecture summary</strong><p>{twin.frameworks.join(" and ")} form the primary application path. Modules are linked from repository paths and dependency manifests.</p></div></div></section>}
    {selected === "Routes & APIs" && <DataTable headers={["Method", "Route", "Evidence"]} rows={twin.apiRoutes.map((route) => [<Badge key="method" tone={route.method === "GET" ? "green" : "violet"}>{route.method}</Badge>, route.path, route.file])} empty="No explicit API route declarations were verified." />}
    {selected === "Components" && <DataTable headers={["Component", "Type", "Evidence"]} rows={twin.components.map((file) => [file.split(/[\\/]/).pop(), "Interface component", file])} empty="No standalone interface components were verified." />}
    {selected === "Configuration" && <DataTable headers={["Variable", "Sensitivity", "Referenced in"]} rows={twin.environment.map((item) => [item.name, item.sensitive ? <Badge tone="amber">Protected</Badge> : <Badge>Public config</Badge>, item.file])} empty="No environment variable references were found in the selected evidence files." />}
    {selected === "Evidence" && <section className="panel evidence-list">{twin.evidence.map((file) => <div key={file}><FileCode2 size={16} /><code>{file}</code><Badge tone="green">Indexed</Badge></div>)}</section>}
    {inspectedNode ? <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setInspectedNode(null)}><section className="modal node-detail" role="dialog" aria-modal="true" aria-labelledby="node-title"><header className="modal-header"><div><p className="eyebrow">Architecture module</p><h2 id="node-title">{inspectedNode.label}</h2></div><button className="icon-button" onClick={() => setInspectedNode(null)} aria-label="Close module details"><X size={18} /></button></header><div className="node-summary"><Badge tone="violet">{inspectedNode.type}</Badge><p>{inspectedNode.type === "interface" ? "User-facing pages and components form this runtime layer." : inspectedNode.type === "service" ? "Verified routes and service modules process application requests." : "Persistent models and schema evidence form the data layer."}</p></div><p className="field-label">Linked repository evidence</p><div className="node-files">{[...new Set(nodeEvidence)].slice(0, 6).map((file) => <div key={file}><FileCode2 size={15} /><code>{file}</code></div>)}{!nodeEvidence.length ? <p>No direct file relationship could be verified.</p> : null}</div><div className="modal-actions"><Button variant="ghost" onClick={() => setInspectedNode(null)}>Close</Button><Button onClick={() => { setSelected(inspectedNode.type === "service" ? "Routes & APIs" : inspectedNode.type === "data" ? "Configuration" : "Components"); setInspectedNode(null); }}>Open evidence</Button></div></section></div> : null}
  </div>;
}

function Finding({ finding }) {
  const [expanded, setExpanded] = useState(false);
  return <article className="finding panel"><button className="finding-main" onClick={() => setExpanded(!expanded)}><span className={`severity-dot severity-${finding.severity}`} /><div><div className="finding-meta"><Badge tone={finding.severity === "high" || finding.severity === "critical" ? "red" : finding.severity === "medium" ? "amber" : "neutral"}>{finding.severity}</Badge><span>{finding.area}</span><span>{finding.confidence}% confidence</span></div><h3>{finding.problem}</h3><code>{finding.file}</code></div><ChevronDown size={18} className={expanded ? "rotate" : ""} /></button>{expanded && <div className="finding-details"><div><span>Why it matters</span><p>{finding.why}</p></div><div><span>Recommended solution</span><p>{finding.solution}</p></div><div><span>Risk</span><p>{finding.risk}</p></div></div>}</article>;
}

function Readiness({ twin, onAI }) {
  const [filter, setFilter] = useState("All");
  const findings = twin.readiness.findings.filter((item) => filter === "All" || item.severity === filter);
  return <div className="page-stack"><PageTitle eyebrow="Production analysis" title="Launch Readiness" description="A weighted score derived from repository checks, not an AI estimate." action={<div className="ai-page-actions"><Button variant="secondary" onClick={() => onAI("readiness")}><Sparkles size={16} /> Generate fix plan</Button><ScoreRing score={twin.readiness.score} small /></div>} /><div className="readiness-layout"><aside className="score-breakdown panel"><h3>Quality gates</h3>{[["Build & config", 82], ["Security", 74], ["Code quality", 81], ["Documentation", 68], ["Deployment", 76]].map(([label, value]) => <div className="quality-row" key={label}><div><span>{label}</span><strong>{value}</strong></div><div><span style={{ width: `${value}%` }} /></div></div>)}<div className="score-note"><ShieldCheck size={17} /><p>Every finding includes its evidence location and confidence.</p></div></aside><section className="findings-section"><div className="filter-row">{["All", "critical", "high", "medium", "low"].map((item) => <button key={item} className={filter === item ? "active" : ""} onClick={() => setFilter(item)}>{item === "All" ? `All (${twin.readiness.findings.length})` : item}</button>)}</div>{findings.map((finding) => <Finding key={finding.id} finding={finding} />)}{!findings.length && <div className="panel empty-state"><CheckCircle2 size={24} /><strong>No findings at this severity</strong><p>The verified checks in this category passed.</p></div>}</section></div></div>;
}

function Upgrades({ twin, notify, requestConfirm }) {
  const [sandbox, setSandbox] = useState(null);
  const runSandbox = (item) => { setSandbox({ item, status: "running", view: "report" }); setTimeout(() => setSandbox({ item, status: "complete", view: "report" }), 1800); };
  return <div className="page-stack"><PageTitle eyebrow="Contextual improvements" title="Upgrade Advisor" description="Recommendations ranked by project benefit, compatibility, and migration risk." /><div className="advisor-summary"><WandSparkles size={20} /><div><strong>{twin.recommendations.length} relevant upgrades found</strong><p>Nothing is applied until you review the isolated verification report.</p></div></div><div className="upgrade-list">{twin.recommendations.map((item, index) => <article className="upgrade-card panel" key={item.title}><header><span className="upgrade-number">0{index + 1}</span><div><Badge tone={index === 0 ? "violet" : "neutral"}>{item.category}</Badge><h2>{item.title}</h2><p>{item.why}</p></div><Badge tone="green">{item.migrationRisk} risk</Badge></header><div className="change-compare"><div><span>Current</span><p>{item.current}</p></div><ArrowRight size={18} /><div><span>Recommended</span><p>{item.recommended}</p></div></div><footer><div><strong>{item.benefit}</strong><span>{item.compatibility}</span></div><Button variant="secondary" onClick={() => runSandbox(item)}><TestTube2 size={16} /> Test safely</Button></footer></article>)}</div>
    {sandbox && <div className="modal-backdrop"><section className="modal sandbox-modal"><header className="modal-header"><div><p className="eyebrow">Isolated upgrade branch</p><h2>{sandbox.item.title}</h2></div>{sandbox.status === "complete" && <button className="icon-button" aria-label="Close upgrade report" onClick={() => setSandbox(null)}><X size={18} /></button>}</header>{sandbox.status === "running" ? <div className="sandbox-running"><LoaderCircle className="spin" size={28} /><h3>Verifying compatibility</h3><div className="sandbox-steps"><span className="done"><Check size={14} /> Branch created</span><span className="done"><Check size={14} /> Changes applied</span><span className="active"><LoaderCircle className="spin" size={14} /> Running build and tests</span></div></div> : <div><div className="subnav report-tabs"><button className={sandbox.view === "report" ? "active" : ""} onClick={() => setSandbox({ ...sandbox, view: "report" })}><ListChecks size={14} /> Report</button><button className={sandbox.view === "diff" ? "active" : ""} onClick={() => setSandbox({ ...sandbox, view: "diff" })}><FileDiff size={14} /> Diff</button><button className={sandbox.view === "plan" ? "active" : ""} onClick={() => setSandbox({ ...sandbox, view: "plan" })}><GitPullRequest size={14} /> Migration plan</button></div>{sandbox.view === "report" ? <><div className="verification-result"><div><span>Build</span><strong className="success-text">PASS</strong></div><div><span>Tests</span><strong>43/43</strong></div><div><span>Breaking changes</span><strong>0</strong></div><div><span>Confidence</span><strong>94%</strong></div></div><div className="inline-alert inline-success"><CheckCircle2 size={17} /><span>Compatible in the isolated environment. No repository changes were published.</span></div></> : sandbox.view === "diff" ? <div className="diff-preview"><div><span>Evidence</span><code>{sandbox.item.evidence}</code></div><pre><span>- {sandbox.item.current}</span>{"\n"}<strong>+ {sandbox.item.recommended}</strong></pre></div> : <ol className="migration-plan">{sandbox.item.migrationPlan.map((step, index) => <li key={step}><span>{index + 1}</span><div><strong>{step}</strong><small>{index === sandbox.item.migrationPlan.length - 1 ? "Requires your approval" : "Runs in the isolated branch"}</small></div></li>)}</ol>}<div className="modal-actions"><Button variant="ghost" onClick={() => { setSandbox(null); notify("Sandbox discarded; repository unchanged"); }}>Discard</Button><Button variant="secondary" onClick={() => setSandbox({ ...sandbox, view: "diff" })}><FileDiff size={15} /> View diff</Button><Button onClick={() => requestConfirm({ title: "Create a draft pull request?", description: "This prepares the verified sandbox changes for review. It will not merge them.", action: "Create draft PR" }, () => { setSandbox(null); notify("Draft pull request prepared for review"); })}><GitPullRequest size={15} /> Create PR</Button></div></div>}</section></div>}
  </div>;
}

function Deploy({ twin, requestConfirm, notify, onAI }) {
  const deploymentFinding = getDeploymentFinding(twin);
  const [state, setState] = useState(deploymentFinding ? "failed" : "ready");
  const [buildProgress, setBuildProgress] = useState(0);
  const configure = () => requestConfirm({ title: `Resolve ${deploymentFinding?.problem || "deployment configuration"}?`, description: "This records approval for the preview configuration change. Project Twin never reads or displays protected values.", action: "Approve configuration" }, () => { setState("configured"); notify("Environment configuration approved"); });
  const retry = () => {
    setState("building");
    setBuildProgress(14);
    [42, 71, 92].forEach((progress, index) => setTimeout(() => setBuildProgress(progress), 420 * (index + 1)));
    setTimeout(() => { setBuildProgress(100); setState("ready"); notify("Preview deployment is ready"); }, 1850);
  };
  const promote = () => requestConfirm({ title: "Deploy to production?", description: "This promotes the verified preview and records your approval in the audit trail.", action: "Deploy production" }, () => { setState("production"); notify("Production deployment is live"); });
  const previewComplete = state === "ready" || state === "production";
  const statusLabel = state === "production" ? "Live" : state === "ready" ? "Ready" : state === "building" ? "Building" : state === "configured" ? "Configured" : "Failed";
  const statusTone = previewComplete ? "green" : state === "building" || state === "configured" ? "violet" : "red";
  return <div className="page-stack"><PageTitle eyebrow="Release workflow" title="Deploy with confidence" description="Readiness, preview build, verification, approval, then production." action={<Button onClick={state === "configured" ? retry : state === "ready" ? promote : state === "production" ? () => window.open(window.location.href, "_blank", "noopener,noreferrer") : () => notify("Resolve the verified configuration issue first")}><Rocket size={16} /> {state === "configured" ? "Retry preview" : state === "ready" ? "Deploy production" : state === "production" ? "Open production" : "New preview"}</Button>} /><div className="deploy-pipeline">{[["Repository", true], ["Readiness", true], ["Preview", previewComplete], ["Verification", previewComplete], ["Production", state === "production"]].map(([label, complete], index) => <div className={complete ? "complete" : state === "building" && index === 2 ? "active" : ""} key={label}><span>{complete ? <Check size={14} /> : index + 1}</span><strong>{label}</strong></div>)}</div><div className="deploy-grid"><section className="panel deployment-card"><div className="panel-header"><div><p className="eyebrow">Preview deployment</p><h2>{state === "production" ? "Live in production" : state === "ready" ? "Ready to review" : state === "building" ? "Building preview" : state === "configured" ? "Configuration approved" : "Deployment failed"}</h2></div><Badge tone={statusTone}>{statusLabel}</Badge></div>{state === "building" ? <div className="build-progress"><LoaderCircle className="spin" size={24} /><strong>Installing and building in an isolated runner</strong><div className="progress-track"><span style={{ width: `${buildProgress}%` }} /></div><small>{buildProgress}% complete</small></div> : previewComplete ? <div className="preview-ready"><CheckCircle2 size={30} /><strong>{state === "production" ? "Production release completed" : "Preview checks passed"}</strong><a href={window.location.href} target="_blank" rel="noreferrer">{window.location.host}{window.location.pathname} <ExternalLink size={13} /></a><div className="verification-result"><div><span>Build</span><strong className="success-text">PASS</strong></div><div><span>Routes</span><strong>21/21</strong></div><div><span>Smoke tests</span><strong>6/6</strong></div><div><span>Approval</span><strong>{state === "production" ? "Recorded" : "Pending"}</strong></div></div>{state === "ready" ? <Button onClick={promote}><UploadCloud size={16} /> Approve production</Button> : <Button variant="secondary" onClick={() => window.open(window.location.href, "_blank", "noopener,noreferrer")}><ExternalLink size={16} /> Open production</Button>}</div> : state === "configured" ? <div className="configured-state"><Settings size={27} /><strong>VITE_API_URL is configured for preview</strong><p>The value remains protected. Retry to build in the isolated runner.</p><Button onClick={retry}><Rocket size={16} /> Retry preview</Button></div> : <pre className="build-log"><span>12:42:08</span> Running vite build{"\n"}<span>12:42:11</span> Transforming 2191 modules{"\n"}<span className="log-error">12:42:13 ERROR VITE_API_URL is undefined</span>{"\n"}<span>12:42:13</span> Build exited with code 1</pre>}</section><section className="doctor panel"><header><span><Bot size={20} /></span><div><p className="eyebrow">Deployment Doctor</p><h2>{previewComplete ? "No active failures" : state === "configured" ? "Fix approved" : "Root cause verified"}</h2></div><button className="text-button doctor-ai" onClick={() => onAI("deployment")}><Sparkles size={14} /> Explain</button></header>{previewComplete ? <div className="doctor-clear"><ShieldCheck size={32} /><p>The preview passed configuration, build, route, and smoke checks.</p></div> : state === "configured" ? <div className="doctor-clear"><CheckCircle2 size={32} /><p>The missing variable name is now registered for preview. Its protected value is not displayed.</p><Button onClick={retry}><Rocket size={16} /> Run preview</Button></div> : <><div className="cause-box"><span>Primary cause</span><strong>VITE_API_URL is missing</strong><p>The app references this variable in <code>src/services/api.ts</code>, but it is unavailable to the preview build.</p></div><div className="doctor-evidence"><div><span>Affected</span><code>src/services/api.ts</code></div><div><span>Confidence</span><strong>99%</strong></div><div><span>Secret access</span><strong>None</strong></div></div><Button onClick={configure}><Settings size={16} /> Configure variable</Button></>}</section></div><section className="panel deployment-history"><div className="panel-header"><div><h2>Deployment history</h2><p>Recent preview and production activity.</p></div></div><DataTable nested headers={["Environment", "Commit", "Status"]} rows={[["Preview", "5da254b", <Badge key="preview-status" tone={previewComplete ? "green" : state === "building" || state === "configured" ? "violet" : "red"}>{statusLabel}</Badge>], ["Production", "5da254b", <Badge key="production-status" tone="green">{state === "production" ? "Just deployed" : "Ready"}</Badge>]]} /></section></div>;
}

// Shared by the Overview index and the Showcase gallery so both stay identical.
function ProjectCard({ item, active, onOpen }) {
  const score = item.readiness.score;
  const scoreTone = score >= 85 ? "score-good" : score >= 70 ? "score-mid" : "score-low";
  const stack = item.frameworks.slice(0, 3);
  const extra = item.frameworks.length - stack.length;

  return (
    <button
      type="button"
      className={active ? "repo-card is-active" : "repo-card"}
      aria-pressed={active}
      aria-label={`Open the ${item.project.name} Project Twin`}
      onClick={() => onOpen(item)}
    >
      <div className="repo-card-top">
        <span className="repo-mark" aria-hidden="true">{item.project.name.slice(0, 2).toUpperCase()}</span>
        <span className="repo-id">
          <strong>{item.project.name}</strong>
          <span>{item.project.fullName}</span>
        </span>
        <span className="repo-score">
          <strong className={scoreTone}>{score}</strong>
          <span>Ready</span>
        </span>
      </div>

      <p className="repo-desc">{item.project.description}</p>

      <div className="repo-stack">
        {stack.map((framework) => <Badge key={framework}>{framework}</Badge>)}
        {extra > 0 ? <span className="repo-more">+{extra}</span> : null}
      </div>

      <div className="repo-card-foot">
        <span className="repo-stats">
          <span><Star size={11} /> {formatCount(item.project.stars)}</span>
          <span><FileCode2 size={11} /> {formatCount(item.summary.files)}</span>
        </span>
        <span className="repo-cta">
          {active ? <><CheckCircle2 size={13} /> In workspace</> : <>Open twin <ArrowRight size={13} /></>}
        </span>
      </div>
    </button>
  );
}

function Showcase({ twin, requestConfirm, notify, onAsk }) {
  const [editing, setEditing] = useState(true);
  const [copy, setCopy] = useState(() => readShowcaseDrafts()[twin.id]?.copy || defaultShowcaseCopy(twin));
  const [included, setIncluded] = useState(() => readShowcaseDrafts()[twin.id]?.included || defaultSections());
  const [published, setPublished] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [narrativeVersion, setNarrativeVersion] = useState(0);

  // State is reset by remounting on twin.id (see the key where Showcase is
  // rendered) rather than by syncing inside an effect.
  useEffect(() => { writeShowcaseDraft(twin.id, { copy, included }); }, [twin.id, copy, included]);

  const toggleSection = (item) => setIncluded((current) => ({ ...current, [item]: !current[item] }));
  const sectionNames = Object.keys(included);
  const shownCount = sectionNames.filter((name) => included[name]).length;
  const allShown = shownCount === sectionNames.length;
  const setAllSections = (value) => setIncluded(Object.fromEntries(sectionNames.map((name) => [name, value])));
  const resetDraft = () => {
    setCopy(defaultShowcaseCopy(twin));
    setIncluded(defaultSections());
    setNarrativeVersion(0);
    notify("Case study reset to the generated version");
  };
  const refineWithAI = () => {
    const variants = [
      { tagline: `${twin.features.slice(0, 2).join(" and ") || twin.project.name}, engineered for confident delivery.`, description: `${twin.project.name} brings ${twin.features.slice(0, 3).join(", ").toLowerCase() || "its verified project capabilities"} into one product. Built with ${twin.frameworks.slice(0, 3).join(", ") || "the detected repository stack"}, its Project Twin verifies ${twin.summary.components} components and ${twin.summary.apiRoutes} API routes.` },
      { tagline: `A clearer way to experience ${twin.features[0]?.toLowerCase() || twin.project.name}.`, description: `${twin.project.name} is presented here through repository evidence, not marketing guesses. Its strongest technical signals are ${twin.frameworks.slice(0, 4).join(", ") || "captured in the indexed source"}, with a measured launch readiness of ${twin.readiness.score}/100.` },
    ];
    setGenerating(true);
    setTimeout(() => { const next = variants[narrativeVersion % variants.length]; setCopy(next); setNarrativeVersion((value) => value + 1); setGenerating(false); notify("AI showcase narrative refreshed from project evidence"); }, 850);
  };
  const publish = () => requestConfirm({ title: "Publish this showcase?", description: "The case study will become public. Private source and environment values stay excluded.", action: "Publish showcase" }, () => { setPublished(true); setEditing(false); notify("Showcase published"); });
  const copyLink = async () => {
    try { await navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}#showcase`); notify("Public showcase link copied"); }
    catch { notify("Showcase is published and ready to share"); }
  };
  return <div className="page-stack">
    <PageTitle
      eyebrow="Public case study"
      title={`Showcase ${twin.project.name}`}
      description="Written from the analysed repository. Nothing private is included."
      action={<div className="segmented"><button className={editing ? "active" : ""} onClick={() => setEditing(true)}>Edit</button><button className={!editing ? "active" : ""} onClick={() => setEditing(false)}>Preview</button></div>}
    />
    <div className="showcase-layout">
      <section className="panel showcase-editor">
        <div className="editor-intro">
          <p className="eyebrow">Case study editor</p>
          <p>Write the public summary for this project and choose which verified sections appear in the page on the right.</p>
        </div>

        <Button variant="secondary" onClick={refineWithAI} disabled={generating || !editing}>
          {generating ? <LoaderCircle className="spin" size={16} /> : <WandSparkles size={16} />}
          {generating ? "Writing from evidence" : "Refine narrative with AI"}
        </Button>

        <label>
          <span className="label-row">Tagline <small className={copy.tagline.length > TAGLINE_MAX ? "over" : ""}>{copy.tagline.length}/{TAGLINE_MAX}</small></span>
          <input
            value={copy.tagline}
            maxLength={TAGLINE_MAX}
            onChange={(event) => setCopy({ ...copy, tagline: event.target.value })}
            disabled={!editing}
          />
        </label>

        <label>
          <span className="label-row">Description <small className={copy.description.length > DESCRIPTION_MAX ? "over" : ""}>{copy.description.length}/{DESCRIPTION_MAX}</small></span>
          <textarea
            rows="5"
            value={copy.description}
            maxLength={DESCRIPTION_MAX}
            onChange={(event) => setCopy({ ...copy, description: event.target.value })}
            disabled={!editing}
          />
        </label>

        <div>
          <span className="label-row field-label">
            Included sections
            <button type="button" className="text-button" onClick={() => setAllSections(!allShown)} disabled={!editing}>
              {allShown ? "Clear all" : "Select all"}
            </button>
          </span>
          {sectionNames.map((item) => (
            <label className="check-row" key={item}>
              <input type="checkbox" checked={included[item]} onChange={() => toggleSection(item)} disabled={!editing} />
              <span><Check size={13} /></span>
              {item}
            </label>
          ))}
          <p className="editor-hint">{shownCount} of {sectionNames.length} sections shown</p>
        </div>

        <div className="editor-actions">
          {published
            ? <Button variant="secondary" onClick={copyLink}><Link size={16} /> Copy public link</Button>
            : <Button onClick={publish}><Globe2 size={16} /> Publish showcase</Button>}
          <Button variant="ghost" onClick={resetDraft} disabled={!editing}>Reset</Button>
        </div>
        <p className="editor-hint">Edits are saved on this device as you type.</p>
      </section>
      <section className="showcase-preview"><div className="showcase-browser"><div className="browser-bar"><span /><span /><span /><small>{published ? `${window.location.host}/showcase/${twin.project.name.toLowerCase()}` : `preview/${twin.project.name.toLowerCase()}`}</small></div><div className="case-study"><Badge tone="green">{published ? "Published" : "Live project"}</Badge><h2>{twin.project.name}</h2><h3>{copy.tagline}</h3><p>{copy.description}</p><div className="case-actions"><Button onClick={() => window.open(window.location.href, "_blank", "noopener,noreferrer")}>Open live app <ExternalLink size={15} /></Button><Button variant="ghost" onClick={() => window.open(twin.project.repositoryUrl, "_blank", "noopener,noreferrer")}><Github size={15} /> Repository</Button></div>{included.Technology ? <><div className="case-divider" /><p className="eyebrow">Built with</p><div className="stack-row">{twin.frameworks.map((item) => <Badge key={item}>{item}</Badge>)}</div></> : null}{included.Architecture ? <div className="case-architecture">{twin.architecture.nodes.map((node, index) => <span key={node.id}>{index > 0 ? <ArrowRight size={13} /> : null}<strong>{node.label}</strong></span>)}</div> : null}{included.Features ? <div className="case-features">{twin.features.slice(0, 3).map((item) => <div key={item}><CheckCircle2 size={16} /><span>{item}</span></div>)}</div> : null}{included["Technical highlights"] ? <div className="case-highlights"><div><strong>{twin.summary.components}</strong><span>Components</span></div><div><strong>{twin.summary.apiRoutes}</strong><span>API routes</span></div><div><strong>{twin.readiness.score}/100</strong><span>Readiness</span></div></div> : null}{included["Ask this project"] ? <button className="case-ask" onClick={onAsk}><Sparkles size={15} /> Ask this project <ArrowRight size={14} /></button> : null}</div></div></section>
    </div>
  </div>;
}

function AskTwin({ twin, open, setOpen }) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", text: `I’m grounded in ${twin.project.name}’s analyzed repository. Ask about architecture, authentication, routes, dependencies, readiness, or team progress.`, evidence: [] }
  ]);

  const answerQuestion = (value) => {
    const lower = value.toLowerCase();
    let response;
    if (lower.includes("auth") || lower.includes("login") || lower.includes("jwt") || lower.includes("session")) {
      const evidence = [...new Set([...twin.evidence, ...twin.apiRoutes.map((route) => route.file)])].filter((file) => /auth|user|session/i.test(file));
      response = evidence.length ? { text: `Authentication is implemented around ${evidence[0]}. I can verify the location, but not runtime identity-provider behavior from the indexed evidence alone.`, evidence: evidence.slice(0, 3) } : { text: "I could not verify where authentication is implemented from the indexed evidence.", evidence: [] };
    } else if (lower.includes("architect") || lower.includes("backend") || lower.includes("frontend") || lower.includes("structure")) {
      response = { text: `${twin.project.name} uses ${twin.frameworks.join(", ")}. The detected runtime path is ${twin.architecture.nodes.map((node) => node.label).join(" → ")}.`, evidence: twin.evidence.filter((file) => /package|config|route|schema/i.test(file)).slice(0, 3) };
    } else if (lower.includes("develop") || lower.includes("next level") || lower.includes("upgrade") || lower.includes("roadmap") || lower.includes("future") || lower.includes("scale") || lower.includes("recommend")) {
      const recs = twin.recommendations.map((r, i) => `${i + 1}. ${r.title} — ${r.recommended} (${r.benefit})`).join("\n");
      const recText = recs || "1. Increase automated integration test coverage.\n2. Configure explicit security headers.\n3. Migrate background jobs to a durable worker queue.";
      response = { text: `To develop ${twin.project.name} to the next level, focus on these verified recommendations:\n\n${recText}`, evidence: twin.recommendations.map((r) => r.evidence).filter(Boolean).slice(0, 3) };
    } else if (lower.includes("security") || lower.includes("protect") || lower.includes("secret") || lower.includes("vulnerab")) {
      const secFindings = twin.readiness.findings.filter((f) => f.area === "Security" || f.severity === "high" || f.severity === "critical");
      const text = secFindings.length ? `Security audit identified ${secFindings.length} issue(s). Highest priority: ${secFindings[0].problem}. Recommended fix: ${secFindings[0].solution}` : `All verified security checks passed for ${twin.project.name}. Protected environment variables: ${twin.environment.filter((e) => e.sensitive).map((e) => e.name).join(", ") || "None"}.`;
      response = { text, evidence: secFindings.map((f) => f.file).filter(Boolean).slice(0, 3) };
    } else if (lower.includes("improve") || lower.includes("deploy") || lower.includes("ready") || lower.includes("block")) {
      response = { text: `Launch readiness for ${twin.project.name} is ${twin.readiness.score}/100. Highest-priority focus: ${twin.readiness.findings[0]?.problem || "All launch checks pass."}. Solution: ${twin.readiness.findings[0]?.solution || "The repository is launch-ready."}`, evidence: twin.readiness.findings[0] ? [twin.readiness.findings[0].file] : [] };
    } else if (lower.includes("depend") || lower.includes("package") || lower.includes("lib")) {
      response = { text: `I verified ${twin.dependencies.length} dependencies in ${twin.project.name}. Primary framework signals are ${twin.frameworks.join(", ")}. Dependencies include: ${twin.dependencies.slice(0, 6).join(", ")}.`, evidence: twin.evidence.filter((file) => /package|requirements|pyproject/i.test(file)).slice(0, 3) };
    } else if (lower.includes("feature") || lower.includes("do") || lower.includes("can")) {
      response = { text: `${twin.project.name} includes ${twin.features.length} verified features: ${twin.features.join(", ")}.`, evidence: twin.evidence.slice(0, 3) };
    } else {
      const topRec = twin.recommendations[0]?.title ? ` Suggested upgrade: ${twin.recommendations[0].title}.` : "";
      response = { text: `${twin.project.name} has ${twin.summary.components} components, ${twin.summary.pages} pages, ${twin.summary.apiRoutes} API routes, and a launch readiness score of ${twin.readiness.score}/100.${topRec}`, evidence: twin.evidence.slice(0, 3) };
    }
    setMessages((current) => [...current, { role: "user", text: value }, { role: "assistant", ...response }]);
    setQuestion("");
  };

  const submit = (event) => { event.preventDefault(); if (question.trim()) answerQuestion(question.trim()); };

  return (
    <div style={{ position: "fixed", bottom: "16px", right: "16px", zIndex: 1100 }}>
      {/* Compact Floating Chatbot Panel */}
      {open && (
        <div style={{ position: "relative", bottom: "0", right: "0", width: "310px", maxHeight: "360px", boxShadow: "0 12px 30px rgba(0,0,0,0.5)", borderRadius: "10px", border: "1px solid #30363d", background: "#161b22", marginBottom: "10px", display: "flex", flexDirection: "column" }}>
          <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", borderBottom: "1px solid #30363d", background: "#0d1117" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Sparkles size={14} style={{ color: "#a855f7" }} />
              <strong style={{ fontSize: "0.8rem", color: "#f0f6fc" }}>Ask AI</strong>
            </div>
            <button aria-label="Close assistant" onClick={() => setOpen(false)} style={{ background: "transparent", border: "none", color: "#8b949e", cursor: "pointer", padding: "2px" }}>
              <X size={15} />
            </button>
          </header>

          <div style={{ padding: "8px", maxHeight: "220px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "6px" }}>
            {messages.map((message, index) => (
              <div key={index} style={{ background: message.role === "user" ? "#1f6feb22" : "#0d1117", border: `1px solid ${message.role === "user" ? "#1f6feb66" : "#21262d"}`, borderRadius: "6px", padding: "6px 8px", fontSize: "0.72rem", color: "#f0f6fc", lineHeight: "1.35" }}>
                <p style={{ margin: 0 }}>{message.text}</p>
                {message.evidence?.length > 0 && (
                  <div style={{ marginTop: "4px", fontSize: "0.65rem", color: "#8b949e" }}>
                    <span>Evidence: </span>
                    {message.evidence.map((item) => (
                      <code key={item} style={{ color: "#58a6ff" }}>{item} </code>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: "4px", padding: "4px 8px", overflowX: "auto" }}>
            {["Explain architecture", "Auth location"].map((item) => (
              <button key={item} onClick={() => answerQuestion(item)} style={{ background: "#0d1117", border: "1px solid #30363d", color: "#58a6ff", fontSize: '0.65rem', borderRadius: '10px', padding: '1px 6px', whiteSpace: 'nowrap', cursor: 'pointer' }}>
                {item}
              </button>
            ))}
          </div>

          <form onSubmit={submit} style={{ display: "flex", gap: "4px", padding: "8px", borderTop: "1px solid #21262d" }}>
            <input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask AI..." style={{ flex: 1, background: "#0d1117", border: "1px solid #30363d", color: "#f0f6fc", padding: "5px 8px", borderRadius: "4px", fontSize: "0.75rem", outline: "none" }} autoFocus />
            <button aria-label="Send" style={{ background: "#238636", border: "none", color: "#fff", padding: "5px 10px", borderRadius: "4px", cursor: "pointer", display: "grid", placeItems: "center" }}>
              <Send size={12} />
            </button>
          </form>
        </div>
      )}

      {/* Sleek Compact Launcher Pill Button */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Toggle AI Assistant Chatbot"
        style={{
          background: "#161b22",
          color: "#f0f6fc",
          border: "1px solid #30363d",
          borderRadius: "20px",
          padding: "6px 12px",
          fontWeight: "700",
          fontSize: "0.75rem",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          cursor: "pointer",
          boxShadow: "0 4px 14px rgba(0,0,0,0.4)"
        }}
      >
        <Sparkles size={13} style={{ color: "#a855f7" }} />
        <span>Ask AI</span>
      </button>
    </div>
  );
}

function Toast({ message }) { return message ? <div className="toast"><CheckCircle2 size={17} />{message}</div> : null; }

export default function App() {
  const [twin, setTwin] = useState(demoTwin);
  // false shows the project index on the Overview tab; true shows one project.
  const [overviewOpen, setOverviewOpen] = useState(false);
  const [projectView, setProjectView] = useState("Overview");
  const [active, setActive] = useState(() => {
    const requested = window.location.hash.slice(1).toLowerCase();
    return [...tabs, "Discover", "Activity"].find((item) => item.toLowerCase() === requested) || "Overview";
  });
  const [importOpen, setImportOpen] = useState(false);
  const [askOpen, setAskOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [aiInsight, setAIInsight] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const [toast, setToast] = useState("");
  const [unreadActivity, setUnreadActivity] = useState(3);
  const [theme, setTheme] = useState(() => localStorage.getItem("project-twin-theme") || "dark");
  const notify = (message) => { setToast(message); setTimeout(() => setToast(""), 2600); };
  // Navigating to Overview lands on the project index. openProject() sets
  // overviewOpen back to true after calling this, and React batches both
  // updates in the same handler, so an explicit open still wins.
  const changeView = (view) => { setActive(view); window.history.replaceState(null, "", `#${view.toLowerCase()}`); if (view === "Activity") setUnreadActivity(0); if (view === "Overview") setOverviewOpen(false); };
  const requestConfirm = (state, action) => setConfirm({ ...state, actionHandler: action });
  const openAI = (type) => setAIInsight(buildAIInsight(twin, type));
  const openProject = (nextTwin) => { setTwin(nextTwin); changeView("Overview"); setOverviewOpen(true); setProjectView("Overview"); };
  const completeImport = (nextTwin) => { setTwin(nextTwin); setImportOpen(false); changeView("Overview"); setOverviewOpen(true); setProjectView("Overview"); notify(`${nextTwin.project.name} Project Twin is ready`); };
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("project-twin-theme", theme);
  }, [theme]);
  useEffect(() => {
    const handleKeyboard = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") { event.preventDefault(); setSearchOpen(true); }
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") { event.preventDefault(); setAskOpen(true); }
      if (event.key === "Escape") { setSearchOpen(false); setSettingsOpen(false); setAskOpen(false); setAIInsight(null); }
    };
    window.addEventListener("keydown", handleKeyboard);
    return () => window.removeEventListener("keydown", handleKeyboard);
  }, []);
  const pages = { Overview: <Overview twin={twin} setActive={changeView} onAI={openAI} opened={overviewOpen} onOpen={openProject} onBack={() => setOverviewOpen(false)} view={projectView} setView={setProjectView} requestConfirm={requestConfirm} notify={notify} onAsk={() => setAskOpen(true)} />, Discover: <Discover twin={twin} setActive={changeView} />, Activity: <ActivityView twin={twin} setActive={changeView} notify={notify} />, Intelligence: <Intelligence twin={twin} onAI={openAI} />, Readiness: <Readiness twin={twin} onAI={openAI} />, Upgrades: <Upgrades twin={twin} notify={notify} requestConfirm={requestConfirm} />, Deploy: <Deploy twin={twin} requestConfirm={requestConfirm} notify={notify} onAI={openAI} />, Collaborate: <CollaborationWorkspace twin={twin} /> };
  return <div className="app-shell"><Sidebar active={active} onChange={changeView} onImport={() => setImportOpen(true)} onSettings={() => setSettingsOpen(true)} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} unreadActivity={unreadActivity} /><div className="workspace"><Topbar twin={twin} onSelectTwin={openProject} onImport={() => setImportOpen(true)} onMobileMenu={() => setMobileOpen(true)} onSearch={() => setSearchOpen(true)} theme={theme} onToggleTheme={() => setTheme((value) => value === "dark" ? "light" : "dark")} onChange={changeView} /><main className={`main-content ${active === "TwinSpace" ? "main-content-full" : ""}`}>{pages[active]}</main></div><AskTwin key={twin.id} twin={twin} open={askOpen} setOpen={setAskOpen} />{searchOpen ? <SearchDialog twin={twin} open onClose={() => setSearchOpen(false)} onSelect={changeView} /> : null}<AIInsightDialog insight={aiInsight} onClose={() => setAIInsight(null)} onNavigate={changeView} onAsk={() => setAskOpen(true)} /><SettingsDialog open={settingsOpen} onClose={() => setSettingsOpen(false)} theme={theme} onTheme={setTheme} notify={notify} /><ImportDialog open={importOpen} onClose={() => setImportOpen(false)} onComplete={completeImport} /><ConfirmDialog state={confirm} onClose={() => setConfirm(null)} onConfirm={() => { confirm.actionHandler(); setConfirm(null); }} /><Toast message={toast} />{mobileOpen && <div className="sidebar-scrim" onClick={() => setMobileOpen(false)} />}</div>;
}
