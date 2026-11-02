'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ShieldCheck,
  Users,
  Activity,
  Calendar,
  Download,
  AlertCircle,
  Eye,
  ArrowLeft,
  PieChart as PieIcon,
  TrendingUp,
} from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'
import dynamic from 'next/dynamic'

// Recharts components
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

export default function AdminPanelPage() {
  const router = useRouter()
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  // Role Gate check simulation (role=admin allowed)
  const [isAdmin, setIsAdmin] = useState(true)

  const disorderDistribution = [
    { name: "Parkinson's (PD)", value: 42, color: '#6366F1' },
    { name: "Alzheimer's (AD)", value: 30, color: '#8B5CF6' },
    { name: 'Dysarthria', value: 16, color: '#22D3EE' },
    { name: 'Post-Stroke Recovery', value: 12, color: '#14B8A6' },
  ]

  const weeklyScreenings = [
    { week: 'W1', count: 48 }, { week: 'W2', count: 62 }, { week: 'W3', count: 54 },
    { week: 'W4', count: 78 }, { week: 'W5', count: 91 }, { week: 'W6', count: 85 },
    { week: 'W7', count: 110 }, { week: 'W8', count: 125 }, { week: 'W9', count: 140 },
    { week: 'W10', count: 162 }, { week: 'W11', count: 175 }, { week: 'W12', count: 198 },
  ]

  const monthlySignups = [
    { month: 'May', users: 80 }, { month: 'Jun', users: 135 }, { month: 'Jul', users: 190 },
    { month: 'Aug', users: 260 }, { month: 'Sep', users: 340 }, { month: 'Oct', users: 430 },
  ]

  const usersList = [
    { name: 'Dr. V. K. Soni', email: 'vksoni@jmc.ac.in', role: 'Doctor (Neurology)', screenings: 182, lastActive: '10m ago' },
    { name: 'Dr. Priya Sharma', email: 'psharma@jmc.ac.in', role: 'Doctor (Neurology)', screenings: 144, lastActive: '1h ago' },
    { name: 'Sunita Bai', email: 'sunita.asha@sehora.mp.gov.in', role: 'ASHA Worker', screenings: 89, lastActive: '2h ago' },
    { name: 'Rameshwar Patel', email: 'rameshwar.p@gmail.com', role: 'Personal', screenings: 4, lastActive: '3d ago' },
    { name: 'Amit Verma', email: 'amit.verma@pg.jmc.ac.in', role: 'Medical Student', screenings: 38, lastActive: '1d ago' },
  ]

  const handleExportCSV = () => {
    // Calls FastAPI DPDP-compliant export route or browser fallback
    window.open('http://localhost:8000/api/admin/export', '_blank')
  }

  return (
    <div className="min-h-screen bg-[#0A0F1E] text-white p-6 sm:p-10 font-sans space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#1F2937]">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="p-2 rounded-xl bg-[#111827] border border-[#1F2937] text-gray-400 hover:text-white"
            title="Back to Dashboard"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-red-500/15 text-red-400 border border-red-500/30">
                ROLE-GATED (ADMIN ONLY)
              </span>
              <span className="text-xs font-mono text-gray-400">NeuroVoice Regional Node</span>
            </div>
            <h1 className="font-display font-extrabold text-3xl text-white mt-1">
              Admin Surveillance Control Centre
            </h1>
          </div>
        </div>

        {/* DPDP Compliant Anonymised CSV Export */}
        <button
          onClick={handleExportCSV}
          className="py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold flex items-center gap-2 shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all hover:scale-105"
        >
          <Download size={16} />
          <span>Export Anonymised CSV (DPDP Compliant)</span>
        </button>
      </div>

      {/* STATS BAR (4 Stats) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-2xl bg-[#111827] border border-[#1F2937]">
          <span className="text-xs font-mono text-gray-400 block mb-1">Total Users</span>
          <div className="text-3xl font-display font-black text-white">1,428</div>
          <span className="text-[11px] font-mono text-emerald-400 font-bold">+18% this month</span>
        </div>

        <div className="p-6 rounded-2xl bg-[#111827] border border-[#1F2937]">
          <span className="text-xs font-mono text-gray-400 block mb-1">Total Screenings</span>
          <div className="text-3xl font-display font-black text-[#22D3EE]">3,892</div>
          <span className="text-[11px] font-mono text-cyan-400 font-bold">12 Central MP Districts</span>
        </div>

        <div className="p-6 rounded-2xl bg-[#111827] border border-[#1F2937]">
          <span className="text-xs font-mono text-gray-400 block mb-1">Screenings This Week</span>
          <div className="text-3xl font-display font-black text-indigo-400">198</div>
          <span className="text-[11px] font-mono text-indigo-300 font-bold">99.4% Audio SNR valid</span>
        </div>

        <div className="p-6 rounded-2xl bg-[#111827] border border-[#1F2937]">
          <span className="text-xs font-mono text-gray-400 block mb-1">Most Common Disorder Flagged</span>
          <div className="text-2xl font-display font-black text-amber-400">Parkinson's (PD)</div>
          <span className="text-[11px] font-mono text-amber-300">42% of flagged screenings</span>
        </div>
      </div>

      {/* CHARTS GRID (Pie + Bar + Line) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie: Disorder Distribution */}
        <div className="p-6 rounded-2xl bg-[#111827] border border-[#1F2937]">
          <h3 className="font-display font-bold text-base text-white mb-1">Disorder Distribution</h3>
          <p className="text-xs text-gray-400 mb-4">Proportion across central MP clinics</p>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={disorderDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                  {disorderDistribution.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#0F172A', borderColor: '#1F2937', fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar: Screenings per week (last 12 weeks) */}
        <div className="p-6 rounded-2xl bg-[#111827] border border-[#1F2937]">
          <h3 className="font-display font-bold text-base text-white mb-1">Screenings / Week</h3>
          <p className="text-xs text-gray-400 mb-4">Weekly volume over last 12 weeks</p>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyScreenings}>
                <XAxis dataKey="week" stroke="#4B5563" fontSize={10} />
                <YAxis stroke="#4B5563" fontSize={10} />
                <Tooltip contentStyle={{ background: '#0F172A', borderColor: '#1F2937', fontSize: '11px' }} />
                <Bar dataKey="count" fill="#22D3EE" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Line: New user signups */}
        <div className="p-6 rounded-2xl bg-[#111827] border border-[#1F2937]">
          <h3 className="font-display font-bold text-base text-white mb-1">New User Signups</h3>
          <p className="text-xs text-gray-400 mb-4">Physician & ASHA registrations</p>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlySignups}>
                <XAxis dataKey="month" stroke="#4B5563" fontSize={10} />
                <YAxis stroke="#4B5563" fontSize={10} />
                <Tooltip contentStyle={{ background: '#0F172A', borderColor: '#1F2937', fontSize: '11px' }} />
                <Line type="monotone" dataKey="users" stroke="#10B981" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* USER MANAGEMENT TABLE */}
      <div className="p-6 rounded-2xl bg-[#111827] border border-[#1F2937] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-lg text-white">Registered User Directory</h3>
            <p className="text-xs text-gray-400">Institutional clinicians, students, and community health workers</p>
          </div>
          <span className="text-xs font-mono text-cyan-400">5 Active Profiles Displayed</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#1F2937] text-gray-400">
                <th className="py-3 px-3">Name</th>
                <th className="py-3 px-3">Email</th>
                <th className="py-3 px-3">Role</th>
                <th className="py-3 px-3">Screenings</th>
                <th className="py-3 px-3">Last Active</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F2937]">
              {usersList.map((u) => (
                <tr key={u.email} className="hover:bg-white/5">
                  <td className="py-3.5 px-3 font-semibold text-white">{u.name}</td>
                  <td className="py-3.5 px-3 text-gray-400">{u.email}</td>
                  <td className="py-3.5 px-3 text-indigo-400 font-bold">{u.role}</td>
                  <td className="py-3.5 px-3 text-white font-bold">{u.screenings}</td>
                  <td className="py-3.5 px-3 text-gray-400">{u.lastActive}</td>
                  <td className="py-3.5 px-3 text-right">
                    <button
                      onClick={() => alert(`User ID UHID details: ${u.name}`)}
                      className="py-1 px-3 rounded-lg bg-[#0A0F1E] border border-[#1F2937] text-gray-300 hover:text-white"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
