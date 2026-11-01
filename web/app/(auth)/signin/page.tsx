'use client'

import React, { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, Mail, Lock, Loader2, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { auth, googleProvider } from '@/lib/firebase'
import { setLocalUser, isDemoMode } from '@/lib/auth'

function SignInContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const nextRoute = searchParams.get('next') || '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password) {
      setError('Please provide both your registered email address and password.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      try {
        const userCred = await signInWithEmailAndPassword(auth, email.trim(), password)
        const user = userCred.user
        setLocalUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || email.split('@')[0],
          photoURL: user.photoURL,
          isDemo: false,
        })
        router.replace(nextRoute)
        return
      } catch (fbErr: any) {
        console.warn('Firebase sign-in note:', fbErr?.code || fbErr?.message)
        // If API key is not valid, missing, or offline, activate Demo User session!
        if (
          fbErr?.code === 'auth/api-key-not-valid' ||
          fbErr?.code === 'auth/invalid-api-key' ||
          fbErr?.message?.includes('api-key-not-valid') ||
          fbErr?.message?.includes('API key') ||
          isDemoMode()
        ) {
          const pseudoUid = `usr-${Math.abs(email.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0))}`
          const localSaved = localStorage.getItem(`neurovoice_user_${pseudoUid}`)
          const parsed = localSaved ? JSON.parse(localSaved) : null
          const displayName = parsed?.fullName || email.split('@')[0]

          setLocalUser({
            uid: pseudoUid,
            email: email.trim(),
            displayName,
            role: parsed?.role || 'patient',
            isDemo: true,
          })
          router.replace(nextRoute)
          return
        }

        let msg = 'Incorrect email or password. Please verify your credentials.'
        if (fbErr?.code === 'auth/user-not-found') {
          msg = 'No clinical account found matching this email address.'
        } else if (fbErr?.code === 'auth/wrong-password' || fbErr?.code === 'auth/invalid-credential') {
          msg = 'Invalid credentials. Please re-enter your password.'
        } else if (fbErr?.code === 'auth/too-many-requests') {
          msg = 'Account temporarily locked due to multiple failed attempts. Try again later.'
        }
        setError(msg)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDemoSignIn = () => {
    setLocalUser({
      uid: 'demo-clinician-01',
      email: 'demo@neurovoice.org',
      displayName: 'Clinical Demo User',
      role: 'patient',
      isDemo: true,
    })
    router.replace(nextRoute)
  }

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true)
    setError(null)

    try {
      const cred = await signInWithPopup(auth, googleProvider)
      setLocalUser({
        uid: cred.user.uid,
        email: cred.user.email,
        displayName: cred.user.displayName,
        photoURL: cred.user.photoURL,
        isDemo: false,
      })
      router.replace(nextRoute)
    } catch (err: any) {
      console.warn('Google sign-in error:', err?.code || err?.message)
      if (
        err?.code === 'auth/api-key-not-valid' ||
        err?.code === 'auth/invalid-api-key' ||
        isDemoMode()
      ) {
        handleDemoSignIn()
      } else if (err?.code !== 'auth/popup-closed-by-user') {
        setError('Google authentication could not be completed. Please try again.')
      }
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-md mx-auto w-full space-y-8">
        {/* Logo and Header */}
        <div className="text-center space-y-2">
          <Logo size="lg" className="justify-center" />
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-[var(--text)]">
            Welcome back to NeuroVoice
          </h1>
          <p className="text-xs text-[var(--muted)]">
            Sign in to access your screening command center and records
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-300 flex items-start gap-3">
            <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Card Form */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] space-y-5">
          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--text)]">
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  className="input-clinical w-full pl-10"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[var(--text)]">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-clinical w-full pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full text-xs py-3 rounded-xl shadow-sm flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="relative flex items-center justify-center py-2">
            <div className="border-t border-[var(--border)] w-full" />
            <span className="bg-[var(--surface)] px-3 text-[11px] font-mono uppercase text-[var(--muted)] shrink-0">
              or continue with
            </span>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="btn-ghost w-full py-2.5 rounded-xl text-xs font-medium flex items-center justify-center gap-2"
          >
            {googleLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>Sign in with Google</span>
          </button>

          {/* Quick Demo Login Option */}
          <button
            type="button"
            onClick={handleDemoSignIn}
            className="w-full py-2.5 rounded-xl text-xs font-semibold border border-[var(--primary)]/30 text-[var(--primary)] bg-[var(--primary)]/5 hover:bg-[var(--primary)]/10 transition-colors flex items-center justify-center gap-1.5"
          >
            <ShieldCheck size={15} />
            <span>Continue as Demo Account (Instant Access)</span>
          </button>
        </div>

        {/* Create account link */}
        <div className="text-center text-xs text-[var(--muted)]">
          New here?{' '}
          <Link
            href={`/signup?next=${encodeURIComponent(nextRoute)}`}
            className="font-semibold text-[var(--primary)] hover:underline"
          >
            Create account →
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] text-[var(--muted)]">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  )
}
