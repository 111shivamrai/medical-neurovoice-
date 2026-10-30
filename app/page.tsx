import Link from 'next/link'

export default function Home() {
  return (
    <main style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: '#0A0F1E',
      color: '#F9FAFB',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>NeuroVoice</h1>
        <p style={{ color: '#9CA3AF' }}>Building...</p>
      </div>
    </main>
  )
}
