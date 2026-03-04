import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FitVision Dashboard",
  description: "AI Powered Form Analysis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${spaceGrotesk.variable} ${spaceGrotesk.className} antialiased font-sans text-slate-100 bg-background-dark min-h-screen font-display`}
      >
        <LanguageProvider>
          <AuthProvider>
            <Sidebar />
            {children}
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
