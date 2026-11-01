'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Bell, CheckCheck, FileText, Calendar, Clock, BookOpen, X } from 'lucide-react'

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

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'Screening Completed',
      message: 'Your vocal biomarker screening was computed. Results are available.',
      type: 'results',
      time: '15m ago',
      link: '/dashboard/history',
      read: false,
    },
    {
      id: 'notif-2',
      title: 'Consultation Request Sent',
      message: 'Your specialist appointment request is registered. Awaiting clinic confirmation.',
      type: 'appointment',
      time: '3h ago',
      link: '/dashboard/care',
      read: false,
    },
    {
      id: 'notif-3',
      title: 'Acoustic Baseline Reminder',
      message: 'Recommended periodic vocal wellness check: 30 days since last evaluation.',
      type: 'reminder',
      time: '1d ago',
      link: '/dashboard/scan',
      read: false,
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
        return <FileText size={15} className="text-[var(--accent)]" />
      case 'appointment':
        return <Calendar size={15} className="text-[var(--primary)]" />
      case 'reminder':
        return <Clock size={15} className="text-[var(--warning)]" />
      default:
        return <Bell size={15} className="text-[var(--muted)]" />
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="w-9 h-9 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)] flex items-center justify-center transition-colors relative hover:border-[var(--primary)]"
        aria-label="Notifications"
      >
        <Bell size={17} />
        {/* CSS-Only 8px Red Dot positioned top-right of bell icon with pulse animation */}
        {unreadCount > 0 && (
          <span className="w-2 h-2 rounded-full bg-[var(--danger)] absolute top-2 right-2 animate-pulse" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-md)] z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-sm text-[var(--text)]">Notifications</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300">
                  {unreadCount} unread
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-xs text-[var(--primary)] hover:underline flex items-center gap-1 font-medium"
              >
                <CheckCheck size={13} />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-[var(--border)]">
            {notifications.map((item) => (
              <Link
                key={item.id}
                href={item.link}
                onClick={() => {
                  setNotifications((prev) =>
                    prev.map((n) => (n.id === item.id ? { ...n, read: true } : n))
                  )
                  setOpen(false)
                }}
                className={`p-4 flex items-start gap-3 transition-colors block ${
                  !item.read ? 'bg-[var(--surface-2)]/60' : 'hover:bg-[var(--surface-2)]/30'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center shrink-0">
                  {getIcon(item.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="text-xs font-semibold text-[var(--text)] truncate">
                      {item.title}
                    </span>
                    <span className="text-[10px] font-mono text-[var(--muted)] shrink-0">
                      {item.time}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--muted)] leading-relaxed">
                    {item.message}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Footer */}
          <div className="p-2.5 border-t border-[var(--border)] bg-[var(--surface-2)]/40 text-center text-xs">
            <Link
              href="/dashboard/history"
              onClick={() => setOpen(false)}
              className="text-xs font-semibold text-[var(--primary)] hover:underline"
            >
              View Screening History →
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
