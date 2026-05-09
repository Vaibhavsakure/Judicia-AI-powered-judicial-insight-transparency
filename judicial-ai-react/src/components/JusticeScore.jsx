import { useState, useEffect } from "react";
import { motion } from "framer-motion";

/* ============================================
   Animated counter hook with easing
   ============================================ */
function useAnimatedValue(target, duration = 1500) {
    const [value, setValue] = useState(0);
    useEffect(() => {
        const startTime = performance.now();
        const animate = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(target * eased));
            if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }, [target, duration]);
    return value;
}

/* ============================================
   SVG Radial Gauge
   ============================================ */
function ScoreGauge({ score, label }) {
    const animatedScore = useAnimatedValue(score);
    const radius = 85;
    const stroke = 10;
    const circumference = 2 * Math.PI * radius;
    const dashOffset = circumference - (animatedScore / 100) * circumference;

    const getColor = (s) => {
        if (s >= 90) return { main: "#10b981", glow: "rgba(16,185,129,0.3)", label: "Excellent" };
        if (s >= 75) return { main: "#8B5CF6", glow: "rgba(139,92,246,0.3)", label: "Good" };
        if (s >= 60) return { main: "#f59e0b", glow: "rgba(245,158,11,0.3)", label: "Fair" };
        if (s >= 40) return { main: "#f97316", glow: "rgba(249,115,22,0.3)", label: "Needs Review" };
        return { main: "#ef4444", glow: "rgba(239,68,68,0.3)", label: "Concerning" };
    };

    const color = getColor(score);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col items-center"
        >
            <div className="relative w-52 h-52">
                {/* Glow behind */}
                <div
                    className="absolute inset-4 rounded-full blur-2xl opacity-40"
                    style={{ background: color.glow }}
                />
                <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
                    {/* Background track */}
                    <circle
                        cx="100" cy="100" r={radius}
                        fill="none" stroke="rgba(46,49,80,0.5)" strokeWidth={stroke}
                    />
                    {/* Score arc */}
                    <circle
                        cx="100" cy="100" r={radius}
                        fill="none"
                        stroke={color.main}
                        strokeWidth={stroke}
                        strokeDasharray={circumference}
                        strokeDashoffset={dashOffset}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                        style={{ filter: `drop-shadow(0 0 12px ${color.glow})` }}
                    />
                </svg>
                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-extrabold text-white" style={{ textShadow: `0 0 30px ${color.glow}` }}>
                        {animatedScore}
                    </span>
                    <span className="text-xs text-lavender/40 font-medium mt-1">out of 100</span>
                </div>
            </div>

            {/* Label badge */}
            <div
                className="mt-3 px-5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border"
                style={{
                    color: color.main,
                    borderColor: `${color.main}33`,
                    backgroundColor: `${color.main}15`,
                }}
            >
                {label || color.label}
            </div>
        </motion.div>
    );
}

/* ============================================
   Metric Bar
   ============================================ */
function MetricBar({ label, value, delay = 0, color }) {
    const animatedValue = useAnimatedValue(value, 1500 + delay);

    const getBarColor = (v) => {
        if (v >= 80) return "from-emerald-400 to-emerald-600";
        if (v >= 60) return "from-accent-light to-accent";
        if (v >= 40) return "from-amber-400 to-amber-600";
        return "from-red-400 to-red-600";
    };

    const getGlow = (v) => {
        if (v >= 80) return "rgba(16,185,129,0.15)";
        if (v >= 60) return "rgba(139,92,246,0.15)";
        if (v >= 40) return "rgba(245,158,11,0.15)";
        return "rgba(239,68,68,0.15)";
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay / 1000, duration: 0.4 }}
            className="space-y-2"
        >
            <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-lavender/60">{label}</span>
                <span className="text-xs font-bold text-white">{animatedValue}%</span>
            </div>
            <div className="h-2 bg-surface-light rounded-full overflow-hidden">
                <div
                    className={`h-full bg-gradient-to-r ${getBarColor(value)} rounded-full transition-all duration-[1.5s] ease-out`}
                    style={{
                        width: `${animatedValue}%`,
                        boxShadow: `0 0 12px ${getGlow(value)}`,
                    }}
                />
            </div>
        </motion.div>
    );
}

/* ============================================
   Main Component
   ============================================ */
export default function JusticeScore({ scoreData }) {
    if (!scoreData || typeof scoreData !== "object") {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 bg-surface-light rounded-xl flex items-center justify-center mb-4">
                    <span className="text-2xl">⚖️</span>
                </div>
                <p className="text-sm font-semibold text-lavender/40">Justice score unavailable</p>
                <p className="text-xs text-lavender/20 mt-1">Score data was not generated for this analysis</p>
            </div>
        );
    }

    const {
        overall_score = 70,
        label = "FAIR",
        consistency_with_law = 70,
        precedent_alignment = 70,
        reasoning_quality = 70,
        evidence_consideration = 70,
        flags = [],
    } = scoreData;

    const metrics = [
        { label: "Consistency with Law", value: consistency_with_law },
        { label: "Precedent Alignment", value: precedent_alignment },
        { label: "Reasoning Quality", value: reasoning_quality },
        { label: "Evidence Consideration", value: evidence_consideration },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <div className="w-1 h-5 bg-accent rounded-full" />
                    Justice Fairness Score
                </h3>
                <p className="text-xs text-lavender/40 mt-1 ml-3">
                    AI-powered assessment across 4 dimensions
                </p>
            </div>

            {/* Gauge + Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                <div className="flex justify-center">
                    <ScoreGauge score={overall_score} label={label} />
                </div>

                <div className="space-y-5">
                    <h4 className="text-sm font-bold text-lavender/50 uppercase tracking-wider">
                        Breakdown
                    </h4>
                    {metrics.map((m, i) => (
                        <MetricBar key={i} label={m.label} value={m.value} delay={i * 200} />
                    ))}
                </div>
            </div>

            {/* Flags */}
            {flags && flags.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="glass-panel rounded-xl p-5 border-amber-500/20"
                >
                    <h4 className="text-sm font-bold text-amber-400 mb-3 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        Notable Observations
                    </h4>
                    <ul className="space-y-2">
                        {flags.map((flag, i) => (
                            <li key={i} className="flex items-start gap-3 text-xs text-amber-300/80">
                                <span className="flex-shrink-0 w-5 h-5 bg-amber-500/15 rounded-md flex items-center justify-center text-[10px] font-bold text-amber-400 mt-0.5">
                                    {i + 1}
                                </span>
                                <span className="leading-relaxed">{flag}</span>
                            </li>
                        ))}
                    </ul>
                </motion.div>
            )}
        </div>
    );
}
