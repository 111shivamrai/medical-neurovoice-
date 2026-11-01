'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { Mic, Activity, ShieldCheck, HelpCircle } from 'lucide-react'

export function WaveformSection() {
  const containerRef = useRef<HTMLElement>(null)
  const isInView = useInView(containerRef, { once: false, margin: '-100px' })
  const [scanProgress, setScanProgress] = useState(0)

  useEffect(() => {
    if (!isInView) return
    const interval = setInterval(() => {
      setScanProgress((prev) => (prev >= 100 ? 0 : prev + 1.2))
    }, 45)
    return () => clearInterval(interval)
  }, [isInView])

  const waveBars = [
    14, 22, 32, 48, 64, 82, 94, 88, 72, 54, 38, 28, 36, 58, 78, 92,
    98, 88, 74, 52, 36, 26, 44, 68, 86, 92, 78, 56, 38, 26, 42, 66,
    84, 96, 82, 60, 42, 26, 36, 58, 80, 90, 76, 52, 34, 24, 38, 62,
    82, 94, 84, 62, 44, 30, 38, 56, 74, 86, 70, 48, 32, 22, 16, 12,
  ]

  const steps = [
    {
      step: '01',
      title: 'Speak',
      short: '30 seconds on any device',
      description:
        'Sustain an "aaah" sound steadily, read one simple sentence, and describe your morning. Works in Hindi or English using your smartphone or laptop microphone.',
      glossary: [
        { term: 'Phonation', explanation: 'The natural sound produced when your vocal cords vibrate with air from your lungs.' },
        { term: 'Acoustic Task', explanation: 'A structured, standardised speech exercise designed to reveal subtle motor coordination.' },
      ],
      icon: Mic,
      color: 'var(--primary)',
    },
    {
      step: '02',
      title: 'We measure',
      short: '20+ vocal biomarkers extracted',
      description:
        'Our algorithms extract cycle-by-cycle acoustic measurements across pitch stability, amplitude consistency, breathiness, and articulatory speed.',
      glossary: [
        { term: 'Jitter', explanation: 'Tiny micro-tremors in your vocal cord pitch from one cycle to the next.' },
        { term: 'Shimmer', explanation: 'Microscopic variations in vocal loudness caused by incomplete vocal cord closure.' },
        { term: 'HNR (Harmonics-to-Noise Ratio)', explanation: 'A measure of how clear and crisp your voice is versus turbulent, breathy air leakage.' },
        { term: 'Formants', explanation: 'Natural resonance frequencies shaped by the precise movement of your tongue, jaw, and lips.' },
      ],
      icon: Activity,
      color: 'var(--accent)',
    },
    {
      step: '03',
      title: 'You understand',
      short: 'Honest, transparent results',
      description:
        'You receive an objective screening profile grouped into plain-language risk tiers (Low, Moderate, Elevated), with an explanation of every influencing factor.',
      glossary: [
        { term: 'Screening Indication', explanation: 'An early mathematical indicator to discuss with a neurologist — not a clinical diagnosis.' },
        { term: 'Feature Influence', explanation: 'A plain-language explanation of which vocal dimensions varied from typical reference ranges.' },
      ],
      icon: ShieldCheck,
      color: 'var(--success)',
    },
  ]

  return (
    <section
      id="how-it-works"
      ref={containerRef}
      className="py-20 px-4 sm:px-6 lg:px-8 bg-[var(--surface)] border-b border-[var(--border)] transition-colors duration-200"
    >
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[var(--accent)]">
            Simple 3-Step Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-[var(--text)] tracking-tight">
            How NeuroVoice Works
          </h2>
          <p className="text-sm sm:text-base text-[var(--muted)] leading-relaxed">
            Neurological screening made straightforward, respectful, and transparent. Every technical term explained in plain words.
          </p>
        </div>

        {/* Live Audio Visualizer Canvas Container */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] shadow-[var(--shadow-sm)] space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-mono text-[var(--muted)]">
            <span className="flex items-center gap-2 text-[var(--text)] font-semibold">
              <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-ping" />
              Real-Time Acoustic Inspection Simulation (30-Second Sustained Phonation)
            </span>
            <span className="text-[var(--accent)] font-semibold">
              Progress: {Math.floor(scanProgress)}% · 44.1 kHz 16-bit
            </span>
          </div>

          {/* Oscilloscope Bar Waveform */}
          <div className="h-28 sm:h-32 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-between px-3 sm:px-6 gap-1 relative overflow-hidden">
            {/* Playhead bar */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-[var(--primary)] z-20 transition-all pointer-events-none shadow-sm"
              style={{ left: `${scanProgress}%` }}
            />

            {waveBars.map((val, idx) => {
              const active = (idx / waveBars.length) * 100 <= scanProgress
              return (
                <div
                  key={idx}
                  className="flex-1 rounded-full transition-all duration-150"
                  style={{
                    height: `${val}%`,
                    backgroundColor: active ? 'var(--primary)' : 'var(--border)',
                    opacity: active ? 1 : 0.45,
                  }}
                />
              )
            })}
          </div>
        </div>

        {/* The 3 Clean Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((st) => {
            const Icon = st.icon
            return (
              <div
                key={st.step}
                className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  {/* Step Header */}
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-display font-extrabold text-[var(--muted)]/40">
                      {st.step}
                    </span>
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                      style={{ backgroundColor: st.color }}
                    >
                      <Icon size={20} />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-display font-bold text-[var(--text)]">
                      {st.title}
                    </h3>
                    <div className="text-xs font-semibold text-[var(--accent)] mt-0.5">
                      {st.short}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
                    {st.description}
                  </p>
                </div>

                {/* Technical Glossary Explanations */}
                <div className="pt-4 border-t border-[var(--border)] space-y-2">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--muted)] font-bold flex items-center gap-1">
                    <HelpCircle size={12} className="text-[var(--accent)]" />
                    Plain-Language Glossary
                  </div>
                  <div className="space-y-1.5">
                    {st.glossary.map((g) => (
                      <div key={g.term} className="text-xs">
                        <span className="font-semibold text-[var(--text)]">{g.term}: </span>
                        <span className="text-[var(--muted)]">{g.explanation}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
