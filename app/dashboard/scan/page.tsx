'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
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
} from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'
import dynamic from 'next/dynamic'

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
  const [language, setLanguage] = useState<'Hindi' | 'English'>('Hindi')

  // Step 2: Quality & Live Canvas
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [qualityStatus, setQualityStatus] = useState<'green' | 'yellow' | 'red'>('green')
  const [qualityMessage, setQualityMessage] = useState('Optimal vocal clarity · Background noise minimal')

  // Step 3: Recording State
  const [isRecording, setIsRecording] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30)
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Step 4: Pipeline Stages Animation
  const [completedStageIndex, setCompletedStageIndex] = useState(0)

  const pipelineStages = [
    'Noise Reduction (Wiener Filtering)',
    '25ms Frame Segmentation',
    'Feature Extraction (MFCC, Jitter, Shimmer)',
    'CNN-GRU Temporal Model',
    'LightGBM Tabular Classifier',
    'wav2vec 2.0 Speech Representation',
    'Ensemble Fusion Layer',
    'SHAP Explainability Attribution',
    'Report Generation & PDF Signing',
  ]

  // Step 5 Results State
  const [results, setResults] = useState({
    pd: 12.0,
    ad: 18.0,
    dysarthria: 9.0,
    postStroke: 8.0,
    emotionWarning: true,
  })

  const shapData = [
    { feature: 'Vocal Micro-Jitter', contribution: -14.2, isRaising: false },
    { feature: 'Harmonic-to-Noise (HNR)', contribution: -11.8, isRaising: false },
    { feature: 'Shimmer APQ-5', contribution: -8.4, isRaising: false },
    { feature: 'Pitch Period Entropy', contribution: -6.5, isRaising: false },
    { feature: 'Speech Articulation Rate', contribution: -5.2, isRaising: false },
    { feature: 'F0 Pitch Dispersion', contribution: -3.8, isRaising: false },
    { feature: 'Linguistic Pause Ratio', contribution: 4.1, isRaising: true },
    { feature: 'RPDE Recurrence Entropy', contribution: 2.3, isRaising: true },
  ]

  const radarData = [
    { axis: 'Pitch Stability', patient: 88, average: 85 },
    { axis: 'Articulation', patient: 91, average: 82 },
    { axis: 'Speech Rate', patient: 80, average: 78 },
    { axis: 'Pause Frequency', patient: 76, average: 75 },
    { axis: 'Vocal Clarity', patient: 92, average: 88 },
    { axis: 'Lexical Richness', patient: 84, average: 80 },
  ]

  // Live Canvas Waveform Animation for Step 2
  useEffect(() => {
    if (step !== 2) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let angle = 0

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.lineWidth = 2
      ctx.strokeStyle = '#22D3EE'
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
  }, [step])

  // Recording timer logic
  const startRecording = () => {
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

  const stopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    setIsRecording(false)
    setRecordedBlob(new Blob(["mock-speech-data"], { type: "audio/wav" }))
    // Transition to Processing Step 4
    setStep(4)
  }

  // Processing Animation logic (Step 4 -> Step 5)
  useEffect(() => {
    if (step === 4) {
      setCompletedStageIndex(0)
      const interval = setInterval(() => {
        setCompletedStageIndex((prev) => {
          if (prev >= pipelineStages.length - 1) {
            clearInterval(interval)
            setTimeout(() => setStep(5), 600)
            return prev
          }
          return prev + 1
        })
      }, 550)
      return () => clearInterval(interval)
    }
  }, [step])

  const downloadReportPDF = () => {
    window.open('http://localhost:8000/api/reports/scr-10492/pdf', '_blank')
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Top Header & Step Progress */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#1F2937]">
        <div>
          <span className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-widest block mb-1">
            CLINICAL VOICE SCANNER · JABALPUR MEDICAL COLLEGE
          </span>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
            {step === 1 && 'Step 1: Select Language'}
            {step === 2 && 'Step 2: Voice Quality Check'}
            {step === 3 && 'Step 3: Record 30-Second Sample'}
            {step === 4 && 'Step 4: AI Pipeline Processing'}
            {step === 5 && 'Step 5: Diagnostic Results Dashboard'}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/simple"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-xs font-semibold transition-colors"
          >
            <HeartPulse size={14} />
            <span>Switch to ASHA Simple Mode</span>
          </Link>

          <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-[#111827] border border-[#1F2937] text-gray-400">
            Step {step} of 5
          </span>
        </div>
      </div>

      {/* STEP 1: LANGUAGE SELECTION */}
      {step === 1 && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <p className="text-sm text-gray-400">
            Choose the language for the patient's acoustic prompt. Linguistic models adapt acoustic thresholds to regional Hindi phonemes or standard English formants.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Hindi Card */}
            <div
              onClick={() => setLanguage('Hindi')}
              className={`p-8 rounded-2xl border cursor-pointer transition-all duration-300 relative ${
                language === 'Hindi'
                  ? 'bg-indigo-500/15 border-[#6366F1] shadow-[0_0_35px_rgba(99,102,241,0.3)] scale-[1.01]'
                  : 'bg-[#111827] border-[#1F2937] hover:border-gray-600'
              }`}
            >
              <div className="text-4xl mb-3">🇮🇳</div>
              <h3 className="font-display font-bold text-2xl text-white mb-2">Hindi (मप्र मानक)</h3>
              <p className="text-xs text-gray-400 leading-relaxed mb-4">
                Recommended for patients across Madhya Pradesh. Calibrated for Bundeli, Bagheli, and Malwi phonetic variations.
              </p>
              <span className="text-xs font-mono text-cyan-400 font-semibold">
                Prompt: "आज मौसम साफ़ है और सुबह की हवा ताज़ा लग रही है।"
              </span>
            </div>

            {/* English Card */}
            <div
              onClick={() => setLanguage('English')}
              className={`p-8 rounded-2xl border cursor-pointer transition-all duration-300 relative ${
                language === 'English'
                  ? 'bg-indigo-500/15 border-[#6366F1] shadow-[0_0_35px_rgba(99,102,241,0.3)] scale-[1.01]'
                  : 'bg-[#111827] border-[#1F2937] hover:border-gray-600'
              }`}
            >
              <div className="text-4xl mb-3">🌐</div>
              <h3 className="font-display font-bold text-2xl text-white mb-2">English (Clinical)</h3>
              <p className="text-xs text-gray-400 leading-relaxed mb-4">
                Standard phonetic rainbow passage protocol used across global neurological tertiary institutes.
              </p>
              <span className="text-xs font-mono text-indigo-400 font-semibold">
                Prompt: "The rainbow begins with gentle rain under the morning sunlight."
              </span>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={() => setStep(2)}
              className="py-3 px-8 rounded-xl font-display font-bold text-sm text-white bg-[#6366F1] hover:bg-[#4F46E5] shadow-[0_0_25px_rgba(99,102,241,0.4)] flex items-center gap-2 transition-transform hover:scale-105"
            >
              <span>Continue to Quality Check</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </motion.div>
      )}

      {/* STEP 2: VOICE QUALITY CHECK */}
      {step === 2 && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="p-8 rounded-2xl bg-[#111827] border border-[#1F2937] text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/15 text-[#22D3EE] flex items-center justify-center mx-auto">
              <Volume2 size={32} />
            </div>

            <div>
              <h3 className="font-display font-bold text-xl text-white">Microphone Quality & SNR Analysis</h3>
              <p className="text-xs text-gray-400 mt-1 max-w-md mx-auto">
                Testing ambient acoustic levels to ensure accurate feature extraction without clipping or noise artifacts.
              </p>
            </div>

            {/* Live Waveform Canvas */}
            <div className="h-28 w-full max-w-lg mx-auto bg-[#0A0F1E] rounded-xl border border-cyan-500/20 p-2 flex items-center justify-center overflow-hidden">
              <canvas ref={canvasRef} width={480} height={100} className="w-full h-full" />
            </div>

            {/* Quality Meter */}
            <div className="max-w-md mx-auto space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-gray-400">Signal-to-Noise Ratio (SNR):</span>
                <span className="text-emerald-400 font-bold">28.4 dB (Green · High Clarity)</span>
              </div>
              <div className="w-full bg-[#0A0F1E] h-2.5 rounded-full overflow-hidden border border-[#1F2937]">
                <div className="bg-emerald-400 h-full rounded-full" style={{ width: '85%' }} />
              </div>
              <p className="text-xs font-mono text-emerald-400 flex items-center justify-center gap-1.5 pt-1">
                <CheckCircle2 size={14} />
                <span>{qualityMessage}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <button
              onClick={() => setStep(1)}
              className="py-2.5 px-6 rounded-xl border border-[#1F2937] text-gray-400 hover:text-white text-xs font-semibold"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="py-3 px-8 rounded-xl font-display font-bold text-sm text-white bg-[#6366F1] hover:bg-[#4F46E5] shadow-[0_0_25px_rgba(99,102,241,0.4)] flex items-center gap-2 transition-transform hover:scale-105"
            >
              <span>Proceed to Record</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </motion.div>
      )}

      {/* STEP 3: RECORD (OR UPLOAD) */}
      {step === 3 && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Prompt card */}
          <div className="p-6 rounded-2xl bg-[#0A0F1E] border border-cyan-500/30 text-center max-w-2xl mx-auto">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest block mb-2">
              Speak naturally for 30 seconds:
            </span>
            <p className="font-display text-lg sm:text-xl text-white font-semibold leading-relaxed">
              {language === 'Hindi'
                ? '"आज मौसम साफ़ है और सुबह की हवा ताज़ा लग रही है। अस्पताल के सामने लगे पेड़ों पर चिड़ियाँ चहक रही हैं।"'
                : '"The rainbow begins with gentle rain under the morning sunlight. Its colours stretch across the distant hills with quiet grace."'}
            </p>
          </div>

          {/* Large circular record button & timer */}
          <div className="p-10 rounded-2xl bg-[#111827] border border-[#1F2937] flex flex-col items-center justify-center text-center">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`w-36 h-36 rounded-full flex flex-col items-center justify-center transition-all duration-300 relative ${
                isRecording
                  ? 'bg-red-500/20 border-4 border-red-500 shadow-[0_0_50px_rgba(239,68,68,0.5)] animate-pulse'
                  : 'bg-indigo-600/20 border-4 border-indigo-500 hover:scale-105 shadow-[0_0_40px_rgba(99,102,241,0.35)]'
              }`}
            >
              {isRecording ? (
                <>
                  <MicOff size={42} className="text-red-400 mb-1" />
                  <span className="text-sm font-mono font-extrabold text-white">00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}</span>
                </>
              ) : (
                <>
                  <Mic size={42} className="text-indigo-400 mb-1" />
                  <span className="text-xs font-mono font-bold text-white">START (00:30)</span>
                </>
              )}
            </button>

            <p className="text-xs font-mono text-gray-400 mt-6">
              {isRecording ? 'Recording active... Tap button again when finished speaking.' : 'Click to start recording your 30-second sample.'}
            </p>

            {/* Drag & drop upload alternative */}
            <div className="w-full max-w-md mt-8 pt-6 border-t border-[#1F2937]">
              <label className="block p-4 rounded-xl border border-dashed border-[#374151] hover:border-cyan-400 cursor-pointer transition-colors">
                <Upload size={20} className="text-gray-400 mx-auto mb-1" />
                <span className="text-xs text-gray-400 block">Or drag & drop existing audio file (WAV, MP3, FLAC)</span>
                <input
                  type="file"
                  accept="audio/*"
                  className="hidden"
                  onChange={() => setStep(4)}
                />
              </label>
            </div>
          </div>
        </motion.div>
      )}

      {/* STEP 4: PROCESSING (9-STAGE ANIMATION) */}
      {step === 4 && (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
          <div className="p-8 sm:p-10 rounded-2xl bg-[#111827] border border-[#1F2937] max-w-2xl mx-auto shadow-2xl">
            <div className="text-center mb-8">
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider block mb-1">
                9-STAGE AI PIPELINE RUNNING
              </span>
              <h3 className="font-display font-extrabold text-2xl text-white">
                Analysing Acoustic Biomarkers
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Clinical feature extraction, neural fusion, and SHAP explainability synthesis
              </p>
            </div>

            {/* Pipeline Stages Vertical Indicator */}
            <div className="space-y-3">
              {pipelineStages.map((stageName, idx) => {
                const isComplete = idx <= completedStageIndex
                const isCurrent = idx === completedStageIndex

                return (
                  <div
                    key={stageName}
                    className={`p-3 rounded-xl border text-xs font-mono flex items-center justify-between transition-all duration-300 ${
                      isComplete
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                        : isCurrent
                        ? 'bg-indigo-500/15 border-indigo-500 text-white animate-pulse'
                        : 'bg-[#0A0F1E] border-[#1F2937] text-gray-500 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] bg-black/30">
                        {idx + 1}
                      </span>
                      <span>{stageName}</span>
                    </div>

                    <div>
                      {isComplete ? (
                        <Check size={14} className="text-emerald-400" />
                      ) : isCurrent ? (
                        <span className="text-[10px] text-cyan-400 animate-spin">⟳</span>
                      ) : null}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* STEP 5: RESULTS DASHBOARD */}
      {step === 5 && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          {/* Feature 11: Emotion Warning Banner */}
          {results.emotionWarning && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs sm:text-sm flex items-start gap-3">
              <AlertTriangle size={18} className="text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong>Elevated Emotional Stress Detected:</strong> Slight frequency dispersion indicative of vocal tension was observed.
                Results remain clinically informative but consider a relaxed follow-up re-recording if symptoms are acute.
              </div>
            </div>
          )}

          {/* Feature 1: Four Disorder Risk Gauges Side-by-Side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Parkinson's Disease", val: results.pd, status: 'Low Risk', color: '#10B981' },
              { label: "Alzheimer's Disease", val: results.ad, status: 'Low Risk', color: '#10B981' },
              { label: 'Dysarthria', val: results.dysarthria, status: 'Optimal', color: '#22D3EE' },
              { label: 'Post-Stroke Track', val: results.postStroke, status: 'Normal', color: '#14B8A6' },
            ].map((d) => (
              <div key={d.label} className="p-6 rounded-2xl bg-[#111827] border border-[#1F2937] text-center">
                <span className="text-xs text-gray-400 font-mono block mb-2">{d.label}</span>
                <div className="font-display font-extrabold text-4xl text-white mb-2">
                  {d.val}%
                </div>
                <div className="w-full bg-[#1F2937] h-2 rounded-full overflow-hidden mb-3">
                  <div className="h-full rounded-full" style={{ width: `${d.val}%`, background: d.color }} />
                </div>
                <span className="text-xs font-mono font-bold" style={{ color: d.color }}>
                  {d.status}
                </span>
              </div>
            ))}
          </div>

          {/* Feature 4: SHAP Evidence Section */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#111827] border border-[#1F2937]">
            <div className="mb-6">
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider block mb-1">
                FEATURE 4 · EXPLAINABILITY
              </span>
              <h3 className="font-display font-bold text-xl text-white">Why did the AI flag this?</h3>
              <p className="text-xs text-gray-400 mt-1">
                Top 8 contributing acoustic features. Green bars lower predicted risk; red bars raise risk.
              </p>
            </div>

            <div className="space-y-3">
              {shapData.map((s) => (
                <div key={s.feature} className="flex items-center gap-4 text-xs font-mono">
                  <div className="w-44 text-gray-300 truncate text-left">{s.feature}</div>
                  <div className="flex-1 bg-[#0A0F1E] h-4 rounded-full overflow-hidden flex items-center px-1">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${Math.abs(s.contribution) * 4}%`,
                        background: s.isRaising ? '#EF4444' : '#10B981',
                      }}
                    />
                  </div>
                  <div
                    className="w-16 text-right font-bold"
                    style={{ color: s.isRaising ? '#EF4444' : '#10B981' }}
                  >
                    {s.contribution > 0 ? `+${s.contribution}` : s.contribution}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Feature 10: Voice Profile vs Age Group Radar Chart */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#111827] border border-[#1F2937]">
            <div className="mb-4 text-center sm:text-left">
              <span className="text-xs font-mono text-indigo-400 font-bold uppercase tracking-wider block mb-1">
                FEATURE 10 · COHORT BENCHMARK
              </span>
              <h3 className="font-display font-bold text-xl text-white">Voice Profile vs Healthy Age Group</h3>
              <p className="text-xs text-gray-400 mt-1">
                Comparing patient's 6 vocal axes (Indigo) against normative controls (Age 60-70 Years)
              </p>
            </div>

            <div className="h-72 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                  <PolarGrid stroke="#1F2937" />
                  <PolarAngleAxis dataKey="axis" stroke="#9CA3AF" fontSize={11} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#374151" fontSize={9} />
                  <Radar name="Patient Actual" dataKey="patient" stroke="#6366F1" fill="#6366F1" fillOpacity={0.4} />
                  <Radar name="Healthy Average" dataKey="average" stroke="#9CA3AF" fill="#9CA3AF" fillOpacity={0.15} strokeDasharray="3 3" />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-center gap-6 mt-2 text-xs font-mono text-gray-400">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#6366F1]" />
                <span>Patient Acoustic Signature (Indigo)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-gray-400" />
                <span>Healthy Age Group Benchmark (Dashed)</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={downloadReportPDF}
              className="py-3.5 px-6 rounded-xl font-display font-bold text-sm text-white bg-[#6366F1] hover:bg-[#4F46E5] shadow-[0_0_25px_rgba(99,102,241,0.4)] flex items-center gap-2"
            >
              <FileDown size={17} />
              <span>Download PDF Report</span>
            </button>

            <Link
              href="/dashboard/appointments"
              className="py-3.5 px-6 rounded-xl font-display font-bold text-sm text-white bg-[#111827] border border-[#1F2937] hover:bg-[#1F2937] flex items-center gap-2"
            >
              <Calendar size={17} />
              <span>Book Doctor Consultation</span>
            </Link>

            <button
              onClick={() => setStep(1)}
              className="py-3.5 px-6 rounded-xl font-display font-bold text-sm text-gray-300 bg-transparent border border-[#374151] hover:bg-white/5 flex items-center gap-2"
            >
              <RotateCcw size={17} />
              <span>Scan Again</span>
            </button>
          </div>

          {/* Clinical Consent Disclaimer */}
          <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 text-center text-xs text-red-300 font-mono">
            Research screening analysis developed under Jabalpur Medical College. Not an autonomous clinical diagnosis.
          </div>
        </motion.div>
      )}
    </div>
  )
}
