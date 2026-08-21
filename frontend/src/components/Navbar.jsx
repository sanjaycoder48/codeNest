import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { useAuth } from "../context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [query, setQuery] = useState("");
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        const q = query.trim();
        if (!q) return;
        navigate(isAuthenticated ? `/dashboard?q=${encodeURIComponent(q)}` : "/login");
    };

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "py-4" : "py-6"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6">
                <div
                    className={`glass-card mx-auto flex items-center justify-between px-8 py-3 transition-all duration-300 ${isScrolled ? "bg-white/90 shadow-lg" : "bg-white/50"
                        }`}
                >
                    <div className="flex items-center gap-12">
                        <Link to="/" className="text-2xl font-bold tracking-tight text-black">
                            CodeNest<span className="text-gray-400">.</span>
                        </Link>

                        <div className="hidden md:flex items-center gap-8">
                            <Link to="/explore" className="text-sm font-medium hover:text-gray-500 transition-colors">Explore</Link>
                            <Link to="/about" className="text-sm font-medium hover:text-gray-500 transition-colors">About</Link>
                            <Link to="/community" className="text-sm font-medium hover:text-gray-500 transition-colors">Community</Link>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <form
                            onSubmit={handleSearch}
                            role="search"
                            className="hidden lg:flex items-center bg-gray-100 rounded-full px-4 py-1.5 border border-transparent focus-within:border-black/10 focus-within:bg-white transition-all group"
                        >
                            <Label htmlFor="navbar-search" className="sr-only">Search projects</Label>
                            <Search size={16} className="text-gray-400 group-focus-within:text-black" />
                            <Input
                                id="navbar-search"
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search..."
                                className="bg-transparent border-none rounded-none px-0 py-0 text-sm ml-2 w-32 focus:w-48 focus:ring-0 transition-all"
                            />
                        </form>

                        <div className="flex items-center gap-3">
                            <Link to="/login">
                                <Button variant="nav" size="none">
                                    Login
                                </Button>
                            </Link>
                            <Link to="/register">
                                <Button size="none" className="text-sm px-6 py-2 shadow-md hover:shadow-lg hover:scale-100">
                                    Sign Up
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
