"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function Sidebar() {
    const pathname = usePathname();

    if (pathname?.startsWith("/camera")) {
        return null;
    }

    return (
        <>
            {/* Desktop Sidebar */}
            <nav className="hidden md:flex flex-col w-64 border-r border-white/10 bg-surface-darker p-6 justify-between h-screen fixed left-0 top-0 z-50">
                <div className="flex flex-col gap-8">
                    <div className="flex items-center gap-3">
                        <div className="size-8 text-primary">
                            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                <g clipPath="url(#clip0_6_535)">
                                    <path
                                        clipRule="evenodd"
                                        d="M47.2426 24L24 47.2426L0.757355 24L24 0.757355L47.2426 24ZM12.2426 21H35.7574L24 9.24264L12.2426 21Z"
                                        fill="currentColor"
                                        fillRule="evenodd"
                                    ></path>
                                </g>
                                <defs>
                                    <clipPath id="clip0_6_535">
                                        <rect fill="white" height="48" width="48"></rect>
                                    </clipPath>
                                </defs>
                            </svg>
                        </div>
                        <h2 className="text-white text-xl font-bold tracking-tight">FitVision</h2>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Link
                            className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-colors ${pathname === "/" ? "bg-primary/10 text-primary" : "text-slate-400 hover:text-white hover:bg-white/5"
                                }`}
                            href="/"
                        >
                            <span className="material-symbols-outlined">home</span>
                            <span className="font-medium">Home</span>
                        </Link>
                        <Link
                            className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-colors ${pathname?.startsWith("/history") ? "bg-primary/10 text-primary" : "text-slate-400 hover:text-white hover:bg-white/5"
                                }`}
                            href="/history"
                        >
                            <span className="material-symbols-outlined">history</span>
                            <span className="font-medium">History</span>
                        </Link>
                        <Link
                            className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-colors ${pathname?.startsWith("/camera") ? "bg-primary/10 text-primary" : "text-slate-400 hover:text-white hover:bg-white/5"
                                }`}
                            href="/camera"
                        >
                            <span className="material-symbols-outlined">videocam</span>
                            <span className="font-medium">AI Camera</span>
                        </Link>
                        <Link
                            className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-colors ${pathname?.startsWith("/summary") ? "bg-primary/10 text-primary" : "text-slate-400 hover:text-white hover:bg-white/5"
                                }`}
                            href="/summary"
                        >
                            <span className="material-symbols-outlined">analytics</span>
                            <span className="font-medium">Analysis</span>
                        </Link>
                    </div>
                </div>
                <div className="flex items-center gap-3 px-4 py-4 rounded-2xl bg-surface-dark border border-white/5">
                    <div
                        className="bg-center bg-no-repeat bg-cover rounded-full size-10 ring-2 ring-primary/50"
                        style={{
                            backgroundImage:
                                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDXffCakVRarFoNQFrA4K7x22dBozfhsCf4wktXzY1OZGVk5RKCXqRMx3JZRNx5BOv0nhv-CDxFys6quSum4CCeuuY5AE-2K2rF2PG-9ov-2Ki_8to7wSgmJqgIEy6KqiG9FC5kM8TulNc_0SIfhfTmBbtAboV1n7XkUpJOFYw2bz1oA5SR0aQATkET1hR6-eOseSCjj6TcARG9zS_7JyYXM--QkV1y9hlqKvVOGTPt25uOtAn4yeH_dVyi6fcQlIFUqrWg1ZFVVTpt")',
                        }}
                    ></div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-white">Alex Morgan</span>
                        <span className="text-xs text-primary">Pro Member</span>
                    </div>
                </div>
            </nav>

            {/* Mobile Bottom Navigation (Fixed) */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface-dark/95 backdrop-blur-lg border-t border-white/10 flex justify-between items-center px-6 py-3 z-50 pb-safe">
                <Link
                    href="/"
                    className={`flex flex-col items-center gap-1 transition-colors ${pathname === "/" ? "text-primary" : "text-slate-400 hover:text-white"
                        }`}
                >
                    <span className="material-symbols-outlined">home</span>
                    <span className="text-[10px] font-medium">Home</span>
                </Link>
                <Link
                    href="/history"
                    className={`flex flex-col items-center gap-1 transition-colors ${pathname?.startsWith("/history") ? "text-primary" : "text-slate-400 hover:text-white"
                        }`}
                >
                    <span className="material-symbols-outlined">history</span>
                    <span className="text-[10px] font-medium">History</span>
                </Link>
                {/* Center Floating Action Button Style */}
                <div className="relative -top-6">
                    <Link
                        className="flex items-center justify-center size-14 rounded-full bg-primary shadow-neon text-background-dark transform transition-transform active:scale-95"
                        href="/camera"
                    >
                        <span className="material-symbols-outlined text-3xl">videocam</span>
                    </Link>
                </div>
                <Link
                    href="/summary"
                    className={`flex flex-col items-center gap-1 transition-colors ${pathname?.startsWith("/summary") ? "text-primary" : "text-slate-400 hover:text-white"
                        }`}
                >
                    <span className="material-symbols-outlined">analytics</span>
                    <span className="text-[10px] font-medium">Stats</span>
                </Link>
                <button
                    className="flex flex-col items-center gap-1 text-slate-400 hover:text-white transition-colors"
                >
                    <span className="material-symbols-outlined">settings</span>
                    <span className="text-[10px] font-medium">Settings</span>
                </button>
            </nav>
        </>
    );
}
