'use client'

import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useTheme } from '@/components/ThemeProvider'
import { ArrowUpRight, Zap, BrainCircuit, Waves, GitCompare } from 'lucide-react'

export function DisordersSection() {
  const containerRef = useRef<HTMLElement>(null)
  const isInView = useInView(containerRef, { once: false, margin: '-100px' })
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const disorders = [
    {
      id: 'parkinsons',
      title: "Parkinson's Disease",
      subtitle: 'Early Vocal Motor Degradation',
      accent: '#6366F1', // Indigo
      accentBg: 'rgba(99, 102, 241, 0.12)',
      borderAccent: 'rgba(99, 102, 241, 0.35)',
      description:
        "Vocal tremor, pitch instability and breathiness appear in Parkinson's patients years before motor symptoms are clinically obvious. NeuroVoice catches these acoustic micro-deviations early when neuroprotective therapies have their highest efficacy.",
      biomarkers: 'Jitter · Shimmer · F0 · RPDE · PPE',
      statLabel: 'Clinical Sensitivity',
      statValue: '91.4%',
      badge: 'Early Subclinical Detection',
      icon: (
        /* Tremor Waveform SVG */
        <svg viewBox="0 0 32 32" className="w-8 h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M3 16H8L10 9L13 23L16 11L18 20L20 13L22 18L24 16H29"
            stroke="#6366F1"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10 9L13 23L16 11"
            stroke="#A5B4FC"
            strokeWidth="1.2"
            strokeDasharray="2 2"
          />
        </svg>
      ),
    },
    {
      id: 'alzheimers',
      title: "Alzheimer's Disease",
      subtitle: 'Semantic & Syntax Decay Tracking',
      accent: '#8B5CF6', // Purple
      accentBg: 'rgba(139, 92, 246, 0.12)',
      borderAccent: 'rgba(139, 92, 246, 0.35)',
      description:
        'Cognitive decline shows up in how we speak — slower word retrieval, shorter sentences, reduced vocabulary, and unusual pause patterns between nouns. Language tells us what memory tests cannot capture in a standard 10-minute clinical visit.',
      biomarkers: 'Speech Rate · Pause Structure · Lexical Diversity',
      statLabel: 'Semantic Correlation',
      statValue: '88.7%',
      badge: 'DementiaBank Validated',
      icon: (
        /* Brain with missing synaptic connections */
        <svg viewBox="0 0 32 32" className="w-8 h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="12" stroke="#8B5CF6" strokeWidth="2" strokeDasharray="5 3" />
          <circle cx="12" cy="13" r="2.5" fill="#8B5CF6" />
          <circle cx="20" cy="13" r="2.5" fill="#8B5CF6" />
          <circle cx="16" cy="21" r="2.5" fill="#C4B5FD" />
          <line x1="12" y1="13" x2="16" y2="21" stroke="#8B5CF6" strokeWidth="1.5" />
          <line x1="20" y1="13" x2="16" y2="21" stroke="#8B5CF6" strokeWidth="1.5" strokeDasharray="2 2" opacity="0.4" />
        </svg>
      ),
    },
    {
      id: 'dysarthria',
      title: 'Dysarthria',
      subtitle: 'Neuromuscular Speech Articulation',
      accent: '#22D3EE', // Cyan
      accentBg: 'rgba(34, 211, 238, 0.12)',
      borderAccent: 'rgba(34, 211, 238, 0.35)',
      description:
        'Motor speech impairment from stroke, cerebral palsy or neurological damage alters articulation precision and timing in measurable ways. We quantify phonetic duration, acoustic envelope flatness, and formant transition speed with millisecond precision.',
      biomarkers: 'Articulation · Rhythm · Energy',
      statLabel: 'Classification F1',
      statValue: '93.2%',
      badge: 'UA-Speech Benchmark',
      icon: (
        /* Soundwave with articulatory breaks */
        <svg viewBox="0 0 32 32" className="w-8 h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="12" width="3" height="8" rx="1.5" fill="#22D3EE" />
          <rect x="8" y="7" width="3" height="18" rx="1.5" fill="#22D3EE" />
          <rect x="13" y="14" width="3" height="4" rx="1.5" fill="#67E8F9" opacity="0.4" />
          <rect x="18" y="6" width="3" height="20" rx="1.5" fill="#22D3EE" />
          <rect x="23" y="15" width="3" height="2" rx="1" fill="#67E8F9" opacity="0.4" />
          <rect x="26" y="9" width="3" height="14" rx="1.5" fill="#22D3EE" />
        </svg>
      ),
    },
    {
      id: 'post-stroke',
      title: 'Post-Stroke Cognitive Impairment',
      subtitle: 'Longitudinal Neuro-Recovery Tracking',
      accent: '#14B8A6', // Teal
      accentBg: 'rgba(20, 184, 166, 0.12)',
      borderAccent: 'rgba(20, 184, 166, 0.35)',
      description:
        '30–40% of stroke survivors develop cognitive impairment. Monthly voice monitoring tracks whether recovery is progressing or declining — without requiring hospital visits or specialized neuropsychological equipment in rural districts.',
      biomarkers: 'Longitudinal Speech Change',
      statLabel: 'Trajectory Accuracy',
      statValue: '89.6%',
      badge: 'Remote Telemedicine',
      icon: (
        /* Brain with repair & neural plasticity lines */
        <svg viewBox="0 0 32 32" className="w-8 h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M8 18C8 12.477 11.582 8 16 8C20.418 8 24 12.477 24 18C24 22 21 25 16 25C11 25 8 22 8 18Z"
            stroke="#14B8A6"
            strokeWidth="2"
          />
          <path d="M12 16L16 20L21 13" stroke="#2DD4BF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M16 4V8M16 25V28" stroke="#14B8A6" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
        </svg>
      ),
    },
  ]

  return (
    <section
      id="disorders"
      ref={containerRef}
      className="py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-300"
      style={{
        background: isDark ? '#080D1A' : '#FFFFFF',
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span
            className="inline-block px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-4 border"
            style={{
              background: isDark ? 'rgba(99, 102, 241, 0.1)' : 'rgba(79, 70, 229, 0.1)',
              borderColor: isDark ? 'rgba(99, 102, 241, 0.3)' : 'rgba(79, 70, 229, 0.25)',
              color: isDark ? '#A5B4FC' : '#4F46E5',
            }}
          >
            Multi-Condition Diagnostic Scope
          </span>
          <h2
            className="font-display font-bold tracking-tight mb-6"
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.25rem)',
              color: isDark ? '#F9FAFB' : '#0F172A',
            }}
          >
            One Recording.{' '}
            <span
              style={{
                color: '#6366F1',
              }}
            >
              Four Conditions.
            </span>
            <br />
            Simultaneous Analysis.
          </h2>
          <p
            className="text-base sm:text-lg leading-relaxed"
            style={{ color: isDark ? '#9CA3AF' : '#64748B' }}
          >
            A single patient recording passes simultaneously through specialized acoustic biomarker filters,
            providing independent risk probabilities and feature explanations for each condition.
          </p>
        </motion.div>

        {/* 2x2 Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {disorders.map((disorder, idx) => (
            <motion.div
              key={disorder.id}
              initial={{ opacity: 0, y: 35 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="group relative rounded-2xl p-8 sm:p-10 border transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between"
              style={{
                background: isDark ? '#111827' : '#F8FAFC',
                borderColor: isDark ? disorder.borderAccent : '#E2E8F0',
                boxShadow: isDark
                  ? `0 0 40px ${disorder.accent}12`
                  : '0 10px 30px rgba(0,0,0,0.05)',
              }}
            >
              {/* Top Accent Light bar */}
              <div
                className="absolute top-0 left-8 right-8 h-0.5 rounded-full opacity-70 group-hover:opacity-100 transition-opacity"
                style={{
                  background: `linear-gradient(to right, transparent, ${disorder.accent}, transparent)`,
                }}
              />

              <div>
                {/* Header row inside card */}
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center p-3 border transition-transform duration-300 group-hover:scale-110"
                    style={{
                      background: disorder.accentBg,
                      borderColor: disorder.borderAccent,
                    }}
                  >
                    {disorder.icon}
                  </div>
                  <span
                    className="text-xs font-semibold px-3 py-1.5 rounded-full border font-mono"
                    style={{
                      color: disorder.accent,
                      borderColor: disorder.borderAccent,
                      background: disorder.accentBg,
                    }}
                  >
                    {disorder.badge}
                  </span>
                </div>

                <div className="mb-4">
                  <h3
                    className="font-display font-bold text-2xl sm:text-3xl mb-1.5"
                    style={{ color: isDark ? '#F9FAFB' : '#0F172A' }}
                  >
                    {disorder.title}
                  </h3>
                  <p className="text-xs font-mono font-medium tracking-wide" style={{ color: disorder.accent }}>
                    {disorder.subtitle}
                  </p>
                </div>

                <p
                  className="text-sm sm:text-base leading-relaxed mb-8"
                  style={{ color: isDark ? '#9CA3AF' : '#64748B' }}
                >
                  {disorder.description}
                </p>
              </div>

              {/* Bottom Biomarker Bar & Stat */}
              <div
                className="pt-6 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                style={{ borderColor: isDark ? '#1F2937' : '#E2E8F0' }}
              >
                <div>
                  <span className="text-xs text-gray-400 font-medium block mb-1">
                    Key voice indicators
                  </span>
                  <p className="text-xs sm:text-sm font-semibold" style={{ color: disorder.accent }}>
                    {disorder.biomarkers}
                  </p>
                </div>

                <div className="flex items-center gap-2 sm:text-right">
                  <div>
                    <span className="text-xs text-gray-400 font-medium block">
                      {disorder.statLabel}
                    </span>
                    <span className="font-display font-bold text-lg text-emerald-400">
                      {disorder.statValue}
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-white group-hover:bg-white/10 transition-colors">
                    <ArrowUpRight size={16} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
