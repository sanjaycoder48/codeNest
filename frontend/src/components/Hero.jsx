import { motion } from "framer-motion";
import { ArrowRight, Code, Shield, Zap } from "lucide-react";

const Hero = () => {
    return (
        <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-white">
            {/* Background Floating Elements */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-black/5 rounded-full blur-3xl animate-float blur-shape" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-black/5 rounded-full blur-3xl animate-float blur-shape" style={{ animationDelay: '2s' }} />

            <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest uppercase bg-black text-white rounded-full">
                        Modern Developer Hub
                    </span>
                    <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-8 leading-[1.1]">
                        Build fast. <br />
                        <span className="text-gray-400">Deploy faster.</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-xl text-gray-600 mb-12 leading-relaxed">
                        Experience the next generation of development with CodeNest.
                        A futuristic platform designed for elite engineering teams.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <button className="btn-primary flex items-center gap-2">
                            Start Building <ArrowRight size={20} />
                        </button>
                        <button className="btn-secondary">
                            View Showcase
                        </button>
                    </div>
                </motion.div>

                {/* Floating Code Snippet / Component Mockup */}
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 1 }}
                    className="mt-24 relative"
                >
                    <div className="glass-card max-w-4xl mx-auto p-2 shadow-2xl overflow-hidden">
                        <div className="bg-gray-50 rounded-xl p-8 border border-gray-100 flex flex-col md:flex-row gap-12 text-left">
                            <div className="flex-1">
                                <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-6 text-white">
                                    <Code size={24} />
                                </div>
                                <h3 className="text-xl font-bold mb-4">Powerful API</h3>
                                <p className="text-gray-500 text-sm mb-6">Integrate your stack seamlessly with our developer-first API architecture.</p>
                                <div className="h-1 bg-gray-200 w-full overflow-hidden rounded-full">
                                    <motion.div
                                        initial={{ x: "-100%" }}
                                        animate={{ x: "0%" }}
                                        transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                                        className="h-full bg-black w-1/3"
                                    />
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="w-12 h-12 border-2 border-black rounded-lg flex items-center justify-center mb-6">
                                    <Shield size={24} />
                                </div>
                                <h3 className="text-xl font-bold mb-4">Bank-Grade Security</h3>
                                <p className="text-gray-500 text-sm mb-6">Your data is safe with our advanced encryption and role-based access control.</p>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4].map(i => <div key={i} className="h-2 w-8 bg-black/10 rounded-full" />)}
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-6">
                                    <Zap size={24} />
                                </div>
                                <h3 className="text-xl font-bold mb-4">Hyper Speed</h3>
                                <p className="text-gray-500 text-sm mb-6">Optimized for low latency and high throughput, even at global scale.</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
