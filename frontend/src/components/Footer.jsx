import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="py-20 bg-white border-t border-gray-100 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="grid md:grid-cols-4 gap-12 mb-20">
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="text-2xl font-bold tracking-tight text-black mb-6 block">
                            CodeNest<span className="text-gray-400">.</span>
                        </Link>
                        <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                            The anti-gravity platform for modern engineering teams.
                            Elevate your development experience today.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6">Product</h4>
                        <ul className="space-y-4 text-sm text-gray-500">
                            <li><Link to="/features" className="hover:text-black">Features</Link></li>
                            <li><Link to="/api" className="hover:text-black">API</Link></li>
                            <li><Link to="/security" className="hover:text-black">Security</Link></li>
                            <li><Link to="/pricing" className="hover:text-black">Pricing</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6">Company</h4>
                        <ul className="space-y-4 text-sm text-gray-500">
                            <li><Link to="/about" className="hover:text-black">About</Link></li>
                            <li><Link to="/blog" className="hover:text-black">Blog</Link></li>
                            <li><Link to="/careers" className="hover:text-black">Careers</Link></li>
                            <li><Link to="/contact" className="hover:text-black">Contact</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6">Legal</h4>
                        <ul className="space-y-4 text-sm text-gray-500">
                            <li><Link to="/privacy" className="hover:text-black">Privacy Policy</Link></li>
                            <li><Link to="/terms" className="hover:text-black">Terms of Service</Link></li>
                            <li><Link to="/cookies" className="hover:text-black">Cookie Policy</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-10 border-t border-gray-100 flex flex-col md:row-items items-center justify-between gap-6">
                    <p className="text-xs text-gray-400">
                        © {new Date().getFullYear()} CodeNest Inc. All rights reserved.
                    </p>
                    <div className="flex gap-8">
                        {["Twitter", "GitHub", "linkedIn"].map(social => (
                            <a key={social} href="#" className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors">
                                {social}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
