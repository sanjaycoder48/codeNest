import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Lock, Mail, Loader2 } from "lucide-react";
import api, { errorMessage } from "../lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "../context/auth-context";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    // Send the user back where they were headed before the guard intercepted them.
    const redirectTo = location.state?.from?.pathname || "/dashboard";

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (submitting) return;

        setError("");
        setSubmitting(true);
        try {
            const res = await api.post("/api/auth/login", { email, password });
            login(res.data.token, res.data.user);
            navigate(redirectTo, { replace: true });
        } catch (err) {
            setError(errorMessage(err, "Login failed"));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full glass-card p-10 bg-white"
            >
                <div className="text-center mb-10">
                    <Link to="/" className="text-3xl font-bold mb-4 block">CodeNest<span className="text-gray-400">.</span></Link>
                    <h2 className="text-2xl font-bold">Welcome Back</h2>
                    <p className="text-gray-500 text-sm mt-2">Enter your credentials to access your nest.</p>
                </div>

                {error && (
                    <Alert className="mb-6">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <Label htmlFor="login-email">Email Address</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <Input
                                id="login-email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pl-10"
                                placeholder="name@company.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="login-password">Password</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <Input
                                id="login-password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="pl-10"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <Button type="submit" disabled={submitting} className="w-full">
                        {submitting ? (
                            <>Signing in <Loader2 size={18} className="animate-spin" /></>
                        ) : (
                            <>Sign In <ArrowRight size={18} /></>
                        )}
                    </Button>
                </form>

                <p className="text-center mt-8 text-sm text-gray-500">
                    Don&apos;t have an account? <Link to="/register" className="text-black font-bold hover:underline">Sign up for free</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
