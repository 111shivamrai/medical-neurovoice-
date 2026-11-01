'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Play, ArrowRight, Sparkles } from 'lucide-react'
import dynamic from 'next/dynamic'
import { VideoModal } from './VideoModal'
import { ErrorBoundary } from '@/components/ErrorBoundary'

// Dynamically import 3D Listening Robot
const RobotCanvas = dynamic(
  () => import('./RobotCanvas').then((mod) => mod.RobotCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[380px] sm:h-[460px] flex items-center justify-center">
        <div className="w-48 h-48 rounded-full border border-[var(--primary)]/20 animate-pulse bg-[var(--primary)]/5" />
      </div>
    ),
  }
)

function CountUpNumber({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0)

  useEffect(() => {
    let startTimestamp: number | null = null
    const duration = 1800

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / duration, 1)
      const easeProgress = 1 - Math.pow(1 - progress, 3)
      setVal(Math.floor(easeProgress * target))
      if (progress < 1) requestAnimationFrame(step)
      else setVal(target)
    }
    requestAnimationFrame(step)
  }, [target])

  return (
    <span className="font-mono font-bold tracking-tight">
      {val}
      {suffix}
    </span>
  )
}

export function HeroSection() {
  const [isVideoOpen, setIsVideoOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkWidth = () => setIsMobile(window.innerWidth < 768)
    checkWidth()
    window.addEventListener('resize', checkWidth)
    return () => window.removeEventListener('resize', checkWidth)
  }, [])

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-28 pb-16 bg-[var(--bg)] transition-colors duration-300"
    >
      {/* Ambient background glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-3/4 h-[500px] pointer-events-none blur-3xl opacity-20 -z-10"
        style={{
          background: 'radial-gradient(circle, var(--primary) 0%, var(--accent) 50%, transparent 75%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: 3D Listening Robot (Desktop) / Static SVG Fallback (Mobile) */}
          <div className="lg:col-span-5 flex justify-center order-2 lg:order-1">
            {!isMobile ? (
              <ErrorBoundary
                fallback={
                  <div className="w-full h-[380px] flex items-center justify-center">
                    <svg width="240" height="240" viewBox="0 0 100 100" className="animate-pulse stroke-[var(--accent)] fill-none">
                      <circle cx="50" cy="50" r="40" strokeWidth="1.5" strokeDasharray="3 3" />
                      <circle cx="50" cy="50" r="16" fill="var(--primary)" opacity="0.3" />
                    </svg>
                  </div>
                }
              >
                <RobotCanvas />
              </ErrorBoundary>
            ) : (
              /* Static SVG Fallback for under 768px */
              <div className="w-full max-w-[280px] h-[300px] flex items-center justify-center relative">
                <div className="absolute inset-0 rounded-full bg-[var(--primary)]/10 blur-2xl" />
                <svg width="220" height="220" viewBox="0 0 120 120" className="relative z-10 fill-none">
                  {/* Head outline */}
                  <rect x="25" y="30" width="70" height="55" rx="20" fill="var(--surface)" stroke="var(--border)" strokeWidth="2" />
                  {/* Visor */}
                  <rect x="35" y="44" width="50" height="22" rx="8" fill="#0A0F1E" stroke="var(--accent)" strokeWidth="1.5" />
                  <path d="M42 55 Q48 48 54 55 T66 55 T78 55" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />
                  {/* Headphones */}
                  <rect x="18" y="44" width="8" height="24" rx="4" fill="var(--primary)" />
                  <rect x="94" y="44" width="8" height="24" rx="4" fill="var(--primary)" />
                  {/* Headband */}
                  <path d="M22 45 C22 20 98 20 98 45" stroke="var(--border)" strokeWidth="3" />
                  {/* Antenna */}
                  <line x1="60" y1="30" x2="60" y2="15" stroke="var(--text-muted)" strokeWidth="2" />
                  <circle cx="60" cy="12" r="5" fill="var(--accent)" className="animate-ping" />
                  <circle cx="60" cy="12" r="4" fill="var(--accent)" />
                </svg>
              </div>
            )}
          </div>

          {/* Right: Required Hero Copy Stack */}
          <div className="lg:col-span-7 flex flex-col items-start order-1 lg:order-2">
            {/* Collaboration Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold mb-6 bg-[var(--surface)] border border-[var(--border)] text-[var(--text-muted)]">
              <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
              Developed in collaboration with Jabalpur Medical College
            </div>

            {/* Line 1 (italic accent) */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-base sm:text-lg font-medium italic text-[var(--accent)] mb-2 font-display"
            >
              Thirty seconds.
            </motion.p>

            {/* Line 2 (massive) */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display font-extrabold tracking-tight text-3xl sm:text-5xl lg:text-6xl text-[var(--text)] leading-[1.08] mb-6"
            >
              YOUR VOICE KNOWS{' '}
              <span className="text-[var(--primary)] block sm:inline">
                BEFORE YOU DO.
              </span>
            </motion.h1>

            {/* Line 3 (subtext) */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-[var(--text-muted)] leading-relaxed mb-4 max-w-xl"
            >
              NeuroVoice listens for the earliest neurological signals in your speech — in Hindi or English,
              on any phone, without a hospital visit.
            </motion.p>

            {/* Line 4 (Hindi line) */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="text-base sm:text-xl font-medium text-[var(--accent)] mb-8 font-body"
            >
              आपकी आवाज़ में है पहला संकेत।
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 mb-10"
            >
              <Link
                href="/dashboard/scan"
                className="btn-primary px-7 py-3.5 text-base font-semibold text-white rounded-xl shadow-lg"
              >
                Start Free Screening
                <ArrowRight size={18} />
              </Link>

              <button
                type="button"
                onClick={() => setIsVideoOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] hover:border-[var(--accent)] transition-all"
              >
                <Play size={16} className="text-[var(--accent)] fill-[var(--accent)]" />
                Watch How It Works →
              </button>
            </motion.div>

            {/* Bottom: Animated Stat Row Counting Up */}
            <div className="w-full pt-6 border-t border-[var(--border)] grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
              <div>
                <div className="text-xl sm:text-2xl font-bold font-display text-[var(--primary)]">
                  <CountUpNumber target={4} /> Disorders
                </div>
                <div className="text-xs text-[var(--text-muted)] mt-0.5">Tracked conditions</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold font-display text-[var(--accent)]">
                  <CountUpNumber target={20} suffix="+" /> Biomarkers
                </div>
                <div className="text-xs text-[var(--text-muted)] mt-0.5">Acoustic metrics</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold font-display text-[var(--text)]">
                  Hindi + English
                </div>
                <div className="text-xs text-[var(--text-muted)] mt-0.5">Dual-language AI</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold font-display text-[var(--success)]">
                  Rural Ready
                </div>
                <div className="text-xs text-[var(--text-muted)] mt-0.5">Low-bandwidth / ASHA</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <VideoModal isOpen={isVideoOpen} onClose={() => setIsVideoOpen(false)} />
    </section>
  )
}
