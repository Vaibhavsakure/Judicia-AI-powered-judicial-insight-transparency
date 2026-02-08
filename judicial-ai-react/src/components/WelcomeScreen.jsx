export default function WelcomeScreen() {
    const features = [
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            ),
            title: "Legal Retrieval",
            description: "Extract relevant statutes and precedents"
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            ),
            title: "Multi-Agent AI",
            description: "Collaborative analysis from multiple perspectives"
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
            ),
            title: "Web-Grounded Sources",
            description: "Verified references from trusted databases"
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
            ),
            title: "Plain Language",
            description: "Complex legal concepts made accessible"
        }
    ];

    return (
        <div className="max-w-5xl mx-auto text-center mt-20">
            <div className="mb-12 animate-fade-in">
                <div className="inline-block p-3 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-3xl shadow-2xl mb-6">
                    <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                    </svg>
                </div>

                <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent mb-4">
                    Welcome to Judicia
                </h1>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                    Understand judicial reasoning with transparent, AI-assisted analysis.
                    Upload a judgment to begin exploring the legal framework behind decisions.
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
                {features.map((feature, i) => (
                    <div
                        key={i}
                        className="group bg-white/70 backdrop-blur-xl p-8 rounded-2xl shadow-lg hover:shadow-2xl border border-white/50 hover:border-indigo-200 transition-all duration-300 hover:-translate-y-1 animate-fade-in"
                        style={{ animationDelay: `${i * 100}ms` }}
                    >
                        <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center text-white mb-4 mx-auto shadow-lg group-hover:scale-110 transition-transform">
                            {feature.icon}
                        </div>
                        <h3 className="text-base font-bold text-slate-900 mb-2">
                            {feature.title}
                        </h3>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            {feature.description}
                        </p>
                    </div>
                ))}
            </div>

            <div className="mt-16 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-indigo-100">
                <p className="text-sm text-slate-700 font-medium">
                    <span className="inline-block mr-2">👈</span>
                    Get started by uploading a PDF judgment using the sidebar
                </p>
            </div>
        </div>
    );
}