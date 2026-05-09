import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import JusticeScore from "./JusticeScore";
import CaseTimeline from "./CaseTimeline";
import JudgmentChat from "./JudgmentChat";

const tabs = [
    { name: "Summary", icon: "📄" },
    { name: "Laws", icon: "📚" },
    { name: "Analysis", icon: "🔬" },
    { name: "Justice Score", icon: "⚖️" },
    { name: "Timeline", icon: "📅" },
    { name: "Chat", icon: "💬" },
    { name: "Sources", icon: "🔗" },
];

export default function AnalysisResults({ data }) {
    const [active, setActive] = useState(0);

    const formatTextContent = (text) => {
        if (!text) return <EmptyState message="No content available" />;
        let cleaned = text.replace(/\*\*/g, '');
        const paragraphs = cleaned.split('\n\n').filter(p => p.trim());
        return (
            <div className="prose-dark space-y-1">
                {paragraphs.map((para, idx) => {
                    const isHeading = para.endsWith(':') || para.endsWith('?') ||
                        (para.length < 100 && !para.includes('.'));
                    const isListItem = /^[\*\-\•]\s/.test(para.trim()) || /^\d+[\.)]\s/.test(para.trim());

                    if (isHeading && para.length < 100) {
                        return (
                            <h3 key={idx} className="text-base font-bold text-white mt-6 mb-2 first:mt-0 flex items-center gap-2">
                                <div className="w-1 h-5 bg-accent rounded-full" />
                                {para.replace(/[\:\?]$/, '')}
                            </h3>
                        );
                    } else if (isListItem) {
                        return (
                            <p key={idx} className="text-sm text-lavender/70 leading-relaxed pl-4 border-l-2 border-border/30 ml-2">
                                {para.replace(/^[\*\-\•]\s/, '• ')}
                            </p>
                        );
                    } else {
                        return (
                            <p key={idx} className="text-sm text-lavender/70 leading-relaxed">
                                {para}
                            </p>
                        );
                    }
                })}
            </div>
        );
    };

    const renderContent = () => {
        switch (active) {
            case 0:
                return formatTextContent(data.summary);
            case 1:
                return formatTextContent(data.laws);
            case 2:
                return formatTextContent(data.analysis);
            case 3:
                return <JusticeScore scoreData={data.justice_score} />;
            case 4:
                return <CaseTimeline timelineData={data.timeline} />;
            case 5:
                return <JudgmentChat extractedText={data.extracted_text} />;
            case 6:
                return <SourcesPanel sources={data.web_sources} />;
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Tab bar */}
            <div className="flex-shrink-0 px-6 pt-4 pb-3 border-b border-border/20 bg-abyss-50/50 backdrop-blur-md">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                    {tabs.map((tab, i) => (
                        <button
                            key={i}
                            id={`tab-${tab.name.toLowerCase().replace(/\s+/g, '-')}`}
                            onClick={() => setActive(i)}
                            className={`tab-pill flex items-center gap-2 ${
                                active === i ? 'tab-pill-active' : 'tab-pill-inactive'
                            }`}
                        >
                            <span className="text-sm">{tab.icon}</span>
                            <span>{tab.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Content area */}
            <div className="flex-1 overflow-y-auto">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={active}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="p-6 max-w-5xl"
                    >
                        {renderContent()}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}

/* ========== Empty State ========== */
function EmptyState({ message, sub }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-surface-light rounded-xl flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-lavender/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
            </div>
            <p className="text-sm font-semibold text-lavender/40">{message}</p>
            {sub && <p className="text-xs text-lavender/20 mt-1">{sub}</p>}
        </div>
    );
}

/* ========== Sources Panel ========== */
function SourcesPanel({ sources }) {
    if (!sources || sources.length === 0) {
        return (
            <EmptyState
                message="No sources available"
                sub="Web research did not return sources for this analysis"
            />
        );
    }

    return (
        <div className="space-y-3">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <div className="w-1 h-5 bg-accent rounded-full" />
                Referenced Sources
            </h3>
            {sources.map((s, i) => (
                <motion.a
                    key={i}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="group flex items-start gap-4 p-4 glass-panel-hover rounded-xl"
                >
                    {/* Number badge */}
                    <div className="flex-shrink-0 w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center">
                        <span className="text-xs font-bold text-accent-light">{i + 1}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white group-hover:text-accent-light transition-colors mb-1 line-clamp-2">
                            {s.title}
                        </p>
                        <p className="text-xs text-lavender/30 truncate mb-1.5">{s.url}</p>
                        {s.snippet && (
                            <p className="text-xs text-lavender/50 leading-relaxed line-clamp-2">
                                {s.snippet}
                            </p>
                        )}
                    </div>

                    {/* External link icon */}
                    <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="w-4 h-4 text-accent-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </div>
                </motion.a>
            ))}
        </div>
    );
}