'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Check, X, ArrowRight, Sparkles, Volume2, Info } from 'lucide-react'

type HotspotId = 'brain' | 'larynx' | 'articulators' | null

export function ConditionsSection() {
  const [activeHotspot, setActiveHotspot] = useState<HotspotId>(null)
  const [visitedHotspots, setVisitedHotspots] = useState<Set<string>>(new Set())

  const hotspotDetails = {
    brain: {
      number: 1,
      title: 'Brain & Cognitive Control',
      subtitle: 'Coordinates speech timing, lexical search, and vocal rhythm',
      description:
        'The motor cortex and basal ganglia govern subconscious vocal rhythm and muscle timing. Neurodegenerative changes in dopamine or cortical signaling create subtle hesitation pauses, micro-tremors, and cadence shifts before gross motor symptoms appear.',
      conditions: "Parkinson's Disease & Alzheimer's Disease",
      voiceImpact: 'Cadence hesitation, involuntary pitch perturbation, and reduced vocal modulation.',
    },
    larynx: {
      number: 2,
      title: 'Vocal Folds & Larynx',
      subtitle: 'Generates glottal vibration and acoustic harmonics',
      description:
        'Vocal cords oscillate over 100 to 250 times per second during speech. Neuromuscular weakness or unilateral vocal fold paresis allows turbulent air to escape, reducing harmonic clarity and creating cycle-to-cycle amplitude instability.',
      conditions: 'Post-Stroke Changes & Parkinsonian Hypophonia',
      voiceImpact: 'Breathy air leakage, reduced harmonic-to-noise ratio (HNR), and decreased volume.',
    },
    articulators: {
      number: 3,
      title: 'Speech Muscles & Tongue',
      subtitle: 'Shapes resonant acoustic waves into crisp phonemes',
      description:
        'Over 100 coordinated muscles in the lips, tongue, and soft palate shape acoustic frequencies into distinct vowels and consonants. Muscle weakness causes formant centralization, making vowel sounds blur together and consonant releases sound slurred.',
      conditions: 'Dysarthria & Post-Stroke Speech Changes',
      voiceImpact: 'Slurred consonant edges, compressed vowel formant triangle, and reduced phonetic range.',
    },
  }

  const handleHotspotClick = (id: 'brain' | 'larynx' | 'articulators') => {
    setActiveHotspot(id)
    setVisitedHotspots((prev) => new Set(prev).add(id))
  }

  const conditions = [
    {
      id: 'pd',
      heading: "Parkinson's Disease",
      pillClass: 'condition-pill-pd',
      plainDescription:
        'How the voice changes: Vocal cords develop subtle tremors, volume drops without the speaker noticing, and pitch becomes monotone.',
      measurements: [
        { term: 'Jitter', plain: 'voice steadiness' },
        { term: 'Shimmer', plain: 'volume stability' },
        { term: 'HNR', plain: 'clarity' },
      ],
      link: '/about/method#pd',
    },
    {
      id: 'ad',
      heading: "Alzheimer's Disease",
      pillClass: 'condition-pill-ad',
      plainDescription:
        'How the voice changes: Pauses become longer as the brain searches for words. Speech pace slows, and sentence flow becomes fragmented.',
      measurements: [
        { term: 'Pause Ratio', plain: 'pause duration' },
        { term: 'Speech Cadence', plain: 'speaking pace' },
        { term: 'Flow Continuity', plain: 'sentence flow' },
      ],
      link: '/about/method#ad',
    },
    {
      id: 'dysarthria',
      heading: 'Dysarthria — Speech Muscle Weakness',
      pillClass: 'condition-pill-dys',
      plainDescription:
        'How the voice changes: Tongue, lip, and throat muscles weaken, causing slurred consonants and difficulty forming crisp vowel sounds.',
      measurements: [
        { term: 'Formants', plain: 'vowel clarity' },
        { term: 'Onset Sharpness', plain: 'consonant edges' },
        { term: 'Articulator Control', plain: 'muscle coordination' },
      ],
      link: '/about/method#dysarthria',
    },
    {
      id: 'post-stroke',
      heading: 'Post-Stroke Changes',
      pillClass: 'condition-pill-pst',
      plainDescription:
        'How the voice changes: Speech rhythm can become uneven, breathing and speaking become harder to coordinate, and vocal energy drops.',
      measurements: [
        { term: 'Spectral Dynamics', plain: 'speech rhythm' },
        { term: 'Subglottal Support', plain: 'breath stability' },
        { term: 'Vocal Energy', plain: 'loudness control' },
      ],
      link: '/about/method#post-stroke',
    },
  ]

  return (
    <section id="conditions" className="py-20 px-4 sm:px-6 lg:px-8 bg-[var(--bg)] transition-colors duration-200">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-mono font-semibold tracking-wider uppercase text-[var(--accent)]">
            Physiological Vocal Subsystems
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-[var(--text)] tracking-tight">
            The 4 Screened Conditions
          </h2>
          <p className="text-sm sm:text-base text-[var(--muted)] leading-relaxed">
            Neurological changes manifest in how your brain, vocal cords, and speech muscles coordinate sound. Explore how voice biomarkers detect early deviation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: 3D Illustrated Character (Inspired by Image 11 reference) */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] flex flex-col items-center justify-between relative overflow-hidden">
            <div className="w-full flex items-center justify-between pb-3 border-b border-[var(--border)] text-xs font-mono text-[var(--muted)]">
              <span className="font-semibold text-[var(--text)]">Voice Physiology Interactive</span>
              <span className="text-[var(--accent)]">3 Target Hotspots</span>
            </div>

            {/* 3D Character Illustration Vector Container */}
            <div className="relative w-full max-w-[320px] h-[370px] my-auto flex items-center justify-center">
              <svg
                viewBox="0 0 340 400"
                className="w-full h-full drop-shadow-sm select-none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  {/* Soft 3D Lighting Gradients */}
                  <linearGradient id="charSkin" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F5D0B5" />
                    <stop offset="60%" stopColor="#E2A782" />
                    <stop offset="100%" stopColor="#C98864" />
                  </linearGradient>

                  <linearGradient id="charHair" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2D211E" />
                    <stop offset="100%" stopColor="#150E0C" />
                  </linearGradient>

                  <linearGradient id="charJacket" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8A2542" />
                    <stop offset="60%" stopColor="#69162D" />
                    <stop offset="100%" stopColor="#4A0D1E" />
                  </linearGradient>

                  <linearGradient id="tabletGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="100%" stopColor="#EEF2F7" />
                  </linearGradient>

                  <filter id="softShadow" x="-10%" y="-10%" width="130%" height="130%">
                    <feDropShadow dx="0" dy="8" stdDeviation="6" floodOpacity="0.12" floodColor="#0B1B33" />
                  </filter>
                </defs>

                {/* Ambient Soft Studio Backdrop Glow */}
                <circle cx="170" cy="200" r="140" fill="var(--surface-2)" opacity="0.8" />

                {/* Character Body / Coat */}
                {/* Torso & Inner Dark Top */}
                <path d="M125 240 L125 390 L215 390 L215 240 Z" fill="#1C212B" />
                {/* Stylish Burgundy / Maroon Jacket (Image 11 reference) */}
                {/* Left side coat */}
                <path
                  d="M100 245 C80 260 65 310 65 390 L120 390 L135 250 Z"
                  fill="url(#charJacket)"
                  filter="url(#softShadow)"
                />
                {/* Right side coat */}
                <path
                  d="M240 245 C260 260 275 310 275 390 L220 390 L205 250 Z"
                  fill="url(#charJacket)"
                  filter="url(#softShadow)"
                />
                {/* Belt & Buckle */}
                <rect x="135" y="340" width="70" height="14" rx="3" fill="#151922" />
                <rect x="160" y="337" width="20" height="20" rx="3" fill="none" stroke="#D9E0EA" strokeWidth="2.5" />

                {/* Neck */}
                <rect x="154" y="190" width="32" height="40" rx="10" fill="url(#charSkin)" />

                {/* Head / Face */}
                <ellipse cx="170" cy="145" rx="46" ry="54" fill="url(#charSkin)" filter="url(#softShadow)" />

                {/* Hair Volume - 3D Styled Dark Wavy Cut */}
                <path
                  d="M124 140 C120 85 150 65 170 65 C205 65 224 88 222 140 C222 165 218 190 226 215 C215 220 200 215 195 200 C185 210 160 210 145 198 C140 210 126 220 114 215 C124 190 122 165 124 140 Z"
                  fill="url(#charHair)"
                />
                {/* Hair Top Bangs */}
                <path
                  d="M130 110 C145 80 195 80 210 110 C185 95 155 95 130 110 Z"
                  fill="#3E302B"
                />

                {/* Friendly Facial Features */}
                {/* Eyebrows */}
                <path d="M142 128 Q152 124 160 127" stroke="#150E0C" strokeWidth="3" strokeLinecap="round" fill="none" />
                <path d="M180 127 Q188 124 198 128" stroke="#150E0C" strokeWidth="3" strokeLinecap="round" fill="none" />
                {/* Eyes - Warm & Expressive */}
                <ellipse cx="151" cy="138" rx="6" ry="7.5" fill="#1E1715" />
                <circle cx="153" cy="136" r="2.2" fill="#FFFFFF" />
                <ellipse cx="189" cy="138" rx="6" ry="7.5" fill="#1E1715" />
                <circle cx="191" cy="136" r="2.2" fill="#FFFFFF" />
                {/* Nose */}
                <path d="M168 144 Q170 155 174 156" stroke="#C98864" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                {/* Gentle Smile */}
                <path d="M158 168 Q170 178 182 168" stroke="#8A2542" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                <path d="M161 168 Q170 173 179 168" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" fill="none" />

                {/* Left Arm Holding Medical Tablet/Document (Image 11 reference) */}
                <path d="M85 265 L55 320 L75 330 L105 275 Z" fill="url(#charJacket)" />
                {/* Hand fingers holding sheet */}
                <ellipse cx="65" cy="325" rx="8" ry="7" fill="url(#charSkin)" />
                {/* Digital Clinical Tablet */}
                <rect x="25" y="270" width="82" height="110" rx="8" fill="url(#tabletGrad)" stroke="#CBD5E1" strokeWidth="2" filter="url(#softShadow)" />
                {/* Tablet Screen UI Graphics */}
                <rect x="33" y="282" width="66" height="35" rx="4" fill="#F1F5F9" />
                {/* Voice waveform on tablet */}
                <path d="M38 300 Q45 288 52 300 T66 300 T80 300 T90 300" fill="none" stroke="#1F4FD8" strokeWidth="2" strokeLinecap="round" />
                <circle cx="45" cy="288" r="2" fill="#0F8F8F" />
                <rect x="35" y="324" width="40" height="4" rx="2" fill="#94A3B8" />
                <rect x="35" y="332" width="55" height="4" rx="2" fill="#CBD5E1" />
                <rect x="35" y="340" width="48" height="4" rx="2" fill="#CBD5E1" />
                <rect x="35" y="352" width="28" height="8" rx="3" fill="#8A2542" />

                {/* Right Arm Pointing Toward the Condition Cards (Image 11 pose) */}
                <path d="M225 265 L275 285 L285 272 L235 250 Z" fill="url(#charJacket)" />
                {/* Forearm extending forward */}
                <path d="M275 280 L310 270 L315 282 L280 295 Z" fill="url(#charSkin)" />
                {/* Pointing Index Finger gesturing toward cards */}
                <path d="M308 273 L332 268 C335 267 337 270 335 273 L312 281 Z" fill="url(#charSkin)" />
                <circle cx="308" cy="279" r="6" fill="url(#charSkin)" />
              </svg>

              {/* ── HOTSPOT 1: Brain & Cognitive Control ── */}
              <button
                type="button"
                onClick={() => handleHotspotClick('brain')}
                className="absolute top-[68px] left-[170px] -translate-x-1/2 -translate-y-1/2 p-2 rounded-full transition-transform hover:scale-110 focus:outline-none z-10"
                title="Click to inspect Brain & Cognitive Control"
                aria-label="Brain hotspot"
              >
                <span className="relative flex h-7 w-7">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--primary)] opacity-50" />
                  <span
                    className={`relative inline-flex rounded-full h-7 w-7 items-center justify-center text-white text-xs font-bold shadow-md transition-colors ${
                      visitedHotspots.has('brain') ? 'bg-emerald-600' : 'bg-[var(--primary)]'
                    }`}
                  >
                    {visitedHotspots.has('brain') ? <Check size={14} /> : '1'}
                  </span>
                </span>
              </button>

              {/* ── HOTSPOT 2: Vocal Folds & Larynx ── */}
              <button
                type="button"
                onClick={() => handleHotspotClick('larynx')}
                className="absolute top-[182px] left-[170px] -translate-x-1/2 -translate-y-1/2 p-2 rounded-full transition-transform hover:scale-110 focus:outline-none z-10"
                title="Click to inspect Vocal Folds & Larynx"
                aria-label="Larynx hotspot"
              >
                <span className="relative flex h-7 w-7">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-50" />
                  <span
                    className={`relative inline-flex rounded-full h-7 w-7 items-center justify-center text-white text-xs font-bold shadow-md transition-colors ${
                      visitedHotspots.has('larynx') ? 'bg-emerald-600' : 'bg-[var(--accent)]'
                    }`}
                  >
                    {visitedHotspots.has('larynx') ? <Check size={14} /> : '2'}
                  </span>
                </span>
              </button>

              {/* ── HOTSPOT 3: Speech Muscles & Articulators ── */}
              <button
                type="button"
                onClick={() => handleHotspotClick('articulators')}
                className="absolute top-[148px] left-[170px] -translate-x-1/2 -translate-y-1/2 p-2 rounded-full transition-transform hover:scale-110 focus:outline-none z-10"
                title="Click to inspect Speech Muscles & Tongue"
                aria-label="Articulators hotspot"
              >
                <span className="relative flex h-7 w-7">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--success)] opacity-50" />
                  <span
                    className={`relative inline-flex rounded-full h-7 w-7 items-center justify-center text-white text-xs font-bold shadow-md transition-colors ${
                      visitedHotspots.has('articulators') ? 'bg-emerald-600' : 'bg-[var(--success)]'
                    }`}
                  >
                    {visitedHotspots.has('articulators') ? <Check size={14} /> : '3'}
                  </span>
                </span>
              </button>
            </div>

            {/* Bottom Helper Hint */}
            <div className="w-full pt-3 border-t border-[var(--border)] text-center text-xs text-[var(--muted)]">
              Click pulse dots <span className="font-semibold text-[var(--text)]">1, 2, or 3</span> on the clinician avatar to reveal physiological speech mechanics.
            </div>
          </div>

          {/* Right Column: 4 Clean Condition Cards (Human Plain Headers, 3 Bordered Pill Tags, Learn Link) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {conditions.map((c) => (
              <div
                key={c.id}
                className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] hover:border-[var(--muted)] transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  <h3 className="text-lg font-display font-bold text-[var(--text)] tracking-tight">
                    {c.heading}
                  </h3>
                  <p className="text-xs text-[var(--muted)] leading-relaxed">
                    {c.plainDescription}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-[var(--border)]">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[var(--muted)] font-semibold block mb-1.5">
                      What we measure:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {c.measurements.map((m) => (
                        <span
                          key={m.term}
                          className={`condition-pill ${c.pillClass}`}
                        >
                          <span className="term font-medium">{m.term}</span>
                          <span className="term-plain text-[10px]">({m.plain})</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  <Link
                    href={c.link}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--primary)] hover:underline pt-1"
                  >
                    <span>Learn about voice markers</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Slide-In Modal / Detail Sheet When a Hotspot is Clicked */}
      {activeHotspot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="max-w-lg w-full rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-2xl p-6 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[var(--primary)] text-white text-xs font-bold flex items-center justify-center">
                  {hotspotDetails[activeHotspot].number}
                </span>
                <span className="text-xs font-mono font-bold text-[var(--accent)] uppercase">
                  Anatomical Subsystem Details
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveHotspot(null)}
                className="p-1 rounded-md text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <h3 className="text-xl font-display font-bold text-[var(--text)]">
                  {hotspotDetails[activeHotspot].title}
                </h3>
                <p className="text-xs font-medium text-[var(--accent)] mt-0.5">
                  {hotspotDetails[activeHotspot].subtitle}
                </p>
              </div>

              <p className="text-xs text-[var(--muted)] leading-relaxed">
                {hotspotDetails[activeHotspot].description}
              </p>

              <div className="p-3.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] space-y-1">
                <div className="text-[11px] font-bold text-[var(--text)]">
                  Associated Indications:
                </div>
                <div className="text-xs text-[var(--primary)] font-medium">
                  {hotspotDetails[activeHotspot].conditions}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] space-y-1">
                <div className="text-[11px] font-bold text-[var(--text)]">
                  Early Acoustic Voice Impact:
                </div>
                <div className="text-xs text-[var(--muted)]">
                  {hotspotDetails[activeHotspot].voiceImpact}
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveHotspot(null)}
                className="btn-primary text-xs py-2 px-5 rounded-xl"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
