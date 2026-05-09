import { motion } from "framer-motion";

export default function Toast({ message, type = "success", onClose }) {
    const styles = {
        success: {
            bg: "from-emerald-500/20 to-emerald-600/10",
            border: "border-emerald-500/30",
            icon: "text-emerald-400",
            text: "text-emerald-300",
        },
        error: {
            bg: "from-red-500/20 to-red-600/10",
            border: "border-red-500/30",
            icon: "text-red-400",
            text: "text-red-300",
        },
        info: {
            bg: "from-accent/20 to-purple-600/10",
            border: "border-accent/30",
            icon: "text-accent-light",
            text: "text-lavender",
        },
    };

    const s = styles[type] || styles.info;

    return (
        <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`fixed top-6 left-1/2 z-[100] flex items-center gap-3 px-5 py-3 rounded-xl bg-gradient-to-r ${s.bg} border ${s.border} backdrop-blur-xl shadow-2xl cursor-pointer`}
            onClick={onClose}
        >
            {type === "success" && (
                <svg className={`w-5 h-5 ${s.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )}
            {type === "error" && (
                <svg className={`w-5 h-5 ${s.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )}
            <span className={`text-sm font-semibold ${s.text}`}>{message}</span>
        </motion.div>
    );
}
