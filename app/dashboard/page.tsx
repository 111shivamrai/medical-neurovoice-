'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Mic,
  Activity,
  FileText,
  User,
  Settings,
  Bell,
  Search,
  Download,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  Brain,
  Play,
  RotateCcw,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react'
import { Logo } from '@/components/Logo'
import { useTheme } from '@/components/ThemeProvider'
import dynamic from 'next/dynamic'

const DashboardCharts = dynamic(
  () => import('@/components/dashboard/DashboardCharts').then((mod) => mod.DashboardCharts),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 rounded-2xl bg-[#111827] border border-[#1F2937] flex items-center justify-center text-xs font-mono text-gray-500 animate-pulse mb-8">
        Loading Diagnostic Charts...
      </div>
    ),
  }
)

export default function DashboardPage() {
  const { theme, toggleTheme } = useTheme()
  const [selectedPatient, setSelectedPatient] = useState('P-10492 (Rameshwar Patel)')
  const [activeTab, setActiveTab] = useState<'overview' | 'screening' | 'patients' | 'reports'>('overview')

  // Sample data for charts
  const longitudinalData = [
    { month: 'Jun', parkinsons: 18, alzheimers: 22, dysarthria: 14, postStroke: 10 },
    { month: 'Jul', parkinsons: 17, alzheimers: 20, dysarthria: 13, postStroke: 10 },
    { month: 'Aug', parkinsons: 15, alzheimers: 19, dysarthria: 12, postStroke: 9 },
    { month: 'Sep', parkinsons: 14, alzheimers: 18, dysarthria: 11, postStroke: 9 },
    { month: 'Oct', parkinsons: 12, alzheimers: 18, dysarthria: 9, postStroke: 8 },
  ]

  const shapFeatureData = [
    { feature: 'Pitch Jitter', value: 84, baseline: 30 },
    { feature: 'Shimmer APQ', value: 68, baseline: 35 },
    { feature: 'F0 Entropy', value: 42, baseline: 40 },
    { feature: 'HNR Ratio', value: 91, baseline: 45 },
    { feature: 'MFCC-4 Slope', value: 72, baseline: 50 },
    { feature: 'Pause Ratio', value: 55, baseline: 35 },
  ]

  return (
    <div className="min-h-screen bg-[#0A0F1E] text-white flex flex-col">
      {/* Top Navigation */}
      <header className="h-16 px-6 border-b border-[#1F2937] bg-[#0E1526] flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Logo size="sm" />
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0A0F1E] border border-[#1F2937] text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-gray-300 font-mono">OPD 4 - Tele-Neurology Cell, Jabalpur Medical College</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search patient UHID..."
              className="pl-8 pr-3 py-1.5 rounded-lg bg-[#111827] border border-[#1F2937] text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#6366F1]"
            />
          </div>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-[#111827] border border-[#1F2937] text-gray-400 hover:text-white"
            aria-label="Toggle theme"
          >
            <Sparkles size={16} />
          </button>

          <button className="p-2 rounded-lg bg-[#111827] border border-[#1F2937] text-gray-400 hover:text-white relative">
            <Bell size={16} />
            <span className="w-2 h-2 rounded-full bg-cyan-400 absolute top-1.5 right-1.5" />
          </button>

          <div className="flex items-center gap-2 pl-3 border-l border-[#1F2937]">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-xs text-white">
              DR
            </div>
            <div className="hidden sm:block text-left text-xs">
              <div className="font-semibold text-white">Dr. Priya Sharma</div>
              <div className="text-[10px] text-gray-400 font-mono">Assoc. Neurologist</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-64 border-r border-[#1F2937] bg-[#0E1526] p-4 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="space-y-1">
              {[
                { id: 'overview', label: 'Screening Dashboard', icon: Activity },
                { id: 'screening', label: 'Live Voice Test', icon: Mic },
                { id: 'patients', label: 'Patient Directory', icon: User },
                { id: 'reports', label: 'Clinical PDF Reports', icon: FileText },
              ].map((item) => {
                const Icon = item.icon
                const isActive = activeTab === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-[#6366F1] text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Quick Action Start Screening */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500/15 to-cyan-500/15 border border-indigo-500/30 text-left">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold mb-1">
                <Mic size={14} />
                <span>Quick Voice Scan</span>
              </div>
              <p className="text-[11px] text-gray-400 mb-3 leading-relaxed">
                Record 30-second patient voice for immediate 4-condition risk profile.
              </p>
              <Link
                href="/onboarding"
                className="w-full py-2 px-3 rounded-lg bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Launch Scanner</span>
                <ArrowUpRight size={13} />
              </Link>
            </div>
          </div>

          <div className="pt-4 border-t border-[#1F2937] text-[11px] font-mono text-gray-500">
            <div>JMC Portal v2.4</div>
            <div className="text-gray-400">Jabalpur Medical College</div>
          </div>
        </aside>

        {/* Content Body */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
          {/* Top Status Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest block mb-1">
                PATIENT RECORD · UHID #JMC-2026-8812
              </span>
              <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
                Rameshwar Patel, 64 yrs (M)
              </h1>
              <p className="text-xs text-gray-400 mt-1">
                Last Screened: 31 Oct 2026 · Referral Source: ASHA Sehora Camp, Jabalpur Rural
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => alert('Exporting signed PDF report to EMR...')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#111827] border border-[#1F2937] text-white hover:bg-[#1F2937] transition-all"
              >
                <Download size={14} />
                <span>Export Clinical PDF</span>
              </button>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#6366F1] hover:bg-[#4F46E5] text-white transition-all shadow-[0_0_25px_rgba(99,102,241,0.4)]"
              >
                <span>Return to Home</span>
              </Link>
            </div>
          </div>

          {/* 4 Risk Status Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Parkinson's Card */}
            <div className="p-5 rounded-2xl bg-[#111827] border border-emerald-500/30 shadow-[0_0_25px_rgba(16,185,129,0.06)]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-gray-400">Parkinson's Risk</span>
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  LOW (12%)
                </span>
              </div>
              <div className="text-2xl font-display font-extrabold text-white mb-2">12 / 100</div>
              <div className="w-full bg-[#1F2937] h-1.5 rounded-full overflow-hidden mb-3">
                <div className="bg-emerald-400 h-full rounded-full" style={{ width: '12%' }} />
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                <TrendingDown size={13} className="text-emerald-400" />
                <span>-3% improvement vs last month</span>
              </div>
            </div>

            {/* Alzheimer's Card */}
            <div className="p-5 rounded-2xl bg-[#111827] border border-indigo-500/30 shadow-[0_0_25px_rgba(99,102,241,0.06)]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-gray-400">Alzheimer's Score</span>
                <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                  LOW (18%)
                </span>
              </div>
              <div className="text-2xl font-display font-extrabold text-white mb-2">18 / 100</div>
              <div className="w-full bg-[#1F2937] h-1.5 rounded-full overflow-hidden mb-3">
                <div className="bg-indigo-400 h-full rounded-full" style={{ width: '18%' }} />
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                <CheckCircle2 size={13} className="text-indigo-400" />
                <span>Stable linguistic pause ratio</span>
              </div>
            </div>

            {/* Dysarthria Card */}
            <div className="p-5 rounded-2xl bg-[#111827] border border-cyan-500/30 shadow-[0_0_25px_rgba(34,211,238,0.06)]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-gray-400">Dysarthria Index</span>
                <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                  OPTIMAL (9%)
                </span>
              </div>
              <div className="text-2xl font-display font-extrabold text-white mb-2">09 / 100</div>
              <div className="w-full bg-[#1F2937] h-1.5 rounded-full overflow-hidden mb-3">
                <div className="bg-cyan-400 h-full rounded-full" style={{ width: '9%' }} />
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                <CheckCircle2 size={13} className="text-cyan-400" />
                <span>Sharp phoneme articulation</span>
              </div>
            </div>

            {/* Post-Stroke Recovery Card */}
            <div className="p-5 rounded-2xl bg-[#111827] border border-teal-500/30 shadow-[0_0_25px_rgba(20,184,166,0.06)]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-gray-400">Post-Stroke Track</span>
                <span className="text-xs font-mono font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                  RECOVERY NORMAL
                </span>
              </div>
              <div className="text-2xl font-display font-extrabold text-white mb-2">08 / 100</div>
              <div className="w-full bg-[#1F2937] h-1.5 rounded-full overflow-hidden mb-3">
                <div className="bg-teal-400 h-full rounded-full" style={{ width: '8%' }} />
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                <TrendingDown size={13} className="text-teal-400" />
                <span>Zero cognitive regression</span>
              </div>
            </div>
          </div>

          {/* Diagnostic Charts */}
          <DashboardCharts />

          {/* Clinical Doctor Referral Advisory */}
          <div className="p-6 rounded-2xl bg-[#111827] border border-[#1F2937] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <CheckCircle2 size={16} />
                <span>Screening Verdict: Low Neurological Risk Identified</span>
              </div>
              <h4 className="font-display font-bold text-white text-lg">
                No immediate tertiary neurological referral required.
              </h4>
              <p className="text-xs text-gray-400 max-w-2xl leading-relaxed">
                Biomarker perturbation is within 1.2 standard deviations of healthy normative controls.
                Recommend routine 6-month follow-up at the Sehora ASHA health post or local PHC.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                onClick={() => alert('Referral registered to Jabalpur Medical College OPD schedule.')}
                className="w-full md:w-auto px-5 py-3 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-semibold whitespace-nowrap shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-colors"
              >
                Log In Hospital EMR
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
