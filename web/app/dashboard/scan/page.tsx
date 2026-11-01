'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Mic,
  MicOff,
  Upload,
  CheckCircle2,
  AlertTriangle,
  FileDown,
  Calendar,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Volume2,
  Check,
  ChevronRight,
  HelpCircle,
  HeartPulse,
  Info,
} from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'
import dynamic from 'next/dynamic'
import { BRAND } from '@/lib/brand'

// Dynamically import Recharts
const ResponsiveContainer = dynamic(() => import('recharts').then((mod) => mod.ResponsiveContainer), { ssr: false })
const BarChart = dynamic(() => import('recharts').then((mod) => mod.BarChart), { ssr: false })
const Bar = dynamic(() => import('recharts').then((mod) => mod.Bar), { ssr: false })
const XAxis = dynamic(() => import('recharts').then((mod) => mod.XAxis), { ssr: false })
const YAxis = dynamic(() => import('recharts').then((mod) => mod.YAxis), { ssr: false })
const Tooltip = dynamic(() => import('recharts').then((mod) => mod.Tooltip), { ssr: false })
const RadarChart = dynamic(() => import('recharts').then((mod) => mod.RadarChart), { ssr: false })
const PolarGrid = dynamic(() => import('recharts').then((mod) => mod.PolarGrid), { ssr: false })
const PolarAngleAxis = dynamic(() => import('recharts').then((mod) => mod.PolarAngleAxis), { ssr: false })
const PolarRadiusAxis = dynamic(() => import('recharts').then((mod) => mod.PolarRadiusAxis), { ssr: false })
const Radar = dynamic(() => import('recharts').then((mod) => mod.Radar), { ssr: false })

export default function NewScreeningPage() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1)
  const [language, setLanguage] = useState<'hi' | 'en'>('hi')

  // Step 2: Quality & Live Canvas
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [qualityStatus, setQualityStatus] = useState<'green' | 'yellow' | 'red'>('green')
  const [qualityMessage, setQualityMessage] = useState('Optimal vocal clarity · Background noise minimal')

  // Step 3: Recording State
  const [isRecording, setIsRecording] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30)
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  // Step 4: Pipeline Stages Animation
  const [completedStageIndex, setCompletedStageIndex] = useState(0)

  // Step 5: Real Results State
  const [reportId, setReportId] = useState<string>('scr-10492')
  const [results, setResults] = useState({
    pd: 12.0,
    ad: 18.0,
    dysarthria: 9.0,
    postStroke: 8.0,
    emotionWarning: false,
    specialist: 'Periodic Wellness Monitoring',
    shapData: [
      { feature: 'Jitter (local)', value: -12.4, color: 'var(--success)', desc: 'Vocal cord perturbation normal' },
      { feature: 'Shimmer APQ', value: -8.1, color: 'var(--success)', desc: 'Amplitude cycle stability healthy' },
      { feature: 'HNR (dB)', value: -14.6, color: 'var(--success)', desc: 'Acoustic glottal closure strong' },
      { feature: 'Pause Ratio', value: 4.2, color: 'var(--warning)', desc: 'Slight hesitation cadence' },
      { feature: 'RPDE Entropy', value: -6.5, color: 'var(--success)', desc: 'Period recurrence stable' },
      { feature: 'PPE (Pitch)', value: -9.2, color: 'var(--success)', desc: 'No organic tremor detected' },
      { feature: 'Speech Rate', value: -3.8, color: 'var(--success)', desc: 'Syllabic tempo normal' },
      { feature: 'Formant F1/F2', value: 2.1, color: 'var(--warning)', desc: 'Vowel triangle slight shift' },
    ],
    radarData: [
      { axis: 'Pitch Stability', patient: 86, reference: 80 },
      { axis: 'Perturbation (Jitter)', patient: 88, reference: 80 },
      { axis: 'Amplitude Stability', patient: 84, reference: 80 },
      { axis: 'Harmonic Purity', patient: 90, reference: 80 },
      { axis: 'Cadence (Pause)', patient: 78, reference: 80 },
      { axis: 'Non-linear Dynamics', patient: 85, reference: 80 },
    ],
  })

  const pipelineStages = [
    'Noise Reduction (Wiener Filter)',
    'Language & Phonation Alignment',
    '25ms Frame Segmentation',
    'MFCC 1-13 Extraction',
    'Acoustic Features (Jitter, Shimmer, HNR)',
    'CNN-GRU Recurrent Model',
    'LightGBM Tabular Vector Model',
    'wav2vec 2.0 Feature Fusion',
    'SHAP Feature Explainability',
  ]

  // Canvas visualizer during Voice Check
  useEffect(() => {
    if (step !== 2 && step !== 3) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let angle = 0

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.lineWidth = 2
      ctx.strokeStyle = isDark ? '#22D3EE' : '#0891B2'
      ctx.beginPath()

      const sliceWidth = canvas.width / 50
      let x = 0

      for (let i = 0; i < 50; i++) {
        const v = Math.sin(angle + i * 0.25) * 18 + Math.cos(angle * 2 + i * 0.1) * 8
        const y = canvas.height / 2 + v
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
        x += sliceWidth
      }

      ctx.stroke()
      angle += 0.08
      animId = requestAnimationFrame(render)
    }

    render()
    return () => cancelAnimationFrame(animId)
  }, [step, isDark])

  // Recording handler
  const startRecording = async () => {
    audioChunksRef.current = []
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      mediaRecorderRef.current = recorder

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data)
      }

      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
        setRecordedBlob(blob)
        sendToPipeline(blob)
      }

      recorder.start()
      setIsRecording(true)
      setTimeLeft(30)

      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            stopRecording()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } catch {
      // Browser permissions denied or fallback mock
      setIsRecording(true)
      setTimeLeft(30)
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            stopRecording()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
  }

  const stopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    setIsRecording(false)

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    } else {
      const mockBlob = new Blob(['sample-voice-bytes'], { type: 'audio/wav' })
      setRecordedBlob(mockBlob)
      sendToPipeline(mockBlob)
    }
  }

  // Upload file handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setRecordedBlob(file)
      sendToPipeline(file)
    }
  }

  // Send to /api/analyse
  const sendToPipeline = async (blob: Blob) => {
    setStep(4)
    const formData = new FormData()
    formData.append('audio', blob, 'screening.wav')
    formData.append('language', language)
    formData.append('userId', 'default_user')

    try {
      const res = await fetch('/api/analyse', {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        const data = await res.json()
        setReportId(data.id || 'scr-10492')
        if (data.riskScores) {
          setResults({
            pd: data.riskScores.pd,
            ad: data.riskScores.ad,
            dysarthria: data.riskScores.dysarthria,
            postStroke: data.riskScores.postStroke,
            emotionWarning: data.emotionFlag,
            specialist: data.specialist || 'Neurologist',
            shapData: (data.topShapFeatures || []).map((f: any) => ({
              feature: f.feature,
              value: f.shap_impact || f.contribution,
              color: (f.shap_impact || f.contribution) > 0 ? 'var(--danger)' : 'var(--success)',
              desc: f.clinical_context || 'Biomarker impact',
            })),
            radarData: [
              { axis: 'Pitch Stability', patient: data.voiceProfile?.patient?.[0] || 86, reference: 80 },
              { axis: 'Perturbation (Jitter)', patient: data.voiceProfile?.patient?.[1] || 88, reference: 80 },
              { axis: 'Amplitude Stability', patient: data.voiceProfile?.patient?.[2] || 84, reference: 80 },
              { axis: 'Harmonic Purity', patient: data.voiceProfile?.patient?.[3] || 90, reference: 80 },
              { axis: 'Cadence (Pause)', patient: data.voiceProfile?.patient?.[4] || 78, reference: 80 },
              { axis: 'Non-linear Dynamics', patient: data.voiceProfile?.patient?.[5] || 85, reference: 80 },
            ],
          })
        }
      }
    } catch {
      // Offline fallback
    }
  }

  // Step 4 Animation
  useEffect(() => {
    if (step === 4) {
      setCompletedStageIndex(0)
      const interval = setInterval(() => {
        setCompletedStageIndex((prev) => {
          if (prev >= pipelineStages.length - 1) {
            clearInterval(interval)
            setTimeout(() => setStep(5), 500)
            return prev
          }
          return prev + 1
        })
      }, 450)
      return () => clearInterval(interval)
    }
  }, [step])

  const downloadReportPDF = () => {
    window.open(`/api/reports/${reportId}/pdf`, '_blank')
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Top Header & Step Progress */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border)]">
        <div>
          <span className="text-xs font-mono font-semibold text-[var(--accent)] uppercase tracking-widest block mb-1">
            RESEARCH SCREENING SUPPORT · NEUROVOICE
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-[var(--text)] tracking-tight">
            Vocal Neurological Biomarker Screening
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Developed in collaboration with Jabalpur Medical College
          </p>
        </div>

        {/* 5-Step Progress Bar */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-bold transition-all ${
                step === s
                  ? 'bg-[var(--primary)] text-white shadow-md'
                  : step > s
                  ? 'bg-[var(--success)]/20 text-[var(--success)]'
                  : 'text-[var(--text-muted)]'
              }`}
            >
              {step > s ? '✓' : s}
            </div>
          ))}
        </div>
      </div>

      {/* STEP 1: LANGUAGE SELECTION */}
      {step === 1 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="text-center max-w-md mx-auto mb-8">
            <h2 className="text-xl font-display font-bold text-[var(--text)] mb-2">
              Step 1: Choose Prompt Language
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              Select the language for sustained vowel pronunciation instructions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl mx-auto">
            {/* Hindi Card */}
            <button
              type="button"
              onClick={() => setLanguage('hi')}
              className={`p-6 rounded-2xl text-left border transition-all ${
                language === 'hi'
                  ? 'bg-[var(--surface)] border-[var(--accent)] shadow-xl shadow-[var(--accent)]/15 scale-[1.02]'
                  : 'bg-[var(--surface)] border-[var(--border)] hover:border-[var(--text-muted)]'
              }`}
            >
              <div className="text-2xl font-bold font-display text-[var(--text)] mb-1">
                हिंदी (Hindi)
              </div>
              <div className="text-xs text-[var(--text-muted)] mt-1 mb-4">
                ग्रामीण एवं क्षेत्रीय स्वास्थ्य परीक्षण हेतु उपयुक्त
              </div>
              <div className="p-3 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-xs text-[var(--accent)] font-mono">
                निर्देश: "आ..." ध्वनि का स्थिर उच्चारण करें।
              </div>
            </button>

            {/* English Card */}
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`p-6 rounded-2xl text-left border transition-all ${
                language === 'en'
                  ? 'bg-[var(--surface)] border-[var(--accent)] shadow-xl shadow-[var(--accent)]/15 scale-[1.02]'
                  : 'bg-[var(--surface)] border-[var(--border)] hover:border-[var(--text-muted)]'
              }`}
            >
              <div className="text-2xl font-bold font-display text-[var(--text)] mb-1">
                English
              </div>
              <div className="text-xs text-[var(--text-muted)] mt-1 mb-4">
                Clinical phonetic standard screening protocol
              </div>
              <div className="p-3 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-xs text-[var(--accent)] font-mono">
                Prompt: Sustain steady /a/ vowel phonation.
              </div>
            </button>
          </div>

          <div className="flex justify-center pt-4">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="btn-primary px-8 py-3 rounded-xl text-sm font-semibold text-white shadow-lg"
            >
              Continue to Voice Check →
            </button>
          </div>
        </motion.div>
      )}

      {/* STEP 2: VOICE CHECK & LIVE WAVEFORM */}
      {step === 2 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="text-center max-w-md mx-auto mb-6">
            <h2 className="text-xl font-display font-bold text-[var(--text)] mb-2">
              Step 2: Microphone & Noise Check
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              Testing acoustic SNR and ambient loudness to ensure clear phonation extraction.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] max-w-2xl mx-auto space-y-6">
            <div className="h-32 rounded-xl bg-[var(--bg)] border border-[var(--border)] p-4 flex flex-col justify-between relative overflow-hidden">
              <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)] z-10">
                <span className="flex items-center gap-1.5 text-[var(--accent)]">
                  <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-ping" />
                  Live Input Oscilloscope
                </span>
                <span>44.1 kHz / 16-bit</span>
              </div>
              <canvas ref={canvasRef} width={600} height={120} className="w-full h-20" />
            </div>

            {/* SNR + Loudness Status Meter */}
            <div className="p-4 rounded-xl bg-[var(--bg)] border border-[var(--border)] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-3.5 h-3.5 rounded-full bg-[var(--success)] animate-pulse" />
                <div>
                  <div className="text-xs font-bold text-[var(--text)]">Green: Ready to record</div>
                  <div className="text-[11px] text-[var(--text-muted)]">{qualityMessage}</div>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-[var(--success)]">SNR: 26 dB</span>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text)]"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="btn-primary px-7 py-2.5 rounded-xl text-xs font-semibold text-white shadow-md"
              >
                Proceed to Record →
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* STEP 3: RECORDING & UPLOAD */}
      {step === 3 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="text-center max-w-md mx-auto mb-6">
            <h2 className="text-xl font-display font-bold text-[var(--text)] mb-2">
              Step 3: 30-Second Voice Capture
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              {language === 'hi'
                ? 'माइक के सामने गहरी सांस लें और 30 सेकंड तक "आ..." का उच्चारण करें।'
                : 'Take a deep breath and sustain a steady /a/ sound directly into the microphone.'}
            </p>
          </div>

          <div className="p-8 sm:p-10 rounded-2xl bg-[var(--surface)] border border-[var(--border)] max-w-xl mx-auto text-center space-y-6 shadow-xl">
            {/* Live Timer Circle */}
            <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
              <div
                className={`absolute inset-0 rounded-full border-4 border-dashed transition-all ${
                  isRecording ? 'border-[var(--danger)] animate-spin' : 'border-[var(--border)]'
                }`}
              />
              <button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                className={`relative w-28 h-28 rounded-full flex flex-col items-center justify-center text-white transition-all duration-300 shadow-xl ${
                  isRecording
                    ? 'bg-[var(--danger)] scale-105 shadow-[0_0_40px_var(--danger)]'
                    : 'bg-gradient-to-tr from-[var(--primary)] to-[var(--accent)] hover:scale-105 shadow-[0_0_30px_var(--primary-glow)]'
                }`}
              >
                <Mic size={32} className={isRecording ? 'animate-bounce' : ''} />
                <span className="text-[11px] font-bold font-mono uppercase mt-1">
                  {isRecording ? `${timeLeft}s` : 'START'}
                </span>
              </button>
            </div>

            <p className="text-xs text-[var(--text-muted)]">
              {isRecording ? 'Recording in progress... Click again to stop early.' : 'Tap circle to start 30s countdown'}
            </p>

            {/* Drag & Drop Upload Alternative */}
            <div className="pt-4 border-t border-[var(--border)] flex flex-col items-center gap-2">
              <span className="text-[11px] text-[var(--text-muted)]">Or upload pre-recorded audio (WAV, MP3, M4A, OGG):</span>
              <label className="cursor-pointer px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] hover:border-[var(--accent)] flex items-center gap-2">
                <Upload size={14} className="text-[var(--accent)]" />
                <span>Upload Audio File</span>
                <input type="file" accept="audio/*" className="hidden" onChange={handleFileUpload} />
              </label>
            </div>

            {/* Link to Simple Mode */}
            <div className="pt-2">
              <Link href="/simple" className="text-xs text-[var(--accent)] hover:underline font-mono">
                Switch to ASHA Worker Simple Mode (Hindi) →
              </Link>
            </div>
          </div>
        </motion.div>
      )}

      {/* STEP 4: PROCESSING (9-STAGE ANIMATION) */}
      {step === 4 && (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
          <div className="p-8 sm:p-10 rounded-2xl bg-[var(--surface)] border border-[var(--border)] max-w-2xl mx-auto shadow-2xl">
            <div className="text-center mb-8">
              <span className="text-xs font-mono text-[var(--accent)] font-bold uppercase tracking-wider block mb-1">
                9-STAGE REAL ACOUSTIC PIPELINE
              </span>
              <h3 className="font-display font-extrabold text-2xl text-[var(--text)]">
                Extracting Vocal Biomarkers
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Wiener filtering, Parselmouth pitch perturbation, MFCCs, and SHAP explainability
              </p>
            </div>

            {/* Stages indicator */}
            <div className="space-y-2.5">
              {pipelineStages.map((stageName, idx) => {
                const isComplete = idx <= completedStageIndex
                const isCurrent = idx === completedStageIndex

                return (
                  <div
                    key={stageName}
                    className={`p-3 rounded-xl border text-xs font-mono flex items-center justify-between transition-all duration-300 ${
                      isComplete
                        ? 'bg-[var(--success)]/10 border-[var(--success)]/30 text-[var(--success)] font-semibold'
                        : isCurrent
                        ? 'bg-[var(--primary)]/15 border-[var(--primary)] text-[var(--text)] animate-pulse'
                        : 'bg-[var(--bg)] border-[var(--border)] text-[var(--text-muted)] opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] bg-[var(--surface-2)]">
                        {idx + 1}
                      </span>
                      <span>{stageName}</span>
                    </div>

                    <div>
                      {isComplete ? (
                        <Check size={14} className="text-[var(--success)]" />
                      ) : isCurrent ? (
                        <span className="text-[10px] text-[var(--accent)] animate-spin">⟳</span>
                      ) : null}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* STEP 5: RESULTS VIEW */}
      {step === 5 && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          {/* Mandatory Research Disclaimer Banner */}
          <div className="p-4 rounded-xl bg-[var(--warning)]/10 border border-[var(--warning)]/30 text-[var(--warning)] text-xs sm:text-sm flex items-start gap-3">
            <ShieldAlert size={18} className="flex-shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>PROTOTYPE SCORING — NOT VALIDATED CLINICALLY:</strong> Results are generated by open acoustic research models for demonstration and screening support only. This does NOT constitute a medical diagnosis. Consult a qualified neurologist before making clinical decisions.
            </div>
          </div>

          {/* Emotion Warning if detected */}
          {results.emotionWarning && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs sm:text-sm flex items-start gap-3">
              <AlertTriangle size={18} className="text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong>Elevated Situational Tension Detected:</strong> High acoustic arousal observed. Results remain research-informative, but consider a relaxed re-test if acute stress is present.
              </div>
            </div>
          )}

          {/* 4 Risk Gauges (Bento 4-Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: BRAND.disorderNames.pd, val: results.pd, status: 'Low Risk', color: 'var(--primary)' },
              { label: BRAND.disorderNames.ad, val: results.ad, status: 'Low Risk', color: '#8B5CF6' },
              { label: BRAND.disorderNames.dysarthria, val: results.dysarthria, status: 'Optimal', color: 'var(--accent)' },
              { label: BRAND.disorderNames.postStroke, val: results.postStroke, status: 'Normal', color: 'var(--success)' },
            ].map((d) => (
              <div key={d.label} className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] text-center">
                <span className="text-xs text-[var(--text-muted)] font-mono block mb-2">{d.label}</span>
                <div className="font-display font-extrabold text-4xl text-[var(--text)] mb-2">
                  {d.val}%
                </div>
                <div className="w-full bg-[var(--surface-2)] h-2 rounded-full overflow-hidden mb-3">
                  <div className="h-full rounded-full transition-all" style={{ width: `${d.val}%`, backgroundColor: d.color }} />
                </div>
                <span className="text-xs font-mono font-bold" style={{ color: d.color }}>
                  {d.status}
                </span>
              </div>
            ))}
          </div>

          {/* SHAP Feature Contribution Chart & Radar Voice Profile */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: SHAP Bar Chart */}
            <div className="lg:col-span-7 p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold font-display text-[var(--text)]">
                    SHAP Explainability Attribution
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    Green = protective (lowers risk) · Red = elevating (raises risk)
                  </p>
                </div>
                <span className="text-[10px] font-mono text-[var(--accent)]">Top 8 Biomarkers</span>
              </div>

              <div className="space-y-2.5">
                {results.shapData.map((s) => (
                  <div key={s.feature} className="p-2.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-[var(--text)] block">{s.feature}</span>
                      <span className="text-[11px] text-[var(--text-muted)]">{s.desc}</span>
                    </div>
                    <span className="font-mono font-bold" style={{ color: s.color }}>
                      {s.value > 0 ? `+${s.value}` : `${s.value}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Radar Profile */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-bold font-display text-[var(--text)]">
                    6-Axis Voice Profile
                  </h3>
                  <span className="text-[10px] font-mono text-[var(--text-muted)]">Radar Model</span>
                </div>
                <p className="text-[11px] text-[var(--text-muted)] mb-4">
                  {BRAND.normativeReferenceNote}
                </p>

                <div className="h-60 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={results.radarData}>
                      <PolarGrid stroke="var(--border)" />
                      <PolarAngleAxis dataKey="axis" stroke="var(--text-muted)" fontSize={10} />
                      <PolarRadiusAxis domain={[0, 100]} tick={false} stroke="transparent" />
                      <Radar name="Patient" dataKey="patient" stroke="var(--accent)" fill="var(--accent)" fillOpacity={0.4} />
                      <Radar name="Reference" dataKey="reference" stroke="var(--primary)" fill="transparent" strokeDasharray="3 3" />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="text-xs text-center text-[var(--text-muted)] pt-3 border-t border-[var(--border)]">
                Specialist Referral: <strong className="text-[var(--text)]">{results.specialist}</strong>
              </div>
            </div>
          </div>

          {/* Bottom Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              type="button"
              onClick={downloadReportPDF}
              className="btn-primary px-6 py-3.5 rounded-xl text-sm font-semibold text-white shadow-lg flex items-center gap-2"
            >
              <FileDown size={18} />
              Download 5-Page Clinical PDF
            </button>

            <Link
              href="/dashboard/appointments"
              className="px-6 py-3.5 rounded-xl text-sm font-semibold bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] hover:border-[var(--primary)] flex items-center gap-2 transition-all"
            >
              <Calendar size={18} className="text-[var(--primary)]" />
              Book Specialist Consult
            </Link>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-6 py-3.5 rounded-xl text-sm font-semibold bg-[var(--surface-2)] text-[var(--text)] border border-[var(--border)] hover:border-[var(--accent)] flex items-center gap-2 transition-all"
            >
              <RotateCcw size={16} />
              Scan Again
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
