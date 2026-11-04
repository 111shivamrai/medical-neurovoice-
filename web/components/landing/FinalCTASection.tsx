'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'

export function FinalCTASection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[var(--bg)] relative overflow-hidden transition-colors duration-300">
      {/* Background radial glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background: 'radial-gradient(circle at center, var(--primary) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-4xl mx-auto text-center relative z-10 p-10 sm:p-14 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-xl">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-6 bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20">
          <Sparkles size={14} /> Free Research Screening
        </span>

        <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-[var(--text)] tracking-tight mb-4">
          Start your free screening today.
        </h2>

        <p className="text-base sm:text-lg text-[var(--muted)] max-w-xl mx-auto mb-8 leading-relaxed">
          It takes 30 seconds. In Hindi or English. On any smartphone or computer without special hardware.
        </p>

        {/* Exactly two buttons: Create Free Account and Sign In */}
        <div className="flex flex-wrap justify-center items-center gap-4">
          <Link
            href="/signup"
            className="btn-primary px-8 py-3.5 text-sm sm:text-base font-semibold text-white rounded-xl shadow-lg flex items-center gap-2"
          >
            <span>Create Free Account</span>
            <ArrowRight size={18} />
          </Link>
          <Link
            href="/signin"
            className="btn-ghost px-6 py-3.5 rounded-xl text-sm sm:text-base font-semibold border border-[var(--border)] transition-all"
          >
            <span>Sign In →</span>
          </Link>
        </div>

        <p className="text-xs text-[var(--muted)] mt-6">
          Zero installation required. Privacy-first: voice data is processed for acoustic features and immediately deleted.
        </p>
      </div>
    </section>
  )
}
