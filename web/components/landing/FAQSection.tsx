'use client'

import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0)

  const faqs = [
    {
      q: 'Is this a medical diagnosis?',
      a: 'No. NeuroVoice is a research screening support tool. Results provide objective acoustic biomarker analysis to support clinical evaluation, but do not replace a neurological examination. Always consult a qualified physician or neurologist.',
    },
    {
      q: 'Does it work in Hindi?',
      a: 'Yes. Hindi and English are both natively supported. Our acoustic feature extraction operates on language-independent phonetic biomarkers (such as vocal cord jitter, shimmer, harmonics-to-noise ratio, and formants) alongside Hindi-tailored speech prompts.',
    },
    {
      q: 'Is my voice data stored?',
      a: 'No. Raw audio recordings are immediately deleted from server memory after acoustic feature extraction unless explicit opt-in consent is given for research archives. Only anonymized numerical feature vectors are retained.',
    },
    {
      q: 'Who can use it?',
      a: 'NeuroVoice is designed for neurologists, medical students, ASHA community health workers in rural Madhya Pradesh, and individuals monitoring vocal wellness over time.',
    },
    {
      q: 'Is it free?',
      a: 'Yes. NeuroVoice is completely free for research demonstration, educational use, and community health screening in collaboration with academic health institutions.',
    },
  ]

  return (
    <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8 bg-[var(--surface)] border-t border-[var(--border)] transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-4 bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20">
            Frequently Asked Questions
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-[var(--text)] tracking-tight mb-4">
            Clear Answers, Honest Limits
          </h2>
          <p className="text-base text-[var(--text-muted)]">
            Transparent explanations about how NeuroVoice works, data privacy, and research boundaries.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx
            return (
              <div
                key={faq.q}
                className="rounded-xl border border-[var(--border)] bg-[var(--bg)] overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 font-semibold text-[var(--text)] hover:text-[var(--primary)] transition-colors"
                >
                  <span className="text-base font-display">{faq.q}</span>
                  <ChevronDown
                    size={20}
                    className={`text-[var(--text-muted)] transition-transform duration-200 flex-shrink-0 ${
                      isOpen ? 'rotate-180 text-[var(--primary)]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-sm text-[var(--text-muted)] leading-relaxed border-t border-[var(--border)]/50 pt-4">
                    {faq.a}
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
