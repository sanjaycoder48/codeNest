import { Link, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
    const { pathname } = useLocation();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
            <div className="max-w-md w-full text-center">
                <Link to="/" className="text-3xl font-bold mb-8 block">
                    CodeNest<span className="text-gray-400">.</span>
                </Link>

                <p className="text-7xl font-bold tracking-tight mb-4">404</p>
                <h1 className="text-2xl font-bold mb-3">This page doesn&apos;t exist yet</h1>
                <p className="text-gray-500 mb-2">
                    Nothing lives at <span className="font-mono text-sm text-gray-700">{pathname}</span>.
                </p>
                <p className="text-gray-500 mb-10">
                    It may be a part of CodeNest we haven&apos;t built yet.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link to="/">
                        <button className="btn-primary flex items-center gap-2">
                            <ArrowLeft size={18} /> Back home
                        </button>
                    </Link>
                    <Link to="/dashboard">
                        <button className="btn-secondary">Go to dashboard</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
