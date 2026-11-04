'use client'

import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { Stethoscope, HeartPulse, GraduationCap, Check } from 'lucide-react'

export function UserTypesSection() {
  const containerRef = useRef<HTMLElement>(null)
  const isInView = useInView(containerRef, { once: false, margin: '-100px' })

  const personas = [
    {
      id: 'doctor',
      role: 'Neurologists & Clinicians',
      icon: Stethoscope,
      accent: 'var(--primary)',
      badge: 'Hospital OPD & Specialty Clinics',
      description:
        'Rapid pre-consultation acoustic screening. Attach objective voice biomarker reports to patient records and track longitudinal treatment response.',
      benefits: [
        '30-second automated acoustic screening',
        'Downloadable 5-page PDF report',
        'Objective therapy tracking (F0, Shimmer, HNR)',
        'Differential SHAP biomarker rankings',
      ],
      ctaText: 'Clinician Portal →',
      ctaHref: '/signin',
    },
    {
      id: 'personal',
      role: 'Individuals & Families',
      icon: HeartPulse,
      accent: 'var(--accent)',
      badge: 'Personal Health Awareness',
      description:
        'A 30-second non-invasive voice screening you can do from home. Plain-language insights and guidance on when to consult a specialist.',
      benefits: [
        'Single tap to record voice prompt',
        'Clear action: Low, Moderate, or Elevated',
        'Dual-layer plain English and Hindi explanations',
        'Direct connection to certified neurologists',
      ],
      ctaText: 'Start Screening →',
      ctaHref: '/signup',
    },
    {
      id: 'researcher',
      role: 'Academic Researchers & Students',
      icon: GraduationCap,
      accent: 'var(--success)',
      badge: 'Clinical Trials & Vocal Phonetics',
      description:
        'Access 20+ acoustic feature vectors, non-linear dynamical metrics (RPDE, PPE), and open benchmark comparisons for speech science research.',
      benefits: [
        'Extract 20+ standard acoustic biomarkers',
        'SHAP feature contribution analysis',
        'Bilingual phonetic prompt evaluation',
        'Anonymized research data exports',
      ],
      ctaText: 'Explore Research Tools →',
      ctaHref: '/signup',
    },
  ]

  return (
    <section
      id="personas"
      ref={containerRef}
      className="py-24 px-4 sm:px-6 lg:px-8 bg-[var(--bg)] transition-colors duration-300"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-4 bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20">
            Tailored Experiences
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-[var(--text)] tracking-tight mb-4">
            Who Uses NeuroVoice
          </h2>
          <p className="text-base sm:text-lg text-[var(--text-muted)] leading-relaxed">
            From individual health screenings at home to tertiary care neurologists in hospital OPDs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {personas.map((p, idx) => {
            const Icon = p.icon
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="p-8 rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--primary)] flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[var(--surface-2)] text-[var(--text-muted)]">
                      {p.badge}
                    </span>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[var(--surface-2)]" style={{ color: p.accent }}>
                      <Icon size={20} />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold font-display text-[var(--text)] mb-3">
                    {p.role}
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-6">
                    {p.description}
                  </p>

                  <ul className="space-y-2 mb-8 text-xs text-[var(--text)]">
                    {p.benefits.map((b) => (
                      <li key={b} className="flex items-start gap-2">
                        <Check size={14} className="text-[var(--success)] flex-shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={p.ctaHref}
                  className="w-full text-center py-3 rounded-xl text-xs font-semibold bg-[var(--surface-2)] text-[var(--text)] border border-[var(--border)] hover:border-[var(--accent)] transition-all"
                >
                  {p.ctaText}
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
