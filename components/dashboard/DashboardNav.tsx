'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Logo } from '@/components/Logo'
import { useTheme } from '@/components/ThemeProvider'
import { NotificationsDropdown } from './NotificationsDropdown'
import { CommandPalette } from './CommandPalette'
import {
  Search,
  Moon,
  Sun,
  Home,
  Mic,
  FileText,
  Clock,
  Calendar,
  Users,
  User,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'

export function DashboardNav() {
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'
  const [commandOpen, setCommandOpen] = useState(false)

  const navPills = [
    { label: 'Home', href: '/dashboard', icon: Home },
    { label: 'New Scan', href: '/dashboard/scan', icon: Mic, highlight: true },
    { label: 'My Reports', href: '/dashboard/history', icon: FileText },
    { label: 'My History', href: '/dashboard/history', icon: Clock },
    { label: 'Appointments', href: '/dashboard/appointments', icon: Calendar },
    { label: 'Doctors', href: '/dashboard/doctors', icon: Users },
    { label: 'Profile', href: '/dashboard/profile', icon: User },
    { label: 'Admin ↗', href: '/admin', icon: ShieldCheck, external: true },
  ]

  return (
    <>
      {/* ⌘K Command Palette Modal */}
      <CommandPalette open={commandOpen} setOpen={setCommandOpen} />

      {/* TOP BAR (Sticky) */}
      <header
        className={`sticky top-0 z-40 transition-colors duration-200 border-b backdrop-blur-xl ${
          isDark
            ? 'bg-[#0A0F1E]/90 border-[#1F2937]'
            : 'bg-[#FFFFFF]/90 border-[#E2E8F0]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Left: Logo */}
            <div className="flex-shrink-0">
              <Logo size="sm" />
            </div>

            {/* Centre: ⌘K Search Bar */}
            <div className="flex-1 max-w-lg hidden sm:block">
              <button
                type="button"
                onClick={() => setCommandOpen(true)}
                className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl border text-xs transition-all hover:scale-[1.01] active:scale-98 shadow-sm group"
                style={{
                  background: isDark ? '#111827' : '#F8FAFC',
                  borderColor: isDark ? '#1F2937' : '#CBD5E1',
                  color: isDark ? '#9CA3AF' : '#64748B',
                }}
              >
                <div className="flex items-center gap-2.5">
                  <Search size={14} className="text-gray-400 group-hover:text-[#22D3EE] transition-colors" />
                  <span className="font-sans">Search clinical commands, doctors, reports...</span>
                </div>
                <div className="flex items-center gap-1 font-mono text-[10px] px-2 py-0.5 rounded bg-black/15 border border-inherit">
                  <span>⌘K</span>
                </div>
              </button>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
              {/* Mobile ⌘K trigger */}
              <button
                onClick={() => setCommandOpen(true)}
                className="p-2 sm:hidden rounded-xl border"
                style={{
                  background: isDark ? '#111827' : '#FFFFFF',
                  borderColor: isDark ? '#1F2937' : '#E2E8F0',
                  color: isDark ? '#F9FAFB' : '#0F172A',
                }}
                aria-label="Open search command palette"
              >
                <Search size={16} />
              </button>

              {/* Notification bell */}
              <NotificationsDropdown />

              {/* Dark/Light Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl border transition-all hover:scale-105"
                style={{
                  background: isDark ? '#111827' : '#FFFFFF',
                  borderColor: isDark ? '#1F2937' : '#E2E8F0',
                  color: isDark ? '#22D3EE' : '#D97706',
                }}
                aria-label="Toggle dark/light theme"
              >
                {isDark ? <Sun size={17} /> : <Moon size={17} />}
              </button>

              {/* Profile Avatar with Photo / Gender Icon */}
              <Link
                href="/dashboard/profile"
                className="flex items-center gap-2 pl-2"
                title="View user profile"
              >
                <div className="relative w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-cyan-500 p-0.5 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                  <div className="w-full h-full rounded-full bg-[#111827] flex items-center justify-center text-sm font-bold text-white overflow-hidden">
                    <span>👩‍⚕️</span>
                  </div>
                </div>
                <div className="hidden lg:block text-left text-xs leading-tight">
                  <div className="font-semibold text-white">Dr. Priya S.</div>
                  <div className="text-[10px] text-cyan-400 font-mono">Neurology OPD</div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* FLOATING NAVIGATION PILLS (NOT A SIDEBAR) */}
        <div
          className="border-t py-2.5 px-4 sm:px-6 lg:px-8 overflow-x-auto scrollbar-none"
          style={{
            borderColor: isDark ? '#1F2937' : '#E2E8F0',
            background: isDark ? '#070B16' : '#F1F5F9',
          }}
        >
          <div className="max-w-7xl mx-auto flex items-center gap-2 min-w-max">
            {navPills.map((pill) => {
              const Icon = pill.icon
              const isActive =
                pill.href === '/dashboard'
                  ? pathname === '/dashboard'
                  : pathname?.startsWith(pill.href)

              return (
                <Link
                  key={pill.label}
                  href={pill.href}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 active:scale-95 ${
                    isActive
                      ? 'bg-[#6366F1] text-white shadow-[0_0_20px_rgba(99,102,241,0.5)] border border-[#818CF8]'
                      : isDark
                      ? 'bg-[#111827] text-gray-300 hover:text-white hover:bg-[#1F2937] border border-[#1F2937]'
                      : 'bg-[#FFFFFF] text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-[#CBD5E1]'
                  }`}
                >
                  <Icon size={14} className={isActive ? 'text-white' : pill.highlight ? 'text-cyan-400' : 'text-gray-400'} />
                  <span>{pill.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </header>
    </>
  )
}
