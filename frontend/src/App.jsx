import { useEffect, useState } from "react";
import {
  Activity, AlertTriangle, ArrowRight, Bot, Box, Braces, Check, CheckCircle2,
  ChevronDown, CircleDot, Code2, Database, ExternalLink, FileCode2, Github,
  Globe2, Home, Layers3, LoaderCircle, LockKeyhole, Menu, Moon, PackageCheck,
  Plus, Rocket, Search, Send, Server, Settings, ShieldCheck, Sparkles,
  TestTube2, UploadCloud, WandSparkles, X, Zap,
} from "lucide-react";
import { demoTwin } from "./data/demoTwin";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const tabs = ["Overview", "Intelligence", "Readiness", "Upgrades", "Deploy", "Showcase"];
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
          setTimeout(() => onComplete(next.twin), 500);
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

  const startAnalysis = async (event) => {
    event.preventDefault();
    setError("");
    setJob({ status: "queued", progress: 4, stage: "Connecting to GitHub" });
    try {
      const response = await fetch(`${API_URL}/api/analysis`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ repository }),
      });
      const next = await response.json();
      if (!response.ok) throw new Error(next.message);
      setJob(next);
    } catch (requestError) {
      setJob(null);
      setError(requestError.message === "Failed to fetch" ? "The analysis service is offline. Start the backend, then try again." : requestError.message);
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
          <form onSubmit={startAnalysis}>
            <label className="field-label" htmlFor="repository">Repository</label>
            <div className="input-shell"><Github size={18} /><input id="repository" value={repository} onChange={(event) => setRepository(event.target.value)} placeholder="owner/repository" autoFocus /></div>
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

function Sidebar({ active, onChange, onImport, mobileOpen, setMobileOpen, unreadActivity }) {
  const selectWorkspace = (label) => {
    onChange(label === "Projects" ? "Overview" : label);
    setMobileOpen(false);
  };
  return <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
    <div className="brand"><BrandMark /><span>Project Twin</span><button className="sidebar-close" aria-label="Close navigation" onClick={() => setMobileOpen(false)}><X size={18} /></button></div>
    <Button variant="secondary" className="new-project" onClick={onImport}><Plus size={16} /> New project</Button>
    <nav aria-label="Main navigation">
      <p className="nav-label">Workspace</p>
      {[["Projects", Home], ["Discover", Globe2], ["Activity", Activity]].map(([label, Icon]) => <button key={label} className={(label === "Projects" ? tabs.includes(active) : active === label) ? "nav-item active" : "nav-item"} onClick={() => selectWorkspace(label)}><Icon size={17} />{label}{label === "Activity" && unreadActivity > 0 ? <span className="nav-count">{unreadActivity}</span> : null}</button>)}
      <p className="nav-label nav-label-spaced">Project</p>
      {tabs.map((tab) => <button key={tab} className={active === tab ? "nav-item active" : "nav-item"} onClick={() => { onChange(tab); setMobileOpen(false); }}><CircleDot size={15} />{tab}</button>)}
    </nav>
    <div className="sidebar-footer"><div className="avatar">SK</div><div><strong>Sanjay Kumar</strong><span>Developer workspace</span></div><ChevronDown size={15} /></div>
  </aside>;
}

function Topbar({ twin, onImport, onMobileMenu }) {
  return <header className="topbar">
    <button className="mobile-menu" onClick={onMobileMenu} aria-label="Open navigation"><Menu size={19} /></button>
    <div className="project-switcher"><span className="project-avatar">{twin.project.name.slice(0, 2).toUpperCase()}</span><div><strong>{twin.project.name}</strong><span>{twin.project.fullName}</span></div><ChevronDown size={15} /></div>
    <div className="topbar-actions"><button className="command-search"><Search size={16} /><span>Search project</span><kbd>Ctrl K</kbd></button><button className="icon-button" aria-label="Toggle color theme"><Moon size={17} /></button><Button variant="secondary" onClick={onImport}><Github size={16} /> Import repository</Button></div>
  </header>;
}

function ScoreRing({ score, small = false }) {
  return <div className={`score-ring ${small ? "score-ring-small" : ""}`} style={{ "--score": `${Math.round(score * 3.6)}deg` }}><div><strong>{score}</strong><span>/100</span></div></div>;
}

function PageTitle({ eyebrow, title, description, action }) {
  return <section className="page-title"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{description}</p></div>{action}</section>;
}

function Architecture({ twin, detailed = false }) {
  const nodes = twin.architecture.nodes.length ? twin.architecture.nodes : [{ id: "repo", label: "Application", type: "interface" }];
  return <div className={`architecture ${detailed ? "architecture-detailed" : ""}`}>{nodes.map((node, index) => <div className="architecture-step" key={node.id}><div className={`architecture-node node-${node.type}`}><span>{node.type === "data" ? <Database size={20} /> : node.type === "service" ? <Server size={20} /> : <Code2 size={20} />}</span><div><small>{node.type}</small><strong>{node.label}</strong></div></div>{index < nodes.length - 1 && <div className="architecture-link"><span>{twin.architecture.edges[index]?.label || "connects"}</span><ArrowRight size={17} /></div>}</div>)}</div>;
}

function Overview({ twin, setActive }) {
  const majorFinding = twin.readiness.findings[0];
  return <div className="page-stack">
    <section className="project-heading"><div><div className="heading-meta"><Badge tone="green"><CheckCircle2 size={13} /> Analysis complete</Badge><span>Updated {new Date(twin.generatedAt).toLocaleDateString()}</span></div><h1>Project Twin <span>— {twin.project.name}</span></h1><p>{twin.project.description}</p><div className="stack-row">{twin.frameworks.slice(0, 5).map((item) => <Badge key={item}>{item}</Badge>)}</div></div><div className="heading-actions"><Button variant="ghost" onClick={() => window.open(twin.project.repositoryUrl, "_blank", "noopener,noreferrer")}><ExternalLink size={16} /> Repository</Button><Button onClick={() => setActive("Deploy")}><Rocket size={16} /> Create preview</Button></div></section>
    <section className="readiness-banner"><ScoreRing score={twin.readiness.score} /><div className="readiness-copy"><p className="eyebrow">Launch readiness</p><h2>{twin.readiness.score >= 80 ? "Nearly ready to ship" : "A few issues need attention"}</h2><p>{twin.readiness.findings.length} evidence-backed findings across configuration, quality, security, and deployment.</p></div><div className="readiness-priority"><span>Highest priority</span><strong>{majorFinding?.problem || "No blocking issues detected"}</strong><button onClick={() => setActive("Readiness")}>Review findings <ArrowRight size={14} /></button></div></section>
    <div className="metric-strip">{[["Components", twin.summary.components, Box], ["Pages", twin.summary.pages, FileCode2], ["API routes", twin.summary.apiRoutes, Braces], ["Data models", twin.summary.models, Database], ["Dependencies", twin.summary.dependencies, PackageCheck]].map(([label, value, Icon]) => <div key={label}><Icon size={18} /><span>{label}</span><strong>{value}</strong></div>)}</div>
    <div className="content-grid"><section className="panel architecture-panel"><div className="panel-header"><div><p className="eyebrow">System map</p><h2>Architecture</h2></div><button className="text-button" onClick={() => setActive("Intelligence")}>Explore map <ArrowRight size={14} /></button></div><Architecture twin={twin} /><p className="architecture-summary">The interface communicates with the application service over defined boundaries, which owns persistence and external integrations.</p></section><section className="panel"><div className="panel-header"><div><p className="eyebrow">What it does</p><h2>Detected features</h2></div><Badge>{twin.features.length} verified</Badge></div><div className="feature-list">{twin.features.slice(0, 5).map((feature, index) => <div key={feature}><span>{String(index + 1).padStart(2, "0")}</span><strong>{feature}</strong><Check size={15} /></div>)}</div></section></div>
    <div className="content-grid lower-grid"><section className="panel"><div className="panel-header"><div><p className="eyebrow">Recent signal</p><h2>Recommendations</h2></div><button className="text-button" onClick={() => setActive("Upgrades")}>View all <ArrowRight size={14} /></button></div>{twin.recommendations.slice(0, 2).map((item) => <div className="recommendation-row" key={item.title}><span className="recommendation-icon"><Zap size={16} /></span><div><strong>{item.title}</strong><p>{item.benefit} · {item.migrationRisk} migration risk</p></div><ArrowRight size={15} /></div>)}</section><section className="panel"><div className="panel-header"><div><p className="eyebrow">Latest deployment</p><h2>Preview environment</h2></div><Badge tone="red">Failed</Badge></div><div className="deployment-brief"><div><AlertTriangle size={20} /><span><strong>Build stopped</strong><small>Missing VITE_API_URL</small></span></div><button className="text-button" onClick={() => setActive("Deploy")}>Open Deployment Doctor <ArrowRight size={14} /></button></div></section></div>
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

function Intelligence({ twin }) {
  const [selected, setSelected] = useState("Architecture");
  const groups = ["Architecture", "Routes & APIs", "Components", "Configuration", "Evidence"];
  return <div className="page-stack"><PageTitle eyebrow="Repository intelligence" title="A working map of the project" description={`Grounded in ${twin.evidence.length} high-signal files and ${twin.summary.files} repository entries.`} /><div className="subnav">{groups.map((item) => <button key={item} className={selected === item ? "active" : ""} onClick={() => setSelected(item)}>{item}</button>)}</div>
    {selected === "Architecture" && <section className="panel intelligence-map"><div className="panel-header"><div><h2>Architecture graph</h2><p>Important runtime layers and verified relationships.</p></div><Badge tone="green"><CircleDot size={12} /> Live context</Badge></div><Architecture twin={twin} detailed /><div className="insight-callout"><Sparkles size={18} /><div><strong>Architecture summary</strong><p>{twin.frameworks.join(" and ")} form the primary application path. Modules are linked from repository paths and dependency manifests.</p></div></div></section>}
    {selected === "Routes & APIs" && <DataTable headers={["Method", "Route", "Evidence"]} rows={twin.apiRoutes.map((route) => [<Badge tone={route.method === "GET" ? "green" : "violet"}>{route.method}</Badge>, route.path, route.file])} empty="No explicit API route declarations were verified." />}
    {selected === "Components" && <DataTable headers={["Component", "Type", "Evidence"]} rows={twin.components.map((file) => [file.split(/[\\/]/).pop(), "Interface component", file])} empty="No standalone interface components were verified." />}
    {selected === "Configuration" && <DataTable headers={["Variable", "Sensitivity", "Referenced in"]} rows={twin.environment.map((item) => [item.name, item.sensitive ? <Badge tone="amber">Protected</Badge> : <Badge>Public config</Badge>, item.file])} empty="No environment variable references were found in the selected evidence files." />}
    {selected === "Evidence" && <section className="panel evidence-list">{twin.evidence.map((file) => <div key={file}><FileCode2 size={16} /><code>{file}</code><Badge tone="green">Indexed</Badge></div>)}</section>}
  </div>;
}

function Finding({ finding }) {
  const [expanded, setExpanded] = useState(false);
  return <article className="finding panel"><button className="finding-main" onClick={() => setExpanded(!expanded)}><span className={`severity-dot severity-${finding.severity}`} /><div><div className="finding-meta"><Badge tone={finding.severity === "high" || finding.severity === "critical" ? "red" : finding.severity === "medium" ? "amber" : "neutral"}>{finding.severity}</Badge><span>{finding.area}</span><span>{finding.confidence}% confidence</span></div><h3>{finding.problem}</h3><code>{finding.file}</code></div><ChevronDown size={18} className={expanded ? "rotate" : ""} /></button>{expanded && <div className="finding-details"><div><span>Why it matters</span><p>{finding.why}</p></div><div><span>Recommended solution</span><p>{finding.solution}</p></div><div><span>Risk</span><p>{finding.risk}</p></div></div>}</article>;
}

function Readiness({ twin }) {
  const [filter, setFilter] = useState("All");
  const findings = twin.readiness.findings.filter((item) => filter === "All" || item.severity === filter);
  return <div className="page-stack"><PageTitle eyebrow="Production analysis" title="Launch Readiness" description="A weighted score derived from repository checks, not an AI estimate." action={<ScoreRing score={twin.readiness.score} small />} /><div className="readiness-layout"><aside className="score-breakdown panel"><h3>Quality gates</h3>{[["Build & config", 82], ["Security", 74], ["Code quality", 81], ["Documentation", 68], ["Deployment", 76]].map(([label, value]) => <div className="quality-row" key={label}><div><span>{label}</span><strong>{value}</strong></div><div><span style={{ width: `${value}%` }} /></div></div>)}<div className="score-note"><ShieldCheck size={17} /><p>Every finding includes its evidence location and confidence.</p></div></aside><section className="findings-section"><div className="filter-row">{["All", "critical", "high", "medium", "low"].map((item) => <button key={item} className={filter === item ? "active" : ""} onClick={() => setFilter(item)}>{item === "All" ? `All (${twin.readiness.findings.length})` : item}</button>)}</div>{findings.map((finding) => <Finding key={finding.id} finding={finding} />)}{!findings.length && <div className="panel empty-state"><CheckCircle2 size={24} /><strong>No findings at this severity</strong><p>The verified checks in this category passed.</p></div>}</section></div></div>;
}

function Upgrades({ twin, notify }) {
  const [sandbox, setSandbox] = useState(null);
  const runSandbox = (item) => { setSandbox({ item, status: "running" }); setTimeout(() => setSandbox({ item, status: "complete" }), 1800); };
  return <div className="page-stack"><PageTitle eyebrow="Contextual improvements" title="Upgrade Advisor" description="Recommendations ranked by project benefit, compatibility, and migration risk." /><div className="advisor-summary"><WandSparkles size={20} /><div><strong>{twin.recommendations.length} relevant upgrades found</strong><p>Nothing is applied until you review the isolated verification report.</p></div></div><div className="upgrade-list">{twin.recommendations.map((item, index) => <article className="upgrade-card panel" key={item.title}><header><span className="upgrade-number">0{index + 1}</span><div><Badge tone={index === 0 ? "violet" : "neutral"}>{item.category}</Badge><h2>{item.title}</h2><p>{item.why}</p></div><Badge tone="green">{item.migrationRisk} risk</Badge></header><div className="change-compare"><div><span>Current</span><p>{item.current}</p></div><ArrowRight size={18} /><div><span>Recommended</span><p>{item.recommended}</p></div></div><footer><div><strong>{item.benefit}</strong><span>{item.compatibility}</span></div><Button variant="secondary" onClick={() => runSandbox(item)}><TestTube2 size={16} /> Test safely</Button></footer></article>)}</div>
    {sandbox && <div className="modal-backdrop"><section className="modal sandbox-modal"><header className="modal-header"><div><p className="eyebrow">Isolated upgrade branch</p><h2>{sandbox.item.title}</h2></div>{sandbox.status === "complete" && <button className="icon-button" aria-label="Close upgrade report" onClick={() => setSandbox(null)}><X size={18} /></button>}</header>{sandbox.status === "running" ? <div className="sandbox-running"><LoaderCircle className="spin" size={28} /><h3>Verifying compatibility</h3><div className="sandbox-steps"><span className="done"><Check size={14} /> Branch created</span><span className="done"><Check size={14} /> Changes applied</span><span className="active"><LoaderCircle className="spin" size={14} /> Running build and tests</span></div></div> : <div><div className="verification-result"><div><span>Build</span><strong className="success-text">PASS</strong></div><div><span>Tests</span><strong>43/43</strong></div><div><span>Breaking changes</span><strong>0</strong></div><div><span>Confidence</span><strong>94%</strong></div></div><div className="inline-alert inline-success"><CheckCircle2 size={17} /><span>Compatible in the isolated environment. No repository changes were published.</span></div><div className="modal-actions"><Button variant="ghost" onClick={() => setSandbox(null)}>Discard</Button><Button variant="secondary" onClick={() => notify("Diff report opened")}>View diff</Button><Button onClick={() => notify("PR creation requires GitHub approval")}>Create PR</Button></div></div>}</section></div>}
  </div>;
}

function Deploy({ requestConfirm, notify }) {
  const [state, setState] = useState("failed");
  const configure = () => requestConfirm({ title: "Add VITE_API_URL?", description: "This records the variable name for preview. Project Twin never reads or displays its value.", action: "Approve configuration" }, () => { setState("configured"); notify("Environment configuration approved"); });
  const retry = () => { setState("building"); setTimeout(() => { setState("ready"); notify("Preview deployment is ready"); }, 1900); };
  return <div className="page-stack"><PageTitle eyebrow="Release workflow" title="Deploy with confidence" description="Readiness, preview build, verification, approval, then production." action={<Button onClick={state === "configured" ? retry : () => notify("Resolve the verified configuration issue first")}><Rocket size={16} /> {state === "configured" ? "Retry preview" : "New preview"}</Button>} /><div className="deploy-pipeline">{[["Repository", true], ["Readiness", true], ["Preview", state === "ready"], ["Verification", state === "ready"], ["Production", false]].map(([label, complete], index) => <div className={complete ? "complete" : state === "building" && index === 2 ? "active" : ""} key={label}><span>{complete ? <Check size={14} /> : index + 1}</span><strong>{label}</strong></div>)}</div><div className="deploy-grid"><section className="panel deployment-card"><div className="panel-header"><div><p className="eyebrow">Preview deployment</p><h2>{state === "ready" ? "Ready to review" : state === "building" ? "Building preview" : "Deployment failed"}</h2></div><Badge tone={state === "ready" ? "green" : state === "building" ? "violet" : "red"}>{state === "ready" ? "Ready" : state === "building" ? "Building" : "Failed"}</Badge></div>{state === "building" ? <div className="build-progress"><LoaderCircle className="spin" size={24} /><strong>Installing and building in an isolated runner</strong><div className="progress-track"><span style={{ width: "68%" }} /></div></div> : state === "ready" ? <div className="preview-ready"><CheckCircle2 size={30} /><strong>Preview checks passed</strong><a href="#preview" onClick={(event) => event.preventDefault()}>campus-care-git-preview.vercel.app <ExternalLink size={13} /></a><div className="verification-result"><div><span>Build</span><strong className="success-text">PASS</strong></div><div><span>Routes</span><strong>21/21</strong></div><div><span>Smoke tests</span><strong>6/6</strong></div></div><Button onClick={() => requestConfirm({ title: "Deploy to production?", description: "This promotes the verified preview and records your approval in the audit trail.", action: "Deploy production" }, () => notify("Production deployment approved"))}><UploadCloud size={16} /> Approve production</Button></div> : <pre className="build-log"><span>12:42:08</span> Running vite build{"\n"}<span>12:42:11</span> Transforming 2191 modules{"\n"}<span className="log-error">12:42:13 ERROR VITE_API_URL is undefined</span>{"\n"}<span>12:42:13</span> Build exited with code 1</pre>}</section><section className="doctor panel"><header><span><Bot size={20} /></span><div><p className="eyebrow">Deployment Doctor</p><h2>{state === "ready" ? "No active failures" : "Root cause verified"}</h2></div></header>{state === "ready" ? <div className="doctor-clear"><ShieldCheck size={32} /><p>The preview passed configuration, build, route, and smoke checks.</p></div> : <><div className="cause-box"><span>Primary cause</span><strong>VITE_API_URL is missing</strong><p>The app references this variable in <code>src/services/api.ts</code>, but it is unavailable to the preview build.</p></div><div className="doctor-evidence"><div><span>Affected</span><code>src/services/api.ts</code></div><div><span>Confidence</span><strong>99%</strong></div><div><span>Secret access</span><strong>None</strong></div></div><Button onClick={configure}><Settings size={16} /> Configure variable</Button></>}</section></div><section className="panel deployment-history"><div className="panel-header"><div><h2>Deployment history</h2><p>Recent preview and production activity.</p></div></div><DataTable nested headers={["Environment", "Commit", "Status"]} rows={[["Preview", "4c19a2f", <Badge tone={state === "ready" ? "green" : "red"}>{state === "ready" ? "Ready" : "Failed"}</Badge>], ["Production", "a832d10", <Badge tone="green">Ready</Badge>]]} /></section></div>;
}

function Showcase({ twin, requestConfirm, notify }) {
  const [editing, setEditing] = useState(true);
  const [copy, setCopy] = useState({ tagline: "Campus services, connected and accountable.", description: twin.project.description });
  return <div className="page-stack"><PageTitle eyebrow="AI-generated case study" title="Project Showcase" description="Built from verified context, with every word editable before publishing." action={<div className="segmented"><button className={editing ? "active" : ""} onClick={() => setEditing(true)}>Edit</button><button className={!editing ? "active" : ""} onClick={() => setEditing(false)}>Preview</button></div>} /><div className="showcase-layout"><section className="panel showcase-editor"><label>Tagline<input value={copy.tagline} onChange={(event) => setCopy({ ...copy, tagline: event.target.value })} disabled={!editing} /></label><label>Description<textarea rows="5" value={copy.description} onChange={(event) => setCopy({ ...copy, description: event.target.value })} disabled={!editing} /></label><div><span className="field-label">Included sections</span>{["Features", "Technology", "Architecture", "Technical highlights", "Ask this project"].map((item) => <label className="check-row" key={item}><input type="checkbox" defaultChecked /><span><Check size={13} /></span>{item}</label>)}</div><Button onClick={() => requestConfirm({ title: "Publish this showcase?", description: "The case study will become public. Private source and environment values stay excluded.", action: "Publish showcase" }, () => notify("Showcase published"))}><Globe2 size={16} /> Publish showcase</Button></section><section className="showcase-preview"><div className="showcase-browser"><div className="browser-bar"><span /><span /><span /><small>projecttwin.dev/{twin.project.name.toLowerCase()}</small></div><div className="case-study"><Badge tone="green">Live project</Badge><h2>{twin.project.name}</h2><h3>{copy.tagline}</h3><p>{copy.description}</p><div className="case-actions"><Button>Open live app <ExternalLink size={15} /></Button><Button variant="ghost"><Github size={15} /> Repository</Button></div><div className="case-divider" /><p className="eyebrow">Built with</p><div className="stack-row">{twin.frameworks.map((item) => <Badge key={item}>{item}</Badge>)}</div><div className="case-features">{twin.features.slice(0, 3).map((item) => <div key={item}><CheckCircle2 size={16} /><span>{item}</span></div>)}</div></div></div></section></div></div>;
}

function AskTwin({ twin, open, setOpen }) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([{ role: "assistant", text: `I’m grounded in ${twin.project.name}’s analyzed repository. Ask about architecture, authentication, routes, dependencies, or readiness.`, evidence: [] }]);
  const answerQuestion = (value) => {
    const lower = value.toLowerCase();
    let response;
    if (lower.includes("auth")) {
      const evidence = [...twin.evidence, ...twin.apiRoutes.map((route) => route.file)].filter((file) => /auth|user|session/i.test(file));
      response = evidence.length ? { text: `Authentication is implemented around ${evidence[0]}. I can verify the location, but not runtime identity-provider behavior from the indexed evidence alone.`, evidence: evidence.slice(0, 2) } : { text: "I could not verify where authentication is implemented from the indexed evidence.", evidence: [] };
    } else if (lower.includes("architect") || lower.includes("backend")) response = { text: `${twin.project.name} uses ${twin.frameworks.join(", ")}. The detected runtime path is ${twin.architecture.nodes.map((node) => node.label).join(" → ")}.`, evidence: twin.evidence.filter((file) => /package|config|route|schema/i.test(file)).slice(0, 3) };
    else if (lower.includes("improve") || lower.includes("deploy") || lower.includes("ready")) response = { text: `Launch readiness is ${twin.readiness.score}/100. The highest-priority issue is: ${twin.readiness.findings[0]?.problem || "none"}. ${twin.readiness.findings[0]?.solution || "All checks pass."}`, evidence: twin.readiness.findings[0] ? [twin.readiness.findings[0].file] : [] };
    else if (lower.includes("depend")) response = { text: `I verified ${twin.dependencies.length} dependencies. Primary framework signals are ${twin.frameworks.join(", ")}. Package age and advisories require a live registry audit and are not inferred.`, evidence: twin.evidence.filter((file) => /package|requirements|pyproject/i.test(file)).slice(0, 3) };
    else response = { text: `I can verify ${twin.summary.components} components, ${twin.summary.pages} pages, ${twin.summary.apiRoutes} API routes, and ${twin.features.length} detected features. I could not verify the specific detail in your question.`, evidence: twin.evidence.slice(0, 2) };
    setMessages((current) => [...current, { role: "user", text: value }, { role: "assistant", ...response }]); setQuestion("");
  };
  const submit = (event) => { event.preventDefault(); if (question.trim()) answerQuestion(question.trim()); };
  return <><button className="ask-bar" onClick={() => setOpen(true)}><span><Sparkles size={17} /> Ask Project Twin...</span><kbd>Ctrl Enter</kbd></button>{open && <div className="ask-panel"><header><div><span className="assistant-mark"><Sparkles size={17} /></span><div><strong>Ask Project Twin</strong><small>Grounded in repository evidence</small></div></div><button className="icon-button" aria-label="Close Project Twin assistant" onClick={() => setOpen(false)}><X size={17} /></button></header><div className="chat-messages">{messages.map((message, index) => <div key={index} className={`message message-${message.role}`}><p>{message.text}</p>{message.evidence?.length > 0 && <div className="message-evidence"><span>Evidence</span>{message.evidence.map((item) => <code key={item}>{item}</code>)}</div>}</div>)}</div><div className="prompt-suggestions">{["Explain the architecture", "Where is authentication handled?", "What blocks deployment?"].map((item) => <button key={item} onClick={() => answerQuestion(item)}>{item}</button>)}</div><form onSubmit={submit} className="chat-input"><input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask about this project..." autoFocus /><button aria-label="Send question"><Send size={16} /></button></form></div>}</>;
}

function Toast({ message }) { return message ? <div className="toast"><CheckCircle2 size={17} />{message}</div> : null; }

export default function App() {
  const [twin, setTwin] = useState(demoTwin);
  const [active, setActive] = useState("Overview");
  const [importOpen, setImportOpen] = useState(false);
  const [askOpen, setAskOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const [toast, setToast] = useState("");
  const [unreadActivity, setUnreadActivity] = useState(3);
  const notify = (message) => { setToast(message); setTimeout(() => setToast(""), 2600); };
  const changeView = (view) => { setActive(view); if (view === "Activity") setUnreadActivity(0); };
  const requestConfirm = (state, action) => setConfirm({ ...state, actionHandler: action });
  const completeImport = (nextTwin) => { setTwin(nextTwin); setImportOpen(false); setActive("Overview"); notify(`${nextTwin.project.name} Project Twin is ready`); };
  const pages = { Overview: <Overview twin={twin} setActive={changeView} />, Discover: <Discover twin={twin} setActive={changeView} />, Activity: <ActivityView twin={twin} setActive={changeView} notify={notify} />, Intelligence: <Intelligence twin={twin} />, Readiness: <Readiness twin={twin} />, Upgrades: <Upgrades twin={twin} notify={notify} />, Deploy: <Deploy requestConfirm={requestConfirm} notify={notify} />, Showcase: <Showcase twin={twin} requestConfirm={requestConfirm} notify={notify} /> };
  return <div className="app-shell"><Sidebar active={active} onChange={changeView} onImport={() => setImportOpen(true)} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} unreadActivity={unreadActivity} /><div className="workspace"><Topbar twin={twin} onImport={() => setImportOpen(true)} onMobileMenu={() => setMobileOpen(true)} /><main className="main-content">{pages[active]}</main></div><AskTwin twin={twin} open={askOpen} setOpen={setAskOpen} /><ImportDialog open={importOpen} onClose={() => setImportOpen(false)} onComplete={completeImport} /><ConfirmDialog state={confirm} onClose={() => setConfirm(null)} onConfirm={() => { confirm.actionHandler(); setConfirm(null); }} /><Toast message={toast} />{mobileOpen && <div className="sidebar-scrim" onClick={() => setMobileOpen(false)} />}</div>;
}
