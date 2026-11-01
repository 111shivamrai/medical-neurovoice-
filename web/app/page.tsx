import { Navbar } from '@/components/landing/Navbar'
import { HeroSection } from '@/components/landing/HeroSection'
import { ProblemSection } from '@/components/landing/ProblemSection'
import { WaveformSection } from '@/components/landing/WaveformSection'
import { ConditionsSection } from '@/components/landing/ConditionsSection'
import { PipelineSection } from '@/components/landing/PipelineSection'
import { UserTypesSection } from '@/components/landing/UserTypesSection'
import { TrustSection } from '@/components/landing/TrustSection'
import { FAQSection } from '@/components/landing/FAQSection'
import { FinalCTASection } from '@/components/landing/FinalCTASection'
import { Footer } from '@/components/landing/Footer'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
      {/* 1. Navbar */}
      <Navbar />

      <main className="flex-1">
        {/* 2. Hero (3D robot + stacked copy) */}
        <HeroSection />

        {/* 3. The Problem (3 columns with citations) */}
        <ProblemSection />

        {/* 4. How It Works (3 big steps with waveform playhead) */}
        <WaveformSection />

        {/* 5. The 4 Conditions (Anatomical figure + 2x2 Bento grid) */}
        <ConditionsSection />

        {/* 6. 9-Stage Pipeline (Scroll storytelling) */}
        <PipelineSection />

        {/* 7. Who Uses NeuroVoice (3 persona cards) */}
        <UserTypesSection />

        {/* 8. Evidence & Trust (19 papers, datasets, honest limits) */}
        <TrustSection />

        {/* 9. FAQ (5 questions) */}
        <FAQSection />

        {/* 10. Final Call to Action */}
        <FinalCTASection />
      </main>

      {/* 11. Footer */}
      <Footer />
    </div>
  )
}
