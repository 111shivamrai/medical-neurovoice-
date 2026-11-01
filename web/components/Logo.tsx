import Link from 'next/link'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function Logo({ className = '', size = 'md' }: LogoProps) {
  const svgSize = size === 'sm' ? 32 : size === 'lg' ? 56 : 40
  const textClass = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-3xl' : 'text-xl'

  return (
    <Link href="/" className={`flex items-center gap-3 ${className}`} aria-label="NeuroVoice Home">
      <svg
        width={svgSize}
        height={svgSize}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Brain left half */}
        <path
          d="M20 34C12 34 5.5 27.5 5.5 19.5C5.5 15 7.5 11 11 8.5C10.5 7 11 5 12.5 4C14 3 16 3.5 17 4.5C18 3.5 19 3 20 3"
          stroke="#6366F1"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M7 14C6 15.5 5.5 17.5 5.5 19.5C5.5 27.5 12 34 20 34"
          stroke="#6366F1"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.5"
        />
        {/* Center line */}
        <line x1="20" y1="5" x2="20" y2="34" stroke="#6366F1" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.3" />
        {/* Brain right top arc */}
        <path
          d="M20 3C21 3 22 3.5 23 4.5C24 3.5 26 3 27.5 4C29 5 29.5 7 29 8.5C32.5 11 34.5 15 34.5 19.5C34.5 27.5 28 34 20 34"
          stroke="#6366F1"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        {/* Soundwave bars (right side) */}
        <rect x="22" y="21" width="2.5" height="10" rx="1.25" fill="#22D3EE">
          <animate attributeName="height" values="10;15;10" dur="1.4s" repeatCount="indefinite" />
          <animate attributeName="y" values="21;16;21" dur="1.4s" repeatCount="indefinite" />
        </rect>
        <rect x="26" y="17" width="2.5" height="14" rx="1.25" fill="#22D3EE">
          <animate attributeName="height" values="14;20;14" dur="1.4s" begin="0.2s" repeatCount="indefinite" />
          <animate attributeName="y" values="17;11;17" dur="1.4s" begin="0.2s" repeatCount="indefinite" />
        </rect>
        <rect x="30" y="20" width="2.5" height="11" rx="1.25" fill="#22D3EE" opacity="0.85">
          <animate attributeName="height" values="11;17;11" dur="1.4s" begin="0.4s" repeatCount="indefinite" />
          <animate attributeName="y" values="20;14;20" dur="1.4s" begin="0.4s" repeatCount="indefinite" />
        </rect>
      </svg>
      <span
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 700,
          fontSize: size === 'sm' ? '1.125rem' : size === 'lg' ? '1.875rem' : '1.25rem',
          letterSpacing: '-0.025em',
        }}
      >
        <span style={{ color: 'var(--text-primary)' }}>Neuro</span>
        <span style={{ color: '#22D3EE' }}>Voice</span>
      </span>
    </Link>
  )
}
