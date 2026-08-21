import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, User, Mail, Lock, Loader2 } from "lucide-react";
import api, { errorMessage } from "../lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "../context/auth-context";

const Register = () => {
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const setField = (field) => (e) =>
        setFormData((prev) => ({ ...prev, [field]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (submitting) return;

        setError("");
        if (formData.password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }

        setSubmitting(true);
        try {
            const res = await api.post("/api/auth/register", formData);
            // The API signs the new user in, so skip the trip through the login form.
            login(res.data.token, res.data.user);
            navigate("/dashboard", { replace: true });
        } catch (err) {
            setError(errorMessage(err, "Registration failed"));
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
                    <h2 className="text-2xl font-bold">Create Account</h2>
                    <p className="text-gray-500 text-sm mt-2">Join the elite community of developers.</p>
                </div>

                {error && (
                    <Alert className="mb-6">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <Label htmlFor="register-name">Full Name</Label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <Input
                                id="register-name"
                                name="name"
                                type="text"
                                autoComplete="name"
                                value={formData.name}
                                onChange={setField("name")}
                                className="pl-10"
                                placeholder="John Doe"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="register-email">Email Address</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <Input
                                id="register-email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                value={formData.email}
                                onChange={setField("email")}
                                className="pl-10"
                                placeholder="name@company.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="register-password">Password</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <Input
                                id="register-password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                minLength={8}
                                value={formData.password}
                                onChange={setField("password")}
                                className="pl-10"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        <p className="text-xs text-gray-400 mt-2">At least 8 characters.</p>
                    </div>

                    <Button type="submit" disabled={submitting} className="w-full">
                        {submitting ? (
                            <>Creating account <Loader2 size={18} className="animate-spin" /></>
                        ) : (
                            <>Sign Up <ArrowRight size={18} /></>
                        )}
                    </Button>
                </form>

                <p className="text-center mt-8 text-sm text-gray-500">
                    Already have an account? <Link to="/login" className="text-black font-bold hover:underline">Sign in</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Register;
