'use client'

import React from 'react'
import Link from 'next/link'
import { Shield, Database, ExternalLink, Check, X, ShieldCheck } from 'lucide-react'
import { BRAND } from '@/lib/brand'

export function TrustSection() {
  const datasets = [
    {
      heading: "UCI Parkinson's Voice Dataset",
      sub: 'Oxford University & UCI Machine Learning Repository',
      description:
        "Recordings from 31 individuals (23 with Parkinson's, 8 healthy) performing steady vowel sounds. Used to establish baseline thresholds for vocal tremor (jitter), amplitude stability (shimmer), and harmonic clarity.",
      badge: '195 voice recordings · Sustained vowels',
      linkText: 'View dataset details →',
      url: 'https://archive.ics.uci.edu/dataset/174/parkinsons',
    },
    {
      heading: 'UA-Speech Database',
      sub: 'University of Arizona',
      description:
        'Speech recordings from individuals with dysarthria of varying severity levels, plus age-matched healthy controls. Used to calibrate our consonant precision and vowel space measurements.',
      badge: '15 speakers · Word & sentence tasks',
      linkText: 'View database details →',
      url: 'https://www.isle.illinois.edu/sst/data/UASpeech/',
    },
    {
      heading: 'PC-GITA Corpus',
      sub: 'University of Antioquia & University of Erlangen-Nuremberg',
      description:
        'Bilingual recordings (Spanish and regional phonetic patterns) from 100 participants. Used to test how acoustic biomarkers perform across different languages and speaking styles.',
      badge: '100 participants · Read text & monologue',
      linkText: 'View corpus details →',
      url: 'https://www.nature.com/articles/sdata2018288',
    },
  ]

  return (
    <section id="trust" className="py-20 px-4 sm:px-6 lg:px-8 bg-[var(--surface)] border-b border-[var(--border)] transition-colors duration-200">
      <div className="max-w-6xl mx-auto space-y-14">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-mono font-semibold tracking-wider uppercase text-[var(--accent)]">
            Clinical Research Foundation
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-[var(--text)] tracking-tight">
            Where our reference data comes from
          </h2>
          <p className="text-sm sm:text-base text-[var(--muted)] leading-relaxed">
            We compare your voice against recordings from these publicly available research databases. None of your data is sent to these institutions.
          </p>
        </div>

        {/* 3 Reference Dataset Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {datasets.map((d) => (
            <div
              key={d.heading}
              className="p-6 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] shadow-[var(--shadow-sm)] flex flex-col justify-between space-y-4 hover:border-[var(--muted)] transition-all"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-[var(--surface)] border border-[var(--border)] text-[var(--accent)]">
                    {d.badge}
                  </span>
                  <Database size={15} className="text-[var(--muted)]" />
                </div>

                <div>
                  <h3 className="text-base font-display font-bold text-[var(--text)]">
                    {d.heading}
                  </h3>
                  <div className="text-xs text-[var(--muted)] font-medium">
                    {d.sub}
                  </div>
                </div>

                <p className="text-xs text-[var(--muted)] leading-relaxed pt-1">
                  {d.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[var(--border)]">
                <a
                  href={d.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--primary)] hover:underline"
                >
                  <span>{d.linkText}</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Scientific Notice: Calm Clinical Blue Card */}
        <div className="rounded-2xl border border-[#93C5FD] dark:border-blue-900 bg-[#F0F7FF] dark:bg-blue-950/20 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-[var(--primary)] flex items-center justify-center shrink-0">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3 className="text-lg font-display font-bold text-[#0B1B33] dark:text-blue-100">
                What NeuroVoice can and cannot do
              </h3>
              <p className="text-xs text-[var(--muted)] dark:text-blue-200/80">
                Clear boundaries between acoustic screening indicators and clinical diagnostic examinations.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Left Column: What it can do */}
            <div className="p-5 rounded-xl bg-white/80 dark:bg-slate-900/60 border border-blue-200 dark:border-blue-900/60 space-y-3">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                What it can do
              </h4>
              <ul className="space-y-2.5 text-xs text-[#0B1B33] dark:text-slate-200">
                <li className="flex items-start gap-2">
                  <Check size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>Detect subtle voice changes not obvious to the ear</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>Track voice health over time across weeks and months</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>Give your doctor objective acoustic data to review</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>Work in your home without special equipment</span>
                </li>
              </ul>
            </div>

            {/* Right Column: What it cannot do */}
            <div className="p-5 rounded-xl bg-white/80 dark:bg-slate-900/60 border border-blue-200 dark:border-blue-900/60 space-y-3">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">
                What it cannot do
              </h4>
              <ul className="space-y-2.5 text-xs text-[#0B1B33] dark:text-slate-200">
                <li className="flex items-start gap-2">
                  <X size={16} className="text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                  <span>Cannot diagnose any condition on its own</span>
                </li>
                <li className="flex items-start gap-2">
                  <X size={16} className="text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                  <span>Cannot replace a neurologist&apos;s clinical examination</span>
                </li>
                <li className="flex items-start gap-2">
                  <X size={16} className="text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                  <span>Cannot determine disease stage or progression without clinical history</span>
                </li>
                <li className="flex items-start gap-2">
                  <X size={16} className="text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                  <span>Cannot evaluate non-voice symptoms (motor, memory, imaging)</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-2 text-center text-xs text-[var(--muted)] dark:text-blue-200/90 font-medium">
            Always share your results with a licensed doctor. NeuroVoice is an objective screening support tool, not a diagnostic device.
          </div>
        </div>
      </div>
    </section>
  )
}
