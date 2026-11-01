'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AppointmentsRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/dashboard/care?tab=appointments')
  }, [router])

  return (
    <div className="min-h-[50vh] flex items-center justify-center text-xs text-[var(--muted)]">
      Redirecting to Appointments Center...
    </div>
  )
}
