'use client'

import React, { useEffect, useRef, useState } from 'react'
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
  plainDescription: string
  color: string
  icon: any
}

export function PipelineSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeStage, setActiveStage] = useState(0)

  const stages: Stage[] = [
    {
      number: '01',
      step: 1,
      title: 'Speech Acquisition',
      shortText: 'Browser mic capture',
      plainDescription: 'Record 30 seconds of speech in Hindi or English on any smartphone or laptop without software installation.',
      color: 'var(--primary)',
      icon: Mic,
    },
    {
      number: '02',
      step: 2,
      title: 'Voice Quality Check',
      shortText: 'SNR and loudness check',
      plainDescription: 'Real-time noise and loudness verification ensures only clean, audible phonation enters the analysis pipeline.',
      color: 'var(--primary)',
      icon: Volume2,
    },
    {
      number: '03',
      step: 3,
      title: 'Noise Reduction',
      shortText: 'Wiener acoustic filtering',
      plainDescription: 'Eliminates ambient background noise, room reverberation, and ceiling fan hum while preserving vocal fold harmonics.',
      color: 'var(--accent)',
      icon: Filter,
    },
    {
      number: '04',
      step: 4,
      title: 'Segmentation',
      shortText: '25ms frames with 10ms stride',
      plainDescription: 'Continuous audio is divided into 25-millisecond overlapping speech frames conforming to phonetics standards.',
      color: 'var(--accent)',
      icon: Layers,
    },
    {
      number: '05',
      step: 5,
      title: 'Feature Extraction',
      shortText: 'MFCC, jitter, shimmer, HNR',
      plainDescription: 'Extracts 20+ acoustic parameters: fundamental pitch, vocal tremor (jitter/shimmer), HNR, formants, and MFCC patterns.',
      color: 'var(--success)',
      icon: BarChart3,
    },
    {
      number: '06',
      step: 6,
      title: 'AI Model Fusion',
      shortText: 'CNN-GRU + LightGBM + wav2vec',
      plainDescription: 'Combines temporal recurrence, tabular acoustic vectors, and phonetic speech embeddings into a unified representation.',
      color: 'var(--success)',
      icon: Cpu,
    },
    {
      number: '07',
      step: 7,
      title: 'Explainability Layer',
      shortText: 'SHAP shows which features mattered',
      plainDescription: 'Quantifies each acoustic feature’s exact contribution to the risk score, highlighting specific vocal deviations for doctors.',
      color: 'var(--warning)',
      icon: HelpCircle,
    },
    {
      number: '08',
      step: 8,
      title: 'Risk Scoring',
      shortText: '0-100 risk score per disorder',
      plainDescription: 'Produces continuous 0–100 Bayesian risk scores for Parkinson’s, Alzheimer’s, Dysarthria, and Post-Stroke Impairment.',
      color: 'var(--warning)',
      icon: TrendingUp,
    },
    {
      number: '09',
      step: 9,
      title: 'Report Generation',
      shortText: 'Downloadable PDF with doctor referral',
      plainDescription: 'Generates a 5-page clinical PDF report with biomarker tables, SHAP feature rankings, and specialist consultation advice.',
      color: 'var(--danger)',
      icon: FileDown,
    },
  ]

  // GSAP ScrollTrigger Integration
  useEffect(() => {
    if (typeof window === 'undefined') return

    let ctx: any = null
    try {
      ctx = gsap.context(() => {
        stages.forEach((_, index) => {
          const el = document.getElementById(`stage-${index}`)
          if (el) {
            ScrollTrigger.create({
              trigger: el,
              start: 'top center+=100',
              end: 'bottom center+=100',
              onEnter: () => setActiveStage(index),
              onEnterBack: () => setActiveStage(index),
            })
          }
        })
      }, containerRef)
    } catch (e) {
      console.warn('ScrollTrigger initialization fallback:', e)
    }

    return () => {
      try {
        ctx?.revert?.()
      } catch {}
    }
  }, [])

  return (
    <section
      id="pipeline"
      ref={containerRef}
      className="py-24 px-4 sm:px-6 lg:px-8 bg-[var(--surface)] border-t border-[var(--border)] transition-colors duration-300"
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-4 bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20">
            Validated Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-[var(--text)] tracking-tight mb-4">
            The 9-Stage AI Voice Pipeline
          </h2>
          <p className="text-base sm:text-lg text-[var(--text-muted)] leading-relaxed">
            Every 30-second recording passes through an end-to-end signal processing and explainability pipeline.
          </p>
        </div>

        {/* Vertical Pipeline Timeline with Scroll storytelling */}
        <div className="relative">
          {/* Vertical central spine line */}
          <div
            className="absolute left-4 sm:left-8 top-6 bottom-6 w-0.5 pointer-events-none transition-colors"
            style={{
              background: 'linear-gradient(to bottom, var(--primary) 0%, var(--accent) 40%, var(--success) 70%, var(--danger) 100%)',
              opacity: 0.35,
            }}
          />

          <div className="space-y-8 sm:space-y-12">
            {stages.map((stage, idx) => {
              const Icon = stage.icon
              const isCurrent = activeStage === idx

              return (
                <div
                  key={stage.number}
                  id={`stage-${idx}`}
                  className="relative flex items-start gap-5 sm:gap-8 transition-all duration-300"
                >
                  {/* Glowing Node on Timeline */}
                  <div className="relative z-10 flex-shrink-0">
                    <div
                      className="w-9 h-9 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center font-display font-bold text-xs sm:text-lg border transition-all duration-300"
                      style={{
                        background: isCurrent ? stage.color : 'var(--bg)',
                        borderColor: isCurrent ? stage.color : 'var(--border)',
                        color: isCurrent ? '#FFFFFF' : 'var(--text-muted)',
                        boxShadow: isCurrent ? `0 0 30px ${stage.color}60` : 'none',
                        transform: isCurrent ? 'scale(1.08)' : 'scale(1)',
                      }}
                    >
                      <span>{stage.number}</span>
                    </div>
                  </div>

                  {/* Stage Content Card */}
                  <div
                    className={`flex-1 p-5 sm:p-6 rounded-2xl border transition-all duration-300 ${
                      isCurrent
                        ? 'bg-[var(--bg)] border-[var(--primary)] shadow-lg'
                        : 'bg-[var(--bg)]/60 border-[var(--border)]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <Icon size={16} className="text-[var(--accent)]" />
                        <h3 className="text-base sm:text-lg font-bold text-[var(--text)] font-display">
                          {stage.title}
                        </h3>
                      </div>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[var(--surface)] text-[var(--text-muted)] border border-[var(--border)]">
                        {stage.shortText}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                      {stage.plainDescription}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
