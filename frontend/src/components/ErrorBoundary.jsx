import { Component } from "react";

// Without this, a render error unmounts the whole tree and the user gets a
// white screen with no explanation and no way back.
class ErrorBoundary extends Component {
    state = { error: null };

    static getDerivedStateFromError(error) {
        return { error };
    }

    componentDidCatch(error, info) {
        console.error("Unhandled render error:", error, info);
    }

    render() {
        if (!this.state.error) return this.props.children;

        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
                <div className="max-w-md w-full text-center">
                    <p className="text-3xl font-bold mb-6">
                        CodeNest<span className="text-gray-400">.</span>
                    </p>
                    <h1 className="text-2xl font-bold mb-3">Something broke on this page</h1>
                    <p className="text-gray-500 mb-8">
                        The error has been logged to the console. Reloading usually clears it.
                    </p>
                    <button className="btn-primary" onClick={() => window.location.assign("/")}>
                        Reload CodeNest
                    </button>
                </div>
            </div>
        );
    }
}

export default ErrorBoundary;
