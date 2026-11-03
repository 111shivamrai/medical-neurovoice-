'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import {
  User,
  Camera,
  MapPin,
  Languages,
  Activity,
  Calendar,
  CheckCircle2,
  Lock,
  Flame,
  BarChart3,
  PieChart as PieIcon,
  Clock,
  ArrowRight,
  Shield,
  Edit2,
  Check,
  TrendingUp,
} from 'lucide-react'
import dynamic from 'next/dynamic'
import { subscribeToAuth, UserSession } from '@/lib/auth'

// Dynamically import Recharts to avoid SSR mismatches
const ResponsiveContainer = dynamic(
  () => import('recharts').then((mod) => mod.ResponsiveContainer),
  { ssr: false }
)
const BarChart = dynamic(() => import('recharts').then((mod) => mod.BarChart), { ssr: false })
const Bar = dynamic(() => import('recharts').then((mod) => mod.Bar), { ssr: false })
const PieChart = dynamic(() => import('recharts').then((mod) => mod.PieChart), { ssr: false })
const Pie = dynamic(() => import('recharts').then((mod) => mod.Pie), { ssr: false })
const Cell = dynamic(() => import('recharts').then((mod) => mod.Cell), { ssr: false })
const LineChart = dynamic(() => import('recharts').then((mod) => mod.LineChart), { ssr: false })
const Line = dynamic(() => import('recharts').then((mod) => mod.Line), { ssr: false })
const XAxis = dynamic(() => import('recharts').then((mod) => mod.XAxis), { ssr: false })
const YAxis = dynamic(() => import('recharts').then((mod) => mod.YAxis), { ssr: false })
const Tooltip = dynamic(() => import('recharts').then((mod) => mod.Tooltip), { ssr: false })

export default function UserProfilePage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'stats' | 'achievements'>('overview')
  const [user, setUser] = useState<UserSession | null>(null)
  const [name, setName] = useState('Participant')
  const [email, setEmail] = useState('user@neurovoice.org')
  const [gender, setGender] = useState<'Male' | 'Female' | 'Prefer not to say'>('Prefer not to say')
  const [role, setRole] = useState('Patient / Participant')
  const [location, setLocation] = useState('Madhya Pradesh, India')
  const [bio, setBio] = useState('Participating in ongoing vocal neurological biomarker research screenings.')
  const [isEditingBio, setIsEditingBio] = useState(false)
  const [isEditingName, setIsEditingName] = useState(false)
  const [photoURL, setPhotoURL] = useState<string | null>(null)
  const [createdAt, setCreatedAt] = useState<string>(new Date().toISOString())
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Real screening statistics
  const [screenings, setScreenings] = useState<any[]>([])
  const [totalScans, setTotalScans] = useState<number>(0)
  const [streakDays, setStreakDays] = useState<number>(0)
  const [daysJoined, setDaysJoined] = useState<number>(1)

  // Format display name properly — never raw usernames like "shivam456crai"
  const cleanDisplayName = (rawName?: string | null, rawEmail?: string | null) => {
    if (rawName && rawName.trim().length > 1) {
      // If name is an email or looks like a raw username with numbers at the end, clean it
      if (rawName.includes('@')) {
        const prefix = rawName.split('@')[0]
        return prefix.replace(/[0-9_.-]+/g, ' ').trim().replace(/\b\w/g, (c) => c.toUpperCase()) || 'Participant'
      }
      return rawName
    }
    if (rawEmail) {
      const prefix = rawEmail.split('@')[0]
      const cleaned = prefix.replace(/[0-9_.-]+/g, ' ').trim().replace(/\b\w/g, (c) => c.toUpperCase())
      return cleaned || 'Participant'
    }
    return 'Participant'
  }

  useEffect(() => {
    const unsub = subscribeToAuth((session) => {
      if (session) {
        setUser(session)
        const resolvedName = cleanDisplayName(session.displayName, session.email)
        setName(resolvedName)
        if (session.email) setEmail(session.email)
        if (session.photoURL) setPhotoURL(session.photoURL)
        if (session.role) {
          setRole(
            session.role === 'doctor'
              ? 'Clinician / Neurologist'
              : session.role === 'chw'
              ? 'Community Health Worker'
              : 'Patient / Participant'
          )
        }
        if (session.gender) {
          const g = session.gender.toLowerCase()
          if (g.includes('female')) setGender('Female')
          else if (g.includes('male')) setGender('Male')
          else setGender('Prefer not to say')
        }
        if (session.location) setLocation(session.location)
        if (session.createdAt) {
          setCreatedAt(session.createdAt)
          const diffDays = Math.max(1, Math.floor((Date.now() - new Date(session.createdAt).getTime()) / (1000 * 60 * 60 * 24)))
          setDaysJoined(diffDays)
        }

        // Fetch real patient screenings from API
        if (session.uid) {
          fetch(`/api/patient/${encodeURIComponent(session.uid)}`)
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
              if (data) {
                if (data.name && (!session.displayName || session.displayName === 'Participant')) {
                  setName(cleanDisplayName(data.name, session.email))
                }
                if (data.gender) {
                  const g = data.gender.toLowerCase()
                  if (g.includes('female')) setGender('Female')
                  else if (g.includes('male')) setGender('Male')
                }
                if (data.location) setLocation(data.location)
                if (data.bio) setBio(data.bio)
                if (data.createdAt) {
                  setCreatedAt(data.createdAt)
                  const diffDays = Math.max(1, Math.floor((Date.now() - new Date(data.createdAt).getTime()) / (1000 * 60 * 60 * 24)))
                  setDaysJoined(diffDays)
                }
                const sc = data.screenings || []
                setScreenings(sc)
                setTotalScans(sc.length)
                setStreakDays(data.streak || 0)
              }
            })
            .catch(() => {
              // In offline / local mode, load any local user screenings
              try {
                const localSc = JSON.parse(localStorage.getItem(`neurovoice_user_screenings_${session.uid}`) || '[]')
                setScreenings(localSc)
                setTotalScans(localSc.length)
                setStreakDays(localSc.length > 0 ? 1 : 0)
              } catch {
                setScreenings([])
                setTotalScans(0)
                setStreakDays(0)
              }
            })
        }
      } else {
        setTotalScans(0)
        setStreakDays(0)
        setDaysJoined(1)
      }
    })
    return () => unsub()
  }, [])

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const url = ev.target?.result as string
      setPhotoURL(url)
      // Save locally
      if (user?.uid) {
        localStorage.setItem(`neurovoice_avatar_${user.uid}`, url)
      }
    }
    reader.readAsDataURL(file)
  }

  // Calculate Languages Used
  const languagesUsed = () => {
    if (screenings.length === 0) return 'None yet'
    const langs = new Set(screenings.map((s) => (s.language || 'hi').toLowerCase()))
    if (langs.has('hi') && (langs.has('en') || langs.has('en-in'))) return 'Hindi & English'
    if (langs.has('hi')) return 'Hindi'
    if (langs.has('en') || langs.has('en-in')) return 'English'
    return 'Hindi & English'
  }

  // Calculate Last Screening Info
  const latestScreening = screenings[0] || null

  // Calculate 6-month screening distribution for BarChart
  const getMonthlyData = () => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const counts: { [key: string]: number } = {}
    const now = new Date()
    const last6Months = []

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const label = monthNames[d.getMonth()]
      last6Months.push(label)
      counts[label] = 0
    }

    screenings.forEach((s) => {
      const date = new Date(s.timestamp || s.createdAt || Date.now())
      const label = monthNames[date.getMonth()]
      if (counts[label] !== undefined) {
        counts[label] += 1
      }
    })

    return last6Months.map((m) => ({
      month: m,
      scans: counts[m],
    }))
  }

  // Calculate Result Distribution for PieChart
  const getDisorderPieData = () => {
    if (screenings.length === 0) return []
    let lowCount = 0
    let modCount = 0
    let elevCount = 0
    let inconcCount = 0

    screenings.forEach((s) => {
      const verdict = (s.summaryVerdict || '').toLowerCase()
      if (s.isInconclusive) inconcCount++
      else if (verdict.includes('elevated') || verdict.includes('high')) elevCount++
      else if (verdict.includes('moderate')) modCount++
      else lowCount++
    })

    const total = screenings.length
    return [
      { name: 'Low (Typical)', value: Math.round((lowCount / total) * 100) || 0, color: '#166534' },
      { name: 'Moderate (Monitor)', value: Math.round((modCount / total) * 100) || 0, color: '#854D0E' },
      { name: 'Elevated (Priority)', value: Math.round((elevCount / total) * 100) || 0, color: '#9B1C1C' },
      ...(inconcCount > 0
        ? [{ name: 'Inconclusive', value: Math.round((inconcCount / total) * 100) || 0, color: '#4D637E' }]
        : []),
    ].filter((item) => item.value > 0)
  }

  // Calculate Longitudinal Timeline data
  const getTimelineData = () => {
    return screenings
      .slice(0, 10)
      .reverse()
      .map((s, idx) => {
        const bands = s.bands || {}
        const bandToNum = (b?: string) => (b === 'Elevated' ? 2 : b === 'Moderate' ? 1 : 0)
        return {
          session: `Scan ${idx + 1}`,
          Parkinsons: bandToNum(bands.pd?.band),
          Alzheimers: bandToNum(bands.ad?.band),
          Dysarthria: bandToNum(bands.dysarthria?.band),
          PostStroke: bandToNum(bands.postStroke?.band),
        }
      })
  }

  // Dynamic Achievements based on Real Data
  const achievementsList = [
    {
      id: 'ach-first',
      icon: '✅',
      title: 'First Screening',
      desc: 'Completed your first 30-second acoustic voice analysis.',
      unlocked: totalScans >= 1,
      unlockCondition: 'Take your first 30-second voice screening',
    },
    {
      id: 'ach-habit',
      icon: '🔥',
      title: 'Longitudinal Habit',
      desc: 'Maintained steady longitudinal voice tracking sessions.',
      unlocked: totalScans >= 3,
      unlockCondition: 'Complete at least 3 longitudinal screenings',
    },
    {
      id: 'ach-bilingual',
      icon: '🇮🇳',
      title: 'Bilingual Screening',
      desc: 'Recorded speech samples in Hindi or regional Indian accents.',
      unlocked: languagesUsed() === 'Hindi & English',
      unlockCondition: 'Complete recordings in both Hindi and English',
    },
    {
      id: 'ach-consistent',
      icon: '📈',
      title: 'Consistent Monitor',
      desc: 'Continuous tracking across multiple consecutive weeks.',
      unlocked: streakDays >= 3,
      unlockCondition: 'Record voice screenings on 3 consecutive days/weeks',
    },
    {
      id: 'ach-quality',
      icon: '🎙️',
      title: 'Signal Quality Master',
      desc: 'Maintained optimal quiet room clarity without acoustic distortion.',
      unlocked: screenings.some((s) => s.qualityScore >= 80 || s.qualityLabel === 'Good quality'),
      unlockCondition: 'Record in optimal room conditions with high quality',
    },
    {
      id: 'ach-guardian',
      icon: '🏆',
      title: 'Annual Guardian',
      desc: 'Completed a full annual neurological wellness surveillance cycle.',
      unlocked: daysJoined >= 365 && totalScans >= 12,
      unlockCondition: 'Annual Guardian — Complete screenings across 12 months',
    },
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
          Manage your clinical identity, longitudinal acoustic statistics, and screening achievements.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT PANEL: PROFILE IDENTITY CARD */}
        <div className="lg:col-span-1 p-6 sm:p-8 rounded-2xl bg-[var(--surface)] border border-[var(--border)] flex flex-col items-center text-center space-y-6 shadow-[var(--shadow-sm)]">
          {/* Avatar System: Real Photo, Stylized Male SVG, Stylized Female SVG, or Neutral Teal SVG */}
          <div className="relative group">
            <div className="w-[120px] h-[120px] rounded-full overflow-hidden border-2 border-[var(--border)] bg-[var(--surface-2)] flex items-center justify-center shadow-inner">
              {photoURL ? (
                <img src={photoURL} alt={name} className="w-full h-full object-cover" />
              ) : gender === 'Male' ? (
                /* Stylised Male SVG Avatar */
                <svg viewBox="0 0 120 120" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="120" height="120" rx="60" fill="#EAF0FA" />
                  <path d="M42 36C42 26 50 18 60 18C70 18 78 26 78 36V44C78 54 70 62 60 62C50 62 42 54 42 44V36Z" fill="#F8D1B5" />
                  <path d="M38 34C38 23 48 15 60 15C72 15 82 23 82 34C82 36 78 33 75 33C70 33 66 36 60 36C54 36 50 33 45 33C42 33 38 36 38 34Z" fill="#1E293B" />
                  <path d="M28 108C28 86 42 74 60 74C78 74 92 86 92 108H28Z" fill="#1B3FA0" />
                  <path d="M52 74L60 84L68 74H52Z" fill="#F8D1B5" />
                  <path d="M60 84V108" stroke="#163490" strokeWidth="2" />
                </svg>
              ) : gender === 'Female' ? (
                /* Stylised Female SVG Avatar */
                <svg viewBox="0 0 120 120" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="120" height="120" rx="60" fill="#F5F3FF" />
                  <path d="M34 40C34 22 45 15 60 15C75 15 86 22 86 40C86 58 84 76 80 84C76 78 76 68 76 68C76 68 72 70 60 70C48 70 44 68 44 68C44 68 44 78 40 84C36 76 34 58 34 40Z" fill="#1E1B4B" />
                  <path d="M43 38C43 28 50 20 60 20C70 20 77 28 77 38V45C77 54 70 62 60 62C50 62 43 54 43 45V38Z" fill="#F8D1B5" />
                  <path d="M41 33C46 25 54 22 60 22C66 22 74 25 79 33C74 30 67 29 60 29C53 29 46 30 41 33Z" fill="#1E1B4B" />
                  <path d="M28 108C28 86 42 74 60 74C78 74 92 86 92 108H28Z" fill="#7C3AED" />
                  <path d="M50 74C50 82 55 86 60 86C65 86 70 82 70 74H50Z" fill="#F8D1B5" />
                </svg>
              ) : (
                /* Neutral Teal SVG Avatar */
                <svg viewBox="0 0 120 120" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="120" height="120" rx="60" fill="#CCFBF1" />
                  <circle cx="60" cy="44" r="20" fill="#0A7A85" />
                  <path d="M26 108C26 86 41 74 60 74C79 74 94 86 94 108H26Z" fill="#0A7A85" />
                </svg>
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 p-2.5 rounded-full bg-[var(--primary)] text-white shadow-md hover:scale-105 transition-transform"
              title="Upload new profile photo"
              aria-label="Upload photo"
            >
              <Camera size={16} />
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
                  className="p-1 text-[var(--success)]"
                  title="Save name"
                >
                  <Check size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-1.5">
                <h2 className="font-display font-bold text-lg text-[var(--text)]">{name}</h2>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="text-[var(--muted)] hover:text-[var(--text)] p-0.5"
                  title="Edit name"
                >
                  <Edit2 size={13} />
                </button>
              </div>
            )}
            <p className="text-xs text-[var(--muted)] font-mono">{email}</p>
            <div className="pt-2">
              <span className="inline-block text-[11px] font-semibold px-3 py-1 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20">
                {role}
              </span>
            </div>
          </div>

          {/* Clinical Bio */}
          <div className="w-full text-left p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-xs space-y-2">
            <div className="flex items-center justify-between text-[var(--muted)] font-mono text-[11px]">
              <span>Bio & Notes</span>
              <button
                onClick={() => setIsEditingBio(!isEditingBio)}
                className="text-[var(--primary)] hover:underline flex items-center gap-1"
              >
                {isEditingBio ? 'Done' : 'Edit'}
              </button>
            </div>
            {isEditingBio ? (
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full input-clinical text-xs"
              />
            ) : (
              <p className="text-[var(--text)] leading-relaxed">{bio}</p>
            )}
          </div>

          {/* Real Computed Stats Strip: Never fake numbers */}
          <div className="w-full grid grid-cols-3 gap-2 py-4 border-t border-[var(--border)] text-center">
            <div>
              <div className="font-display font-bold text-base text-[var(--text)]">{daysJoined}</div>
              <div className="text-[10px] text-[var(--muted)] uppercase font-mono">Days Joined</div>
            </div>
            <div>
              <div className="font-display font-bold text-base text-[var(--primary)]">{totalScans}</div>
              <div className="text-[10px] text-[var(--muted)] uppercase font-mono">Total Scans</div>
            </div>
            <div>
              <div className="font-display font-bold text-base text-[var(--accent)]">{streakDays}</div>
              <div className="text-[10px] text-[var(--muted)] uppercase font-mono">Streak</div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL (2/3): TABS (Overview → Screening Stats → Achievements) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tab Headers: Exact order Overview → Stats → Achievements */}
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
              <CheckCircle2 size={15} />
              <span>Achievements</span>
            </button>
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] space-y-5">
                <h3 className="font-display font-bold text-sm text-[var(--text)]">Clinical Participant Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] space-y-1">
                    <span className="text-[var(--muted)] text-[11px] font-mono">Member Since</span>
                    <div className="font-semibold text-[var(--text)] flex items-center gap-1.5">
                      <Calendar size={13} className="text-[var(--primary)]" />
                      <span>{new Date(createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] space-y-1">
                    <span className="text-[var(--muted)] text-[11px] font-mono">Total Screenings</span>
                    <div className="font-semibold text-[var(--text)] flex items-center gap-1.5">
                      <Activity size={13} className="text-[var(--accent)]" />
                      <span>{totalScans} completed</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] space-y-1">
                    <span className="text-[var(--muted)] text-[11px] font-mono">Languages Used</span>
                    <div className="font-semibold text-[var(--text)] flex items-center gap-1.5">
                      <Languages size={13} className="text-[var(--primary)]" />
                      <span>{languagesUsed()}</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] space-y-1">
                    <span className="text-[var(--muted)] text-[11px] font-mono">Most Recent Screening</span>
                    <div className="font-semibold text-[var(--text)] flex items-center gap-1.5">
                      <Clock size={13} className="text-[var(--muted)]" />
                      <span>
                        {latestScreening
                          ? `${new Date(latestScreening.timestamp || latestScreening.createdAt).toLocaleDateString()} (${latestScreening.summaryVerdict || 'Low Risk'})`
                          : 'No screening taken yet'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* If 0 Screenings: Prompt to take first screening */}
                {totalScans === 0 && (
                  <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="text-xs">
                      <span className="font-bold text-[var(--text)] block">You haven't taken a screening yet.</span>
                      <p className="text-[var(--muted)] mt-0.5">Take your first 30-second guided screening to establish your acoustic baseline.</p>
                    </div>
                    <Link
                      href="/dashboard/scan"
                      className="btn-primary text-xs py-2 px-4 rounded-xl font-semibold shadow-sm shrink-0"
                    >
                      Take your first screening →
                    </Link>
                  </div>
                )}
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
              {totalScans === 0 ? (
                /* Empty State when user has 0 screenings */
                <div className="p-12 rounded-2xl bg-[var(--surface)] border border-[var(--border)] text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center mx-auto text-[var(--muted)]">
                    <BarChart3 size={28} className="text-[var(--primary)]" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-[var(--text)]">No screening statistics yet</h4>
                    <p className="text-xs text-[var(--muted)] max-w-sm mx-auto leading-relaxed">
                      Complete your first voice screening to generate longitudinal trend charts, condition risk breakdowns, and cadence metrics.
                    </p>
                  </div>
                  <Link
                    href="/dashboard/scan"
                    className="inline-flex btn-primary text-xs py-2 px-5 rounded-xl font-semibold"
                  >
                    Start First Screening →
                  </Link>
                </div>
              ) : (
                /* When Real Data Exists */
                <div className="space-y-6">
                  {/* Row of 4 Stat Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)]">
                      <span className="text-[11px] font-mono text-[var(--muted)] block">Screenings taken</span>
                      <span className="text-xl font-display font-extrabold text-[var(--text)]">{totalScans}</span>
                    </div>
                    <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)]">
                      <span className="text-[11px] font-mono text-[var(--muted)] block">Best streak</span>
                      <span className="text-xl font-display font-extrabold text-[var(--primary)]">{streakDays} days</span>
                    </div>
                    <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)]">
                      <span className="text-[11px] font-mono text-[var(--muted)] block">Avg quality</span>
                      <span className="text-xl font-display font-extrabold text-[var(--success)]">Good</span>
                    </div>
                    <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)]">
                      <span className="text-[11px] font-mono text-[var(--muted)] block">Months active</span>
                      <span className="text-xl font-display font-extrabold text-[var(--accent)]">
                        {Math.max(1, Math.ceil(daysJoined / 30))}
                      </span>
                    </div>
                  </div>

                  {/* Monthly Screenings Bar Chart */}
                  <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-display font-bold text-sm text-[var(--text)]">Screenings per Month</h3>
                        <p className="text-xs text-[var(--muted)]">Last 6 months volume</p>
                      </div>
                      <span className="text-xs font-mono font-semibold text-[var(--primary)]">Total: {totalScans} scans</span>
                    </div>
                    <div className="h-52 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={getMonthlyData()}>
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
                          <Bar dataKey="scans" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Result Distribution Pie Chart */}
                  <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] space-y-4">
                    <h3 className="font-display font-bold text-sm text-[var(--text)]">Result Distribution</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                      <div className="h-44 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={getDisorderPieData()}
                              dataKey="value"
                              cx="50%"
                              cy="50%"
                              outerRadius={65}
                              innerRadius={45}
                            >
                              {getDisorderPieData().map((entry, index) => (
                                <Cell key={`pie-cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="space-y-2 text-xs">
                        {getDisorderPieData().map((item) => (
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

                  {/* Per-Condition Band Over Time Line Chart */}
                  <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] space-y-4">
                    <h3 className="font-display font-bold text-sm text-[var(--text)]">Condition Risk Severity Over Time</h3>
                    <p className="text-xs text-[var(--muted)]">Trend levels across screenings (Low / Moderate / Elevated)</p>
                    <div className="h-52 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={getTimelineData()}>
                          <XAxis dataKey="session" stroke="var(--muted)" fontSize={11} />
                          <YAxis
                            ticks={[0, 1, 2]}
                            tickFormatter={(v) => (v === 0 ? 'Low' : v === 1 ? 'Moderate' : 'Elevated')}
                            stroke="var(--muted)"
                            fontSize={11}
                          />
                          <Tooltip
                            formatter={(val: any) => (val === 0 ? 'Low' : val === 1 ? 'Moderate' : 'Elevated')}
                          />
                          <Line type="monotone" dataKey="Parkinsons" stroke="var(--primary)" strokeWidth={2} dot={{ r: 3 }} />
                          <Line type="monotone" dataKey="Alzheimers" stroke="#7C3AED" strokeWidth={2} dot={{ r: 3 }} />
                          <Line type="monotone" dataKey="Dysarthria" stroke="var(--accent)" strokeWidth={2} dot={{ r: 3 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ACHIEVEMENTS */}
          {activeTab === 'achievements' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {achievementsList.map((ach) => (
                <div
                  key={ach.id}
                  className={`p-5 rounded-2xl border transition-all space-y-2.5 ${
                    ach.unlocked
                      ? 'bg-[var(--surface)] border-[var(--border)] shadow-[var(--shadow-sm)]'
                      : 'bg-[var(--surface-2)]/40 border-[var(--border)] opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{ach.icon}</span>
                      <h4 className="font-display font-bold text-sm text-[var(--text)]">{ach.title}</h4>
                    </div>
                    {ach.unlocked ? (
                      <span className="text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-[var(--success)]/10 text-[var(--success)] border border-[var(--success)]/30">
                        Unlocked
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-[var(--muted)] flex items-center gap-1">
                        <Lock size={11} />
                        Locked
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[var(--muted)] leading-relaxed">{ach.desc}</p>
                  {!ach.unlocked && (
                    <div className="text-[11px] font-mono text-[var(--muted)] pt-1 border-t border-[var(--border)]/40">
                      Condition: {ach.unlockCondition}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
