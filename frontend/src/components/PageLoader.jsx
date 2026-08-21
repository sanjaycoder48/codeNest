import { Loader2 } from "lucide-react";

const PageLoader = () => (
    <div className="min-h-screen flex items-center justify-center bg-white" role="status" aria-live="polite">
        <span className="sr-only">Loading</span>
        <Loader2 size={28} className="animate-spin text-gray-300" aria-hidden="true" />
    </div>
);

export default PageLoader;
