import React, { useState, useEffect } from 'react';
import { FileText, ChevronRight, X, RotateCcw } from 'lucide-react';
import { fetchHistory } from '../services/api';

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
            <div
                className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
            ></div>

            {/* Sidebar */}
            <div className={`fixed left-0 top-0 bottom-0 w-96 bg-white/95 backdrop-blur-xl shadow-2xl z-50 transition-transform duration-300 flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                {/* Header */}
                <div className="px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-indigo-50 to-violet-50">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-slate-800">Analysis History</h3>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                className="p-2 hover:bg-white/70 rounded-xl transition-all duration-200 group"
                                onClick={loadHistory}
                                title="Refresh"
                            >
                                <RotateCcw size={18} className="text-slate-600 group-hover:text-indigo-600 group-hover:rotate-180 transition-all duration-300" />
                            </button>
                            <button
                                className="p-2 hover:bg-white/70 rounded-xl transition-all duration-200 group"
                                onClick={onClose}
                                title="Close"
                            >
                                <X size={20} className="text-slate-600 group-hover:text-red-600 transition-colors" />
                            </button>
                        </div>
                    </div>
                    <p className="text-xs text-slate-600">
                        View and restore previous analyses
                    </p>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                            <p className="text-sm text-slate-600 font-medium">Loading records...</p>
                        </div>
                    ) : history.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
                                <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <p className="text-slate-700 font-semibold mb-1">No past analyses found</p>
                            <small className="text-slate-500">Upload a document to get started</small>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {history.map((item, index) => (
                                <div
                                    key={item.id}
                                    className="group bg-white hover:bg-gradient-to-r hover:from-indigo-50 hover:to-violet-50 rounded-xl p-4 border border-slate-200 hover:border-indigo-300 hover:shadow-lg cursor-pointer transition-all duration-200 animate-fade-in"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                    onClick={() => onSelectHistory(item.id)}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                            <FileText size={20} className="text-white" />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-slate-800 group-hover:text-indigo-700 truncate mb-1" title={item.filename}>
                                                {item.filename}
                                            </p>
                                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                {new Date(item.upload_date).toLocaleString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </div>
                                        </div>

                                        <ChevronRight
                                            size={18}
                                            className="text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all flex-shrink-0"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default HistorySidebar;