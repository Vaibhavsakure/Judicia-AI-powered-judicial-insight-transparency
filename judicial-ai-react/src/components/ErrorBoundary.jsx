import React from "react";

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex items-center justify-center min-h-screen bg-abyss">
                    <div className="glass-panel rounded-2xl p-10 max-w-lg text-center">
                        {/* Icon */}
                        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-red-500 to-rose-700 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>

                        <h2 className="text-xl font-bold text-white mb-2">
                            Something went wrong
                        </h2>
                        <p className="text-sm text-lavender/50 mb-6 leading-relaxed">
                            An unexpected error occurred in the application.
                            Please try refreshing the page.
                        </p>

                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={() => window.location.reload()}
                                className="px-6 py-2.5 rounded-xl bg-accent hover:bg-accent-light text-white font-semibold text-sm transition-all hover:shadow-glow-purple"
                            >
                                Refresh Page
                            </button>
                            <button
                                onClick={() => this.setState({ hasError: false, error: null })}
                                className="px-6 py-2.5 rounded-xl bg-surface-light hover:bg-surface-hover text-lavender font-semibold text-sm border border-border transition-all"
                            >
                                Try Again
                            </button>
                        </div>

                        {/* Error details (collapsed) */}
                        {this.state.error && (
                            <details className="mt-6 text-left">
                                <summary className="text-[11px] text-lavender/30 cursor-pointer hover:text-lavender/50 transition-colors">
                                    Technical details
                                </summary>
                                <pre className="mt-2 p-3 bg-surface-dark rounded-lg text-[10px] text-red-400/70 overflow-auto max-h-32 border border-border/30">
                                    {this.state.error.toString()}
                                </pre>
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
