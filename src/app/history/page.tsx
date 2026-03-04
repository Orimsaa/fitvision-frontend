"use client";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import React, { useEffect, useState } from "react";
import anime from "animejs";
import { useLanguage } from "@/context/LanguageContext";

export default function HistoryPage() {
    const { t } = useLanguage();
    const [history, setHistory] = useState<any[]>([]);
    const [isHeatmapMenuOpen, setIsHeatmapMenuOpen] = useState(false);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('fitvision_history') || '[]');
        setHistory(stored);

        anime({
            targets: '.animate-stagger-history',
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 800,
            easing: 'easeOutExpo',
            delay: anime.stagger(100, { start: 100 })
        });
    }, []);
    return (
        <>
            <DashboardLayout>
                <div className="max-w-[1200px] mx-auto p-6 md:p-10 flex flex-col gap-8 pb-20">
                    {/* Premium Header Section */}
                    <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-2 animate-stagger-history opacity-0">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary text-4xl md:text-5xl drop-shadow-[0_0_12px_rgba(57,255,20,0.4)]">history</span>
                                {t.history.title}
                            </h1>
                            <p className="text-slate-400 font-medium flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary/80 text-sm">insights</span>
                                {t.history.subtitle}
                            </p>
                        </div>

                        {/* Filter Pills */}
                        <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                            <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-black font-semibold hover:bg-primary/90 transition-colors shrink-0">
                                <span className="material-symbols-outlined text-[20px]">tune</span>
                                <span>{t.history.filters.all}</span>
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-dark border border-white/10 text-white hover:border-primary/50 transition-colors shrink-0">
                                <span>Deadlift</span>
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-dark border border-white/10 text-white hover:border-primary/50 transition-colors shrink-0">
                                <span>Squat</span>
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-dark border border-white/10 text-white hover:border-primary/50 transition-colors shrink-0">
                                <span>Bench Press</span>
                            </button>
                        </div>
                    </header>

                    {/* Top Grid: Chart & Key Stats */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Large Chart Card */}
                        <div className="lg:col-span-3 bg-surface-dark rounded-2xl p-6 md:p-8 border border-white/5 relative overflow-hidden group animate-stagger-history opacity-0">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none"></div>

                            <div className="flex justify-between items-start mb-8 relative z-10">
                                <div>
                                    <h2 className="text-xl font-semibold text-white mb-1">{t.history.chart.title}</h2>
                                    <p className="text-slate-400 text-sm">{t.history.chart.subtitle}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold text-white flex items-center justify-end gap-2">
                                        92%
                                        <span className="text-primary text-sm font-medium bg-primary/10 px-2 py-1 rounded-md flex items-center">
                                            <span className="material-symbols-outlined text-[16px] mr-1">trending_up</span>
                                            +12%
                                        </span>
                                    </div>
                                    <p className="text-primary text-sm font-medium mt-1">{t.history.chart.progress}</p>
                                </div>
                            </div>

                            {/* Custom SVG Chart */}
                            <div className="w-full h-[240px] relative z-10">
                                <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 1000 240">
                                    {/* Gradient Defs */}
                                    <defs>
                                        <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                                            <stop offset="0%" stopColor="#39FF14" stopOpacity="0.2"></stop>
                                            <stop offset="100%" stopColor="#39FF14" stopOpacity="0"></stop>
                                        </linearGradient>
                                    </defs>

                                    {/* Grid Lines */}
                                    <line stroke="#333" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="1000" y1="200" y2="200"></line>
                                    <line stroke="#333" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="1000" y1="100" y2="100"></line>
                                    <line stroke="#333" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="1000" y1="0" y2="0"></line>

                                    {/* The Area Fill */}
                                    <path
                                        d="M0,180 C100,180 150,120 250,130 C350,140 400,80 500,60 C600,40 650,90 750,70 C850,50 900,20 1000,10 V240 H0 Z"
                                        fill="url(#chartGradient)"
                                    ></path>

                                    {/* The Line */}
                                    <path
                                        className="drop-shadow-[0_0_10px_rgba(57,255,20,0.5)]"
                                        d="M0,180 C100,180 150,120 250,130 C350,140 400,80 500,60 C600,40 650,90 750,70 C850,50 900,20 1000,10"
                                        fill="none"
                                        stroke="#39FF14"
                                        strokeLinecap="round"
                                        strokeWidth="3"
                                        vectorEffect="non-scaling-stroke"
                                    ></path>

                                    {/* Data Points */}
                                    <circle cx="250" cy="130" fill="#121212" r="4" stroke="#39FF14" strokeWidth="2"></circle>
                                    <circle cx="500" cy="60" fill="#121212" r="4" stroke="#39FF14" strokeWidth="2"></circle>
                                    <circle cx="750" cy="70" fill="#121212" r="4" stroke="#39FF14" strokeWidth="2"></circle>
                                    <circle className="animate-pulse" cx="1000" cy="10" fill="#39FF14" r="6"></circle>
                                </svg>
                            </div>

                            {/* X Axis Labels */}
                            <div className="flex justify-between mt-4 text-xs font-medium text-slate-500 uppercase tracking-wider">
                                <span>Week 1</span>
                                <span>Week 2</span>
                                <span>Week 3</span>
                                <span>Week 4</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column: Heatmap */}
                        <div className="lg:col-span-1 flex flex-col gap-6 animate-stagger-history opacity-0">
                            <div className="bg-surface-dark rounded-2xl p-6 border border-white/5 h-full">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-bold text-white">{t.history.heatmap.title}</h3>
                                    <div className="relative">
                                        <button
                                            onClick={() => setIsHeatmapMenuOpen(!isHeatmapMenuOpen)}
                                            className="text-slate-400 hover:text-white transition-colors flex items-center justify-center size-8 rounded-full hover:bg-white/5"
                                        >
                                            <span className="material-symbols-outlined">more_horiz</span>
                                        </button>

                                        {isHeatmapMenuOpen && (
                                            <>
                                                {/* Backdrop to close menu when clicking outside */}
                                                <div
                                                    className="fixed inset-0 z-40"
                                                    onClick={() => setIsHeatmapMenuOpen(false)}
                                                ></div>

                                                {/* Dropdown Menu */}
                                                <div className="absolute right-0 top-full mt-2 w-48 bg-surface-darker border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden py-1 animate-fade-in-up">
                                                    <button
                                                        onClick={() => setIsHeatmapMenuOpen(false)}
                                                        className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-3"
                                                    >
                                                        <span className="material-symbols-outlined text-[18px]">calendar_month</span> {t.history.heatmap.viewYear}
                                                    </button>
                                                    <button
                                                        onClick={() => setIsHeatmapMenuOpen(false)}
                                                        className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-3 border-t border-white/5 mt-1 pt-3"
                                                    >
                                                        <span className="material-symbols-outlined text-[18px]">download</span> {t.history.heatmap.exportData}
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Heatmap Grid */}
                                <div className="flex flex-col w-full overflow-hidden mt-2">
                                    <div className="flex justify-between text-[10px] text-slate-500 font-medium mb-2 pl-8 pr-2">
                                        <span>Jan</span>
                                        <span>Feb</span>
                                        <span>Mar</span>
                                    </div>
                                    <div className="flex items-start gap-2 w-full">
                                        <div className="flex flex-col justify-between text-[10px] text-slate-500 font-medium h-max gap-[13px] pt-1 sm:pt-1.5 sm:gap-[15px]">
                                            <span>Mon</span>
                                            <span>Wed</span>
                                            <span>Fri</span>
                                            <span>Sun</span>
                                        </div>
                                        <div className="grid grid-rows-7 grid-flow-col gap-1.5 flex-1 overflow-x-auto scrollbar-hide pb-2">
                                            {[...Array(84)].map((_, i) => {
                                                const rand = Math.random();
                                                // Make earlier dates have less activity on average
                                                const activeLevel = rand + (i / 84) * 0.5;
                                                const weight =
                                                    activeLevel > 1.2
                                                        ? "bg-primary shadow-[0_0_8px_rgba(57,255,20,0.4)]"
                                                        : activeLevel > 0.9
                                                            ? "bg-primary/80"
                                                            : activeLevel > 0.6
                                                                ? "bg-primary/40"
                                                                : "bg-surface-darker border border-white/5";
                                                return <div key={i} className={`rounded-[2px] w-3 h-3 sm:w-4 sm:h-4 shrink-0 transition-colors hover:border hover:border-white ${weight}`}></div>;
                                            })}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 mt-2 justify-end text-xs text-slate-500">
                                        <span>Less</span>
                                        <div className="flex gap-1">
                                            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-sm bg-surface-darker border border-white/5"></div>
                                            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-sm bg-primary/40"></div>
                                            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-sm bg-primary/80"></div>
                                            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-sm bg-primary shadow-[0_0_5px_rgba(57,255,20,0.3)]"></div>
                                        </div>
                                        <span>More</span>
                                    </div>
                                </div>

                                {/* Mini Stats below heatmap */}
                                <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/5">
                                    <div>
                                        <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">{t.history.heatmap.streak}</p>
                                        <p className="text-white text-xl font-bold flex items-center gap-1">
                                            <span className="material-symbols-outlined text-orange-500 text-lg">local_fire_department</span>
                                            12 {t.history.heatmap.days}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">{t.history.heatmap.totalWorkouts}</p>
                                        <p className="text-white text-xl font-bold">148</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Past Sessions List */}
                        <div className="lg:col-span-2">
                            <div className="flex flex-col gap-4">
                                <h3 className="text-xl font-bold text-white mb-2">{t.history.pastSessions.title}</h3>

                                {history.length === 0 ? (
                                    <div className="text-slate-400 p-4 border border-white/5 rounded-xl text-center">{t.history.pastSessions.empty}</div>
                                ) : history.slice(0, 10).map((session, i) => (
                                    <Link href={`/history/detail`} key={session.id || i} className="animate-stagger-history opacity-0 group flex flex-col sm:flex-row items-center gap-4 bg-surface-dark hover:bg-surface-dark-hover border border-white/5 hover:border-primary/30 p-4 rounded-xl transition-all cursor-pointer flex-shrink-0">
                                        <div className="relative w-full sm:w-20 h-20 sm:h-20 shrink-0 rounded-lg overflow-hidden bg-black flex items-center justify-center border border-white/5">
                                            <span className="material-symbols-outlined text-4xl text-slate-500 group-hover:text-primary transition-all">fitness_center</span>
                                        </div>
                                        <div className="flex flex-col flex-1 w-full text-center sm:text-left">
                                            <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start mb-1">
                                                <h4 className="text-lg font-bold text-white group-hover:text-primary transition-colors capitalize">
                                                    {session.exercise}
                                                </h4>
                                                <span className="text-xs text-slate-400 bg-white/5 px-2 py-1 rounded">
                                                    {new Date(session.timestamp).toLocaleDateString()} {new Date(session.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <div className="flex justify-center sm:justify-start gap-4 text-sm text-slate-400 mt-1">
                                                {session.errorCount === 0 ? (
                                                    <span className="text-primary font-medium text-xs">{t.history.pastSessions.perfectForm}</span>
                                                ) : (
                                                    <span className="text-orange-400 font-medium text-xs">{session.errorCount} {t.history.pastSessions.mistakes}</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-center justify-center pl-0 sm:pl-4 border-l-0 sm:border-l border-white/10 w-full sm:w-auto">
                                            <span className="text-xs text-slate-400 uppercase tracking-wider mb-1">{t.history.pastSessions.accuracy}</span>
                                            <span className={`text-2xl font-bold ${session.avgScore > 90 ? 'text-primary drop-shadow-[0_0_5px_rgba(57,255,20,0.5)]' : 'text-white'}`}>{session.avgScore}%</span>
                                        </div>
                                    </Link>
                                ))}

                            </div>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        </>
    );
}
