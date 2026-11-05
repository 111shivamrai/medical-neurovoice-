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
      className="py-24 px-4 sm:px-6 lg:px-8 border-b border-[var(--border)] bg-[#F0F4FB] dark:bg-slate-900 text-[var(--text)] relative overflow-hidden transition-colors"
    >
      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        {/* Header (Removed transparent architecture badge per Fix 8) */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-[var(--text)] tracking-tight">
            The 9-Stage Acoustic Pipeline
          </h2>
          <p className="text-sm sm:text-base text-[var(--muted)] leading-relaxed">
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
                    ? 'bg-[#1B3FA0] text-white font-bold border-[#1B3FA0] shadow-md scale-105'
                    : 'bg-white dark:bg-slate-800 text-[#1B3FA0] dark:text-blue-300 border-[#1B3FA0]/20 dark:border-slate-700 hover:bg-[#1B3FA0]/5'
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
          className="p-6 sm:p-8 rounded-[12px] bg-white dark:bg-slate-800 border border-[#C8D5E8] dark:border-slate-700 shadow-[0_4px_20px_rgba(27,63,160,0.08)] space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#1B3FA0] text-white flex items-center justify-center shrink-0 font-bold shadow-sm">
                <CurrentIcon size={24} />
              </div>
              <div>
                <span className="text-xs font-mono font-bold text-[#1B3FA0] dark:text-blue-400 uppercase tracking-wider">
                  Stage {current.number} · {current.category}
                </span>
                <h3 className="text-xl sm:text-2xl font-display font-bold text-[var(--text)]">
                  {current.title}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={selectedStage === 0}
                onClick={() => setSelectedStage((prev) => Math.max(0, prev - 1))}
                className="px-3 py-1.5 rounded-lg border border-[#C8D5E8] dark:border-slate-600 bg-[#F0F4FB] dark:bg-slate-700 hover:bg-[#E2EAF8] dark:hover:bg-slate-600 text-[var(--text)] text-xs font-semibold disabled:opacity-40 transition-colors"
              >
                ← Prev Stage
              </button>
              <button
                type="button"
                disabled={selectedStage === stages.length - 1}
                onClick={() => setSelectedStage((prev) => Math.min(stages.length - 1, prev + 1))}
                className="px-3 py-1.5 rounded-lg border border-[#C8D5E8] dark:border-slate-600 bg-[#F0F4FB] dark:bg-slate-700 hover:bg-[#E2EAF8] dark:hover:bg-slate-600 text-[var(--text)] text-xs font-semibold disabled:opacity-40 transition-colors"
              >
                Next Stage →
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 p-5 rounded-xl bg-[#F8FAFD] dark:bg-slate-900/60 border border-[#E2EAF8] dark:border-slate-700/60">
              <div className="text-xs font-bold text-[#1B3FA0] dark:text-blue-400 uppercase tracking-wide">
                In simple words:
              </div>
              <p className="text-sm text-[var(--text)] leading-relaxed">
                {current.plainText}
              </p>
            </div>

            <div className="space-y-2 p-5 rounded-xl bg-[#F8FAFD] dark:bg-slate-900/60 border border-[#E2EAF8] dark:border-slate-700/60">
              <div className="text-xs font-bold text-[#1B3FA0] dark:text-blue-400 uppercase tracking-wide">
                Technical details:
              </div>
              <p className="text-xs text-[var(--muted)] font-mono leading-relaxed">
                {current.technicalDetails}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
