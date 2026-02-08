import { Upload, History, CheckCircle } from "lucide-react";

export default function Sidebar({ uploadedFile, onFileUpload, onOpenHistory }) {
    return (
        <aside className="w-80 bg-white/70 backdrop-blur-xl shadow-2xl border-r border-white/50 p-6 flex flex-col relative z-20">
            <div className="mb-6">
                <h3 className="text-sm font-bold text-slate-700 mb-1 uppercase tracking-wide">
                    Upload Judgment
                </h3>
                <p className="text-xs text-slate-500">
                    Upload a PDF document to begin analysis
                </p>
            </div>

            <label className="group relative rounded-2xl p-8 text-center cursor-pointer 
                bg-gradient-to-br from-indigo-50 to-violet-50 
                hover:from-indigo-100 hover:to-violet-100 
                transition-all duration-300 border-2 border-dashed border-indigo-200 
                hover:border-indigo-400 hover:shadow-lg overflow-hidden">

                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/0 via-violet-400/0 to-purple-400/0 group-hover:from-indigo-400/5 group-hover:via-violet-400/5 group-hover:to-purple-400/5 transition-all duration-500"></div>

                <input
                    type="file"
                    hidden
                    accept=".pdf"
                    onChange={(e) => onFileUpload(e.target.files[0])}
                />

                <div className="relative z-10">
                    {uploadedFile ? (
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg animate-scale-in">
                                <CheckCircle className="text-white" size={28} strokeWidth={2.5} />
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-emerald-700 font-bold">
                                    File Uploaded
                                </p>
                                <p className="text-xs text-slate-600 font-medium break-all px-2">
                                    {uploadedFile.name}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <Upload className="text-white" size={24} strokeWidth={2.5} />
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-slate-700 font-bold">
                                    Click to upload PDF
                                </p>
                                <p className="text-xs text-slate-500">
                                    or drag and drop
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </label>

            {uploadedFile && (
                <button
                    onClick={() => onFileUpload(null)}
                    className="mt-4 px-4 py-2 text-xs text-slate-600 hover:text-red-600 font-semibold hover:bg-red-50 rounded-xl transition-all duration-200"
                >
                    Remove file
                </button>
            )}

            <div className="flex-1"></div>

            <button
                onClick={onOpenHistory}
                className="flex items-center justify-center gap-2 px-5 py-3 text-sm bg-gradient-to-r from-slate-100 to-slate-200 hover:from-indigo-100 hover:to-violet-100 text-slate-700 hover:text-indigo-700 font-semibold rounded-xl shadow-sm hover:shadow-md transition-all duration-200 group"
            >
                <History size={18} className="group-hover:rotate-12 transition-transform" />
                View History
            </button>
        </aside>
    );
}