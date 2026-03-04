"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import anime from "animejs";
import DashboardLayout from "@/components/DashboardLayout";

export default function ErrorReplayPage() {
    const router = useRouter();
    const [errorData, setErrorData] = useState<{ url: string; title: string; detail: string; time: string } | null>(null);
    const [hasChecked, setHasChecked] = useState(false);

    useEffect(() => {
        const stored = sessionStorage.getItem('fitvision_history_detail_data');
        if (stored) {
            setErrorData(JSON.parse(stored));
        }
        setHasChecked(true);
    }, []);

    useEffect(() => {
        if (errorData) {
            anime({
                targets: '.animate-stagger-replay',
                opacity: [0, 1],
                translateY: [20, 0],
                duration: 800,
                easing: 'easeOutExpo',
                delay: anime.stagger(100, { start: 100 })
            });
        }
    }, [errorData]);

    // --- Loading State ---
    if (!hasChecked) {
        return (
            <DashboardLayout>
                <div className="flex-1 max-w-5xl mx-auto w-full px-5 py-20 flex flex-col items-center justify-center text-center">
                    <span className="material-symbols-outlined text-6xl text-slate-700 mb-4 animate-pulse">hourglass_empty</span>
                    <h2 className="text-xl font-bold text-slate-300">Loading Analysis...</h2>
                </div>
            </DashboardLayout>
        );
    }

    // --- No Data State ---
    if (!errorData) {
        return (
            <DashboardLayout>
                <div className="flex-1 max-w-5xl mx-auto w-full px-5 py-20 flex flex-col items-center justify-center text-center gap-4">
                    <div className="w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                        <span className="material-symbols-outlined text-4xl text-red-400">search_off</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white">No Analysis Data Found</h2>
                    <p className="text-slate-400 max-w-sm text-sm">Select a specific error clip from the Summary or History page to view its detailed analysis.</p>
                    <button
                        onClick={() => router.push('/history')}
                        className="mt-4 bg-primary text-black font-bold px-6 py-3 rounded-xl hover:shadow-[0_0_20px_rgba(57,255,20,0.4)] transition-all active:scale-95"
                    >
                        Go to History
                    </button>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="flex-1 max-w-5xl mx-auto w-full px-5 py-6 md:px-10 pb-24">

                {/* Breadcrumb Navigation */}
                <div className="flex items-center gap-2 mb-6 animate-stagger-replay opacity-0">
                    <button onClick={() => router.back()} className="flex items-center gap-1.5 text-slate-400 hover:text-primary transition-colors text-sm font-medium group">
                        <span className="material-symbols-outlined text-lg group-hover:-translate-x-0.5 transition-transform">arrow_back</span>
                        Back
                    </button>
                    <span className="text-slate-700 text-xs">/</span>
                    <span className="text-white text-sm font-medium truncate">{errorData.title}</span>
                </div>

                {/* Video Player Card */}
                <div className="animate-stagger-replay opacity-0 mb-6">
                    <div className="bg-surface-dark rounded-2xl overflow-hidden border border-white/5 relative group">
                        {/* Badges */}
                        <div className="absolute top-3 left-3 z-20 flex gap-2">
                            <span className="bg-red-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider flex items-center gap-1 shadow-lg">
                                <span className="material-symbols-outlined text-xs">error</span>
                                {errorData.title}
                            </span>
                            <span className="bg-black/50 backdrop-blur-md text-slate-200 text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-lg">
                                {errorData.time}
                            </span>
                        </div>

                        {/* Video */}
                        <div className="aspect-video bg-black flex items-center justify-center">
                            <video
                                src={errorData.url}
                                className="w-full h-full object-contain"
                                controls
                                autoPlay
                                loop
                                playsInline
                                muted
                            />
                        </div>

                        {/* Video Footer */}
                        <div className="px-5 py-3 border-t border-white/5 flex items-center justify-between">
                            <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-sm text-slate-600">videocam</span>
                                Auto-captured error snapshot
                            </span>
                            <button
                                onClick={() => {
                                    const a = document.createElement('a');
                                    a.href = errorData.url;
                                    a.download = `fitvision-error-${Date.now()}.webm`;
                                    document.body.appendChild(a);
                                    a.click();
                                    document.body.removeChild(a);
                                }}
                                className="text-xs text-slate-400 hover:text-primary font-medium flex items-center gap-1 transition-colors"
                            >
                                <span className="material-symbols-outlined text-sm">download</span>
                                Export
                            </button>
                        </div>
                    </div>
                </div>

                {/* Analysis Panel */}
                <div className="animate-stagger-replay opacity-0 bg-surface-dark rounded-2xl border border-white/5 overflow-hidden mb-6">
                    {/* Header with red accent */}
                    <div className="px-5 md:px-6 py-4 border-b border-white/5 bg-red-500/[0.03] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-red-500/15 flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-red-400">analytics</span>
                            </div>
                            <div>
                                <p className="text-[10px] text-red-400 font-bold uppercase tracking-widest">AI Analysis</p>
                                <h2 className="text-lg font-bold text-white">{errorData.title}</h2>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="text-center px-3 py-1.5 rounded-lg bg-white/5 border border-white/5">
                                <p className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Severity</p>
                                <p className="text-sm font-bold text-red-400">High</p>
                            </div>
                            <div className="text-center px-3 py-1.5 rounded-lg bg-white/5 border border-white/5">
                                <p className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Timestamp</p>
                                <p className="text-sm font-bold text-white">{errorData.time}</p>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="px-5 md:px-6 py-5">
                        <p className="text-slate-300 text-sm leading-relaxed border-l-2 border-red-500/40 pl-4 italic">
                            &ldquo;{errorData.detail}&rdquo;
                        </p>
                    </div>

                    {/* Suggestion Cards */}
                    <div className="px-5 md:px-6 pb-6">
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-3">Recommended Corrections</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {[
                                { icon: "vertical_align_bottom", color: "text-orange-400", bg: "bg-orange-400/10 border-orange-400/10", title: "Drive Knees Out", desc: "Push knees toward pinky toes during descent." },
                                { icon: "fitness_center", color: "text-primary", bg: "bg-primary/10 border-primary/10", title: "Engage Glutes", desc: "Imagine 'ripping the floor apart' with your feet." },
                                { icon: "straighten", color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/10", title: "Check Stance", desc: "Widen stance by 2 inches, flare toes 15-30°." },
                            ].map((card, i) => (
                                <button
                                    key={i}
                                    onClick={() => alert(`Tip: ${card.title}\n\n${card.desc}`)}
                                    className={`text-left rounded-xl p-4 border ${card.bg} hover:bg-white/[0.04] transition-all group focus:outline-none focus:ring-1 focus:ring-primary/50`}
                                >
                                    <div className={`w-9 h-9 rounded-lg ${card.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                                        <span className={`material-symbols-outlined text-lg ${card.color}`}>{card.icon}</span>
                                    </div>
                                    <h4 className="text-white text-sm font-bold mb-1 group-hover:text-primary transition-colors">{card.title}</h4>
                                    <p className="text-xs text-slate-500 leading-relaxed">{card.desc}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Row: Biometrics + AI Notes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-stagger-replay opacity-0">
                    {/* Biometric Chart */}
                    <div className="bg-surface-dark rounded-2xl border border-white/5 p-5">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-lg">monitoring</span>
                                Joint Angle Stability
                            </h3>
                            <span className="text-[10px] uppercase font-bold text-slate-600 tracking-wider">Variance</span>
                        </div>
                        <div className="h-32 w-full bg-white/[0.02] border border-white/5 rounded-xl flex items-end px-2 gap-1.5 pb-2 pt-3">
                            {[60, 65, 28, 22, 55, 72, 82].map((h, i) => (
                                <div
                                    key={i}
                                    className={`flex-1 rounded-t-sm transition-all hover:opacity-80 ${h < 35
                                        ? 'bg-red-500/80 shadow-[0_0_8px_rgba(255,71,71,0.4)]'
                                        : 'bg-primary/30 hover:bg-primary/50'
                                        }`}
                                    style={{ height: `${h}%` }}
                                ></div>
                            ))}
                        </div>
                        <div className="flex justify-between mt-2 text-[10px] text-slate-600 font-medium px-1">
                            <span>Rep 1</span>
                            <span>Rep 4</span>
                            <span>Rep 7</span>
                        </div>
                    </div>

                    {/* AI Notes */}
                    <div className="bg-surface-dark rounded-2xl border border-white/5 p-5">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
                            <span className="material-symbols-outlined text-primary text-lg">smart_toy</span>
                            AI Trainer Notes
                        </h3>
                        <div className="space-y-3">
                            <div className="flex gap-3">
                                <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center shrink-0 mt-0.5">
                                    <span className="material-symbols-outlined text-primary text-sm">auto_awesome</span>
                                </div>
                                <p className="text-xs text-slate-400 leading-relaxed">This issue has occurred in <span className="text-white font-semibold">3 out of 5</span> recent sessions. Consider adding <span className="text-primary font-medium">Tibialis Raises</span> to your warm-up routine.</p>
                            </div>
                            <div className="flex gap-3">
                                <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
                                    <span className="material-symbols-outlined text-slate-500 text-sm">person</span>
                                </div>
                                <p className="text-xs text-slate-400 leading-relaxed">&ldquo;Watch your depth — you&apos;re cutting it slightly short to compensate for knee instability.&rdquo; <span className="text-slate-600">— Coach Mike</span></p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Floating Re-run Button */}
                <div className="flex justify-center mt-8 animate-stagger-replay opacity-0">
                    <button
                        onClick={() => router.push('/camera')}
                        className="bg-primary text-black font-bold py-3 px-8 rounded-xl flex items-center gap-2 hover:shadow-[0_0_25px_rgba(57,255,20,0.5)] transition-all active:scale-95"
                    >
                        <span className="material-symbols-outlined">restart_alt</span>
                        Re-run Analysis
                    </button>
                </div>
            </div>
        </DashboardLayout>
    );
}
