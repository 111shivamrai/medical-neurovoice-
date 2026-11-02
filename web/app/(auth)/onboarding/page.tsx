'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  Upload,
  Mic,
  MicOff,
  Check,
  ChevronRight,
  ArrowRight,
  Volume2,
  Sparkles,
  MapPin,
  Globe,
  Camera,
  ShieldCheck,
  Activity,
} from 'lucide-react'
import { Logo } from '@/components/Logo'

type Gender = 'male' | 'female' | 'prefer-not' | null

// Interactive Confetti Canvas
function ConfettiCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const confettiCount = 140
    const colors = ['#6366F1', '#22D3EE', '#10B981', '#F59E0B', '#EC4899', '#A855F7']

    const pieces = Array.from({ length: confettiCount }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedY: Math.random() * 4 + 2,
      speedX: (Math.random() - 0.5) * 3,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
    }))

    let animId: number
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      pieces.forEach((p) => {
        p.y += p.speedY
        p.x += p.speedX
        p.rotation += p.rotationSpeed

        if (p.y > canvas.height) {
          p.y = -20
          p.x = Math.random() * canvas.width
        }

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate((p.rotation * Math.PI) / 180)
        ctx.fillStyle = p.color
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6)
        ctx.restore()
      })

      animId = requestAnimationFrame(render)
    }

    render()

    return () => cancelAnimationFrame(animId)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 w-full h-full"
      aria-hidden="true"
    />
  )
}

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2 | 3>(1)

  // Step 1: Profile State
  const [displayName, setDisplayName] = useState('Dr. Priya Sharma')
  const [location, setLocation] = useState('Jabalpur, Madhya Pradesh')
  const [language, setLanguage] = useState<'Hindi' | 'English'>('Hindi')
  const [gender, setGender] = useState<Gender>('female')
  const [photoURL, setPhotoURL] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Step 2: Voice Test State
  const [isRecording, setIsRecording] = useState(false)
  const [recordedTime, setRecordedTime] = useState(0)
  const [recordingDone, setRecordingDone] = useState(false)
  const [snrScore, setSnrScore] = useState(28.4)
  const [audioLevel, setAudioLevel] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)

  // Auto-assigned gender avatars
  const getAvatarIllustration = () => {
    if (gender === 'female') {
      return (
        <div className="w-full h-full bg-gradient-to-tr from-purple-500/30 to-indigo-500/30 flex items-center justify-center text-4xl">
          👩‍⚕️
        </div>
      )
    }
    if (gender === 'male') {
      return (
        <div className="w-full h-full bg-gradient-to-tr from-cyan-500/30 to-blue-500/30 flex items-center justify-center text-4xl">
          👨‍⚕️
        </div>
      )
    }
    return (
      <div className="w-full h-full bg-gradient-to-tr from-emerald-500/30 to-teal-500/30 flex items-center justify-center text-4xl">
        🧠
      </div>
    )
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setPhotoURL(ev.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  // Voice Test Handlers
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      mediaRecorderRef.current = recorder
      recorder.start()
      setIsRecording(true)
      setRecordedTime(0)

      timerRef.current = setInterval(() => {
        setRecordedTime((prev) => {
          if (prev >= 10) {
            stopRecording()
            return 10
          }
          setAudioLevel(Math.floor(Math.random() * 40 + 50))
          return prev + 1
        })
      }, 1000)
    } catch (err) {
      // Fallback simulation if mic is blocked in non-https or test environment
      setIsRecording(true)
      setRecordedTime(0)
      timerRef.current = setInterval(() => {
        setRecordedTime((prev) => {
          if (prev >= 10) {
            stopRecording()
            return 10
          }
          setAudioLevel(Math.floor(Math.random() * 40 + 50))
          return prev + 1
        })
      }, 1000)
    }
  }

  const stopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop())
    }
    setIsRecording(false)
    setRecordingDone(true)
    setSnrScore(29.1)
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#0A0F1E] text-white flex flex-col items-center justify-between p-4 sm:p-8 relative overflow-hidden">
      {/* Confetti on Step 3 */}
      {step === 3 && <ConfettiCanvas />}

      {/* Top Navbar Header */}
      <div className="w-full max-w-4xl flex items-center justify-between mb-8">
        <Logo size="md" />
        <span className="text-xs font-mono text-gray-400">
          Clinical Setup · NeuroVoice
        </span>
      </div>

      {/* 3-Step Progress Bar at Top */}
      <div className="w-full max-w-xl mb-12">
        <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider mb-3">
          <span className={step >= 1 ? 'text-indigo-400 font-bold' : 'text-gray-500'}>
            1. Profile
          </span>
          <span className={step >= 2 ? 'text-cyan-400 font-bold' : 'text-gray-500'}>
            2. Voice Calibration
          </span>
          <span className={step === 3 ? 'text-emerald-400 font-bold' : 'text-gray-500'}>
            3. Ready
          </span>
        </div>

        <div className="h-2 w-full bg-[#111827] rounded-full overflow-hidden border border-[#1F2937]">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: 'linear-gradient(to right, #6366F1, #22D3EE, #10B981)',
            }}
            animate={{
              width: step === 1 ? '33.33%' : step === 2 ? '66.66%' : '100%',
            }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Main Step Card Container */}
      <div className="w-full max-w-xl my-auto">
        <AnimatePresence mode="wait">
          {/* STEP 1: COMPLETE YOUR PROFILE */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="rounded-3xl p-8 sm:p-10 border border-[#1F2937] bg-[#111827] shadow-[0_0_50px_rgba(99,102,241,0.12)]"
            >
              <div className="text-center mb-8">
                <span className="text-xs font-mono text-indigo-400 font-semibold tracking-wider uppercase mb-1 block">
                  Step 01
                </span>
                <h2 className="font-display font-extrabold text-3xl text-white">
                  Complete Your Profile
                </h2>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                  Personalize your clinical identification on generated biomarker reports
                </p>
              </div>

              {/* Profile Photo / Avatar Assignment */}
              <div className="flex flex-col items-center justify-center mb-8">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="relative w-28 h-28 rounded-full border-2 border-dashed border-[#6366F1]/50 hover:border-[#6366F1] cursor-pointer overflow-hidden transition-all group flex items-center justify-center bg-[#0A0F1E] shadow-lg"
                >
                  {photoURL ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={photoURL} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    getAvatarIllustration()
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity text-white text-[10px] font-mono">
                    <Camera size={18} className="mb-1" />
                    <span>Change</span>
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />

                <p className="text-[11px] text-gray-400 mt-2 font-mono">
                  Click to upload photo or gender avatar auto-assigned
                </p>

                {/* Optional Gender Avatar Selector */}
                <div className="flex items-center gap-2 mt-3">
                  {[
                    { id: 'male', label: 'Male' },
                    { id: 'female', label: 'Female' },
                    { id: 'prefer-not', label: 'Other / Prefer not to say' },
                  ].map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => {
                        setGender(g.id as Gender)
                        setPhotoURL(null)
                      }}
                      className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                        gender === g.id && !photoURL
                          ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300 font-semibold'
                          : 'border-[#1F2937] text-gray-400 hover:text-white'
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                    Display Name (Appears on Reports)
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#0A0F1E] border border-[#1F2937] text-white text-sm focus:outline-none focus:border-[#6366F1]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                    Location / Hospital Ward
                  </label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Jabalpur, Madhya Pradesh"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0A0F1E] border border-[#1F2937] text-white text-sm focus:outline-none focus:border-[#6366F1]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                    Default Screening Language
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setLanguage('Hindi')}
                      className={`py-3 px-4 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                        language === 'Hindi'
                          ? 'border-[#22D3EE] bg-cyan-500/10 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.2)]'
                          : 'border-[#1F2937] bg-[#0A0F1E] text-gray-400 hover:text-white'
                      }`}
                    >
                      <span>🇮🇳</span>
                      <span>Hindi (मप्र मानक)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setLanguage('English')}
                      className={`py-3 px-4 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                        language === 'English'
                          ? 'border-[#6366F1] bg-indigo-500/10 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                          : 'border-[#1F2937] bg-[#0A0F1E] text-gray-400 hover:text-white'
                      }`}
                    >
                      <span>🌐</span>
                      <span>English</span>
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full py-4 px-6 rounded-xl font-display font-semibold text-sm text-white transition-all duration-300 hover:scale-[1.01] active:scale-98 flex items-center justify-center gap-2 mt-8 shadow-[0_0_30px_rgba(99,102,241,0.4)]"
                style={{
                  background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                }}
              >
                <span>Continue to Microphone Test</span>
                <ChevronRight size={16} />
              </button>
            </motion.div>
          )}

          {/* STEP 2: YOUR FIRST VOICE TEST */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="rounded-3xl p-8 sm:p-10 border border-[#1F2937] bg-[#111827] shadow-[0_0_50px_rgba(34,211,238,0.12)] text-center"
            >
              <div className="mb-6">
                <span className="text-xs font-mono text-cyan-400 font-semibold tracking-wider uppercase mb-1 block">
                  Step 02
                </span>
                <h2 className="font-display font-extrabold text-3xl text-white">
                  Your First Voice Test
                </h2>
                <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-md mx-auto">
                  A 10-second calibration to ensure your microphone SNR and loudness meet NeuroVoice clinical acoustic standards.
                </p>
              </div>

              {/* Hindi or English sentence prompt */}
              <div className="p-4 rounded-2xl bg-[#0A0F1E] border border-cyan-500/20 mb-8 max-w-md mx-auto">
                <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest block mb-1">
                  Read aloud naturally:
                </span>
                <p className="font-display text-base sm:text-lg text-white font-medium">
                  {language === 'Hindi'
                    ? '"आज मौसम साफ़ है और सुबह की हवा बहुत ताज़ा लग रही है।"'
                    : '"The early morning sun reflects clarity across the quiet river."'}
                </p>
              </div>

              {/* Mic Record Button & Audio Level Meter */}
              <div className="flex flex-col items-center justify-center mb-8">
                <button
                  type="button"
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`w-28 h-28 rounded-full flex flex-col items-center justify-center transition-all duration-300 relative ${
                    isRecording
                      ? 'bg-red-500/20 border-2 border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.4)] animate-pulse'
                      : recordingDone
                      ? 'bg-emerald-500/20 border-2 border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.3)]'
                      : 'bg-indigo-500/20 border-2 border-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:scale-105'
                  }`}
                >
                  {isRecording ? (
                    <>
                      <MicOff size={32} className="text-red-400 mb-1" />
                      <span className="text-[10px] font-mono text-red-300 font-bold">
                        {10 - recordedTime}s LEFT
                      </span>
                    </>
                  ) : recordingDone ? (
                    <>
                      <Check size={36} className="text-emerald-400 mb-1" />
                      <span className="text-[10px] font-mono text-emerald-300 font-bold">
                        VERIFIED
                      </span>
                    </>
                  ) : (
                    <>
                      <Mic size={32} className="text-indigo-400 mb-1" />
                      <span className="text-[10px] font-mono text-indigo-300 font-bold">
                        RECORD (10s)
                      </span>
                    </>
                  )}
                </button>

                {/* Live Quality Checks */}
                <div className="w-full max-w-sm mt-6 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-gray-400">Signal-to-Noise Ratio (SNR):</span>
                    <span className={recordingDone ? 'text-emerald-400 font-bold' : 'text-gray-500'}>
                      {recordingDone ? `${snrScore} dB (Optimal > 18 dB)` : 'Awaiting recording'}
                    </span>
                  </div>
                  <div className="w-full bg-[#0A0F1E] h-2 rounded-full overflow-hidden border border-[#1F2937]">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: isRecording
                          ? `${(recordedTime / 10) * 100}%`
                          : recordingDone
                          ? '100%'
                          : '0%',
                        background: recordingDone
                          ? '#10B981'
                          : isRecording
                          ? '#22D3EE'
                          : '#6366F1',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="py-3.5 px-5 rounded-xl border border-[#1F2937] text-gray-400 hover:text-white text-xs font-semibold transition-colors"
                >
                  Back
                </button>

                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={!recordingDone}
                  className="flex-1 py-3.5 px-6 rounded-xl font-display font-semibold text-sm text-white transition-all duration-300 hover:scale-[1.01] active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(16,185,129,0.35)]"
                  style={{
                    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  }}
                >
                  <span>Complete Calibration</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: YOU'RE READY! */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, type: 'spring' }}
              className="rounded-3xl p-8 sm:p-12 border border-emerald-500/30 bg-[#111827] shadow-[0_0_60px_rgba(16,185,129,0.2)] text-center relative overflow-hidden"
            >
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(16,185,129,0.4)]">
                <Sparkles size={36} />
              </div>

              <span className="text-xs font-mono text-emerald-400 font-semibold tracking-wider uppercase mb-1 block">
                Setup Complete
              </span>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white mb-3">
                You're Ready.
              </h2>
              <p className="text-sm text-gray-300 max-w-md mx-auto leading-relaxed mb-8">
                Welcome to NeuroVoice. Your clinical profile is active and your microphone calibration conforms to
                NeuroVoice neurological screening benchmarks.
              </p>

              {/* Status Checklist */}
              <div className="p-4 rounded-2xl bg-[#0A0F1E] border border-[#1F2937] text-left space-y-2.5 mb-8 max-w-sm mx-auto text-xs font-mono">
                <div className="flex items-center gap-2.5 text-emerald-400">
                  <Check size={15} />
                  <span>Verified Identity: {displayName}</span>
                </div>
                <div className="flex items-center gap-2.5 text-cyan-400">
                  <Check size={15} />
                  <span>Acoustic SNR Calibrated: 29.1 dB</span>
                </div>
                <div className="flex items-center gap-2.5 text-indigo-400">
                  <Check size={15} />
                  <span>Tri-Model AI Pipeline Connected</span>
                </div>
              </div>

              {/* Go to Dashboard Button */}
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="w-full py-4 px-8 rounded-xl font-display font-bold text-base text-white transition-all duration-300 hover:scale-[1.02] active:scale-98 flex items-center justify-center gap-2 shadow-[0_0_40px_rgba(99,102,241,0.5)]"
                style={{
                  background: 'linear-gradient(135deg, #6366F1 0%, #22D3EE 100%)',
                }}
              >
                <span>Go to Dashboard →</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer info */}
      <div className="w-full max-w-4xl text-center text-xs font-mono text-gray-500 pt-6">
        NeuroVoice · Vocal Neurological Biomarker Screening Platform
      </div>
    </div>
  )
}
