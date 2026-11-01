'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Mic,
  Activity,
  Calendar,
  Flame,
  CheckCircle2,
  FileText,
  Download,
  Eye,
  ArrowRight,
  ShieldAlert,
  MapPin,
  Clock,
  Sparkles,
  Info,
} from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'
import dynamic from 'next/dynamic'
import { BRAND } from '@/lib/brand'

// Dynamic Recharts with ssr: false
const LineChart = dynamic(() => import('recharts').then((mod) => mod.LineChart), { ssr: false })
const Line = dynamic(() => import('recharts').then((mod) => mod.Line), { ssr: false })
const XAxis = dynamic(() => import('recharts').then((mod) => mod.XAxis), { ssr: false })
const YAxis = dynamic(() => import('recharts').then((mod) => mod.YAxis), { ssr: false })
const Tooltip = dynamic(() => import('recharts').then((mod) => mod.Tooltip), { ssr: false })
const ResponsiveContainer = dynamic(() => import('recharts').then((mod) => mod.ResponsiveContainer), { ssr: false })

export default function DashboardHomePage() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [timeFilter, setTimeFilter] = useState<'7D' | '1M' | '3M' | '6M' | '1Y'>('1M')
  
  // Track screenings count
  const [screenings, setScreenings] = useState<any[]>([])
  const [isFirstTime, setIsFirstTime] = useState<boolean>(false)

  useEffect(() => {
    // Fetch user screenings
    fetch('/api/reports/user/default_user')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setScreenings(data)
        setIsFirstTime(data.length === 0)
      })
      .catch(() => {
        setIsFirstTime(false) // graceful
      })
  }, [])

  const trendData = [
    { label: 'Week 1', pd: 16, ad: 22, dysarthria: 12, postStroke: 10 },
    { label: 'Week 2', pd: 15, ad: 20, dysarthria: 11, postStroke: 10 },
    { label: 'Week 3', pd: 13, ad: 19, dysarthria: 10, postStroke: 9 },
    { label: 'Week 4', pd: 12, ad: 18, dysarthria: 9, postStroke: 8 },
  ]

  const recentReports = [
    {
      id: 'scr-8812',
      date: '28 Oct 2026',
      flags: 'Zero Acute Flags',
      risk: 'Low (12%)',
      riskColor: 'var(--success)',
      bgRisk: 'rgba(16, 185, 129, 0.1)',
    },
    {
      id: 'scr-8740',
      date: '14 Oct 2026',
      flags: 'Jitter 0.52%',
      risk: 'Low (15%)',
      riskColor: 'var(--success)',
      bgRisk: 'rgba(16, 185, 129, 0.1)',
    },
    {
      id: 'scr-8692',
      date: '30 Sep 2026',
      flags: 'Baseline Test',
      risk: 'Low (14%)',
      riskColor: 'var(--success)',
      bgRisk: 'rgba(16, 185, 129, 0.1)',
    },
  ]

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Demo Mode Notice Banner */}
      <div className="p-3.5 rounded-xl border border-[var(--warning)]/30 bg-[var(--warning)]/10 text-[var(--warning)] text-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Info size={16} className="flex-shrink-0" />
          <span>
            <strong>RESEARCH PROTOTYPE DEMO MODE:</strong> All risk scores are calculated using the open evidence-based heuristic acoustic model. For clinical validation, connect your MongoDB and Firebase Admin credentials in <code className="px-1 py-0.5 rounded bg-[var(--surface)] text-[var(--text)]">.env</code>.
          </span>
        </div>
        <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-[var(--surface)] text-[var(--text)]">
          Research Tool
        </span>
      </div>

      {/* Greeting Header & Large New Screening CTA */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-[var(--border)]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-[var(--text)] tracking-tight">
            Good morning, Shivam 👋
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1 flex items-center gap-2">
            <span>Last screening: 3 days ago</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)]" />
            <span className="text-[var(--success)] font-medium">Risk Status: Low</span>
          </p>
        </div>

        <Link
          href="/dashboard/scan"
          className="btn-primary px-6 py-3 text-sm font-semibold text-white rounded-xl shadow-lg shadow-[var(--primary-glow)] hover:scale-105 active:scale-95 transition-all"
        >
          <Mic size={18} className="animate-pulse" />
          + New Voice Screening
        </Link>
      </div>

      {/* Guided Card for First-Time Users */}
      {isFirstTime ? (
        <div className="p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] text-center max-w-2xl mx-auto shadow-xl">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-[var(--primary)]/10 text-[var(--primary)] mx-auto mb-4">
            <Sparkles size={32} />
          </div>
          <h2 className="text-2xl font-display font-bold text-[var(--text)] mb-2">
            Welcome to NeuroVoice
          </h2>
          <p className="text-sm text-[var(--text-muted)] mb-6 max-w-md mx-auto leading-relaxed">
            Take your first 30-second baseline voice test to activate longitudinal acoustic trend tracking.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 text-left">
            <div className="p-4 rounded-xl bg-[var(--bg)] border border-[var(--border)]">
              <span className="text-xs font-mono font-bold text-[var(--primary)]">01</span>
              <div className="text-sm font-bold text-[var(--text)] mt-1">Select Language</div>
              <div className="text-xs text-[var(--text-muted)] mt-0.5">Hindi or English</div>
            </div>
            <div className="p-4 rounded-xl bg-[var(--bg)] border border-[var(--border)]">
              <span className="text-xs font-mono font-bold text-[var(--accent)]">02</span>
              <div className="text-sm font-bold text-[var(--text)] mt-1">30s Phonation</div>
              <div className="text-xs text-[var(--text-muted)] mt-0.5">Sustained vowel sound</div>
            </div>
            <div className="p-4 rounded-xl bg-[var(--bg)] border border-[var(--border)]">
              <span className="text-xs font-mono font-bold text-[var(--success)]">03</span>
              <div className="text-sm font-bold text-[var(--text)] mt-1">Instant Evidence</div>
              <div className="text-xs text-[var(--text-muted)] mt-0.5">SHAP feature analysis</div>
            </div>
          </div>
          <Link
            href="/dashboard/scan"
            className="btn-primary px-8 py-3.5 text-base font-semibold text-white rounded-xl shadow-lg"
          >
            Start Your First Screening →
          </Link>
        </div>
      ) : (
        <>
          {/* ROW 1: 4 Bento Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Total Screenings */}
            <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] flex flex-col justify-between">
              <div className="flex items-center justify-between text-[var(--text-muted)] mb-3">
                <span className="text-xs font-medium uppercase tracking-wider">Total Screenings</span>
                <Activity size={18} className="text-[var(--primary)]" />
              </div>
              <div className="text-3xl font-display font-bold text-[var(--text)]">3</div>
              <div className="text-xs text-[var(--success)] font-medium mt-2 flex items-center gap-1">
                <span>+1 this month</span>
                <span className="text-[var(--text-muted)]">· Routine interval</span>
              </div>
            </div>

            {/* Card 2: Current Risk Level */}
            <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] flex flex-col justify-between">
              <div className="flex items-center justify-between text-[var(--text-muted)] mb-3">
                <span className="text-xs font-medium uppercase tracking-wider">Current Risk Level</span>
                <CheckCircle2 size={18} className="text-[var(--success)]" />
              </div>
              <div className="text-3xl font-display font-bold text-[var(--success)]">Low (12%)</div>
              <div className="text-xs text-[var(--text-muted)] mt-2">
                Within normal age-matched thresholds
              </div>
            </div>

            {/* Card 3: Screening Streak */}
            <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] flex flex-col justify-between">
              <div className="flex items-center justify-between text-[var(--text-muted)] mb-3">
                <span className="text-xs font-medium uppercase tracking-wider">Screening Streak</span>
                <Flame size={18} className="text-amber-500" />
              </div>
              <div className="text-3xl font-display font-bold text-[var(--text)]">3 Days</div>
              <div className="text-xs text-[var(--text-muted)] mt-2 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[var(--success)]" />
                <span>Next test in 11 days</span>
              </div>
            </div>

            {/* Card 4: Active Monitoring */}
            <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] flex flex-col justify-between">
              <div className="flex items-center justify-between text-[var(--text-muted)] mb-3">
                <span className="text-xs font-medium uppercase tracking-wider">Conditions Tracked</span>
                <ShieldAlert size={18} className="text-[var(--accent)]" />
              </div>
              <div className="text-3xl font-display font-bold text-[var(--accent)]">4 / 4</div>
              <div className="text-xs text-[var(--text-muted)] mt-2">
                PD · AD · Dysarthria · Stroke
              </div>
            </div>
          </div>

          {/* ROW 2: Risk Trend Chart (Full Width) */}
          <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-bold font-display text-[var(--text)]">
                  Longitudinal Risk Trajectory
                </h2>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Bayesian probability trajectory over time across the 4 conditions
                </p>
              </div>

              {/* Time Filters */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
                {(['7D', '1M', '3M', '6M', '1Y'] as const).map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setTimeFilter(filter)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                      timeFilter === filter
                        ? 'bg-[var(--primary)] text-white shadow-sm font-semibold'
                        : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* 4-Line Recharts Component */}
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <XAxis dataKey="label" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={11} domain={[0, 50]} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--surface)',
                      borderColor: 'var(--border)',
                      borderRadius: '12px',
                      color: 'var(--text)',
                      fontSize: '12px',
                    }}
                  />
                  <Line type="monotone" dataKey="pd" name="Parkinson's (PD)" stroke="var(--primary)" strokeWidth={2.5} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="ad" name="Alzheimer's (AD)" stroke="#8B5CF6" strokeWidth={2.5} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="dysarthria" name="Dysarthria" stroke="var(--accent)" strokeWidth={2.5} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="postStroke" name="Post-Stroke" stroke="var(--success)" strokeWidth={2.5} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Chart Legend */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-4 pt-4 border-t border-[var(--border)] text-xs">
              <span className="flex items-center gap-2 text-[var(--text)]">
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--primary)]" /> Parkinson's (PD)
              </span>
              <span className="flex items-center gap-2 text-[var(--text)]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]" /> Alzheimer's (AD)
              </span>
              <span className="flex items-center gap-2 text-[var(--text)]">
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent)]" /> Dysarthria
              </span>
              <span className="flex items-center gap-2 text-[var(--text)]">
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--success)]" /> Post-Stroke PSCI
              </span>
            </div>
          </div>

          {/* ROW 3: Two Columns (60% Recent Reports | 40% Upcoming Appointments) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 60%: Recent Reports */}
            <div className="lg:col-span-7 p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold font-display text-[var(--text)]">
                  Recent Screening Reports
                </h3>
                <Link
                  href="/dashboard/history"
                  className="text-xs font-semibold text-[var(--accent)] hover:underline flex items-center gap-1"
                >
                  See All →
                </Link>
              </div>

              <div className="space-y-3">
                {recentReports.map((rep) => (
                  <div
                    key={rep.id}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] hover:border-[var(--accent)] transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-[var(--surface-2)] text-[var(--primary)]">
                        <FileText size={18} />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-[var(--text)]">{rep.id}</div>
                        <div className="text-xs text-[var(--text-muted)]">{rep.date} · {rep.flags}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className="text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{ color: rep.riskColor, backgroundColor: rep.bgRisk }}
                      >
                        {rep.risk}
                      </span>
                      <a
                        href={`/api/reports/${rep.id}/pdf`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
                        title="Download 5-page PDF"
                      >
                        <Download size={15} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right 40%: Upcoming Appointments */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold font-display text-[var(--text)]">
                    Upcoming Appointments
                  </h3>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                    Sample Data
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[var(--bg)] border border-[var(--border)] space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[var(--primary)]">Movement Disorders Consult</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--success)]/10 text-[var(--success)] font-semibold">
                      Confirmed
                    </span>
                  </div>
                  <div className="text-sm font-bold text-[var(--text)]">Dr. V. K. Soni</div>
                  <div className="text-xs text-[var(--text-muted)] flex items-center gap-1.5">
                    <Clock size={13} />
                    <span>05 Nov 2026 · 10:30 AM</span>
                  </div>
                  <div className="text-xs text-[var(--text-muted)] flex items-center gap-1.5">
                    <MapPin size={13} />
                    <span>Jabalpur Medical College Hospital OPD Block</span>
                  </div>
                </div>
              </div>

              <Link
                href="/dashboard/appointments"
                className="w-full text-center py-2.5 rounded-xl text-xs font-semibold bg-[var(--surface-2)] text-[var(--text)] border border-[var(--border)] hover:border-[var(--primary)] transition-all"
              >
                + Book New Appointment
              </Link>
            </div>
          </div>

          {/* ROW 4: Doctor Recommendation */}
          <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold font-display text-[var(--text)] flex items-center gap-2">
                <MapPin size={16} className="text-[var(--accent)]" />
                Recommended Specialist in Jabalpur
              </h3>
              <span className="text-[10px] font-mono text-[var(--text-muted)]">Sample Data</span>
            </div>
            <div className="p-4 rounded-xl bg-[var(--bg)] border border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-sm font-bold text-[var(--text)]">Dr. Ananya Mishra</div>
                <div className="text-xs text-[var(--text-muted)]">Cognitive Neurology & Dementia · Jabalpur Medical College Super Specialty Hospital</div>
                <div className="text-xs text-[var(--accent)] mt-1 font-mono">Distance: 2.8 km · Available this week</div>
              </div>
              <Link
                href="/dashboard/doctors"
                className="btn-primary text-xs font-semibold px-4 py-2 rounded-lg"
              >
                View Profile & Slots →
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
