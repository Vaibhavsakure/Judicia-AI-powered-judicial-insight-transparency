import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import HistorySidebar from "./components/HistorySidebar";
import WelcomeScreen from "./components/WelcomeScreen";
import AnalysisResults from "./components/AnalysisResults";
import ProgressSteps from "./components/ProgressSteps";
import { analyzeDocument } from "./services/api";

export default function App() {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [progress, setProgress] = useState(0);
    const [step, setStep] = useState(0);
    const [historyOpen, setHistoryOpen] = useState(false);

    const steps = [15, 30, 50, 70, 85, 95];

    useEffect(() => {
        if (loading && step < steps.length) {
            const t = setTimeout(() => {
                setProgress(steps[step]);
                setStep((s) => s + 1);
            }, 450);
            return () => clearTimeout(t);
        }
    }, [loading, step]);

    const runAnalysis = async () => {
        setLoading(true);
        setData(null);
        setProgress(0);
        setStep(0);
        const res = await analyzeDocument(file);
        setData(res.data);
        setProgress(100);
        setLoading(false);
    };

    return (
        <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-200/30 to-indigo-300/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-teal-200/30 to-cyan-300/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

            <HistorySidebar
                isOpen={historyOpen}
                onClose={() => setHistoryOpen(false)}
            />

            <Sidebar
                uploadedFile={file}
                onFileUpload={setFile}
                onOpenHistory={() => setHistoryOpen(true)}
            />

            <div className="flex-1 flex flex-col relative z-10">
                <Header />

                <main className="flex-1 overflow-y-auto p-8">
                    {!file && <WelcomeScreen />}

                    {file && !data && !loading && (
                        <div className="max-w-3xl mx-auto">
                            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white/50 hover:shadow-indigo-200/50 transition-all duration-300">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="text-2xl font-bold text-slate-900 mb-2">
                                            Document Ready for Analysis
                                        </h2>
                                        <p className="text-sm text-slate-600 font-medium bg-slate-100 inline-block px-3 py-1 rounded-lg">
                                            {file.name}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={runAnalysis}
                                    className="mt-8 w-full px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 text-white font-semibold shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-3 group"
                                >
                                    <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    Start AI Analysis
                                </button>
                            </div>
                        </div>
                    )}

                    {loading && (
                        <div className="max-w-3xl mx-auto">
                            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white/50">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="relative">
                                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl animate-pulse"></div>
                                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl blur-lg opacity-50 animate-pulse"></div>
                                    </div>
                                    <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                                        AI Agents Processing
                                    </h3>
                                </div>

                                <div className="relative h-4 bg-gradient-to-r from-slate-100 to-slate-200 rounded-full mb-6 overflow-hidden shadow-inner">
                                    <div
                                        className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 rounded-full transition-all duration-500 ease-out shadow-lg"
                                        style={{ width: `${progress}%` }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 animate-shimmer"></div>
                                    </div>
                                </div>

                                <div className="text-center mb-6">
                                    <span className="text-2xl font-bold text-indigo-600">{progress}%</span>
                                    <span className="text-sm text-slate-500 ml-2">complete</span>
                                </div>

                                <ProgressSteps currentStep={step} />
                            </div>
                        </div>
                    )}

                    {data && (
                        <div className="max-w-6xl mx-auto">
                            <div className="mb-6 px-6 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white font-semibold shadow-xl flex items-center gap-3 animate-slide-in">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Analysis completed successfully
                            </div>

                            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
                                <AnalysisResults data={data} />
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}