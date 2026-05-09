import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, CheckCircle, X, History, FileText } from "lucide-react";
import ProgressSteps from "./ProgressSteps";

export default function Sidebar({ uploadedFile, onFileUpload, onOpenHistory, loading, step, progress }) {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && droppedFile.type === 'application/pdf') {
            onFileUpload(droppedFile);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    return (
        <aside className="w-[260px] flex-shrink-0 bg-sidebar border-r border-border/30 flex flex-col relative z-20">
            {/* Logo section */}
            <div className="px-5 py-5 border-b border-border/20">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-accent to-purple-700 rounded-xl flex items-center justify-center shadow-glow-purple">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-white tracking-tight">Judicia</h2>
                        <p className="text-[10px] text-lavender/30 font-medium">Judicial AI Platform</p>
                    </div>
                </div>
            </div>

            {/* Upload section */}
            <div className="px-4 py-5">
                <p className="text-[11px] font-semibold text-lavender/40 uppercase tracking-wider mb-3 px-1">
                    Upload Judgment
                </p>

                <label
                    className={`group relative flex flex-col items-center justify-center rounded-xl p-6 cursor-pointer transition-all duration-300 border-2 border-dashed overflow-hidden
                        ${isDragging
                            ? 'border-accent bg-accent/10 scale-[1.02]'
                            : uploadedFile
                                ? 'border-emerald-500/30 bg-emerald-500/5'
                                : 'border-border/50 bg-surface/30 hover:border-accent/40 hover:bg-surface/50'
                        }`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        hidden
                        accept=".pdf"
                        onChange={(e) => onFileUpload(e.target.files[0])}
                    />

                    <AnimatePresence mode="wait">
                        {uploadedFile ? (
                            <motion.div
                                key="uploaded"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="flex flex-col items-center gap-2 text-center"
                            >
                                <div className="w-11 h-11 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                                    <CheckCircle className="text-emerald-400" size={22} strokeWidth={2.5} />
                                </div>
                                <div>
                                    <p className="text-xs text-emerald-400 font-bold mb-0.5">Ready</p>
                                    <p className="text-[11px] text-lavender/50 font-medium break-all leading-tight max-w-[180px]">
                                        {uploadedFile.name}
                                    </p>
                                    <p className="text-[10px] text-lavender/30 mt-1">
                                        {(uploadedFile.size / 1024).toFixed(1)} KB
                                    </p>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="flex flex-col items-center gap-2"
                            >
                                <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 ${
                                    isDragging ? 'bg-accent/30 scale-110' : 'bg-surface-light group-hover:bg-accent/20'
                                }`}>
                                    <Upload className={`transition-colors ${isDragging ? 'text-accent-light' : 'text-lavender/40 group-hover:text-accent-light'}`} size={20} />
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-lavender/60 font-semibold">
                                        {isDragging ? 'Drop PDF here' : 'Upload PDF'}
                                    </p>
                                    <p className="text-[10px] text-lavender/30 mt-0.5">
                                        Click or drag & drop
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </label>

                {uploadedFile && (
                    <motion.button
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={() => onFileUpload(null)}
                        className="mt-2 w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-[11px] text-lavender/40 hover:text-red-400 font-medium hover:bg-red-500/10 rounded-lg transition-all duration-200"
                    >
                        <X size={12} />
                        Remove
                    </motion.button>
                )}
            </div>

            {/* Analysis Progress (only during loading) */}
            <AnimatePresence>
                {loading && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-4 overflow-hidden"
                    >
                        <p className="text-[11px] font-semibold text-lavender/40 uppercase tracking-wider mb-3 px-1">
                            Analysis Progress
                        </p>
                        <ProgressSteps currentStep={step} compact />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Spacer */}
            <div className="flex-1" />

            {/* History button */}
            <div className="px-4 py-4 border-t border-border/20">
                <button
                    onClick={onOpenHistory}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-lavender/50 hover:text-lavender font-medium rounded-xl hover:bg-surface/50 transition-all duration-200 group"
                >
                    <History size={16} className="group-hover:text-accent-light transition-colors" />
                    <span>View History</span>
                    <svg className="w-4 h-4 ml-auto opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </aside>
    );
}