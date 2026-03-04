"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
    isLoggedIn: boolean;
    login: () => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Check local storage on mount
        const storedStatus = localStorage.getItem("fitvision_is_logged_in");
        if (storedStatus === "true") {
            setIsLoggedIn(true);
        } else {
            // If not logged in and not already on the login page or tutorial page, redirect
            if (pathname !== "/login" && pathname !== "/tutorial") {
                router.push("/login");
            }
        }
    }, [pathname, router]);

    const login = () => {
        localStorage.setItem("fitvision_is_logged_in", "true");
        setIsLoggedIn(true);
        router.push("/"); // Redirect to dashboard after login
    };

    const logout = () => {
        localStorage.removeItem("fitvision_is_logged_in");
        setIsLoggedIn(false);
        // Clear other data on logout if needed
        sessionStorage.clear();
        router.push("/login");
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
