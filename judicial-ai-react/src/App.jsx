import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import HistorySidebar from "./components/HistorySidebar";
import WelcomeScreen from "./components/WelcomeScreen";
import AnalysisResults from "./components/AnalysisResults";
import ProgressSteps from "./components/ProgressSteps";
import Toast from "./components/Toast";
import { analyzeDocument, fetchAnalysisById } from "./services/api";

export default function App() {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [progress, setProgress] = useState(0);
    const [step, setStep] = useState(0);
    const [historyOpen, setHistoryOpen] = useState(false);
    const [error, setError] = useState(null);
    const [toast, setToast] = useState(null);

    const steps = [12, 25, 40, 55, 70, 82, 95];

    useEffect(() => {
        if (loading && step < steps.length) {
            const t = setTimeout(() => {
                setProgress(steps[step]);
                setStep((s) => s + 1);
            }, 450);
            return () => clearTimeout(t);
        }
    }, [loading, step]);

    const showToast = useCallback((message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    }, []);

    const runAnalysis = async () => {
        setLoading(true);
        setData(null);
        setError(null);
        setProgress(0);
        setStep(0);

        const res = await analyzeDocument(file);

        if (res.success) {
            setData(res.data);
            setProgress(100);
            showToast("Analysis completed successfully", "success");
        } else {
            setError(res.error || "Analysis failed. Please try again.");
            setProgress(0);
            showToast(res.error || "Analysis failed", "error");
        }
        setLoading(false);
    };

    const handleSelectHistory = async (id) => {
        setHistoryOpen(false);
        setLoading(true);
        setData(null);
        setError(null);
        setProgress(0);
        setStep(0);

        const res = await fetchAnalysisById(id);
        if (res.success) {
            setData(res.data);
            setProgress(100);
            showToast("Analysis loaded from history", "success");
        } else {
            setError(res.error || "Failed to load analysis.");
            showToast(res.error || "Failed to load", "error");
        }
        setLoading(false);
    };

    const handleFileUpload = (f) => {
        setFile(f);
        setData(null);
        setError(null);
        if (f) showToast(`${f.name} uploaded`, "success");
    };

    return (
        <div className="flex h-screen bg-abyss relative overflow-hidden">
            {/* Ambient background effects */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] animate-float" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[100px] animate-float" style={{ animationDelay: '3s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-accent/3 to-transparent rounded-full" />
            </div>

            {/* Toast notifications */}
            <AnimatePresence>
                {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            </AnimatePresence>

            {/* History drawer */}
            <HistorySidebar
                isOpen={historyOpen}
                onClose={() => setHistoryOpen(false)}
                onSelectHistory={handleSelectHistory}
            />

            {/* Left sidebar */}
            <Sidebar
                uploadedFile={file}
                onFileUpload={handleFileUpload}
                onOpenHistory={() => setHistoryOpen(true)}
                loading={loading}
                step={step}
                progress={progress}
            />

            {/* Main area */}
            <div className="flex-1 flex flex-col relative z-10 min-w-0">
                <Header />

                <main className="flex-1 overflow-y-auto">
                    <AnimatePresence mode="wait">
                        {/* Welcome state */}
                        {!file && !data && (
                            <motion.div
                                key="welcome"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <WelcomeScreen />
                            </motion.div>
                        )}

                        {/* File uploaded, ready to analyze */}
                        {file && !data && !loading && !error && (
                            <motion.div
                                key="ready"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.4 }}
                                className="max-w-2xl mx-auto px-6 py-16"
                            >
                                <div className="glass-panel rounded-2xl p-8">
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-accent to-purple-700 rounded-xl flex items-center justify-center shadow-glow-purple">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h2 className="text-xl font-bold text-white mb-1">
                                                Document Ready
                                            </h2>
                                            <p className="text-sm text-lavender/80 font-medium truncate">
                                                {file.name}
                                            </p>
                                            <p className="text-xs text-lavender/40 mt-1">
                                                {(file.size / 1024).toFixed(1)} KB
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={runAnalysis}
                                        className="mt-8 w-full group relative px-8 py-4 rounded-xl overflow-hidden font-semibold text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        {/* Button gradient bg */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-accent via-purple-600 to-accent-dark" />
                                        <div className="absolute inset-0 bg-gradient-to-r from-accent-light via-purple-500 to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        {/* Shimmer */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                        <span className="relative flex items-center justify-center gap-3">
                                            <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                            Start AI Analysis
                                        </span>
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* Error state */}
                        {error && (
                            <motion.div
                                key="error"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.4 }}
                                className="max-w-2xl mx-auto px-6 py-16"
                            >
                                <div className="glass-panel rounded-2xl p-8 border-red-500/30">
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-red-500 to-rose-700 rounded-xl flex items-center justify-center">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h2 className="text-xl font-bold text-red-400 mb-2">Analysis Failed</h2>
                                            <p className="text-sm text-lavender/60 mb-6">{error}</p>
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={runAnalysis}
                                                    className="px-5 py-2.5 rounded-xl bg-accent hover:bg-accent-light text-white font-semibold text-sm transition-all hover:shadow-glow-purple"
                                                >
                                                    Retry Analysis
                                                </button>
                                                <button
                                                    onClick={() => { setError(null); setFile(null); }}
                                                    className="px-5 py-2.5 rounded-xl bg-surface-light hover:bg-surface-hover text-lavender font-semibold text-sm border border-border transition-all"
                                                >
                                                    Upload Different File
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Loading state */}
                        {loading && (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.4 }}
                                className="max-w-2xl mx-auto px-6 py-16"
                            >
                                <div className="glass-panel rounded-2xl p-8">
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="relative">
                                            <div className="w-10 h-10 bg-gradient-to-br from-accent to-purple-700 rounded-xl animate-pulse" />
                                            <div className="absolute inset-0 bg-gradient-to-br from-accent to-purple-700 rounded-xl blur-lg opacity-50 animate-pulse-glow" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-white">
                                                AI Agents Processing
                                            </h3>
                                            <p className="text-xs text-lavender/50">
                                                Multi-agent analysis in progress...
                                            </p>
                                        </div>
                                    </div>

                                    {/* Progress bar */}
                                    <div className="relative h-2 bg-surface-light rounded-full mb-4 overflow-hidden">
                                        <motion.div
                                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-accent via-purple-500 to-accent-light rounded-full"
                                            initial={{ width: '0%' }}
                                            animate={{ width: `${progress}%` }}
                                            transition={{ duration: 0.5, ease: "easeOut" }}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                                        </motion.div>
                                    </div>

                                    <div className="flex justify-between items-center mb-8">
                                        <span className="text-xs text-lavender/40">Processing document...</span>
                                        <span className="text-sm font-bold text-accent-light">{progress}%</span>
                                    </div>

                                    <ProgressSteps currentStep={step} />
                                </div>
                            </motion.div>
                        )}

                        {/* Results */}
                        {data && (
                            <motion.div
                                key="results"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.4 }}
                                className="h-full"
                            >
                                <AnalysisResults data={data} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}