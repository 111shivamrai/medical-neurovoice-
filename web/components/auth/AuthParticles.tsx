'use client'

import React, { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  size: number
  speedY: number
  speedX: number
  opacity: number
  color: string
}

export function AuthParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number

    const resize = () => {
      canvas.width = canvas.parentElement?.offsetWidth || window.innerWidth
      canvas.height = canvas.parentElement?.offsetHeight || window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const PARTICLE_COUNT = 65
    const colors = ['#6366F1', '#22D3EE', '#818CF8', '#38BDF8']

    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2.2 + 0.8,
      speedY: -(Math.random() * 0.7 + 0.3), // Float upward
      speedX: (Math.random() - 0.5) * 0.35,
      opacity: Math.random() * 0.6 + 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
    }))

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.y += p.speedY
        p.x += p.speedX

        // Loop back to bottom
        if (p.y < -10) {
          p.y = canvas.height + 10
          p.x = Math.random() * canvas.width
        }
        if (p.x < -10) p.x = canvas.width + 10
        if (p.x > canvas.width + 10) p.x = -10

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.opacity
        ctx.shadowBlur = 8
        ctx.shadowColor = p.color
        ctx.fill()
        ctx.shadowBlur = 0
        ctx.globalAlpha = 1
      }

      animId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      aria-hidden="true"
    />
  )
}
