import React, { ReactNode } from 'react'
import { DashboardNav } from '@/components/dashboard/DashboardNav'
import { FloatingDock } from '@/components/dashboard/FloatingDock'
import { OfflineBanner } from '@/components/dashboard/OfflineBanner'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
      <OfflineBanner />
      <DashboardNav />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32">
        {children}
      </main>
      <FloatingDock />
    </div>
  )
}
