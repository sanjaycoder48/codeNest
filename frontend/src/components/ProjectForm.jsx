import { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";
import api, { errorMessage } from "../lib/api";

// Handles both create and edit — an existing `project` switches it to edit mode.
const ProjectForm = ({ project, onClose, onSaved }) => {
    const isEdit = Boolean(project);
    const [title, setTitle] = useState(project?.title ?? "");
    const [description, setDescription] = useState(project?.description ?? "");
    const [techStack, setTechStack] = useState((project?.techStack ?? []).join(", "));
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const onKeyDown = (e) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [onClose]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (saving) return;

        setError("");
        setSaving(true);
        try {
            const payload = {
                title: title.trim(),
                description: description.trim(),
                techStack: techStack
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean),
            };

            const res = isEdit
                ? await api.patch(`/api/projects/${project._id}`, payload)
                : await api.post("/api/projects", payload);

            onSaved(res.data);
        } catch (err) {
            setError(errorMessage(err, "Could not save the project."));
        } finally {
            setSaving(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-6"
            onClick={onClose}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="project-form-title"
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h2 id="project-form-title" className="text-2xl font-bold">
                            {isEdit ? "Edit project" : "New project"}
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">
                            {isEdit ? "Update the details below." : "Add a project to your nest."}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="p-2 -mr-2 -mt-1 text-gray-400 hover:text-black rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {error && (
                    <div role="alert" className="bg-red-50 text-red-500 p-3 rounded-lg text-sm mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="project-title" className="block text-sm font-bold mb-2">
                            Title
                        </label>
                        <input
                            id="project-title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            maxLength={120}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                            placeholder="CloudSync Pro"
                            required
                            autoFocus
                        />
                    </div>

                    <div>
                        <label htmlFor="project-description" className="block text-sm font-bold mb-2">
                            Description
                        </label>
                        <textarea
                            id="project-description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            maxLength={2000}
                            rows={4}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all resize-y"
                            placeholder="What does it do, and who is it for?"
                            required
                        />
                        <p className="text-xs text-gray-400 mt-2">{description.length} / 2000</p>
                    </div>

                    <div>
                        <label htmlFor="project-tech" className="block text-sm font-bold mb-2">
                            Tech stack
                        </label>
                        <input
                            id="project-tech"
                            type="text"
                            value={techStack}
                            onChange={(e) => setTechStack(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                            placeholder="React, Node, MongoDB"
                        />
                        <p className="text-xs text-gray-400 mt-2">Separate with commas.</p>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={saving}
                            className="btn-primary flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {saving && <Loader2 size={18} className="animate-spin" />}
                            {saving ? "Saving" : isEdit ? "Save changes" : "Create project"}
                        </button>
                        <button type="button" onClick={onClose} className="btn-secondary">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProjectForm;
