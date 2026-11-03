'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Moon, Sun, ArrowRight, LayoutDashboard } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { useTheme } from '@/components/ThemeProvider'
import { subscribeToAuth, UserSession } from '@/lib/auth'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null)
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 15)
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const unsub = subscribeToAuth((user) => {
      setCurrentUser(user)
    })
    return () => unsub()
  }, [])

  const navLinks = [
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Conditions', href: '#conditions' },
    { label: 'Pipeline', href: '#pipeline' },
    { label: 'Honest Science', href: '#trust' },
    { label: 'Methodology', href: '/about/method' },
    { label: 'FAQ', href: '#faq' },
  ]

  const isDark = theme === 'dark'

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 bg-[var(--surface)] border-b border-[var(--border)] ${
          scrolled ? 'shadow-[var(--shadow-sm)]' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 py-3.5">
            {/* Logo */}
            <Logo size="md" />

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-7" aria-label="Main Navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs font-semibold tracking-wide transition-colors text-[var(--muted)] hover:text-[var(--primary)]"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right Controls */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Theme Toggle */}
              <button
                type="button"
                onClick={toggleTheme}
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] hover:border-[var(--primary)]"
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDark ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} className="text-slate-700" />}
              </button>

              {currentUser ? (
                <Link
                  href="/dashboard"
                  className="btn-primary text-xs font-semibold py-2 px-4 rounded-lg flex items-center gap-1.5"
                >
                  <LayoutDashboard size={14} />
                  <span>Go to Dashboard</span>
                </Link>
              ) : (
                <>
                  <Link
                    href="/signin"
                    className="btn-ghost text-xs font-semibold py-2 px-3.5 rounded-lg text-[var(--text)]"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/signup"
                    className="btn-primary text-xs font-semibold py-2 px-4 rounded-lg"
                  >
                    Create account
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Controls */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                type="button"
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)]"
                aria-label="Toggle theme"
              >
                {isDark ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} className="text-slate-700" />}
              </button>

              <button
                type="button"
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 rounded-lg text-[var(--text)] bg-[var(--surface-2)] border border-[var(--border)]"
                aria-label="Toggle navigation menu"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileOpen && (
          <div className="lg:hidden border-b border-[var(--border)] bg-[var(--surface)] px-4 pt-3 pb-6 space-y-3 shadow-lg animate-in slide-in-from-top-2">
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2 text-sm font-medium text-[var(--text)] hover:bg-[var(--surface-2)] rounded-lg"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="pt-3 border-t border-[var(--border)] flex flex-col gap-2">
              {currentUser ? (
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="btn-primary w-full text-center text-sm py-2.5 justify-center"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/signin"
                    onClick={() => setMobileOpen(false)}
                    className="btn-ghost w-full text-center text-sm py-2.5 justify-center"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileOpen(false)}
                    className="btn-primary w-full text-center text-sm py-2.5 justify-center"
                  >
                    Create account
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  )
}
