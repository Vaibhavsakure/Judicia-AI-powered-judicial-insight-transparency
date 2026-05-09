import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, ChevronRight, X, RotateCcw } from "lucide-react";
import { fetchHistory } from "../services/api";

const HistorySidebar = ({ onSelectHistory, isOpen, onClose }) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadHistory();
        }
    }, [isOpen]);

    const loadHistory = async () => {
        setLoading(true);
        const result = await fetchHistory();
        if (result.success) {
            setHistory(result.data);
        }
        setLoading(false);
    };

    return (
        <>
            {/* Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                        onClick={onClose}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ x: -380 }}
                        animate={{ x: 0 }}
                        exit={{ x: -380 }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="fixed left-0 top-0 bottom-0 w-[360px] bg-sidebar/95 backdrop-blur-xl border-r border-border/30 z-50 flex flex-col shadow-2xl"
                    >
                        {/* Header */}
                        <div className="px-5 py-4 border-b border-border/20">
                            <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center">
                                        <svg className="w-4 h-4 text-accent-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-sm font-bold text-white">Analysis History</h3>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        className="p-1.5 hover:bg-surface-hover rounded-lg transition-all duration-200 group"
                                        onClick={loadHistory}
                                        title="Refresh"
                                    >
                                        <RotateCcw size={14} className="text-lavender/30 group-hover:text-accent-light group-hover:rotate-180 transition-all duration-300" />
                                    </button>
                                    <button
                                        className="p-1.5 hover:bg-red-500/10 rounded-lg transition-all duration-200 group"
                                        onClick={onClose}
                                        title="Close"
                                    >
                                        <X size={16} className="text-lavender/30 group-hover:text-red-400 transition-colors" />
                                    </button>
                                </div>
                            </div>
                            <p className="text-[10px] text-lavender/20 ml-11">
                                View and restore previous analyses
                            </p>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-4">
                            {loading ? (
                                <div className="space-y-3 mt-4">
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i} className="skeleton-dark h-16 rounded-xl" />
                                    ))}
                                </div>
                            ) : history.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 text-center">
                                    <div className="w-14 h-14 bg-surface-light rounded-xl flex items-center justify-center mb-3">
                                        <span className="text-xl">📂</span>
                                    </div>
                                    <p className="text-sm text-lavender/40 font-semibold mb-1">No past analyses</p>
                                    <p className="text-[11px] text-lavender/20">Upload a document to get started</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {history.map((item, index) => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05, duration: 0.3 }}
                                            className="group glass-panel-hover rounded-xl p-3.5 cursor-pointer"
                                            onClick={() => onSelectHistory(item.id)}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="flex-shrink-0 w-9 h-9 bg-accent/15 rounded-lg flex items-center justify-center group-hover:bg-accent/25 transition-colors">
                                                    <FileText size={16} className="text-accent-light" />
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-semibold text-white group-hover:text-accent-light truncate transition-colors" title={item.filename}>
                                                        {item.filename}
                                                    </p>
                                                    <p className="text-[10px] text-lavender/25 mt-0.5">
                                                        {new Date(item.upload_date).toLocaleString("en-US", {
                                                            month: "short",
                                                            day: "numeric",
                                                            year: "numeric",
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        })}
                                                    </p>
                                                </div>

                                                <ChevronRight
                                                    size={14}
                                                    className="text-lavender/15 group-hover:text-accent-light group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-1"
                                                />
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default HistorySidebar;