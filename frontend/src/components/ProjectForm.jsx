import { useState } from "react";
import { Loader2 } from "lucide-react";
import api, { errorMessage } from "../lib/api";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Handles both create and edit — an existing `project` switches it to edit mode.
const ProjectForm = ({ project, open, onOpenChange, onSaved }) => {
    const isEdit = Boolean(project);
    const [title, setTitle] = useState(project?.title ?? "");
    const [description, setDescription] = useState(project?.description ?? "");
    const [techStack, setTechStack] = useState((project?.techStack ?? []).join(", "));
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

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
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Edit project" : "New project"}</DialogTitle>
                    <DialogDescription>
                        {isEdit ? "Update the details below." : "Add a project to your nest."}
                    </DialogDescription>
                </DialogHeader>

                {error && (
                    <Alert className="mb-6">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <Label htmlFor="project-title">Title</Label>
                        <Input
                            id="project-title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            maxLength={120}
                            placeholder="CloudSync Pro"
                            required
                            autoFocus
                        />
                    </div>

                    <div>
                        <Label htmlFor="project-description">Description</Label>
                        <Textarea
                            id="project-description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            maxLength={2000}
                            rows={4}
                            placeholder="What does it do, and who is it for?"
                            required
                        />
                        <p className="text-xs text-gray-400 mt-2">{description.length} / 2000</p>
                    </div>

                    <div>
                        <Label htmlFor="project-tech">Tech stack</Label>
                        <Input
                            id="project-tech"
                            value={techStack}
                            onChange={(e) => setTechStack(e.target.value)}
                            placeholder="React, Node, MongoDB"
                        />
                        <p className="text-xs text-gray-400 mt-2">Separate with commas.</p>
                    </div>

                    <DialogFooter>
                        <Button type="submit" size="sm" disabled={saving}>
                            {saving && <Loader2 size={18} className="animate-spin" />}
                            {saving ? "Saving" : isEdit ? "Save changes" : "Create project"}
                        </Button>
                        <DialogClose asChild>
                            <Button type="button" variant="outline" size="sm">
                                Cancel
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ProjectForm;
