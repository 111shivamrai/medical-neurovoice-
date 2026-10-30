'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useTheme } from '@/components/ThemeProvider'
import {
  Mic,
  Volume2,
  Filter,
  Layers,
  BarChart3,
  Cpu,
  HelpCircle,
  TrendingUp,
  FileDown,
  CheckCircle2,
} from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface Stage {
  number: string
  step: number
  title: string
  shortText: string
  description: string
  technicalDetails: string[]
  color: string
  icon: any
}

export function PipelineSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const [activeStage, setActiveStage] = useState(0)
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const stages: Stage[] = [
    {
      number: '01',
      step: 1,
      title: 'Speech Acquisition',
      shortText: 'Record via browser mic or upload audio',
      description:
        'Zero-install lossless capture directly in the web browser. Supports uncompressed WAV, MP3, FLAC, and OGG formats with automatic 16-bit 44.1 kHz resynthesis for mobile devices.',
      technicalDetails: ['WebAudio API streaming', 'Cross-platform mobile optimization', 'Dual Hindi & English prompts'],
      color: '#6366F1',
      icon: Mic,
    },
    {
      number: '02',
      step: 2,
      title: 'Voice Quality Check',
      shortText: 'SNR and loudness check before analysis',
      description:
        'Immediate signal-to-noise ratio (SNR > 18 dB) and root-mean-square (RMS) energy threshold evaluation prevents silent, clipping, or excessively muffled audio from contaminating diagnostic models.',
      technicalDetails: ['Real-time SNR gating', 'Clipping detection (> -0.5 dBFS)', 'Voice Activity Detection (VAD)'],
      color: '#818CF8',
      icon: Volume2,
    },
    {
      number: '03',
      step: 3,
      title: 'Noise Reduction',
      shortText: 'Wiener filtering removes background noise',
      description:
        'Advanced a priori Wiener filtering and non-stationary spectral subtraction eliminate rural clinic ambient noise, fan hums, street traffic, and indoor room reverberations while preserving vocal harmonics.',
      technicalDetails: ['A priori SNR Wiener filtering', 'Acoustic echo cancellation', 'Preserved harmonic integrity'],
      color: '#22D3EE',
      icon: Filter,
    },
    {
      number: '04',
      step: 4,
      title: 'Segmentation',
      shortText: '25ms windows with 10ms stride',
      description:
        'Continuous speech is split into overlapping 25-millisecond frames with 10ms step intervals using Hamming windows, ensuring phoneme-level stationarity conforming to clinical phonetics standards.',
      technicalDetails: ['Hamming window weighting', '10ms frame advancement', 'Unvoiced frame masking'],
      color: '#38BDF8',
      icon: Layers,
    },
    {
      number: '05',
      step: 5,
      title: 'Feature Extraction',
      shortText: 'MFCC, jitter, shimmer, F0, HNR, formants',
      description:
        'Extraction of 20+ acoustic biomarkers including Fundamental Frequency (F0), local Jitter & Shimmer, Harmonics-to-Noise Ratio (HNR), 13 Mel-Frequency Cepstral Coefficients (MFCCs), and F1-F4 vocal tract formants.',
      technicalDetails: ['Praat-calibrated pitch tracking', 'Delta and Delta-Delta MFCCs', 'Recurrence Period Density Entropy'],
      color: '#34D399',
      icon: BarChart3,
    },
    {
      number: '06',
      step: 6,
      title: 'AI Model Fusion',
      shortText: 'CNN-GRU + LightGBM + wav2vec 2.0',
      description:
        'Tri-model fusion architecture: A hybrid CNN-GRU deep neural network extracts temporal recurrence, LightGBM evaluates high-dimensional acoustic tabular vectors, and a fine-tuned wav2vec 2.0 captures phonetic embeddings.',
      technicalDetails: ['Multi-modal ensemble weighting', 'Temporal attention gating', 'Pre-trained wav2vec 2.0 Hindi encoder'],
      color: '#10B981',
      icon: Cpu,
    },
    {
      number: '07',
      step: 7,
      title: 'Explainability Layer',
      shortText: 'SHAP + LIME show which features mattered',
      description:
        'Clinicians need rationale, not opaque black boxes. Kernel SHAP and LIME algorithms quantify each acoustic feature\'s marginal contribution to the overall prediction, highlighting patient-specific vocal deviations.',
      technicalDetails: ['Shapley additive explanations', 'Local surrogate LIME curves', 'Feature importance radar graphs'],
      color: '#F59E0B',
      icon: HelpCircle,
    },
    {
      number: '08',
      step: 8,
      title: 'Risk Scoring',
      shortText: '0-100 risk score per disorder',
      description:
        'Calibrated Bayesian posterior probabilities yield continuous 0–100 risk scores with 95% confidence intervals across Parkinson\'s, Alzheimer\'s, Dysarthria, and Post-Stroke Impairment simultaneously.',
      technicalDetails: ['Confidence interval calibration', 'Triage tiering (Low/Moderate/High)', 'Longitudinal baseline delta'],
      color: '#FB923C',
      icon: TrendingUp,
    },
    {
      number: '09',
      step: 9,
      title: 'Report Generation',
      shortText: 'Downloadable PDF with doctor referral',
      description:
        'Automated generation of bilingual (Hindi & English) clinical reports detailing acoustic findings, SHAP graphs, and institutional referral advisories to Jabalpur Medical College neurology OPD.',
      technicalDetails: ['Cryptographically signed PDF', 'Hospital EMR export', 'QR code validation for patient files'],
      color: '#EF4444',
      icon: FileDown,
    },
  ]

  // GSAP ScrollTrigger Integration
  useEffect(() => {
    if (typeof window === 'undefined') return

    const ctx = gsap.context(() => {
      stages.forEach((_, index) => {
        ScrollTrigger.create({
          trigger: `#stage-${index}`,
          start: 'top center+=100',
          end: 'bottom center+=100',
          onEnter: () => setActiveStage(index),
          onEnterBack: () => setActiveStage(index),
        })
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="pipeline"
      ref={containerRef}
      className="py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-300"
      style={{
        background: isDark ? '#0A0F1E' : '#F8FAFC',
      }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span
            className="inline-block px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-4 border"
            style={{
              background: isDark ? 'rgba(34, 211, 238, 0.1)' : 'rgba(8, 145, 178, 0.1)',
              borderColor: isDark ? 'rgba(34, 211, 238, 0.3)' : 'rgba(8, 145, 178, 0.25)',
              color: isDark ? '#22D3EE' : '#0891B2',
            }}
          >
            Algorithmic Transparency
          </span>
          <h2
            className="font-display font-bold tracking-tight mb-6"
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.25rem)',
              color: isDark ? '#F9FAFB' : '#0F172A',
            }}
          >
            The 9-Stage{' '}
            <span style={{ color: '#22D3EE' }}>
              AI Analysis Pipeline
            </span>
          </h2>
          <p
            className="text-base sm:text-lg leading-relaxed"
            style={{ color: isDark ? '#9CA3AF' : '#64748B' }}
          >
            Every 30-second audio sample passes through an end-to-end, scientifically validated pipeline designed
            specifically for diverse Indian voice acoustics and regional clinic constraints.
          </p>
        </div>

        {/* Vertical Pipeline Timeline with Scroll storytelling */}
        <div className="relative">
          {/* Vertical central spine line */}
          <div
            className="absolute left-4 sm:left-8 top-6 bottom-6 w-0.5 pointer-events-none transition-colors"
            style={{
              background: isDark
                ? 'linear-gradient(to bottom, #6366F1 0%, #22D3EE 40%, #10B981 70%, #EF4444 100%)'
                : 'linear-gradient(to bottom, #4F46E5 0%, #0891B2 40%, #059669 70%, #DC2626 100%)',
              opacity: 0.4,
            }}
          />

          <div className="space-y-12 sm:space-y-16">
            {stages.map((stage, idx) => {
              const Icon = stage.icon
              const isCurrent = activeStage === idx

              return (
                <div
                  key={stage.number}
                  id={`stage-${idx}`}
                  className="relative flex items-start gap-6 sm:gap-10 transition-all duration-300"
                >
                  {/* Glowing Node on Timeline */}
                  <div className="relative z-10 flex-shrink-0">
                    <div
                      className="w-8 h-8 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center font-display font-bold text-sm sm:text-xl border transition-all duration-300"
                      style={{
                        background: isCurrent
                          ? stage.color
                          : isDark
                          ? '#111827'
                          : '#FFFFFF',
                        borderColor: isCurrent ? stage.color : isDark ? '#374151' : '#CBD5E1',
                        color: isCurrent ? '#FFFFFF' : stage.color,
                        boxShadow: isCurrent
                          ? `0 0 35px ${stage.color}60`
                          : 'none',
                        transform: isCurrent ? 'scale(1.08)' : 'scale(1)',
                      }}
                    >
                      <span className="hidden sm:inline">{stage.number}</span>
                      <Icon className="sm:hidden w-4 h-4" />
                    </div>
                  </div>

                  {/* Stage Card Content */}
                  <motion.div
                    initial={{ opacity: 0, x: 25 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                    className="flex-1 rounded-2xl p-6 sm:p-8 border transition-all duration-300"
                    style={{
                      background: isDark ? '#111827' : '#FFFFFF',
                      borderColor: isCurrent
                        ? stage.color
                        : isDark
                        ? '#1F2937'
                        : '#E2E8F0',
                      boxShadow: isCurrent
                        ? isDark
                          ? `0 0 45px ${stage.color}15, 0 10px 30px rgba(0,0,0,0.5)`
                          : `0 10px 30px rgba(0,0,0,0.06)`
                        : 'none',
                    }}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{ background: `${stage.color}15`, color: stage.color }}
                        >
                          <Icon size={18} />
                        </div>
                        <h3
                          className="font-display font-bold text-xl sm:text-2xl"
                          style={{ color: isDark ? '#F9FAFB' : '#0F172A' }}
                        >
                          {stage.title}
                        </h3>
                      </div>
                      <span
                        className="font-mono text-xs font-semibold px-2.5 py-1 rounded-md"
                        style={{
                          background: `${stage.color}15`,
                          color: stage.color,
                        }}
                      >
                        STAGE {stage.number} OF 09
                      </span>
                    </div>

                    <p
                      className="text-xs font-mono font-medium mb-3 tracking-wide"
                      style={{ color: stage.color }}
                    >
                      {stage.shortText}
                    </p>

                    <p
                      className="text-sm sm:text-base leading-relaxed mb-5"
                      style={{ color: isDark ? '#9CA3AF' : '#64748B' }}
                    >
                      {stage.description}
                    </p>

                    {/* Technical details pill tags */}
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-inherit">
                      {stage.technicalDetails.map((item) => (
                        <span
                          key={item}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono"
                          style={{
                            background: isDark ? '#1F2937' : '#F1F5F9',
                            color: isDark ? '#D1D5DB' : '#475569',
                            border: `1px solid ${isDark ? '#374151' : '#E2E8F0'}`,
                          }}
                        >
                          <CheckCircle2 size={12} style={{ color: stage.color }} />
                          {item}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
