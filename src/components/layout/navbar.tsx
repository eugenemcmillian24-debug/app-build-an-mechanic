'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  Beaker,
  Bot,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Menu,
  Wrench,
  X,
  Zap,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useCreditsStore } from '@/lib/store/credits-store';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/ai-lab', label: 'AI Lab', icon: Beaker },
  { href: '/build', label: 'Build', icon: Bot },
  { href: '/fix', label: 'Fix', icon: Wrench },
  { href: '/billing', label: 'Billing', icon: CreditCard },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { balance } = useCreditsStore();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <nav className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <Zap className="h-7 w-7 text-violet-500" />
            <span className="font-bold text-xl text-white tracking-tight">
              OPS AI <span className="text-violet-400">DEV</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-violet-600/20 text-violet-400'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Credits + Sign Out */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/billing"
              className="flex items-center gap-2 bg-zinc-800/60 border border-zinc-700 rounded-full px-4 py-1.5 hover:bg-zinc-800 transition-colors"
            >
              <Zap className="h-4 w-4 text-amber-400" />
              <span className="text-sm font-semibold text-white">
                {balance.toLocaleString()}
              </span>
              <span className="text-xs text-zinc-500">credits</span>
            </Link>
            <button
              onClick={handleSignOut}
              className="p-2 text-zinc-500 hover:text-white transition-colors"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-zinc-400 hover:text-white"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-zinc-800 bg-zinc-950 pb-4">
          <div className="px-4 pt-3 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                    isActive
                      ? 'bg-violet-600/20 text-violet-400'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
            <div className="pt-3 border-t border-zinc-800 mt-3">
              <div className="flex items-center justify-between px-3">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-400" />
                  <span className="text-sm font-semibold text-white">
                    {balance.toLocaleString()} credits
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="text-sm text-zinc-500 hover:text-white"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
