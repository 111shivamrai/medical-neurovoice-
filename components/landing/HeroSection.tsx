'use client'

import { Suspense, useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { Play, ChevronDown, Brain, ArrowRight, Sparkles } from 'lucide-react'
import { VideoModal } from './VideoModal'
import { useTheme } from '@/components/ThemeProvider'
import { ErrorBoundary } from '@/components/ErrorBoundary'

// Dynamically import Three.js particle canvas to prevent SSR hydration mismatches
const ParticleBrain = dynamic(() => import('./ParticleBrain'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative w-64 h-64 rounded-full border border-indigo-500/20 animate-pulse flex items-center justify-center">
        <div className="w-48 h-48 rounded-full border border-cyan-500/20 animate-ping" />
        <Brain size={48} className="text-indigo-400 opacity-60 animate-pulse" />
      </div>
    </div>
  ),
})

function CountUpNumber({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-20px' })

  useEffect(() => {
    if (!inView) return
    let startTimestamp: number | null = null
    const duration = 2000

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / duration, 1)
      const easeProgress = 1 - Math.pow(1 - progress, 3)
      setVal(Math.floor(easeProgress * target))
      if (progress < 1) {
        requestAnimationFrame(step)
      } else {
        setVal(target)
      }
    }
    requestAnimationFrame(step)
  }, [inView, target])

  return (
    <span ref={ref} className="font-mono font-bold tracking-tight">
      {val}
      {suffix}
    </span>
  )
}

export function HeroSection() {
  const [isVideoOpen, setIsVideoOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  useEffect(() => {
    const checkWidth = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkWidth()
    window.addEventListener('resize', checkWidth)
    return () => window.removeEventListener('resize', checkWidth)
  }, [])

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-16"
      style={{
        background: isDark
          ? 'radial-gradient(circle at 50% 30%, #111827 0%, #0A0F1E 65%, #050811 100%)'
          : 'radial-gradient(circle at 50% 30%, #FFFFFF 0%, #F8FAFC 65%, #EEF2F6 100%)',
      }}
    >
      {/* 3D Particle Scene / Mobile Fallback */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-85">
        {!isMobile ? (
          <ErrorBoundary
            fallback={
              <div className="w-full h-full flex items-center justify-center relative">
                <div className="absolute w-[360px] h-[360px] rounded-full bg-gradient-to-tr from-indigo-500/15 to-cyan-500/15 blur-3xl" />
                <svg
                  width="320"
                  height="320"
                  viewBox="0 0 100 100"
                  className="animate-pulse opacity-75"
                  fill="none"
                >
                  <circle cx="50" cy="50" r="42" stroke="#6366F1" strokeWidth="0.8" strokeDasharray="2 3" opacity="0.6" />
                  <path
                    d="M50 20C34 20 25 32 25 48C25 64 36 78 50 78C64 78 75 64 75 48C75 32 66 20 50 20Z"
                    stroke="#22D3EE"
                    strokeWidth="1.2"
                    opacity="0.8"
                  />
                  <path d="M32 48 H68 M50 28 V68" stroke="#6366F1" strokeWidth="0.8" opacity="0.5" />
                </svg>
              </div>
            }
          >
            <Suspense
              fallback={
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-48 h-48 rounded-full border border-indigo-500/20 animate-pulse" />
                </div>
              }
            >
              <ParticleBrain />
            </Suspense>
          </ErrorBoundary>
        ) : (
          /* High-quality responsive mobile fallback graphic */
          <div className="w-full h-full flex items-center justify-center relative">
            <div className="absolute w-[320px] h-[320px] rounded-full bg-gradient-to-tr from-indigo-500/15 to-cyan-500/15 blur-3xl" />
            <svg
              width="280"
              height="280"
              viewBox="0 0 100 100"
              className="animate-float opacity-70"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="50" cy="50" r="42" stroke="#6366F1" strokeWidth="0.8" strokeDasharray="2 3" opacity="0.6" />
              <path
                d="M50 20C34 20 25 32 25 48C25 64 36 78 50 78C64 78 75 64 75 48C75 32 66 20 50 20Z"
                stroke="#22D3EE"
                strokeWidth="1.2"
                strokeDasharray="4 2"
                opacity="0.8"
              />
              <path
                d="M32 48 H68 M50 28 V68 M38 36 Q50 48 62 36 M38 60 Q50 48 62 60"
                stroke="#6366F1"
                strokeWidth="0.8"
                opacity="0.5"
              />
              <circle cx="50" cy="50" r="4" fill="#22D3EE" className="animate-ping" />
            </svg>
          </div>
        )}
      </div>

      {/* Atmospheric lighting gradient overlays */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-80 pointer-events-none z-0 blur-3xl opacity-30"
        style={{
          background: 'radial-gradient(ellipse at top, #6366F1 0%, #22D3EE 40%, transparent 70%)',
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none z-10"
        style={{
          background: isDark
            ? 'linear-gradient(to top, #0A0F1E, transparent)'
            : 'linear-gradient(to top, #F8FAFC, transparent)',
        }}
      />

      {/* Hero Foreground Content */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Top Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-xs sm:text-sm font-medium mb-8 border transition-transform hover:scale-105"
          style={{
            background: isDark ? 'rgba(99, 102, 241, 0.12)' : 'rgba(99, 102, 241, 0.08)',
            borderColor: isDark ? 'rgba(99, 102, 241, 0.3)' : 'rgba(99, 102, 241, 0.25)',
            color: isDark ? '#A5B4FC' : '#4F46E5',
            boxShadow: '0 0 20px rgba(99,102,241,0.15)',
          }}
        >
          <span className="text-base">🧠</span>
          <span className="font-semibold tracking-wide">Trusted by Jabalpur Medical College</span>
          <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-[#22D3EE] animate-pulse" />
        </motion.div>

        {/* H1 (72px desktop, 40px mobile) */}
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="font-display font-extrabold tracking-tight leading-[1.08] mb-6 max-w-4xl"
          style={{
            fontSize: 'clamp(2.5rem, 7vw, 4.5rem)', // 40px to 72px
            color: isDark ? '#F9FAFB' : '#0F172A',
          }}
        >
          Your Voice Knows{' '}
          <span
            className="block sm:inline"
            style={{
              color: '#22D3EE',
              textShadow: isDark
                ? '0 0 45px rgba(34, 211, 238, 0.45)'
                : '0 0 30px rgba(8, 145, 178, 0.25)',
            }}
          >
            Before You Do.
          </span>
        </motion.h1>

        {/* Subheading (20px, clean & readable) */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="font-body text-base sm:text-xl leading-relaxed mb-10 max-w-2xl"
          style={{
            color: isDark ? '#9CA3AF' : '#475569',
          }}
        >
          NeuroVoice analyses acoustic biomarkers in your speech to detect early signs of{' '}
          <strong className={isDark ? 'text-white' : 'text-slate-900'}>
            Parkinson's, Alzheimer's, dysarthria and post-stroke impairment
          </strong>{' '}
          — in 30 seconds, in Hindi or English, on any device.
        </motion.p>

        {/* CTA Buttons (Side by Side) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-16"
        >
          <Link
            href="/signup"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-display font-bold text-base sm:text-lg text-white transition-all duration-300 hover:scale-[1.03] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]"
            style={{
              background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
              boxShadow: '0 0 40px rgba(99, 102, 241, 0.55)',
            }}
          >
            <span>Start Free Screening</span>
            <ArrowRight size={18} />
          </Link>

          <button
            onClick={() => setIsVideoOpen(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl font-display font-semibold text-base sm:text-lg transition-all duration-300 hover:scale-[1.03] active:scale-95 border"
            style={{
              color: isDark ? '#F9FAFB' : '#0F172A',
              borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)',
              background: isDark ? 'rgba(17, 24, 39, 0.7)' : 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <div className="w-7 h-7 rounded-full bg-cyan-500/20 text-[#22D3EE] flex items-center justify-center">
              <Play size={13} fill="currentColor" className="translate-x-0.5" />
            </div>
            <span>Watch How It Works →</span>
          </button>
        </motion.div>

        {/* Bottom stats row (animated count-up on scroll) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="w-full max-w-4xl pt-6 border-t"
          style={{
            borderColor: isDark ? 'rgba(31, 41, 55, 0.7)' : 'rgba(226, 232, 240, 0.9)',
          }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="text-2xl sm:text-3xl font-bold font-display" style={{ color: '#22D3EE' }}>
                <CountUpNumber target={4} />
              </div>
              <p className="text-xs sm:text-sm font-medium mt-1" style={{ color: isDark ? '#9CA3AF' : '#64748B' }}>
                Disorders Detected
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="text-2xl sm:text-3xl font-bold font-display" style={{ color: '#6366F1' }}>
                <CountUpNumber target={15} suffix="+" />
              </div>
              <p className="text-xs sm:text-sm font-medium mt-1" style={{ color: isDark ? '#9CA3AF' : '#64748B' }}>
                Acoustic Biomarkers
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div
                className="text-2xl sm:text-3xl font-bold font-display"
                style={{ color: isDark ? '#F9FAFB' : '#0F172A' }}
              >
                Hindi + English
              </div>
              <p className="text-xs sm:text-sm font-medium mt-1" style={{ color: isDark ? '#9CA3AF' : '#64748B' }}>
                Dual-Language Model
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="text-2xl sm:text-3xl font-bold font-display" style={{ color: '#10B981' }}>
                Built for Rural India
              </div>
              <p className="text-xs sm:text-sm font-medium mt-1" style={{ color: isDark ? '#9CA3AF' : '#64748B' }}>
                ASHA & Village Health Post
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll cue (bouncing arrow) */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 cursor-pointer pointer-events-auto"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        onClick={() => {
          document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
        }}
      >
        <span className="text-[11px] font-mono tracking-widest uppercase" style={{ color: isDark ? '#6B7280' : '#94A3B8' }}>
          Explore
        </span>
        <ChevronDown size={18} style={{ color: isDark ? '#9CA3AF' : '#64748B' }} />
      </motion.div>

      {/* Interactive Video Modal */}
      <VideoModal isOpen={isVideoOpen} onClose={() => setIsVideoOpen(false)} />
    </section>
  )
}
