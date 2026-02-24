import Link from "next/link";
import React, from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative flex min-h-screen w-full flex-col">
            <div className="layout-container flex h-full grow flex-col md:flex-row">
                {/* Main Content Area */}
                <main className="flex-1 md:ml-64 pb-24 md:pb-0">
                    {/* Mobile Header */}
                    <header className="md:hidden flex items-center justify-between px-5 py-4 bg-background-dark/80 backdrop-blur-md sticky top-0 z-40 border-b border-white/5">
                        <div className="flex items-center gap-2 text-primary">
                            <svg className="size-6" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    clipRule="evenodd"
                                    d="M47.2426 24L24 47.2426L0.757355 24L24 0.757355L47.2426 24ZM12.2426 21H35.7574L24 9.24264L12.2426 21Z"
                                    fill="currentColor"
                                    fillRule="evenodd"
                                ></path>
                            </svg>
                            <h2 className="text-white text-lg font-bold">FitVision</h2>
                        </div>
                        <div
                            className="bg-center bg-no-repeat bg-cover rounded-full size-9 ring-2 ring-primary"
                            style={{
                                backgroundImage:
                                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA27nj0lO-CFiCbHV5WY7JdyYn0KZLxAcFyJfVlyHj0s8t2zkyMdrnJdKOFlpT3OeeTkIaYinssvIiwQVZd-PEonFIwPa0-_FQUoPGOdgmCFFxMPIPpveKaTcSIyqLZWjySB7ZZu58OHONYt9rfPco2VI4-bPPW5TsvxabFyx6CrLU-w9Aur278J-pkfDic-F8A-M_pTy88Hs1oo_SyobbHM0vf6Y9bWuieMdksrqbjtj4dqH1_j_Y_XnEUItFA9x07ONGY8FTeK-H6")',
                            }}
                        ></div>
                    </header>

                    {/* Desktop Header */}
                    <header className="hidden md:flex items-center justify-between px-10 py-8">
                        <div>
                            <h1 className="text-3xl font-bold text-white">Hello, Athlete</h1>
                            <p className="text-slate-400 mt-1">Ready to perfect your form today?</p>
                        </div>
                        <button className="flex items-center justify-center size-10 rounded-full bg-surface-dark border border-white/10 hover:border-primary/50 text-white transition-all relative group">
                            <span className="material-symbols-outlined">notifications</span>
                            <span className="absolute top-2 right-2.5 size-2 bg-primary rounded-full"></span>
                        </button>
                    </header>

                    {children}
                </main>
            </div>
        </div>
    );
}
