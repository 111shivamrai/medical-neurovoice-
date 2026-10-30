'use client'

import React from 'react'
import Link from 'next/link'
import { Logo } from '@/components/Logo'
import { Mail, ShieldAlert, FileText, Heart, MapPin } from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'

function GithubIcon({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  )
}

export function Footer() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <footer
      className="border-t pt-16 pb-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300"
      style={{
        background: isDark ? '#050811' : '#F1F5F9',
        borderColor: isDark ? '#1F2937' : '#E2E8F0',
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Column (2 cols wide on desktop) */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="md" />
            <p
              className="text-sm font-medium leading-relaxed max-w-sm"
              style={{ color: '#22D3EE' }}
            >
              "Your Voice Carries the Truth. We Listen for It."
            </p>
            <p
              className="text-xs leading-relaxed max-w-sm"
              style={{ color: isDark ? '#9CA3AF' : '#64748B' }}
            >
              NeuroVoice is an acoustic biomarker screening system developed under Jabalpur Medical College,
              empowering early detection of Parkinson's, Alzheimer's, Dysarthria, and post-stroke impairments.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-gray-400 pt-2">
              <MapPin size={14} className="text-indigo-400" />
              <span>Jabalpur Medical College, Madhya Pradesh, India</span>
            </div>
          </div>

          {/* Column 2: Clinical Screening */}
          <div>
            <h4
              className="font-display font-bold text-sm tracking-wide uppercase mb-4"
              style={{ color: isDark ? '#F9FAFB' : '#0F172A' }}
            >
              Clinical Screening
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="#disorders" className="hover:text-cyan-400 transition-colors" style={{ color: isDark ? '#9CA3AF' : '#64748B' }}>
                  Parkinson's Disease (PD)
                </Link>
              </li>
              <li>
                <Link href="#disorders" className="hover:text-cyan-400 transition-colors" style={{ color: isDark ? '#9CA3AF' : '#64748B' }}>
                  Alzheimer's Disease (AD)
                </Link>
              </li>
              <li>
                <Link href="#disorders" className="hover:text-cyan-400 transition-colors" style={{ color: isDark ? '#9CA3AF' : '#64748B' }}>
                  Motor Dysarthria (MD)
                </Link>
              </li>
              <li>
                <Link href="#disorders" className="hover:text-cyan-400 transition-colors" style={{ color: isDark ? '#9CA3AF' : '#64748B' }}>
                  Post-Stroke Cognitive Track
                </Link>
              </li>
              <li>
                <Link href="#pipeline" className="hover:text-cyan-400 transition-colors" style={{ color: isDark ? '#9CA3AF' : '#64748B' }}>
                  9-Stage Pipeline Specs
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform & Research */}
          <div>
            <h4
              className="font-display font-bold text-sm tracking-wide uppercase mb-4"
              style={{ color: isDark ? '#F9FAFB' : '#0F172A' }}
            >
              Research & Protocols
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="#research" className="hover:text-cyan-400 transition-colors" style={{ color: isDark ? '#9CA3AF' : '#64748B' }}>
                  Research Papers (19 Citations)
                </Link>
              </li>
              <li>
                <Link href="#research" className="hover:text-cyan-400 transition-colors" style={{ color: isDark ? '#9CA3AF' : '#64748B' }}>
                  UCI & UA-Speech Benchmarks
                </Link>
              </li>
              <li>
                <Link href="#personas" className="hover:text-cyan-400 transition-colors" style={{ color: isDark ? '#9CA3AF' : '#64748B' }}>
                  Rural ASHA Worker Mode
                </Link>
              </li>
              <li>
                <Link href="#personas" className="hover:text-cyan-400 transition-colors" style={{ color: isDark ? '#9CA3AF' : '#64748B' }}>
                  Neurologist Portal
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-cyan-400 transition-colors" style={{ color: isDark ? '#9CA3AF' : '#64748B' }}>
                  Medical Student Datasets
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Institution & Links */}
          <div>
            <h4
              className="font-display font-bold text-sm tracking-wide uppercase mb-4"
              style={{ color: isDark ? '#F9FAFB' : '#0F172A' }}
            >
              Documentation & Legal
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a
                  href="https://github.com/111shivamrai/medical-neurovoice-"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
                  style={{ color: isDark ? '#9CA3AF' : '#64748B' }}
                >
                  <GithubIcon size={13} />
                  <span>GitHub Repository</span>
                </a>
              </li>
              <li>
                <Link href="#research" className="hover:text-cyan-400 transition-colors" style={{ color: isDark ? '#9CA3AF' : '#64748B' }}>
                  Clinical Protocol Document
                </Link>
              </li>
              <li>
                <Link href="/signin" className="hover:text-cyan-400 transition-colors" style={{ color: isDark ? '#9CA3AF' : '#64748B' }}>
                  Doctor Sign In
                </Link>
              </li>
              <li>
                <a
                  href="mailto:contact@neurovoice.in"
                  className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
                  style={{ color: isDark ? '#9CA3AF' : '#64748B' }}
                >
                  <Mail size={13} />
                  <span>Contact Research Team</span>
                </a>
              </li>
              <li>
                <Link href="#" className="hover:text-cyan-400 transition-colors" style={{ color: isDark ? '#9CA3AF' : '#64748B' }}>
                  Privacy & Data Ethics Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Mandatory Medical Disclaimer Banner */}
        <div
          className="p-4 sm:p-5 rounded-xl border mb-10 flex flex-col sm:flex-row items-start sm:items-center gap-3.5"
          style={{
            background: isDark ? 'rgba(239, 68, 68, 0.06)' : 'rgba(239, 68, 68, 0.04)',
            borderColor: isDark ? 'rgba(239, 68, 68, 0.25)' : 'rgba(239, 68, 68, 0.2)',
          }}
        >
          <ShieldAlert size={20} className="text-red-400 flex-shrink-0 mt-0.5 sm:mt-0" />
          <p className="text-xs leading-relaxed" style={{ color: isDark ? '#FCA5A5' : '#B91C1C' }}>
            <strong>Medical Research & Regulatory Notice:</strong> Developed under Jabalpur Medical College, MP, India.
            NeuroVoice is an acoustic biomarker screening tool intended exclusively for clinical research, triage, and epidemiological surveillance.
            It is <u>not</u> an autonomous clinical diagnostic device. All risk indices and reports must be evaluated by a certified neurologist.
          </p>
        </div>

        {/* Copyright and Legal Credits */}
        <div
          className="pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono"
          style={{
            borderColor: isDark ? '#1F2937' : '#E2E8F0',
            color: isDark ? '#6B7280' : '#94A3B8',
          }}
        >
          <div>
            © 2026 NeuroVoice. Developed under Jabalpur Medical College, MP, India. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <a
              href="https://github.com/111shivamrai/medical-neurovoice-"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-400 transition-colors"
            >
              GitHub
            </a>
            <Link href="#research" className="hover:text-indigo-400 transition-colors">
              Research Paper
            </Link>
            <Link href="#" className="hover:text-indigo-400 transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
