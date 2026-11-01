'use client'

import React, { useState, useRef } from 'react'
import {
  User,
  Camera,
  MapPin,
  Languages,
  Building,
  Award,
  Activity,
  Calendar,
  CheckCircle2,
  TrendingDown,
  Sparkles,
  Edit2,
  Check,
} from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'
import dynamic from 'next/dynamic'

// Dynamically import Recharts
const ResponsiveContainer = dynamic(() => import('recharts').then((mod) => mod.ResponsiveContainer), { ssr: false })
const BarChart = dynamic(() => import('recharts').then((mod) => mod.BarChart), { ssr: false })
const Bar = dynamic(() => import('recharts').then((mod) => mod.Bar), { ssr: false })
const LineChart = dynamic(() => import('recharts').then((mod) => mod.LineChart), { ssr: false })
const Line = dynamic(() => import('recharts').then((mod) => mod.Line), { ssr: false })
const PieChart = dynamic(() => import('recharts').then((mod) => mod.PieChart), { ssr: false })
const Pie = dynamic(() => import('recharts').then((mod) => mod.Pie), { ssr: false })
const Cell = dynamic(() => import('recharts').then((mod) => mod.Cell), { ssr: false })
const XAxis = dynamic(() => import('recharts').then((mod) => mod.XAxis), { ssr: false })
const YAxis = dynamic(() => import('recharts').then((mod) => mod.YAxis), { ssr: false })
const Tooltip = dynamic(() => import('recharts').then((mod) => mod.Tooltip), { ssr: false })

export default function UserProfilePage() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const [activeTab, setActiveTab] = useState<'overview' | 'stats' | 'achievements'>('overview')
  const [name, setName] = useState('Dr. Priya Sharma')
  const [isEditingName, setIsEditingName] = useState(false)
  const [photoURL, setPhotoURL] = useState<string | null>(null)
  const [gender, setGender] = useState<'female' | 'male' | 'unspecified'>('female')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setPhotoURL(ev.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const monthlyScreenings = [
    { month: 'Jun', count: 6 }, { month: 'Jul', count: 8 }, { month: 'Aug', count: 11 },
    { month: 'Sep', count: 15 }, { month: 'Oct', count: 19 },
  ]

  const disorderPie = [
    { name: 'Parkinson Normal', value: 70, color: '#6366F1' },
    { name: 'Alzheimer Normal', value: 80, color: '#8B5CF6' },
    { name: 'Dysarthria Optimal', value: 85, color: '#22D3EE' },
  ]

  const averageRiskTrend = [
    { month: 'Jun', risk: 24 }, { month: 'Jul', risk: 20 }, { month: 'Aug', risk: 18 },
    { month: 'Sep', risk: 15 }, { month: 'Oct', risk: 12 },
  ]

  const achievements = [
    { title: 'First Screening ✅', desc: 'Completed your first 30-second acoustic voice analysis.', unlocked: true },
    { title: '5 Screenings 🔥', desc: 'Maintained steady longitudinal voice tracking sessions.', unlocked: true },
    { title: 'Hindi Speaker 🇮🇳', desc: 'Analyzed acoustic Hindi dialect phonemes in Madhya Pradesh.', unlocked: true },
    { title: '3-Month Monitor 📈', desc: 'Continuous 90-day tracking without missing scheduled milestones.', unlocked: true },
    { title: 'Research Contributor 🎓', desc: 'Contributed 10+ anonymized evaluations to JMC repository.', unlocked: false },
    { title: 'Yearly Champion 🏆', desc: '365 days of proactive neurological monitoring completed.', unlocked: false },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-[#1F2937]">
        <span className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-widest block mb-1">
          FEATURE 15 · CLINICIAN & PATIENT COMMAND PROFILE
        </span>
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
          User Profile & Clinical Portfolio
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Manage your credentials, clinical engagement metrics, and longitudinal statistics
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT PANEL (1/3): PROFILE IDENTITY CARD */}
        <div className="lg:col-span-1 p-6 sm:p-8 rounded-2xl bg-[#111827] border border-[#1F2937] flex flex-col items-center text-center space-y-6 shadow-sm">
          {/* 120px Circular Photo with Hover "Change Photo" */}
          <div className="relative group">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-32 h-32 rounded-full border-2 border-indigo-500/50 p-1 cursor-pointer overflow-hidden relative shadow-[0_0_30px_rgba(99,102,241,0.25)] flex items-center justify-center bg-[#0A0F1E]"
            >
              {photoURL ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photoURL} alt="Profile" className="w-full h-full rounded-full object-cover" />
              ) : gender === 'female' ? (
                <div className="w-full h-full rounded-full bg-purple-500/15 text-purple-300 flex items-center justify-center text-5xl">
                  👩‍⚕️
                </div>
              ) : gender === 'male' ? (
                <div className="w-full h-full rounded-full bg-indigo-500/15 text-indigo-300 flex items-center justify-center text-5xl">
                  👨‍⚕️
                </div>
              ) : (
                <div className="w-full h-full rounded-full bg-gray-500/15 text-gray-300 flex items-center justify-center text-5xl">
                  👤
                </div>
              )}

              {/* Hover overlay */}
              <div className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[10px] font-mono transition-opacity">
                <Camera size={20} className="mb-1" />
                <span>Change Photo</span>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
            />
          </div>

          {/* Name (Inline editable) */}
          <div className="w-full">
            {isEditingName ? (
              <div className="flex items-center justify-center gap-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="px-3 py-1 bg-[#0A0F1E] border border-indigo-500 rounded-lg text-white text-base font-bold text-center outline-none"
                  autoFocus
                />
                <button
                  onClick={() => setIsEditingName(false)}
                  className="p-1.5 rounded-lg bg-indigo-600 text-white"
                >
                  <Check size={14} />
                </button>
              </div>
            ) : (
              <div
                onClick={() => setIsEditingName(true)}
                className="flex items-center justify-center gap-2 cursor-pointer group"
              >
                <h2 className="font-display font-extrabold text-2xl text-white group-hover:text-cyan-300 transition-colors">
                  {name}
                </h2>
                <Edit2 size={14} className="text-gray-500 group-hover:text-cyan-400" />
              </div>
            )}

            <div className="mt-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                Neurologist / Doctor
              </span>
            </div>
          </div>

          {/* Meta details */}
          <div className="w-full pt-4 border-t border-[#1F2937] text-xs font-mono space-y-2.5 text-left text-gray-400">
            <div className="flex items-center gap-2">
              <Building size={14} className="text-gray-500" />
              <span className="truncate">Jabalpur Medical College Hospital</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-gray-500" />
              <span>Jabalpur, Madhya Pradesh</span>
            </div>
            <div className="flex items-center gap-2">
              <Languages size={14} className="text-gray-500" />
              <span>Languages: Hindi (Native), English</span>
            </div>
          </div>

          <button
            onClick={() => alert('Profile updated in Firebase and MongoDB.')}
            className="w-full py-2.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 font-bold text-xs transition-colors"
          >
            Edit Profile Credentials
          </button>
        </div>

        {/* RIGHT PANEL (2/3): TABS (Overview | Screening Stats | Achievements) */}
        <div className="lg:col-span-2 p-6 sm:p-8 rounded-2xl bg-[#111827] border border-[#1F2937] flex flex-col justify-between">
          <div>
            {/* Tab navigation pills */}
            <div className="flex items-center gap-2 p-1 rounded-xl bg-[#0A0F1E] border border-[#1F2937] text-xs font-mono w-fit mb-6">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'stats', label: 'Screening Stats' },
                { id: 'achievements', label: 'Achievements' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-lg font-bold transition-all ${
                    activeTab === tab.id
                      ? 'bg-[#6366F1] text-white shadow'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-[#0A0F1E] border border-[#1F2937]">
                    <span className="text-xs text-gray-400 font-mono">Total Clinical Screenings</span>
                    <div className="font-display font-extrabold text-3xl text-white mt-1">34</div>
                    <span className="text-[11px] font-mono text-emerald-400">100% verified SNR</span>
                  </div>

                  <div className="p-4 rounded-xl bg-[#0A0F1E] border border-[#1F2937]">
                    <span className="text-xs text-gray-400 font-mono">Current Risk Trajectory</span>
                    <div className="font-display font-extrabold text-3xl text-emerald-400 mt-1">12%</div>
                    <span className="text-[11px] font-mono text-gray-400">Low Subclinical Variance</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-display font-bold text-sm text-white mb-3">Last 3 Clinical Reports</h4>
                  <div className="space-y-2">
                    {[
                      { date: '28 Oct 2026', title: 'Routine Longitudinal Voice Scan', score: 'Low (12%)' },
                      { date: '14 Oct 2026', title: 'Monthly Phonetic Evaluation', score: 'Low (15%)' },
                      { date: '28 Sep 2026', title: 'Post-Therapy Diadochokinetic Check', score: 'Low (17%)' },
                    ].map((rep) => (
                      <div key={rep.date} className="p-3.5 rounded-xl bg-[#0A0F1E] border border-[#1F2937] flex items-center justify-between text-xs font-mono">
                        <div>
                          <div className="font-semibold text-white">{rep.title}</div>
                          <div className="text-gray-500 text-[11px]">{rep.date}</div>
                        </div>
                        <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                          {rep.score}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: SCREENING STATS */}
            {activeTab === 'stats' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Screenings Per Month */}
                  <div className="p-4 rounded-xl bg-[#0A0F1E] border border-[#1F2937]">
                    <h5 className="text-xs font-mono text-gray-400 mb-2">Screenings / Month</h5>
                    <div className="h-40 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={monthlyScreenings}>
                          <XAxis dataKey="month" stroke="#4B5563" fontSize={10} />
                          <YAxis stroke="#4B5563" fontSize={10} />
                          <Bar dataKey="count" fill="#6366F1" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Average Risk Trend */}
                  <div className="p-4 rounded-xl bg-[#0A0F1E] border border-[#1F2937]">
                    <h5 className="text-xs font-mono text-gray-400 mb-2">Average Risk Trend (Score)</h5>
                    <div className="h-40 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={averageRiskTrend}>
                          <XAxis dataKey="month" stroke="#4B5563" fontSize={10} />
                          <YAxis stroke="#4B5563" fontSize={10} />
                          <Line type="monotone" dataKey="risk" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Calendar Heatmap streak */}
                <div className="p-4 rounded-xl bg-[#0A0F1E] border border-[#1F2937]">
                  <div className="flex items-center justify-between text-xs font-mono mb-2">
                    <span className="text-gray-400">Monitoring Heatmap (Last 12 Weeks)</span>
                    <span className="text-emerald-400 font-bold">Streak: Active</span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {Array.from({ length: 48 }).map((_, i) => (
                      <span
                        key={i}
                        className={`w-3.5 h-3.5 rounded-sm ${
                          i % 5 === 0
                            ? 'bg-indigo-500'
                            : i % 7 === 0
                            ? 'bg-cyan-500'
                            : i % 3 === 0
                            ? 'bg-indigo-900'
                            : 'bg-[#1F2937]'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: ACHIEVEMENTS */}
            {activeTab === 'achievements' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {achievements.map((a) => (
                  <div
                    key={a.title}
                    className={`p-4 rounded-xl border transition-all ${
                      a.unlocked
                        ? 'bg-[#0A0F1E] border-indigo-500/40 text-white'
                        : 'bg-[#0A0F1E]/40 border-[#1F2937] text-gray-500 opacity-50'
                    }`}
                  >
                    <div className="font-display font-bold text-sm mb-1">{a.title}</div>
                    <p className="text-xs text-gray-400 leading-snug">{a.desc}</p>
                    <span className="text-[10px] font-mono mt-2 block font-bold" style={{ color: a.unlocked ? '#10B981' : '#6B7280' }}>
                      {a.unlocked ? 'UNLOCKED' : 'LOCKED'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
