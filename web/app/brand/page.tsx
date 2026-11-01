'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Logo } from '@/components/Logo'
import { ArrowLeft, Check, Copy, Download, Sparkles } from 'lucide-react'

export default function BrandIdentityPage() {
  const [selectedConcept, setSelectedConcept] = useState<'A' | 'B' | 'C'>('A')
  const [copiedHex, setCopiedHex] = useState<string | null>(null)

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex)
    setCopiedHex(hex)
    setTimeout(() => setCopiedHex(null), 1500)
  }

  const palette = [
    { name: 'Primary (Clinical Blue)', token: '--primary', hex: '#1E40AF', use: 'Primary actions, active states, key emphasis' },
    { name: 'Accent (Acoustic Teal)', token: '--accent', hex: '#0D7377', use: 'Waveform frequencies, synaptic indicators' },
    { name: 'Surface (Pure White)', token: '--surface', hex: '#FFFFFF', use: 'Card backgrounds, modal surfaces' },
    { name: 'Background (Warm Clean)', token: '--bg', hex: '#F5F7FA', use: 'Clinical page background' },
    { name: 'Border (Subtle Muted)', token: '--border', hex: '#D5DBE8', use: 'Structural dividers and inputs' },
    { name: 'Text (Deep Navy)', token: '--text', hex: '#0C1A2E', use: 'High contrast headers and primary body' },
    { name: 'Success (Healthy Tier)', token: '--success', hex: '#15803D', use: 'Low neurological risk indicators' },
    { name: 'Warning (Monitoring Tier)', token: '--warning', hex: '#B45309', use: 'Moderate variation alerts' },
    { name: 'Danger (Urgent Clinic Tier)', token: '--danger', hex: '#B91C1C', use: 'Emergency alerts and elevated risk' },
  ]

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Navigation */}
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--muted)] hover:text-[var(--text)] transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </Link>
          <span className="text-xs font-mono uppercase tracking-wider text-[var(--accent)] font-semibold">
            Brand Identity & System
          </span>
        </div>

        {/* Header */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight text-[var(--text)]">
            NeuroVoice Brand Identity System
          </h1>
          <p className="text-base text-[var(--muted)] max-w-2xl leading-relaxed">
            Designed for clinical trust, acoustic precision, and immediate legibility across hospital monitors,
            rural mobile browsers, and diagnostic reports.
          </p>
        </div>

        {/* 3 Logo Concepts */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-display font-bold text-[var(--text)]">
              Logo Mark Exploration
            </h2>
            <span className="text-xs text-[var(--muted)]">Concept A is selected as default</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Concept A */}
            <div
              onClick={() => setSelectedConcept('A')}
              className={`p-6 rounded-2xl cursor-pointer transition-all border ${
                selectedConcept === 'A'
                  ? 'border-[var(--primary)] bg-[var(--surface)] shadow-md ring-2 ring-[var(--primary)]/20'
                  : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--muted)]'
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
                  Concept A · Default Selected
                </span>
                {selectedConcept === 'A' && <Check size={16} className="text-[var(--primary)]" />}
              </div>
              <div className="h-28 flex items-center justify-center bg-[var(--surface-2)] rounded-xl border border-[var(--border)] mb-4">
                <Logo concept="A" size="lg" showWordmark={false} href="" />
              </div>
              <h3 className="font-display font-bold text-base mb-1">Acoustic Wave to Neuron Node</h3>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                A clean harmonic sound wave transitioning directly into a synaptic neuron body. Balances vocal acoustics with neurological science. Scales down to 32px favicon flawlessly.
              </p>
            </div>

            {/* Concept B */}
            <div
              onClick={() => setSelectedConcept('B')}
              className={`p-6 rounded-2xl cursor-pointer transition-all border ${
                selectedConcept === 'B'
                  ? 'border-[var(--primary)] bg-[var(--surface)] shadow-md ring-2 ring-[var(--primary)]/20'
                  : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--muted)]'
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  Concept B · Lettermark
                </span>
                {selectedConcept === 'B' && <Check size={16} className="text-[var(--primary)]" />}
              </div>
              <div className="h-28 flex items-center justify-center bg-[var(--surface-2)] rounded-xl border border-[var(--border)] mb-4">
                <Logo concept="B" size="lg" showWordmark={false} href="" />
              </div>
              <h3 className="font-display font-bold text-base mb-1">Geometric "NV" Monogram</h3>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                Precision sans monogram where the diagonal paths of N and V are bisected by an acoustic frequency line. High modern clinical feel.
              </p>
            </div>

            {/* Concept C */}
            <div
              onClick={() => setSelectedConcept('C')}
              className={`p-6 rounded-2xl cursor-pointer transition-all border ${
                selectedConcept === 'C'
                  ? 'border-[var(--primary)] bg-[var(--surface)] shadow-md ring-2 ring-[var(--primary)]/20'
                  : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--muted)]'
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  Concept C · Organic Acoustic
                </span>
                {selectedConcept === 'C' && <Check size={16} className="text-[var(--primary)]" />}
              </div>
              <div className="h-28 flex items-center justify-center bg-[var(--surface-2)] rounded-xl border border-[var(--border)] mb-4">
                <Logo concept="C" size="lg" showWordmark={false} href="" />
              </div>
              <h3 className="font-display font-bold text-base mb-1">Cerebral Contour & Equalizer</h3>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                Left hemisphere rendered in anatomical cranial stroke, while the right hemisphere is represented by 3 dynamic vertical voice analysis bars.
              </p>
            </div>
          </div>
        </div>

        {/* Live Wordmark Preview across backgrounds */}
        <div className="space-y-4">
          <h2 className="text-xl font-display font-bold text-[var(--text)]">Wordmark on Light & Dark Surfaces</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 rounded-2xl bg-white border border-[#D5DBE8] flex flex-col items-center justify-center gap-3">
              <span className="text-xs font-mono uppercase tracking-wider text-gray-500">Light Surface (Default)</span>
              <Logo concept={selectedConcept} size="lg" href="" />
            </div>
            <div className="p-8 rounded-2xl bg-[#0A0F1E] border border-[#263345] flex flex-col items-center justify-center gap-3">
              <span className="text-xs font-mono uppercase tracking-wider text-gray-400">Dark Surface</span>
              <Logo concept={selectedConcept} size="lg" href="" />
            </div>
          </div>
        </div>

        {/* Color Palette Tokens */}
        <div className="space-y-4">
          <h2 className="text-xl font-display font-bold text-[var(--text)]">Clinical Color Architecture</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {palette.map((c) => (
              <div
                key={c.name}
                className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-start gap-3"
              >
                <div
                  className="w-10 h-10 rounded-lg shrink-0 border border-black/10 shadow-sm"
                  style={{ backgroundColor: c.hex }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-[var(--text)] truncate">{c.name}</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(c.hex)}
                      className="text-[11px] font-mono text-[var(--muted)] hover:text-[var(--primary)] flex items-center gap-1"
                    >
                      {copiedHex === c.hex ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                      {c.hex}
                    </button>
                  </div>
                  <div className="text-[11px] font-mono text-[var(--muted)] mt-0.5">{c.token}</div>
                  <div className="text-[11px] text-[var(--muted)] mt-1">{c.use}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
