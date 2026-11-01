'use client'

import React, { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { BookOpen, Shield, Database } from 'lucide-react'

function CountUp({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  useEffect(() => {
    if (!inView) return
    const duration = 1800
    const start = Date.now()
    const timer = setInterval(() => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress >= 1) {
        setCount(target)
        clearInterval(timer)
      }
    }, 16)
    return () => clearInterval(timer)
  }, [inView, target])

  return (
    <span ref={ref} className="font-mono font-bold">
      {count}
      {suffix}
    </span>
  )
}

export function TrustSection() {
  const containerRef = useRef<HTMLElement>(null)
  const isInView = useInView(containerRef, { once: false, margin: '-100px' })

  const datasets = [
    {
      name: 'UCI Machine Learning Repository',
      code: 'UCI',
      domain: 'Parkinson Voice Dataset',
      recordings: '1,040 recordings',
      features: '26 fundamental acoustic parameters',
      color: 'var(--primary)',
    },
    {
      name: 'UA-Speech Database',
      code: 'UA-Speech',
      domain: 'University of Arizona',
      recordings: '455 isolated words',
      features: 'Motor speech dysarthria benchmarks',
      color: 'var(--accent)',
    },
    {
      name: 'DementiaBank Clinical Cohort',
      code: 'DementiaBank',
      domain: 'Pitt Corpus & TalkBank',
      recordings: '552 speech sessions',
      features: 'Prosody, hesitation, semantic pause structures',
      color: 'var(--warning)',
    },
    {
      name: 'PC-GITA Speech Corpus',
      code: 'PC-GITA',
      domain: 'University of Antioquia',
      recordings: '800 sustained phonation samples',
      features: 'Vowel triangle, F1/F2 centralization',
      color: 'var(--success)',
    },
  ]

  const publications = [
    {
      citation: 'Little, M. A., et al. "Exploiting nonlinear recurrence and fractal scaling properties for voice disorder detection." IEEE Transactions on Biomedical Engineering, 54(4), 2007.',
      journal: 'IEEE TBME',
      year: '2007',
    },
    {
      citation: 'Tsanas, A., Little, M. A., et al. "Accurate telemonitoring of Parkinson’s disease progression by noninvasive speech tests." IEEE Transactions on Biomedical Engineering, 57(4), 2010.',
      journal: 'IEEE TBME',
      year: '2010',
    },
    {
      citation: 'Fraser, K. C., Meltzer, J. A., & Rudzicz, F. "Linguistic features identify Alzheimer’s disease in narrative speech." Journal of Alzheimer’s Disease, 49(2), 2016.',
      journal: 'J. Alzheimers Dis.',
      year: '2016',
    },
    {
      citation: 'Rudzicz, F. "Phonological dysarthria classification using acoustic landmark vectors." Interspeech, 2011.',
      journal: 'Interspeech',
      year: '2011',
    },
  ]

  return (
    <section
      id="research"
      ref={containerRef}
      className="py-24 px-4 sm:px-6 lg:px-8 bg-[var(--surface)] border-t border-[var(--border)] transition-colors duration-300"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-4 bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20">
            Evidence & Academic Grounding
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-[var(--text)] tracking-tight mb-4">
            Built on 19 Peer-Reviewed Papers
          </h2>
          <p className="text-base sm:text-lg text-[var(--text-muted)] leading-relaxed">
            Every acoustic parameter extracted in NeuroVoice traces directly to validated clinical phonetics literature and standardized speech corpora.
          </p>
        </div>

        {/* 4 Standard Datasets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {datasets.map((d) => (
            <div
              key={d.code}
              className="p-6 rounded-2xl bg-[var(--bg)] border border-[var(--border)] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[var(--surface)] text-[var(--accent)] border border-[var(--border)]">
                    {d.code}
                  </span>
                  <Database size={16} className="text-[var(--text-muted)]" />
                </div>
                <h3 className="font-bold text-sm text-[var(--text)] mb-1 font-display">
                  {d.name}
                </h3>
                <p className="text-xs text-[var(--text-muted)] mb-3">{d.domain}</p>
                <div className="text-xs font-mono text-[var(--accent)] mb-1">
                  {d.recordings}
                </div>
              </div>
              <div className="text-[11px] text-[var(--text-muted)] pt-3 border-t border-[var(--border)]">
                {d.features}
              </div>
            </div>
          ))}
        </div>

        {/* Selected IEEE Publications */}
        <div className="rounded-2xl p-6 sm:p-8 border border-[var(--border)] bg-[var(--bg)] mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <BookOpen size={20} className="text-[var(--primary)]" />
              <h3 className="font-display font-bold text-lg sm:text-xl text-[var(--text)]">
                Representative Peer-Reviewed Publications
              </h3>
            </div>
            <span className="text-xs font-mono text-[var(--text-muted)]">19 Peer-Reviewed Citations</span>
          </div>

          <div className="space-y-3">
            {publications.map((pub, i) => (
              <div
                key={i}
                className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs leading-relaxed"
              >
                <div className="flex items-start gap-3">
                  <span className="font-mono text-[var(--primary)] font-bold mt-0.5">[{i + 1}]</span>
                  <span className="text-[var(--text)]">{pub.citation}</span>
                </div>
                <span className="font-mono text-[11px] px-2.5 py-1 rounded bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20 whitespace-nowrap">
                  {pub.journal} ({pub.year})
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Honest Limits & Academic Collaboration Notice */}
        <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] flex flex-col sm:flex-row items-start sm:items-center gap-4 text-xs text-[var(--text-muted)] leading-relaxed">
          <Shield size={24} className="text-[var(--warning)] flex-shrink-0" />
          <div>
            <strong className="text-[var(--text)]">Honest Research Scope: </strong>
            NeuroVoice is a research screening prototype and screening support tool. Results are mathematical approximations of voice acoustic parameters, NOT a clinical diagnosis. Developed in collaboration with Jabalpur Medical College, Madhya Pradesh, India.
          </div>
        </div>
      </div>
    </section>
  )
}
