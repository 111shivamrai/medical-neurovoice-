'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Home,
  FileText,
  Mic,
  HeartHandshake,
  User,
  History,
  Calendar,
  Users,
  Settings,
  ShieldAlert,
  LogOut,
  ChevronUp,
} from 'lucide-react'

export function FloatingDock() {
  const pathname = usePathname()
  const router = useRouter()
  const [activeMenu, setActiveMenu] = useState<'reports' | 'care' | 'me' | null>(null)

  const isHome = pathname === '/dashboard'
  const isReports = pathname.startsWith('/dashboard/reports') || pathname.startsWith('/dashboard/history')
  const isScan = pathname === '/dashboard/scan'
  const isCare = pathname.startsWith('/dashboard/doctors') || pathname.startsWith('/dashboard/appointments')
  const isMe = pathname.startsWith('/dashboard/profile') || pathname.startsWith('/admin')

  // Check demo user role
  const userRole = typeof window !== 'undefined' ? localStorage.getItem('neurovoice-role') || 'doctor' : 'doctor'
  const isAdmin = userRole === 'admin'

  const toggleMenu = (menu: 'reports' | 'care' | 'me') => {
    setActiveMenu(activeMenu === menu ? null : menu)
  }

  const handleSignOut = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('neurovoice-auth-token')
      localStorage.removeItem('neurovoice-role')
    }
    router.push('/signin')
  }

  return (
    <>
      {/* Backdrop for open menus */}
      {activeMenu && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]"
          onClick={() => setActiveMenu(null)}
        />
      )}

      {/* Floating Popover Menus */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
        {/* Reports Submenu */}
        {activeMenu === 'reports' && (
          <div className="w-56 p-2 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-2xl backdrop-blur-xl mb-2 animate-in fade-in slide-in-from-bottom-2 duration-150">
            <div className="text-[11px] font-mono text-[var(--text-muted)] px-3 py-1.5 uppercase tracking-wider">
              Diagnostic Reports
            </div>
            <Link
              href="/dashboard/history"
              onClick={() => setActiveMenu(null)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors"
            >
              <FileText size={16} className="text-[var(--primary)]" />
              All Reports
            </Link>
            <Link
              href="/dashboard/history"
              onClick={() => setActiveMenu(null)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors"
            >
              <History size={16} className="text-[var(--accent)]" />
              Patient Timeline
            </Link>
            <Link
              href="/dashboard/history#compare"
              onClick={() => setActiveMenu(null)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors"
            >
              <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-[var(--surface-2)] text-[var(--accent)]">Δ</span>
              Compare Biomarkers
            </Link>
          </div>
        )}

        {/* Care Submenu */}
        {activeMenu === 'care' && (
          <div className="w-56 p-2 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-2xl backdrop-blur-xl mb-2 animate-in fade-in slide-in-from-bottom-2 duration-150">
            <div className="text-[11px] font-mono text-[var(--text-muted)] px-3 py-1.5 uppercase tracking-wider">
              Clinical Care Network
            </div>
            <Link
              href="/dashboard/doctors"
              onClick={() => setActiveMenu(null)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors"
            >
              <Users size={16} className="text-[var(--primary)]" />
              Specialist Directory
            </Link>
            <Link
              href="/dashboard/appointments"
              onClick={() => setActiveMenu(null)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors"
            >
              <Calendar size={16} className="text-[var(--success)]" />
              Appointments
            </Link>
          </div>
        )}

        {/* Me Submenu */}
        {activeMenu === 'me' && (
          <div className="w-56 p-2 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-2xl backdrop-blur-xl mb-2 animate-in fade-in slide-in-from-bottom-2 duration-150">
            <div className="text-[11px] font-mono text-[var(--text-muted)] px-3 py-1.5 uppercase tracking-wider">
              Account & Role
            </div>
            <Link
              href="/dashboard/profile"
              onClick={() => setActiveMenu(null)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors"
            >
              <User size={16} className="text-[var(--primary)]" />
              My Profile
            </Link>
            <Link
              href="/dashboard/profile"
              onClick={() => setActiveMenu(null)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors"
            >
              <Settings size={16} className="text-[var(--text-muted)]" />
              Preferences
            </Link>

            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setActiveMenu(null)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-[var(--warning)] hover:bg-[var(--surface-2)] transition-colors"
              >
                <ShieldAlert size={16} />
                Admin Panel ↗
              </Link>
            )}

            <div className="pt-1.5 mt-1.5 border-t border-[var(--border)]">
              <button
                type="button"
                onClick={handleSignOut}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-[var(--danger)] hover:bg-[var(--danger)]/10 transition-colors text-left"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 5-Item Floating Bottom Dock */}
      <nav
        aria-label="Bottom Dock Navigation"
        className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-[95vw] sm:max-w-md w-full px-2"
      >
        <div className="flex items-center justify-between px-3 sm:px-6 py-2 sm:py-2.5 rounded-2xl sm:rounded-full bg-[var(--surface)]/90 backdrop-blur-xl border border-[var(--border)] shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
          {/* 1. Home */}
          <Link
            href="/dashboard"
            onClick={() => setActiveMenu(null)}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
              isHome
                ? 'text-[var(--primary)] font-semibold scale-105'
                : 'text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            <Home size={20} />
            <span className="text-[10px] tracking-tight">Home</span>
          </Link>

          {/* 2. Reports */}
          <button
            type="button"
            onClick={() => toggleMenu('reports')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
              isReports || activeMenu === 'reports'
                ? 'text-[var(--primary)] font-semibold scale-105'
                : 'text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            <FileText size={20} />
            <span className="text-[10px] tracking-tight flex items-center gap-0.5">
              Reports <ChevronUp size={10} className={activeMenu === 'reports' ? 'rotate-180' : ''} />
            </span>
          </button>

          {/* 3. [SCAN, Large Raised Glowing Centre Button] */}
          <Link
            href="/dashboard/scan"
            onClick={() => setActiveMenu(null)}
            className="relative -top-5 sm:-top-6 group focus:outline-none"
            aria-label="Start Voice Screening"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex flex-col items-center justify-center text-white bg-gradient-to-tr from-[var(--primary)] to-[var(--accent)] shadow-[0_0_30px_var(--primary-glow)] group-hover:scale-110 group-active:scale-95 transition-all duration-200 border-4 border-[var(--bg)]">
              <Mic size={24} className="animate-pulse" />
              <span className="text-[9px] font-bold tracking-wider uppercase mt-0.5">SCAN</span>
            </div>
          </Link>

          {/* 4. Care */}
          <button
            type="button"
            onClick={() => toggleMenu('care')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
              isCare || activeMenu === 'care'
                ? 'text-[var(--primary)] font-semibold scale-105'
                : 'text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            <HeartHandshake size={20} />
            <span className="text-[10px] tracking-tight flex items-center gap-0.5">
              Care <ChevronUp size={10} className={activeMenu === 'care' ? 'rotate-180' : ''} />
            </span>
          </button>

          {/* 5. Me */}
          <button
            type="button"
            onClick={() => toggleMenu('me')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
              isMe || activeMenu === 'me'
                ? 'text-[var(--primary)] font-semibold scale-105'
                : 'text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            <User size={20} />
            <span className="text-[10px] tracking-tight flex items-center gap-0.5">
              Me <ChevronUp size={10} className={activeMenu === 'me' ? 'rotate-180' : ''} />
            </span>
          </button>
        </div>
      </nav>
    </>
  )
}
