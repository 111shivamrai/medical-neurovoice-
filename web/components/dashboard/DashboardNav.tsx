'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Logo } from '@/components/Logo'
import { useTheme } from '@/components/ThemeProvider'
import { CommandPalette } from './CommandPalette'
import { NotificationsDropdown } from './NotificationsDropdown'
import { Search, Sun, Moon, LogOut, User } from 'lucide-react'
import { auth } from '@/lib/firebase'
import { signOut } from 'firebase/auth'
import { subscribeToAuth, clearLocalUser, UserSession } from '@/lib/auth'

export function DashboardNav() {
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null)

  const isDark = theme === 'dark'

  useEffect(() => {
    const unsub = subscribeToAuth((user) => {
      setCurrentUser(user)
    })
    return () => unsub()
  }, [])

  const handleSignOut = async () => {
    try {
      await signOut(auth)
    } catch (e) {
      console.warn('Sign out error:', e)
    }
    clearLocalUser()
    // Strict redirect to landing page
    router.replace('/')
  }

  const getInitials = (name?: string | null) => {
    if (!name) return 'NV'
    const parts = name.trim().split(' ')
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    return name.slice(0, 2).toUpperCase()
  }

  return (
    <>
      <header className="sticky top-0 z-30 w-full bg-[var(--surface)]/95 backdrop-blur-md border-b border-[var(--border)] transition-colors shadow-[var(--shadow-sm)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Left: Minimal NeuroVoice Logo */}
            <div className="flex items-center gap-3">
              <Logo size="sm" />
            </div>

            {/* Centre: Search trigger for Command Palette */}
            <button
              type="button"
              onClick={() => setCommandPaletteOpen(true)}
              className="flex-1 max-w-md hidden md:flex items-center justify-between px-3.5 py-1.5 rounded-xl text-xs font-mono bg-[var(--surface-2)] border border-[var(--border)] text-[var(--muted)] hover:border-[var(--primary)] hover:text-[var(--text)] transition-colors"
            >
              <span className="flex items-center gap-2">
                <Search size={14} className="text-[var(--muted)]" />
                <span>Search screenings, doctors, reports...</span>
              </span>
              <kbd className="px-1.5 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)] text-[10px] font-sans">
                ⌘K
              </kbd>
            </button>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* Notification Bell */}
              <NotificationsDropdown />

              {/* Theme Toggle */}
              <button
                type="button"
                onClick={toggleTheme}
                className="w-9 h-9 rounded-xl flex items-center justify-center bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] hover:border-[var(--primary)] transition-colors"
                aria-label="Toggle dark / light theme"
              >
                {isDark ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-slate-600" />}
              </button>

              {/* Profile Avatar & Minimal Menu */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setAvatarMenuOpen(!avatarMenuOpen)}
                  className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center font-bold text-xs bg-[var(--primary)] text-white border-2 border-[var(--border)] hover:ring-2 hover:ring-[var(--primary)]/30 transition-all"
                  aria-label="Open user menu"
                >
                  {currentUser?.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName || 'Avatar'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{getInitials(currentUser?.displayName)}</span>
                  )}
                </button>

                {avatarMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setAvatarMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-md)] p-1.5 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="px-3 py-2 border-b border-[var(--border)] mb-1">
                        <div className="text-xs font-bold text-[var(--text)] truncate">
                          {currentUser?.displayName || 'Registered User'}
                        </div>
                        <div className="text-[11px] text-[var(--muted)] truncate font-mono">
                          {currentUser?.email || 'patient@neurovoice.org'}
                        </div>
                      </div>

                      {/* Menu has ONLY "My profile" and "Sign out" */}
                      <Link
                        href="/dashboard/profile"
                        onClick={() => setAvatarMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors"
                      >
                        <User size={15} className="text-[var(--primary)]" />
                        <span>My profile</span>
                      </Link>

                      <div className="pt-1 mt-1 border-t border-[var(--border)]">
                        <button
                          type="button"
                          onClick={() => {
                            setAvatarMenuOpen(false)
                            handleSignOut()
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg text-[var(--danger)] hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-left"
                        >
                          <LogOut size={15} />
                          <span>Sign out</span>
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
