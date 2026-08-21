import { useCallback, useEffect, useState } from "react";
import {
    LogOut, Plus, Settings, Folder, Layout, Database,
    Search, Pencil, Trash2, Loader2, AlertCircle
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api, { errorMessage } from "../lib/api";
import { useAuth } from "../context/auth-context";
import ProjectForm from "../components/ProjectForm";

const NAV_ITEMS = [
    { id: "dashboard", label: "Dashboard", icon: Layout },
    { id: "projects", label: "Projects", icon: Folder },
    { id: "storage", label: "Storage", icon: Database },
    { id: "settings", label: "Settings", icon: Settings },
];

const Dashboard = () => {
    const [projects, setProjects] = useState([]);
    const [status, setStatus] = useState("loading"); // loading | ready | error
    const [error, setError] = useState("");
    const [formFor, setFormFor] = useState(null); // null | 'new' | project
    const [deletingId, setDeletingId] = useState(null);
    const [section, setSection] = useState("dashboard");

    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get("q") ?? "";

    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const fetchProjects = useCallback(async (q) => {
        setStatus("loading");
        setError("");
        try {
            const res = await api.get("/api/projects", { params: q ? { q } : {} });
            setProjects(res.data.projects ?? []);
            setStatus("ready");
        } catch (err) {
            // A 401 is handled by the interceptor and the auth guard; anything
            // else is a real failure the user needs to see.
            if (err.response?.status !== 401) {
                setError(errorMessage(err, "Could not load your projects."));
                setStatus("error");
            }
        }
    }, []);

    // Debounced so typing in the search box doesn't fire a request per keystroke.
    useEffect(() => {
        const id = setTimeout(() => fetchProjects(query), query ? 300 : 0);
        return () => clearTimeout(id);
    }, [query, fetchProjects]);

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };

    const handleSaved = (saved) => {
        setProjects((prev) => {
            const exists = prev.some((p) => p._id === saved._id);
            return exists
                ? prev.map((p) => (p._id === saved._id ? saved : p))
                : [saved, ...prev];
        });
        setFormFor(null);
    };

    const handleDelete = async (project) => {
        if (!window.confirm(`Delete "${project.title}"? This cannot be undone.`)) return;

        setDeletingId(project._id);
        try {
            await api.delete(`/api/projects/${project._id}`);
            setProjects((prev) => prev.filter((p) => p._id !== project._id));
        } catch (err) {
            setError(errorMessage(err, "Could not delete the project."));
        } finally {
            setDeletingId(null);
        }
    };

    const setQuery = (value) => {
        setSearchParams(value ? { q: value } : {}, { replace: true });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-100 flex flex-col p-6 fixed h-full">
                <div className="text-2xl font-bold mb-12">CodeNest<span className="text-gray-400">.</span></div>

                <nav className="flex-1 space-y-2">
                    {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setSection(id)}
                            aria-current={section === id ? "page" : undefined}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                                section === id
                                    ? "bg-black text-white"
                                    : "text-gray-500 hover:bg-gray-50"
                            }`}
                        >
                            <Icon size={20} /> {label}
                        </button>
                    ))}
                </nav>

                {user && (
                    <div className="mb-4 px-4 py-3 bg-gray-50 rounded-xl">
                        <p className="text-sm font-bold truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                )}

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl font-medium transition-colors"
                >
                    <LogOut size={20} /> Logout
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-12">
                {section === "dashboard" || section === "projects" ? (
                    <>
                        <header className="flex flex-wrap items-center justify-between gap-6 mb-10">
                            <div>
                                <h1 className="text-3xl font-bold">Your Projects</h1>
                                <p className="text-gray-500">Manage and monitor your engineering nest.</p>
                            </div>
                            <button
                                onClick={() => setFormFor("new")}
                                className="btn-primary flex items-center gap-2"
                            >
                                <Plus size={20} /> New Project
                            </button>
                        </header>

                        <div className="mb-10 max-w-md">
                            <label htmlFor="project-search" className="sr-only">Search your projects</label>
                            <div className="flex items-center bg-white rounded-xl px-4 py-2.5 border border-gray-200 focus-within:border-black/20 transition-colors">
                                <Search size={18} className="text-gray-400" />
                                <input
                                    id="project-search"
                                    type="search"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search by title, description or tech..."
                                    className="bg-transparent border-none outline-none text-sm ml-3 w-full"
                                />
                            </div>
                        </div>

                        {error && (
                            <div role="alert" className="flex items-center gap-3 bg-red-50 text-red-600 p-4 rounded-xl mb-8">
                                <AlertCircle size={20} className="shrink-0" />
                                <span className="text-sm">{error}</span>
                            </div>
                        )}

                        {status === "loading" && (
                            <div className="grid md:grid-cols-3 gap-8">
                                {[0, 1, 2].map((i) => (
                                    <div key={i} className="anti-gravity-card p-6 bg-white animate-pulse">
                                        <div className="h-5 bg-gray-100 rounded w-2/3 mb-4" />
                                        <div className="h-3 bg-gray-100 rounded w-full mb-2" />
                                        <div className="h-3 bg-gray-100 rounded w-4/5 mb-6" />
                                        <div className="flex gap-2">
                                            <div className="h-6 w-16 bg-gray-100 rounded-full" />
                                            <div className="h-6 w-16 bg-gray-100 rounded-full" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {status === "error" && (
                            <div className="py-20 text-center glass-card border-dashed">
                                <p className="text-gray-500 mb-6">We couldn&apos;t load your projects.</p>
                                <button onClick={() => fetchProjects(query)} className="btn-secondary">
                                    Try again
                                </button>
                            </div>
                        )}

                        {status === "ready" && projects.length === 0 && (
                            <div className="py-20 text-center glass-card border-dashed">
                                {query ? (
                                    <>
                                        <p className="text-gray-500 mb-6">
                                            No projects match &ldquo;{query}&rdquo;.
                                        </p>
                                        <button onClick={() => setQuery("")} className="btn-secondary">
                                            Clear search
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-gray-500 mb-6">
                                            No projects yet. Create your first one to get started.
                                        </p>
                                        <button
                                            onClick={() => setFormFor("new")}
                                            className="btn-primary inline-flex items-center gap-2"
                                        >
                                            <Plus size={20} /> New Project
                                        </button>
                                    </>
                                )}
                            </div>
                        )}

                        {status === "ready" && projects.length > 0 && (
                            <div className="grid md:grid-cols-3 gap-8">
                                {projects.map((project) => (
                                    <div key={project._id} className="anti-gravity-card p-6 bg-white flex flex-col">
                                        <div className="flex items-start justify-between gap-3 mb-2">
                                            <h3 className="text-xl font-bold">{project.title}</h3>
                                            <div className="flex items-center gap-1 shrink-0">
                                                <button
                                                    onClick={() => setFormFor(project)}
                                                    aria-label={`Edit ${project.title}`}
                                                    className="p-2 text-gray-400 hover:text-black hover:bg-gray-50 rounded-lg transition-colors"
                                                >
                                                    <Pencil size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(project)}
                                                    disabled={deletingId === project._id}
                                                    aria-label={`Delete ${project.title}`}
                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                                >
                                                    {deletingId === project._id
                                                        ? <Loader2 size={16} className="animate-spin" />
                                                        : <Trash2 size={16} />}
                                                </button>
                                            </div>
                                        </div>

                                        <p className="text-gray-500 text-sm mb-6 flex-1">{project.description}</p>

                                        <div className="flex flex-wrap gap-2">
                                            {(project.techStack ?? []).map((tech, i) => (
                                                <span
                                                    key={`${tech}-${i}`}
                                                    className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold uppercase"
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="py-32 text-center glass-card border-dashed">
                        <h1 className="text-2xl font-bold mb-3">
                            {NAV_ITEMS.find((n) => n.id === section)?.label}
                        </h1>
                        <p className="text-gray-500 mb-8">This section isn&apos;t built yet.</p>
                        <button onClick={() => setSection("dashboard")} className="btn-secondary">
                            Back to projects
                        </button>
                    </div>
                )}
            </main>

            {formFor && (
                <ProjectForm
                    project={formFor === "new" ? null : formFor}
                    onClose={() => setFormFor(null)}
                    onSaved={handleSaved}
                />
            )}
        </div>
    );
};

export default Dashboard;
