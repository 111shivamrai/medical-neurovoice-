'use client'

import React, { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const PARTICLE_COUNT = 3600

// Generate 3D point cloud of human brain anatomy
function generateBrainPoints(count: number): Float32Array {
  const positions = new Float32Array(count * 3)
  let index = 0

  while (index < count) {
    // Hemispherical brain lobes
    const u = Math.random()
    const v = Math.random()
    const theta = u * 2.0 * Math.PI
    const phi = Math.acos(2.0 * v - 1.0)
    const r = Math.cbrt(Math.random()) * 1.5

    // Ellipsoidal base shape
    let x = r * Math.sin(phi) * Math.cos(theta) * 1.35
    let y = r * Math.sin(phi) * Math.sin(theta) * 1.05
    let z = r * Math.cos(phi) * 1.2

    // Sulci / Gyri cortical folds (wrinkles)
    const folds = Math.sin(x * 6.0) * Math.cos(y * 6.0) * Math.sin(z * 6.0) * 0.12
    x += folds * (x > 0 ? 1 : -1)
    y += folds * 0.8
    z += folds * 1.1

    // Longitudinal fissure (separation between left & right hemispheres)
    if (Math.abs(x) < 0.18 && y > -0.3) {
      if (x >= 0) x += 0.12
      else x -= 0.12
    }

    // Cerebellum & brainstem base tuck
    if (y < -0.4 && z < -0.2) {
      y -= 0.25
      x *= 0.75
    }

    positions[index * 3] = x
    positions[index * 3 + 1] = y
    positions[index * 3 + 2] = z
    index++
  }
  return positions
}

// Generate soundwave/waveform 3D point cloud
function generateWavePoints(count: number): Float32Array {
  const positions = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    const fraction = i / count
    const x = (fraction - 0.5) * 6.0

    // Voice acoustic waveform profile (harmonic frequencies + formants)
    const envelope = Math.exp(-Math.pow(x / 2.2, 2))
    const freq1 = Math.sin(x * 8.0) * 0.95
    const freq2 = Math.sin(x * 16.0) * 0.45
    const freq3 = Math.cos(x * 32.0) * 0.25
    const jitter = (Math.random() - 0.5) * 0.15

    const y = (freq1 + freq2 + freq3 + jitter) * envelope * 1.35
    const z = (Math.random() - 0.5) * 0.45 * envelope

    positions[i * 3] = x
    positions[i * 3 + 1] = y
    positions[i * 3 + 2] = z
  }
  return positions
}

interface ParticleSceneProps {
  mouse: { x: number; y: number }
  isMobile: boolean
}

function ParticleMorphMesh({ mouse, isMobile }: ParticleSceneProps) {
  const pointsRef = useRef<THREE.Points>(null)
  const brainPositions = useMemo(() => generateBrainPoints(PARTICLE_COUNT), [])
  const wavePositions = useMemo(() => generateWavePoints(PARTICLE_COUNT), [])

  // Buffers
  const { geometry, posAttr, colAttr } = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const pos = new Float32Array(PARTICLE_COUNT * 3)
    const col = new Float32Array(PARTICLE_COUNT * 3)

    // Initial state: Brain in Indigo (#6366F1 -> 0.388, 0.400, 0.945)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3] = brainPositions[i * 3]
      pos[i * 3 + 1] = brainPositions[i * 3 + 1]
      pos[i * 3 + 2] = brainPositions[i * 3 + 2]

      col[i * 3] = 0.388
      col[i * 3 + 1] = 0.400
      col[i * 3 + 2] = 0.945
    }

    const positionAttribute = new THREE.BufferAttribute(pos, 3)
    const colorAttribute = new THREE.BufferAttribute(col, 3)
    geo.setAttribute('position', positionAttribute)
    geo.setAttribute('color', colorAttribute)

    return { geometry: geo, posAttr: positionAttribute, colAttr: colorAttribute }
  }, [brainPositions])

  const timeRef = useRef(0)

  useFrame((state, delta) => {
    if (!pointsRef.current) return
    timeRef.current += delta

    // Cycle: 7-second period (Brain for 3s -> transition 1s -> Wave for 2s -> transition 1s)
    const cycleTime = (timeRef.current % 7.0) / 7.0 // 0 to 1
    let morphFactor = 0 // 0 = brain, 1 = wave

    if (cycleTime < 0.35) {
      morphFactor = 0
    } else if (cycleTime < 0.5) {
      // Transition to wave
      const t = (cycleTime - 0.35) / 0.15
      morphFactor = 0.5 - 0.5 * Math.cos(Math.PI * t) // smooth cosine ease
    } else if (cycleTime < 0.75) {
      morphFactor = 1
    } else {
      // Transition back to brain
      const t = (cycleTime - 0.75) / 0.25
      morphFactor = 0.5 + 0.5 * Math.cos(Math.PI * t)
    }

    const currentPos = posAttr.array as Float32Array
    const currentCol = colAttr.array as Float32Array

    // Indigo (#6366F1: r=0.388, g=0.400, b=0.945) -> Cyan (#22D3EE: r=0.133, g=0.827, b=0.933)
    const targetR = 0.388 + (0.133 - 0.388) * morphFactor
    const targetG = 0.400 + (0.827 - 0.400) * morphFactor
    const targetB = 0.945 + (0.933 - 0.945) * morphFactor

    // Idle pulse / breathing vibration
    const pulse = Math.sin(timeRef.current * 2.5) * 0.02

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const idx = i * 3
      const bx = brainPositions[idx]
      const by = brainPositions[idx + 1]
      const bz = brainPositions[idx + 2]

      const wx = wavePositions[idx]
      const wy = wavePositions[idx + 1]
      const wz = wavePositions[idx + 2]

      // Interpolate positions
      const px = bx + (wx - bx) * morphFactor
      const py = by + (wy - by) * morphFactor
      const pz = bz + (wz - bz) * morphFactor

      // Subtle organic particle wave float
      const organicWave = Math.sin(timeRef.current * 1.5 + i * 0.03) * 0.015

      currentPos[idx] = px * (1 + pulse)
      currentPos[idx + 1] = py * (1 + pulse) + organicWave
      currentPos[idx + 2] = pz * (1 + pulse)

      // Slight individual brightness variations
      const shimmer = 0.9 + Math.sin(timeRef.current * 3 + i) * 0.1
      currentCol[idx] = targetR * shimmer
      currentCol[idx + 1] = targetG * shimmer
      currentCol[idx + 2] = targetB * shimmer
    }

    posAttr.needsUpdate = true
    colAttr.needsUpdate = true

    // Rotation logic
    if (isMobile) {
      // Gentle auto-rotation only on mobile
      pointsRef.current.rotation.y += delta * 0.25
      pointsRef.current.rotation.x = Math.sin(timeRef.current * 0.5) * 0.05
    } else {
      // Mouse follow ±15 degrees (approx ±0.26 radians)
      const maxAngle = 0.26
      const targetRotX = mouse.y * maxAngle
      const targetRotY = mouse.x * maxAngle + timeRef.current * 0.12

      pointsRef.current.rotation.x += (targetRotX - pointsRef.current.rotation.x) * 0.06
      pointsRef.current.rotation.y += (targetRotY - pointsRef.current.rotation.y) * 0.06
    }
  })

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.028}
        vertexColors
        transparent
        opacity={0.88}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

function AmbientGlowField() {
  return (
    <mesh position={[0, 0, -1]}>
      <sphereGeometry args={[2.8, 24, 24]} />
      <meshBasicMaterial
        color="#6366F1"
        transparent
        opacity={0.035}
        side={THREE.BackSide}
      />
    </mesh>
  )
}

export default function ParticleBrain() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)

    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerWidth < 768) return
      // Normalize to -1..1
      const nx = (e.clientX / window.innerWidth) * 2 - 1
      const ny = -((e.clientY / window.innerHeight) * 2 - 1)
      setMouse({ x: nx, y: ny })
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    return () => {
      window.removeEventListener('resize', checkMobile)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  if (!mounted) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-48 h-48 rounded-full border border-indigo-500/20 animate-pulse bg-indigo-500/5" />
      </div>
    )
  }

  return (
    <div className="w-full h-full relative" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 50 }}
        style={{ pointerEvents: 'none' }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      >
        <AmbientGlowField />
        <ParticleMorphMesh mouse={mouse} isMobile={isMobile} />
      </Canvas>
    </div>
  )
}
