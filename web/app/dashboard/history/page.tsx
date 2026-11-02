'use client'

import React, { useState, useEffect } from 'react'
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
  AlertCircle,
  FileText,
  Filter,
} from 'lucide-react'
import { downloadScreeningPdf } from '@/lib/downloadPdf'
import { getLocalUser } from '@/lib/auth'

interface ScreeningSession {
  id: string
  date: string
  screeningId: string
  overallBand: string
  badgeColor: string
  pdBand: string
  adBand: string
  dysarthriaBand: string
  postStrokeBand: string
  snrDb: number
  duration: number
  flags: string[]
  details: string
}

export default function ReportsHistoryPage() {
  const [activeTab, setActiveTab] = useState<'reports' | 'timeline' | 'compare'>('reports')
  const [expandedCard, setExpandedCard] = useState<string | null>('scr-01')

  const sessions: ScreeningSession[] = [
    {
      id: 'scr-01',
      date: '28 Oct 2026',
      screeningId: 'NV-2026-8812',
      overallBand: 'Low — no concern detected',
      badgeColor: 'text-[var(--success)] bg-[var(--success)]/10 border-[var(--success)]/30',
      pdBand: 'Low — no concern detected',
      adBand: 'Low — no concern detected',
      dysarthriaBand: 'Low — no concern detected',
      postStrokeBand: 'Low — no concern detected',
      snrDb: 26.4,
      duration: 31.2,
      flags: ['Optimal signal-to-noise ratio', 'Normal vocal fold stability'],
      details: 'Patient completed Hindi vowel & reading tasks. Micro-jitter was 0.38% (well within typical limits < 1.04%). Shimmer was 1.82%.',
    },
    {
      id: 'scr-02',
      date: '14 Oct 2026',
      screeningId: 'NV-2026-8740',
      overallBand: 'Low — no concern detected',
      badgeColor: 'text-[var(--success)] bg-[var(--success)]/10 border-[var(--success)]/30',
      pdBand: 'Low — no concern detected',
      adBand: 'Low — no concern detected',
      dysarthriaBand: 'Low — no concern detected',
      postStrokeBand: 'Low — no concern detected',
      snrDb: 22.8,
      duration: 30.5,
      flags: ['Mild conversational pause latency'],
      details: 'Slight hesitation during phoneme transitions. Language retrievability consistent with demographic reference cohort.',
    },
    {
      id: 'scr-03',
      date: '28 Sep 2026',
      screeningId: 'NV-2026-8621',
      overallBand: 'Low — no concern detected',
      badgeColor: 'text-[var(--success)] bg-[var(--success)]/10 border-[var(--success)]/30',
      pdBand: 'Low — no concern detected',
      adBand: 'Low — no concern detected',
      dysarthriaBand: 'Low — no concern detected',
      postStrokeBand: 'Low — no concern detected',
      snrDb: 24.1,
      duration: 29.8,
      flags: ['Trace vocal fatigue'],
      details: 'Evaluated post-vocal task. Preserved fundamental frequency stability and complete glottal closure.',
    },
    {
      id: 'scr-04',
      date: '14 Sep 2026',
      screeningId: 'NV-2026-8490',
      overallBand: 'Moderate — worth monitoring',
      badgeColor: 'text-[var(--warning)] bg-[var(--warning)]/10 border-[var(--warning)]/30',
      pdBand: 'Moderate — worth monitoring',
      adBand: 'Low — no concern detected',
      dysarthriaBand: 'Low — no concern detected',
      postStrokeBand: 'Low — no concern detected',
      snrDb: 21.5,
      duration: 32.0,
      flags: ['Subclinical micro-jitter detected', 'Mild amplitude fluctuation'],
      details: 'Baseline intake screening. Initial vocal perturbation showed slight micro-tremor in sustained vowel phonation.',
    },
  ]

  const [dateA, setDateA] = useState(sessions[0].id)
  const [dateB, setDateB] = useState(sessions[3].id)

  const sessionA = sessions.find((s) => s.id === dateA) || sessions[0]
  const sessionB = sessions.find((s) => s.id === dateB) || sessions[3]

  const comparisonBiomarkers = [
    { name: 'Vocal Micro-Jitter (%)', valA: '0.38% (Typical)', valB: '0.94% (Borderline)', improved: true },
    { name: 'Shimmer APQ-5 (%)', valA: '1.82% (Typical)', valB: '3.45% (Elevated)', improved: true },
    { name: 'Harmonics-to-Noise (HNR)', valA: '24.1 dB', valB: '19.8 dB', improved: true },
    { name: 'Pitch Period Entropy (PPE)', valA: '0.19 (Stable)', valB: '0.34 (Fluctuating)', improved: true },
    { name: 'Speech Pause Ratio', valA: '0.18', valB: '0.28', improved: true },
  ]

  const downloadPDF = async (id: string) => {
    const localUser = getLocalUser()
    await downloadScreeningPdf(id, localUser?.displayName || 'Participant')
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border)]">
        <div>
          <span className="text-xs font-mono font-semibold text-[var(--accent)] uppercase tracking-wider block mb-1">
            Vocal Screening History & Records
          </span>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[var(--text)]">
            My Screening Records
          </h1>
          <p className="text-xs text-[var(--muted)] mt-1">
            Review past voice screenings, track longitudinal acoustic changes, and compare before/after therapy sessions.
          </p>
        </div>

        <Link
          href="/dashboard/scan"
          className="btn-primary text-xs font-semibold py-2.5 px-5 rounded-xl shadow-sm flex items-center gap-1.5"
        >
          <Activity size={15} />
          <span>New Voice Screening</span>
        </Link>
      </div>

      {/* 3 Unified Tabs: Reports | Timeline | Compare */}
      <div className="flex items-center gap-2 border-b border-[var(--border)] pb-px">
        <button
          onClick={() => setActiveTab('reports')}
          className={`flex items-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-t-xl transition-all border-b-2 ${
            activeTab === 'reports'
              ? 'border-[var(--primary)] text-[var(--primary)] bg-[var(--surface)]'
              : 'border-transparent text-[var(--muted)] hover:text-[var(--text)]'
          }`}
        >
          <FileText size={15} />
          <span>Reports ({sessions.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('timeline')}
          className={`flex items-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-t-xl transition-all border-b-2 ${
            activeTab === 'timeline'
              ? 'border-[var(--primary)] text-[var(--primary)] bg-[var(--surface)]'
              : 'border-transparent text-[var(--muted)] hover:text-[var(--text)]'
          }`}
        >
          <Calendar size={15} />
          <span>Timeline View</span>
        </button>
        <button
          onClick={() => setActiveTab('compare')}
          className={`flex items-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-t-xl transition-all border-b-2 ${
            activeTab === 'compare'
              ? 'border-[var(--primary)] text-[var(--primary)] bg-[var(--surface)]'
              : 'border-transparent text-[var(--muted)] hover:text-[var(--text)]'
          }`}
        >
          <GitCompare size={15} />
          <span>Compare Sessions</span>
        </button>
      </div>

      {/* TAB 1: REPORTS */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          {sessions.map((sess) => (
            <div
              key={sess.id}
              className="p-5 sm:p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] hover:border-[var(--primary)] transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-[var(--primary)] flex items-center justify-center">
                    <FileText size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-display font-bold text-sm text-[var(--text)]">{sess.date}</span>
                      <span className="font-mono text-xs text-[var(--muted)]">({sess.screeningId})</span>
                    </div>
                    <div className="text-xs text-[var(--muted)] mt-0.5">
                      Duration: {sess.duration}s · Quality (SNR): {sess.snrDb} dB
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${sess.badgeColor}`}>
                    {sess.overallBand}
                  </span>

                  <button
                    onClick={() => downloadPDF(sess.id)}
                    className="btn-ghost text-xs py-1.5 px-3 rounded-lg flex items-center gap-1.5"
                    title="Download 5-page clinical PDF report"
                  >
                    <FileDown size={14} />
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>

              {/* Conditions summary grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-[var(--border)] text-xs">
                <div>
                  <span className="text-[var(--muted)] block text-[11px]">Parkinson's</span>
                  <span className="font-semibold text-[var(--text)]">{sess.pdBand.split('—')[0]}</span>
                </div>
                <div>
                  <span className="text-[var(--muted)] block text-[11px]">Alzheimer's</span>
                  <span className="font-semibold text-[var(--text)]">{sess.adBand.split('—')[0]}</span>
                </div>
                <div>
                  <span className="text-[var(--muted)] block text-[11px]">Dysarthria</span>
                  <span className="font-semibold text-[var(--text)]">{sess.dysarthriaBand.split('—')[0]}</span>
                </div>
                <div>
                  <span className="text-[var(--muted)] block text-[11px]">Post-Stroke</span>
                  <span className="font-semibold text-[var(--text)]">{sess.postStrokeBand.split('—')[0]}</span>
                </div>
              </div>

              <p className="text-xs text-[var(--muted)] leading-relaxed italic bg-[var(--surface-2)] p-3 rounded-xl border border-[var(--border)]">
                "{sess.details}"
              </p>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: TIMELINE VIEW */}
      {activeTab === 'timeline' && (
        <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2.5 sm:before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[var(--border)]">
          {sessions.map((sess) => (
            <div key={sess.id} className="relative space-y-2">
              {/* Timeline marker */}
              <div className="absolute -left-6 sm:-left-8 top-1.5 w-5 h-5 rounded-full bg-[var(--surface)] border-2 border-[var(--primary)] flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
              </div>

              <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-sm text-[var(--text)]">{sess.date}</span>
                    <span className="text-xs text-[var(--muted)] font-mono">ID: {sess.screeningId}</span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${sess.badgeColor}`}>
                    {sess.overallBand}
                  </span>
                </div>

                <p className="text-xs text-[var(--muted)] leading-relaxed">{sess.details}</p>

                <div className="flex flex-wrap gap-1.5">
                  {sess.flags.map((flag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md text-[11px] bg-[var(--surface-2)] text-[var(--muted)] border border-[var(--border)]"
                    >
                      {flag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: COMPARE SESSIONS */}
      {activeTab === 'compare' && (
        <div className="p-6 sm:p-8 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--surface-2)] text-[var(--primary)] flex items-center justify-center border border-[var(--border)]">
                <GitCompare size={20} />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-[var(--text)]">
                  Longitudinal Voice Biomarker Comparison
                </h3>
                <p className="text-xs text-[var(--muted)]">
                  Select any two screening sessions to evaluate treatment or rehabilitation progress.
                </p>
              </div>
            </div>

            {/* Pickers */}
            <div className="flex items-center gap-3 text-xs font-mono">
              <div>
                <span className="text-[var(--muted)] block text-[10px] mb-1">Session A (Recent)</span>
                <select
                  value={dateA}
                  onChange={(e) => setDateA(e.target.value)}
                  className="bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] rounded-lg px-3 py-1.5 outline-none font-semibold text-xs"
                >
                  {sessions.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.date} ({s.screeningId})
                    </option>
                  ))}
                </select>
              </div>

              <span className="text-[var(--muted)] mt-4">vs</span>

              <div>
                <span className="text-[var(--muted)] block text-[10px] mb-1">Session B (Earlier Baseline)</span>
                <select
                  value={dateB}
                  onChange={(e) => setDateB(e.target.value)}
                  className="bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] rounded-lg px-3 py-1.5 outline-none font-semibold text-xs"
                >
                  {sessions.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.date} ({s.screeningId})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Side-by-side Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[var(--border)] text-[var(--muted)]">
                  <th className="py-2.5 px-3">Acoustic Biomarker</th>
                  <th className="py-2.5 px-3 text-[var(--primary)]">Session A ({sessionA.date})</th>
                  <th className="py-2.5 px-3 text-[var(--accent)]">Session B ({sessionB.date})</th>
                  <th className="py-2.5 px-3 text-right">Progress Direction</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {comparisonBiomarkers.map((b) => (
                  <tr key={b.name} className="hover:bg-[var(--surface-2)] transition-colors">
                    <td className="py-3 px-3 font-medium text-[var(--text)]">{b.name}</td>
                    <td className="py-3 px-3 text-[var(--primary)] font-bold">{b.valA}</td>
                    <td className="py-3 px-3 text-[var(--accent)] font-bold">{b.valB}</td>
                    <td className="py-3 px-3 text-right">
                      <span className="inline-flex items-center gap-1 text-[var(--success)] bg-[var(--success)]/10 px-2 py-0.5 rounded font-semibold text-[11px]">
                        <TrendingDown size={12} />
                        <span>Favorable Response</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
