'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Command } from 'cmdk'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mic,
  FileText,
  Clock,
  Calendar,
  Users,
  User,
  ShieldCheck,
  Sun,
  Moon,
  Search,
  X,
  HeartPulse,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'

interface CommandPaletteProps {
  open: boolean
  setOpen?: (open: boolean) => void
  onOpenChange?: (open: boolean) => void
}

export function CommandPalette({ open, setOpen, onOpenChange }: CommandPaletteProps) {
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  const handleOpen = (val: boolean) => {
    if (setOpen) setOpen(val)
    if (onOpenChange) onOpenChange(val)
  }

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        handleOpen(!open)
      }
      if (e.key === 'Escape' && open) {
        handleOpen(false)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [open])

  const navigateTo = (path: string) => {
    handleOpen(false)
    router.push(path)
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => handleOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Palette Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -8 }}
            transition={{ duration: 0.15 }}
            className="relative w-full max-w-xl rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-md)] overflow-hidden z-10"
          >
            <Command className="w-full text-sm" label="NeuroVoice Navigation">
              {/* Search input */}
              <div className="flex items-center px-4 py-3.5 border-b border-[var(--border)] gap-3 bg-[var(--surface)]">
                <Search size={17} className="text-[var(--muted)]" />
                <Command.Input
                  autoFocus
                  placeholder="Search actions or navigate (e.g. 'screening', 'doctor', 'reports')..."
                  className="w-full bg-transparent outline-none text-sm placeholder-[var(--muted)] text-[var(--text)] font-sans"
                />
                <button
                  onClick={() => handleOpen(false)}
                  className="p-1 rounded-md text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]"
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Items List grouped by Screening, Reports, Care, Account */}
              <Command.List className="max-h-84 overflow-y-auto p-2 space-y-2">
                <Command.Empty className="py-6 text-center text-xs text-[var(--muted)] font-mono">
                  No matching action found.
                </Command.Empty>

                {/* GROUP 1: SCREENING */}
                <Command.Group heading="Screening" className="px-2 py-1 text-[11px] font-mono uppercase tracking-wider text-[var(--muted)] font-bold">
                  <Command.Item
                    onSelect={() => navigateTo('/dashboard/scan')}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-[var(--surface-2)] text-xs font-semibold text-[var(--text)] transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center">
                      <Mic size={15} />
                    </div>
                    <span>Start New 30-Second Voice Screening</span>
                  </Command.Item>

                  <Command.Item
                    onSelect={() => navigateTo('/dashboard/ask')}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-[var(--surface-2)] text-xs font-semibold text-[var(--text)] transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center">
                      <Sparkles size={15} />
                    </div>
                    <span>Ask NeuroVoice AI Assistant</span>
                  </Command.Item>
                </Command.Group>

                {/* GROUP 2: REPORTS */}
                <Command.Group heading="Reports" className="px-2 py-1 text-[11px] font-mono uppercase tracking-wider text-[var(--muted)] font-bold pt-1">
                  <Command.Item
                    onSelect={() => navigateTo('/dashboard/history')}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-[var(--surface-2)] text-xs font-semibold text-[var(--text)] transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center">
                      <FileText size={15} />
                    </div>
                    <span>View Screening Reports & Longitudinal Timeline</span>
                  </Command.Item>

                  <Command.Item
                    onSelect={() => navigateTo('/dashboard/history?tab=compare')}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-[var(--surface-2)] text-xs font-semibold text-[var(--text)] transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center">
                      <SlidersHorizontal size={15} />
                    </div>
                    <span>Compare Two Screening Sessions</span>
                  </Command.Item>
                </Command.Group>

                {/* GROUP 3: CARE */}
                <Command.Group heading="Care" className="px-2 py-1 text-[11px] font-mono uppercase tracking-wider text-[var(--muted)] font-bold pt-1">
                  <Command.Item
                    onSelect={() => navigateTo('/dashboard/care')}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-[var(--surface-2)] text-xs font-semibold text-[var(--text)] transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-teal-500/10 text-[var(--accent)] flex items-center justify-center">
                      <Users size={15} />
                    </div>
                    <span>Find Verified Neurologists & Distance</span>
                  </Command.Item>

                  <Command.Item
                    onSelect={() => navigateTo('/dashboard/care?tab=appointments')}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-[var(--surface-2)] text-xs font-semibold text-[var(--text)] transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-[var(--primary)] flex items-center justify-center">
                      <Calendar size={15} />
                    </div>
                    <span>My Consultation Requests & Appointments</span>
                  </Command.Item>
                </Command.Group>

                {/* GROUP 4: ACCOUNT */}
                <Command.Group heading="Account" className="px-2 py-1 text-[11px] font-mono uppercase tracking-wider text-[var(--muted)] font-bold pt-1">
                  <Command.Item
                    onSelect={() => navigateTo('/dashboard/profile')}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-[var(--surface-2)] text-xs font-semibold text-[var(--text)] transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-[var(--surface-2)] text-[var(--text)] flex items-center justify-center">
                      <User size={15} />
                    </div>
                    <span>My Profile & Clinical Stats</span>
                  </Command.Item>

                  <Command.Item
                    onSelect={() => {
                      toggleTheme()
                      handleOpen(false)
                    }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-[var(--surface-2)] text-xs font-semibold text-[var(--text)] transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-[var(--surface-2)] text-amber-500 flex items-center justify-center">
                      {isDark ? <Sun size={15} /> : <Moon size={15} />}
                    </div>
                    <span>Toggle {isDark ? 'Light' : 'Dark'} Mode</span>
                  </Command.Item>
                </Command.Group>
              </Command.List>

              {/* Exact Required Footer */}
              <div className="px-4 py-2.5 border-t border-[var(--border)] bg-[var(--surface-2)] text-[11px] font-mono text-[var(--muted)] text-center">
                Press ↑ ↓ to navigate · Enter to select · Esc to close
              </div>
            </Command>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
