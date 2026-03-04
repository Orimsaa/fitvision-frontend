"use client";
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import anime from "animejs";
import DashboardLayout from "@/components/DashboardLayout";
import { useLanguage } from "@/context/LanguageContext";

interface ErrorRecord {
    url: string;
    title: string;
    detail: string;
    time: string;
}

export default function SummaryPage() {
    const { t } = useLanguage();
    const [errors, setErrors] = useState<ErrorRecord[]>([]);
    const [stats, setStats] = useState<any>(null);

    // Refs for animated numbers
    const accuracyRef = useRef<HTMLParagraphElement>(null);
    const mistakesRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        // Retrieve stored errors and stats from sessionStorage
        const storedErrors = JSON.parse(sessionStorage.getItem('fitvision_errors') || '[]');
        const storedStatsString = sessionStorage.getItem('fitvision_session_stats');
        let currentStats = null;

        if (storedStatsString) {
            currentStats = JSON.parse(storedStatsString);
            setStats(currentStats);
        }
        setErrors(storedErrors);

        // Save to global history (localStorage)
        if (currentStats && currentStats.id) {
            const history = JSON.parse(localStorage.getItem('fitvision_history') || '[]');
            // Prevent duplicate saving
            if (!history.find((h: any) => h.id === currentStats.id)) {
                // Prepend to top
                localStorage.setItem('fitvision_history', JSON.stringify([currentStats, ...history]));
            }
        }

        // Staggered Entrance Animations with Anime.js
        anime({
            targets: '.animate-stagger-summary',
            opacity: [0, 1],
            translateY: [30, 0],
            duration: 800,
            easing: 'easeOutExpo',
            delay: anime.stagger(150, { start: 100 })
        });

        // Animated Number Counters
        const finalAccuracy = currentStats ? Math.round(currentStats.avgScore) : 100;
        const finalMistakes = storedErrors.length;

        const counters = {
            accuracy: 0,
            mistakes: 0
        };

        anime({
            targets: counters,
            accuracy: finalAccuracy,
            mistakes: finalMistakes,
            round: 1, // Increment as integers
            easing: 'easeOutExpo',
            duration: 2500, // 2.5 seconds
            delay: 400, // Start after staggered entry begins
            update: function () {
                if (accuracyRef.current) {
                    accuracyRef.current.innerHTML = `${counters.accuracy}%`;
                }
                if (mistakesRef.current) {
                    mistakesRef.current.innerHTML = `${counters.mistakes}`;
                }
            }
        });

    }, []);

    return (
        <DashboardLayout>
            <div className="flex flex-col min-h-screen">
                <div className="max-w-4xl mx-auto w-full p-6 md:p-8 flex flex-col gap-10">
                    <div className="text-center flex flex-col items-center gap-4 animate-stagger-summary opacity-0">
                        <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center mb-2">
                            <span className="material-symbols-outlined text-primary text-5xl font-bold">check_circle</span>
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-slate-100 flex flex-col items-center gap-2">
                            <span>{t.summary.title}</span>
                            {stats && <span className="text-xl md:text-2xl text-primary font-medium tracking-normal mt-1 capitalize">{stats.exercise}</span>}
                        </h1>
                        <p className="text-slate-400 max-w-md mx-auto">
                            {t.summary.subtitle}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                        <div className="bg-black/40 rounded-2xl p-8 border border-white/10 flex flex-col items-center text-center shadow-lg animate-stagger-summary opacity-0">
                            <span className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-2">{t.summary.formAccuracy}</span>
                            <p ref={accuracyRef} className="text-5xl font-bold text-primary">0%</p>
                        </div>
                        <div className="bg-black/40 rounded-2xl p-8 border border-white/10 flex flex-col items-center text-center shadow-lg animate-stagger-summary opacity-0">
                            <span className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-2">{t.summary.capturedMistakes}</span>
                            <p ref={mistakesRef} className="text-5xl font-bold text-red-400">0</p>
                        </div>
                        <div className="bg-black/40 rounded-2xl p-8 border border-white/10 flex flex-col items-center text-center shadow-lg md:col-span-2 animate-stagger-summary opacity-0">
                            <span className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-2">{t.summary.overallRisk}</span>
                            <p className={`text-3xl lg:text-5xl font-bold ${errors.length > 3 ? 'text-red-500' : errors.length > 0 ? 'text-orange-400' : 'text-primary'}`}>
                                {errors.length > 3 ? t.summary.riskLevels.high : errors.length > 0 ? t.summary.riskLevels.moderate : t.summary.riskLevels.safe}
                            </p>
                        </div>
                    </div>

                    <section className="flex flex-col gap-6 animate-stagger-summary opacity-0">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                            <h3 className="text-2xl font-bold text-slate-100">{t.summary.errorReplays.title}</h3>
                            <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-bold border border-red-500/30">
                                {errors.length > 0 ? t.summary.errorReplays.reviewRecommended : t.summary.errorReplays.perfectSet}
                            </span>
                        </div>

                        {errors.length === 0 ? (
                            <div className="p-8 bg-black/40 rounded-xl border border-primary/20 flex flex-col items-center text-center">
                                <span className="material-symbols-outlined text-primary text-5xl mb-4">emoji_events</span>
                                <h4 className="text-xl font-bold text-white mb-2">{t.summary.errorReplays.flawlessTitle}</h4>
                                <p className="text-slate-400">{t.summary.errorReplays.flawlessDesc}</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-6">
                                {errors.map((error, idx) => (
                                    <div key={idx} className="flex flex-col md:flex-row bg-black/40 rounded-2xl overflow-hidden border border-white/10 shadow-lg group">
                                        <div className="md:w-1/2 bg-black relative aspect-video flex-shrink-0">
                                            <video
                                                src={error.url}
                                                className="w-full h-full object-cover"
                                                controls
                                                autoPlay
                                                loop
                                                muted
                                                playsInline
                                            />
                                            <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-xs font-bold text-red-400 border border-red-500/30 flex items-center gap-1">
                                                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                                                {t.summary.errorReplays.mistakeClip}
                                            </div>
                                        </div>
                                        <div className="p-5 md:p-6 flex flex-col justify-center gap-3">
                                            <div className="flex items-start justify-between">
                                                <h4 className="text-xl font-bold text-red-400">{error.title}</h4>
                                                <span className="text-xs text-slate-500 bg-black/50 px-2 py-1 rounded">{error.time}</span>
                                            </div>
                                            <p className="text-slate-300 text-sm leading-relaxed border-l-2 border-red-500/50 pl-3">
                                                {error.detail}
                                            </p>
                                            <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
                                                <span className="material-symbols-outlined text-sm">info</span>
                                                {t.summary.errorReplays.clipDesc}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    <div className="flex flex-col sm:flex-row gap-4 pt-6 pb-12 animate-stagger-summary opacity-0">
                        <Link
                            href="/camera"
                            className="flex-1 h-14 bg-primary text-background-dark font-bold text-lg rounded-xl flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all"
                        >
                            <span className="material-symbols-outlined">replay</span>
                            {t.summary.actions.tryAgain}
                        </Link>
                        <Link
                            href="/"
                            className="flex-1 h-14 bg-transparent text-slate-100 border-2 border-primary/20 font-bold text-lg rounded-xl flex items-center justify-center gap-2 hover:bg-primary/5 hover:border-primary/50 active:scale-[0.98] transition-all"
                        >
                            <span className="material-symbols-outlined">home</span>
                            {t.summary.actions.backToDashboard}
                        </Link>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
