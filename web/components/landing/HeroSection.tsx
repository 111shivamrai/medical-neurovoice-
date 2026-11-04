'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Activity } from 'lucide-react'
import dynamic from 'next/dynamic'
import { ErrorBoundary } from '@/components/ErrorBoundary'

// Dynamically import 3D Listening Robot
const RobotCanvas = dynamic(
  () => import('./RobotCanvas').then((mod) => mod.RobotCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[320px] sm:h-[400px] flex items-center justify-center rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
        <div className="w-16 h-16 rounded-full border-2 border-[var(--primary)] border-t-transparent animate-spin" />
      </div>
    ),
  }
)

export function HeroSection() {
  const [isMobile, setIsMobile] = useState(false)
  const [conditionsCount, setConditionsCount] = useState(4)
  const [measurementsCount, setMeasurementsCount] = useState(20)
  const statRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkWidth = () => setIsMobile(window.innerWidth < 768)
    checkWidth()
    window.addEventListener('resize', checkWidth)

    // Scroll-triggered counter animation
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setConditionsCount(0)
          setMeasurementsCount(0)
          let c = 0
          const timerC = setInterval(() => {
            c += 1
            setConditionsCount(c)
            if (c >= 4) clearInterval(timerC)
          }, 140)

          let m = 0
          const timerM = setInterval(() => {
            m += 2
            setMeasurementsCount(m)
            if (m >= 20) clearInterval(timerM)
          }, 55)
        }
      },
      { threshold: 0.2 }
    )

    if (statRef.current) observer.observe(statRef.current)

    return () => {
      window.removeEventListener('resize', checkWidth)
      observer.disconnect()
    }
  }, [])

  return (
    <section
      id="hero"
      className="hero-radial-bg relative min-h-[92vh] flex items-center justify-center pt-28 pb-16 transition-colors duration-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left: 3D Interactive Listening Robot */}
          <div className="lg:col-span-5 flex justify-center order-2 lg:order-1">
            <div className="w-full max-w-md">
              <ErrorBoundary
                fallback={
                  <div className="w-full h-[320px] rounded-2xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-xs text-[var(--muted)]">
                    3D Visualizer Fallback
                  </div>
                }
              >
                <RobotCanvas />
              </ErrorBoundary>
            </div>
          </div>

          {/* Right: Clean Clinical Copy Stack */}
          <div className="lg:col-span-7 flex flex-col items-start order-1 lg:order-2">
            {/* Clinical Screening Chip */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-5 bg-[var(--surface)] border border-[var(--border)] text-[var(--muted)] shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
              <span>Vocal Neurological Screening Support · Research Tool</span>
            </div>

            {/* Line 1 (italic accent) */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-sm sm:text-base font-semibold italic text-[var(--accent)] mb-2 font-display"
            >
              Thirty seconds.
            </motion.p>

            {/* Line 2 (headline) */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="font-display font-extrabold tracking-tight text-3xl sm:text-5xl lg:text-[3.5rem] text-[var(--text)] leading-[1.1] mb-5"
            >
              YOUR VOICE KNOWS{' '}
              <span className="text-[var(--primary)] block sm:inline">
                BEFORE YOU DO.
              </span>
            </motion.h1>

            {/* Line 3 (subtext) */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-base sm:text-lg text-[var(--muted)] leading-relaxed mb-3 max-w-xl"
            >
              NeuroVoice listens for subtle neuromuscular biomarker deviations in your speech — in Hindi or English,
              on any phone, without complex laboratory equipment.
            </motion.p>

            {/* Line 4 (Hindi line) */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg font-medium text-[var(--accent)] mb-7"
            >
              आपकी आवाज़ में है पहला संकेत।
            </motion.p>

            {/* CTAs with Next.js Protected Route Flow */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8"
            >
              <div className="flex flex-col items-start gap-1.5">
                <Link
                  href="/signin?next=/dashboard/scan"
                  className="btn-primary px-7 py-3.5 text-sm font-semibold rounded-xl shadow-sm hover:shadow transition-all"
                >
                  <span>Start Free Screening</span>
                  <ArrowRight size={16} />
                </Link>
                <div className="text-xs text-[var(--muted)] pl-1">
                  New here?{' '}
                  <Link
                    href="/signup?next=/dashboard/scan"
                    className="font-semibold text-[var(--primary)] hover:underline"
                  >
                    Create account →
                  </Link>
                </div>
              </div>

              <Link
                href="/about/method"
                className="btn-ghost px-5 py-3.5 text-sm font-medium rounded-xl text-[var(--text)]"
              >
                Read Methodology
              </Link>
            </motion.div>

            {/* Exact Required Stat Line with Animated Sine Wave & Number Counter */}
            <div ref={statRef} className="relative w-full pt-5 border-t border-[var(--border)] overflow-hidden">
              {/* Animated SVG sine waveform */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
                preserveAspectRatio="none"
                viewBox="0 0 600 80"
              >
                <path
                  d="M0,40 Q75,10 150,40 T300,40 T450,40 T600,40"
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="2.5"
                />
              </svg>
              <div className="relative z-10 p-3.5 rounded-xl bg-[var(--surface)]/90 backdrop-blur-sm border border-[var(--border)] text-xs sm:text-sm font-medium text-[var(--text)] flex items-center gap-2.5 shadow-sm card-hover-lift">
                <Activity size={18} className="text-[var(--primary)] shrink-0" />
                <span>
                  <strong>{conditionsCount} conditions screened</strong> · {measurementsCount}+ voice measurements · Hindi and English · Works on any phone
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
