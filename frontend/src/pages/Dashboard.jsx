import { useCallback, useEffect, useState } from "react";
import {
    LogOut, Plus, Settings, Folder, Layout, Database,
    Search, Pencil, Trash2, Loader2, AlertCircle
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api, { errorMessage } from "../lib/api";
import { useAuth } from "../context/auth-context";
import ProjectForm from "../components/ProjectForm";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import {
    AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader,
    AlertDialogFooter, AlertDialogTitle, AlertDialogDescription,
    AlertDialogAction, AlertDialogCancel,
} from "@/components/ui/alert-dialog";

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
    const { logout } = useAuth();

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
                        <Button
                            key={id}
                            variant="ghost"
                            size="none"
                            onClick={() => setSection(id)}
                            aria-current={section === id ? "page" : undefined}
                            className={cn(
                                "w-full justify-start gap-3 px-4 py-3 font-medium",
                                section === id && "bg-black text-white hover:bg-black hover:text-white"
                            )}
                        >
                            <Icon size={20} /> {label}
                        </Button>
                    ))}
                </nav>

                <Button
                    variant="destructive"
                    size="none"
                    onClick={handleLogout}
                    className="justify-start gap-3 px-4 py-3 font-medium mt-auto"
                >
                    <LogOut size={20} /> Logout
                </Button>
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
                            <Button onClick={() => setFormFor("new")}>
                                <Plus size={20} /> New Project
                            </Button>
                        </header>

                        <div className="mb-10 max-w-md">
                            <Label htmlFor="project-search" className="sr-only">Search your projects</Label>
                            <div className="relative">
                                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <Input
                                    id="project-search"
                                    type="search"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search by title, description or tech..."
                                    className="pl-11 bg-white border-gray-200 text-sm"
                                />
                            </div>
                        </div>

                        {error && (
                            <Alert className="mb-8 p-4">
                                <AlertCircle size={20} className="shrink-0" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {status === "loading" && (
                            <div className="grid md:grid-cols-3 gap-8">
                                {[0, 1, 2].map((i) => (
                                    <Card key={i} className="hover:translate-y-0 hover:shadow-lg">
                                        <Skeleton className="h-5 w-2/3 mb-4" />
                                        <Skeleton className="h-3 w-full mb-2" />
                                        <Skeleton className="h-3 w-4/5 mb-6" />
                                        <div className="flex gap-2">
                                            <Skeleton className="h-6 w-16 rounded-full" />
                                            <Skeleton className="h-6 w-16 rounded-full" />
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}

                        {status === "error" && (
                            <div className="py-20 text-center glass-card border-dashed">
                                <p className="text-gray-500 mb-6">We couldn&apos;t load your projects.</p>
                                <Button variant="outline" onClick={() => fetchProjects(query)}>
                                    Try again
                                </Button>
                            </div>
                        )}

                        {status === "ready" && projects.length === 0 && (
                            <div className="py-20 text-center glass-card border-dashed">
                                {query ? (
                                    <>
                                        <p className="text-gray-500 mb-6">
                                            No projects match &ldquo;{query}&rdquo;.
                                        </p>
                                        <Button variant="outline" onClick={() => setQuery("")}>
                                            Clear search
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-gray-500 mb-6">
                                            No projects yet. Create your first one to get started.
                                        </p>
                                        <Button onClick={() => setFormFor("new")}>
                                            <Plus size={20} /> New Project
                                        </Button>
                                    </>
                                )}
                            </div>
                        )}

                        {status === "ready" && projects.length > 0 && (
                            <div className="grid md:grid-cols-3 gap-8">
                                {projects.map((project) => (
                                    <Card key={project._id}>
                                        <CardHeader>
                                            <CardTitle>{project.title}</CardTitle>
                                            <div className="flex items-center gap-1 shrink-0">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => setFormFor(project)}
                                                    aria-label={`Edit ${project.title}`}
                                                    className="text-gray-400 hover:text-black"
                                                >
                                                    <Pencil size={16} />
                                                </Button>

                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            disabled={deletingId === project._id}
                                                            aria-label={`Delete ${project.title}`}
                                                            className="text-gray-400 hover:text-red-500 hover:bg-red-50"
                                                        >
                                                            {deletingId === project._id
                                                                ? <Loader2 size={16} className="animate-spin" />
                                                                : <Trash2 size={16} />}
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Delete this project?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                &ldquo;{project.title}&rdquo; will be permanently removed.
                                                                This cannot be undone.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogAction onClick={() => handleDelete(project)}>
                                                                Delete project
                                                            </AlertDialogAction>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </CardHeader>

                                        <CardContent>
                                            <CardDescription className="mb-6">{project.description}</CardDescription>
                                        </CardContent>

                                        <CardFooter>
                                            {(project.techStack ?? []).map((tech, i) => (
                                                <Badge key={`${tech}-${i}`}>{tech}</Badge>
                                            ))}
                                        </CardFooter>
                                    </Card>
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
                        <Button variant="outline" onClick={() => setSection("dashboard")}>
                            Back to projects
                        </Button>
                    </div>
                )}
            </main>

            <ProjectForm
                key={formFor === "new" ? "new" : formFor?._id}
                project={formFor === "new" ? null : formFor}
                open={Boolean(formFor)}
                onOpenChange={(open) => !open && setFormFor(null)}
                onSaved={handleSaved}
            />
        </div>
    );
};

export default Dashboard;
