'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Logo } from '@/components/Logo'
import { getLocalUser, setLocalUser } from '@/lib/auth'
import {
  Stethoscope,
  GraduationCap,
  HeartPulse,
  User,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
} from 'lucide-react'

function OnboardingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const source = searchParams.get('source') || 'google'

  const [currentUser, setCurrentUser] = useState<any>(null)
  const [dob, setDob] = useState('')
  const [sex, setSex] = useState<'Male' | 'Female' | 'Prefer not to say' | ''>('')
  const [role, setRole] = useState<'doctor' | 'student' | 'community' | 'patient' | ''>('')
  const [termsAgreed, setTermsAgreed] = useState(false)
  const [consentAgreed, setConsentAgreed] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const user = getLocalUser()
    if (!user) {
      router.replace('/signin')
      return
    }
    setCurrentUser(user)
  }, [router])

  const roleOptions = [
    {
      id: 'doctor' as const,
      title: 'Neurologist / Doctor',
      desc: 'Clinical OPD screening, differential diagnostic reports, patient tracking.',
      icon: Stethoscope,
      badge: '🩺 Clinical OPD',
    },
    {
      id: 'student' as const,
      title: 'Medical Student',
      desc: 'Learning clinical acoustics, observing vocal biomarker distributions.',
      icon: GraduationCap,
      badge: '📚 Academic Learning',
    },
    {
      id: 'community' as const,
      title: 'Community / Personal Health',
      desc: 'Public health screenings, community awareness, specialist referrals.',
      icon: HeartPulse,
      badge: '🌾 Public Health',
    },
    {
      id: 'patient' as const,
      title: 'Personal Health Screening',
      desc: 'Screen personal or family voice health with objective baseline tracking.',
      icon: User,
      badge: '👤 Personal Monitoring',
    },
  ]

  const isFormValid =
    dob.trim() !== '' &&
    sex !== '' &&
    role !== '' &&
    termsAgreed &&
    consentAgreed

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid || !currentUser) return

    setSubmitting(true)
    setError(null)

    try {
      const payload = {
        uid: currentUser.uid,
        name: currentUser.displayName || currentUser.email?.split('@')[0] || 'User',
        email: currentUser.email,
        dob,
        sex,
        role,
        photoURL: currentUser.photoURL || null,
        createdAt: new Date().toISOString(),
        onboardingComplete: true,
      }

      // POST to FastAPI backend
      const res = await fetch('/api/users/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        console.warn('Backend user registration fallback to local state')
      }

      // Update local storage session
      setLocalUser({
        ...currentUser,
        role,
        gender: sex,
        createdAt: payload.createdAt,
      })

      // Set cookie for route protection middleware
      document.cookie = `firebase-token=${currentUser.uid}; path=/; max-age=604800; SameSite=Lax`

      router.replace('/dashboard')
    } catch (err: any) {
      console.error('Onboarding submit error:', err)
      setError('Unable to save profile setup. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] text-[var(--muted)]">
        Loading user setup...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-2xl mx-auto w-full space-y-8">
        <div className="text-center space-y-2">
          <Logo size="lg" className="justify-center" />
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-[var(--text)]">
            Complete your NeuroVoice Profile
          </h1>
          <p className="text-xs sm:text-sm text-[var(--muted)]">
            Welcome! A few quick details are required to calibrate accurate age-group acoustic benchmarks.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-md space-y-6">
          {/* Pre-filled Read-Only Account Details */}
          <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] flex items-center gap-4">
            {currentUser.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt="Profile"
                className="w-12 h-12 rounded-full object-cover border border-[var(--border)]"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-[var(--primary)] text-white font-bold text-lg flex items-center justify-center">
                {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : 'U'}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="text-sm font-bold text-[var(--text)] truncate">
                {currentUser.displayName || 'Google Account'}
              </div>
              <div className="text-xs text-[var(--muted)] truncate">
                {currentUser.email}
              </div>
            </div>
            <span className="text-[10px] font-mono font-semibold uppercase px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              Verified Google
            </span>
          </div>

          {/* Date of Birth & Biological Sex */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--text)] flex items-center gap-1.5">
                <Calendar size={14} className="text-[var(--primary)]" />
                <span>Date of Birth *</span>
              </label>
              <input
                type="date"
                required
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-xs text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
              />
              <span className="text-[10px] text-[var(--muted)]">Required for age-calibrated normative acoustic analysis</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--text)]">
                Biological Sex *
              </label>
              <select
                required
                value={sex}
                onChange={(e) => setSex(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-xs text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
              >
                <option value="">Select biological sex...</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
              <span className="text-[10px] text-[var(--muted)]">Used to select standard fundamental pitch baselines</span>
            </div>
          </div>

          {/* Role Selection (4 Large Cards) */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[var(--text)] block">
              Select Your Role in NeuroVoice *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {roleOptions.map((opt) => {
                const Icon = opt.icon
                const isSelected = role === opt.id
                return (
                  <div
                    key={opt.id}
                    onClick={() => setRole(opt.id)}
                    className={`card-lift p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between space-y-2 ${
                      isSelected
                        ? 'border-[var(--primary)] bg-[var(--primary)]/5 shadow-sm'
                        : 'border-[var(--border)] bg-[var(--surface-2)]/40 hover:border-[var(--muted)]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[var(--text)]">
                        {opt.badge}
                      </span>
                      {isSelected ? (
                        <CheckCircle2 size={16} className="text-[var(--primary)]" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-[var(--border)]" />
                      )}
                    </div>
                    <div className="text-xs font-semibold text-[var(--text)]">
                      {opt.title}
                    </div>
                    <p className="text-[11px] text-[var(--muted)] leading-snug">
                      {opt.desc}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Mandatory Checkboxes */}
          <div className="space-y-3 pt-3 border-t border-[var(--border)]">
            <label className="flex items-start gap-2.5 text-xs text-[var(--text)] cursor-pointer">
              <input
                type="checkbox"
                required
                checked={consentAgreed}
                onChange={(e) => setConsentAgreed(e.target.checked)}
                className="mt-0.5 rounded border-[var(--border)] text-[var(--primary)] focus:ring-0"
              />
              <span className="leading-snug">
                * I understand that NeuroVoice provides voice screening support, not a medical diagnosis. I will consult a doctor for any health concerns.
              </span>
            </label>

            <label className="flex items-start gap-2.5 text-xs text-[var(--text)] cursor-pointer">
              <input
                type="checkbox"
                required
                checked={termsAgreed}
                onChange={(e) => setTermsAgreed(e.target.checked)}
                className="mt-0.5 rounded border-[var(--border)] text-[var(--primary)] focus:ring-0"
              />
              <span className="leading-snug">
                * I agree to the Terms of Use and Privacy Policy.
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid || submitting}
            className="btn-primary w-full py-3.5 px-6 rounded-xl text-sm font-semibold text-white shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{submitting ? 'Setting up account...' : 'Complete Setup →'}</span>
            <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  )
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <OnboardingContent />
    </Suspense>
  )
}
