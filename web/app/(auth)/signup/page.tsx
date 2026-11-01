'use client'

import React, { useState, useId, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
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
  Camera,
  MapPin,
  Calendar,
  Shield,
  FileText,
} from 'lucide-react'
import { Logo } from '@/components/Logo'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { setLocalUser, isDemoMode } from '@/lib/auth'

type RoleId = 'patient' | 'doctor' | 'chw' | 'researcher'

function SignUpContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const nextRoute = searchParams.get('next') || '/dashboard'

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)

  // Step 1: Account credentials
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // Step 2: Role
  const [role, setRole] = useState<RoleId>('patient')

  // Step 3: Demographics & Optional info
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [sex, setSex] = useState<'Male' | 'Female' | 'Prefer not to say'>('Prefer not to say')
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [mobile, setMobile] = useState('')
  const [city, setCity] = useState('')
  const [stateName, setStateName] = useState('')
  const [preferredLang, setPreferredLang] = useState<'Hindi' | 'English'>('Hindi')
  const [motherTongue, setMotherTongue] = useState('')
  const [occupation, setOccupation] = useState('')

  // Step 4: Role-specific details & Consents
  const [doctorRegNumber, setDoctorRegNumber] = useState('')
  const [institution, setInstitution] = useState('')
  const [chwDistrict, setChwDistrict] = useState('')
  const [chwBlock, setChwBlock] = useState('')

  const [hasPriorDiagnosis, setHasPriorDiagnosis] = useState(false)
  const [priorDiagnosisDetails, setPriorDiagnosisDetails] = useState('')
  const [priorDiagnosisConsent, setPriorDiagnosisConsent] = useState(false)

  const [termsConsent, setTermsConsent] = useState(false)
  const [screeningLimitsConsent, setScreeningLimitsConsent] = useState(false)

  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  // Password Strength Calculator
  const getPasswordStrength = (pass: string) => {
    let score = 0
    if (pass.length >= 8) score += 25
    if (/[A-Z]/.test(pass)) score += 25
    if (/[0-9]/.test(pass)) score += 25
    if (/[^A-Za-z0-9]/.test(pass)) score += 25
    return score
  }

  const passStrength = getPasswordStrength(password)

  // Validation per step
  const isStep1Valid =
    fullName.trim().length >= 2 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
    password.length >= 8 &&
    password === confirmPassword

  const isStep2Valid = !!role

  const isStep3Valid = dateOfBirth.trim().length > 0 && !!sex

  const isStep4Valid =
    termsConsent &&
    screeningLimitsConsent &&
    (role !== 'doctor' || (doctorRegNumber.trim().length > 0 && institution.trim().length > 0)) &&
    (role !== 'chw' || (chwDistrict.trim().length > 0 && chwBlock.trim().length > 0)) &&
    (!hasPriorDiagnosis || priorDiagnosisConsent)

  // Handle Photo File Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Please choose an image under 2MB.')
        return
      }
      const reader = new FileReader()
      reader.onload = (evt) => {
        setPhotoPreview(evt.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Submit Handler
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isStep4Valid) return

    setLoading(true)
    setServerError(null)

    let userId = `usr-${Date.now().toString(36)}`
    let isDemo = isDemoMode()

    try {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        const user = userCredential.user
        userId = user.uid

        // Update Firebase Profile
        await updateProfile(user, {
          displayName: fullName,
          photoURL: photoPreview || undefined,
        })
      } catch (fbErr: any) {
        console.warn('Firebase registration notice:', fbErr?.code || fbErr?.message)
        // If API key is not valid, missing, or offline, smoothly activate Demo Session
        if (
          fbErr?.code === 'auth/api-key-not-valid' ||
          fbErr?.code === 'auth/invalid-api-key' ||
          fbErr?.message?.includes('api-key-not-valid') ||
          fbErr?.message?.includes('API key') ||
          fbErr?.code === 'auth/network-request-failed' ||
          isDemo
        ) {
          isDemo = true
          console.info('Activated NeuroVoice clinical demo mode session.')
        } else if (fbErr?.code === 'auth/email-already-in-use') {
          setServerError('An account with this email already exists. Please sign in instead.')
          setLoading(false)
          return
        } else {
          // Fall back gracefully so user is never blocked by external config
          isDemo = true
        }
      }

      // Store extended demographic & clinical role data
      const userDoc = {
        uid: userId,
        fullName,
        email,
        role,
        dateOfBirth,
        sex,
        mobile: mobile ? `+91 ${mobile.replace(/^\+91/, '').trim()}` : null,
        city: city || null,
        state: stateName || null,
        preferredLanguage: preferredLang,
        motherTongue: motherTongue || null,
        occupation: occupation || null,
        photoURL: photoPreview || null,
        roleDetails: {
          doctorRegNumber: role === 'doctor' ? doctorRegNumber : null,
          institution: role === 'doctor' ? institution : null,
          doctorStatus: role === 'doctor' ? 'pending_verification' : null,
          chwDistrict: role === 'chw' ? chwDistrict : null,
          chwBlock: role === 'chw' ? chwBlock : null,
        },
        healthHistory: {
          hasPriorDiagnosis,
          priorDiagnosisDetails: hasPriorDiagnosis ? priorDiagnosisDetails : null,
        },
        consents: {
          termsConsent: true,
          screeningLimitsConsent: true,
          priorDiagnosisConsent: hasPriorDiagnosis ? priorDiagnosisConsent : false,
          consentedAt: new Date().toISOString(),
        },
        createdAt: new Date().toISOString(),
        isDemo,
      }

      // Save user profile locally and try Firestore
      try {
        if (!isDemo) {
          await setDoc(doc(db, 'users', userId), userDoc)
        }
      } catch {
        // ignore Firestore error in demo mode
      }

      localStorage.setItem(`neurovoice_user_${userId}`, JSON.stringify(userDoc))
      setLocalUser({
        uid: userId,
        email,
        displayName: fullName,
        photoURL: photoPreview || null,
        role,
        isDemo,
      })

      router.replace(nextRoute)
    } catch (err: any) {
      console.error('Registration error:', err)
      if (err?.code === 'auth/email-already-in-use') {
        setServerError('An account with this email already exists. Please sign in instead.')
      } else {
        setServerError(err?.message || 'Registration failed. Please check your details.')
      }
      setLoading(false)
    }
  }

  const roles = [
    {
      id: 'patient' as RoleId,
      title: 'Individual / Patient',
      desc: 'Screen personal or family voice health with objective baseline tracking.',
      icon: UserCheck,
      color: 'var(--primary)',
    },
    {
      id: 'doctor' as RoleId,
      title: 'Clinician / Neurologist',
      desc: 'Clinical OPD screening, differential reports, patient tracking.',
      icon: Stethoscope,
      color: '#1E40AF',
    },
    {
      id: 'chw' as RoleId,
      title: 'Community Health Worker (ASHA)',
      desc: 'Simple three-tier triage (Green/Yellow/Red) and referral slips in rural clinics.',
      icon: HeartPulse,
      color: '#0D7377',
    },
    {
      id: 'researcher' as RoleId,
      title: 'Academic Researcher / Student',
      desc: 'Access 20+ acoustic feature vectors and open acoustic benchmark datasets.',
      icon: GraduationCap,
      color: '#7C3AED',
    },
  ]

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-xl mx-auto w-full space-y-8">
        {/* Header & Logo */}
        <div className="text-center space-y-2">
          <Logo size="lg" className="justify-center" />
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-[var(--text)]">
            Create your NeuroVoice Account
          </h1>
          <p className="text-xs text-[var(--muted)]">
            Join the vocal biomarker screening platform for public neurological health
          </p>
        </div>

        {/* 4-Step Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono font-semibold text-[var(--muted)]">
            <span>Step {step} of 4: {['Account', 'Role', 'Demographics', 'Verification & Consent'][step - 1]}</span>
            <span>{step * 25}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-[var(--border)] overflow-hidden">
            <div
              className="h-full bg-[var(--primary)] transition-all duration-300"
              style={{ width: `${step * 25}%` }}
            />
          </div>
        </div>

        {/* Server Error Message */}
        {serverError && (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-300 flex items-start gap-3">
            <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-500" />
            <span>{serverError}</span>
          </div>
        )}

        {/* Card Form */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] space-y-6">
          {/* STEP 1: Account Credentials */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-display font-bold text-[var(--text)]">
                Step 1: Account Information
              </h2>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--text)]">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Dr. Rajesh Sharma"
                    className="input-clinical w-full pl-10"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--text)]">
                  Email Address <span className="text-red-500">*</span>
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
                <label className="text-xs font-semibold text-[var(--text)]">
                  Password (min 8 characters) <span className="text-red-500">*</span>
                </label>
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

                {/* Password Strength Meter */}
                {password && (
                  <div className="space-y-1 pt-1">
                    <div className="h-1.5 w-full rounded-full bg-[var(--surface-2)] overflow-hidden">
                      <div
                        className={`h-full transition-all duration-200 ${
                          passStrength <= 25
                            ? 'bg-red-500 w-1/4'
                            : passStrength <= 50
                            ? 'bg-amber-500 w-2/4'
                            : passStrength <= 75
                            ? 'bg-blue-500 w-3/4'
                            : 'bg-emerald-500 w-full'
                        }`}
                      />
                    </div>
                    <span className="text-[11px] font-mono text-[var(--muted)]">
                      Strength: {passStrength <= 25 ? 'Weak' : passStrength <= 50 ? 'Fair' : passStrength <= 75 ? 'Good' : 'Strong'}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--text)]">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-clinical w-full pl-10"
                  />
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <span className="text-[11px] text-red-500">Passwords do not match</span>
                )}
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  disabled={!isStep1Valid}
                  onClick={() => setStep(2)}
                  className="btn-primary text-xs py-2.5 px-6 rounded-xl disabled:opacity-50"
                >
                  Continue to Role Selection →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Role Selection */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-display font-bold text-[var(--text)]">
                Step 2: Choose Your Primary Role
              </h2>
              <p className="text-xs text-[var(--muted)]">
                This customizes your screening dashboard tools and reporting format.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                {roles.map((r) => {
                  const Icon = r.icon
                  const selected = role === r.id
                  return (
                    <div
                      key={r.id}
                      onClick={() => setRole(r.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between space-y-2.5 ${
                        selected
                          ? 'border-[var(--primary)] bg-[var(--surface-2)] ring-2 ring-[var(--primary)]/15 shadow-sm'
                          : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--muted)]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                          style={{ backgroundColor: r.color }}
                        >
                          <Icon size={16} />
                        </div>
                        {selected && <CheckCircle2 size={16} className="text-[var(--primary)]" />}
                      </div>
                      <div>
                        <div className="font-bold text-xs text-[var(--text)]">{r.title}</div>
                        <div className="text-[11px] text-[var(--muted)] leading-relaxed mt-1">
                          {r.desc}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn-ghost text-xs py-2 px-4 rounded-xl"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  disabled={!isStep2Valid}
                  onClick={() => setStep(3)}
                  className="btn-primary text-xs py-2.5 px-6 rounded-xl disabled:opacity-50"
                >
                  Continue to Demographics →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Demographics & Physiological Context */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-display font-bold text-[var(--text)]">
                Step 3: Demographics & Profile (Optional Details)
              </h2>
              <p className="text-xs text-[var(--muted)]">
                Acoustic baseline norms vary with biological age and sex.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[var(--text)]">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="input-clinical w-full"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[var(--text)]">
                    Biological Sex <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={sex}
                    onChange={(e) => setSex(e.target.value as any)}
                    className="input-clinical w-full"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              {/* Photo Upload with Circle Crop Simulation */}
              <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] flex items-center gap-4">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-[var(--surface)] border-2 border-[var(--border)] flex items-center justify-center shrink-0">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Camera size={22} className="text-[var(--muted)]" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-xs font-semibold text-[var(--text)]">Profile Photo (Optional)</div>
                  <div className="text-[11px] text-[var(--muted)] mb-2">Max 2MB · PNG, JPG, or WEBP</div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="text-xs file:mr-3 file:py-1 file:px-3 file:rounded-md file:border file:border-[var(--border)] file:bg-[var(--surface)] file:text-xs file:font-medium hover:file:bg-[var(--surface-2)] cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[var(--text)]">
                    Mobile Number (Optional)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-[var(--muted)]">+91</span>
                    <input
                      type="tel"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="98765 43210"
                      className="input-clinical w-full pl-12"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[var(--text)]">
                    Preferred Language
                  </label>
                  <select
                    value={preferredLang}
                    onChange={(e) => setPreferredLang(e.target.value as any)}
                    className="input-clinical w-full"
                  >
                    <option value="Hindi">हिंदी (Hindi)</option>
                    <option value="English">English</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-[var(--text)]">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Jabalpur"
                    className="input-clinical w-full text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-[var(--text)]">State</label>
                  <input
                    type="text"
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    placeholder="Madhya Pradesh"
                    className="input-clinical w-full text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-[var(--text)]">Mother Tongue</label>
                  <input
                    type="text"
                    value={motherTongue}
                    onChange={(e) => setMotherTongue(e.target.value)}
                    placeholder="e.g. Hindi, Bundeli"
                    className="input-clinical w-full text-xs"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="btn-ghost text-xs py-2 px-4 rounded-xl"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  disabled={!isStep3Valid}
                  onClick={() => setStep(4)}
                  className="btn-primary text-xs py-2.5 px-6 rounded-xl disabled:opacity-50"
                >
                  Continue to Verification →
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Role Credentials & Consents */}
          {step === 4 && (
            <form onSubmit={handleRegister} className="space-y-4">
              <h2 className="text-lg font-display font-bold text-[var(--text)]">
                Step 4: Role Verification & Screening Consent
              </h2>

              {/* Conditional Doctor Fields */}
              {role === 'doctor' && (
                <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 space-y-3">
                  <div className="text-xs font-bold text-[var(--primary)] flex items-center gap-1.5">
                    <Stethoscope size={15} />
                    <span>Clinician Verification Details</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-[var(--text)]">
                        Medical Council Reg Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={doctorRegNumber}
                        onChange={(e) => setDoctorRegNumber(e.target.value)}
                        placeholder="e.g. MP-10492"
                        className="input-clinical w-full text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-[var(--text)]">
                        Hospital / Institution <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={institution}
                        onChange={(e) => setInstitution(e.target.value)}
                        placeholder="e.g. Marblecity Hospital"
                        className="input-clinical w-full text-xs"
                      />
                    </div>
                  </div>
                  <div className="text-[11px] font-mono text-[var(--muted)]">
                    Status upon account creation: <span className="font-semibold text-amber-600">Pending Verification</span>
                  </div>
                </div>
              )}

              {/* Conditional Health Worker Fields */}
              {role === 'chw' && (
                <div className="p-4 rounded-xl bg-teal-50/50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-900 space-y-3">
                  <div className="text-xs font-bold text-[var(--accent)] flex items-center gap-1.5">
                    <HeartPulse size={15} />
                    <span>Community Health Worker Post</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-[var(--text)]">
                        Assigned District <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={chwDistrict}
                        onChange={(e) => setChwDistrict(e.target.value)}
                        placeholder="e.g. Jabalpur"
                        className="input-clinical w-full text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-[var(--text)]">
                        Block / Sub-centre <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={chwBlock}
                        onChange={(e) => setChwBlock(e.target.value)}
                        placeholder="e.g. Panagar"
                        className="input-clinical w-full text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Optional Health History */}
              <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] space-y-3">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasPriorDiagnosis}
                    onChange={(e) => setHasPriorDiagnosis(e.target.checked)}
                    className="mt-0.5 rounded border-[var(--border)] text-[var(--primary)]"
                  />
                  <span className="text-xs font-medium text-[var(--text)]">
                    Optional: I have a prior neurological diagnosis (e.g. Parkinson's, Essential Tremor, Prior Stroke)
                  </span>
                </label>

                {hasPriorDiagnosis && (
                  <div className="space-y-2 pt-2 border-t border-[var(--border)]">
                    <input
                      type="text"
                      value={priorDiagnosisDetails}
                      onChange={(e) => setPriorDiagnosisDetails(e.target.value)}
                      placeholder="Specify diagnosis and approximate year (e.g. Parkinson's, 2023)"
                      className="input-clinical w-full text-xs"
                    />
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        required
                        checked={priorDiagnosisConsent}
                        onChange={(e) => setPriorDiagnosisConsent(e.target.checked)}
                        className="mt-0.5 rounded border-[var(--border)] text-[var(--primary)]"
                      />
                      <span className="text-[11px] text-[var(--muted)] leading-relaxed">
                        I consent to the use of my self-reported diagnosis solely for longitudinal tracking and personalized acoustic baseline comparisons.
                      </span>
                    </label>
                  </div>
                )}
              </div>

              {/* Required Terms & Screening Limit Consents */}
              <div className="space-y-3 pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={termsConsent}
                    onChange={(e) => setTermsConsent(e.target.checked)}
                    className="mt-0.5 rounded border-[var(--border)] text-[var(--primary)]"
                  />
                  <span className="text-xs text-[var(--text)]">
                    I agree to the <Link href="/licenses" className="text-[var(--primary)] underline">Terms of Service</Link> and data privacy practices. Raw audio will not be sold or retained. <span className="text-red-500">*</span>
                  </span>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={screeningLimitsConsent}
                    onChange={(e) => setScreeningLimitsConsent(e.target.checked)}
                    className="mt-0.5 rounded border-[var(--border)] text-[var(--primary)]"
                  />
                  <span className="text-xs text-[var(--text)]">
                    <strong>Screening Limitations Consent:</strong> I understand that NeuroVoice is an investigational screening support tool and does NOT provide medical diagnoses or replace an evaluation by a licensed neurologist. <span className="text-red-500">*</span>
                  </span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="btn-ghost text-xs py-2 px-4 rounded-xl"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={!isStep4Valid || loading}
                  className="btn-primary text-xs py-2.5 px-6 rounded-xl disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <span>Complete Registration →</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Existing account prompt */}
        <div className="text-center text-xs text-[var(--muted)]">
          Already have an account?{' '}
          <Link href={`/signin?next=${encodeURIComponent(nextRoute)}`} className="font-semibold text-[var(--primary)] hover:underline">
            Sign In here →
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function SignUpPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] text-[var(--muted)]">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
        </div>
      }
    >
      <SignUpContent />
    </Suspense>
  )
}
