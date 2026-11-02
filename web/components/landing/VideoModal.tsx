'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Play, Activity, CheckCircle2, Volume2, ShieldCheck, FileText } from 'lucide-react'

interface VideoModalProps {
  isOpen: boolean
  onClose: () => void
}

export function VideoModal({ isOpen, onClose }: VideoModalProps) {
  const [activeTab, setActiveTab] = useState<'hindi' | 'english'>('hindi')
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(65)

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-4xl bg-[#0F172A] border border-[#1E293B] rounded-2xl shadow-[0_0_60px_rgba(99,102,241,0.25)] overflow-hidden z-10 my-8 text-left"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E293B] bg-[#0A0F1E]">
            <div className="flex items-center gap-3">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
              </span>
              <div>
                <h3 className="font-display font-bold text-white text-base sm:text-lg">
                  Clinical Walkthrough: 30-Second Acoustic Analysis
                </h3>
                <p className="text-xs text-gray-400">
                  Demonstration Protocol · NeuroVoice Vocal Neurological Screening
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>

          {/* Interactive Screen Simulation */}
          <div className="p-6 space-y-6">
            {/* Top row controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-[#111827] p-4 rounded-xl border border-[#1F2937]">
              <div className="flex items-center gap-3">
                <span className="text-xs uppercase tracking-wider text-gray-400 font-medium">Sample Language:</span>
                <div className="flex bg-[#0A0F1E] rounded-lg p-1 border border-[#1F2937]">
                  <button
                    onClick={() => setActiveTab('hindi')}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                      activeTab === 'hindi'
                        ? 'bg-[#6366F1] text-white shadow'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    🇮🇳 Hindi (मप्र मानक)
                  </button>
                  <button
                    onClick={() => setActiveTab('english')}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                      activeTab === 'english'
                        ? 'bg-[#6366F1] text-white shadow'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    🌐 English (Clinical)
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded border border-cyan-500/20">
                  Wiener Filter SNR: 28.4 dB
                </span>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
                  Voice Quality: Optimal
                </span>
              </div>
            </div>

            {/* Simulated Audio Spectrum Display */}
            <div className="bg-[#0A0F1E] rounded-xl p-6 border border-[#1F2937] relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Volume2 size={16} className="text-[#22D3EE]" />
                  <span className="text-xs font-mono text-gray-300">
                    {activeTab === 'hindi'
                      ? '"आज मौसम साफ़ है और सुबह की हवा ताज़ा लग रही है।"'
                      : '"The rainbow begins with gentle rain under the morning sunlight."'}
                  </span>
                </div>
                <span className="text-xs font-mono text-indigo-400">
                  {isPlaying ? 'ANALYSING LIVE...' : 'SAMPLE LOADED (30.0s)'}
                </span>
              </div>

              {/* Dynamic waveform bars */}
              <div className="h-28 flex items-end justify-between gap-1 py-2 px-1">
                {Array.from({ length: 48 }).map((_, i) => {
                  const height = isPlaying
                    ? Math.sin(i * 0.4 + Date.now() * 0.005) * 35 + 45
                    : Math.sin(i * 0.3) * 28 + 38
                  const isHigh = height > 50
                  return (
                    <div
                      key={i}
                      className="w-full rounded-t transition-all duration-150"
                      style={{
                        height: `${height}%`,
                        background: isHigh
                          ? 'linear-gradient(to top, #6366F1, #22D3EE)'
                          : 'linear-gradient(to top, #312E81, #6366F1)',
                        opacity: isPlaying ? 0.9 : 0.6,
                      }}
                    />
                  )
                })}
              </div>

              {/* Player control */}
              <div className="mt-4 pt-3 border-t border-[#1F2937] flex items-center justify-between">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#6366F1] hover:bg-[#4F46E5] transition-colors"
                >
                  <Play size={12} fill="currentColor" />
                  {isPlaying ? 'Pause Simulation' : 'Play Acoustic Scan'}
                </button>
                <div className="flex items-center gap-4 text-xs font-mono text-gray-400">
                  <span>Jitter: 0.38% (Normal &lt; 1.04%)</span>
                  <span>Shimmer: 1.82% (Normal &lt; 3.81%)</span>
                  <span>HNR: 22.4 dB</span>
                </div>
              </div>
            </div>

            {/* Diagnostic Output Dashboard Preview */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-[#111827] p-4 rounded-xl border border-emerald-500/20">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-400">Parkinson's Risk</span>
                  <span className="text-xs font-bold text-emerald-400">12%</span>
                </div>
                <div className="w-full bg-[#1F2937] h-1.5 rounded-full overflow-hidden mb-2">
                  <div className="bg-emerald-400 h-full rounded-full" style={{ width: '12%' }} />
                </div>
                <span className="text-[11px] text-emerald-400/90 font-medium flex items-center gap-1">
                  <CheckCircle2 size={12} /> Low Biomarker Deviation
                </span>
              </div>

              <div className="bg-[#111827] p-4 rounded-xl border border-indigo-500/20">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-400">Alzheimer's Score</span>
                  <span className="text-xs font-bold text-indigo-400">18%</span>
                </div>
                <div className="w-full bg-[#1F2937] h-1.5 rounded-full overflow-hidden mb-2">
                  <div className="bg-indigo-400 h-full rounded-full" style={{ width: '18%' }} />
                </div>
                <span className="text-[11px] text-indigo-400/90 font-medium flex items-center gap-1">
                  <CheckCircle2 size={12} /> Fluent Temporal Flow
                </span>
              </div>

              <div className="bg-[#111827] p-4 rounded-xl border border-cyan-500/20">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-400">Dysarthria Index</span>
                  <span className="text-xs font-bold text-cyan-400">9%</span>
                </div>
                <div className="w-full bg-[#1F2937] h-1.5 rounded-full overflow-hidden mb-2">
                  <div className="bg-cyan-400 h-full rounded-full" style={{ width: '9%' }} />
                </div>
                <span className="text-[11px] text-cyan-400/90 font-medium flex items-center gap-1">
                  <CheckCircle2 size={12} /> Articulation Intact
                </span>
              </div>

              <div className="bg-[#111827] p-4 rounded-xl border border-teal-500/20">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-400">Post-Stroke Track</span>
                  <span className="text-xs font-bold text-teal-400">Stable</span>
                </div>
                <div className="w-full bg-[#1F2937] h-1.5 rounded-full overflow-hidden mb-2">
                  <div className="bg-teal-400 h-full rounded-full" style={{ width: '100%' }} />
                </div>
                <span className="text-[11px] text-teal-400/90 font-medium flex items-center gap-1">
                  <CheckCircle2 size={12} /> Baseline Confirmed
                </span>
              </div>
            </div>

            {/* Bottom summary bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-[#1E293B]">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <ShieldCheck size={16} className="text-emerald-400" />
                <span>SHAP Feature Attribution: Pitch Entropy (38%), Formant Dispersion (26%), MFCC-4 (18%)</span>
              </div>
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2 rounded-lg text-xs font-semibold text-white bg-[#6366F1] hover:bg-[#4F46E5] transition-colors"
              >
                Close Walkthrough
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
