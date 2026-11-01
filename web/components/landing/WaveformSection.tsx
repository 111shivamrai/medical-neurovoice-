'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { Mic, Activity, ShieldCheck, Play, Pause, RefreshCw } from 'lucide-react'

export function WaveformSection() {
  const containerRef = useRef<HTMLElement>(null)
  const isInView = useInView(containerRef, { once: false, margin: '-100px' })
  const [isPlaying, setIsPlaying] = useState(true)
  const [scanProgress, setScanProgress] = useState(0)

  useEffect(() => {
    if (!isInView || !isPlaying) return
    const interval = setInterval(() => {
      setScanProgress((prev) => (prev >= 100 ? 0 : prev + 1.25))
    }, 50)
    return () => clearInterval(interval)
  }, [isInView, isPlaying])

  const waveBars = [
    12, 18, 24, 38, 52, 68, 85, 94, 82, 65, 45, 32, 28, 48, 72, 88,
    98, 92, 78, 56, 38, 26, 42, 64, 82, 90, 75, 52, 34, 28, 44, 70,
    86, 95, 80, 58, 38, 22, 32, 54, 76, 88, 72, 48, 30, 24, 38, 62,
    80, 92, 84, 60, 42, 28, 34, 52, 70, 84, 68, 46, 30, 20, 15, 10,
  ]

  const steps = [
    {
      step: '01',
      title: 'Step 1: Speak',
      short: 'Record 30 seconds',
      description: 'Record 30 seconds of natural sustained vowels and speech on any phone or browser. Hindi or English.',
      icon: Mic,
      accent: 'var(--primary)',
    },
    {
      step: '02',
      title: 'Step 2: Analyse',
      short: '9-stage AI pipeline',
      description: 'The 9-stage pipeline extracts 20+ acoustic biomarkers (jitter, shimmer, HNR, MFCCs, pauses).',
      icon: Activity,
      accent: 'var(--accent)',
    },
    {
      step: '03',
      title: 'Step 3: Know',
      short: 'Evidence-based report',
      description: 'Receive an objective risk profile with SHAP feature evidence and specialist consultation guidance.',
      icon: ShieldCheck,
      accent: 'var(--success)',
    },
  ]

  return (
    <section
      id="how-it-works"
      ref={containerRef}
      className="py-24 px-4 sm:px-6 lg:px-8 bg-[var(--surface)] border-b border-[var(--border)] transition-colors duration-300"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-4 bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20">
            Three Simple Steps
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-[var(--text)] tracking-tight mb-4">
            How NeuroVoice Works
          </h2>
          <p className="text-base sm:text-lg text-[var(--text-muted)] leading-relaxed">
            Zero specialized hardware. Immediate acoustic feature analysis calibrated for standard low-cost microphones.
          </p>
        </div>

        {/* Live Waveform Spectrogram Simulator */}
        <div className="mb-16 p-6 sm:p-8 rounded-2xl bg-[var(--bg)] border border-[var(--border)] relative overflow-hidden">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--border)]">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-[var(--accent)] animate-ping" />
              <span className="text-xs font-mono uppercase tracking-wider text-[var(--text)]">
                Live Spectro-Acoustic Analysis Playhead
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1.5 rounded-lg bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] text-xs"
              >
                {isPlaying ? <Pause size={14} /> : <Play size={14} />}
              </button>
              <button
                type="button"
                onClick={() => setScanProgress(0)}
                className="p-1.5 rounded-lg bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] text-xs"
              >
                <RefreshCw size={14} />
              </button>
            </div>
          </div>

          {/* Dynamic 64-Band Waveform Bar Visualizer */}
          <div className="relative h-28 flex items-end justify-between gap-1">
            {/* Playhead vertical line */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-[var(--accent)] z-20 shadow-[0_0_10px_var(--accent)] transition-all pointer-events-none"
              style={{ left: `${scanProgress}%` }}
            />

            {waveBars.map((bar, i) => {
              const isPast = (i / waveBars.length) * 100 <= scanProgress
              return (
                <div
                  key={i}
                  className="flex-1 rounded-t transition-all duration-150"
                  style={{
                    height: `${bar}%`,
                    backgroundColor: isPast ? 'var(--accent)' : 'var(--border)',
                    opacity: isPast ? 0.9 : 0.4,
                  }}
                />
              )
            })}
          </div>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((st) => {
            const Icon = st.icon
            return (
              <div
                key={st.step}
                className="p-8 rounded-2xl bg-[var(--bg)] border border-[var(--border)] hover:border-[var(--accent)] transition-all"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[var(--surface-2)] text-[var(--accent)]">
                    <Icon size={24} />
                  </div>
                  <span className="text-2xl font-display font-extrabold text-[var(--text-muted)]">
                    {st.step}
                  </span>
                </div>
                <h3 className="text-xl font-bold font-display text-[var(--text)] mb-1">
                  {st.title}
                </h3>
                <div className="text-xs font-mono text-[var(--accent)] mb-3">
                  {st.short}
                </div>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                  {st.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
