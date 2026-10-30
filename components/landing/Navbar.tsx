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
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Disorders', href: '#disorders' },
    { label: '9-Stage Pipeline', href: '#pipeline' },
    { label: 'For Doctors', href: '#personas' },
    { label: 'Research & Trust', href: '#research' },
  ]

  const isDark = theme === 'dark'

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? isDark
              ? 'bg-[#0A0F1E]/85 backdrop-blur-xl border-b border-[#1F2937] shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
              : 'bg-[#FFFFFF]/90 backdrop-blur-xl border-b border-[#E2E8F0] shadow-sm'
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
                  className="text-sm font-medium transition-colors duration-200 hover:text-[#22D3EE] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1] rounded-md px-1 py-0.5"
                  style={{
                    color: isDark ? '#9CA3AF' : '#64748B',
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Actions / Right side */}
            <div className="hidden lg:flex items-center gap-4">
              {/* Dark/Light toggle */}
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl border transition-all duration-200 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]"
                style={{
                  background: isDark ? '#111827' : '#FFFFFF',
                  borderColor: isDark ? '#1F2937' : '#E2E8F0',
                  color: isDark ? '#22D3EE' : '#D97706',
                }}
                aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {/* Sign In */}
              <Link
                href="/signin"
                className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:opacity-90 active:scale-95 border"
                style={{
                  color: isDark ? '#F9FAFB' : '#0F172A',
                  borderColor: isDark ? '#1F2937' : '#CBD5E1',
                  background: isDark ? 'transparent' : '#F8FAFC',
                }}
              >
                Sign In
              </Link>

              {/* Get Started CTA */}
              <Link
                href="/signup"
                className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.02] active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                  boxShadow: '0 0 25px rgba(99,102,241,0.45)',
                }}
              >
                <span>Get Started Free</span>
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg border transition-all"
                style={{
                  background: isDark ? '#111827' : '#FFFFFF',
                  borderColor: isDark ? '#1F2937' : '#E2E8F0',
                  color: isDark ? '#22D3EE' : '#D97706',
                }}
                aria-label="Toggle theme"
              >
                {isDark ? <Sun size={16} /> : <Moon size={16} />}
              </button>

              <button
                className="p-2 rounded-lg transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle mobile menu"
                style={{
                  color: isDark ? '#F9FAFB' : '#0F172A',
                  background: isDark ? '#111827' : '#F1F5F9',
                }}
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-20 left-0 right-0 z-40 border-b px-6 py-6 lg:hidden"
            style={{
              background: isDark ? '#0A0F1E' : '#FFFFFF',
              borderColor: isDark ? '#1F2937' : '#E2E8F0',
            }}
          >
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-base font-medium py-2 border-b transition-colors"
                  style={{
                    color: isDark ? '#E5E7EB' : '#1E293B',
                    borderColor: isDark ? '#1F2937' : '#F1F5F9',
                  }}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 flex flex-col gap-3">
                <Link
                  href="/signin"
                  className="w-full text-center py-3 rounded-lg border font-semibold text-sm"
                  style={{
                    borderColor: '#6366F1',
                    color: '#6366F1',
                  }}
                  onClick={() => setMobileOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="w-full text-center py-3 rounded-lg font-semibold text-sm text-white"
                  style={{
                    background: '#6366F1',
                    boxShadow: '0 0 25px rgba(99,102,241,0.4)',
                  }}
                  onClick={() => setMobileOpen(false)}
                >
                  Get Started Free
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
