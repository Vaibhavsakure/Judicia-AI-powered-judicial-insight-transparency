import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CaseTimeline({ timelineData }) {
    const [expandedEvent, setExpandedEvent] = useState(null);

    if (!timelineData || !timelineData.events || timelineData.events.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 bg-surface-light rounded-xl flex items-center justify-center mb-4">
                    <span className="text-2xl">📅</span>
                </div>
                <p className="text-sm font-semibold text-lavender/40">Timeline unavailable</p>
                <p className="text-xs text-lavender/20 mt-1">Could not extract timeline events from this judgment</p>
            </div>
        );
    }

    const { events, total_duration, verdict, sentence } = timelineData;

    const typeConfig = {
        incident:      { color: "bg-red-500",     glow: "shadow-red-500/30",     dot: "border-red-500/30",   text: "text-red-400",     bg: "bg-red-500/10",     label: "Incident" },
        filing:        { color: "bg-blue-500",    glow: "shadow-blue-500/30",    dot: "border-blue-500/30",  text: "text-blue-400",    bg: "bg-blue-500/10",    label: "Filing" },
        investigation: { color: "bg-purple-500",  glow: "shadow-purple-500/30",  dot: "border-purple-500/30",text: "text-purple-400",  bg: "bg-purple-500/10",  label: "Investigation" },
        arrest:        { color: "bg-orange-500",  glow: "shadow-orange-500/30",  dot: "border-orange-500/30",text: "text-orange-400",  bg: "bg-orange-500/10",  label: "Arrest" },
        trial:         { color: "bg-cyan-500",    glow: "shadow-cyan-500/30",    dot: "border-cyan-500/30",  text: "text-cyan-400",    bg: "bg-cyan-500/10",    label: "Trial" },
        verdict:       { color: "bg-emerald-500", glow: "shadow-emerald-500/30", dot: "border-emerald-500/30",text: "text-emerald-400",bg: "bg-emerald-500/10", label: "Verdict" },
        appeal:        { color: "bg-teal-500",    glow: "shadow-teal-500/30",    dot: "border-teal-500/30",  text: "text-teal-400",    bg: "bg-teal-500/10",    label: "Appeal" },
        hearing:       { color: "bg-blue-400",    glow: "shadow-blue-400/30",    dot: "border-blue-400/30",  text: "text-blue-300",    bg: "bg-blue-400/10",    label: "Hearing" },
        evidence:      { color: "bg-amber-500",   glow: "shadow-amber-500/30",   dot: "border-amber-500/30", text: "text-amber-400",   bg: "bg-amber-500/10",   label: "Evidence" },
        other:         { color: "bg-slate-500",   glow: "shadow-slate-500/30",   dot: "border-slate-500/30", text: "text-slate-400",   bg: "bg-slate-500/10",   label: "Event" },
    };

    const getConfig = (type) => typeConfig[type] || typeConfig.other;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <div className="w-1 h-5 bg-accent rounded-full" />
                    Case Timeline
                </h3>
                <p className="text-xs text-lavender/40 mt-1 ml-3">
                    Chronological events extracted from the judgment
                </p>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {total_duration && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="glass-panel rounded-xl p-4 text-center"
                    >
                        <p className="text-[10px] text-lavender/30 font-semibold uppercase tracking-wider">Duration</p>
                        <p className="text-sm font-bold text-white mt-1">{total_duration}</p>
                    </motion.div>
                )}
                {verdict && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass-panel rounded-xl p-4 text-center border-emerald-500/20"
                    >
                        <p className="text-[10px] text-emerald-400/50 font-semibold uppercase tracking-wider">Verdict</p>
                        <p className="text-sm font-bold text-emerald-400 mt-1">{verdict}</p>
                    </motion.div>
                )}
                {sentence && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="glass-panel rounded-xl p-4 text-center border-amber-500/20"
                    >
                        <p className="text-[10px] text-amber-400/50 font-semibold uppercase tracking-wider">Sentence</p>
                        <p className="text-sm font-bold text-amber-400 mt-1">{sentence}</p>
                    </motion.div>
                )}
            </div>

            {/* Vertical timeline */}
            <div className="relative pl-6 ml-2">
                {/* Vertical line */}
                <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-accent/40 via-border/40 to-emerald-500/40" />

                <div className="space-y-1">
                    {events.map((event, i) => {
                        const config = getConfig(event.type);
                        const isLast = i === events.length - 1;
                        const isExpanded = expandedEvent === i;

                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -15 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05, duration: 0.3 }}
                                className="relative flex items-start gap-4 group cursor-pointer"
                                onClick={() => setExpandedEvent(isExpanded ? null : i)}
                            >
                                {/* Dot */}
                                <div className={`absolute -left-6 top-4 w-3.5 h-3.5 rounded-full ${config.color} border-2 ${config.dot} shadow-lg ${config.glow} z-10 group-hover:scale-125 transition-transform`} />

                                {/* Card */}
                                <div className={`flex-1 ml-2 p-4 rounded-xl transition-all duration-300 group-hover:bg-surface-hover
                                    ${isLast ? 'glass-panel border-emerald-500/20' : 'glass-panel'}
                                    ${isExpanded ? 'bg-surface-hover' : ''}
                                `}>
                                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                        <span className="text-[10px] font-bold text-lavender/30 bg-surface-light px-2 py-0.5 rounded">
                                            {event.date || "Date unknown"}
                                        </span>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${config.text} ${config.bg}`}>
                                            {event.type || "event"}
                                        </span>
                                    </div>
                                    <p className={`text-xs text-lavender/70 leading-relaxed font-medium ${isExpanded ? '' : 'line-clamp-2'}`}>
                                        {event.event}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Footer */}
            <div className="text-center">
                <span className="text-[10px] text-lavender/20 font-medium">
                    {events.length} events extracted
                </span>
            </div>
        </div>
    );
}
