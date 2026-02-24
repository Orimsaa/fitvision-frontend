import DashboardLayout from "@/components/DashboardLayout";
import React from "react";

export default function SettingsPage() {
    return (
        <DashboardLayout>
            <div className="max-w-[1000px] mx-auto p-6 md:p-10 flex flex-col gap-8 pb-20">
                {/* Header Section */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                        Settings
                    </h1>
                    <p className="text-slate-400">Manage your profile, preferences, and account details.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Sidebar Nav for Settings */}
                    <div className="lg:col-span-1 flex flex-col gap-2">
                        <button className="flex items-center gap-3 px-4 py-3 bg-primary/10 text-primary rounded-xl font-medium transition-colors text-left border border-primary/20">
                            <span className="material-symbols-outlined">person</span>
                            Profile
                        </button>
                        <button className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl font-medium transition-colors text-left">
                            <span className="material-symbols-outlined">notifications</span>
                            Notifications
                        </button>
                        <button className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl font-medium transition-colors text-left">
                            <span className="material-symbols-outlined">tune</span>
                            Preferences
                        </button>
                        <button className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl font-medium transition-colors text-left">
                            <span className="material-symbols-outlined">lock</span>
                            Privacy & Security
                        </button>
                    </div>

                    {/* Main Settings Content */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        {/* Profile Section */}
                        <div className="bg-surface-dark border border-white/5 rounded-2xl p-6 md:p-8 flex flex-col gap-6 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1/2 h-1 bg-gradient-to-r from-primary to-transparent opacity-50"></div>
                            <h2 className="text-xl font-bold text-white mb-2">Profile Information</h2>

                            <div className="flex items-center gap-6 mb-4">
                                <div
                                    className="bg-center bg-no-repeat bg-cover rounded-full size-24 ring-4 ring-primary/20 shadow-neon"
                                    style={{
                                        backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDXffCakVRarFoNQFrA4K7x22dBozfhsCf4wktXzY1OZGVk5RKCXqRMx3JZRNx5BOv0nhv-CDxFys6quSum4CCeuuY5AE-2K2rF2PG-9ov-2Ki_8to7wSgmJqgIEy6KqiG9FC5kM8TulNc_0SIfhfTmBbtAboV1n7XkUpJOFYw2bz1oA5SR0aQATkET1hR6-eOseSCjj6TcARG9zS_7JyYXM--QkV1y9hlqKvVOGTPt25uOtAn4yeH_dVyi6fcQlIFUqrWg1ZFVVTpt")',
                                    }}
                                ></div>
                                <div className="flex flex-col gap-3">
                                    <button className="px-5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors text-sm">
                                        Change Avatar
                                    </button>
                                    <button className="text-slate-400 hover:text-red-400 transition-colors text-sm text-left">
                                        Remove
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-slate-400">First Name</label>
                                    <input
                                        type="text"
                                        defaultValue="Alex"
                                        className="bg-background-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-slate-400">Last Name</label>
                                    <input
                                        type="text"
                                        defaultValue="Morgan"
                                        className="bg-background-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                    />
                                </div>
                                <div className="flex flex-col gap-2 md:col-span-2">
                                    <label className="text-sm font-medium text-slate-400">Email Address</label>
                                    <input
                                        type="email"
                                        defaultValue="alex.morgan@fitvision.app"
                                        className="bg-background-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Subscription Section */}
                        <div className="bg-gradient-to-br from-surface-dark to-surface-darker border border-primary/20 rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden group">
                            <div className="absolute -right-6 -bottom-6 size-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all"></div>
                            <div className="flex flex-col gap-2 relative z-10">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">verified</span>
                                    FitVision Pro
                                </h3>
                                <p className="text-slate-400 text-sm">Your subscription is active until Dec 31, 2026</p>
                            </div>
                            <button className="px-5 py-2.5 bg-background-dark border border-white/10 hover:border-white/30 text-white rounded-xl font-medium transition-all relative z-10 whitespace-nowrap">
                                Manage Plan
                            </button>
                        </div>

                        {/* Save Actions */}
                        <div className="flex justify-end gap-3 mt-4">
                            <button className="px-6 py-3 rounded-xl font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors">
                                Cancel
                            </button>
                            <button className="px-6 py-3 rounded-xl font-bold bg-primary text-black hover:bg-primary/90 hover:shadow-neon transition-all">
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
