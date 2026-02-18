import { useState, useEffect } from "react";
import { LogOut, Plus, Settings, Folder, Layout, Database } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const [projects, setProjects] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProjects = async () => {
            const token = localStorage.getItem("token");
            if (!token) return navigate("/login");

            try {
                const res = await axios.get("http://localhost:5000/api/projects", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProjects(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchProjects();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-100 flex flex-col p-6 fixed h-full">
                <div className="text-2xl font-bold mb-12">CodeNest<span className="text-gray-400">.</span></div>

                <nav className="flex-1 space-y-2">
                    <button className="w-full flex items-center gap-3 px-4 py-3 bg-black text-white rounded-xl font-medium">
                        <Layout size={20} /> Dashboard
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-xl font-medium transition-colors">
                        <Folder size={20} /> Projects
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-xl font-medium transition-colors">
                        <Database size={20} /> Storage
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-xl font-medium transition-colors">
                        <Settings size={20} /> Settings
                    </button>
                </nav>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl font-medium transition-colors mt-auto"
                >
                    <LogOut size={20} /> Logout
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-12">
                <header className="flex items-center justify-between mb-12">
                    <div>
                        <h1 className="text-3xl font-bold">Your Projects</h1>
                        <p className="text-gray-500">Manage and monitor your engineering nest.</p>
                    </div>
                    <button className="btn-primary flex items-center gap-2">
                        <Plus size={20} /> New Project
                    </button>
                </header>

                <div className="grid md:grid-cols-3 gap-8">
                    {projects.length > 0 ? projects.map(project => (
                        <div key={project._id} className="anti-gravity-card p-6 bg-white">
                            <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                            <p className="text-gray-500 text-sm mb-6">{project.description}</p>
                            <div className="flex flex-wrap gap-2">
                                {project.techStack.map(tech => (
                                    <span key={tech} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold uppercase">{tech}</span>
                                ))}
                            </div>
                        </div>
                    )) : (
                        <div className="col-span-3 py-20 text-center glass-card border-dashed">
                            <p className="text-gray-400">No projects found. Create your first project to get started.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
