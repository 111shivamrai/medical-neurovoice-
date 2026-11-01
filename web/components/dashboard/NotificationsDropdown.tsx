'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Bell, CheckCheck, FileText, Calendar, Clock, BookOpen, X } from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'

interface NotificationItem {
  id: string
  title: string
  message: string
  type: 'results' | 'appointment' | 'reminder' | 'research'
  time: string
  link: string
  read: boolean
}

export function NotificationsDropdown() {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'Screening Completed',
      message: 'Your screening results are ready. Risk status: Low.',
      type: 'results',
      time: '10m ago',
      link: '/dashboard/history',
      read: false,
    },
    {
      id: 'notif-2',
      title: 'Appointment Reminder',
      message: 'Consultation with Dr. V. K. Soni tomorrow at 10:30 AM.',
      type: 'appointment',
      time: '2h ago',
      link: '/dashboard/appointments',
      read: false,
    },
    {
      id: 'notif-3',
      title: 'Monthly Wellness Check',
      message: "It's been 30 days since your last voice screening.",
      type: 'reminder',
      time: '1d ago',
      link: '/dashboard/scan',
      read: false,
    },
    {
      id: 'notif-4',
      title: 'Clinical Publication',
      message: 'New research report published: Acoustic Biomarkers in Central India.',
      type: 'research',
      time: '3d ago',
      link: '/#research',
      read: true,
    },
  ])

  const unreadCount = notifications.filter((n) => !n.read).length

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'results':
        return <FileText size={15} className="text-[#22D3EE]" />
      case 'appointment':
        return <Calendar size={15} className="text-[#6366F1]" />
      case 'reminder':
        return <Clock size={15} className="text-[#F59E0B]" />
      case 'research':
        return <BookOpen size={15} className="text-[#10B981]" />
      default:
        return <Bell size={15} className="text-gray-400" />
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="p-2.5 rounded-xl border transition-all hover:scale-105 active:scale-95 relative"
        style={{
          background: isDark ? '#111827' : '#FFFFFF',
          borderColor: isDark ? '#1F2937' : '#E2E8F0',
          color: isDark ? '#F9FAFB' : '#0F172A',
        }}
        aria-label="Notifications"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 absolute top-2 right-2 ring-2 ring-[#0A0F1E] animate-pulse" />
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border shadow-2xl z-50 overflow-hidden"
          style={{
            background: isDark ? '#111827' : '#FFFFFF',
            borderColor: isDark ? '#1F2937' : '#E2E8F0',
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between p-4 border-b"
            style={{ borderColor: isDark ? '#1F2937' : '#F1F5F9' }}
          >
            <div className="flex items-center gap-2">
              <h3 className="font-display font-bold text-sm" style={{ color: isDark ? '#F9FAFB' : '#0F172A' }}>
                Notifications
              </h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-red-500/15 text-red-400 border border-red-500/30">
                  {unreadCount} NEW
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[11px] font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                <CheckCheck size={13} />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y" style={{ borderColor: isDark ? '#1F2937' : '#F1F5F9' }}>
            {notifications.map((n) => (
              <Link
                key={n.id}
                href={n.link}
                onClick={() => {
                  setOpen(false)
                  setNotifications((prev) =>
                    prev.map((item) => (item.id === n.id ? { ...item, read: true } : item))
                  )
                }}
                className={`p-4 flex items-start gap-3 transition-colors block ${
                  !n.read
                    ? isDark
                      ? 'bg-indigo-500/5 hover:bg-indigo-500/10'
                      : 'bg-indigo-50/60 hover:bg-indigo-50'
                    : 'hover:bg-white/5'
                }`}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: isDark ? '#0A0F1E' : '#F8FAFC' }}
                >
                  {getIcon(n.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="text-xs font-semibold" style={{ color: isDark ? '#F9FAFB' : '#0F172A' }}>
                      {n.title}
                    </span>
                    <span className="text-[10px] font-mono text-gray-500">{n.time}</span>
                  </div>
                  <p className="text-xs text-gray-400 leading-snug line-clamp-2">
                    {n.message}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Footer */}
          <div
            className="p-3 text-center border-t text-[11px] font-mono text-gray-500"
            style={{ borderColor: isDark ? '#1F2937' : '#F1F5F9' }}
          >
            Jabalpur Medical College Alert Dispatch
          </div>
        </div>
      )}
    </div>
  )
}
