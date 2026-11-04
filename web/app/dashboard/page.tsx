'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Mic,
  Activity,
  Calendar,
  FileText,
  Download,
  ArrowRight,
  ShieldAlert,
  Clock,
  Sparkles,
  Info,
  CheckCircle2,
  Users,
  HeartPulse,
  Bot,
} from 'lucide-react'
import { subscribeToAuth, UserSession } from '@/lib/auth'
import dynamic from 'next/dynamic'

const LineChart = dynamic(() => import('recharts').then((mod) => mod.LineChart), { ssr: false })
const Line = dynamic(() => import('recharts').then((mod) => mod.Line), { ssr: false })
const XAxis = dynamic(() => import('recharts').then((mod) => mod.XAxis), { ssr: false })
const YAxis = dynamic(() => import('recharts').then((mod) => mod.YAxis), { ssr: false })
const Tooltip = dynamic(() => import('recharts').then((mod) => mod.Tooltip), { ssr: false })
const ResponsiveContainer = dynamic(() => import('recharts').then((mod) => mod.ResponsiveContainer), { ssr: false })

export default function DashboardHomePage() {
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null)
  const [screenings, setScreenings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = subscribeToAuth((user) => {
      setCurrentUser(user)
      const targetUid = user?.uid || 'default_user'
      fetch(`/api/reports/user/${targetUid}`)
        .then((res) => (res.ok ? res.json() : []))
        .then((data) => {
          setScreenings(Array.isArray(data) ? data : [])
          setLoading(false)
        })
        .catch(() => {
          const local = localStorage.getItem(`neurovoice_screenings_${targetUid}`)
          if (local) {
            try {
              setScreenings(JSON.parse(local))
            } catch {}
          }
          setLoading(false)
        })
    })
    return () => unsub()
  }, [])

  const userName = currentUser?.displayName || 'there'
  const isFirstTime = screenings.length === 0

  // Calculate "Last screening X days ago" from real data
  const getLastScreeningDays = () => {
    if (screenings.length === 0) return null
    const latest = screenings[0]
    const ts = new Date(latest.timestamp || latest.created_at || Date.now()).getTime()
    const diffDays = Math.floor((Date.now() - ts) / (1000 * 60 * 60 * 24))
    if (diffDays <= 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    return `${diffDays} days ago`
  }

  const lastScreeningText = getLastScreeningDays()

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  // Trend data computed from real screenings
  const trendData = screenings
    .slice(0, 10)
    .reverse()
    .map((s, idx) => ({
      label: s.date || `Scan #${idx + 1}`,
      pd: s.riskScores?.pd ?? 0,
      ad: s.riskScores?.ad ?? 0,
      dysarthria: s.riskScores?.dysarthria ?? 0,
      postStroke: s.riskScores?.postStroke ?? 0,
    }))

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Top Banner / Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)]">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[var(--accent)]">
              Acoustic Screening Command Center
            </span>
            {lastScreeningText && (
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[var(--surface-2)] text-[var(--muted)] border border-[var(--border)]">
                Last screening: {lastScreeningText}
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-[var(--text)] tracking-tight">
            {isFirstTime
              ? `Welcome, ${userName}. Let's take your first voice screening.`
              : `${getGreeting()}, ${userName}.`}
          </h1>
          <p className="text-xs sm:text-sm text-[var(--muted)] max-w-xl leading-relaxed">
            {isFirstTime
              ? 'Complete a 30-second speech task to establish your personalized acoustic baseline.'
              : 'Monitor your vocal tract stability and neurological biomarker trends over time.'}
          </p>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/dashboard/scan"
            className="btn-primary text-xs sm:text-sm font-semibold px-5 py-3 rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-2"
          >
            <Mic size={16} />
            <span>{isFirstTime ? 'Take First Screening' : 'Start New Screening'}</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>

      {/* FIRST-TIME EMPTY STATE */}
      {isFirstTime && !loading && (
        <div className="p-8 sm:p-12 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] text-center space-y-6 max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] text-[var(--primary)] flex items-center justify-center mx-auto shadow-sm">
            <Mic size={28} />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-display font-bold text-[var(--text)]">
              No voice screenings recorded yet
            </h2>
            <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed max-w-md mx-auto">
              Your dashboard will display vocal trend charts, per-condition risk bands, and clinical reports once you complete your initial 30-second voice assessment.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-left space-y-2.5 max-w-md mx-auto">
            <div className="text-xs font-bold text-[var(--text)] flex items-center gap-1.5">
              <Sparkles size={14} className="text-[var(--accent)]" />
              <span>What to expect in your first screening:</span>
            </div>
            <ul className="text-xs text-[var(--muted)] space-y-1.5 list-disc list-inside">
              <li>Choose your language: Hindi or English.</li>
              <li>Sustain a steady "aaah" vowel sound twice into your mic.</li>
              <li>Read one phonetically balanced standard sentence.</li>
              <li>Speak for 20 seconds about your morning.</li>
            </ul>
          </div>

          <Link
            href="/dashboard/scan"
            className="btn-primary inline-flex text-xs sm:text-sm font-semibold px-8 py-3 rounded-xl shadow-sm"
          >
            Begin 30-Second Voice Screening →
          </Link>
        </div>
      )}

      {/* RETURNING USER REAL DATA VIEW */}
      {!isFirstTime && !loading && (
        <>
          {/* STAT CARDS ROW */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Total Screenings */}
            <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] space-y-2">
              <span className="text-xs font-medium text-[var(--muted)]">Total Screenings</span>
              <div className="text-2xl font-display font-bold text-[var(--text)]">
                {screenings.length}
              </div>
              <div className="text-[11px] text-[var(--muted)]">Evaluated sessions on record</div>
            </div>

            {/* Card 2: Last Screening - REAL COMPUTED (hidden if none) */}
            {lastScreeningText && (
              <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] space-y-2">
                <span className="text-xs font-medium text-[var(--muted)]">Last Voice Screening</span>
                <div className="text-2xl font-display font-bold text-[var(--accent)]">
                  {lastScreeningText}
                </div>
                <div className="text-[11px] text-[var(--muted)]">
                  {screenings[0]?.date || 'Recent session'}
                </div>
              </div>
            )}

            {/* Card 3: Latest Screening Status */}
            <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] space-y-2">
              <span className="text-xs font-medium text-[var(--muted)]">Latest Overall Indicator</span>
              <div className="text-2xl font-display font-bold text-[var(--success)]">
                {screenings[0]?.highestBand || 'Low Risk'}
              </div>
              <div className="text-[11px] text-[var(--muted)]">Screening indication only</div>
            </div>

            {/* Card 4: Audio Quality Floor */}
            <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] space-y-2">
              <span className="text-xs font-medium text-[var(--muted)]">Recording Quality</span>
              <div className="text-2xl font-display font-bold text-[var(--text)] flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--success)]" />
                <span>{screenings[0]?.snr ? `${Math.round(screenings[0].snr)} dB` : 'Optimal'}</span>
              </div>
              <div className="text-[11px] text-[var(--muted)]">Clean acoustic signal-to-noise ratio</div>
            </div>
          </div>

          {/* REAL LONGITUDINAL TREND CHART OR EMPTY STATE */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border)] pb-4">
              <div>
                <h3 className="text-lg font-display font-bold text-[var(--text)]">
                  Longitudinal Vocal Biomarker Trajectory
                </h3>
                <p className="text-xs text-[var(--muted)]">
                  Tracks stability across Parkinson's, Alzheimer's, Dysarthria, and Post-Stroke indicators.
                </p>
              </div>
              <span className="text-xs font-mono text-[var(--accent)] font-semibold">
                Objective Acoustic Variance
              </span>
            </div>

            {screenings.length >= 2 ? (
              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <XAxis dataKey="label" stroke="var(--muted)" fontSize={11} tickLine={false} />
                    <YAxis stroke="var(--muted)" fontSize={11} domain={[0, 100]} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--surface)',
                        borderColor: 'var(--border)',
                        color: 'var(--text)',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                    />
                    <Line type="monotone" dataKey="pd" name="Parkinson's" stroke="#1E40AF" strokeWidth={2.5} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="ad" name="Alzheimer's" stroke="#7C3AED" strokeWidth={2.5} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="dysarthria" name="Dysarthria" stroke="#0D7377" strokeWidth={2.5} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="postStroke" name="Post-Stroke" stroke="#B45309" strokeWidth={2.5} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-[var(--muted)] space-y-2 bg-[var(--surface-2)]/50 rounded-xl border border-[var(--border)]">
                <Activity size={24} className="mx-auto text-[var(--muted)]" />
                <p className="font-semibold text-[var(--text)]">Complete at least 2 screenings to view your vocal trajectory.</p>
                <p>Tracking vocal markers over multiple sessions enables longitudinal stability analysis.</p>
              </div>
            )}
          </div>

          {/* RECENT REPORTS LIST */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <h3 className="text-base font-display font-bold text-[var(--text)]">
                Recent Voice Screening Reports
              </h3>
              <Link href="/dashboard/history" className="text-xs font-semibold text-[var(--primary)] hover:underline">
                View All Reports →
              </Link>
            </div>

            <div className="divide-y divide-[var(--border)]">
              {screenings.slice(0, 5).map((rep) => (
                <div key={rep.id} className="py-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-[var(--primary)] flex items-center justify-center shrink-0">
                      <FileText size={17} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[var(--text)]">
                        {rep.id}
                      </div>
                      <div className="text-[11px] text-[var(--muted)] font-mono">
                        {rep.date || 'Screening on record'} · {rep.language || 'Hindi/English'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
                      {rep.highestBand || 'Low Risk'}
                    </span>
                    <a
                      href={`/api/reports/${rep.id}/pdf`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] text-[var(--muted)] hover:text-[var(--text)] transition-colors"
                      title="Download Clinical PDF"
                    >
                      <Download size={15} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* QUICK CLINICAL ACTIONS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/dashboard/care"
          className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] hover:border-[var(--primary)] transition-all flex items-center gap-3.5 group"
        >
          <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center shrink-0">
            <Users size={20} />
          </div>
          <div>
            <div className="text-xs font-bold text-[var(--text)] group-hover:text-[var(--primary)] transition-colors">
              Find Verified Doctors
            </div>
            <div className="text-[11px] text-[var(--muted)]">Calculate live distance to specialists</div>
          </div>
        </Link>

        <Link
          href="/dashboard/ask"
          className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] hover:border-[var(--accent)] transition-all flex items-center gap-3.5 group"
        >
          <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center shrink-0">
            <Bot size={20} />
          </div>
          <div>
            <div className="text-xs font-bold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
              Ask NeuroVoice Assistant
            </div>
            <div className="text-[11px] text-[var(--muted)]">Voice & condition guidance powered by Gemini AI</div>
          </div>
        </Link>

        <Link
          href="/about/method"
          className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] hover:border-[var(--muted)] transition-all flex items-center gap-3.5 group"
        >
          <div className="w-10 h-10 rounded-xl bg-[var(--surface-2)] text-[var(--muted)] flex items-center justify-center shrink-0">
            <Info size={20} />
          </div>
          <div>
            <div className="text-xs font-bold text-[var(--text)]">
              Scientific Methodology
            </div>
            <div className="text-[11px] text-[var(--muted)]">Review clinical citations & biomarkers</div>
          </div>
        </Link>
      </div>
    </div>
  )
}
