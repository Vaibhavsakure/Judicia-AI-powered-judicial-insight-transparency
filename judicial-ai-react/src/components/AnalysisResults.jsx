import { useState } from "react";

export default function AnalysisResults({ data }) {
    const tabs = [
        {
            name: "Summary of Overall Case",
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            )
        },
        {
            name: "Law Used",
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            )
        },
        {
            name: "Reason",
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        },
        {
            name: "Sources",
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
            )
        }
    ];

    const [active, setActive] = useState(0);

    // Function to clean and format text content
    const formatTextContent = (text) => {
        if (!text) return null;

        // Remove all ** (asterisks used for markdown bold)
        let cleaned = text.replace(/\*\*/g, '');

        // Split into paragraphs
        const paragraphs = cleaned.split('\n\n').filter(p => p.trim());

        return paragraphs.map((para, idx) => {
            // Check if it's a heading (ends with :, ?, or is very short)
            const isHeading = para.endsWith(':') || para.endsWith('?') ||
                (para.length < 100 && !para.includes('.'));

            // Check if it's a list item (starts with *, -, or number)
            const isListItem = /^[\*\-\•]\s/.test(para.trim()) || /^\d+[\.\)]\s/.test(para.trim());

            if (isHeading && para.length < 100) {
                return (
                    <h3 key={idx} className="text-lg font-bold text-slate-900 mt-6 mb-3 first:mt-0">
                        {para.replace(/[\:\?]$/, '')}
                    </h3>
                );
            } else if (isListItem) {
                return (
                    <p key={idx} className="text-base text-slate-700 leading-relaxed mb-3 pl-4">
                        {para.replace(/^[\*\-\•]\s/, '• ')}
                    </p>
                );
            } else {
                return (
                    <p key={idx} className="text-base text-slate-700 leading-relaxed mb-4">
                        {para}
                    </p>
                );
            }
        });
    };

    const sections = [
        // Summary of Overall Case
        <div className="space-y-2">
            {formatTextContent(data.summary)}
        </div>,

        // Law Used
        <div className="space-y-2">
            {formatTextContent(data.laws)}
        </div>,

        // Reason (Consistency/Analysis)
        <div className="space-y-2">
            {formatTextContent(data.analysis)}
        </div>,

        // Sources
        data.web_sources?.length > 0 ? (
            <div className="space-y-3">
                <h3 className="text-lg font-bold text-slate-900 mb-4">
                    Referenced Sources
                </h3>
                {data.web_sources.map((s, i) => (
                    <a
                        key={i}
                        href={s.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-start gap-4 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-xl border border-indigo-200 hover:border-indigo-300 transition-all duration-200 group"
                    >
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-base font-bold text-indigo-700 group-hover:text-indigo-900 mb-2 line-clamp-2">
                                {s.title}
                            </p>
                            <p className="text-sm text-slate-600 truncate mb-2">
                                {s.url}
                            </p>
                            {s.snippet && (
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    {s.snippet}
                                </p>
                            )}
                        </div>
                        <svg className="w-5 h-5 text-indigo-400 group-hover:translate-x-1 transition-transform flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </a>
                ))}
            </div>
        ) : (
            <div className="text-center py-12">
                <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                </div>
                <p className="text-slate-500 font-semibold">No sources available</p>
                <p className="text-sm text-slate-400 mt-2">Web research did not return any sources for this analysis</p>
            </div>
        )
    ];

    return (
        <div>
            {/* Tabs Navigation */}
            <div className="flex flex-wrap gap-2 px-6 pt-6 pb-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
                {tabs.map((tab, i) => (
                    <button
                        key={i}
                        onClick={() => setActive(i)}
                        className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${active === i
                                ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg scale-105"
                                : "text-slate-600 hover:text-indigo-600 hover:bg-white/70 hover:shadow-sm"
                            }`}
                    >
                        <span className={active === i ? "text-white" : ""}>
                            {tab.icon}
                        </span>
                        {tab.name}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="p-8">
                <div className="max-w-none">
                    {sections[active] || (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                </svg>
                            </div>
                            <p className="text-slate-500 font-semibold">No data available for this section</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}