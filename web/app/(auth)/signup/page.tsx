'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  Building2,
  Loader2,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Stethoscope,
  GraduationCap,
  HeartPulse,
  UserCheck,
} from 'lucide-react'
import { AuthParticles } from '@/components/auth/AuthParticles'
import { Logo } from '@/components/Logo'
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db, googleProvider } from '@/lib/firebase'

type RoleId = 'doctor' | 'student' | 'asha' | 'personal'

interface RoleOption {
  id: RoleId
  title: string
  subtitle: string
  icon: any
  color: string
  badge: string
}

export default function SignUpPage() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2>(1)
  const [selectedRole, setSelectedRole] = useState<RoleId | null>('doctor')

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [institution, setInstitution] = useState('Jabalpur Medical College')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [consent, setConsent] = useState(false)

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [shake, setShake] = useState(false)

  const roles: RoleOption[] = [
    {
      id: 'doctor',
      title: 'Neurologist / Doctor',
      subtitle: 'Clinical OPD screening, patient records, PDF referral generation',
      icon: Stethoscope,
      color: '#6366F1',
      badge: 'Clinical Practice',
    },
    {
      id: 'student',
      title: 'Medical Student',
      subtitle: 'Academic research access, voice dataset exploration, thesis case studies',
      icon: GraduationCap,
      color: '#8B5CF6',
      badge: 'Research Access',
    },
    {
      id: 'asha',
      title: 'ASHA / Health Worker',
      subtitle: 'Simple 3-colour triage (Green/Yellow/Red), regional Hindi prompt',
      icon: HeartPulse,
      color: '#22D3EE',
      badge: 'Rural Care',
    },
    {
      id: 'personal',
      title: 'Personal Screening',
      subtitle: 'Self-monitoring or family screening with clear acoustic indicators',
      icon: UserCheck,
      color: '#10B981',
      badge: 'Individual',
    },
  ]

  const triggerShake = () => {
    setShake(true)
    setTimeout(() => setShake(false), 600)
  }

  const handleStep1Continue = () => {
    if (!selectedRole) {
      setError('Please choose a role to proceed.')
      triggerShake()
      return
    }
    setError(null)
    setStep(2)
  }

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault()

    // Form Validations
    if (!fullName.trim() || !email.trim() || !password) {
      setError('Please fill in all mandatory clinical profile fields.')
      triggerShake()
      return
    }

    if (password.length < 8) {
      setError('Password must contain at least 8 characters for security.')
      triggerShake()
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.')
      triggerShake()
      return
    }

    if (!consent) {
      setError('You must acknowledge the medical research screening consent.')
      triggerShake()
      return
    }

    setLoading(true)
    setError(null)

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password)
      await updateProfile(userCredential.user, {
        displayName: fullName.trim(),
      })

      // Try saving profile to Firestore (failsafe if offline/placeholder config)
      try {
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          uid: userCredential.user.uid,
          displayName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          institution: institution.trim(),
          role: selectedRole,
          consentTimestamp: new Date().toISOString(),
          onboardingCompleted: false,
        })
      } catch (dbErr) {
        console.warn('Firestore write warning:', dbErr)
      }

      // Forward to Onboarding
      router.push('/onboarding')
    } catch (err: any) {
      console.warn('Firebase registration error:', err?.code || err?.message)
      let msg = 'Account registration could not be completed.'
      if (err?.code === 'auth/email-already-in-use') {
        msg = 'An account with this email address already exists. Please sign in.'
      } else if (err?.code === 'auth/invalid-email') {
        msg = 'The email address format is invalid.'
      } else if (err?.code === 'auth/weak-password') {
        msg = 'Password is too weak. Please use letters, numbers, and symbols.'
      }
      setError(msg)
      triggerShake()
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true)
    setError(null)

    try {
      const res = await signInWithPopup(auth, googleProvider)
      try {
        await setDoc(doc(db, 'users', res.user.uid), {
          uid: res.user.uid,
          displayName: res.user.displayName,
          email: res.user.email,
          role: selectedRole || 'personal',
          consentTimestamp: new Date().toISOString(),
          onboardingCompleted: false,
        })
      } catch (dbErr) {
        console.warn('Firestore write warning:', dbErr)
      }
      router.push('/onboarding')
    } catch (err: any) {
      if (err?.code !== 'auth/popup-closed-by-user') {
        setError('Google registration could not be completed. Please try again.')
      }
    } finally {
      setGoogleLoading(false)
    }
  }

  const requiresInstitution = selectedRole === 'doctor' || selectedRole === 'student'

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#0A0F1E] text-white">
      {/* Left (60%): Dark atmospheric branding with particles */}
      <div className="relative hidden lg:flex lg:w-[60%] flex-col justify-between p-12 lg:p-16 border-r border-[#1F2937] overflow-hidden bg-[#070B16]">
        <AuthParticles />

        {/* Top Header */}
        <div className="relative z-10">
          <Logo size="lg" />
        </div>

        {/* Center Content */}
        <div className="relative z-10 max-w-xl my-auto py-12">
          <span className="inline-block px-3.5 py-1 rounded-full text-xs font-mono font-semibold tracking-wider text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 mb-6">
            ADAPTIVE CLINICAL ROLE ARCHITECTURE
          </span>

          <blockquote className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.1] mb-8 text-white">
            "Your voice carries{' '}
            <span className="text-[#22D3EE] block">
              the truth."
            </span>
          </blockquote>

          <p className="text-gray-400 text-base sm:text-lg leading-relaxed mb-8">
            Tailored neurological screening workflows configured specifically for your clinical practice,
            academic research, or rural health post across Madhya Pradesh.
          </p>

          <div className="space-y-3 pt-6 border-t border-[#1F2937]/80 text-sm">
            <div className="flex items-center gap-3 text-gray-300">
              <CheckCircle2 size={18} className="text-emerald-400" />
              <span>Full compliance with Jabalpur Medical College clinical screening protocols</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <CheckCircle2 size={18} className="text-cyan-400" />
              <span>Hindi & English acoustic feature extraction pipeline</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <CheckCircle2 size={18} className="text-indigo-400" />
              <span>Instant calibrated risk scores across 4 neurological conditions</span>
            </div>
          </div>
        </div>

        {/* Bottom Tagline */}
        <div className="relative z-10 flex items-center justify-between text-xs font-mono text-gray-500 border-t border-[#1F2937]/50 pt-4">
          <span>Jabalpur Medical College · Government Medical Institution</span>
          <span>Security: 256-Bit Cryptographic Storage</span>
        </div>
      </div>

      {/* Right (40%): The Auth Form */}
      <div className="flex-1 lg:w-[40%] flex items-center justify-center p-6 sm:p-12 lg:p-14 relative bg-[#0A0F1E]">
        <div className="w-full max-w-lg">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-6">
            <Logo size="md" />
          </div>

          {/* Stepper Header */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#1F2937]">
            <div>
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400">
                Step {step} of 2
              </span>
              <h2 className="font-display font-bold text-2xl sm:text-3xl tracking-tight text-white mt-1">
                {step === 1 ? 'Choose Your Role' : 'Create Account'}
              </h2>
            </div>
            {step === 2 && (
              <button
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft size={14} />
                <span>Change Role</span>
              </button>
            )}
          </div>

          {/* Inline Error State */}
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

          {/* STEP 1: ROLE SELECTION (Full cards, not a dropdown!) */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
              className="space-y-4"
            >
              <p className="text-xs text-gray-400 mb-2">
                Select your clinical or operational persona. Interface, terminology, and PDF outputs will adapt to your workflow.
              </p>

              <div className="space-y-3">
                {roles.map((r) => {
                  const Icon = r.icon
                  const isSelected = selectedRole === r.id

                  return (
                    <div
                      key={r.id}
                      onClick={() => setSelectedRole(r.id)}
                      className="p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all duration-200 flex items-start gap-4 relative group"
                      style={{
                        background: isSelected ? 'rgba(99, 102, 241, 0.12)' : '#111827',
                        borderColor: isSelected ? r.color : '#1F2937',
                        boxShadow: isSelected ? `0 0 25px ${r.color}30` : 'none',
                        transform: isSelected ? 'scale(1.01)' : 'scale(1)',
                      }}
                    >
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 transition-transform group-hover:scale-105"
                        style={{
                          background: `${r.color}20`,
                          color: r.color,
                          border: `1px solid ${r.color}40`,
                        }}
                      >
                        <Icon size={22} />
                      </div>

                      <div className="flex-1 pr-6">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-display font-bold text-base text-white">
                            {r.title}
                          </h4>
                          <span
                            className="text-[10px] font-mono px-2 py-0.5 rounded-full border"
                            style={{
                              color: r.color,
                              borderColor: `${r.color}40`,
                              background: `${r.color}15`,
                            }}
                          >
                            {r.badge}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed">
                          {r.subtitle}
                        </p>
                      </div>

                      {/* Radio Indicator */}
                      <div
                        className="w-5 h-5 rounded-full border flex items-center justify-center absolute right-4 top-4"
                        style={{
                          borderColor: isSelected ? r.color : '#374151',
                          background: isSelected ? r.color : 'transparent',
                        }}
                      >
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    </div>
                  )
                })}
              </div>

              <button
                type="button"
                onClick={handleStep1Continue}
                className="w-full py-4 px-6 rounded-xl font-display font-semibold text-sm text-white transition-all duration-300 hover:scale-[1.01] active:scale-98 flex items-center justify-center gap-2 mt-8 shadow-[0_0_30px_rgba(99,102,241,0.35)]"
                style={{
                  background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                }}
              >
                <span>Continue with Selected Role</span>
                <ArrowRight size={16} />
              </button>

              <p className="text-center text-xs text-gray-400 mt-6">
                Already registered?{' '}
                <Link href="/signin" className="font-semibold text-cyan-400 hover:text-cyan-300 transition-colors">
                  Sign in here →
                </Link>
              </p>
            </motion.div>
          )}

          {/* STEP 2: USER DETAILS FORM */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
            >
              {/* Google Quick Button */}
              <button
                type="button"
                onClick={handleGoogleSignUp}
                disabled={googleLoading || loading}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl font-semibold text-sm bg-[#111827] hover:bg-[#1A2337] border border-[#1F2937] text-white transition-all duration-200 active:scale-98 disabled:opacity-60 mb-6 shadow-sm"
              >
                {googleLoading ? (
                  <Loader2 size={16} className="animate-spin text-cyan-400" />
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
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
                <span>Sign up with Google</span>
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-px bg-[#1F2937]" />
                <span className="text-xs uppercase tracking-wider text-gray-500 font-mono">
                  or fill details
                </span>
                <div className="flex-1 h-px bg-[#1F2937]" />
              </div>

              <motion.form
                onSubmit={handleCreateAccount}
                animate={shake ? { x: [-10, 10, -8, 8, -4, 4, 0] } : { x: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
              >
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Dr. Rajesh Sharma"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#111827] border border-[#1F2937] text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#6366F1]"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="r.sharma@jmc.ac.in"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#111827] border border-[#1F2937] text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#6366F1]"
                    />
                  </div>
                </div>

                {/* Phone & Institution in 2 cols */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98260 12345"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#111827] border border-[#1F2937] text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#6366F1]"
                      />
                    </div>
                  </div>

                  {requiresInstitution && (
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                        Institution / College *
                      </label>
                      <div className="relative">
                        <Building2 size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          required
                          value={institution}
                          onChange={(e) => setInstitution(e.target.value)}
                          placeholder="Jabalpur Medical College"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#111827] border border-[#1F2937] text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#6366F1]"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Passwords in 2 cols */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                      Password *
                    </label>
                    <div className="relative">
                      <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min 8 chars"
                        className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-[#111827] border border-[#1F2937] text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#6366F1]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Repeat password"
                        className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-[#111827] border border-[#1F2937] text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#6366F1]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Consent Checkbox (REQUIRED) */}
                <div className="pt-2">
                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded border-[#374151] bg-[#111827] text-[#6366F1] focus:ring-[#6366F1]"
                    />
                    <span className="text-xs text-gray-400 leading-relaxed">
                      I understand that <strong className="text-gray-200">NeuroVoice is a research screening tool, not a diagnostic device</strong>.
                      Clinical interpretations must be validated by a certified neurologist.
                    </span>
                  </label>
                </div>

                {/* Create Account Button */}
                <button
                  type="submit"
                  disabled={loading || googleLoading}
                  className="w-full py-3.5 px-6 rounded-xl font-display font-semibold text-sm text-white transition-all duration-300 hover:scale-[1.01] active:scale-98 disabled:opacity-60 flex items-center justify-center gap-2 mt-4 shadow-[0_0_35px_rgba(99,102,241,0.4)]"
                  style={{
                    background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin text-white" />
                      <span>Creating Clinical Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account →</span>
                    </>
                  )}
                </button>
              </motion.form>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
