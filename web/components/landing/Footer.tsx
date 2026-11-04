'use client'

import React from 'react'
import Link from 'next/link'
import { Logo } from '@/components/Logo'
import { BRAND } from '@/lib/brand'
import { ShieldAlert, Heart, ExternalLink } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)] text-[var(--text)] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand & Mission Statement */}
          <div className="md:col-span-2 space-y-4">
            <Logo size="md" />
            <p className="text-sm text-[var(--muted)] max-w-md leading-relaxed">
              NeuroVoice is a vocal neurological biomarker research and screening support tool. We measure micro-acoustic speech patterns to provide objective screening indications for individuals and clinicians.
            </p>
            <div className="text-xs font-medium text-[var(--muted)]">
              {BRAND.missionStatement}
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-3">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--accent)]">
              Platform & Features
            </div>
            <ul className="space-y-2 text-xs text-[var(--muted)]">
              <li>
                <a href="#how-it-works" className="hover:text-[var(--text)] transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#conditions" className="hover:text-[var(--text)] transition-colors">
                  Screened Conditions
                </a>
              </li>
              <li>
                <a href="#pipeline" className="hover:text-[var(--text)] transition-colors">
                  9-Stage Pipeline
                </a>
              </li>
              <li>
                <Link href="/signin" className="hover:text-[var(--text)] transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-[var(--text)] transition-colors">
                  Create Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Scientific Trust & Legal Links */}
          <div className="space-y-3">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--primary)]">
              Science & Transparency
            </div>
            <ul className="space-y-2 text-xs text-[var(--muted)]">
              <li>
                <Link href="/about/method" className="hover:text-[var(--text)] transition-colors">
                  Scientific Methodology & Biomarkers
                </Link>
              </li>
              <li>
                <Link href="/brand" className="hover:text-[var(--text)] transition-colors">
                  Brand Identity & Logo Concepts
                </Link>
              </li>
              <li>
                <Link href="/licenses" className="hover:text-[var(--text)] transition-colors">
                  Open Source & Asset Licenses
                </Link>
              </li>
              <li>
                <a href="#trust" className="hover:text-[var(--text)] transition-colors">
                  How We Keep Results Honest
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-[var(--text)] transition-colors">
                  Frequently Asked Questions
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Clinical Disclaimer & Emergency Alert Box */}
        <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-xs text-[var(--muted)] space-y-2">
          <div className="flex items-center gap-2 font-bold text-[var(--danger)]">
            <ShieldAlert size={15} />
            <span>Emergency Warning</span>
          </div>
          <p className="leading-relaxed">
            {BRAND.emergencyWarning}
          </p>
          <p className="text-[11px] leading-relaxed pt-1 border-t border-[var(--border)]">
            {BRAND.screeningDisclaimer}
          </p>
        </div>

        {/* Bottom Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[var(--border)] text-xs text-[var(--muted)]">
          <div>
            {BRAND.copyright} {BRAND.missionStatement}
          </div>
          <div className="flex items-center gap-6">
            <Link href="/about/method" className="hover:text-[var(--text)] transition-colors">
              Method
            </Link>
            <Link href="/brand" className="hover:text-[var(--text)] transition-colors">
              Brand
            </Link>
            <Link href="/licenses" className="hover:text-[var(--text)] transition-colors">
              Licenses
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
