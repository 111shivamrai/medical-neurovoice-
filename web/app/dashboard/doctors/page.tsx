'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DoctorsRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/dashboard/care?tab=doctors')
  }, [router])

  return (
    <div className="min-h-[50vh] flex items-center justify-center text-xs text-[var(--muted)]">
      Redirecting to Care Command Center...
    </div>
  )
}
