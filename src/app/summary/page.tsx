import React from "react";
import Link from "next/link";

export default function SummaryPage() {
    return (
        <div className="flex min-h-screen">
            <main className="flex-1 md:ml-64 flex flex-col h-screen overflow-y-auto">
                <header className="sticky top-0 z-10 flex items-center justify-between px-8 py-4 bg-background-dark/80 backdrop-blur-md border-b border-primary/10">
                    <div className="flex items-center gap-4 text-slate-100 lg:hidden">
                        <span className="material-symbols-outlined text-primary">monitoring</span>
                        <h2 className="text-lg font-bold">FitVision</h2>
                    </div>
                    <div className="hidden lg:block">
                        <h2 className="text-slate-100 text-lg font-bold">Session Overview</h2>
                    </div>
                    <div className="flex gap-3">
                        <button className="p-2.5 rounded-xl bg-surface-dark border border-primary/10 text-slate-100 hover:bg-primary/5 transition-all">
                            <span className="material-symbols-outlined">notifications</span>
                        </button>
                        <button className="p-2.5 rounded-xl bg-surface-dark border border-primary/10 text-slate-100 hover:bg-primary/5 transition-all">
                            <span className="material-symbols-outlined">account_circle</span>
                        </button>
                    </div>
                </header>

                <div className="max-w-4xl mx-auto w-full p-8 flex flex-col gap-10">
                    <div className="text-center flex flex-col items-center gap-4">
                        <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center mb-2">
                            <span className="material-symbols-outlined text-primary text-5xl font-bold">check_circle</span>
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-slate-100">Analysis Complete!</h1>
                        <p className="text-slate-400 max-w-md mx-auto">
                            Great job on your set! Our AI has finished processing your movement patterns and posture metrics.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-surface-dark rounded-2xl p-8 border border-primary/5 flex flex-col items-center text-center shadow-xl shadow-black/20">
                            <span className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-2">Total Reps</span>
                            <p className="text-5xl font-bold text-primary">12</p>
                        </div>
                        <div className="bg-surface-dark rounded-2xl p-8 border border-primary/5 flex flex-col items-center text-center shadow-xl shadow-black/20">
                            <span className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-2">Form Accuracy</span>
                            <p className="text-5xl font-bold text-primary">94%</p>
                        </div>
                        <div className="bg-surface-dark rounded-2xl p-8 border border-primary/5 flex flex-col items-center text-center shadow-xl shadow-black/20">
                            <span className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-2">Overall Risk</span>
                            <p className="text-5xl font-bold text-primary">Safe</p>
                        </div>
                    </div>

                    <section className="flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-bold text-slate-100">AI Body Scan Analysis</h3>
                            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
                                LIVE FEEDBACK
                            </span>
                        </div>
                        <div className="grid gap-4">
                            <div className="flex items-center justify-between p-5 bg-surface-dark rounded-xl border border-primary/10 hover:border-primary/30 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                        <span className="material-symbols-outlined">accessibility</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-100">Spine Alignment</h4>
                                        <p className="text-sm text-slate-400">Maintained neutral curvature throughout reps</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-primary font-bold">
                                    <span>Perfect</span>
                                    <span className="material-symbols-outlined text-xl">check_circle</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-5 bg-surface-dark rounded-xl border border-orange-500/20 hover:border-orange-500/40 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
                                        <span className="material-symbols-outlined">warning</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-100">Knee Tracking</h4>
                                        <p className="text-sm text-slate-400">Slight inward collapse detected on rep 8-10</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-orange-500 font-bold">
                                    <span className="whitespace-nowrap text-xs md:text-base">Needs Improvement</span>
                                    <span className="material-symbols-outlined text-xl">report_problem</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-5 bg-surface-dark rounded-xl border border-primary/10 hover:border-primary/30 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                        <span className="material-symbols-outlined">balance</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-100">Hip Stability</h4>
                                        <p className="text-sm text-slate-400">Zero lateral tilt observed during descent</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-primary font-bold">
                                    <span>Excellent</span>
                                    <span className="material-symbols-outlined text-xl">check_circle</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="flex flex-col sm:flex-row gap-4 pt-6 pb-12">
                        <button className="flex-1 h-14 bg-primary text-background-dark font-bold text-lg rounded-xl flex items-center justify-center gap-2 shadow-neon hover:brightness-110 active:scale-[0.98] transition-all">
                            <span className="material-symbols-outlined">save</span>
                            Save Video Report
                        </button>
                        <Link
                            href="/"
                            className="flex-1 h-14 bg-transparent text-slate-100 border-2 border-primary/20 font-bold text-lg rounded-xl flex items-center justify-center gap-2 hover:bg-primary/5 hover:border-primary/50 active:scale-[0.98] transition-all"
                        >
                            <span className="material-symbols-outlined">arrow_back</span>
                            Back to Dashboard
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
