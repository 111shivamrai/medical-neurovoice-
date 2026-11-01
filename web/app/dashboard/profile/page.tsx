'use client'

import React, { useState, useRef, useEffect } from 'react'
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
  Shield,
  Clock,
  Flame,
  BarChart3,
  PieChart as PieIcon,
  Smile,
} from 'lucide-react'
import dynamic from 'next/dynamic'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'

// Dynamically import Recharts to avoid SSR mismatches
const ResponsiveContainer = dynamic(() => import('recharts').then((mod) => mod.ResponsiveContainer), { ssr: false })
const BarChart = dynamic(() => import('recharts').then((mod) => mod.BarChart), { ssr: false })
const Bar = dynamic(() => import('recharts').then((mod) => mod.Bar), { ssr: false })
const PieChart = dynamic(() => import('recharts').then((mod) => mod.PieChart), { ssr: false })
const Pie = dynamic(() => import('recharts').then((mod) => mod.Pie), { ssr: false })
const Cell = dynamic(() => import('recharts').then((mod) => mod.Cell), { ssr: false })
const XAxis = dynamic(() => import('recharts').then((mod) => mod.XAxis), { ssr: false })
const YAxis = dynamic(() => import('recharts').then((mod) => mod.YAxis), { ssr: false })
const Tooltip = dynamic(() => import('recharts').then((mod) => mod.Tooltip), { ssr: false })

export default function UserProfilePage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'stats' | 'achievements'>('overview')
  const [name, setName] = useState('Participant')
  const [email, setEmail] = useState('user@neurovoice.org')
  const [role, setRole] = useState('Patient / Participant')
  const [bio, setBio] = useState('Participating in ongoing vocal neurological biomarker research screenings.')
  const [isEditingBio, setIsEditingBio] = useState(false)
  const [isEditingName, setIsEditingName] = useState(false)
  const [photoURL, setPhotoURL] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    try {
      const unsub = onAuthStateChanged(auth, (user) => {
        if (user) {
          if (user.displayName) setName(user.displayName)
          if (user.email) setEmail(user.email)
          if (user.photoURL) setPhotoURL(user.photoURL)
        }
      })
      return () => unsub()
    } catch {
      // ignore
    }
  }, [])

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
    { month: 'Jun', count: 2 },
    { month: 'Jul', count: 3 },
    { month: 'Aug', count: 4 },
    { month: 'Sep', count: 6 },
    { month: 'Oct', count: 8 },
  ]

  const disorderPie = [
    { name: 'Low Concern (Typical)', value: 85, color: '#15803D' },
    { name: 'Moderate (Monitor)', value: 12, color: '#B45309' },
    { name: 'Elevated (Specialist)', value: 3, color: '#B91C1C' },
  ]

  const achievements = [
    { title: 'First Screening ✅', desc: 'Completed your first 30-second acoustic voice analysis.', unlocked: true },
    { title: 'Longitudinal Habit 🔥', desc: 'Maintained steady longitudinal voice tracking sessions.', unlocked: true },
    { title: 'Bilingual Screening 🇮🇳', desc: 'Recorded speech samples in Hindi or regional Indian accents.', unlocked: true },
    { title: 'Consistent Monitor 📈', desc: 'Continuous tracking across 3 consecutive months without missing milestones.', unlocked: true },
    { title: 'Signal Quality Master 🎙️', desc: 'Maintained average recording SNR above 20 dB across multiple sessions.', unlocked: true },
    { title: 'Annual Guardian 🏆', desc: 'Completed full annual neurological wellness surveillance cycle.', unlocked: false },
  ]

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="pb-6 border-b border-[var(--border)]">
        <span className="text-xs font-mono font-semibold text-[var(--accent)] uppercase tracking-wider block mb-1">
          Account & Clinical Portfolio
        </span>
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[var(--text)]">
          My Profile
        </h1>
        <p className="text-xs text-[var(--muted)] mt-1">
          Manage your credentials, bio, longitudinal acoustic statistics, and screening achievements.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT PANEL: PROFILE IDENTITY CARD */}
        <div className="lg:col-span-1 p-6 sm:p-8 rounded-2xl bg-[var(--surface)] border border-[var(--border)] flex flex-col items-center text-center space-y-6 shadow-[var(--shadow-sm)]">
          {/* Avatar with Change Photo Button */}
          <div className="relative group">
            <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-[var(--border)] bg-[var(--surface-2)] flex items-center justify-center shadow-inner">
              {photoURL ? (
                <img src={photoURL} alt={name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-display font-bold text-2xl text-[var(--primary)] bg-[var(--primary)]/10">
                  {name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 p-2 rounded-full bg-[var(--primary)] text-white shadow-md hover:scale-105 transition-transform"
              title="Change profile photo"
            >
              <Camera size={15} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </div>

          {/* Name & Role */}
          <div className="space-y-1 w-full">
            {isEditingName ? (
              <div className="flex items-center gap-2 justify-center">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-clinical text-sm text-center font-bold max-w-[200px]"
                />
                <button
                  onClick={() => setIsEditingName(false)}
                  className="p-1.5 rounded-lg bg-[var(--primary)] text-white"
                >
                  <Check size={14} />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-1.5">
                <h2 className="font-display font-bold text-lg text-[var(--text)]">{name}</h2>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="text-[var(--muted)] hover:text-[var(--primary)] transition-colors"
                >
                  <Edit2 size={13} />
                </button>
              </div>
            )}
            <p className="text-xs text-[var(--muted)] font-mono">{email}</p>
            <div className="inline-block px-3 py-1 rounded-full text-[11px] font-semibold mt-2 bg-[var(--surface-2)] border border-[var(--border)] text-[var(--primary)]">
              {role}
            </div>
          </div>

          {/* Bio Box */}
          <div className="w-full pt-4 border-t border-[var(--border)] text-left space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-[var(--text)]">
              <span>Bio & Notes</span>
              <button
                onClick={() => setIsEditingBio(!isEditingBio)}
                className="text-[var(--primary)] text-[11px] hover:underline"
              >
                {isEditingBio ? 'Save' : 'Edit'}
              </button>
            </div>
            {isEditingBio ? (
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="input-clinical text-xs w-full h-20 resize-none"
              />
            ) : (
              <p className="text-xs text-[var(--muted)] leading-relaxed">{bio}</p>
            )}
          </div>

          {/* Quick Metrics Bar */}
          <div className="w-full grid grid-cols-3 gap-2 pt-4 border-t border-[var(--border)] text-center">
            <div>
              <div className="font-display font-bold text-base text-[var(--text)]">84</div>
              <div className="text-[10px] text-[var(--muted)] uppercase font-mono">Days Joined</div>
            </div>
            <div>
              <div className="font-display font-bold text-base text-[var(--primary)]">23</div>
              <div className="text-[10px] text-[var(--muted)] uppercase font-mono">Total Scans</div>
            </div>
            <div>
              <div className="font-display font-bold text-base text-[var(--accent)]">5</div>
              <div className="text-[10px] text-[var(--muted)] uppercase font-mono">Streak</div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL (2/3): TABS (Overview | Stats | Achievements) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tab Pill Headers */}
          <div className="flex items-center gap-2 border-b border-[var(--border)] pb-px">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-t-xl transition-all border-b-2 ${
                activeTab === 'overview'
                  ? 'border-[var(--primary)] text-[var(--primary)] bg-[var(--surface)]'
                  : 'border-transparent text-[var(--muted)] hover:text-[var(--text)]'
              }`}
            >
              <User size={15} />
              <span>Overview</span>
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`flex items-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-t-xl transition-all border-b-2 ${
                activeTab === 'stats'
                  ? 'border-[var(--primary)] text-[var(--primary)] bg-[var(--surface)]'
                  : 'border-transparent text-[var(--muted)] hover:text-[var(--text)]'
              }`}
            >
              <BarChart3 size={15} />
              <span>Screening Stats</span>
            </button>
            <button
              onClick={() => setActiveTab('achievements')}
              className={`flex items-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-t-xl transition-all border-b-2 ${
                activeTab === 'achievements'
                  ? 'border-[var(--primary)] text-[var(--primary)] bg-[var(--surface)]'
                  : 'border-transparent text-[var(--muted)] hover:text-[var(--text)]'
              }`}
            >
              <Award size={15} />
              <span>Achievements</span>
            </button>
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] space-y-4">
                <h3 className="font-display font-bold text-sm text-[var(--text)]">Clinical Participant Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] space-y-1">
                    <span className="text-[var(--muted)] text-[11px] font-mono">Location</span>
                    <div className="font-semibold text-[var(--text)] flex items-center gap-1.5">
                      <MapPin size={13} className="text-[var(--accent)]" />
                      <span>Madhya Pradesh, India</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] space-y-1">
                    <span className="text-[var(--muted)] text-[11px] font-mono">Primary Language</span>
                    <div className="font-semibold text-[var(--text)] flex items-center gap-1.5">
                      <Languages size={13} className="text-[var(--primary)]" />
                      <span>Hindi & English</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] space-y-1">
                    <span className="text-[var(--muted)] text-[11px] font-mono">Average Audio Quality</span>
                    <div className="font-semibold text-[var(--success)] flex items-center gap-1.5">
                      <Activity size={13} />
                      <span>24.8 dB SNR (Optimal Clarity)</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] space-y-1">
                    <span className="text-[var(--muted)] text-[11px] font-mono">Screening Frequency</span>
                    <div className="font-semibold text-[var(--text)] flex items-center gap-1.5">
                      <Clock size={13} className="text-[var(--muted)]" />
                      <span>Bi-weekly Recommended</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Research Privacy Notice */}
              <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] flex items-start gap-3">
                <Shield size={20} className="shrink-0 text-[var(--accent)] mt-0.5" />
                <div className="text-xs space-y-1">
                  <span className="font-semibold text-[var(--text)]">Privacy By Design Standards</span>
                  <p className="text-[var(--muted)] leading-relaxed">
                    Voice recordings are temporarily processed in memory and discarded immediately after feature extraction.
                    Only anonymized numerical biomarker measurements are retained in your encrypted account.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SCREENING STATS */}
          {activeTab === 'stats' && (
            <div className="space-y-6">
              {/* Monthly Screenings Chart */}
              <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display font-bold text-sm text-[var(--text)]">Monthly Screening Volume</h3>
                    <p className="text-xs text-[var(--muted)]">Total acoustic analyses performed over the past 5 months</p>
                  </div>
                  <span className="text-xs font-mono font-semibold text-[var(--primary)]">Total: 23 Scans</span>
                </div>
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyScreenings}>
                      <XAxis dataKey="month" stroke="var(--muted)" fontSize={11} />
                      <YAxis stroke="var(--muted)" fontSize={11} allowDecimals={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'var(--surface)',
                          borderColor: 'var(--border)',
                          borderRadius: '8px',
                          fontSize: '11px',
                        }}
                      />
                      <Bar dataKey="count" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Result Distribution */}
              <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] space-y-4">
                <h3 className="font-display font-bold text-sm text-[var(--text)]">Acoustic Result Distribution</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <div className="h-44 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={disorderPie}
                          dataKey="value"
                          cx="50%"
                          cy="50%"
                          outerRadius={65}
                          innerRadius={45}
                        >
                          {disorderPie.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2 text-xs">
                    {disorderPie.map((item) => (
                      <div key={item.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-[var(--text)] font-medium">{item.name}</span>
                        </div>
                        <span className="font-mono font-bold text-[var(--muted)]">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ACHIEVEMENTS */}
          {activeTab === 'achievements' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {achievements.map((ach) => (
                <div
                  key={ach.title}
                  className={`p-5 rounded-2xl border transition-all space-y-2 ${
                    ach.unlocked
                      ? 'bg-[var(--surface)] border-[var(--border)] shadow-[var(--shadow-sm)]'
                      : 'bg-[var(--surface-2)]/50 border-[var(--border)] opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-display font-bold text-sm text-[var(--text)]">{ach.title}</h4>
                    {ach.unlocked ? (
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-[var(--success)]/10 text-[var(--success)] border border-[var(--success)]/30">
                        Unlocked
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-[var(--muted)]">In Progress</span>
                    )}
                  </div>
                  <p className="text-xs text-[var(--muted)] leading-relaxed">{ach.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
