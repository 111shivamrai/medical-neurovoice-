'use client'

import React, { useEffect, useState } from 'react'
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
  Sparkles,
  Download,
  HeartPulse,
  Search,
  X,
} from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'

interface CommandPaletteProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export function CommandPalette({ open, setOpen }: CommandPaletteProps) {
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(!open)
      }
      if (e.key === 'Escape' && open) {
        setOpen(false)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [open, setOpen])

  const navigateTo = (path: string) => {
    setOpen(false)
    router.push(path)
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
          />

          {/* Palette Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-xl rounded-2xl border shadow-[0_0_50px_rgba(99,102,241,0.25)] overflow-hidden z-10"
            style={{
              background: isDark ? '#111827' : '#FFFFFF',
              borderColor: isDark ? '#1F2937' : '#E2E8F0',
            }}
          >
            <Command
              className="w-full text-sm"
              label="NeuroVoice Command Centre"
            >
              {/* Search input */}
              <div
                className="flex items-center px-4 py-3.5 border-b gap-3"
                style={{ borderColor: isDark ? '#1F2937' : '#E2E8F0' }}
              >
                <Search size={18} className="text-gray-400" />
                <Command.Input
                  autoFocus
                  placeholder="Type a command or search (e.g. 'new scan', 'doctors', 'reports')..."
                  className="w-full bg-transparent outline-none text-sm placeholder-gray-500 font-sans"
                  style={{ color: isDark ? '#F9FAFB' : '#0F172A' }}
                />
                <button
                  onClick={() => setOpen(false)}
                  className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-white/10"
                  aria-label="Close command palette"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Items List */}
              <Command.List className="max-h-80 overflow-y-auto p-2 space-y-1">
                <Command.Empty className="py-6 text-center text-xs text-gray-400 font-mono">
                  No matching clinical command found.
                </Command.Empty>

                <Command.Group heading="CLINICAL ACTIONS" className="px-2 py-1.5 text-[10px] font-mono uppercase tracking-wider text-gray-400">
                  <Command.Item
                    onSelect={() => navigateTo('/dashboard/scan')}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-[#6366F1]/15 text-xs font-medium transition-colors"
                    style={{ color: isDark ? '#F9FAFB' : '#0F172A' }}
                  >
                    <div className="w-7 h-7 rounded-lg bg-cyan-500/15 text-[#22D3EE] flex items-center justify-center">
                      <Mic size={15} />
                    </div>
                    <span>Start New 30-Second Voice Screening</span>
                    <span className="ml-auto text-[10px] font-mono text-cyan-400">/scan</span>
                  </Command.Item>

                  <Command.Item
                    onSelect={() => navigateTo('/simple')}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-[#10B981]/15 text-xs font-medium transition-colors"
                    style={{ color: isDark ? '#F9FAFB' : '#0F172A' }}
                  >
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-[#10B981] flex items-center justify-center">
                      <HeartPulse size={15} />
                    </div>
                    <span>Open ASHA Worker Simple Mode (Hindi)</span>
                    <span className="ml-auto text-[10px] font-mono text-emerald-400">/simple</span>
                  </Command.Item>
                </Command.Group>

                <Command.Group heading="PORTAL NAVIGATION" className="px-2 py-1.5 text-[10px] font-mono uppercase tracking-wider text-gray-400 pt-2">
                  <Command.Item
                    onSelect={() => navigateTo('/dashboard/history')}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-white/5 text-xs font-medium transition-colors"
                    style={{ color: isDark ? '#F9FAFB' : '#0F172A' }}
                  >
                    <Clock size={16} className="text-indigo-400" />
                    <span>My Reports & Longitudinal Timeline</span>
                  </Command.Item>

                  <Command.Item
                    onSelect={() => navigateTo('/dashboard/doctors')}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-white/5 text-xs font-medium transition-colors"
                    style={{ color: isDark ? '#F9FAFB' : '#0F172A' }}
                  >
                    <Users size={16} className="text-purple-400" />
                    <span>Find Doctors & Specialists (Jabalpur)</span>
                  </Command.Item>

                  <Command.Item
                    onSelect={() => navigateTo('/dashboard/appointments')}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-white/5 text-xs font-medium transition-colors"
                    style={{ color: isDark ? '#F9FAFB' : '#0F172A' }}
                  >
                    <Calendar size={16} className="text-teal-400" />
                    <span>Book & Manage Appointments</span>
                  </Command.Item>

                  <Command.Item
                    onSelect={() => navigateTo('/dashboard/profile')}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-white/5 text-xs font-medium transition-colors"
                    style={{ color: isDark ? '#F9FAFB' : '#0F172A' }}
                  >
                    <User size={16} className="text-amber-400" />
                    <span>User Profile, Stats & Achievements</span>
                  </Command.Item>

                  <Command.Item
                    onSelect={() => navigateTo('/admin')}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-white/5 text-xs font-medium transition-colors"
                    style={{ color: isDark ? '#F9FAFB' : '#0F172A' }}
                  >
                    <ShieldCheck size={16} className="text-red-400" />
                    <span>Admin Control Centre (Role-Gated)</span>
                    <span className="ml-auto text-[10px] font-mono text-red-400">/admin</span>
                  </Command.Item>
                </Command.Group>

                <Command.Group heading="PREFERENCES" className="px-2 py-1.5 text-[10px] font-mono uppercase tracking-wider text-gray-400 pt-2">
                  <Command.Item
                    onSelect={() => {
                      toggleTheme()
                      setOpen(false)
                    }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-white/5 text-xs font-medium transition-colors"
                    style={{ color: isDark ? '#F9FAFB' : '#0F172A' }}
                  >
                    {isDark ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-indigo-400" />}
                    <span>Toggle {isDark ? 'Light' : 'Dark'} Mode</span>
                  </Command.Item>
                </Command.Group>
              </Command.List>

              {/* Footer hotkey tip */}
              <div
                className="px-4 py-2 border-t flex items-center justify-between text-[11px] font-mono text-gray-500"
                style={{ borderColor: isDark ? '#1F2937' : '#E2E8F0' }}
              >
                <span>Navigate: ↑ ↓ · Select: ↵</span>
                <span>ESC to dismiss</span>
              </div>
            </Command>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
