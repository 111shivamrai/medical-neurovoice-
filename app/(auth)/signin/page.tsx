'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, Loader2, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react'
import { AuthParticles } from '@/components/auth/AuthParticles'
import { Logo } from '@/components/Logo'
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { auth, googleProvider } from '@/lib/firebase'

function StatCounter({ target, suffix = '', label }: { target: number; suffix?: string; label: string }) {
  const [val, setVal] = useState(0)

  useEffect(() => {
    let startTimestamp: number | null = null
    const duration = 2200

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3)
      setVal(Math.floor(ease * target))
      if (progress < 1) {
        requestAnimationFrame(step)
      } else {
        setVal(target)
      }
    }
    requestAnimationFrame(step)
  }, [target])

  return (
    <div>
      <div className="font-display font-extrabold text-3xl sm:text-4xl text-[#22D3EE] tracking-tight">
        {val}
        {suffix}
      </div>
      <p className="text-xs sm:text-sm text-gray-400 mt-1 font-medium">{label}</p>
    </div>
  )
}

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [shake, setShake] = useState(false)

  const triggerShake = () => {
    setShake(true)
    setTimeout(() => setShake(false), 600)
  }

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password) {
      setError('Please provide both your registered email address and password.')
      triggerShake()
      return
    }

    setLoading(true)
    setError(null)

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password)
      router.push('/dashboard')
    } catch (err: any) {
      console.warn('Firebase sign-in error:', err?.code || err?.message)
      // Provide actionable clinical messages
      let msg = 'Incorrect email or password. Please verify your credentials.'
      if (err?.code === 'auth/user-not-found') {
        msg = 'No clinical account found matching this email address.'
      } else if (err?.code === 'auth/wrong-password' || err?.code === 'auth/invalid-credential') {
        msg = 'Invalid credentials. Please re-enter your clinical password.'
      } else if (err?.code === 'auth/too-many-requests') {
        msg = 'Account temporarily locked due to multiple failed attempts. Try again later.'
      } else if (err?.code === 'auth/network-request-failed') {
        msg = 'Network connection failed. Please check your internet connectivity.'
      }
      setError(msg)
      triggerShake()
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true)
    setError(null)

    try {
      await signInWithPopup(auth, googleProvider)
      router.push('/dashboard')
    } catch (err: any) {
      console.warn('Google sign-in error:', err?.code || err?.message)
      if (err?.code !== 'auth/popup-closed-by-user') {
        setError('Google authentication could not be completed. Please try again.')
      }
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#0A0F1E] text-white">
      {/* Left (60%): Dark atmospheric branding with particles */}
      <div className="relative hidden lg:flex lg:w-[60%] flex-col justify-between p-12 lg:p-16 border-r border-[#1F2937] overflow-hidden bg-[#070B16]">
        <AuthParticles />

        {/* Top Header */}
        <div className="relative z-10">
          <Logo size="lg" />
        </div>

        {/* Center Quote & Subtitle */}
        <div className="relative z-10 max-w-xl my-auto py-12">
          <span className="inline-block px-3.5 py-1 rounded-full text-xs font-mono font-semibold tracking-wider text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 mb-6">
            JABALPUR MEDICAL COLLEGE · NEUROLOGY AI
          </span>

          <blockquote className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.1] mb-8 text-white">
            "Early detection{' '}
            <span className="text-[#22D3EE] block">
              changes everything."
            </span>
          </blockquote>

          <p className="text-gray-400 text-base sm:text-lg leading-relaxed mb-12">
            Acoustic biomarkers capture subclinical vocal tremors, pitch variability, and semantic pauses years before motor disability occurs.
          </p>

          {/* 3 Animated Stats */}
          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-[#1F2937]/80">
            <StatCounter target={4} label="Disorders Screened" />
            <StatCounter target={30} suffix="s" label="Per Analysis" />
            <StatCounter target={20} suffix="+" label="Voice Biomarkers" />
          </div>
        </div>

        {/* Bottom Institutional Disclaimer */}
        <div className="relative z-10 flex items-center justify-between text-xs font-mono text-gray-500 border-t border-[#1F2937]/50 pt-4">
          <span>Jabalpur Medical College, Madhya Pradesh</span>
          <span>Screening Research Platform v2.4</span>
        </div>
      </div>

      {/* Right (40%): The Auth Form */}
      <div className="flex-1 lg:w-[40%] flex items-center justify-center p-6 sm:p-12 lg:p-14 relative bg-[#0A0F1E]">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8">
            <Logo size="md" />
          </div>

          <div className="mb-8">
            <h1 className="font-display font-bold text-3xl sm:text-4xl tracking-tight mb-2 text-white">
              Clinical Sign In
            </h1>
            <p className="text-sm text-gray-400">
              Access the NeuroVoice neurological screening portal
            </p>
          </div>

          {/* Inline Error Message (Never alert boxes!) */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -8, height: 0 }}
                className="mb-6 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 text-xs flex items-start gap-3"
              >
                <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Google Sign-In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading || loading}
            className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl font-semibold text-sm bg-[#111827] hover:bg-[#1A2337] border border-[#1F2937] text-white transition-all duration-200 active:scale-98 disabled:opacity-60 mb-6 shadow-sm"
          >
            {googleLoading ? (
              <Loader2 size={18} className="animate-spin text-cyan-400" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
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
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-[#1F2937]" />
            <span className="text-xs uppercase tracking-wider text-gray-500 font-mono">
              or credentials
            </span>
            <div className="flex-1 h-px bg-[#1F2937]" />
          </div>

          {/* Email / Password Form with Shake Animation */}
          <motion.form
            onSubmit={handleEmailSignIn}
            animate={shake ? { x: [-10, 10, -8, 8, -4, 4, 0] } : { x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Medical / Institutional Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="doctor@jmc.ac.in"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#111827] border border-[#1F2937] text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Password
                </label>
                <Link
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    alert('Password reset instructions will be sent to your institutional email.')
                  }}
                  className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-11 py-3 rounded-xl bg-[#111827] border border-[#1F2937] text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full py-3.5 px-6 rounded-xl font-display font-semibold text-sm text-white transition-all duration-300 hover:scale-[1.01] active:scale-98 disabled:opacity-60 flex items-center justify-center gap-2 mt-6 shadow-[0_0_30px_rgba(99,102,241,0.35)]"
              style={{
                background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin text-white" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Portal</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </motion.form>

          {/* Switch to Sign Up */}
          <p className="text-center text-xs text-gray-400 mt-8">
            Don't have a verified screening account?{' '}
            <Link href="/signup" className="font-semibold text-cyan-400 hover:text-cyan-300 transition-colors">
              Create an account →
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
