import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { chatWithJudgment } from "../services/api";

export default function JudgmentChat({ extractedText }) {
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content: "Hello! I've read this judgment. Ask me anything about the charges, evidence, verdict, or reasoning — in plain English.",
        },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const suggestedQuestions = [
        "What was the accused charged with?",
        "What was the final verdict?",
        "Was there any eye witness?",
        "Summarize the key evidence",
    ];

    const sendMessage = async (text) => {
        const question = text || input.trim();
        if (!question || loading) return;

        const userMsg = { role: "user", content: question };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try {
            const res = await chatWithJudgment(question, extractedText);
            if (res.success) {
                setMessages((prev) => [...prev, { role: "assistant", content: res.data.answer }]);
            } else {
                setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I encountered an error. Please try again." }]);
            }
        } catch {
            setMessages((prev) => [...prev, { role: "assistant", content: "Connection error. Please check if the backend is running." }]);
        }
        setLoading(false);
        inputRef.current?.focus();
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    if (!extractedText) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 bg-surface-light rounded-xl flex items-center justify-center mb-4">
                    <span className="text-2xl">💬</span>
                </div>
                <p className="text-sm font-semibold text-lavender/40">Chat unavailable</p>
                <p className="text-xs text-lavender/20 mt-1">Document text is required for the chat feature</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[560px]">
            {/* Header */}
            <div className="pb-4 border-b border-border/20">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <div className="w-1 h-5 bg-accent rounded-full" />
                    Chat with Judgment
                </h3>
                <p className="text-[11px] text-lavender/30 mt-1 ml-3">
                    Ask questions in plain English · Answers from your document only
                </p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3 px-1">
                <AnimatePresence>
                    {messages.map((msg, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div className={`max-w-[80%] px-4 py-3 ${
                                msg.role === "user"
                                    ? "bubble-user"
                                    : "bubble-ai"
                            }`}>
                                {msg.role === "assistant" && (
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <div className="w-4 h-4 bg-accent/30 rounded flex items-center justify-center">
                                            <span className="text-[8px]">⚖️</span>
                                        </div>
                                        <span className="text-[10px] font-semibold text-accent-light">Judicia AI</span>
                                    </div>
                                )}
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                    {msg.content}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Typing indicator */}
                {loading && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-start"
                    >
                        <div className="bubble-ai px-4 py-3">
                            <div className="flex items-center gap-2">
                                <div className="flex gap-1">
                                    {[0, 1, 2].map((d) => (
                                        <div
                                            key={d}
                                            className="w-2 h-2 bg-accent rounded-full animate-dot-pulse"
                                            style={{ animationDelay: `${d * 0.15}s` }}
                                        />
                                    ))}
                                </div>
                                <span className="text-[10px] text-lavender/30 ml-1">Analyzing...</span>
                            </div>
                        </div>
                    </motion.div>
                )}

                <div ref={bottomRef} />
            </div>

            {/* Suggested questions */}
            <AnimatePresence>
                {messages.length <= 1 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex flex-wrap gap-2 pb-3"
                    >
                        {suggestedQuestions.map((q, i) => (
                            <button
                                key={i}
                                onClick={() => sendMessage(q)}
                                className="text-[11px] font-medium px-3 py-1.5 rounded-lg bg-accent/10 text-accent-light hover:bg-accent/20 border border-accent/20 hover:border-accent/40 transition-all hover:scale-105 active:scale-95"
                            >
                                {q}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Input */}
            <div className="flex gap-2 pt-3 border-t border-border/20">
                <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about this judgment..."
                    disabled={loading}
                    className="flex-1 px-4 py-3 rounded-xl bg-surface border border-border/30 text-sm text-lavender placeholder-lavender/20 focus:outline-none focus:ring-1 focus:ring-accent/50 focus:border-accent/30 transition-all disabled:opacity-40"
                />
                <button
                    onClick={() => sendMessage()}
                    disabled={loading || !input.trim()}
                    className="px-4 py-3 rounded-xl bg-accent hover:bg-accent-light text-white font-semibold text-sm transition-all hover:shadow-glow-purple disabled:opacity-30 disabled:hover:shadow-none disabled:hover:bg-accent flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    <span className="hidden sm:inline">Send</span>
                </button>
            </div>

            {/* Keyboard hint */}
            <p className="text-[9px] text-lavender/15 text-right mt-1 pr-1">
                Press Enter to send · Shift+Enter for new line
            </p>
        </div>
    );
}
