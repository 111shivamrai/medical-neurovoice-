'use client'

import React, { useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'

export function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0)

  const faqs = [
    {
      q: 'Is NeuroVoice a clinical medical diagnosis?',
      a: 'No. NeuroVoice is an investigational vocal biomarker screening support and research tool. It produces objective mathematical measurements of vocal motor coordination, pitch perturbation, and acoustic energy to help individuals and clinicians decide whether a full neurological consultation is advised. It never replaces clinical diagnostic tests, neuroimaging (MRI/CT), or an in-person physical examination by a licensed neurologist.',
    },
    {
      q: 'How can a 30-second voice sample reveal neurological changes?',
      a: 'Speech production is among the most complex neuromuscular activities in the human body, requiring millisecond-level coordination between respiratory breath support, the larynx (vocal cords), and over 100 oral articulatory muscles. Neurodegenerative conditions such as Parkinson\'s and Alzheimer\'s cause subtle micro-tremors, incomplete vocal fold closure, and hesitation pauses that appear acoustically long before overt physical tremors or major cognitive impairment are visible.',
    },
    {
      q: 'Does it work in Hindi and regional Indian accents?',
      a: 'Yes. Hindi and English are natively supported. Our acoustic pipeline relies on language-independent biophysical features — including fundamental frequency tremor (jitter), amplitude instability (shimmer), harmonic-to-noise ratio (HNR), and formant centralisation — alongside phonetic prompts designed specifically for Hindi vowel phonation (e.g. sustained "आ..." phonation).',
    },
    {
      q: 'Can I take a screening from my home or smartphone?',
      a: 'Yes. NeuroVoice runs directly in any modern mobile or desktop web browser without downloading any apps or buying specialized microphones. All you need is 30 seconds in a quiet room.',
    },
    {
      q: 'Is my voice recording stored or shared on the internet?',
      a: 'No. We follow strict privacy-by-design standards. The raw audio file you record is kept in temporary memory solely during acoustic extraction and is deleted immediately afterward. Only the resulting anonymous numerical feature measurements are stored in your encrypted report. We never sell, broadcast, or retain raw patient voice recordings.',
    },
    {
      q: 'What happens if my recording quality is poor or background noise is high?',
      a: 'NeuroVoice verifies the Signal-to-Noise Ratio (SNR) in Stage 2 of the pipeline. If your room is too noisy, or if background traffic, ceiling fans, or speech hum causes the SNR to drop below 10 dB, the system returns an "Inconclusive" status and prompts you to re-record in a quieter environment. We refuse to present unreliable estimates as clinical output.',
    },
    {
      q: 'How should I share these screening results with my doctor?',
      a: 'Every completed screening allows you to download a comprehensive 5-page clinical PDF report. The document includes person details, typical reference ranges with cited medical papers, top influencing acoustic features, and 5 suggested questions to ask your physician during your clinic visit. You can print the report or share it directly with your physician.',
    },
  ]

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx)
  }

  return (
    <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-[var(--surface)] border-b border-[var(--border)] transition-colors duration-200">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-mono font-semibold tracking-wider uppercase text-[var(--accent)]">
            Frequently Asked Questions
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-[var(--text)] tracking-tight">
            Clear Answers, Honest Boundaries
          </h2>
          <p className="text-sm sm:text-base text-[var(--muted)] leading-relaxed">
            Transparent information about our screening methodology, research limits, and data privacy.
          </p>
        </div>

        {/* 7 Accordion Items */}
        <div className="space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx
            return (
              <div
                key={idx}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface)] transition-all shadow-[var(--shadow-sm)] overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-display font-bold text-base text-[var(--text)] hover:text-[var(--primary)] transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-[var(--accent)]">
                      0{idx + 1}
                    </span>
                    <span>{faq.q}</span>
                  </span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-[var(--muted)] transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[var(--primary)]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[var(--muted)] leading-relaxed border-t border-[var(--border)]/50 bg-[var(--surface-2)]/40">
                    <p className="pt-2">{faq.a}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
