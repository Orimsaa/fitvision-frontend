import DashboardLayout from "@/components/DashboardLayout";
import React from "react";

export default function HistoryPage() {
    return (
        <>
            <DashboardLayout>
                <div className="max-w-[1200px] mx-auto p-6 md:p-10 flex flex-col gap-8 pb-20">
                    {/* Header Section */}
                    <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Workout History</h1>
                            <p className="text-slate-400 text-lg">Track your form accuracy and consistency over time.</p>
                        </div>

                        {/* Filter Pills */}
                        <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                            <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-black font-semibold hover:bg-primary/90 transition-colors shrink-0">
                                <span className="material-symbols-outlined text-[20px]">tune</span>
                                <span>All Exercises</span>
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-dark border border-white/10 text-white hover:border-primary/50 transition-colors shrink-0">
                                <span>Deadlift</span>
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-dark border border-white/10 text-white hover:border-primary/50 transition-colors shrink-0">
                                <span>Squat</span>
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-dark border border-white/10 text-white hover:border-primary/50 transition-colors shrink-0">
                                <span>Barbell Row</span>
                            </button>
                        </div>
                    </header>

                    {/* Top Grid: Chart & Key Stats */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Large Chart Card */}
                        <div className="lg:col-span-3 bg-surface-dark rounded-2xl p-6 md:p-8 border border-white/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none"></div>

                            <div className="flex justify-between items-start mb-8 relative z-10">
                                <div>
                                    <h2 className="text-xl font-semibold text-white mb-1">Form Accuracy Trend</h2>
                                    <p className="text-slate-400 text-sm">Last 30 Days</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold text-white flex items-center justify-end gap-2">
                                        92%
                                        <span className="text-primary text-sm font-medium bg-primary/10 px-2 py-1 rounded-md flex items-center">
                                            <span className="material-symbols-outlined text-[16px] mr-1">trending_up</span>
                                            +12%
                                        </span>
                                    </div>
                                    <p className="text-primary text-sm font-medium mt-1">Excellent Progress</p>
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
                        <div className="lg:col-span-1 flex flex-col gap-6">
                            <div className="bg-surface-dark rounded-2xl p-6 border border-white/5 h-full">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-bold text-white">Activity Heatmap</h3>
                                    <button className="text-slate-400 hover:text-white transition-colors">
                                        <span className="material-symbols-outlined">more_horiz</span>
                                    </button>
                                </div>

                                {/* Heatmap Grid */}
                                <div className="flex flex-col gap-2">
                                    <div className="flex justify-between text-xs text-slate-500 mb-2">
                                        <span>Mon</span>
                                        <span>Wed</span>
                                        <span>Fri</span>
                                        <span>Sun</span>
                                    </div>
                                    <div className="grid grid-rows-7 grid-flow-col gap-1.5 h-[180px]">
                                        {/* Dummy Heatmap data generated via code */}
                                        {[...Array(28)].map((_, i) => {
                                            const rand = Math.random();
                                            const weight =
                                                rand > 0.8
                                                    ? "bg-primary shadow-[0_0_8px_rgba(57,255,20,0.4)]"
                                                    : rand > 0.6
                                                        ? "bg-primary/80"
                                                        : rand > 0.4
                                                            ? "bg-primary/60"
                                                            : "bg-white/5";
                                            return <div key={i} className={`rounded-sm aspect-square ${weight}`}></div>;
                                        })}
                                    </div>

                                    <div className="flex items-center gap-2 mt-4 justify-end text-xs text-slate-500">
                                        <span>Less</span>
                                        <div className="flex gap-1">
                                            <div className="w-3 h-3 rounded-sm bg-white/5"></div>
                                            <div className="w-3 h-3 rounded-sm bg-primary/20"></div>
                                            <div className="w-3 h-3 rounded-sm bg-primary/60"></div>
                                            <div className="w-3 h-3 rounded-sm bg-primary"></div>
                                        </div>
                                        <span>More</span>
                                    </div>
                                </div>

                                {/* Mini Stats below heatmap */}
                                <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/5">
                                    <div>
                                        <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Current Streak</p>
                                        <p className="text-white text-xl font-bold flex items-center gap-1">
                                            <span className="material-symbols-outlined text-orange-500 text-lg">local_fire_department</span>
                                            12 Days
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Total Workouts</p>
                                        <p className="text-white text-xl font-bold">148</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Past Sessions List */}
                        <div className="lg:col-span-2">
                            <div className="flex flex-col gap-4">
                                <h3 className="text-xl font-bold text-white mb-2">Past Sessions</h3>

                                {/* Session Card 1 */}
                                <div className="group flex flex-col sm:flex-row items-center gap-4 bg-surface-dark hover:bg-surface-dark-hover border border-white/5 hover:border-primary/30 p-4 rounded-xl transition-all cursor-pointer">
                                    <div className="relative w-full sm:w-32 h-32 sm:h-20 shrink-0 rounded-lg overflow-hidden bg-black">
                                        <img
                                            alt="Person lifting weights in dark gym"
                                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrN_TNR7CAvi6u2qWTzBsL1aKt9HQxnjiKMeR_aCzXPnA5kyJBAr1sP3zG0uQGG04trFmb0LJ9WKxJzgBm-hjAwmZ26XnVsxiMOi10tUHyVTBnPFOvZX_axfJpoq8rvf8YMbHsKp3ck9ujg0rt32l_YTmDjGdkeh7Ei2GcGSy2aceNuoGAYnC4dxUyGbXxfRiIdwIinPcGiZEdJF8Mm06Gtxc9slt4nViv7x1PU2KQ3zkEtY25bcxaNTvJyKqTbLtIPChfbyJ2Ng"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-transparent transition-colors">
                                            <span className="material-symbols-outlined text-white opacity-80 group-hover:text-primary group-hover:scale-110 transition-all">
                                                play_circle
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col flex-1 w-full text-center sm:text-left">
                                        <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start mb-1">
                                            <h4 className="text-lg font-bold text-white group-hover:text-primary transition-colors">
                                                Heavy Deadlift Session
                                            </h4>
                                            <span className="text-xs text-slate-400 bg-white/5 px-2 py-1 rounded">Today, 08:30 AM</span>
                                        </div>
                                        <div className="flex justify-center sm:justify-start gap-4 text-sm text-slate-400">
                                            <span className="flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[16px]">fitness_center</span> 5 Sets
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[16px]">timer</span> 45 min
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center justify-center pl-0 sm:pl-4 border-l-0 sm:border-l border-white/10 w-full sm:w-auto">
                                        <span className="text-xs text-slate-400 uppercase tracking-wider mb-1">Accuracy</span>
                                        <span className="text-2xl font-bold text-primary drop-shadow-[0_0_5px_rgba(57,255,20,0.5)]">94%</span>
                                    </div>
                                </div>

                                {/* Session Card 2 */}
                                <div className="group flex flex-col sm:flex-row items-center gap-4 bg-surface-dark hover:bg-surface-dark-hover border border-white/5 hover:border-primary/30 p-4 rounded-xl transition-all cursor-pointer">
                                    <div className="relative w-full sm:w-32 h-32 sm:h-20 shrink-0 rounded-lg overflow-hidden bg-black">
                                        <img
                                            alt="Man doing squats in gym"
                                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSPGhF6FdF9bU_LRCvoWAyktliyijADwekce0CfAncyducIDikZjxGF5094eW6FMdcAkRM3Zyt863v8ORD01e3_7h_84JVt3r5UabJF2NLrRPqC10XiMFMlLkgeEAMD1IFcBcriuhDbJCIvUuXxjIGLfO88IOv5nQdgr0lcdyCUwBDnSKN4Ce7YRByxTu9pqqCjvb0sIDjbQ5qQouFGeMSARXkws4p3sASsaHpSyW6vmt_-l-Ud4lp9piwPfV-20XYO62ZfRJM6Q"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-transparent transition-colors">
                                            <span className="material-symbols-outlined text-white opacity-80 group-hover:text-primary group-hover:scale-110 transition-all">
                                                play_circle
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col flex-1 w-full text-center sm:text-left">
                                        <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start mb-1">
                                            <h4 className="text-lg font-bold text-white group-hover:text-primary transition-colors">Squat Form Check</h4>
                                            <span className="text-xs text-slate-400 bg-white/5 px-2 py-1 rounded">Yesterday, 06:15 PM</span>
                                        </div>
                                        <div className="flex justify-center sm:justify-start gap-4 text-sm text-slate-400">
                                            <span className="flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[16px]">fitness_center</span> 4 Sets
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[16px]">timer</span> 35 min
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center justify-center pl-0 sm:pl-4 border-l-0 sm:border-l border-white/10 w-full sm:w-auto">
                                        <span className="text-xs text-slate-400 uppercase tracking-wider mb-1">Accuracy</span>
                                        <span className="text-2xl font-bold text-white">88%</span>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        </>
    );
}
