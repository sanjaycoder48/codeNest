import { motion } from "framer-motion";
import { Laptop, Rocket, Users, Globe } from "lucide-react";

const features = [
    {
        icon: <Rocket className="w-8 h-8" />,
        title: "Instant Deployment",
        description: "Go from code to production in seconds with our automated CI/CD pipeline."
    },
    {
        icon: <Users className="w-8 h-8" />,
        title: "Collaborative Workflow",
        description: "Built-in tools for team collaboration, code reviews, and project management."
    },
    {
        icon: <Globe className="w-8 h-8" />,
        title: "Global Scale",
        description: "Multi-region deployment ensure your app is fast for users everywhere."
    }
];

const Features = () => {
    return (
        <section className="py-32 bg-white px-6">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">Innovative Features</h2>
                    <p className="text-gray-500 max-w-xl mx-auto">
                        Everything you need to build, deploy, and scale your tech startup.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-12">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.6 }}
                            viewport={{ once: true }}
                            className="anti-gravity-card p-10 group"
                        >
                            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-8 transition-colors group-hover:bg-black group-hover:text-white">
                                {feature.icon}
                            </div>
                            <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                            <p className="text-gray-500 leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
