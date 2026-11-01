'use client'

import React, { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface RobotProps {
  mouse: { x: number; y: number }
  micLevel: number
}

function ListeningRobotModel({ mouse, micLevel }: RobotProps) {
  const headRef = useRef<THREE.Group>(null)
  const visorRef = useRef<THREE.Mesh>(null)
  const antennaRef = useRef<THREE.Mesh>(null)
  const bodyRef = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime()

    // Smooth head tracking towards cursor
    if (headRef.current) {
      const targetRotY = mouse.x * 0.45
      const targetRotX = -mouse.y * 0.35
      headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, targetRotY, 0.08)
      headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, targetRotX, 0.08)
    }

    // Gentle breathing idle for body
    if (bodyRef.current) {
      bodyRef.current.position.y = Math.sin(time * 2.0) * 0.04
    }

    // Visor & Antenna glow modulated by mic loudness or idle breathing
    const pulse = micLevel > 0.05 ? micLevel * 2.5 : 0.8 + Math.sin(time * 3.5) * 0.25
    if (visorRef.current) {
      const mat = visorRef.current.material as THREE.MeshStandardMaterial
      mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, pulse * 1.5, 0.1)
    }

    if (antennaRef.current) {
      const scale = 1.0 + (micLevel > 0.05 ? micLevel * 1.2 : Math.sin(time * 5.0) * 0.15)
      antennaRef.current.scale.set(scale, scale, scale)
      const mat = antennaRef.current.material as THREE.MeshStandardMaterial
      mat.emissiveIntensity = 1.0 + pulse * 1.8
    }
  })

  return (
    <group position={[0, -0.3, 0]}>
      {/* Robot Body */}
      <group ref={bodyRef}>
        {/* Main Torso: Rounded Capsule */}
        <mesh position={[0, -0.5, 0]}>
          <cylinderGeometry args={[0.55, 0.65, 0.9, 32]} />
          <meshStandardMaterial color="#EBF1F6" roughness={0.25} metalness={0.15} />
        </mesh>

        {/* Chest Accent Plate */}
        <mesh position={[0, -0.45, 0.48]}>
          <boxGeometry args={[0.4, 0.35, 0.1]} />
          <meshStandardMaterial color="#111827" roughness={0.3} />
        </mesh>
        {/* Glowing Chest Core Pulse */}
        <mesh position={[0, -0.45, 0.54]}>
          <circleGeometry args={[0.08, 24]} />
          <meshBasicMaterial color="#22D3EE" />
        </mesh>

        {/* Shoulders / Base joint */}
        <mesh position={[-0.7, -0.3, 0]}>
          <sphereGeometry args={[0.18, 24, 24]} />
          <meshStandardMaterial color="#3D3FD6" roughness={0.4} />
        </mesh>
        <mesh position={[0.7, -0.3, 0]}>
          <sphereGeometry args={[0.18, 24, 24]} />
          <meshStandardMaterial color="#3D3FD6" roughness={0.4} />
        </mesh>
      </group>

      {/* Head Group (Rotates with Cursor) */}
      <group ref={headRef} position={[0, 0.4, 0]}>
        {/* Neck Pivot */}
        <mesh position={[0, -0.25, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.2, 24]} />
          <meshStandardMaterial color="#64748B" roughness={0.5} metalness={0.5} />
        </mesh>

        {/* Outer White Head Shell */}
        <mesh position={[0, 0.05, 0]}>
          <sphereGeometry args={[0.72, 32, 32]} />
          <meshStandardMaterial color="#F8FAFC" roughness={0.2} metalness={0.1} />
        </mesh>

        {/* Glossy Black Visor Frame */}
        <mesh position={[0, 0.08, 0.48]}>
          <boxGeometry args={[0.85, 0.34, 0.28]} />
          <meshStandardMaterial color="#0A0F1E" roughness={0.1} metalness={0.8} />
        </mesh>

        {/* Glowing Cyan Visor Screen */}
        <mesh ref={visorRef} position={[0, 0.08, 0.62]}>
          <planeGeometry args={[0.75, 0.26]} />
          <meshStandardMaterial
            color="#0891B2"
            emissive="#22D3EE"
            emissiveIntensity={1.2}
            roughness={0.2}
          />
        </mesh>

        {/* Headphone Modules (Left & Right) */}
        <group position={[-0.76, 0.08, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.22, 0.22, 0.16, 24]} />
            <meshStandardMaterial color="#3D3FD6" roughness={0.3} metalness={0.3} />
          </mesh>
          <mesh position={[-0.09, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <ringGeometry args={[0.1, 0.18, 24]} />
            <meshBasicMaterial color="#22D3EE" />
          </mesh>
        </group>

        <group position={[0.76, 0.08, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.22, 0.22, 0.16, 24]} />
            <meshStandardMaterial color="#3D3FD6" roughness={0.3} metalness={0.3} />
          </mesh>
          <mesh position={[0.09, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <ringGeometry args={[0.1, 0.18, 24]} />
            <meshBasicMaterial color="#22D3EE" />
          </mesh>
        </group>

        {/* Headphone Headband Arc */}
        <mesh position={[0, 0.68, 0]}>
          <torusGeometry args={[0.72, 0.05, 16, 32, Math.PI]} />
          <meshStandardMaterial color="#1E293B" roughness={0.4} />
        </mesh>

        {/* Antenna Stem */}
        <mesh position={[0, 0.82, 0]}>
          <cylinderGeometry args={[0.02, 0.03, 0.35, 16]} />
          <meshStandardMaterial color="#94A3B8" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Pulsing Cyan Antenna Light */}
        <mesh ref={antennaRef} position={[0, 1.02, 0]}>
          <sphereGeometry args={[0.09, 24, 24]} />
          <meshStandardMaterial
            color="#22D3EE"
            emissive="#22D3EE"
            emissiveIntensity={1.8}
            roughness={0.1}
          />
        </mesh>
      </group>
    </group>
  )
}

export function RobotCanvas() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const [micLevel, setMicLevel] = useState(0)
  const [isListeningMic, setIsListeningMic] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1
      const y = -((e.clientY / window.innerHeight) * 2 - 1)
      setMouse({ x, y })
    }
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const startMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
      const analyser = audioCtx.createAnalyser()
      analyser.fftSize = 64
      const source = audioCtx.createMediaStreamSource(stream)
      source.connect(analyser)

      const dataArray = new Uint8Array(analyser.frequencyBinCount)
      setIsListeningMic(true)

      const updateLoudness = () => {
        analyser.getByteFrequencyData(dataArray)
        let sum = 0
        for (let i = 0; i < dataArray.length; i++) sum += dataArray[i]
        const avg = sum / (dataArray.length * 255)
        setMicLevel(avg)
        requestAnimationFrame(updateLoudness)
      }
      updateLoudness()
    } catch {
      // User dismissed permission or unavailable; default idle animation runs
    }
  }

  return (
    <div className="relative w-full h-[380px] sm:h-[460px] flex items-center justify-center">
      <Canvas
        camera={{ position: [0, 0.2, 3.2], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 5, 4]} intensity={1.2} />
        <directionalLight position={[-3, -2, 2]} intensity={0.5} color="#22D3EE" />
        <pointLight position={[0, 0.4, 1.2]} intensity={0.8} color="#6366F1" />
        <ListeningRobotModel mouse={mouse} micLevel={micLevel} />
      </Canvas>

      {/* Mic toggle chip on robot */}
      <button
        onClick={startMic}
        type="button"
        className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-mono flex items-center gap-1.5 transition-all bg-[var(--surface)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--accent)]"
      >
        <span
          className={`w-2 h-2 rounded-full ${
            isListeningMic ? 'bg-[var(--success)] animate-ping' : 'bg-[var(--accent)]'
          }`}
        />
        {isListeningMic ? 'Listening to voice...' : 'Test Mic Sync'}
      </button>
    </div>
  )
}
