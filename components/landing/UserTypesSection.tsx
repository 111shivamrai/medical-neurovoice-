'use client'

import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { Stethoscope, HeartPulse, GraduationCap, ArrowRight, Check } from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'

export function UserTypesSection() {
  const containerRef = useRef<HTMLElement>(null)
  const isInView = useInView(containerRef, { once: false, margin: '-100px' })
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const personas = [
    {
      id: 'doctor',
      role: 'Neurologists & Doctors',
      icon: Stethoscope,
      accent: '#6366F1',
      badge: 'Tertiary Care & Hospital OPD',
      description:
        'Screen patients faster. Attach voice biomarker reports to patient files. Monitor treatment response over time.',
      extendedBio:
        'Ideal for Jabalpur Medical College neurology OPD and district civil hospitals. Track levodopa response or speech therapy progression through objective pitch stability and jitter metrics.',
      benefits: [
        '30-second automated screening pre-consultation',
        'Direct PDF attachments to EMR / Hospital MIS',
        'Objective therapy tracking (F0, Shimmer, HNR)',
        'Differential diagnostic feature rankings',
      ],
      ctaText: 'Doctor Login →',
      ctaHref: '/signin',
    },
    {
      id: 'asha',
      role: 'ASHA Workers (Rural)',
      icon: HeartPulse,
      accent: '#22D3EE',
      badge: 'Primary Health Centers & Villages',
      description:
        'One button. One Hindi sentence. Three colours: Green, Yellow, Red. No medical knowledge required.',
      extendedBio:
        'Engineered for community health workers across Madhya Pradesh villages. Simple voice prompts in regional Hindi dialect identify high-risk elderly villagers requiring doctor follow-up.',
      benefits: [
        'Single tap to record Hindi sentence prompt',
        'Instant triage indicator: Green, Yellow, or Red',
        'Offline audio caching for zero-network areas',
        'Automated SMS referral dispatch to district hospital',
      ],
      ctaText: 'Try Simple Mode →',
      ctaHref: '/signup',
    },
    {
      id: 'researcher',
      role: 'Medical Students & Researchers',
      icon: GraduationCap,
      accent: '#10B981',
      badge: 'Academic Research & Clinical Trials',
      description:
        "Access anonymised screening data for research. Download reports. Contribute to India's first Hindi-language neurological voice dataset.",
      extendedBio:
        'Empowering medical postgraduates and AI researchers at Jabalpur Medical College with anonymized acoustic matrices, Mel-spectrogram archives, and SHAP explainability weights.',
      benefits: [
        'Anonymized clinical voice dataset downloads',
        'Pre-extracted 20+ feature CSV exports',
        'Comparative research benchmarks (UCI & UA-Speech)',
        'Publication citation support for PG theses',
      ],
      ctaText: 'Research Access →',
      ctaHref: '/signup',
    },
  ]

  return (
    <section
      id="personas"
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
            Universal Healthcare Utility
          </span>
          <h2
            className="font-display font-bold tracking-tight mb-6"
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.25rem)',
              color: isDark ? '#F9FAFB' : '#0F172A',
            }}
          >
            Who Uses{' '}
            <span style={{ color: '#22D3EE' }}>
              NeuroVoice
            </span>
          </h2>
          <p
            className="text-base sm:text-lg leading-relaxed"
            style={{ color: isDark ? '#9CA3AF' : '#64748B' }}
          >
            A cohesive platform bridging urban clinical neurology specialists and grassroots community health
            workers across Madhya Pradesh with adaptive interfaces for every skill level.
          </p>
        </motion.div>

        {/* 3 Personas Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {personas.map((persona, idx) => {
            const Icon = persona.icon
            return (
              <motion.div
                key={persona.id}
                initial={{ opacity: 0, y: 35 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="rounded-2xl p-8 sm:p-9 border flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 group"
                style={{
                  background: isDark ? '#111827' : '#F8FAFC',
                  borderColor: isDark ? `${persona.accent}25` : '#E2E8F0',
                  boxShadow: isDark
                    ? `0 0 35px ${persona.accent}08`
                    : '0 10px 30px rgba(0,0,0,0.05)',
                }}
              >
                <div>
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center border transition-transform duration-300 group-hover:scale-110"
                      style={{
                        background: `${persona.accent}15`,
                        borderColor: `${persona.accent}30`,
                        color: persona.accent,
                      }}
                    >
                      <Icon size={26} />
                    </div>
                    <span
                      className="text-xs font-mono font-medium px-3 py-1 rounded-full border"
                      style={{
                        color: persona.accent,
                        borderColor: `${persona.accent}40`,
                        background: `${persona.accent}10`,
                      }}
                    >
                      {persona.badge}
                    </span>
                  </div>

                  <h3
                    className="font-display font-bold text-2xl mb-3"
                    style={{ color: isDark ? '#F9FAFB' : '#0F172A' }}
                  >
                    {persona.role}
                  </h3>

                  <p
                    className="text-base font-medium mb-3"
                    style={{ color: persona.accent }}
                  >
                    "{persona.description}"
                  </p>

                  <p
                    className="text-sm leading-relaxed mb-6"
                    style={{ color: isDark ? '#9CA3AF' : '#64748B' }}
                  >
                    {persona.extendedBio}
                  </p>

                  {/* Bullet points */}
                  <div className="space-y-2.5 mb-8">
                    {persona.benefits.map((b) => (
                      <div key={b} className="flex items-start gap-2.5 text-xs sm:text-sm">
                        <Check size={16} className="flex-shrink-0 mt-0.5" style={{ color: persona.accent }} />
                        <span style={{ color: isDark ? '#E5E7EB' : '#334155' }}>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card CTA */}
                <Link
                  href={persona.ctaHref}
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-display font-semibold text-sm transition-all duration-300 hover:scale-[1.02] active:scale-95 border"
                  style={{
                    background: `${persona.accent}15`,
                    borderColor: `${persona.accent}40`,
                    color: persona.accent,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = persona.accent
                    e.currentTarget.style.color = '#FFFFFF'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = `${persona.accent}15`
                    e.currentTarget.style.color = persona.accent
                  }}
                >
                  <span>{persona.ctaText}</span>
                  <ArrowRight size={15} />
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
