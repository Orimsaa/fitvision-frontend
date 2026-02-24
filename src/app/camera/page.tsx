"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function CameraContent() {
    const searchParams = useSearchParams();
    const model = searchParams.get("model")?.toLowerCase() || "deadlift";

    const exerciseName = model === "squat" ? "Back Squat" : "Deadlift";
    const bgImage =
        model === "squat"
            ? "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBSPGhF6FdF9bU_LRCvoWAyktliyijADwekce0CfAncyducIDikZjxGF5094eW6FMdcAkRM3Zyt863v8ORD01e3_7h_84JVt3r5UabJF2NLrRPqC10XiMFMlLkgeEAMD1IFcBcriuhDbJCIvUuXxjIGLfO88IOv5nQdgr0lcdyCUwBDnSKN4Ce7YRByxTu9pqqCjvb0sIDjbQ5qQouFGeMSARXkws4p3sASsaHpSyW6vmt_-l-Ud4lp9piwPfV-20XYO62ZfRJM6Q')"
            : "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCIjPctrrRIxez7O341YGdYRvARy-f4NeGOsbePGy3EAG5-gymR0j5XJdyOiev_kUL_NDbIZTSyRNu9VOkMx8s7H6JvZwQ1xHXls57X0veyN3Z0iMXpuM0BPf_8LJe7Ee0tvfE-pBa899ZSxY7Gldg-qTS8XjHQpkOY7xJrJX5lM8dsmQz2O-Wvsh0ev_I5UgeJhiGLmeCarG7pMdTajsHHOYmDo2uGf5iFR9QU1qdRCP0nkzlYX63b0Vzi9G4vfl71nxxrsufRj1Ns')";

    const feedbackModel =
        model === "squat"
            ? { title: "Depth Check", detail: "Squat depth is good, break parallel to hit full range of motion." }
            : { title: "Correction Needed", detail: "Keep your back straight. Hips are rising too fast." };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen flex flex-col overflow-hidden relative">
            {/* Background Camera Feed Simulation */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center"
                style={{
                    backgroundImage: bgImage,
                    filter: "brightness(0.4) contrast(1.1) blur(2px)",
                }}
            ></div>

            {/* Tech Overlay Pattern */}
            <div className="absolute inset-0 z-0 bg-grid-pattern pointer-events-none"></div>

            {/* Skeletal Tracking Overlay (SVG) */}
            <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                <svg
                    className="w-full h-full max-w-4xl max-h-[80vh] opacity-80"
                    fill="none"
                    viewBox="0 0 400 600"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* Bounding Box */}
                    <rect
                        fill="none"
                        height="500"
                        rx="20"
                        stroke="#38ff14"
                        strokeDasharray="10 5"
                        strokeOpacity="0.3"
                        strokeWidth="1"
                        width="300"
                        x="50"
                        y="50"
                    ></rect>
                    {/* Corner Markers */}
                    <path d="M50 100 V50 H100" stroke="#38ff14" strokeWidth="2"></path>
                    <path d="M350 100 V50 H300" stroke="#38ff14" strokeWidth="2"></path>
                    <path d="M50 500 V550 H100" stroke="#38ff14" strokeWidth="2"></path>
                    <path d="M350 500 V550 H300" stroke="#38ff14" strokeWidth="2"></path>

                    {/* Skeleton Lines */}
                    <line stroke="#38ff14" strokeWidth="2" x1="200" x2="200" y1="120" y2="180"></line>
                    <line stroke="#38ff14" strokeWidth="2" x1="160" x2="240" y1="180" y2="180"></line>
                    <line stroke="#ef4444" strokeWidth="3" x1="200" x2="200" y1="180" y2="320"></line>
                    <line stroke="#38ff14" strokeWidth="2" x1="170" x2="230" y1="320" y2="320"></line>
                    <line stroke="#38ff14" strokeWidth="2" x1="160" x2="140" y1="180" y2="280"></line>
                    <line stroke="#38ff14" strokeWidth="2" x1="140" x2="150" y1="280" y2="360"></line>
                    <line stroke="#38ff14" strokeWidth="2" x1="240" x2="260" y1="180" y2="280"></line>
                    <line stroke="#38ff14" strokeWidth="2" x1="260" x2="250" y1="280" y2="360"></line>
                    <line stroke="#38ff14" strokeWidth="2" x1="170" x2="160" y1="320" y2="440"></line>
                    <line stroke="#38ff14" strokeWidth="2" x1="160" x2="160" y1="440" y2="540"></line>
                    <line stroke="#38ff14" strokeWidth="2" x1="230" x2="240" y1="320" y2="440"></line>
                    <line stroke="#38ff14" strokeWidth="2" x1="240" x2="240" y1="440" y2="540"></line>

                    {/* Joints */}
                    <circle cx="200" cy="100" fill="none" r="15" stroke="#38ff14" strokeWidth="2"></circle>
                    <circle cx="200" cy="180" fill="#38ff14" r="4"></circle>
                    <circle cx="160" cy="180" fill="#38ff14" r="4"></circle>
                    <circle cx="240" cy="180" fill="#38ff14" r="4"></circle>
                    <circle cx="140" cy="280" fill="#38ff14" r="4"></circle>
                    <circle cx="260" cy="280" fill="#38ff14" r="4"></circle>
                    <circle cx="150" cy="360" fill="#38ff14" r="4"></circle>
                    <circle cx="250" cy="360" fill="#38ff14" r="4"></circle>
                    <circle cx="170" cy="320" fill="#38ff14" r="4"></circle>
                    <circle cx="230" cy="320" fill="#38ff14" r="4"></circle>
                    <circle cx="160" cy="440" fill="#38ff14" r="4"></circle>
                    <circle cx="240" cy="440" fill="#38ff14" r="4"></circle>
                    <circle cx="160" cy="540" fill="#38ff14" r="4"></circle>
                    <circle cx="240" cy="540" fill="#38ff14" r="4"></circle>
                </svg>
            </div>

            {/* UI Layer */}
            <div className="relative z-20 flex flex-col h-full justify-between p-4 md:p-6 lg:p-8 grow">
                {/* Header */}
                <header className="flex items-center justify-between w-full">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-white/90 hover:text-primary transition-colors bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10"
                    >
                        <span className="material-symbols-outlined text-lg">arrow_back_ios_new</span>
                        <span className="font-medium">Back</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-lg border border-white/10">
                            <span className="material-symbols-outlined text-primary text-sm">videocam</span>
                            <span className="text-xs font-bold text-white tracking-wider">AI VISION ACTIVE</span>
                        </div>
                        <div className="animate-pulse-red bg-red-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-lg shadow-red-900/50">
                            <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                            <span className="text-xs font-bold tracking-widest">LIVE 00:42</span>
                        </div>
                    </div>
                </header>

                {/* Center Area (Empty for camera view clarity) */}
                <div className="flex-1"></div>

                {/* Bottom Controls & Info */}
                <div className="w-full flex flex-col items-center gap-6 pb-4">
                    {/* Analysis Card */}
                    <div className="w-full max-w-md bg-background-dark/60 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl relative overflow-hidden group">
                        {/* Subtle green glow effect */}
                        <div className="absolute -top-10 -right-10 w-20 h-20 bg-primary/20 blur-3xl rounded-full"></div>
                        <div className="flex flex-col gap-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Current Exercise</p>
                                    <h2 className="text-2xl font-bold text-white">{exerciseName}</h2>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <div className="px-2 py-1 bg-primary/20 border border-primary/30 rounded text-primary text-xs font-bold flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm" style={{ fontSize: "14px" }}>
                                            check_circle
                                        </span>
                                        FORM: 85%
                                    </div>
                                </div>
                            </div>

                            <div className="h-px w-full bg-white/10"></div>

                            {/* Alert / Feedback Section */}
                            <div className={`flex items-start gap-3 border rounded-lg p-3 ${model === "squat" ? "bg-primary/10 border-primary/30" : "bg-red-500/10 border-red-500/30"}`}>
                                <span className={`material-symbols-outlined shrink-0 ${model === "squat" ? "text-primary" : "text-red-400"}`}>
                                    {model === "squat" ? "info" : "warning"}
                                </span>
                                <div className="flex flex-col">
                                    <span className={`font-bold text-sm ${model === "squat" ? "text-primary" : "text-red-300"}`}>
                                        {feedbackModel.title}
                                    </span>
                                    <span className={`${model === "squat" ? "text-primary" : "text-red-200"} text-sm leading-tight opacity-80`}>
                                        {feedbackModel.detail}
                                    </span>
                                </div>
                            </div>

                            {/* Stats Row */}
                            <div className="flex gap-2 mt-1">
                                <div className="flex-1 bg-background-dark/40 rounded-lg p-2 flex items-center justify-center gap-2 border border-white/5">
                                    <span className="material-symbols-outlined text-primary text-sm">health_and_safety</span>
                                    <span className="text-xs text-white font-medium">Injury Risk: Low</span>
                                </div>
                                <div className="flex-1 bg-background-dark/40 rounded-lg p-2 flex items-center justify-center gap-2 border border-white/5">
                                    <span className="material-symbols-outlined text-blue-400 text-sm">fitness_center</span>
                                    <span className="text-xs text-white font-medium">Reps: 8/12</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Action Button */}
                    <Link
                        href="/summary"
                        className="w-full max-w-md h-14 bg-red-600 hover:bg-red-500 active:scale-[0.98] transition-all rounded-xl text-white font-bold text-lg shadow-lg shadow-red-900/40 flex items-center justify-center gap-3 cursor-pointer"
                    >
                        <span className="material-symbols-outlined">stop_circle</span>
                        End Analysis
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function CameraPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center">Loading Camera...</div>}>
            <CameraContent />
        </Suspense>
    );
}
