import { Link } from "react-router-dom";

// Links that resolve are real links; everything else is marked as not built yet
// rather than pointing at a route that renders a 404.
const COLUMNS = [
    {
        heading: "Product",
        links: [
            { label: "Features", to: "/#features" },
            { label: "Projects", to: "/#projects" },
            { label: "Dashboard", to: "/dashboard" },
            { label: "API", soon: true },
        ],
    },
    {
        heading: "Account",
        links: [
            { label: "Sign in", to: "/login" },
            { label: "Create account", to: "/register" },
            { label: "Settings", to: "/dashboard" },
        ],
    },
    {
        heading: "Company",
        links: [
            { label: "About", soon: true },
            { label: "Blog", soon: true },
            { label: "Careers", soon: true },
            { label: "Contact", soon: true },
        ],
    },
];

const Footer = () => {
    return (
        <footer className="py-20 bg-white border-t border-gray-100 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="grid md:grid-cols-4 gap-12 mb-20">
                    <div>
                        <Link to="/" className="text-2xl font-bold tracking-tight text-black mb-6 block">
                            CodeNest<span className="text-gray-400">.</span>
                        </Link>
                        <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                            The anti-gravity platform for modern engineering teams.
                            Elevate your development experience today.
                        </p>
                    </div>

                    {COLUMNS.map((column) => (
                        <div key={column.heading}>
                            <h4 className="font-bold mb-6">{column.heading}</h4>
                            <ul className="space-y-4 text-sm text-gray-500">
                                {column.links.map((link) => (
                                    <li key={link.label}>
                                        {link.soon ? (
                                            <span className="inline-flex items-center gap-2 text-gray-400">
                                                {link.label}
                                                <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded">
                                                    Soon
                                                </span>
                                            </span>
                                        ) : (
                                            <Link to={link.to} className="hover:text-black transition-colors">
                                                {link.label}
                                            </Link>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="pt-10 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-xs text-gray-400">
                        © {new Date().getFullYear()} CodeNest Inc. All rights reserved.
                    </p>
                    <div className="flex gap-8">
                        {[
                            { label: "GitHub", href: "https://github.com" },
                            { label: "Twitter", href: "https://twitter.com" },
                            { label: "LinkedIn", href: "https://linkedin.com" },
                        ].map((social) => (
                            <a
                                key={social.label}
                                href={social.href}
                                target="_blank"
                                rel="noreferrer noopener"
                                className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
                            >
                                {social.label}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
