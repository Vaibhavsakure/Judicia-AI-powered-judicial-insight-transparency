import { motion } from "framer-motion";

export default function Header() {
    return (
        <header className="h-14 flex-shrink-0 bg-abyss-50/80 backdrop-blur-xl border-b border-border/30 px-6 flex justify-between items-center relative z-20">
            <div className="flex items-center gap-3">
                {/* Logo */}
                <div className="w-8 h-8 bg-gradient-to-br from-accent to-purple-700 rounded-lg flex items-center justify-center shadow-glow-purple">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                    </svg>
                </div>
                <div>
                    <h1 className="text-base font-bold text-white tracking-tight">
                        Judicia
                    </h1>
                    <p className="text-[10px] text-lavender/40 font-medium -mt-0.5 tracking-wide">
                        AI-powered judicial insight
                    </p>
                </div>
            </div>

            {/* Warning badge */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg"
            >
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-[11px] text-amber-400/90 font-semibold tracking-wide">
                    Decision support only
                </span>
            </motion.div>
        </header>
    );
}