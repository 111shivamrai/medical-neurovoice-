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
  title: 'NeuroVoice — Your Voice Carries the Truth. We Listen for It.',
  description: "NeuroVoice analyses acoustic biomarkers in your speech to detect early signs of Parkinson's, Alzheimer's, dysarthria and post-stroke impairment — in 30 seconds, in Hindi or English, on any device. Developed under Jabalpur Medical College, MP, India.",
  keywords: [
    'neurological screening',
    'voice analysis AI',
    'Parkinson detection speech',
    "Alzheimer's acoustic biomarkers",
    'dysarthria speech screening',
    'stroke rehabilitation voice',
    'Jabalpur Medical College',
    'Hindi medical AI',
    'telemedicine MP India',
  ],
  authors: [{ name: 'Jabalpur Medical College & NeuroVoice AI Research' }],
  openGraph: {
    title: 'NeuroVoice — Medical Neurological Speech AI',
    description: "Detect early signs of Parkinson's, Alzheimer's, dysarthria and post-stroke cognitive impairment through 30-second voice biomarkers.",
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
    <html lang="en" suppressHydrationWarning className="dark">
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
