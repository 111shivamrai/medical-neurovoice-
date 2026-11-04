'use client'

import React, { useRef, useState } from 'react'
import {
  Mic,
  Volume2,
  Filter,
  Layers,
  BarChart3,
  Cpu,
  Brain,
  Sparkles,
  FileCheck,
} from 'lucide-react'

interface Stage {
  number: string
  title: string
  category: string
  plainText: string
  technicalDetails: string
  icon: any
}

export function PipelineSection() {
  const [selectedStage, setSelectedStage] = useState(0)
  const detailRef = useRef<HTMLDivElement>(null)

  const stages: Stage[] = [
    {
      number: '01',
      title: 'Speech Acquisition & Audio Intake',
      category: 'Audio Ingestion',
      plainText:
        'You speak into your smartphone or computer microphone for 30 seconds. No apps, calibrations, or expensive hospital equipment required.',
      technicalDetails:
        'Captures 16-bit PCM uncompressed WAV at 16/44.1 kHz. Immediately verifies audio payload format and bounds duration under 120s.',
      icon: Mic,
    },
    {
      number: '02',
      title: 'Signal Quality & Noise Floor Verification',
      category: 'Acoustic Quality',
      plainText:
        'We measure room quietness and check that your voice was loud and clear enough. If your room is too noisy, we warn you right away.',
      technicalDetails:
        'Computes decibel Signal-to-Noise Ratio (SNR). Enforces a minimum 10 dB threshold; recordings with SNR < 10 dB return Inconclusive.',
      icon: Volume2,
    },
    {
      number: '03',
      title: 'Adaptive Noise Suppression',
      category: 'Spectral Cleaning',
      plainText:
        'We filter out background room hum, fan noise, and traffic rumblings without dampening the delicate acoustic harmonics of your vocal cords.',
      technicalDetails:
        'Applies stationary Wiener filtering and spectral subtraction across noise non-speech segments to retain genuine formants.',
      icon: Filter,
    },
    {
      number: '04',
      title: '25-Millisecond Vocal Windowing',
      category: 'Temporal Slicing',
      plainText:
        'Your voice is sliced into hundreds of tiny 25-millisecond snapshots. This lets us inspect micro-vocal vibrations that the human ear cannot detect.',
      technicalDetails:
        'Frames raw signal with 25ms window length and 10ms hop step (overlap) using Hann tapering to prevent spectral leakage.',
      icon: Layers,
    },
    {
      number: '05',
      title: 'Phonetic & Cepstral Decomposition (MFCCs)',
      category: 'Spectral Envelope',
      plainText:
        'We calculate the acoustic resonant shapes of your throat and mouth as you pronounce vowels, producing a 13-part vocal fingerprint.',
      technicalDetails:
        'Extracts 13 Mel-Frequency Cepstral Coefficients (MFCC 1–13) plus velocity (delta) and acceleration (delta-delta) vectors.',
      icon: BarChart3,
    },
    {
      number: '06',
      title: 'Biomarker Extraction (openSMILE + Praat)',
      category: 'Clinical Biomechanics',
      plainText:
        'We measure vocal pitch tremor, loudness fluctuation, and breathiness using the exact same phonetic standards used in neurology clinics.',
      technicalDetails:
        'Extracts clinical acoustic functionals alongside voice pitch stability, Jitter (steadiness), Shimmer (volume stability), HNR (clarity), and Formants (vowel precision).',
      icon: Cpu,
    },
    {
      number: '07',
      title: 'Deep Phonetic Representation (Wav2Vec 2.0)',
      category: 'Deep Feature Fusion',
      plainText:
        'A neural network trained on thousands of hours of human speech analyses deep contextual cadence and rhythm variations.',
      technicalDetails:
        'Passes normalized frames through facebook/wav2vec2-base transformer layers to capture high-order latent acoustic representations.',
      icon: Brain,
    },
    {
      number: '08',
      title: 'Evidence-Based Risk Scoring (RiskModel)',
      category: 'Ensemble Classification',
      plainText:
        'We compare your measurements against validated peer-reviewed ranges for each condition to determine if any metric is atypical.',
      technicalDetails:
        'Ensemble combines standardized acoustic parameters (45%), native phonetics (35%), and temporal cadence (20%) using peer-reviewed biomarker decision thresholds.',
      icon: Sparkles,
    },
    {
      number: '09',
      title: 'Explainability & Consultation Report',
      category: 'Transparent Output',
      plainText:
        'Rather than a single mystery score, we explain every factor in plain words and generate a structured summary for your doctor.',
      technicalDetails:
        'Computes SHAP directional feature impacts relative to age/sex baseline norms. Generates a 5-page clinical PDF report.',
      icon: FileCheck,
    },
  ]

  const handleSelectStage = (idx: number) => {
    setSelectedStage(idx)
    detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }

  const current = stages[selectedStage]
  const CurrentIcon = current.icon

  return (
    <section
      id="pipeline"
      className="py-24 px-4 sm:px-6 lg:px-8 border-b border-blue-900/40 text-white relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0A1628 0%, #1B3FA0 100%)' }}
    >
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-cyan-400 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600 rounded-full blur-[128px]" />
      </div>

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-mono font-bold tracking-wider uppercase text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-3 py-1 rounded-full inline-block">
            Transparent Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
            The 9-Stage Acoustic Pipeline
          </h2>
          <p className="text-sm sm:text-base text-blue-100/80 leading-relaxed">
            Every step from the moment you speak to the final report is explained plainly. Click any stage to inspect what happens.
          </p>
        </div>

        {/* 9 Stage Interactive Navigator Pills */}
        <div className="grid grid-cols-3 sm:grid-cols-9 gap-2">
          {stages.map((st, idx) => {
            const isSelected = selectedStage === idx
            return (
              <button
                key={st.number}
                type="button"
                onClick={() => handleSelectStage(idx)}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                  isSelected
                    ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-300 shadow-lg scale-105'
                    : 'bg-white/10 text-white/90 border-white/15 hover:bg-white/20 hover:border-cyan-400/50'
                }`}
              >
                <span className="font-mono text-xs font-bold">{st.number}</span>
                <span className="text-[11px] font-medium truncate w-full">
                  {st.title.split(' ')[0]}
                </span>
              </button>
            )
          })}
        </div>

        {/* Detailed Stage Inspector Card */}
        <div
          ref={detailRef}
          className="p-6 sm:p-8 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-cyan-500/30 shadow-2xl space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-cyan-500 text-slate-950 flex items-center justify-center shrink-0 font-bold shadow-md">
                <CurrentIcon size={24} />
              </div>
              <div>
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                  Stage {current.number} · {current.category}
                </span>
                <h3 className="text-xl sm:text-2xl font-display font-bold text-white">
                  {current.title}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={selectedStage === 0}
                onClick={() => setSelectedStage((prev) => Math.max(0, prev - 1))}
                className="px-3 py-1.5 rounded-lg border border-white/20 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold disabled:opacity-30 transition-colors"
              >
                ← Prev Stage
              </button>
              <button
                type="button"
                disabled={selectedStage === stages.length - 1}
                onClick={() => setSelectedStage((prev) => Math.min(stages.length - 1, prev + 1))}
                className="px-3 py-1.5 rounded-lg border border-white/20 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold disabled:opacity-30 transition-colors"
              >
                Next Stage →
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 p-5 rounded-xl bg-white/5 border border-white/10">
              <div className="text-xs font-mono font-bold text-cyan-400 uppercase">
                What This Means in Plain Words
              </div>
              <p className="text-sm text-slate-100 leading-relaxed">
                {current.plainText}
              </p>
            </div>

            <div className="space-y-2 p-5 rounded-xl bg-white/5 border border-white/10">
              <div className="text-xs font-mono font-bold text-cyan-300 uppercase">
                Clinical & Engineering Implementation
              </div>
              <p className="text-xs text-blue-200/90 font-mono leading-relaxed">
                {current.technicalDetails}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
