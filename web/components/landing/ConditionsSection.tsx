'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Check, X, ArrowRight } from 'lucide-react'

export function ConditionsSection() {
  const [activeHotspot, setActiveHotspot] = useState<'brain' | 'larynx' | 'articulators' | null>(null)
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
        'Vocal cords oscillate over 100 to 250 times per second during speech. Neuromuscular weakness allows turbulent air to escape, reducing harmonic clarity and creating cycle-to-cycle amplitude instability.',
      conditions: 'Post-Stroke Changes & Parkinsonian Hypophonia',
      voiceImpact: 'Breathy air leakage, reduced harmonic-to-noise ratio, and decreased volume.',
    },
    articulators: {
      number: 3,
      title: 'Speech Muscles & Tongue',
      subtitle: 'Shapes resonant acoustic waves into crisp phonemes',
      description:
        'Over 100 coordinated muscles in the lips, tongue, and soft palate shape acoustic frequencies into distinct vowels and consonants. Muscle weakness causes consonant releases to sound slurred and vowel formants to blur.',
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
        { term: 'Jitter', plain: 'microscopic pitch tremor' },
        { term: 'Shimmer', plain: 'volume wobble' },
        { term: 'HNR', plain: 'breathiness ratio' },
      ],
      link: '/dashboard/scan',
    },
    {
      id: 'ad',
      heading: "Alzheimer's Disease",
      pillClass: 'condition-pill-ad',
      plainDescription:
        'How the voice changes: Hesitation before common words, longer pauses between thoughts, and shorter sentences.',
      measurements: [
        { term: 'Pause Ratio', plain: 'hesitation timing' },
        { term: 'Cadence', plain: 'speech rhythm' },
        { term: 'Word Search', plain: 'vocal delay' },
      ],
      link: '/dashboard/scan',
    },
    {
      id: 'dys',
      heading: 'Dysarthria',
      pillClass: 'condition-pill-dys',
      plainDescription:
        'How the voice changes: Speech muscles weaken, making consonants blur together and speech sound slurred.',
      measurements: [
        { term: 'Formant Range', plain: 'vowel clarity' },
        { term: 'Articulator Rate', plain: 'muscle speed' },
        { term: 'Phoneme Edges', plain: 'consonant crispness' },
      ],
      link: '/dashboard/scan',
    },
    {
      id: 'stroke',
      heading: 'Post-Stroke Changes',
      pillClass: 'condition-pill-stroke',
      plainDescription:
        'How the voice changes: Asymmetrical muscle strength in the vocal cords causes breathy speech, uneven loudness, and rapid fatigue.',
      measurements: [
        { term: 'Vocal Fold Symmetry', plain: 'left-right balance' },
        { term: 'Breath Support', plain: 'lung pressure' },
        { term: 'Cadence Decay', plain: 'speech stamina' },
      ],
      link: '/dashboard/scan',
    },
  ]

  return (
    <section className="py-16 sm:py-24 bg-[var(--bg)] border-b border-[var(--border)] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-mono font-bold tracking-wider uppercase text-[var(--primary)] px-3 py-1 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/20">
            Acoustic Physiology
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-[var(--text)] tracking-tight">
            The 4 Screened Conditions
          </h2>
          <p className="text-sm sm:text-base text-[var(--muted)] leading-relaxed">
            Neurological changes manifest in how your brain, vocal cords, and speech muscles coordinate sound. Explore how voice biomarkers detect early deviation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: 3D Character Illustration (Exact Image 2 Match) */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] flex flex-col items-center justify-between relative overflow-hidden">
            {/* 3D Character Illustration Vector Container */}
            <div className="relative w-full max-w-[320px] h-[380px] my-auto flex items-center justify-center">
              <svg
                viewBox="0 0 340 400"
                className="w-full h-full drop-shadow-md select-none transition-transform duration-300 hover:scale-[1.02]"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  {/* Clean Light Studio Backdrop Radial Gradient */}
                  <radialGradient id="cleanBackdrop" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#E2E8F0" stopOpacity="0.4" />
                  </radialGradient>

                  {/* Lighter skin tone: #F4C9A0 with subtle depth */}
                  <linearGradient id="charSkinLight" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FDE3CE" />
                    <stop offset="50%" stopColor="#F4C9A0" />
                    <stop offset="100%" stopColor="#E6B487" />
                  </linearGradient>

                  {/* Long dark hair: #2C1810 */}
                  <linearGradient id="charHairDark" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3D2218" />
                    <stop offset="100%" stopColor="#2C1810" />
                  </linearGradient>

                  {/* Maroon/Wine/Dark Red jacket: #6B1E2E */}
                  <linearGradient id="maroonJacket" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8A283D" />
                    <stop offset="50%" stopColor="#6B1E2E" />
                    <stop offset="100%" stopColor="#4A131F" />
                  </linearGradient>

                  <filter id="subtleShadow" x="-10%" y="-10%" width="130%" height="130%">
                    <feDropShadow dx="0" dy="6" stdDeviation="5" floodOpacity="0.1" floodColor="#0B1B33" />
                  </filter>
                </defs>

                {/* Clean White/Light Background Circle Behind Her (Image 2 style) */}
                <circle cx="170" cy="200" r="145" fill="url(#cleanBackdrop)" />

                {/* ─── CHARACTER BODY ─── */}
                {/* Inner Top / Shirt (Black) */}
                <path d="M130 240 L130 395 L210 395 L210 240 Z" fill="#18181B" />
                {/* Inner V-Neck cutout */}
                <path d="M150 220 L170 250 L190 220 Z" fill="url(#charSkinLight)" />

                {/* Maroon/Wine Jacket Body (Left Panel with Lapel) */}
                <path
                  d="M95 242 C75 260 65 310 65 395 L125 395 L140 250 Z"
                  fill="url(#maroonJacket)"
                  filter="url(#subtleShadow)"
                />
                {/* Maroon/Wine Jacket Body (Right Panel with Lapel) */}
                <path
                  d="M245 242 C265 260 275 310 275 395 L215 395 L200 250 Z"
                  fill="url(#maroonJacket)"
                  filter="url(#subtleShadow)"
                />

                {/* Belt & Buckle */}
                <rect x="130" y="345" width="80" height="15" rx="3" fill="#09090B" />
                <rect x="160" y="342" width="20" height="21" rx="3" fill="none" stroke="#D4D4D8" strokeWidth="2.5" />

                {/* Neck */}
                <rect x="153" y="190" width="34" height="42" rx="10" fill="url(#charSkinLight)" />

                {/* Head / Face (Light Skin Tone) */}
                <ellipse cx="170" cy="144" rx="46" ry="54" fill="url(#charSkinLight)" filter="url(#subtleShadow)" />

                {/* Long Dark Hair Tied Back (#2C1810) */}
                <path
                  d="M124 140 C118 85 148 62 170 62 C204 62 222 85 222 140 C222 165 218 190 226 215 C215 220 200 215 195 200 C185 210 160 210 145 198 C140 210 126 220 114 215 C124 190 122 165 124 140 Z"
                  fill="url(#charHairDark)"
                />
                {/* Front Hair Bangs */}
                <path
                  d="M128 112 C145 82 195 82 212 112 C186 96 154 96 128 112 Z"
                  fill="#3D2218"
                />

                {/* Friendly Eyes and Eyebrows */}
                <path d="M142 127 Q152 123 160 126" stroke="#2C1810" strokeWidth="3" strokeLinecap="round" fill="none" />
                <path d="M180 126 Q188 123 198 127" stroke="#2C1810" strokeWidth="3" strokeLinecap="round" fill="none" />
                <ellipse cx="151" cy="138" rx="6" ry="7.5" fill="#2C1810" />
                <circle cx="153" cy="136" r="2.2" fill="#FFFFFF" />
                <ellipse cx="189" cy="138" rx="6" ry="7.5" fill="#2C1810" />
                <circle cx="191" cy="136" r="2.2" fill="#FFFFFF" />
                {/* Nose & Smile */}
                <path d="M168 144 Q170 155 174 156" stroke="#E6B487" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                <path d="M158 168 Q170 178 182 168" stroke="#6B1E2E" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                <path d="M161 168 Q170 173 179 168" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" fill="none" />

                {/* Left Arm Holding Tablet/Document (Image 2 Pose) */}
                <path d="M85 260 L52 320 L75 330 L105 272 Z" fill="url(#maroonJacket)" />
                <ellipse cx="64" cy="326" rx="8" ry="7" fill="url(#charSkinLight)" />

                {/* Tablet / Screen Document in Hands */}
                <rect x="22" y="270" width="85" height="114" rx="8" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" filter="url(#subtleShadow)" />
                {/* Blue Waveform on Tablet */}
                <rect x="30" y="282" width="69" height="36" rx="4" fill="#F8FAFC" />
                <path d="M35 300 Q43 286 51 300 T65 300 T79 300 T90 300" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />
                <rect x="33" y="326" width="42" height="4" rx="2" fill="#94A3B8" />
                <rect x="33" y="335" width="58" height="4" rx="2" fill="#CBD5E1" />
                <rect x="33" y="344" width="50" height="4" rx="2" fill="#CBD5E1" />
                <rect x="33" y="356" width="30" height="8" rx="3" fill="#6B1E2E" />

                {/* Right Arm Pointing Toward the Screen with Hand (Image 2 Pose) */}
                <path d="M225 260 L275 285 L285 272 L235 248 Z" fill="url(#maroonJacket)" />
                <path d="M275 280 L310 270 L315 282 L280 295 Z" fill="url(#charSkinLight)" />
                {/* Pointing Index Finger */}
                <path d="M308 273 L334 268 C337 267 338 270 336 273 L312 281 Z" fill="url(#charSkinLight)" />
                <circle cx="308" cy="279" r="6" fill="url(#charSkinLight)" />
              </svg>

              {/* ── 3 NUMBERED PULSE DOTS (Forehead/Brain, Larynx/Throat, Articulators/Mouth) ── */}

              {/* HOTSPOT 1: Forehead / Brain Area */}
              <button
                type="button"
                onClick={() => handleHotspotClick('brain')}
                className="absolute top-[68px] left-[170px] -translate-x-1/2 -translate-y-1/2 p-2 rounded-full transition-transform hover:scale-115 focus:outline-none z-10"
                title="1. Brain & Cognitive Control"
                aria-label="Brain hotspot"
              >
                <span className="relative flex h-7 w-7">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--primary)] opacity-50" />
                  <span
                    className={`relative inline-flex rounded-full h-7 w-7 items-center justify-center text-white text-xs font-bold shadow-lg transition-colors ${
                      visitedHotspots.has('brain') ? 'bg-emerald-600' : 'bg-[var(--primary)]'
                    }`}
                  >
                    {visitedHotspots.has('brain') ? <Check size={14} /> : '1'}
                  </span>
                </span>
              </button>

              {/* HOTSPOT 3: Mouth / Articulators Area */}
              <button
                type="button"
                onClick={() => handleHotspotClick('articulators')}
                className="absolute top-[148px] left-[170px] -translate-x-1/2 -translate-y-1/2 p-2 rounded-full transition-transform hover:scale-115 focus:outline-none z-10"
                title="3. Speech Muscles & Articulators"
                aria-label="Articulators hotspot"
              >
                <span className="relative flex h-7 w-7">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--success)] opacity-50" />
                  <span
                    className={`relative inline-flex rounded-full h-7 w-7 items-center justify-center text-white text-xs font-bold shadow-lg transition-colors ${
                      visitedHotspots.has('articulators') ? 'bg-emerald-600' : 'bg-[var(--success)]'
                    }`}
                  >
                    {visitedHotspots.has('articulators') ? <Check size={14} /> : '3'}
                  </span>
                </span>
              </button>

              {/* HOTSPOT 2: Throat / Larynx Area */}
              <button
                type="button"
                onClick={() => handleHotspotClick('larynx')}
                className="absolute top-[188px] left-[170px] -translate-x-1/2 -translate-y-1/2 p-2 rounded-full transition-transform hover:scale-115 focus:outline-none z-10"
                title="2. Vocal Folds & Larynx"
                aria-label="Larynx hotspot"
              >
                <span className="relative flex h-7 w-7">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-50" />
                  <span
                    className={`relative inline-flex rounded-full h-7 w-7 items-center justify-center text-white text-xs font-bold shadow-lg transition-colors ${
                      visitedHotspots.has('larynx') ? 'bg-emerald-600' : 'bg-[var(--accent)]'
                    }`}
                  >
                    {visitedHotspots.has('larynx') ? <Check size={14} /> : '2'}
                  </span>
                </span>
              </button>
            </div>

            {/* Bottom Instruction Text as specified in Master Prompt 7, Fix 2 */}
            <div className="w-full pt-3 border-t border-[var(--border)] text-center text-xs text-[var(--muted)]">
              Tap the numbered dots on the figure to learn how each part of the voice system is connected to neurological health.
            </div>
          </div>

          {/* Right Column: 4 Clean Condition Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {conditions.map((c) => (
              <div
                key={c.id}
                className="card-lift p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] hover:border-[var(--muted)] transition-all flex flex-col justify-between space-y-4"
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
                        <span key={m.term} className={`condition-pill ${c.pillClass}`}>
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

      {/* Centred Modal Dialog When a Hotspot is Clicked (NOT pushed to the left!) */}
      {activeHotspot && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setActiveHotspot(null)}
        >
          <div
            className="max-w-lg w-full rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-2xl p-6 space-y-5 animate-in zoom-in-95 mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[var(--primary)] text-white text-xs font-bold flex items-center justify-center">
                  {hotspotDetails[activeHotspot].number}
                </span>
                <span className="text-xs font-mono font-bold text-[var(--accent)] uppercase">
                  Speech Physiology Mechanics
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveHotspot(null)}
                className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors"
                aria-label="Close modal"
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
                  Associated Conditions:
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
