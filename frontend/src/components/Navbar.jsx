import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Menu, X } from "lucide-react";

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

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
                        <div className="hidden lg:flex items-center bg-gray-100 rounded-full px-4 py-1.5 border border-transparent focus-within:border-black/10 focus-within:bg-white transition-all group">
                            <Search size={16} className="text-gray-400 group-focus-within:text-black" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="bg-transparent border-none outline-none text-sm ml-2 w-32 focus:w-48 transition-all"
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <Link to="/login">
                                <button className="text-sm font-semibold px-5 py-2 hover:text-gray-600 transition-colors">
                                    Login
                                </button>
                            </Link>
                            <Link to="/register">
                                <button className="text-sm font-semibold bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-all shadow-md hover:shadow-lg active:scale-95">
                                    Sign Up
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
