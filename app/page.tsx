import { Navbar } from '@/components/landing/Navbar'
import { HeroSection } from '@/components/landing/HeroSection'
import { WaveformSection } from '@/components/landing/WaveformSection'
import { DisordersSection } from '@/components/landing/DisordersSection'
import { PipelineSection } from '@/components/landing/PipelineSection'
import { UserTypesSection } from '@/components/landing/UserTypesSection'
import { TrustSection } from '@/components/landing/TrustSection'
import { Footer } from '@/components/landing/Footer'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col selection:bg-cyan-500/25 selection:text-cyan-200">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <WaveformSection />
        <DisordersSection />
        <PipelineSection />
        <UserTypesSection />
        <TrustSection />
      </main>
      <Footer />
    </div>
  )
}
