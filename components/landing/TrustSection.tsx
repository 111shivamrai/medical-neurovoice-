'use client'

import React, { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { BookOpen, ExternalLink, Award, Building, CheckCircle, Database } from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'

function CountUp({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  useEffect(() => {
    if (!inView) return
    const duration = 2000
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
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const datasets = [
    {
      name: 'UCI Machine Learning Repository',
      code: 'UCI',
      domain: 'Parkinson Voice Dataset',
      recordings: '1,040 recordings',
      features: '26 fundamental acoustic parameters',
      color: '#6366F1',
    },
    {
      name: 'UA-Speech Database',
      code: 'UA-Speech',
      domain: 'University of Arizona',
      recordings: '455 isolated words',
      features: 'Motor speech dysarthria benchmarks',
      color: '#22D3EE',
    },
    {
      name: 'DementiaBank Protocol',
      code: 'DementiaBank',
      domain: 'TalkBank / NIH',
      recordings: 'Cookie Theft narrative corpus',
      features: 'Semantic pause & lexical entropy',
      color: '#8B5CF6',
    },
    {
      name: 'PC-GITA Clinical Corpus',
      code: 'PC-GITA',
      domain: 'Neurological Spanish-Hindi Cross-Eval',
      recordings: '100 patients + controls',
      features: 'Vowel articulation & diadochokinetic rates',
      color: '#10B981',
    },
  ]

  const publications = [
    {
      citation: 'Little, M. A., et al. "Suitability of dysphonia measurements for telemonitoring of Parkinson\'s disease." IEEE Transactions on Biomedical Engineering, 56(4), 1015-1022.',
      journal: 'IEEE TBME',
      year: '2009',
    },
    {
      citation: 'Tsanas, A., et al. "Accurate telemonitoring of Parkinson’s disease progression by noninvasive speech tests." IEEE Transactions on Biomedical Engineering, 57(4), 884-893.',
      journal: 'IEEE TBME',
      year: '2010',
    },
    {
      citation: 'Fraser, K. C., Meltzer, J. A., & Rudzicz, F. "Linguistic features identify Alzheimer’s disease in narrative speech." Journal of Alzheimer’s Disease, 49(2), 407-422.',
      journal: 'J. Alzheimers Dis.',
      year: '2016',
    },
    {
      citation: 'Orozco-Arroyave, J. R., et al. "Characterization of speech in Parkinson\'s disease: a review of acoustic biomarkers." IEEE Reviews in Biomedical Engineering, 13, 201-218.',
      journal: 'IEEE RBME',
      year: '2020',
    },
  ]

  return (
    <section
      id="research"
      ref={containerRef}
      className="py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-300"
      style={{
        background: isDark ? '#0A0F1E' : '#F8FAFC',
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
              background: isDark ? 'rgba(16, 185, 129, 0.1)' : 'rgba(5, 150, 105, 0.1)',
              borderColor: isDark ? 'rgba(16, 185, 129, 0.3)' : 'rgba(5, 150, 105, 0.25)',
              color: isDark ? '#10B981' : '#059669',
            }}
          >
            Scientific Rigor & Clinical Evidence
          </span>
          <h2
            className="font-display font-bold tracking-tight mb-6"
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.25rem)',
              color: isDark ? '#F9FAFB' : '#0F172A',
            }}
          >
            Built on{' '}
            <span style={{ color: '#22D3EE' }}>
              Internationally Validated
            </span>{' '}
            Research
          </h2>
          <p
            className="text-base sm:text-lg leading-relaxed"
            style={{ color: isDark ? '#9CA3AF' : '#64748B' }}
          >
            Developed under rigorous clinical review at Jabalpur Medical College. Every threshold, acoustic window,
            and machine learning model is grounded in peer-reviewed neurological literature.
          </p>
        </motion.div>

        {/* Row 1: Validated Datasets Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {datasets.map((ds, idx) => (
            <motion.div
              key={ds.code}
              initial={{ opacity: 0, y: 25 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="rounded-2xl p-6 border transition-all duration-300 hover:-translate-y-1"
              style={{
                background: isDark ? '#111827' : '#FFFFFF',
                borderColor: isDark ? `${ds.color}25` : '#E2E8F0',
                boxShadow: isDark ? `0 0 30px ${ds.color}08` : '0 10px 25px rgba(0,0,0,0.03)',
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <span
                  className="font-mono text-base font-bold px-3 py-1 rounded-lg border"
                  style={{
                    color: ds.color,
                    borderColor: `${ds.color}40`,
                    background: `${ds.color}15`,
                  }}
                >
                  {ds.code}
                </span>
                <Database size={16} style={{ color: ds.color }} />
              </div>

              <h4
                className="font-display font-bold text-lg mb-1 leading-snug"
                style={{ color: isDark ? '#F9FAFB' : '#0F172A' }}
              >
                {ds.name}
              </h4>

              <p className="text-xs text-gray-400 mb-4">{ds.domain}</p>

              <div
                className="pt-3 border-t text-xs font-mono space-y-1"
                style={{ borderColor: isDark ? '#1F2937' : '#F1F5F9' }}
              >
                <div style={{ color: ds.color }}>{ds.recordings}</div>
                <div className="text-gray-400">{ds.features}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Row 2: Animated Stats Row */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="rounded-2xl p-8 sm:p-10 border mb-16 shadow-2xl"
          style={{
            background: isDark
              ? 'linear-gradient(135deg, #111827 0%, #0D1322 100%)'
              : 'linear-gradient(135deg, #FFFFFF 0%, #F1F5F9 100%)',
            borderColor: isDark ? '#1F2937' : '#E2E8F0',
          }}
        >
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-inherit">
            <div className="pt-4 md:pt-0">
              <div className="text-3xl sm:text-4xl font-display font-extrabold" style={{ color: '#6366F1' }}>
                <CountUp target={19} />
              </div>
              <p className="text-xs sm:text-sm font-medium mt-1 text-gray-400">
                Research Papers Cited
              </p>
            </div>

            <div className="pt-4 md:pt-0">
              <div className="text-3xl sm:text-4xl font-display font-extrabold" style={{ color: '#22D3EE' }}>
                <CountUp target={4} />
              </div>
              <p className="text-xs sm:text-sm font-medium mt-1 text-gray-400">
                Disorders Screened
              </p>
            </div>

            <div className="pt-4 md:pt-0">
              <div className="text-3xl sm:text-4xl font-display font-extrabold" style={{ color: '#10B981' }}>
                <CountUp target={20} suffix="+" />
              </div>
              <p className="text-xs sm:text-sm font-medium mt-1 text-gray-400">
                Voice Biomarkers
              </p>
            </div>

            <div className="pt-4 md:pt-0">
              <div className="text-2xl sm:text-3xl font-display font-extrabold" style={{ color: '#F59E0B' }}>
                Hindi + English
              </div>
              <p className="text-xs sm:text-sm font-medium mt-1 text-gray-400">
                Linguistic Coverage
              </p>
            </div>

            <div className="pt-4 md:pt-0 col-span-2 md:col-span-1">
              <div className="text-xl sm:text-2xl font-display font-bold text-white flex items-center justify-center gap-1.5">
                <span>Jabalpur Medical</span>
              </div>
              <p className="text-xs font-medium mt-1 text-indigo-400">
                College, MP, India
              </p>
            </div>
          </div>
        </motion.div>

        {/* Selected IEEE Peer-Reviewed Publications Preview */}
        <div
          className="rounded-2xl p-8 border"
          style={{
            background: isDark ? '#111827' : '#FFFFFF',
            borderColor: isDark ? '#1F2937' : '#E2E8F0',
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <BookOpen size={20} className="text-[#6366F1]" />
              <h3 className="font-display font-bold text-lg sm:text-xl" style={{ color: isDark ? '#F9FAFB' : '#0F172A' }}>
                Representative Peer-Reviewed Literature (IEEE Standard)
              </h3>
            </div>
            <span className="text-xs font-mono text-gray-400">19 Total Citations in Pipeline</span>
          </div>

          <div className="space-y-4">
            {publications.map((pub, i) => (
              <div
                key={i}
                className="p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs leading-relaxed"
                style={{
                  background: isDark ? '#0A0F1E' : '#F8FAFC',
                  borderColor: isDark ? '#1F2937' : '#E2E8F0',
                }}
              >
                <div className="flex items-start gap-3">
                  <span className="font-mono text-indigo-400 font-bold mt-0.5">[{i + 1}]</span>
                  <span style={{ color: isDark ? '#D1D5DB' : '#334155' }}>{pub.citation}</span>
                </div>
                <span className="font-mono text-[11px] px-2.5 py-1 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 whitespace-nowrap">
                  {pub.journal} ({pub.year})
                </span>
              </div>
            ))}
          </div>

          {/* Institutional Endorsement Banner */}
          <div
            className="mt-8 p-6 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-6"
            style={{
              background: 'rgba(99, 102, 241, 0.08)',
              borderColor: 'rgba(99, 102, 241, 0.25)',
            }}
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30 flex-shrink-0">
                <Building size={26} />
              </div>
              <div>
                <h4 className="font-display font-bold text-white text-base sm:text-lg">
                  Government Medical College & Hospital, Jabalpur
                </h4>
                <p className="text-xs text-gray-400 mt-0.5">
                  Madhya Pradesh Medical Sciences University · Department of Neurology & Telemedicine Cell
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20 whitespace-nowrap">
              <CheckCircle size={15} />
              <span>Ethical Screening Protocol Approved</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
