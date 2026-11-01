'use client'

import React from 'react'
import { Shield, Database, Lock, Eye, CheckCircle2, AlertCircle } from 'lucide-react'
import { BRAND } from '@/lib/brand'

export function TrustSection() {
  const pillars = [
    {
      title: 'Screening, Not Diagnosis',
      badge: 'Ethical Boundary',
      icon: Shield,
      description:
        'NeuroVoice provides an objective acoustic risk indicator to help you and your clinician decide if formal evaluation is warranted. It never replaces a comprehensive neurological examination.',
    },
    {
      title: 'Tested on Unseen Individuals',
      badge: 'Strict Cross-Validation',
      icon: CheckCircle2,
      description:
        'Our algorithms are benchmarked using subject-independent cross-validation. Acoustic patterns must generalize across individuals who were never present in baseline reference datasets.',
    },
    {
      title: 'Every Result Explained',
      badge: 'Zero Black Boxes',
      icon: Eye,
      description:
        'We believe mysterious single-number scores erode patient and clinician trust. We explain every condition indicator with plain-language bars and verified acoustic measurements.',
    },
    {
      title: 'Raw Audio Deleted Immediately',
      badge: 'Privacy By Design',
      icon: Lock,
      description:
        'Your voice recording is discarded immediately after acoustic feature extraction. Only anonymous numerical measurements are retained in your encrypted report.',
    },
  ]

  const datasets = [
    {
      name: 'UCI Machine Learning Repository',
      code: 'UCI-PD',
      domain: 'Parkinson Speech Dataset',
      recordings: '1,040 recordings',
      citation: 'Little et al., IEEE TBME (2007)',
      details: 'Sustained phonation vowel samples for non-linear dynamic dysphonia research.',
    },
    {
      name: 'UA-Speech Database',
      code: 'UA-Speech',
      domain: 'University of Arizona',
      recordings: '455 phonetic tokens',
      citation: 'Kim et al., Interspeech (2008)',
      details: 'Acoustic dysarthria benchmarks tracking vowel space area and formant shifts.',
    },
    {
      name: 'PC-GITA Spanish & Cross-Lingual Corpus',
      code: 'PC-GITA',
      domain: 'Antioquia & Erlangen Repositories',
      recordings: '800 sustained phonations',
      citation: 'Orozco-Arroyave et al., IEEE JSTSP (2016)',
      details: 'Standardized acoustic baselines evaluated across international phonetic protocols.',
    },
  ]

  return (
    <section id="trust" className="py-20 px-4 sm:px-6 lg:px-8 bg-[var(--surface)] border-b border-[var(--border)] transition-colors duration-200">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-mono font-semibold tracking-wider uppercase text-[var(--accent)]">
            Scientific Rigor & Ethics
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-[var(--text)] tracking-tight">
            How We Keep Results Honest
          </h2>
          <p className="text-sm sm:text-base text-[var(--muted)] leading-relaxed">
            Medical technology must be held to the highest standards of scientific honesty. We do not overpromise, we do not obscure, and we never compromise on privacy.
          </p>
        </div>

        {/* 4 Pillars of Honesty */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {pillars.map((p) => {
            const Icon = p.icon
            return (
              <div
                key={p.title}
                className="p-6 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] shadow-[var(--shadow-sm)] flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-[var(--surface)] border border-[var(--border)] text-[var(--accent)]">
                      {p.badge}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--primary)] shadow-sm">
                      <Icon size={18} />
                    </div>
                  </div>
                  <h3 className="text-lg font-display font-bold text-[var(--text)]">
                    {p.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
                    {p.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Integrated Benchmarking Datasets */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] shadow-[var(--shadow-sm)] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border)] pb-4">
            <div>
              <h3 className="text-lg font-display font-bold text-[var(--text)]">
                Integrated Reference Datasets & Benchmarks
              </h3>
              <p className="text-xs text-[var(--muted)]">
                Algorithms are validated exclusively against recognized public clinical acoustic corpora.
              </p>
            </div>
            <span className="text-xs font-mono font-semibold text-[var(--accent)]">
              Verified Public Repositories
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {datasets.map((d) => (
              <div
                key={d.code}
                className="p-5 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-[var(--primary)]">
                      {d.code}
                    </span>
                    <Database size={15} className="text-[var(--muted)]" />
                  </div>
                  <h4 className="font-bold text-xs text-[var(--text)] mb-0.5">
                    {d.name}
                  </h4>
                  <div className="text-[11px] text-[var(--muted)]">{d.domain}</div>
                </div>

                <div className="pt-2 border-t border-[var(--border)] space-y-1">
                  <div className="text-xs font-mono text-[var(--accent)] font-semibold">
                    {d.recordings}
                  </div>
                  <div className="text-[11px] text-[var(--muted)] leading-relaxed italic">
                    {d.citation}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Clinical Scope Notice */}
        <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] flex items-start gap-3.5 text-xs text-[var(--muted)] leading-relaxed">
          <AlertCircle size={20} className="text-[var(--warning)] shrink-0 mt-0.5" />
          <div>
            <strong className="text-[var(--text)]">Scientific Notice: </strong>
            {BRAND.screeningDisclaimer}
          </div>
        </div>
      </div>
    </section>
  )
}
