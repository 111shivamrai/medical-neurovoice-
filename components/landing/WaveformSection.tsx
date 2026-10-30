'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { Mic, Activity, ShieldCheck, Play, Pause, RefreshCw } from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'

export function WaveformSection() {
  const containerRef = useRef<HTMLElement>(null)
  const isInView = useInView(containerRef, { once: false, margin: '-100px' })
  const [isPlaying, setIsPlaying] = useState(true)
  const [scanProgress, setScanProgress] = useState(0)
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  useEffect(() => {
    if (!isInView || !isPlaying) return
    const interval = setInterval(() => {
      setScanProgress((prev) => (prev >= 100 ? 0 : prev + 1.25))
    }, 50)
    return () => clearInterval(interval)
  }, [isInView, isPlaying])

  // Realistic speech acoustic envelope bars (64 bands)
  const waveBars = [
    12, 18, 24, 38, 52, 68, 85, 94, 82, 65, 45, 32, 28, 48, 72, 88,
    98, 92, 78, 56, 38, 26, 42, 64, 82, 90, 75, 52, 34, 28, 44, 70,
    86, 95, 80, 58, 38, 22, 32, 54, 76, 88, 72, 48, 30, 24, 38, 62,
    80, 92, 84, 60, 42, 28, 34, 52, 70, 84, 68, 46, 30, 20, 15, 10
  ]

  const columns = [
    {
      icon: Mic,
      step: '01',
      title: 'You Speak',
      color: '#6366F1',
      description:
        'Record 30 seconds of natural speech in Hindi or English. No special equipment. Any smartphone, hospital tablet, or low-cost microphone works directly through the browser.',
      highlights: ['Hindi & English prompts', 'No expensive hardware', 'Zero training required'],
    },
    {
      icon: Activity,
      step: '02',
      title: 'We Analyse',
      color: '#22D3EE',
      description:
        'Our 9-stage AI pipeline extracts 20+ acoustic features — jitter, shimmer, pitch entropy, MFCC patterns — the exact biomarkers used in international neurological research.',
      highlights: ['Jitter & Shimmer micro-tremors', 'Pitch entropy & formants', 'Wiener noise filtering'],
    },
    {
      icon: ShieldCheck,
      step: '03',
      title: 'You Know',
      color: '#10B981',
      description:
        'Receive a risk report with evidence — not just a number, but exactly which voice features raised the flag and why, validated by clinical guidelines from Jabalpur Medical College.',
      highlights: ['SHAP explainability breakdown', 'Clinical risk rating (0-100)', 'Printable doctor referral PDF'],
    },
  ]

  return (
    <section
      id="how-it-works"
      ref={containerRef}
      className="py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-300"
      style={{
        background: isDark ? '#0A0F1E' : '#F8FAFC',
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span
            className="inline-block px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-4 border"
            style={{
              background: isDark ? 'rgba(34, 211, 238, 0.1)' : 'rgba(8, 145, 178, 0.1)',
              borderColor: isDark ? 'rgba(34, 211, 238, 0.3)' : 'rgba(8, 145, 178, 0.25)',
              color: isDark ? '#22D3EE' : '#0891B2',
            }}
          >
            Acoustic Biomarker Technology
          </span>
          <h2
            className="font-display font-bold tracking-tight mb-6"
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.25rem)',
              color: isDark ? '#F9FAFB' : '#0F172A',
            }}
          >
            How a 30-Second Recording{' '}
            <span
              style={{
                color: '#22D3EE',
              }}
            >
              Changes Everything
            </span>
          </h2>
          <p
            className="text-base sm:text-lg leading-relaxed"
            style={{ color: isDark ? '#9CA3AF' : '#64748B' }}
          >
            Human vocal folds vibrate over 100 times per second, controlled by intricate neurological pathways.
            When motor neurons degrade, subtle vocal tremors appear years before overt physical tremors become noticeable.
          </p>
        </motion.div>

        {/* Real-looking Animated SVG Waveform Visualizer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="rounded-2xl p-6 sm:p-8 mb-20 border shadow-2xl relative overflow-hidden"
          style={{
            background: isDark ? '#111827' : '#FFFFFF',
            borderColor: isDark ? '#1F2937' : '#E2E8F0',
            boxShadow: isDark
              ? '0 0 50px rgba(34, 211, 238, 0.08), 0 20px 40px rgba(0,0,0,0.4)'
              : '0 20px 40px rgba(0,0,0,0.06)',
          }}
        >
          {/* Visualizer Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-inherit">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0A0F1E] border border-cyan-500/20">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                <span className="font-mono text-xs font-semibold text-cyan-300">
                  REALTIME SPECTROGRAM ACTIVE
                </span>
              </div>
              <span className="hidden sm:inline text-xs font-mono text-gray-400">
                Sampling Rate: 44.1 kHz · 16-bit PCM
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border"
                style={{
                  background: isDark ? '#1F2937' : '#F1F5F9',
                  borderColor: isDark ? '#374151' : '#CBD5E1',
                  color: isDark ? '#F9FAFB' : '#0F172A',
                }}
              >
                {isPlaying ? <Pause size={13} /> : <Play size={13} fill="currentColor" />}
                <span>{isPlaying ? 'Pause' : 'Resume'}</span>
              </button>
              <button
                onClick={() => setScanProgress(0)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white transition-colors"
                title="Restart playback"
                aria-label="Restart playback"
              >
                <RefreshCw size={14} />
              </button>
            </div>
          </div>

          {/* Waveform graphic with scanning playhead */}
          <div className="relative h-36 sm:h-44 flex items-center justify-between gap-1 sm:gap-1.5 px-2">
            {waveBars.map((height, i) => {
              const barPos = (i / waveBars.length) * 100
              const isScanned = barPos <= scanProgress
              const isLead = Math.abs(barPos - scanProgress) < 4

              return (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center justify-center h-full relative"
                >
                  <div
                    className="w-full rounded-full transition-all duration-200"
                    style={{
                      height: `${height}%`,
                      background: isLead
                        ? '#22D3EE'
                        : isScanned
                        ? 'linear-gradient(to top, #6366F1, #22D3EE)'
                        : isDark
                        ? '#1F2937'
                        : '#E2E8F0',
                      boxShadow: isLead ? '0 0 15px #22D3EE' : 'none',
                      opacity: isScanned ? 1 : 0.45,
                    }}
                  />
                </div>
              )
            })}

            {/* Glowing scan laser playhead */}
            <div
              className="absolute top-0 bottom-0 w-0.5 pointer-events-none transition-all duration-75"
              style={{
                left: `${scanProgress}%`,
                background: '#22D3EE',
                boxShadow: '0 0 20px #22D3EE, 0 0 40px #22D3EE',
              }}
            >
              <div className="absolute top-0 -left-1 w-2.5 h-2.5 rounded-full bg-cyan-300 shadow-[0_0_10px_#22D3EE]" />
              <div className="absolute bottom-0 -left-1 w-2.5 h-2.5 rounded-full bg-cyan-300 shadow-[0_0_10px_#22D3EE]" />
            </div>
          </div>

          {/* Visualizer Timeline footer */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-inherit text-xs font-mono">
            <span style={{ color: isDark ? '#9CA3AF' : '#64748B' }}>00:00.0s (Speech Start)</span>
            <span className="font-semibold text-cyan-400">
              {scanProgress.toFixed(1)}% Completed · Harmonic-to-Noise Ratio (HNR): 24.1 dB
            </span>
            <span style={{ color: isDark ? '#9CA3AF' : '#64748B' }}>00:30.0s (Clinical Benchmark)</span>
          </div>
        </motion.div>

        {/* 3 Process Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {columns.map((col, index) => {
            const Icon = col.icon
            return (
              <motion.div
                key={col.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.15 }}
                className="rounded-2xl p-8 border flex flex-col transition-all duration-300 hover:-translate-y-2 group"
                style={{
                  background: isDark ? '#111827' : '#FFFFFF',
                  borderColor: isDark ? `${col.color}25` : '#E2E8F0',
                  boxShadow: isDark
                    ? `0 0 35px ${col.color}08`
                    : '0 10px 25px rgba(0,0,0,0.04)',
                }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{
                      background: `${col.color}15`,
                      color: col.color,
                      border: `1px solid ${col.color}30`,
                    }}
                  >
                    <Icon size={26} />
                  </div>
                  <span
                    className="font-mono text-xs font-bold px-3 py-1 rounded-full border"
                    style={{
                      color: col.color,
                      borderColor: `${col.color}40`,
                      background: `${col.color}10`,
                    }}
                  >
                    STEP {col.step}
                  </span>
                </div>

                <h3
                  className="font-display font-bold text-2xl mb-4"
                  style={{ color: isDark ? '#F9FAFB' : '#0F172A' }}
                >
                  {col.title}
                </h3>

                <p
                  className="text-sm leading-relaxed mb-6 flex-1"
                  style={{ color: isDark ? '#9CA3AF' : '#64748B' }}
                >
                  {col.description}
                </p>

                <div className="space-y-2 pt-4 border-t border-inherit">
                  {col.highlights.map((item) => (
                    <div key={item} className="flex items-center gap-2 text-xs font-medium">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: col.color }} />
                      <span style={{ color: isDark ? '#E5E7EB' : '#334155' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
