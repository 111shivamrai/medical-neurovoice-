'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Clock, Hourglass, MapPin, AlertCircle } from 'lucide-react'

export function ProblemSection() {
  const problems = [
    {
      icon: Clock,
      stat: '5–10 Years',
      title: "Parkinson's takes 5–10 years to formally diagnose",
      description:
        'By the time visible motor tremors appear, over 60% of dopamine-producing substantia nigra neurons have already been irreversibly lost.',
      source: 'Mahlknecht et al., Journal of Parkinson’s Disease (2020)',
    },
    {
      icon: Hourglass,
      stat: 'Pre-Symptomatic',
      title: 'Alzheimer’s intervention windows close early',
      description:
        'Subtle acoustic speech pause patterns and lexical changes occur years before overt memory loss, yet standard clinical cognitive batteries miss early acoustic signatures.',
      source: 'DementiaBank Clinical Acoustic Studies (2021)',
    },
    {
      icon: MapPin,
      stat: 'Severe Disparity',
      title: 'Specialist access in regional India remains limited',
      description:
        'Over 70% of neurological specialists practice in metro centers, leaving rural populations and district health centers without objective, non-invasive screening tools.',
      source: 'Neurology India / WHO Health Workforce Report',
    },
  ]

  return (
    <section id="problem" className="py-24 px-4 sm:px-6 lg:px-8 bg-[var(--surface)] border-y border-[var(--border)] transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-4 bg-[var(--danger)]/10 text-[var(--danger)] border border-[var(--danger)]/20">
            The Clinical Reality
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-[var(--text)] tracking-tight mb-4">
            Most neurological disorders are diagnosed too late.
          </h2>
          <p className="text-base sm:text-lg text-[var(--text-muted)] leading-relaxed">
            Neurological changes start years before severe physical symptoms. Voice is the earliest motor-cognitive system to degrade.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {problems.map((prob, idx) => {
            const Icon = prob.icon
            return (
              <motion.div
                key={prob.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="p-8 rounded-2xl bg-[var(--bg)] border border-[var(--border)] hover:border-[var(--primary)] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[var(--primary)]/10 text-[var(--primary)] mb-6">
                    <Icon size={24} />
                  </div>
                  <div className="text-2xl font-display font-bold text-[var(--accent)] mb-2">
                    {prob.stat}
                  </div>
                  <h3 className="text-lg font-bold text-[var(--text)] mb-3 leading-snug">
                    {prob.title}
                  </h3>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-6">
                    {prob.description}
                  </p>
                </div>
                <div className="pt-4 border-t border-[var(--border)] text-xs font-mono text-[var(--text-muted)]">
                  Source: {prob.source}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
