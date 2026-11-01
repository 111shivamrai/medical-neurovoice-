import type { Metadata, Viewport } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { SmoothScroll } from '@/components/SmoothScroll'

export const viewport: Viewport = {
  themeColor: '#0A0F1E',
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: 'NeuroVoice — Vocal Neurological Screening Support & Research Tool',
  description: "NeuroVoice analyses acoustic biomarkers in your speech to detect early signs of Parkinson's, Alzheimer's, dysarthria and post-stroke cognitive impairment — in 30 seconds, in Hindi or English, on any device.",
  keywords: [
    'neurological screening',
    'voice analysis AI',
    'Parkinson detection speech',
    "Alzheimer's acoustic biomarkers",
    'dysarthria speech screening',
    'post-stroke cognitive impairment',
    'Hindi voice AI',
    'vocal biomarkers',
  ],
  authors: [{ name: 'NeuroVoice AI Research' }],
  openGraph: {
    title: 'NeuroVoice — Vocal Neurological Screening Support',
    description: "Screen for early vocal signs of Parkinson's, Alzheimer's, dysarthria and post-stroke cognitive impairment through 30-second voice biomarkers.",
    type: 'website',
    locale: 'en_IN',
    siteName: 'NeuroVoice',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
        <ThemeProvider>
          <SmoothScroll>
            {children}
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  )
}
