'use client'

import React from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts'

export function DashboardCharts() {
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Longitudinal Trend Chart (2 cols) */}
      <div className="lg:col-span-2 p-6 rounded-2xl bg-[#111827] border border-[#1F2937]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-display font-bold text-base text-white">
              5-Month Longitudinal Acoustic Biomarker Trajectory
            </h3>
            <p className="text-xs text-gray-400">
              Continuous monitoring tracks therapy efficacy without hospital readmissions
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded border border-cyan-500/20">
            Monthly Sampling
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={longitudinalData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPark" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorAlz" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22D3EE" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#22D3EE" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="#4B5563" fontSize={11} />
              <YAxis stroke="#4B5563" fontSize={11} domain={[0, 40]} />
              <Tooltip
                contentStyle={{
                  background: '#0F172A',
                  borderColor: '#1E293B',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Area type="monotone" dataKey="parkinsons" stroke="#6366F1" strokeWidth={2} fillOpacity={1} fill="url(#colorPark)" name="Parkinson's Risk" />
              <Area type="monotone" dataKey="alzheimers" stroke="#22D3EE" strokeWidth={2} fillOpacity={1} fill="url(#colorAlz)" name="Alzheimer's Score" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-center gap-6 mt-3 text-xs font-mono text-gray-400">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#6366F1]" />
            <span>Parkinson's (Downward Trend)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#22D3EE]" />
            <span>Alzheimer's Cognitive Score</span>
          </div>
        </div>
      </div>

      {/* SHAP Feature Contribution Radar */}
      <div className="p-6 rounded-2xl bg-[#111827] border border-[#1F2937]">
        <div className="mb-4">
          <h3 className="font-display font-bold text-base text-white">
            SHAP Feature Attribution
          </h3>
          <p className="text-xs text-gray-400">
            Explainability radar vs normative dataset
          </p>
        </div>

        <div className="h-60 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={shapFeatureData}>
              <PolarGrid stroke="#1F2937" />
              <PolarAngleAxis dataKey="feature" stroke="#9CA3AF" fontSize={10} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#374151" fontSize={9} />
              <Radar name="Patient Acoustic Vector" dataKey="value" stroke="#22D3EE" fill="#22D3EE" fillOpacity={0.35} />
              <Radar name="Clinical Norm" dataKey="baseline" stroke="#6366F1" fill="#6366F1" fillOpacity={0.15} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="text-[11px] text-center text-gray-400 mt-2 font-mono">
          Cyan = Patient Actual · Violet = Normal Benchmark
        </div>
      </div>
    </div>
  )
}
