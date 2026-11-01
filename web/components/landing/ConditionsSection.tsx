'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Activity, Brain, Volume2, Sparkles } from 'lucide-react'

type HotspotId = 'brain' | 'larynx' | 'articulators' | null

export function ConditionsSection() {
  const [activeHotspot, setActiveHotspot] = useState<HotspotId>(null)

  const conditions = [
    {
      id: 'pd',
      name: "Parkinson's Disease (PD)",
      hotspot: 'brain',
      accent: 'var(--primary)',
      badge: 'Motor Speech Degradation',
      voiceChanges: 'Vocal cord tremor, reduced vocal loudness (hypophonia), and pitch monotony.',
      keyBiomarkers: ['Jitter (local > 1.04%)', 'Shimmer (local > 3.81%)', 'HNR (< 20 dB)', 'RPDE Entropy'],
      cautiousNote: 'Commonly associated with basal ganglia dopamine depletion affecting laryngeal motor coordination.',
    },
    {
      id: 'ad',
      name: "Alzheimer's Disease (AD)",
      hotspot: 'brain',
      accent: '#8B5CF6',
      badge: 'Cognitive-Acoustic Cadence',
      voiceChanges: 'Hesitation pauses, slower speech rate, and acoustic pitch flattening during word retrieval.',
      keyBiomarkers: ['Pause Time Ratio (> 0.28)', 'Speech Rate (< 3.5 sps)', 'Pitch Variance (F0 SD)', 'Spectral Centroid'],
      cautiousNote: 'Commonly associated with temporoparietal acoustic processing and semantic lexical retrieval hesitation.',
    },
    {
      id: 'dysarthria',
      name: 'Dysarthria',
      hotspot: 'articulators',
      accent: 'var(--accent)',
      badge: 'Neuromuscular Articulation',
      voiceChanges: 'Slurred consonants, imprecise vowel articulation, and breathy or strained vocal delivery.',
      keyBiomarkers: ['Formant Centralization (F1/F2 ratio)', 'Zero-Crossing Instability', 'Vowel Space Area', 'Shimmer APQ5'],
      cautiousNote: 'Commonly associated with neuromuscular weakness affecting articulatory precision of tongue and lips.',
    },
    {
      id: 'postStroke',
      name: 'Post-Stroke Cognitive Impairment',
      hotspot: 'larynx',
      accent: 'var(--success)',
      badge: 'Acoustic Stroke Recovery',
      voiceChanges: 'Prosodic disruption, phrase fragmentation, and asymmetry in sustained phonation.',
      keyBiomarkers: ['PPE (Pitch Period Entropy)', 'Harmonic Energy Loss', 'Sustained Phonation Duration', 'Spectral Tilt'],
      cautiousNote: 'Commonly associated with focal cortical or subcortical ischemia altering speech motor sequencing.',
    },
  ]

  return (
    <section id="conditions" className="py-24 px-4 sm:px-6 lg:px-8 bg-[var(--bg)] transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-4 bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20">
            Acoustic Neurological Profiling
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-[var(--text)] tracking-tight mb-4">
            The 4 Tracked Conditions
          </h2>
          <p className="text-base sm:text-lg text-[var(--text-muted)] leading-relaxed">
            Neurological disorders manifest through distinct vocal tract subsystems: cortical control, laryngeal phonation, and articulatory precision.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Anatomical Line-Art Head & Neck with 3 Glowing Hotspots */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] flex flex-col items-center">
            <div className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)] mb-4 text-center">
              Anatomical Hotspots (Tap to inspect)
            </div>

            <div className="relative w-[280px] h-[340px]">
              {/* Clean Line-Art SVG of Head and Neck */}
              <svg
                viewBox="0 0 280 340"
                className="w-full h-full stroke-[var(--text-muted)] fill-none"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* Cranium / Head contour */}
                <path d="M70,160 C65,100 90,40 150,40 C210,40 235,95 235,160 C235,200 220,230 205,245 C200,250 185,255 175,260 L175,320 M85,250 L85,320" />
                {/* Nose / Brow / Jaw profile */}
                <path d="M70,160 C70,180 65,190 60,195 L72,205 C75,225 85,245 105,255 L140,260" />
                {/* Ear outline */}
                <path d="M190,165 C195,155 205,155 205,170 C205,185 195,195 188,192" />
                {/* Cervical spine / Neck line */}
                <path d="M175,260 C175,280 180,310 190,330 M85,250 C80,275 75,305 65,330" opacity="0.4" />
                {/* Internal vocal tract guideline */}
                <path d="M100,215 Q145,220 150,250 Q152,275 145,310" strokeDasharray="3 3" opacity="0.3" stroke="var(--accent)" />
              </svg>

              {/* HOTSPOT 1: Brain (Basal Ganglia & Cortex) */}
              <button
                type="button"
                onClick={() => setActiveHotspot(activeHotspot === 'brain' ? null : 'brain')}
                className={`absolute top-[80px] left-[135px] -translate-x-1/2 -translate-y-1/2 p-2 rounded-full transition-all group ${
                  activeHotspot === 'brain' ? 'scale-125' : 'hover:scale-110'
                }`}
                title="Cortex & Basal Ganglia"
              >
                <span className="relative flex h-6 w-6">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--primary)] opacity-75" />
                  <span className="relative inline-flex rounded-full h-6 w-6 bg-[var(--primary)] items-center justify-center text-white text-[10px] font-bold shadow-lg shadow-[var(--primary)]/50">
                    1
                  </span>
                </span>
                <span className="absolute left-8 top-1 whitespace-nowrap text-xs font-semibold px-2 py-0.5 rounded bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] opacity-0 group-hover:opacity-100 transition-opacity">
                  Brain (PD & AD)
                </span>
              </button>

              {/* HOTSPOT 2: Larynx & Vocal Folds */}
              <button
                type="button"
                onClick={() => setActiveHotspot(activeHotspot === 'larynx' ? null : 'larynx')}
                className={`absolute top-[250px] left-[145px] -translate-x-1/2 -translate-y-1/2 p-2 rounded-full transition-all group ${
                  activeHotspot === 'larynx' ? 'scale-125' : 'hover:scale-110'
                }`}
                title="Laryngeal Phonation"
              >
                <span className="relative flex h-6 w-6">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--success)] opacity-75" />
                  <span className="relative inline-flex rounded-full h-6 w-6 bg-[var(--success)] items-center justify-center text-white text-[10px] font-bold shadow-lg shadow-[var(--success)]/50">
                    2
                  </span>
                </span>
                <span className="absolute left-8 top-1 whitespace-nowrap text-xs font-semibold px-2 py-0.5 rounded bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] opacity-0 group-hover:opacity-100 transition-opacity">
                  Larynx (Phonation & Stroke)
                </span>
              </button>

              {/* HOTSPOT 3: Articulators (Tongue, Lips, Velum) */}
              <button
                type="button"
                onClick={() => setActiveHotspot(activeHotspot === 'articulators' ? null : 'articulators')}
                className={`absolute top-[195px] left-[100px] -translate-x-1/2 -translate-y-1/2 p-2 rounded-full transition-all group ${
                  activeHotspot === 'articulators' ? 'scale-125' : 'hover:scale-110'
                }`}
                title="Oral Articulators"
              >
                <span className="relative flex h-6 w-6">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75" />
                  <span className="relative inline-flex rounded-full h-6 w-6 bg-[var(--accent)] items-center justify-center text-white text-[10px] font-bold shadow-lg shadow-[var(--accent)]/50">
                    3
                  </span>
                </span>
                <span className="absolute -left-24 top-1 whitespace-nowrap text-xs font-semibold px-2 py-0.5 rounded bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] opacity-0 group-hover:opacity-100 transition-opacity">
                  Articulators (Dysarthria)
                </span>
              </button>
            </div>

            {/* Hotspot legend */}
            <div className="flex flex-wrap justify-center gap-2 mt-4 text-xs">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--primary)]/10 text-[var(--primary)]">
                <span className="w-2 h-2 rounded-full bg-[var(--primary)]" /> 1. Cortex / Basal Ganglia
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--success)]/10 text-[var(--success)]">
                <span className="w-2 h-2 rounded-full bg-[var(--success)]" /> 2. Laryngeal Cord
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--accent)]/10 text-[var(--accent)]">
                <span className="w-2 h-2 rounded-full bg-[var(--accent)]" /> 3. Tongue / Lips
              </span>
            </div>
          </div>

          {/* Right Column: 2x2 Bento Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {conditions.map((cond) => {
              const isHighlighted = activeHotspot === cond.hotspot
              return (
                <div
                  key={cond.id}
                  className={`p-6 rounded-2xl bg-[var(--surface)] border transition-all duration-300 ${
                    isHighlighted
                      ? 'border-[var(--accent)] shadow-lg shadow-[var(--accent)]/15 scale-[1.02]'
                      : 'border-[var(--border)] hover:border-[var(--text-muted)]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[var(--surface-2)] text-[var(--text-muted)]">
                      {cond.badge}
                    </span>
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cond.accent }} />
                  </div>

                  <h3 className="text-base font-bold text-[var(--text)] mb-2 font-display">
                    {cond.name}
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-4">
                    {cond.voiceChanges}
                  </p>

                  <div className="mb-4">
                    <span className="text-[11px] font-mono text-[var(--accent)] block mb-1">
                      Target Biomarkers:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {cond.keyBiomarkers.map((b) => (
                        <span
                          key={b}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--bg)] border border-[var(--border)] text-[var(--text)]"
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[var(--border)] text-[11px] italic text-[var(--text-muted)]">
                    {cond.cautiousNote}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
