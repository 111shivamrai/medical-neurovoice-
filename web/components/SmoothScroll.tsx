'use client'

import { useEffect, ReactNode } from 'react'

export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    let lenis: any = null
    let animId: number = 0

    try {
      // Dynamic import to safeguard client execution
      import('lenis').then(({ default: LenisClass }) => {
        lenis = new LenisClass({
          duration: 1.2,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          orientation: 'vertical',
          smoothWheel: true,
        })

        function raf(time: number) {
          lenis?.raf?.(time)
          animId = requestAnimationFrame(raf)
        }

        animId = requestAnimationFrame(raf)
      }).catch(err => {
        console.warn('Smooth scroll initialization fallback:', err)
      })
    } catch (e) {
      console.warn('Lenis smooth scroll error:', e)
    }

    return () => {
      if (animId) cancelAnimationFrame(animId)
      lenis?.destroy?.()
    }
  }, [])

  return <>{children}</>
}
