'use client'

import React, { useState } from 'react'
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
  Phone,
  Clock,
  Sparkles,
} from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'
import dynamic from 'next/dynamic'

// Recharts components loaded client-side
const LineChart = dynamic(() => import('recharts').then((mod) => mod.LineChart), { ssr: false })
const Line = dynamic(() => import('recharts').then((mod) => mod.Line), { ssr: false })
const XAxis = dynamic(() => import('recharts').then((mod) => mod.XAxis), { ssr: false })
const YAxis = dynamic(() => import('recharts').then((mod) => mod.YAxis), { ssr: false })
const Tooltip = dynamic(() => import('recharts').then((mod) => mod.Tooltip), { ssr: false })
const ResponsiveContainer = dynamic(() => import('recharts').then((mod) => mod.ResponsiveContainer), { ssr: false })
const AreaChart = dynamic(() => import('recharts').then((mod) => mod.AreaChart), { ssr: false })
const Area = dynamic(() => import('recharts').then((mod) => mod.Area), { ssr: false })

export default function DashboardHomePage() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [timeFilter, setTimeFilter] = useState<'7D' | '1M' | '3M' | '6M' | '1Y'>('1M')

  const trendData = [
    { label: 'Week 1', pd: 16, ad: 22, dysarthria: 12, postStroke: 10 },
    { label: 'Week 2', pd: 15, ad: 20, dysarthria: 11, postStroke: 10 },
    { label: 'Week 3', pd: 13, ad: 19, dysarthria: 10, postStroke: 9 },
    { label: 'Week 4', pd: 12, ad: 18, dysarthria: 9, postStroke: 8 },
  ]

  const sparklineData = [
    { v: 10 }, { v: 14 }, { v: 12 }, { v: 18 }, { v: 22 }, { v: 28 }, { v: 34 }
  ]

  const recentReports = [
    {
      id: 'rep-8812',
      date: '28 Oct 2026',
      flags: 'Zero Active Flags',
      risk: 'Low (12%)',
      riskColor: '#10B981',
      bgRisk: 'rgba(16, 185, 129, 0.1)',
    },
    {
      id: 'rep-8740',
      date: '14 Oct 2026',
      flags: 'Mild Pause Hesitation',
      risk: 'Low (15%)',
      riskColor: '#10B981',
      bgRisk: 'rgba(16, 185, 129, 0.1)',
    },
    {
      id: 'rep-8621',
      date: '28 Sep 2026',
      flags: 'Slight Pitch Flutter',
      risk: 'Low (17%)',
      riskColor: '#10B981',
      bgRisk: 'rgba(16, 185, 129, 0.1)',
    },
    {
      id: 'rep-8490',
      date: '14 Sep 2026',
      flags: 'Subclinical Jitter',
      risk: 'Moderate (26%)',
      riskColor: '#F59E0B',
      bgRisk: 'rgba(245, 158, 11, 0.1)',
    },
  ]

  const upcomingAppointments = [
    {
      id: 'apt-1',
      doctor: 'Dr. V. K. Soni',
      specialty: 'Neurology & Movement Disorders',
      hospital: 'Jabalpur Medical College',
      time: 'Tomorrow, 10:30 AM',
      mode: 'In-Person OPD 4',
    },
    {
      id: 'apt-2',
      doctor: 'Dr. Meenakshi Sahu',
      specialty: 'Speech & Swallowing Rehab',
      hospital: 'Apex Rehab Centre, Jabalpur',
      time: '08 Nov 2026, 03:00 PM',
      mode: 'Tele-Consultation',
    },
  ]

  const recommendedDoctors = [
    {
      name: 'Dr. Ananya Mishra',
      specialty: 'Cognitive Neurology & Memory Care',
      hospital: 'Super Specialty Wing, Jabalpur Medical College',
      city: 'Jabalpur',
      distance: '2.8 km away',
      languages: 'Hindi, English',
    },
    {
      name: 'Dr. Sudhir Sharma',
      specialty: 'Stroke Recovery & Neuro-Intensive Care',
      hospital: 'Metro Hospital & Heart Institute',
      city: 'Jabalpur',
      distance: '4.1 km away',
      languages: 'Hindi, English',
    },
  ]

  const downloadSamplePDF = () => {
    window.open('http://localhost:8000/api/reports/rep-8812/pdf', '_blank')
  }

  return (
    <div className="space-y-8">
      {/* GREETING HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-[#1F2937]/70">
        <div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl tracking-tight text-white flex items-center gap-2">
            <span>Good morning, Shivam</span>
            <span className="text-3xl">👋</span>
          </h1>
          <p className="text-sm text-gray-400 mt-1 flex items-center gap-2 font-mono">
            <span>Last screening: 3 days ago</span>
            <span>·</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 size={13} />
              Risk status: Low
            </span>
          </p>
        </div>

        <Link
          href="/dashboard/scan"
          className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-display font-bold text-sm text-white transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_35px_rgba(99,102,241,0.45)]"
          style={{
            background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
          }}
        >
          <Mic size={18} className="animate-pulse" />
          <span>+ New Screening</span>
        </Link>
      </div>

      {/* ROW 1: BENTO METRIC CARDS (4 cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Screenings */}
        <div className="p-6 rounded-2xl bg-[#111827] border border-[#1F2937] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-gray-400 font-mono mb-2">
            <span>Total Screenings</span>
            <Activity size={15} className="text-[#6366F1]" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-display font-extrabold text-3xl text-white">34</span>
            <span className="text-[11px] font-mono text-emerald-400 font-semibold">+4 this month</span>
          </div>
          {/* Sparkline mini preview */}
          <div className="h-10 w-full mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparklineData}>
                <Area type="monotone" dataKey="v" stroke="#6366F1" fill="#6366F1" fillOpacity={0.2} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 2: Current Risk Level */}
        <div className="p-6 rounded-2xl bg-[#111827] border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.06)] flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-gray-400 font-mono mb-2">
            <span>Current Risk Level</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          </div>
          <div>
            <span className="font-display font-extrabold text-3xl text-emerald-400">LOW</span>
            <p className="text-xs text-gray-400 mt-1">12/100 aggregate score</p>
          </div>
          {/* Gauge bar */}
          <div className="w-full bg-[#1F2937] h-2 rounded-full overflow-hidden mt-3">
            <div className="bg-emerald-400 h-full rounded-full" style={{ width: '12%' }} />
          </div>
        </div>

        {/* Card 3: Streak */}
        <div className="p-6 rounded-2xl bg-[#111827] border border-[#1F2937] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-gray-400 font-mono mb-2">
            <span>Monitoring Streak</span>
            <Flame size={15} className="text-[#F59E0B]" />
          </div>
          <div>
            <span className="font-display font-extrabold text-3xl text-white">4 Mo</span>
            <p className="text-xs text-gray-400 mt-1">3 days since last session</p>
          </div>
          {/* Calendar dots */}
          <div className="flex items-center gap-1.5 mt-3">
            {[1, 2, 3, 4, 5, 6, 7].map((d) => (
              <span
                key={d}
                className={`w-3.5 h-3.5 rounded-md ${
                  d <= 5 ? 'bg-indigo-500' : 'bg-[#1F2937]'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Card 4: Disorders Tracked */}
        <div className="p-6 rounded-2xl bg-[#111827] border border-[#1F2937] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-gray-400 font-mono mb-2">
            <span>Disorders Tracked</span>
            <span className="font-bold text-cyan-400">4 of 4</span>
          </div>
          <div className="space-y-1.5 mt-1 text-[11px] font-mono">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">PD</span>
              <span className="text-emerald-400">12%</span>
            </div>
            <div className="w-full bg-[#1F2937] h-1 rounded-full overflow-hidden">
              <div className="bg-[#6366F1] h-full" style={{ width: '12%' }} />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-400">AD</span>
              <span className="text-indigo-400">18%</span>
            </div>
            <div className="w-full bg-[#1F2937] h-1 rounded-full overflow-hidden">
              <div className="bg-[#8B5CF6] h-full" style={{ width: '18%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* ROW 2: RISK TREND CHART (Large, Full Width) */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#111827] border border-[#1F2937] shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="font-display font-bold text-lg text-white">
              Multi-Disorder Longitudinal Risk Trajectory
            </h3>
            <p className="text-xs text-gray-400">
              Simultaneous acoustic risk tracks over clinical testing intervals
            </p>
          </div>

          {/* Time Filter Pills */}
          <div className="flex items-center p-1 rounded-xl bg-[#0A0F1E] border border-[#1F2937] text-xs font-mono">
            {(['7D', '1M', '3M', '6M', '1Y'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setTimeFilter(filter)}
                className={`px-3 py-1 rounded-lg transition-all ${
                  timeFilter === filter
                    ? 'bg-[#6366F1] text-white font-bold shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* 4-Line Chart */}
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="label" stroke="#4B5563" fontSize={11} />
              <YAxis stroke="#4B5563" fontSize={11} domain={[0, 40]} />
              <Tooltip
                contentStyle={{
                  background: '#0F172A',
                  borderColor: '#1E293B',
                  borderRadius: '10px',
                  fontSize: '12px',
                }}
              />
              <Line type="monotone" dataKey="pd" stroke="#6366F1" strokeWidth={2.5} dot={{ r: 4 }} name="Parkinson's (PD)" />
              <Line type="monotone" dataKey="ad" stroke="#8B5CF6" strokeWidth={2.5} dot={{ r: 4 }} name="Alzheimer's (AD)" />
              <Line type="monotone" dataKey="dysarthria" stroke="#22D3EE" strokeWidth={2.5} dot={{ r: 4 }} name="Dysarthria" />
              <Line type="monotone" dataKey="postStroke" stroke="#14B8A6" strokeWidth={2.5} dot={{ r: 4 }} name="Post-Stroke Recovery" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Chart Legend */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-4 pt-4 border-t border-[#1F2937] text-xs font-mono text-gray-400">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#6366F1]" />
            <span>Parkinson's (Indigo)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#8B5CF6]" />
            <span>Alzheimer's (Purple)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#22D3EE]" />
            <span>Dysarthria (Cyan)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#14B8A6]" />
            <span>Post-Stroke (Teal)</span>
          </div>
        </div>
      </div>

      {/* ROW 3: TWO COLUMNS (Left 60% Reports, Right 40% Appointments) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Column (3/5 = 60%): Recent Reports */}
        <div className="lg:col-span-3 p-6 sm:p-7 rounded-2xl bg-[#111827] border border-[#1F2937] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-display font-bold text-lg text-white">Recent Screening Reports</h3>
                <p className="text-xs text-gray-400">Latest automated voice biomarker evaluations</p>
              </div>
              <Link href="/dashboard/history" className="text-xs font-semibold text-cyan-400 hover:text-cyan-300">
                See All →
              </Link>
            </div>

            <div className="divide-y divide-[#1F2937]">
              {recentReports.map((rep) => (
                <div key={rep.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div>
                    <div className="text-sm font-semibold text-white">{rep.date}</div>
                    <div className="text-xs text-gray-400 font-mono mt-0.5">{rep.flags}</div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className="px-2.5 py-1 rounded-full text-xs font-mono font-semibold"
                      style={{ color: rep.riskColor, background: rep.bgRisk }}
                    >
                      {rep.risk}
                    </span>
                    <Link
                      href="/dashboard/history"
                      className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                      title="View Report"
                    >
                      <Eye size={16} />
                    </Link>
                    <button
                      onClick={downloadSamplePDF}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-cyan-400 hover:bg-white/5 transition-colors"
                      title="Download PDF"
                    >
                      <Download size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (2/5 = 40%): Upcoming Appointments */}
        <div className="lg:col-span-2 p-6 sm:p-7 rounded-2xl bg-[#111827] border border-[#1F2937] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-display font-bold text-lg text-white">Upcoming Appointments</h3>
                <p className="text-xs text-gray-400">Specialist consultations & follow-ups</p>
              </div>
              <Calendar size={18} className="text-indigo-400" />
            </div>

            <div className="space-y-3.5 mb-6">
              {upcomingAppointments.map((apt) => (
                <div key={apt.id} className="p-4 rounded-xl bg-[#0A0F1E] border border-[#1F2937]">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-semibold text-sm text-white">{apt.doctor}</h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300">
                      {apt.mode}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">{apt.specialty}</p>
                  <p className="text-xs text-gray-500">{apt.hospital}</p>
                  <div className="mt-2 text-xs font-mono text-cyan-400 flex items-center gap-1.5">
                    <Clock size={12} />
                    <span>{apt.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/dashboard/appointments"
            className="w-full py-3 rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <span>+ Book New Appointment</span>
          </Link>
        </div>
      </div>

      {/* ROW 4: DOCTOR RECOMMENDATION */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-indigo-950/30 to-purple-950/20 border border-indigo-500/25">
        <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 font-semibold uppercase tracking-wider mb-2">
          <Sparkles size={14} />
          <span>Clinical Recommendation Based on Last Screening</span>
        </div>
        <h3 className="font-display font-bold text-xl text-white mb-2">
          Specialist Consultations Near You
        </h3>
        <p className="text-xs text-gray-400 mb-6 max-w-xl">
          Based on your latest acoustic profile, maintain proactive checkups with verified neurologists at Jabalpur Medical College.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendedDoctors.map((doc) => (
            <div key={doc.name} className="p-5 rounded-xl bg-[#111827] border border-[#1F2937] flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h4 className="font-display font-bold text-base text-white">{doc.name}</h4>
                  <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                    {doc.distance}
                  </span>
                </div>
                <p className="text-xs text-indigo-300 font-medium">{doc.specialty}</p>
                <p className="text-xs text-gray-400 mt-1">{doc.hospital}, {doc.city}</p>
                <p className="text-[11px] font-mono text-gray-500 mt-1">Languages: {doc.languages}</p>
              </div>

              <Link
                href="/dashboard/appointments"
                className="mt-4 inline-flex items-center justify-center gap-1.5 py-2 px-4 rounded-lg bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-semibold transition-colors"
              >
                <span>Book Appointment →</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
