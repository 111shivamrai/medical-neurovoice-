'use client'

import React from 'react'
import Link from 'next/link'
import { Logo } from '@/components/Logo'
import { Shield, ExternalLink, Heart } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)] text-[var(--text)] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Brand & Institutional Credit */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Logo size="md" />
            </div>
            <p className="text-sm text-[var(--text-muted)] max-w-sm mb-4 leading-relaxed">
              NeuroVoice is a research screening support tool analyzing acoustic biomarkers in human speech to aid early neurological risk assessment.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[var(--surface-2)] text-[var(--text-muted)] border border-[var(--border)]">
              <span>🏛️</span>
              <span>Developed in collaboration with Jabalpur Medical College</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-[var(--accent)] mb-4 font-semibold">
              Platform
            </div>
            <ul className="space-y-2.5 text-sm text-[var(--text-muted)]">
              <li>
                <a href="#how-it-works" className="hover:text-[var(--text)] transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#conditions" className="hover:text-[var(--text)] transition-colors">
                  The 4 Conditions
                </a>
              </li>
              <li>
                <a href="#pipeline" className="hover:text-[var(--text)] transition-colors">
                  9-Stage Pipeline
                </a>
              </li>
              <li>
                <a href="#personas" className="hover:text-[var(--text)] transition-colors">
                  For Doctors & ASHA
                </a>
              </li>
              <li>
                <a href="#research" className="hover:text-[var(--text)] transition-colors">
                  Research & Papers
                </a>
              </li>
              <li>
                <Link href="/simple" className="text-[var(--accent)] hover:underline">
                  ASHA Simple Mode (Hindi)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Research & Legal (Drafts) */}
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-[var(--accent)] mb-4 font-semibold">
              Governance
            </div>
            <ul className="space-y-2.5 text-sm text-[var(--text-muted)]">
              <li>
                <span className="text-xs px-2 py-0.5 rounded bg-[var(--surface-2)] text-[var(--text-muted)] mr-1">
                  Draft
                </span>
                <span className="hover:text-[var(--text)] cursor-pointer">Privacy Policy</span>
              </li>
              <li>
                <span className="text-xs px-2 py-0.5 rounded bg-[var(--surface-2)] text-[var(--text-muted)] mr-1">
                  Draft
                </span>
                <span className="hover:text-[var(--text)] cursor-pointer">Terms of Service</span>
              </li>
              <li>
                <span className="text-xs px-2 py-0.5 rounded bg-[var(--surface-2)] text-[var(--text-muted)] mr-1">
                  Draft
                </span>
                <span className="hover:text-[var(--text)] cursor-pointer">Patient Consent Protocol</span>
              </li>
              <li>
                <span className="text-xs text-[var(--text-muted)] italic block mt-2">
                  * Marked "Pending legal review"
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Mandatory Research Disclaimer Banner */}
        <div className="p-4 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-xs text-[var(--text-muted)] leading-relaxed mb-8 flex items-start gap-3">
          <Shield size={16} className="text-[var(--warning)] flex-shrink-0 mt-0.5" />
          <div>
            <strong className="text-[var(--text)]">Research Prototype Notice: </strong>
            NeuroVoice is a research demonstration and screening support tool. Outputs are mathematical approximations of vocal acoustic features and do not constitute a clinical medical diagnosis. No medical action or medication adjustment should be taken without a formal evaluation by a licensed neurologist or physician.
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-muted)] pt-6 border-t border-[var(--border)]">
          <div>
            © {new Date().getFullYear()} NeuroVoice. All rights reserved. Built for research collaboration with Jabalpur Medical College, Madhya Pradesh, India.
          </div>
          <div className="flex items-center gap-1">
            Built with care for public neurological health
          </div>
        </div>
      </div>
    </footer>
  )
}
