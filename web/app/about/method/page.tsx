import React from 'react'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, AlertCircle, Info, BookOpen, Layers, BarChart3, ShieldAlert } from 'lucide-react'
import { BRAND } from '@/lib/brand'

export default function ScientificMethodPage() {
  const biomarkers = [
    {
      feature: 'Fundamental Frequency (F0) & Coeff of Variation',
      description: 'Quantifies vocal pitch stability and breath support over a steady vowel sound.',
      normal: 'F0 CV < 2.5%, Range: 85–255 Hz',
      citation: 'Little et al. (2007) · Biomedical Engineering',
    },
    {
      feature: 'Local Jitter (Relative perturbation)',
      description: 'Cycle-to-cycle frequency variation measuring micro-tremor in vocal fold tension.',
      normal: '< 1.04% in healthy sustained /a/',
      citation: 'Baken & Orlikoff (2000) · Clinical Measurement of Speech',
    },
    {
      feature: 'Local Shimmer & APQ (Amplitude perturbation)',
      description: 'Cycle-to-cycle peak amplitude fluctuation indicating incomplete glottal adduction.',
      normal: '< 3.07% to 3.81%',
      citation: 'Tsanas et al. (2012) · Biomedical Engineering',
    },
    {
      feature: 'Harmonics-to-Noise Ratio (HNR)',
      description: 'Ratio of periodic acoustic energy to turbulent transglottal air leakage.',
      normal: '> 20 dB for clear phonation',
      citation: 'Ferrand (2002) · Journal of Voice',
    },
    {
      feature: 'Recurrence Period Density Entropy (RPDE)',
      description: 'Measures vocal fold non-linear dynamical periodicity and turbulent biomechanical chaos.',
      normal: '< 0.45 non-dimensional entropy',
      citation: 'Little et al. (2007) · BioMedical Engineering OnLine',
    },
    {
      feature: 'Pitch Period Entropy (PPE)',
      description: 'Evaluates dysphonia on logarithmic semitone scales, insensitive to intentional pitch shifts.',
      normal: '< 0.20 entropy units',
      citation: 'Tsanas et al. (2010) · Royal Society Interface',
    },
    {
      feature: 'Speech Pause Ratio & Articulation Rate',
      description: 'Ratio of inter-phrase silent intervals to vocalized duration in reading / conversational tasks.',
      normal: 'Pause ratio < 0.25; Rate 3.8–5.2 syl/s',
      citation: 'Horley et al. (2010) · Journal of Neurolinguistics',
    },
    {
      feature: 'Standard Acoustic Functional Vector',
      description: 'Standardized clinical functionals including spectral flux, alpha ratio, and Hammarberg index.',
      normal: 'Normalized multi-dimensional acoustic centroid',
      citation: 'Eyben et al. (2016) · Acoustic Computing',
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
            Scientific Protocol & Methodology
          </span>
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-[var(--text)] tracking-tight">
            How NeuroVoice Measures Vocal Biomarkers
          </h1>
          <p className="text-base text-[var(--muted)] leading-relaxed">
            The human voice is produced by the coordinated action of the respiratory system, laryngeal muscles, and over 100 articulatory muscles innervated by multiple cranial nerves. Neurodegenerative and cerebrovascular conditions subtly alter this neuromuscular coordination years before overt motor symptoms emerge.
          </p>
        </div>

        {/* Triple Feature Extraction Architecture */}
        <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm space-y-4">
          <h2 className="text-lg font-display font-bold text-[var(--text)] flex items-center gap-2">
            <Layers className="text-[var(--primary)]" size={20} />
            Triple-Branch Feature Extraction Architecture
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] space-y-2">
              <span className="text-xs font-mono font-bold text-[var(--primary)] uppercase">Branch A · Standard Acoustic Metrics</span>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                Uses <strong>openSMILE</strong> to extract 88 standardized clinical functionals capturing spectral slope, loudness dynamics, and harmonic energy.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] space-y-2">
              <span className="text-xs font-mono font-bold text-[var(--accent)] uppercase">Branch B · Native Phonetics</span>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                Uses <strong>Parselmouth (Praat C++)</strong> and <strong>librosa</strong> for cycle-by-cycle pitch tracking (F0), local jitter, local shimmer, HNR, and formant contours.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] space-y-2">
              <span className="text-xs font-mono font-bold text-[var(--warning)] uppercase">Branch C · Deep Representation</span>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                Uses self-supervised <strong>Wav2Vec 2.0</strong> to derive 512-dimensional contextual phonetic embeddings from raw speech waveforms.
              </p>
            </div>
          </div>
        </div>

        {/* Biomarkers Table */}
        <div className="space-y-4">
          <h2 className="text-lg font-display font-bold text-[var(--text)] flex items-center gap-2">
            <BarChart3 className="text-[var(--primary)]" size={20} />
            Clinical Biomarkers & Published Reference Ranges
          </h2>
          <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface)]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[var(--surface-2)] border-b border-[var(--border)] text-[var(--muted)] uppercase font-mono">
                <tr>
                  <th className="py-3 px-4">Biomarker</th>
                  <th className="py-3 px-4">Physiological Indication</th>
                  <th className="py-3 px-4">Typical Reference</th>
                  <th className="py-3 px-4">Scientific Citation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {biomarkers.map((b) => (
                  <tr key={b.feature} className="hover:bg-[var(--surface-2)]/50">
                    <td className="py-3 px-4 font-semibold text-[var(--text)]">{b.feature}</td>
                    <td className="py-3 px-4 text-[var(--muted)]">{b.description}</td>
                    <td className="py-3 px-4 font-mono text-[var(--accent)]">{b.normal}</td>
                    <td className="py-3 px-4 text-[var(--muted)] italic">{b.citation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Explainability with SHAP */}
        <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm space-y-3">
          <h2 className="text-lg font-display font-bold text-[var(--text)]">
            Transparent Interpretability (SHAP Feature Attribution)
          </h2>
          <p className="text-xs text-[var(--muted)] leading-relaxed">
            Rather than producing uninterpretable "black box" numbers, NeuroVoice executes SHAP (SHapley Additive exPlanations) on the combined feature vector. For every individual screening, the system identifies the specific acoustic components (e.g. pitch stability, amplitude perturbation, pause cadence) that influenced the result toward or away from normative boundaries.
          </p>
        </div>

        {/* Validation & Limitations Notice */}
        <div className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 space-y-2">
          <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-bold text-sm">
            <AlertCircle size={18} />
            <span>Clinical Boundaries & Validation Status</span>
          </div>
          <p className="text-xs text-amber-800 dark:text-amber-300/90 leading-relaxed">
            NeuroVoice outputs are <strong>screening indications, not clinical diagnoses</strong>. Acoustical factors such as vocal fatigue, ambient acoustic noise, microphony quality, respiratory infections, and emotional state can alter acoustic parameters. Any elevated risk indication requires clinical examination by a certified neurologist or speech-language pathologist.
          </p>
        </div>
      </div>
    </div>
  )
}
