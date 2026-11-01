import React from 'react'
import Link from 'next/link'
import { ArrowLeft, ShieldCheck, ExternalLink, FileText } from 'lucide-react'
import { BRAND } from '@/lib/brand'

export default function LicensesPage() {
  const assets = [
    {
      title: 'Head and Neck Anatomical Vector Illustration',
      category: 'Medical Graphics & Vector Art',
      license: 'Creative Commons CC-BY 4.0 / Public Domain Adapted',
      author: 'NeuroVoice Clinical Design Team / Biomedical Vector Project',
      details: 'Synthesized anatomical illustration depicting motor cortex, cranial pathways, vocal fold laryngeal structures, and vocal tract articulators.',
      link: 'https://creativecommons.org/licenses/by/4.0/',
    },
    {
      title: 'openSMILE (open Speech and Music Interpretation by Large-space Extraction)',
      category: 'Acoustic Feature Extraction',
      license: 'AudEERING Research / MIT License',
      author: 'audEERING GmbH',
      details: 'Calculates the standardized 88 clinical eGeMAPSv02 (extended Geneva Minimalistic Acoustic Parameter Set) feature vector.',
      link: 'https://www.audeering.com/research/opensmile/',
    },
    {
      title: 'Praat & Parselmouth (C++ Phonetics Bindings)',
      category: 'Acoustic Signal Processing',
      license: 'GNU General Public License (GPL) v3.0 / MIT',
      author: 'Paul Boersma, David Weenink / Yannick Jadoul',
      details: 'Native phonetic algorithms for precise fundamental frequency (F0), pitch perturbation (jitter), amplitude perturbation (shimmer), harmonics-to-noise ratio (HNR), and formant extraction.',
      link: 'https://github.com/YannickJadoul/Parselmouth',
    },
    {
      title: 'Wav2Vec 2.0 Pretrained Acoustic Representations',
      category: 'Self-Supervised Speech Representations',
      license: 'Apache License 2.0',
      author: 'Meta AI / Hugging Face Transformers',
      details: 'facebook/wav2vec2-base latent phonetic embeddings extracted from 512-dimensional encoder states.',
      link: 'https://huggingface.co/facebook/wav2vec2-base',
    },
    {
      title: 'SHAP (SHapley Additive exPlanations)',
      category: 'Model Interpretability',
      license: 'MIT License',
      author: 'Scott Lundberg',
      details: 'Game theoretic feature attribution measuring each vocal biomarker deviation from healthy baselines.',
      link: 'https://github.com/slundberg/shap',
    },
  ]

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--muted)] hover:text-[var(--text)] transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to NeuroVoice</span>
          </Link>
          <span className="text-xs font-mono uppercase tracking-wider text-[var(--accent)] font-semibold">
            Open Source & Asset Licenses
          </span>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-display font-extrabold text-[var(--text)]">
            Licenses, Attribution & Scientific Sources
          </h1>
          <p className="text-sm text-[var(--muted)] leading-relaxed">
            NeuroVoice adheres to open scientific standards, transparent licensing, and verified academic attributions across all visual, acoustic, and mathematical components.
          </p>
        </div>

        <div className="space-y-4">
          {assets.map((a) => (
            <div
              key={a.title}
              className="p-6 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-sm space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h2 className="text-base font-bold text-[var(--text)] flex items-center gap-2">
                  <FileText size={18} className="text-[var(--primary)]" />
                  {a.title}
                </h2>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-[var(--surface-2)] text-[var(--text)] border border-[var(--border)]">
                  {a.license}
                </span>
              </div>
              <div className="text-xs font-medium text-[var(--accent)]">{a.category} · {a.author}</div>
              <p className="text-xs text-[var(--muted)] leading-relaxed">{a.details}</p>
              <div className="pt-1">
                <a
                  href={a.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--primary)] hover:underline"
                >
                  <span>License Details & Repository</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="p-5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-xs text-[var(--muted)] space-y-2">
          <div className="font-bold text-[var(--text)]">Legal & Research Note:</div>
          <p>
            {BRAND.screeningDisclaimer}
          </p>
        </div>
      </div>
    </div>
  )
}
