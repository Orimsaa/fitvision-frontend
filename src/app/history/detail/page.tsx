"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import anime from "animejs";
import DashboardLayout from "@/components/DashboardLayout";

export default function ErrorReplayPage() {
    const router = useRouter();

    useEffect(() => {
        // Entrance animation
        anime({
            targets: '.animate-stagger-replay',
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 800,
            easing: 'easeOutExpo',
            delay: anime.stagger(100, { start: 100 })
        });
    }, []);

    return (
        <DashboardLayout>
            <div className="flex-1 max-w-5xl mx-auto w-full px-5 py-8 md:px-10 pb-20">
                <div className="flex items-center gap-2 mb-8 group animate-stagger-replay opacity-0">
                    <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors text-sm font-medium">
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                        Back to History
                    </button>
                    <span className="text-slate-600">/</span>
                    <span className="text-slate-100 text-sm font-medium">Session #4029 Analysis</span>
                </div>

                <div className="grid grid-cols-1 gap-8 animate-stagger-replay opacity-0">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-[#ff4747]/10 to-transparent rounded-xl blur-md opacity-20"></div>
                        <div className="relative bg-[#0f172a] rounded-xl overflow-hidden shadow-2xl border border-slate-800 aspect-video flex flex-col">
                            <div className="absolute top-4 left-4 z-20 flex gap-2">
                                <span className="bg-[#ff4747] text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider flex items-center gap-1">
                                    <span className="material-symbols-outlined text-xs">error</span>
                                    Critical Form Error
                                </span>
                                <span className="bg-black/60 backdrop-blur-md text-slate-200 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                                    00:02 - 00:05
                                </span>
                            </div>
                            <div className="relative flex-1 bg-center bg-cover"
                                data-alt="Person performing a squat in a gym with skeletal tracking overlay"
                                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAnfOfUhfFZ6TZiSIQqsGU6ZKA9-7MkHFOXlNe_wp3sDR0QHsPGY-byTGd1vlCtL4prf6sHzhQFXsE8FJJTqwfW0kUscADzetrWYdsOXU-kJIzCXH1oYe7WbP8VRVgaJZ5jXAIztBopi0gSctqH_DKGgHa9vBjEEihtbpbVgRMwA-BwpcQHuGA0xJNaVMP9WqOIKqT5_sLxv1rn0XFIwR-_gDHWALAgrjACeO3ettQB6lWW3j8SlvMb_4GfIIK_6Yi2ywNc-aeAM0c')" }}>
                                <div className="absolute inset-0 bg-black/20"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <button className="flex items-center justify-center rounded-full size-20 bg-primary text-[#0f172a] hover:scale-110 transition-transform shadow-[0_0_30px_rgba(60,249,26,0.4)]">
                                        <span className="material-symbols-outlined text-4xl fill-current">play_arrow</span>
                                    </button>
                                </div>
                            </div>
                            <div className="bg-slate-900/90 backdrop-blur-md px-6 py-4">
                                <div className="flex items-center gap-4">
                                    <span className="text-primary text-xs font-mono">00:02</span>
                                    <div className="flex-1 h-1.5 bg-slate-700 rounded-full relative overflow-hidden">
                                        <div className="absolute inset-y-0 left-0 w-1/4 bg-primary rounded-full"></div>
                                        <div className="absolute inset-y-0 left-[15%] w-[10%] bg-[#ff4747] shadow-[0_0_8px_rgba(255,71,71,0.8)]"></div>
                                    </div>
                                    <span className="text-slate-400 text-xs font-mono">00:03</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900/40 backdrop-blur-xl rounded-xl p-6 md:p-8 shadow-[0_0_15px_rgba(255,71,71,0.3)] border border-[#ff4747]/50">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="material-symbols-outlined text-[#ff4747]">analytics</span>
                                    <h2 className="text-[#ff4747] font-bold uppercase tracking-widest text-sm drop-shadow-[0_0_8px_rgba(255,71,71,0.6)]">
                                        AI Neural Analysis
                                    </h2>
                                </div>
                                <h1 className="text-2xl md:text-3xl font-bold text-white">Dynamic Valgus Detected</h1>
                                <p className="text-slate-400 mt-1 italic">"Your knees are moving inward during the eccentric phase, increasing ACL strain."</p>
                            </div>
                            <div className="flex items-center gap-4 bg-[#ff4747]/10 border border-[#ff4747]/20 rounded-lg px-4 py-2">
                                <div className="text-center">
                                    <p className="text-[10px] text-[#ff4747] uppercase font-bold">Severity</p>
                                    <p className="text-xl font-bold text-white">High</p>
                                </div>
                                <div className="w-px h-8 bg-[#ff4747]/20"></div>
                                <div className="text-center">
                                    <p className="text-[10px] text-[#ff4747] uppercase font-bold">Time</p>
                                    <p className="text-xl font-bold text-white">00:02</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-5 hover:bg-slate-800/50 transition-colors">
                                <div className="size-10 rounded-lg bg-[#f97316]/20 flex items-center justify-center mb-4">
                                    <span className="material-symbols-outlined text-[#f97316]">vertical_align_bottom</span>
                                </div>
                                <h3 className="text-white font-bold mb-2">Drive Knees Out</h3>
                                <p className="text-sm text-slate-400 leading-relaxed">Focus on pushing your knees toward your pinky toes during the descent.</p>
                            </div>
                            <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-5 hover:bg-slate-800/50 transition-colors">
                                <div className="size-10 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                                    <span className="material-symbols-outlined text-primary">fitness_center</span>
                                </div>
                                <h3 className="text-white font-bold mb-2">Engage Glutes</h3>
                                <p className="text-sm text-slate-400 leading-relaxed">Activate your gluteus medius by imagining you are 'ripping the floor apart' with your feet.</p>
                            </div>
                            <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-5 hover:bg-slate-800/50 transition-colors">
                                <div className="size-10 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4">
                                    <span className="material-symbols-outlined text-blue-400">straighten</span>
                                </div>
                                <h3 className="text-white font-bold mb-2">Check Stance</h3>
                                <p className="text-sm text-slate-400 leading-relaxed">Try widening your stance by 2 inches and slightly flare your toes outward (15-30°).</p>
                            </div>
                        </div>

                        <div className="mt-10 pt-8 border-t border-slate-800 flex flex-wrap gap-4">
                            <button className="bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-bold py-3 px-8 rounded-lg flex items-center gap-2 transition-all">
                                <span className="material-symbols-outlined">restart_alt</span>
                                Re-run Analysis
                            </button>
                            <button className="bg-slate-900 border border-slate-700 hover:bg-slate-800 text-white font-bold py-3 px-8 rounded-lg flex items-center gap-2 transition-all">
                                <span className="material-symbols-outlined">share</span>
                                Export Clip
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20 animate-stagger-replay opacity-0">
                        <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-slate-100 font-bold flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">monitoring</span>
                                    Biometric Stability
                                </h3>
                                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest bg-slate-800 px-2 py-1 rounded">Joint Angle Variance</span>
                            </div>
                            <div className="h-40 w-full bg-slate-800/30 border border-slate-700/50 rounded-lg relative overflow-hidden flex items-end px-3 gap-2 pb-0 pt-4">
                                <div className="flex-1 bg-primary/30 hover:bg-primary/50 transition-colors h-[60%] rounded-t-sm"></div>
                                <div className="flex-1 bg-primary/30 hover:bg-primary/50 transition-colors h-[65%] rounded-t-sm"></div>
                                <div className="flex-1 bg-[#ff4747]/80 h-[30%] rounded-t-sm shadow-[0_0_10px_rgba(255,71,71,0.5)] z-10"></div>
                                <div className="flex-1 bg-[#ff4747]/80 h-[25%] rounded-t-sm shadow-[0_0_10px_rgba(255,71,71,0.5)] z-10"></div>
                                <div className="flex-1 bg-primary/30 hover:bg-primary/50 transition-colors h-[55%] rounded-t-sm"></div>
                                <div className="flex-1 bg-primary/30 hover:bg-primary/50 transition-colors h-[70%] rounded-t-sm"></div>
                                <div className="flex-1 bg-primary/30 hover:bg-primary/50 transition-colors h-[80%] rounded-t-sm"></div>
                            </div>
                        </div>
                        <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6">
                            <h3 className="text-slate-100 font-bold mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">history_edu</span>
                                Trainer Notes
                            </h3>
                            <div className="space-y-4">
                                <div className="flex gap-3">
                                    <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-primary text-sm">smart_toy</span>
                                    </div>
                                    <p className="text-sm text-slate-400">This issue has occurred in 3 out of your last 5 squat sessions. Consider adding 'Tibialis Raises' to your warm-up.</p>
                                </div>
                                <div className="flex gap-3">
                                    <div className="size-8 rounded-full bg-slate-700 flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-slate-400 text-sm">person</span>
                                    </div>
                                    <p className="text-sm text-slate-400">"Watch your depth, you're cutting it slightly short to compensate for the knee instability." — Coach Mike</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
