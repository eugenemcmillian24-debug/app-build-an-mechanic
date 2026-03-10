import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import CreditWallet from "@/components/credits/CreditWallet";
import { Cpu, Zap, Activity, Microscope, Settings } from "lucide-react";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OPS AI DEV | Multi-Agent AI Builder",
  description: "Advanced AI-powered full-stack application builder with multi-agent orchestration.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-950 text-zinc-100 min-h-screen selection:bg-emerald-500/30 selection:text-emerald-400`}
      >
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <aside className="w-20 lg:w-64 border-r border-zinc-800 flex flex-col items-center lg:items-stretch py-8 px-4 gap-12 sticky top-0 h-screen">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="p-2.5 bg-emerald-500 rounded-2xl group-hover:rotate-12 transition-transform shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                <Zap className="w-6 h-6 text-zinc-950 fill-zinc-950" />
              </div>
              <span className="hidden lg:block font-black text-xl tracking-tighter uppercase italic">
                OPS <span className="text-emerald-500">AI</span> DEV
              </span>
            </Link>

            <nav className="flex flex-col gap-4">
              <Link href="/ai-lab" className="flex items-center gap-4 p-3 hover:bg-zinc-900 rounded-xl transition-all text-zinc-400 hover:text-white group">
                <div className="p-2 bg-zinc-900 group-hover:bg-zinc-800 rounded-lg">
                  <Microscope className="w-5 h-5 text-zinc-400 group-hover:text-emerald-400" />
                </div>
                <span className="hidden lg:block font-bold">AI Lab</span>
              </Link>
              <Link href="/build" className="flex items-center gap-4 p-3 hover:bg-zinc-900 rounded-xl transition-all text-zinc-400 hover:text-white group italic">
                <div className="p-2 bg-zinc-900 group-hover:bg-zinc-800 rounded-lg">
                  <Zap className="w-5 h-5 text-zinc-400 group-hover:text-amber-400" />
                </div>
                <span className="hidden lg:block font-bold">Autopilot</span>
              </Link>
              <Link href="/fix" className="flex items-center gap-4 p-3 hover:bg-zinc-900 rounded-xl transition-all text-zinc-400 hover:text-white group">
                <div className="p-2 bg-zinc-900 group-hover:bg-zinc-800 rounded-lg">
                  <Activity className="w-5 h-5 text-zinc-400 group-hover:text-blue-400" />
                </div>
                <span className="hidden lg:block font-bold">Mechanic</span>
              </Link>
              <Link href="/projects" className="flex items-center gap-4 p-3 hover:bg-zinc-900 rounded-xl transition-all text-zinc-400 hover:text-white group">
                <div className="p-2 bg-zinc-900 group-hover:bg-zinc-800 rounded-lg">
                  <Cpu className="w-5 h-5 text-zinc-400 group-hover:text-purple-400" />
                </div>
                <span className="hidden lg:block font-bold">Projects</span>
              </Link>
            </nav>

            <div className="mt-auto flex flex-col gap-4">
              <div className="hidden lg:block">
                <CreditWallet />
              </div>
              <Link href="/settings" className="flex items-center gap-4 p-3 hover:bg-zinc-900 rounded-xl transition-all text-zinc-400 hover:text-white group">
                <div className="p-2 bg-zinc-900 group-hover:bg-zinc-800 rounded-lg">
                  <Settings className="w-5 h-5 text-zinc-400 group-hover:text-zinc-100" />
                </div>
                <span className="hidden lg:block font-bold">Settings</span>
              </Link>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 flex flex-col relative">
            <header className="h-16 border-b border-zinc-800 px-8 flex items-center justify-between sticky top-0 bg-zinc-950/80 backdrop-blur-md z-40 lg:hidden">
              <Zap className="w-6 h-6 text-emerald-500" />
              <div className="flex items-center gap-4">
                <CreditWallet />
              </div>
            </header>
            
            <div className="p-8">
              {children}
            </div>
          </main>
        </div>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
