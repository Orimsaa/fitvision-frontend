"use client";

import Link from "next/link";
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";

export default function Home() {
  const [exercise, setExercise] = useState<"Squat" | "Deadlift">("Squat");

  return (
    <>
      <DashboardLayout>
        <div className="px-5 md:px-10 max-w-7xl mx-auto">
          {/* Mobile Greeting (Only visible on small screens) */}
          <div className="md:hidden mb-6 mt-2">
            <h1 className="text-2xl font-bold text-white">Hello, Athlete</h1>
            <p className="text-slate-400 text-sm">Let&apos;s crush today&apos;s workout.</p>
          </div>

          {/* Exercise Selection Overlay Config */}
          <div className="mb-6 flex gap-3 p-1 rounded-full bg-surface-dark w-fit border border-white/5">
            <button
              onClick={() => setExercise("Squat")}
              className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${exercise === "Squat" ? "bg-primary text-black" : "text-white hover:bg-white/5"
                }`}
            >
              Squat
            </button>
            <button
              onClick={() => setExercise("Deadlift")}
              className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${exercise === "Deadlift" ? "bg-primary text-black" : "text-white hover:bg-white/5"
                }`}
            >
              Deadlift
            </button>
          </div>

          {/* Main Action Card */}
          <div className="relative w-full rounded-2xl overflow-hidden bg-surface-dark border border-primary/30 shadow-neon group transition-all mb-8">
            {/* Background Image with Overlay */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-50 transition-opacity duration-500"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCWzqhMgfWHzfU1BEUX-bmaWXHFBmGVPWj0en9b9hNvpcamGQLiTugenZZiYYnCenK0H0X-AN6c9hNh5bILpRn1SlBsh0jQhnPpfexFP2Vk0VlAqPsoJLo4_jG0aSy5XYhGKhKjaK0T8MmPH1q-kNDBHiblnv_mER0QuOn7CR3F83yiZzAyVodoKdZQZi0ho5E8bYObGEODIHHYccobvxYoRvefWeOQeDA2ZJj0ZmB5yQgPn-1wt-cORYKwycDN95RxWM_ADzx7XFpT')",
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-r from-background-dark via-background-dark/80 to-transparent"></div>

            <div className="relative z-10 p-6 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-4 border border-primary/30">
                  <span className="material-symbols-outlined text-[16px]">bolt</span>
                  AI Powered ({exercise} selected)
                </div>
                <h2 className="text-2xl md:text-4xl font-bold text-white mb-2 leading-tight">
                  Start AI Form Analysis
                </h2>
                <p className="text-slate-300 md:text-lg mb-6">
                  Analyze your workout form in real-time with our advanced computer vision technology. Get instant feedback on your posture.
                </p>

                <div className="flex flex-wrap gap-3">
                  <Link
                    href={`/camera?model=${exercise.toLowerCase()}`}
                    className="bg-primary hover:bg-primary/90 text-background-dark font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined">videocam</span>
                    Launch Camera
                  </Link>
                  <button className="bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-6 rounded-xl backdrop-blur-sm transition-colors border border-white/10">
                    View Tutorial
                  </button>
                </div>
              </div>

              {/* Visual Graphic for Desktop */}
              <div className="hidden md:flex relative size-32 items-center justify-center shrink-0">
                <div className="absolute inset-0 border-4 border-dashed border-primary/30 rounded-full animate-[spin_10s_linear_infinite]"></div>
                <div className="absolute inset-0 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                <span className="material-symbols-outlined text-6xl text-primary drop-shadow-[0_0_10px_rgba(57,255,20,0.8)]">
                  analytics
                </span>
              </div>
            </div>
          </div>

          {/* Stats & Recent Scans Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Weekly Stats */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              <div className="bg-surface-dark border border-white/5 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white">Form Accuracy</h3>
                  <span className="text-primary text-sm font-mono bg-primary/10 px-2 py-1 rounded">+2.4%</span>
                </div>
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-4xl font-bold text-white">87%</span>
                  <span className="text-slate-400 mb-1">avg. score</span>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full w-[87%] rounded-full shadow-[0_0_10px_rgba(57,255,20,0.5)]"></div>
                </div>
                <p className="text-xs text-slate-500 mt-3">Based on last 12 sessions</p>
              </div>

              <div className="bg-gradient-to-br from-surface-dark to-surface-darker border border-white/5 rounded-2xl p-6 relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-lg font-bold text-white mb-2">Pro Tip</h3>
                  <p className="text-slate-300 text-sm mb-4">
                    Your squat depth has improved, but watch your knee alignment on the ascent.
                  </p>
                  <Link href="/history" className="text-primary text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
                    See details <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </Link>
                </div>
                <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-9xl text-white/5 rotate-[-15deg]">
                  lightbulb
                </span>
              </div>
            </div>

            {/* Right Column: Recent Scans List */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Recent Scans</h3>
                <Link href="/history" className="text-sm text-slate-400 hover:text-white transition-colors">
                  View all
                </Link>
              </div>

              <div className="flex flex-col gap-3">
                {/* Card 1 */}
                <div className="group flex items-center justify-between p-4 bg-surface-dark hover:bg-white/5 border border-white/5 hover:border-primary/30 rounded-xl transition-all cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-lg bg-surface-darker flex items-center justify-center border border-white/10 group-hover:border-primary/50 text-white group-hover:text-primary transition-colors">
                      <span className="material-symbols-outlined">fitness_center</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-white group-hover:text-primary transition-colors">Deadlift</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-slate-400">Today, 09:41 AM</span>
                        <span className="size-1 rounded-full bg-slate-600"></span>
                        <span className="text-xs text-green-400">Low Injury Risk</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-mono text-lg font-bold text-white">94%</span>
                    <span className="text-xs text-slate-500">accuracy</span>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="group flex items-center justify-between p-4 bg-surface-dark hover:bg-white/5 border border-white/5 hover:border-primary/30 rounded-xl transition-all cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-lg bg-surface-darker flex items-center justify-center border border-white/10 group-hover:border-primary/50 text-white group-hover:text-primary transition-colors">
                      <span className="material-symbols-outlined">accessibility_new</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-white group-hover:text-primary transition-colors">Back Squat</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-slate-400">Yesterday, 4:20 PM</span>
                        <span className="size-1 rounded-full bg-slate-600"></span>
                        <span className="text-xs text-primary">PB Depth</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-mono text-lg font-bold text-white">92%</span>
                    <span className="text-xs text-slate-500">accuracy</span>
                  </div>
                </div>

                {/* Card 3 */}
                <div className="group flex items-center justify-between p-4 bg-surface-dark hover:bg-white/5 border border-white/5 hover:border-primary/30 rounded-xl transition-all cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-lg bg-surface-darker flex items-center justify-center border border-white/10 group-hover:border-primary/50 text-white group-hover:text-primary transition-colors">
                      <span className="material-symbols-outlined">sports_gymnastics</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-white group-hover:text-primary transition-colors">Overhead Press</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-slate-400">Oct 24, 6:00 PM</span>
                        <span className="size-1 rounded-full bg-slate-600"></span>
                        <span className="text-xs text-orange-400">Spine Arch Detected</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-mono text-lg font-bold text-white">78%</span>
                    <span className="text-xs text-slate-500">accuracy</span>
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
