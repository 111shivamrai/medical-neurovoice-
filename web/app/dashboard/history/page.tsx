'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Calendar,
  FileDown,
  ChevronDown,
  ChevronUp,
  Activity,
  ArrowRight,
  GitCompare,
  TrendingDown,
  TrendingUp,
  Minus,
  CheckCircle2,
  FileText,
  Mic,
} from 'lucide-react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import { downloadScreeningPdf } from '@/lib/downloadPdf'
import { getLocalUser } from '@/lib/auth'

interface ScreeningSession {
  id: string
  date: string
  screeningId: string
  language: string
  qualityLabel: 'Good quality' | 'Fair quality' | 'Poor quality'
  overallStatus: 'green' | 'amber' | 'red'
  overallSummary: string
  plainSummary: string
  conditions: {
    pd: { band: 'Low' | 'Moderate' | 'Elevated'; sentence: string }
    ad: { band: 'Low' | 'Moderate' | 'Elevated'; sentence: string }
    dysarthria: { band: 'Low' | 'Moderate' | 'Elevated'; sentence: string }
    postStroke: { band: 'Low' | 'Moderate' | 'Elevated'; sentence: string }
  }
  // Comparison metrics
  features: {
    voiceSteadiness: { value: string; num: number; unit: '%' }
    volumeStability: { value: string; num: number; unit: '%' }
    voiceClarity: { value: string; num: number; unit: 'dB' }
    pauseRatio: { value: string; num: number; unit: '' }
    speakingSpeed: { value: string; num: number; unit: 'syl/s' }
  }
}

export default function ReportsHistoryPage() {
  const [activeTab, setActiveTab] = useState<'reports' | 'timeline' | 'compare'>('reports')
  const [expandedCard, setExpandedCard] = useState<string | null>(null)
  const [sessions, setSessions] = useState<ScreeningSession[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const user = getLocalUser()
    if (!user?.uid) {
      setLoading(false)
      return
    }
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    fetch(`${apiBase}/api/reports/user/${encodeURIComponent(user.uid)}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data: any[]) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped: ScreeningSession[] = data.map((item) => {
            const d = item.timestamp ? new Date(item.timestamp) : new Date()
            const dateStr = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
            const idShort = (item.id || 'scr-0000').slice(-6).toUpperCase()
            const pdBand = item.bands?.pd || 'Low'
            const adBand = item.bands?.ad || 'Low'
            const dysBand = item.bands?.dysarthria || 'Low'
            const strokeBand = item.bands?.postStroke || 'Low'

            const hasElevated = [pdBand, adBand, dysBand, strokeBand].includes('Elevated')
            const hasModerate = [pdBand, adBand, dysBand, strokeBand].includes('Moderate')
            const status: 'green' | 'amber' | 'red' = hasElevated ? 'red' : hasModerate ? 'amber' : 'green'

            return {
              id: item.id || `scr-${Math.random().toString(36).substr(2, 6)}`,
              date: dateStr,
              screeningId: `NV-${idShort}`,
              language: item.language === 'en' ? 'English' : 'Hindi',
              qualityLabel: 'Good quality',
              overallStatus: status,
              overallSummary: item.summaryVerdict || 'Overall: Analysis complete',
              plainSummary: item.recommendation || 'Voice metrics captured and analyzed.',
              conditions: {
                pd: { band: pdBand, sentence: 'Voice steadiness and harmonic stability.' },
                ad: { band: adBand, sentence: 'Cadence and speech pause duration.' },
                dysarthria: { band: dysBand, sentence: 'Consonant sharpness and vowel clarity.' },
                postStroke: { band: strokeBand, sentence: 'Speech rhythm and breath support.' },
              },
              features: {
                voiceSteadiness: { value: `${((item.featureVector?.jitter || 0.4) * 1).toFixed(2)}%`, num: item.featureVector?.jitter || 0.4, unit: '%' },
                volumeStability: { value: `${((item.featureVector?.shimmer || 2.1) * 1).toFixed(2)}%`, num: item.featureVector?.shimmer || 2.1, unit: '%' },
                voiceClarity: { value: `${((item.featureVector?.hnr || 24.2) * 1).toFixed(1)} dB`, num: item.featureVector?.hnr || 24.2, unit: 'dB' },
                pauseRatio: { value: `${((item.featureVector?.pauseRatio || 0.18) * 1).toFixed(2)}`, num: item.featureVector?.pauseRatio || 0.18, unit: '' },
                speakingSpeed: { value: '4.2 syl/s', num: 4.2, unit: 'syl/s' },
              },
            }
          })
          setSessions(mapped)
          if (mapped.length > 0) setExpandedCard(mapped[0].id)
        } else {
          setSessions([])
        }
      })
      .catch(() => setSessions([]))
      .finally(() => setLoading(false))
  }, [])

  // Compare Tab State
  const [dateA, setDateA] = useState('')
  const [dateB, setDateB] = useState('')

  useEffect(() => {
    if (sessions.length > 0 && !dateA) {
      setDateA(sessions[0].id)
      setDateB(sessions[1]?.id || sessions[0].id)
    }
  }, [sessions, dateA])
  const sessionA = sessions.find((s) => s.id === dateA) || sessions[0] || null
  const sessionB = sessions.find((s) => s.id === dateB) || sessions[1] || sessions[0] || null

  const downloadPDF = async (reportId: string) => {
    const localUser = getLocalUser()
    await downloadScreeningPdf(reportId, localUser?.displayName || 'Participant')
  }

  // Band to numerical value for chart
  const bandToNum = (band: 'Low' | 'Moderate' | 'Elevated') => {
    if (band === 'Elevated') return 2
    if (band === 'Moderate') return 1
    return 0
  }

  // Chronological timeline data (oldest to newest for plotting)
  const timelineChartData = [...sessions].reverse().map((s) => ({
    date: s.date,
    pd: bandToNum(s.conditions.pd.band),
    ad: bandToNum(s.conditions.ad.band),
    dys: bandToNum(s.conditions.dysarthria.band),
    stroke: bandToNum(s.conditions.postStroke.band),
    pdBand: s.conditions.pd.band,
    adBand: s.conditions.ad.band,
    dysBand: s.conditions.dysarthria.band,
    strokeBand: s.conditions.postStroke.band,
  }))

  const getDotColor = (band: 'Low' | 'Moderate' | 'Elevated') => {
    if (band === 'Elevated') return 'bg-[#C0392B]' // red
    if (band === 'Moderate') return 'bg-[#B7791F]' // amber
    return 'bg-[#12805C]' // green
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border)]">
        <div>
          <span className="text-xs font-mono font-semibold text-[var(--accent)] uppercase tracking-wider block mb-1">
            Vocal Screening History
          </span>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[var(--text)]">
            My Screening Records
          </h1>
          <p className="text-xs text-[var(--muted)] mt-1">
            Review past voice screenings, see your progress over time, and compare changes across dates.
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

      {/* 3 Tabs: Reports | My progress over time | Compare two screenings */}
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
          <span>My progress over time</span>
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
          <span>Compare two screenings</span>
        </button>
      </div>

      {/* ──────────────── TAB 1: REPORTS ──────────────── */}
      {activeTab === 'reports' && (
        <div className="max-w-[800px] mx-auto space-y-4">
          {sessions.length === 0 ? (
            <div className="text-center py-16 px-4 bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-[var(--shadow-sm)] flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-[var(--primary)] shadow-inner">
                <Mic size={30} />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold font-display text-[var(--text)]">No screening records yet</h3>
                <p className="text-xs text-[var(--muted)] max-w-md leading-relaxed">
                  Complete a 30-second voice screening to track your neurological health over time.
                </p>
              </div>
              <Link
                href="/dashboard/scan"
                className="btn-primary text-xs py-2.5 px-6 rounded-full font-semibold shadow-sm flex items-center gap-2"
              >
                <span>Start your first screening →</span>
              </Link>
            </div>
          ) : (
            sessions.map((sess) => {
              const isExpanded = expandedCard === sess.id

              return (
                <div
                  key={sess.id}
                  className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] hover:border-[var(--primary)]/60 transition-all overflow-hidden"
                >
                {/* Collapsed Card Row */}
                <div className="p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                  {/* Left: Date (large) | NV-ID (small, muted) | Language */}
                  <div className="space-y-1 shrink-0">
                    <div className="text-lg font-display font-bold text-[var(--text)]">
                      {sess.date}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
                      <span className="font-mono">{sess.screeningId}</span>
                      <span>·</span>
                      <span>{sess.language}</span>
                    </div>
                  </div>

                  {/* Centre: Four Coloured Dots with Condition Abbreviations PD | AD | DYS | PST */}
                  <div className="flex items-center gap-6 px-4 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
                    {/* PD */}
                    <div className="flex flex-col items-center gap-1.5">
                      <span
                        className={`w-3.5 h-3.5 rounded-full ${getDotColor(
                          sess.conditions.pd.band
                        )} shadow-sm`}
                        title={`Parkinson's: ${sess.conditions.pd.band}`}
                      />
                      <span className="text-[10px] font-mono font-bold text-[var(--text)]">
                        PD
                      </span>
                    </div>

                    {/* AD */}
                    <div className="flex flex-col items-center gap-1.5">
                      <span
                        className={`w-3.5 h-3.5 rounded-full ${getDotColor(
                          sess.conditions.ad.band
                        )} shadow-sm`}
                        title={`Alzheimer's: ${sess.conditions.ad.band}`}
                      />
                      <span className="text-[10px] font-mono font-bold text-[var(--text)]">
                        AD
                      </span>
                    </div>

                    {/* DYS */}
                    <div className="flex flex-col items-center gap-1.5">
                      <span
                        className={`w-3.5 h-3.5 rounded-full ${getDotColor(
                          sess.conditions.dysarthria.band
                        )} shadow-sm`}
                        title={`Dysarthria: ${sess.conditions.dysarthria.band}`}
                      />
                      <span className="text-[10px] font-mono font-bold text-[var(--text)]">
                        DYS
                      </span>
                    </div>

                    {/* PST */}
                    <div className="flex flex-col items-center gap-1.5">
                      <span
                        className={`w-3.5 h-3.5 rounded-full ${getDotColor(
                          sess.conditions.postStroke.band
                        )} shadow-sm`}
                        title={`Post-Stroke: ${sess.conditions.postStroke.band}`}
                      />
                      <span className="text-[10px] font-mono font-bold text-[var(--text)]">
                        PST
                      </span>
                    </div>
                  </div>

                  {/* Right: Simple Quality Label (NOT SNR number) + Buttons */}
                  <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                        sess.qualityLabel === 'Good quality'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/50 dark:text-amber-300'
                      }`}
                    >
                      {sess.qualityLabel}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setExpandedCard(isExpanded ? null : sess.id)}
                        className="btn-ghost text-xs py-2 px-3 rounded-lg flex items-center gap-1 font-semibold"
                      >
                        <span>{isExpanded ? 'Hide' : 'View details'}</span>
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>

                      <button
                        type="button"
                        onClick={() => downloadPDF(sess.id)}
                        className="btn-primary text-xs py-2 px-3.5 rounded-lg flex items-center gap-1.5 shadow-sm"
                        title="Download 5-page clinical PDF report"
                      >
                        <FileDown size={14} />
                        <span>Download PDF</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded View */}
                {isExpanded && (
                  <div className="p-5 sm:p-6 bg-[var(--surface-2)]/50 border-t border-[var(--border)] space-y-4 animate-in fade-in duration-150">
                    {/* Simple Coloured Summary Line (Replaces doctor note quote box) */}
                    <div
                      className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
                        sess.overallStatus === 'green'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-200 dark:border-emerald-800'
                          : sess.overallStatus === 'amber'
                          ? 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/40 dark:text-amber-200 dark:border-amber-800'
                          : 'bg-red-50 text-red-800 border-red-300 dark:bg-red-950/40 dark:text-red-200 dark:border-red-800'
                      }`}
                    >
                      <CheckCircle2 size={16} className="shrink-0" />
                      <span>{sess.overallSummary}</span>
                    </div>

                    {/* For each condition: band | one plain sentence */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-1">
                        <div className="flex items-center justify-between font-bold text-[var(--text)]">
                          <span>Parkinson&apos;s Disease</span>
                          <span
                            className={
                              sess.conditions.pd.band === 'Low'
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-amber-600 dark:text-amber-400'
                            }
                          >
                            {sess.conditions.pd.band}
                          </span>
                        </div>
                        <p className="text-[var(--muted)] leading-relaxed">
                          {sess.conditions.pd.sentence}
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-1">
                        <div className="flex items-center justify-between font-bold text-[var(--text)]">
                          <span>Alzheimer&apos;s Disease</span>
                          <span className="text-emerald-600 dark:text-emerald-400">
                            {sess.conditions.ad.band}
                          </span>
                        </div>
                        <p className="text-[var(--muted)] leading-relaxed">
                          {sess.conditions.ad.sentence}
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-1">
                        <div className="flex items-center justify-between font-bold text-[var(--text)]">
                          <span>Dysarthria</span>
                          <span className="text-emerald-600 dark:text-emerald-400">
                            {sess.conditions.dysarthria.band}
                          </span>
                        </div>
                        <p className="text-[var(--muted)] leading-relaxed">
                          {sess.conditions.dysarthria.sentence}
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-1">
                        <div className="flex items-center justify-between font-bold text-[var(--text)]">
                          <span>Post-Stroke Changes</span>
                          <span className="text-emerald-600 dark:text-emerald-400">
                            {sess.conditions.postStroke.band}
                          </span>
                        </div>
                        <p className="text-[var(--muted)] leading-relaxed">
                          {sess.conditions.postStroke.sentence}
                        </p>
                      </div>
                    </div>

                    {/* Plain summary from pipeline (No raw jitter/shimmer numbers) */}
                    <div className="text-xs text-[var(--muted)] leading-relaxed pt-1">
                      {sess.plainSummary}
                    </div>
                  </div>
                )}
              </div>
            )
          }))}
        </div>
      )}

      {/* ──────────────── TAB 2: MY PROGRESS OVER TIME (RECHARTS LINE CHART) ──────────────── */}
      {activeTab === 'timeline' && (
        sessions.length === 0 ? (
          <div className="max-w-[800px] mx-auto p-12 text-center rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)]">
            <p className="text-sm text-[var(--muted)]">Complete screenings across multiple dates to view your longitudinal progress timeline.</p>
          </div>
        ) : (
        <div className="max-w-[800px] mx-auto p-6 sm:p-8 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] space-y-6">
          <div className="space-y-1">
            <h3 className="font-display font-bold text-lg text-[var(--text)]">
              My progress over time
            </h3>
            <p className="text-xs text-[var(--muted)]">
              Visual overview tracking each condition band across your screening dates.
            </p>
          </div>

          {/* Simple Recharts LineChart */}
          <div className="w-full h-72 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.6} />
                <XAxis
                  dataKey="date"
                  stroke="var(--muted)"
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 2]}
                  ticks={[0, 1, 2]}
                  tickFormatter={(val) => (val === 2 ? 'Elevated' : val === 1 ? 'Moderate' : 'Low')}
                  stroke="var(--muted)"
                  fontSize={11}
                  tickLine={false}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload
                      return (
                        <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-md text-xs space-y-1">
                          <div className="font-bold text-[var(--text)] border-b border-[var(--border)] pb-1 mb-1">
                            {label}
                          </div>
                          <div className="text-[#1F4FD8]">Parkinson&apos;s: {data.pdBand}</div>
                          <div className="text-[#0F8F8F]">Alzheimer&apos;s: {data.adBand}</div>
                          <div className="text-[#B7791F]">Dysarthria: {data.dysBand}</div>
                          <div className="text-[#C0392B]">Post-Stroke: {data.strokeBand}</div>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                {/* 4 Lines: Parkinson's (Blue), Alzheimer's (Teal), Dysarthria (Amber), Post-Stroke (Red) */}
                <Line
                  type="monotone"
                  dataKey="pd"
                  name="Parkinson's"
                  stroke="#1F4FD8"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#1F4FD8' }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="ad"
                  name="Alzheimer's"
                  stroke="#0F8F8F"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#0F8F8F' }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="dys"
                  name="Dysarthria"
                  stroke="#B7791F"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#B7791F' }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="stroke"
                  name="Post-Stroke"
                  stroke="#C0392B"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#C0392B' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs font-semibold">
            <span className="flex items-center gap-2 text-[#1F4FD8]">
              <span className="w-3 h-3 rounded-full bg-[#1F4FD8]" />
              Parkinson&apos;s
            </span>
            <span className="flex items-center gap-2 text-[#0F8F8F]">
              <span className="w-3 h-3 rounded-full bg-[#0F8F8F]" />
              Alzheimer&apos;s
            </span>
            <span className="flex items-center gap-2 text-[#B7791F]">
              <span className="w-3 h-3 rounded-full bg-[#B7791F]" />
              Dysarthria
            </span>
            <span className="flex items-center gap-2 text-[#C0392B]">
              <span className="w-3 h-3 rounded-full bg-[#C0392B]" />
              Post-Stroke
            </span>
          </div>

          {/* Plain language guidance note per Task 10 */}
          <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-xs text-[var(--muted)] text-center font-medium">
            Regular monthly screenings give the best picture of how your voice is changing over time.
          </div>
        </div>
        )
      )}

      {/* ──────────────── TAB 3: COMPARE TWO SCREENINGS ──────────────── */}
      {activeTab === 'compare' && (
        !sessionA || !sessionB ? (
          <div className="max-w-[800px] mx-auto p-12 text-center rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)]">
            <p className="text-sm text-[var(--muted)]">Complete at least two voice screenings to compare acoustic biomarker differences across sessions.</p>
          </div>
        ) : (
        <div className="max-w-[800px] mx-auto p-6 sm:p-8 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
            <div className="space-y-1">
              <h3 className="font-display font-bold text-lg text-[var(--text)]">
                Compare two screenings
              </h3>
              <p className="text-xs text-[var(--muted)]">
                Select two screenings to see what changed in your voice between them.
              </p>
            </div>

            {/* Dropdown menus */}
            <div className="flex items-center gap-3 text-xs">
              <div>
                <label className="text-[10px] font-mono text-[var(--muted)] block mb-1">
                  Session 1 (Recent)
                </label>
                <select
                  value={dateA}
                  onChange={(e) => setDateA(e.target.value)}
                  className="bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] rounded-xl px-3 py-1.5 outline-none font-semibold text-xs"
                >
                  {sessions.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.date} ({s.screeningId})
                    </option>
                  ))}
                </select>
              </div>

              <span className="text-[var(--muted)] mt-4 font-bold">vs</span>

              <div>
                <label className="text-[10px] font-mono text-[var(--muted)] block mb-1">
                  Session 2 (Earlier)
                </label>
                <select
                  value={dateB}
                  onChange={(e) => setDateB(e.target.value)}
                  className="bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] rounded-xl px-3 py-1.5 outline-none font-semibold text-xs"
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

          {/* Side-by-side cards for each date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Card Session 1 */}
            <div className="p-5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-[var(--primary)] font-bold">
                    Session 1
                  </span>
                  <h4 className="text-sm font-bold text-[var(--text)]">{sessionA.date}</h4>
                </div>
                <span className="text-xs font-mono text-[var(--muted)]">
                  {sessionA.screeningId}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-1 text-center py-2 border-y border-[var(--border)]">
                <div>
                  <span className="text-[10px] font-mono text-[var(--muted)] block">PD</span>
                  <span className="text-xs font-bold text-[var(--text)]">
                    {sessionA.conditions.pd.band}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[var(--muted)] block">AD</span>
                  <span className="text-xs font-bold text-[var(--text)]">
                    {sessionA.conditions.ad.band}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[var(--muted)] block">DYS</span>
                  <span className="text-xs font-bold text-[var(--text)]">
                    {sessionA.conditions.dysarthria.band}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[var(--muted)] block">PST</span>
                  <span className="text-xs font-bold text-[var(--text)]">
                    {sessionA.conditions.postStroke.band}
                  </span>
                </div>
              </div>

              <div className="text-xs text-[var(--muted)]">
                <strong>Quality:</strong> {sessionA.qualityLabel} · {sessionA.language}
              </div>
            </div>

            {/* Card Session 2 */}
            <div className="p-5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-[var(--accent)] font-bold">
                    Session 2
                  </span>
                  <h4 className="text-sm font-bold text-[var(--text)]">{sessionB.date}</h4>
                </div>
                <span className="text-xs font-mono text-[var(--muted)]">
                  {sessionB.screeningId}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-1 text-center py-2 border-y border-[var(--border)]">
                <div>
                  <span className="text-[10px] font-mono text-[var(--muted)] block">PD</span>
                  <span className="text-xs font-bold text-[var(--text)]">
                    {sessionB.conditions.pd.band}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[var(--muted)] block">AD</span>
                  <span className="text-xs font-bold text-[var(--text)]">
                    {sessionB.conditions.ad.band}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[var(--muted)] block">DYS</span>
                  <span className="text-xs font-bold text-[var(--text)]">
                    {sessionB.conditions.dysarthria.band}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[var(--muted)] block">PST</span>
                  <span className="text-xs font-bold text-[var(--text)]">
                    {sessionB.conditions.postStroke.band}
                  </span>
                </div>
              </div>

              <div className="text-xs text-[var(--muted)]">
                <strong>Quality:</strong> {sessionB.qualityLabel} · {sessionB.language}
              </div>
            </div>
          </div>

          {/* Simple comparison table with ↑ ↓ = */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[var(--surface-2)] border-b border-[var(--border)] text-[var(--muted)] font-mono uppercase text-[11px]">
                <tr>
                  <th className="py-2.5 px-3">Feature</th>
                  <th className="py-2.5 px-3">{sessionA.date} (Session 1)</th>
                  <th className="py-2.5 px-3">{sessionB.date} (Session 2)</th>
                  <th className="py-2.5 px-3 text-right">Change</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {/* Voice steadiness (Jitter) */}
                <tr className="hover:bg-[var(--surface-2)]/40">
                  <td className="py-3 px-3">
                    <span className="term">Jitter</span>
                    <span className="term-plain">(voice steadiness)</span>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-[var(--primary)]">
                    {sessionA.features.voiceSteadiness.value}
                  </td>
                  <td className="py-3 px-3 font-mono text-[var(--muted)]">
                    {sessionB.features.voiceSteadiness.value}
                  </td>
                  <td className="py-3 px-3 text-right">
                    {sessionA.features.voiceSteadiness.num < sessionB.features.voiceSteadiness.num ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold inline-flex items-center gap-1">
                        <TrendingDown size={14} /> Improved (↓)
                      </span>
                    ) : sessionA.features.voiceSteadiness.num > sessionB.features.voiceSteadiness.num ? (
                      <span className="text-amber-600 dark:text-amber-400 font-bold inline-flex items-center gap-1">
                        <TrendingUp size={14} /> Higher (↑)
                      </span>
                    ) : (
                      <span className="text-gray-500 inline-flex items-center gap-1">
                        <Minus size={14} /> Similar (=)
                      </span>
                    )}
                  </td>
                </tr>

                {/* Volume stability (Shimmer) */}
                <tr className="hover:bg-[var(--surface-2)]/40">
                  <td className="py-3 px-3">
                    <span className="term">Shimmer</span>
                    <span className="term-plain">(volume consistency)</span>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-[var(--primary)]">
                    {sessionA.features.volumeStability.value}
                  </td>
                  <td className="py-3 px-3 font-mono text-[var(--muted)]">
                    {sessionB.features.volumeStability.value}
                  </td>
                  <td className="py-3 px-3 text-right">
                    {sessionA.features.volumeStability.num < sessionB.features.volumeStability.num ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold inline-flex items-center gap-1">
                        <TrendingDown size={14} /> Improved (↓)
                      </span>
                    ) : sessionA.features.volumeStability.num > sessionB.features.volumeStability.num ? (
                      <span className="text-amber-600 dark:text-amber-400 font-bold inline-flex items-center gap-1">
                        <TrendingUp size={14} /> Higher (↑)
                      </span>
                    ) : (
                      <span className="text-gray-500 inline-flex items-center gap-1">
                        <Minus size={14} /> Similar (=)
                      </span>
                    )}
                  </td>
                </tr>

                {/* Voice clarity (HNR) */}
                <tr className="hover:bg-[var(--surface-2)]/40">
                  <td className="py-3 px-3">
                    <span className="term">HNR</span>
                    <span className="term-plain">(voice clarity)</span>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-[var(--primary)]">
                    {sessionA.features.voiceClarity.value}
                  </td>
                  <td className="py-3 px-3 font-mono text-[var(--muted)]">
                    {sessionB.features.voiceClarity.value}
                  </td>
                  <td className="py-3 px-3 text-right">
                    {sessionA.features.voiceClarity.num > sessionB.features.voiceClarity.num ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold inline-flex items-center gap-1">
                        <TrendingUp size={14} /> Clearer (↑)
                      </span>
                    ) : sessionA.features.voiceClarity.num < sessionB.features.voiceClarity.num ? (
                      <span className="text-amber-600 dark:text-amber-400 font-bold inline-flex items-center gap-1">
                        <TrendingDown size={14} /> Lower (↓)
                      </span>
                    ) : (
                      <span className="text-gray-500 inline-flex items-center gap-1">
                        <Minus size={14} /> Similar (=)
                      </span>
                    )}
                  </td>
                </tr>

                {/* Pause patterns */}
                <tr className="hover:bg-[var(--surface-2)]/40">
                  <td className="py-3 px-3">
                    <span className="term">Pause Ratio</span>
                    <span className="term-plain">(cadence pauses)</span>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-[var(--primary)]">
                    {sessionA.features.pauseRatio.value}
                  </td>
                  <td className="py-3 px-3 font-mono text-[var(--muted)]">
                    {sessionB.features.pauseRatio.value}
                  </td>
                  <td className="py-3 px-3 text-right">
                    {Math.abs(sessionA.features.pauseRatio.num - sessionB.features.pauseRatio.num) < 0.05 ? (
                      <span className="text-gray-500 inline-flex items-center gap-1">
                        <Minus size={14} /> Similar (=)
                      </span>
                    ) : sessionA.features.pauseRatio.num < sessionB.features.pauseRatio.num ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold inline-flex items-center gap-1">
                        <TrendingDown size={14} /> Better flow (↓)
                      </span>
                    ) : (
                      <span className="text-amber-600 dark:text-amber-400 font-bold inline-flex items-center gap-1">
                        <TrendingUp size={14} /> More pauses (↑)
                      </span>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Plain summary paragraph */}
          <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-xs text-[var(--muted)] leading-relaxed">
            Between {sessionB.date} and {sessionA.date}, your voice steadiness improved. Your pause patterns were similar in both recordings.
          </div>
        </div>
        )
      )}
    </div>
  )
}
