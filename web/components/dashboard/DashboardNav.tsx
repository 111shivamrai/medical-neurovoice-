'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Logo } from '@/components/Logo'
import { useTheme } from '@/components/ThemeProvider'
import { CommandPalette } from './CommandPalette'
import { NotificationsDropdown } from './NotificationsDropdown'
import { Search, Sun, Moon, LogOut, User, Settings, ShieldAlert } from 'lucide-react'

export function DashboardNav() {
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false)

  const isDark = theme === 'dark'
  const userRole = typeof window !== 'undefined' ? localStorage.getItem('neurovoice-role') || 'doctor' : 'doctor'
  const isAdmin = userRole === 'admin'

  const handleSignOut = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('neurovoice-auth-token')
      localStorage.removeItem('neurovoice-role')
    }
    router.push('/signin')
  }

  return (
    <>
      <header className="sticky top-0 z-30 w-full bg-[var(--surface)]/90 backdrop-blur-xl border-b border-[var(--border)] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Left: Minimal NeuroVoice Logo */}
            <div className="flex items-center gap-3">
              <Logo size="sm" />
            </div>

            {/* Centre: ⌘K Search trigger */}
            <button
              type="button"
              onClick={() => setCommandPaletteOpen(true)}
              className="flex-1 max-w-md hidden md:flex items-center justify-between px-3.5 py-1.5 rounded-xl text-xs font-mono bg-[var(--bg)] border border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--text)] transition-all"
            >
              <span className="flex items-center gap-2">
                <Search size={14} className="text-[var(--text-muted)]" />
                <span>Search patients, screening ID, doctors...</span>
              </span>
              <kbd className="px-1.5 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)] text-[10px] font-sans">
                ⌘K
              </kbd>
            </button>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
              {/* Notification Bell */}
              <NotificationsDropdown />

              {/* Theme Toggle */}
              <button
                type="button"
                onClick={toggleTheme}
                className="w-9 h-9 rounded-xl flex items-center justify-center bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
                aria-label="Toggle dark / light theme"
              >
                {isDark ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-slate-600" />}
              </button>

              {/* Avatar Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setAvatarMenuOpen(!avatarMenuOpen)}
                  className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs bg-[var(--primary)] text-white border-2 border-[var(--surface)] hover:ring-2 hover:ring-[var(--primary)] transition-all"
                >
                  SR
                </button>

                {avatarMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setAvatarMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="px-3 py-2 border-b border-[var(--border)] mb-1">
                        <div className="text-sm font-semibold text-[var(--text)]">Shivam Rai</div>
                        <div className="text-xs text-[var(--text-muted)] font-mono capitalize">{userRole} · Research Demo</div>
                      </div>

                      <Link
                        href="/dashboard/profile"
                        onClick={() => setAvatarMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg text-[var(--text)] hover:bg-[var(--surface-2)]"
                      >
                        <User size={14} className="text-[var(--primary)]" />
                        Profile
                      </Link>
                      <Link
                        href="/dashboard/profile"
                        onClick={() => setAvatarMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg text-[var(--text)] hover:bg-[var(--surface-2)]"
                      >
                        <Settings size={14} className="text-[var(--text-muted)]" />
                        Settings
                      </Link>

                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setAvatarMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg text-[var(--warning)] hover:bg-[var(--surface-2)]"
                        >
                          <ShieldAlert size={14} />
                          Admin Surveillance ↗
                        </Link>
                      )}

                      <div className="pt-1 mt-1 border-t border-[var(--border)]">
                        <button
                          type="button"
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg text-[var(--danger)] hover:bg-[var(--danger)]/10 text-left"
                        >
                          <LogOut size={14} />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ⌘K Global Command Palette */}
      <CommandPalette
        open={commandPaletteOpen}
        onOpenChange={setCommandPaletteOpen}
      />
    </>
  )
}
