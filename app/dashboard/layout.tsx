import React, { ReactNode } from 'react'
import { DashboardNav } from '@/components/dashboard/DashboardNav'
import { OfflineBanner } from '@/components/dashboard/OfflineBanner'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#0A0F1E] text-white">
      <OfflineBanner />
      <DashboardNav />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
