import { motion } from "framer-motion";

const projects = [
    {
        title: "CloudSync Pro",
        category: "Infrastructure",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop"
    },
    {
        title: "EcoMetric Dashboard",
        category: "Analytics",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop"
    },
    {
        title: "SecureAuth v2",
        category: "Security",
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop"
    },
    {
        title: "DevStream AI",
        category: "AI / DevTools",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop"
    }
];

const Projects = () => {
    return (
        <section className="py-32 bg-gray-50/50 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8 text-left">
                    <div className="md:w-1/2">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Latest Projects</h2>
                        <p className="text-gray-500">
                            Explore the innovative solutions built by developers using CodeNest.
                        </p>
                    </div>
                    <button className="text-sm font-bold border-b-2 border-black pb-1 hover:text-gray-600 hover:border-gray-600 transition-all">
                        View All Projects
                    </button>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {projects.map((project, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1, duration: 0.6 }}
                            viewport={{ once: true }}
                            className="group relative overflow-hidden rounded-3xl bg-white shadow-xl cursor-pointer"
                        >
                            <div className="aspect-[16/9] overflow-hidden">
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-10">
                                <span className="text-white/70 text-sm font-medium mb-2">{project.category}</span>
                                <h3 className="text-white text-3xl font-bold">{project.title}</h3>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Projects;
