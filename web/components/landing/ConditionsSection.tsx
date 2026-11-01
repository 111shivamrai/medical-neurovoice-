'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Activity, Brain, Volume2, Sparkles, Info, ShieldCheck } from 'lucide-react'

type HotspotId = 'brain' | 'larynx' | 'articulators' | null

export function ConditionsSection() {
  const [activeHotspot, setActiveHotspot] = useState<HotspotId>(null)

  const hotspotDetails = {
    brain: {
      title: '1. Brain & Central Motor Cortex',
      plainText:
        'Coordinates speech timing, lexical recall, and laryngeal rhythm. Dopamine depletion or cortical atrophy alters speech tempo and micro-stability.',
      conditions: "Parkinson's Disease & Alzheimer's Disease",
      subsystem: 'Central Motor Planning & Neuromuscular Signaling',
    },
    larynx: {
      title: '2. Larynx & Vocal Folds (The Voice Box)',
      plainText:
        'Vocal cords vibrate hundreds of times per second. Asymmetry or incomplete adduction results in breathiness, hoarseness, and pitch irregularity.',
      conditions: 'Post-Stroke Impairment & Vocal Glottal Dysphonia',
      subsystem: 'Subglottic Pressure & Phonation Mechanics',
    },
    articulators: {
      title: '3. Oral Articulators (Tongue, Lips & Palate)',
      plainText:
        'Over 100 fine muscles shape acoustic sound waves into intelligible consonants and vowels. Weakness causes slurred consonants and distorted vowel formant triangles.',
      conditions: 'Dysarthria & Cerebellar Motor Speech Disorder',
      subsystem: 'Articulatory Kinematics & Resonant Cavities',
    },
  }

  const conditions = [
    {
      id: 'pd',
      name: "Parkinson's Disease (PD)",
      hotspot: 'brain',
      badge: 'Motor Speech Subsystem',
      voiceChanges: 'Vocal cord micro-tremor, reduced vocal loudness (hypophonia), and pitch monotony.',
      keyBiomarkers: ['Jitter (pitch instability)', 'Shimmer (loudness variation)', 'HNR (< 20 dB)', 'RPDE Chaos'],
      plainSummary: 'Subtle muscle rigidity alters voice box stability months before hand tremors occur.',
    },
    {
      id: 'ad',
      name: "Alzheimer's Disease (AD)",
      hotspot: 'brain',
      badge: 'Cognitive-Acoustic Rhythm',
      voiceChanges: 'Hesitation pauses, slower speech tempo, and flat pitch during lexical retrieval.',
      keyBiomarkers: ['Pause Time Ratio (> 0.28)', 'Speech Cadence (< 3.5 syl/s)', 'Pitch Variance', 'Spectral Centroid'],
      plainSummary: 'Micro-delays in sentence construction manifest as distinct acoustic pause signatures.',
    },
    {
      id: 'dysarthria',
      name: 'Dysarthria',
      hotspot: 'articulators',
      badge: 'Neuromuscular Articulation',
      voiceChanges: 'Slurred consonants, imprecise vowel articulation, and breathy or strained delivery.',
      keyBiomarkers: ['Formant Centralization (F1/F2 ratio)', 'Zero-Crossing Variance', 'Vowel Space Area', 'Shimmer APQ5'],
      plainSummary: 'Weakened tongue and lip muscles fail to reach full phonetic resonance positions.',
    },
    {
      id: 'postStroke',
      name: 'Post-Stroke Cognitive Impairment',
      hotspot: 'larynx',
      badge: 'Acoustic Stroke Recovery',
      voiceChanges: 'Prosodic disruption, phrase fragmentation, and asymmetry in sustained phonation.',
      keyBiomarkers: ['PPE (Pitch Period Entropy)', 'Harmonic Energy Loss', 'Sustained Phonation Duration', 'Spectral Tilt'],
      plainSummary: 'Focal neurological injury leaves detectable markers in breathing and phrase cadence.',
    },
  ]

  return (
    <section id="conditions" className="py-20 px-4 sm:px-6 lg:px-8 bg-[var(--bg)] transition-colors duration-200">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-mono font-semibold tracking-wider uppercase text-[var(--accent)]">
            Physiological Vocal Subsystems
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-[var(--text)] tracking-tight">
            The 4 Screened Conditions
          </h2>
          <p className="text-sm sm:text-base text-[var(--muted)] leading-relaxed">
            Neurological disorders manifest through distinct anatomical pathways: cortical motor control, laryngeal phonation, and articulatory precision.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Anatomical Head & Neck Cross-Section SVG with 3 Hotspots */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] flex flex-col items-center">
            <div className="w-full flex items-center justify-between pb-3 border-b border-[var(--border)] mb-4 text-xs font-mono text-[var(--muted)]">
              <span>Sagittal Anatomical System</span>
              <Link href="/licenses" className="text-[var(--primary)] hover:underline">
                Vector CC-BY 4.0
              </Link>
            </div>

            {/* Realistic Detailed Vector Graphic */}
            <div className="relative w-[280px] h-[340px]">
              <svg
                viewBox="0 0 280 340"
                className="w-full h-full fill-none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Cranium and Head Silhouette */}
                <path
                  d="M75 145 C68 95 95 38 152 38 C215 38 238 90 238 155 C238 195 222 225 208 240 C202 246 186 252 176 258 L176 325 M85 248 L85 325"
                  stroke="var(--border)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                {/* Facial Profile: Brow, Nose, Lips, Chin */}
                <path
                  d="M75 145 C75 162 70 172 64 178 L76 186 C79 204 86 220 98 232 L108 236 L108 246 L135 254"
                  stroke="var(--border)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Internal Anatomical Structures */}
                {/* Cerebral Cortex contour */}
                <path
                  d="M100 80 C110 65 140 55 170 60 C200 65 215 85 215 120 C215 145 195 160 175 160 C145 160 130 140 120 140 C110 140 100 115 100 80 Z"
                  fill="var(--surface-2)"
                  stroke="var(--primary)"
                  strokeWidth="1.5"
                  strokeDasharray="2 2"
                  opacity="0.8"
                />
                {/* Cerebellum & Brainstem */}
                <path
                  d="M180 155 C195 160 205 175 195 190 C185 205 170 205 165 195 L160 230"
                  stroke="var(--primary)"
                  strokeWidth="1.5"
                  opacity="0.7"
                />

                {/* Oral Cavity, Palate, Tongue */}
                <path
                  d="M90 190 C115 190 140 195 145 210 C145 225 125 230 105 228"
                  stroke="var(--accent)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                {/* Pharynx & Vocal Tract Guideline */}
                <path
                  d="M145 210 C155 220 155 240 150 260 L148 310"
                  stroke="var(--accent)"
                  strokeWidth="2"
                  strokeDasharray="3 3"
                />

                {/* Larynx / Thyroid Cartilage / True Vocal Folds */}
                <path
                  d="M138 265 L158 268 L152 285 L136 280 Z"
                  fill="var(--surface-2)"
                  stroke="var(--success)"
                  strokeWidth="2"
                />
                <circle cx="147" cy="274" r="3" fill="var(--success)" />

                {/* Cervical Vertebrae column */}
                <path
                  d="M185 255 L185 320"
                  stroke="var(--border)"
                  strokeWidth="4"
                  strokeDasharray="4 6"
                  opacity="0.5"
                />
              </svg>

              {/* HOTSPOT 1: Brain (PD & AD) */}
              <button
                type="button"
                onClick={() => setActiveHotspot(activeHotspot === 'brain' ? null : 'brain')}
                className={`absolute top-[85px] left-[155px] -translate-x-1/2 -translate-y-1/2 p-2 rounded-full transition-transform ${
                  activeHotspot === 'brain' ? 'scale-125' : 'hover:scale-110'
                }`}
                title="Tap to inspect Brain motor control"
                aria-label="Inspect Brain motor control hotspot"
              >
                <span className="relative flex h-6 w-6">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--primary)] opacity-60" />
                  <span className="relative inline-flex rounded-full h-6 w-6 bg-[var(--primary)] items-center justify-center text-white text-[11px] font-bold shadow-md">
                    1
                  </span>
                </span>
              </button>

              {/* HOTSPOT 2: Larynx & Vocal Folds */}
              <button
                type="button"
                onClick={() => setActiveHotspot(activeHotspot === 'larynx' ? null : 'larynx')}
                className={`absolute top-[270px] left-[147px] -translate-x-1/2 -translate-y-1/2 p-2 rounded-full transition-transform ${
                  activeHotspot === 'larynx' ? 'scale-125' : 'hover:scale-110'
                }`}
                title="Tap to inspect Larynx phonation"
                aria-label="Inspect Larynx phonation hotspot"
              >
                <span className="relative flex h-6 w-6">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--success)] opacity-60" />
                  <span className="relative inline-flex rounded-full h-6 w-6 bg-[var(--success)] items-center justify-center text-white text-[11px] font-bold shadow-md">
                    2
                  </span>
                </span>
              </button>

              {/* HOTSPOT 3: Articulators (Tongue, Lips) */}
              <button
                type="button"
                onClick={() => setActiveHotspot(activeHotspot === 'articulators' ? null : 'articulators')}
                className={`absolute top-[208px] left-[118px] -translate-x-1/2 -translate-y-1/2 p-2 rounded-full transition-transform ${
                  activeHotspot === 'articulators' ? 'scale-125' : 'hover:scale-110'
                }`}
                title="Tap to inspect Oral Articulators"
                aria-label="Inspect Oral Articulators hotspot"
              >
                <span className="relative flex h-6 w-6">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-60" />
                  <span className="relative inline-flex rounded-full h-6 w-6 bg-[var(--accent)] items-center justify-center text-white text-[11px] font-bold shadow-md">
                    3
                  </span>
                </span>
              </button>
            </div>

            {/* Selected Hotspot Explanation Box */}
            <div className="w-full mt-4 p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] min-h-[96px] flex flex-col justify-center text-left">
              {activeHotspot ? (
                <div className="space-y-1">
                  <div className="text-xs font-bold text-[var(--primary)]">
                    {hotspotDetails[activeHotspot].title}
                  </div>
                  <div className="text-[11px] font-semibold text-[var(--accent)]">
                    {hotspotDetails[activeHotspot].conditions}
                  </div>
                  <p className="text-xs text-[var(--muted)] leading-relaxed">
                    {hotspotDetails[activeHotspot].plainText}
                  </p>
                </div>
              ) : (
                <div className="text-center text-xs text-[var(--muted)] flex items-center justify-center gap-2">
                  <Info size={14} className="text-[var(--accent)]" />
                  <span>Click numbered markers (1, 2, or 3) on the anatomical head to see how each subsystem generates vocal clues.</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: 2x2 Bento Grid of Conditions */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {conditions.map((c) => {
              const isLinkedToActive = activeHotspot === c.hotspot
              return (
                <div
                  key={c.id}
                  className={`p-6 rounded-2xl bg-[var(--surface)] border transition-all duration-200 shadow-[var(--shadow-sm)] flex flex-col justify-between space-y-4 ${
                    isLinkedToActive
                      ? 'border-[var(--primary)] ring-2 ring-[var(--primary)]/15 shadow-[var(--shadow-md)]'
                      : 'border-[var(--border)] hover:border-[var(--muted)]'
                  }`}
                >
                  <div className="space-y-2">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-[var(--surface-2)] text-[var(--muted)] border border-[var(--border)]">
                      {c.badge}
                    </span>
                    <h3 className="text-lg font-display font-bold text-[var(--text)]">
                      {c.name}
                    </h3>
                    <p className="text-xs text-[var(--text)] font-medium leading-relaxed">
                      {c.plainSummary}
                    </p>
                    <p className="text-xs text-[var(--muted)] leading-relaxed">
                      {c.voiceChanges}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[var(--border)] space-y-1">
                    <div className="text-[10px] font-mono uppercase text-[var(--muted)] font-semibold">
                      Primary Acoustic Targets:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {c.keyBiomarkers.map((bm) => (
                        <span
                          key={bm}
                          className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-[var(--surface-2)] text-[var(--text)] border border-[var(--border)]"
                        >
                          {bm}
                        </span>
                      ))}
                    </div>
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
