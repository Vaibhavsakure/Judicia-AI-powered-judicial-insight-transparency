import { motion } from "framer-motion";

const steps = [
    { label: "Extract text", icon: "📄" },
    { label: "Identify laws", icon: "⚖️" },
    { label: "Research precedents", icon: "🔍" },
    { label: "Analyze reasoning", icon: "🧠" },
    { label: "Score fairness", icon: "📊" },
    { label: "Build timeline", icon: "📅" },
    { label: "Finalize", icon: "✅" },
];

export default function ProgressSteps({ currentStep, compact = false }) {
    return (
        <div className={compact ? "space-y-1" : "space-y-2"}>
            {steps.map((step, i) => {
                const isActive = i === currentStep;
                const isCompleted = i < currentStep;
                const isPending = i > currentStep;

                return (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05, duration: 0.3 }}
                        className={`flex items-center gap-3 ${compact ? 'px-3 py-2' : 'px-4 py-3'} rounded-lg transition-all duration-300
                            ${isActive
                                ? 'bg-accent/10 border border-accent/20'
                                : isCompleted
                                    ? 'bg-emerald-500/5'
                                    : 'opacity-40'
                            }`}
                    >
                        {/* Step indicator */}
                        <div className="relative flex-shrink-0">
                            <div className={`${compact ? 'w-7 h-7 text-xs' : 'w-8 h-8 text-sm'} rounded-lg flex items-center justify-center font-bold transition-all duration-300
                                ${isActive
                                    ? 'bg-accent text-white shadow-glow-purple'
                                    : isCompleted
                                        ? 'bg-emerald-500/20 text-emerald-400'
                                        : 'bg-surface-light text-lavender/30'
                                }`}
                            >
                                {isCompleted ? (
                                    <svg className={`${compact ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    <span>{step.icon}</span>
                                )}
                            </div>
                            {/* Glow effect for active */}
                            {isActive && (
                                <div className="absolute inset-0 bg-accent rounded-lg blur-md opacity-40 animate-pulse-glow" />
                            )}
                        </div>

                        {/* Label */}
                        <span className={`${compact ? 'text-[11px]' : 'text-xs'} font-medium transition-colors duration-300
                            ${isActive
                                ? 'text-accent-light'
                                : isCompleted
                                    ? 'text-emerald-400/70'
                                    : 'text-lavender/30'
                            }`}
                        >
                            {step.label}
                        </span>

                        {/* Active dots */}
                        {isActive && (
                            <div className="flex gap-1 ml-auto">
                                {[0, 1, 2].map((d) => (
                                    <div
                                        key={d}
                                        className="w-1.5 h-1.5 bg-accent-light rounded-full animate-dot-pulse"
                                        style={{ animationDelay: `${d * 0.15}s` }}
                                    />
                                ))}
                            </div>
                        )}
                    </motion.div>
                );
            })}
        </div>
    );
}