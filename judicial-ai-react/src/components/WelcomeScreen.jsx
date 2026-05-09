import { motion } from "framer-motion";

export default function WelcomeScreen() {
    const features = [
        {
            icon: "⚖️",
            title: "Legal Retrieval",
            description: "Extract relevant statutes, sections, and legal provisions from the judgment text",
        },
        {
            icon: "🤖",
            title: "Multi-Agent AI",
            description: "Collaborative analysis from multiple AI perspectives for comprehensive insight",
        },
        {
            icon: "🌐",
            title: "Web-Grounded",
            description: "Verified references and recent precedents from trusted legal databases",
        },
        {
            icon: "💬",
            title: "Plain Language",
            description: "Complex legal reasoning translated into clear, accessible language",
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    };

    return (
        <div className="flex items-center justify-center min-h-full px-6 py-12">
            <motion.div
                className="max-w-3xl mx-auto text-center"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Hero */}
                <motion.div variants={itemVariants} className="mb-12">
                    {/* Floating icon */}
                    <div className="relative inline-block mb-8">
                        <div className="w-20 h-20 bg-gradient-to-br from-accent to-purple-800 rounded-2xl flex items-center justify-center shadow-glow-purple-lg rotate-3 animate-float">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                            </svg>
                        </div>
                        {/* Glow behind */}
                        <div className="absolute inset-0 bg-accent/30 rounded-2xl blur-2xl" />
                    </div>

                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
                        Welcome to{" "}
                        <span className="text-gradient-purple">Judicia</span>
                    </h1>
                    <p className="text-base md:text-lg text-lavender/60 max-w-xl mx-auto leading-relaxed">
                        Understand judicial reasoning with transparent, AI-assisted analysis.
                        Upload a judgment to explore the legal framework behind decisions.
                    </p>
                </motion.div>

                {/* Feature grid */}
                <motion.div
                    variants={containerVariants}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10"
                >
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            variants={itemVariants}
                            className="group glass-panel-hover rounded-xl p-5 text-left"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-accent/20 transition-colors text-lg">
                                    {feature.icon}
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white mb-1 group-hover:text-accent-light transition-colors">
                                        {feature.title}
                                    </h3>
                                    <p className="text-xs text-lavender/40 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Call to action hint */}
                <motion.div
                    variants={itemVariants}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface/50 border border-border/30"
                >
                    <svg className="w-4 h-4 text-accent-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                    </svg>
                    <span className="text-xs text-lavender/40 font-medium">
                        Upload a PDF judgment from the sidebar to begin
                    </span>
                </motion.div>
            </motion.div>
        </div>
    );
}