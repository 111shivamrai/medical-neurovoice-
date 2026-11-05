'use client'

import React from 'react'
import Link from 'next/link'

interface LogoProps {
  concept?: 'A' | 'B' | 'C'
  size?: 'sm' | 'md' | 'lg'
  showWordmark?: boolean
  className?: string
  href?: string
}

export function Logo({
  concept = 'A',
  size = 'md',
  showWordmark = true,
  className = '',
  href = '/',
}: LogoProps) {
  // Dimensions
  const dim = {
    sm: { icon: 24, text: 'text-base', spacing: 'gap-2' },
    md: { icon: 32, text: 'text-xl', spacing: 'gap-2.5' },
    lg: { icon: 44, text: 'text-2xl', spacing: 'gap-3.5' },
  }[size]

  // Render Mark based on concept
  const renderMark = () => {
    if (concept === 'B') {
      // Concept B: "NV" Lettermark with soundwave crossing
      return (
        <svg
          width={dim.icon}
          height={dim.icon}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0"
        >
          <rect width="32" height="32" rx="8" fill="var(--surface-2)" stroke="var(--border)" strokeWidth="1.5" />
          <path d="M8 22V10L14 18V10" stroke="var(--primary)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M17 10L21 22L25 10" stroke="var(--accent)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 16H26" stroke="var(--primary)" strokeWidth="1.5" strokeDasharray="1.5 2" opacity="0.6" />
        </svg>
      )
    }

    if (concept === 'C') {
      // Concept C: Minimalist brain outline + right audio bars
      return (
        <svg
          width={dim.icon}
          height={dim.icon}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0"
        >
          <rect width="32" height="32" rx="8" fill="var(--surface-2)" stroke="var(--border)" strokeWidth="1.5" />
          <path
            d="M16 6C12 6 9 9 9 13C9 15.5 10.5 17.5 12 18.5V23C12 24.5 13.5 26 16 26"
            stroke="var(--primary)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path d="M19 11V21" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M22 8V24" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M25 13V19" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      )
    }

    // Concept A (Default): Waveform that resolves into a neuron node
    return (
      <svg
        width={dim.icon}
        height={dim.icon}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform hover:scale-105"
      >
        {/* Subtle base card badge */}
        <rect width="32" height="32" rx="8" fill="var(--surface-2)" stroke="var(--border)" strokeWidth="1.2" />
        {/* Acoustic Waveform Bars with subtle wave animation */}
        <line x1="7" y1="14" x2="7" y2="18" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round">
          <animate attributeName="y1" values="14;12;14" dur="1.6s" repeatCount="indefinite" />
          <animate attributeName="y2" values="18;20;18" dur="1.6s" repeatCount="indefinite" />
        </line>
        <line x1="10" y1="11" x2="10" y2="21" stroke="var(--primary)" strokeWidth="2.2" strokeLinecap="round">
          <animate attributeName="y1" values="11;8;11" dur="1.4s" begin="0.2s" repeatCount="indefinite" />
          <animate attributeName="y2" values="21;24;21" dur="1.4s" begin="0.2s" repeatCount="indefinite" />
        </line>
        <line x1="13" y1="9" x2="13" y2="23" stroke="var(--primary)" strokeWidth="2.2" strokeLinecap="round">
          <animate attributeName="y1" values="9;6;9" dur="1.5s" begin="0.4s" repeatCount="indefinite" />
          <animate attributeName="y2" values="23;26;23" dur="1.5s" begin="0.4s" repeatCount="indefinite" />
        </line>
        {/* Transitioning bridge path connecting to neuron node */}
        <path d="M13 16H20" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />
        {/* Neuron Soma (Central Node) */}
        <circle cx="21.5" cy="16" r="3.5" fill="var(--accent)" stroke="var(--surface)" strokeWidth="1.5" />
        {/* Axon / Synaptic Projections */}
        <path d="M24 13.5L26.5 11" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M25 16H27" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M24 18.5L26.5 21" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    )
  }

  const content = (
    <div className={`inline-flex items-center ${dim.spacing} ${className}`}>
      {renderMark()}
      {showWordmark && (
        <span className={`font-display tracking-tight text-[var(--text)] font-normal ${dim.text}`}>
          <span className="font-bold text-[var(--text)]">Neuro</span>
          <span className="font-normal text-[var(--text-muted)]">Voice</span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--accent)] ml-0.5 mb-1" />
        </span>
      )}
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center group">
        {content}
      </Link>
    )
  }

  return content
}
