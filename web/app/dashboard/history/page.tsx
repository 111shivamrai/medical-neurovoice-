'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Clock,
  Calendar,
  FileDown,
  ChevronDown,
  ChevronUp,
  Activity,
  ArrowRight,
  GitCompare,
  TrendingDown,
  CheckCircle2,
} from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'

export default function PatientHistoryPage() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const [dateA, setDateA] = useState('28 Oct 2026')
  const [dateB, setDateB] = useState('14 Sep 2026')
  const [expandedCard, setExpandedCard] = useState<string | null>('sess-1')

  const sessions = [
    {
      id: 'sess-1',
      date: '28 Oct 2026',
      uhid: 'JMC-2026-8812',
      riskTier: 'Low Risk',
      color: '#10B981',
      pd: 12,
      ad: 18,
      dysarthria: 9,
      postStroke: 8,
      flags: ['No overt tremors', 'Optimal vocal stability'],
      details: 'Patient completed 30s Hindi test. Micro-jitter was 0.38% (well within normal limits < 1.04%). Shimmer was 1.82%.',
    },
    {
      id: 'sess-2',
      date: '14 Oct 2026',
      uhid: 'JMC-2026-8740',
      riskTier: 'Low Risk',
      color: '#10B981',
      pd: 15,
      ad: 20,
      dysarthria: 11,
      postStroke: 10,
      flags: ['Mild conversational pause'],
      details: 'Slight hesitation during phoneme transition. Language retrievability remains consistent with age cohort.',
    },
    {
      id: 'sess-3',
      date: '28 Sep 2026',
      uhid: 'JMC-2026-8621',
      riskTier: 'Low Risk',
      color: '#10B981',
      pd: 17,
      ad: 21,
      dysarthria: 13,
      postStroke: 10,
      flags: ['Trace vocal fatigue'],
      details: 'Evaluated post-therapy session. Good glottal closure and preserved speech envelope.',
    },
    {
      id: 'sess-4',
      date: '14 Sep 2026',
      uhid: 'JMC-2026-8490',
      riskTier: 'Moderate Risk',
      color: '#F59E0B',
      pd: 26,
      ad: 28,
      dysarthria: 19,
      postStroke: 15,
      flags: ['Subclinical micro-jitter detected', 'Mild vocal tremor'],
      details: 'Pre-treatment baseline. Patient had slight hand rigidity; vocal perturbation matched early subclinical tremor pattern.',
    },
  ]

  // Comparative biomarkers for Feature 13 (Date A vs Date B)
  const comparisonBiomarkers = [
    { name: 'Vocal Micro-Jitter (%)', valA: '0.38% (Normal)', valB: '0.94% (Elevated)', improved: true },
    { name: 'Shimmer APQ-5 (%)', valA: '1.82% (Normal)', valB: '3.45% (Borderline)', improved: true },
    { name: 'Harmonic-to-Noise (HNR)', valA: '24.1 dB', valB: '19.8 dB', improved: true },
    { name: 'Pitch Period Entropy', valA: '0.19 (Stable)', valB: '0.34 (Fluctuating)', improved: true },
    { name: 'Linguistic Pause Ratio', valA: '0.19', valB: '0.29', improved: true },
  ]

  const downloadPDF = (id: string) => {
    window.open(`http://localhost:8000/api/reports/${id}/pdf`, '_blank')
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#1F2937]">
        <div>
          <span className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-widest block mb-1">
            FEATURE 8 & 13 · CLINICAL TIMELINE & COMPARISON
          </span>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
            Patient Screening History
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Longitudinal records and before/after therapy comparison for Rameshwar Patel
          </p>
        </div>

        <Link
          href="/dashboard/scan"
          className="py-2.5 px-5 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-bold transition-all shadow-[0_0_20px_rgba(99,102,241,0.4)]"
        >
          + Record New Session
        </Link>
      </div>

      {/* TOP OF PAGE: TREND COMPARISON TOOL (FEATURE 13) */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-[#111827] to-[#111827] border border-indigo-500/30 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-[#6366F1] flex items-center justify-center border border-indigo-500/30">
              <GitCompare size={20} />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white">
                Before / After Treatment Comparison (Feature 13)
              </h3>
              <p className="text-xs text-gray-400">
                Compare voice biomarkers across any two clinical milestone sessions
              </p>
            </div>
          </div>

          {/* Date Selector Pickers */}
          <div className="flex items-center gap-3 text-xs font-mono">
            <div>
              <span className="text-gray-400 block text-[10px] mb-1">Session A (Recent)</span>
              <select
                value={dateA}
                onChange={(e) => setDateA(e.target.value)}
                className="bg-[#0A0F1E] border border-[#1F2937] text-cyan-300 rounded-lg px-3 py-1.5 outline-none font-bold"
              >
                <option value="28 Oct 2026">28 Oct 2026 (Recent)</option>
                <option value="14 Oct 2026">14 Oct 2026</option>
                <option value="28 Sep 2026">28 Sep 2026</option>
              </select>
            </div>

            <span className="text-gray-500 mt-4">vs</span>

            <div>
              <span className="text-gray-400 block text-[10px] mb-1">Session B (Baseline)</span>
              <select
                value={dateB}
                onChange={(e) => setDateB(e.target.value)}
                className="bg-[#0A0F1E] border border-[#1F2937] text-amber-300 rounded-lg px-3 py-1.5 outline-none font-bold"
              >
                <option value="14 Sep 2026">14 Sep 2026 (Pre-Therapy)</option>
                <option value="28 Sep 2026">28 Sep 2026</option>
              </select>
            </div>
          </div>
        </div>

        {/* Side-by-Side Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#1F2937] text-gray-400">
                <th className="py-2.5 px-3">Biomarker Parameter</th>
                <th className="py-2.5 px-3 text-cyan-400">Session A: {dateA}</th>
                <th className="py-2.5 px-3 text-amber-400">Session B: {dateB}</th>
                <th className="py-2.5 px-3 text-right">Clinical Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F2937]">
              {comparisonBiomarkers.map((b) => (
                <tr key={b.name} className="hover:bg-white/5">
                  <td className="py-3 px-3 font-medium text-white">{b.name}</td>
                  <td className="py-3 px-3 text-cyan-300 font-bold">{b.valA}</td>
                  <td className="py-3 px-3 text-amber-300 font-bold">{b.valB}</td>
                  <td className="py-3 px-3 text-right">
                    <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-bold">
                      <TrendingDown size={12} />
                      <span>Improved Therapy Response</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* VERTICAL TIMELINE OF SESSIONS */}
      <div className="space-y-6">
        <h3 className="font-display font-bold text-xl text-white">Historical Session Timeline</h3>

        <div className="relative pl-6 sm:pl-8 border-l-2 border-[#1F2937] space-y-8">
          {sessions.map((sess) => {
            const isExpanded = expandedCard === sess.id

            return (
              <div key={sess.id} className="relative group">
                {/* Timeline node */}
                <span
                  className="w-4 h-4 rounded-full border-2 border-[#0A0F1E] absolute -left-[31px] sm:-left-[39px] top-5"
                  style={{ background: sess.color }}
                />

                {/* Session Card */}
                <div
                  className="rounded-2xl p-6 bg-[#111827] border border-[#1F2937] transition-all hover:border-gray-600 shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-white">{sess.date}</span>
                      <span className="text-xs font-mono text-gray-500">UHID #{sess.uhid}</span>
                      <span
                        className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full"
                        style={{ color: sess.color, background: `${sess.color}15` }}
                      >
                        {sess.riskTier}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => downloadPDF(sess.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0A0F1E] border border-[#1F2937] text-gray-300 hover:text-white text-xs font-mono"
                      >
                        <FileDown size={13} />
                        <span>PDF Report</span>
                      </button>

                      <button
                        onClick={() => setExpandedCard(isExpanded ? null : sess.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-white"
                      >
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* 4 Mini Progress Bars */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-3 border-t border-b border-[#1F2937] text-xs font-mono">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-400">Parkinson's</span>
                        <span className="text-white font-bold">{sess.pd}%</span>
                      </div>
                      <div className="w-full bg-[#0A0F1E] h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#6366F1] h-full" style={{ width: `${sess.pd}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-400">Alzheimer's</span>
                        <span className="text-white font-bold">{sess.ad}%</span>
                      </div>
                      <div className="w-full bg-[#0A0F1E] h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#8B5CF6] h-full" style={{ width: `${sess.ad}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-400">Dysarthria</span>
                        <span className="text-white font-bold">{sess.dysarthria}%</span>
                      </div>
                      <div className="w-full bg-[#0A0F1E] h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#22D3EE] h-full" style={{ width: `${sess.dysarthria}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-400">Post-Stroke</span>
                        <span className="text-white font-bold">{sess.postStroke}%</span>
                      </div>
                      <div className="w-full bg-[#0A0F1E] h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#14B8A6] h-full" style={{ width: `${sess.postStroke}%` }} />
                      </div>
                    </div>
                  </div>

                  {/* Expanded Report Details */}
                  {isExpanded && (
                    <div className="pt-4 mt-2 space-y-2 text-xs">
                      <p className="text-gray-300 leading-relaxed">{sess.details}</p>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {sess.flags.map((f) => (
                          <span
                            key={f}
                            className="px-2.5 py-1 rounded bg-[#0A0F1E] text-gray-400 font-mono border border-[#1F2937]"
                          >
                            ✓ {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
