'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Moon, Sun, ArrowRight } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { useTheme } from '@/components/ThemeProvider'
import { motion, AnimatePresence } from 'framer-motion'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Conditions', href: '#conditions' },
    { label: 'For Doctors', href: '#personas' },
    { label: 'Research', href: '#research' },
  ]

  const isDark = theme === 'dark'

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[var(--surface)]/85 backdrop-blur-xl border-b border-[var(--border)] shadow-md'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Logo size="md" />

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center gap-8" aria-label="Desktop Navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium transition-colors duration-200 text-[var(--text-muted)] hover:text-[var(--accent)] rounded-md px-1 py-0.5"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right CTAs & Theme Toggle */}
            <div className="hidden lg:flex items-center gap-4">
              {/* Dark/Light toggle */}
              <button
                type="button"
                onClick={toggleTheme}
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)]"
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDark ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-slate-600" />}
              </button>

              <Link
                href="/signin"
                className="px-4 py-2 text-sm font-semibold rounded-lg text-[var(--text)] hover:text-[var(--accent)] transition-colors"
              >
                Sign In
              </Link>

              <Link
                href="/dashboard/scan"
                className="btn-primary text-sm font-semibold text-white px-5 py-2.5 rounded-lg shadow-md"
              >
                Get Started
                <ArrowRight size={15} />
              </Link>
            </div>

            {/* Mobile Hamburger */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                type="button"
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)]"
                aria-label="Toggle theme"
              >
                {isDark ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-slate-600" />}
              </button>

              <button
                type="button"
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 rounded-lg text-[var(--text)] bg-[var(--surface-2)] border border-[var(--border)]"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-b border-[var(--border)] bg-[var(--surface)] px-4 pt-2 pb-6 space-y-3"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-[var(--text)] hover:text-[var(--accent)] rounded-md"
                >
                  {link.label}
                </Link>
              ))}

              <div className="pt-4 border-t border-[var(--border)] flex flex-col gap-2.5">
                <Link
                  href="/signin"
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center py-2.5 text-sm font-semibold rounded-lg border border-[var(--border)] text-[var(--text)]"
                >
                  Sign In
                </Link>
                <Link
                  href="/dashboard/scan"
                  onClick={() => setMobileOpen(false)}
                  className="btn-primary w-full justify-center text-center py-3 text-sm font-semibold text-white rounded-lg"
                >
                  Get Started
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}
