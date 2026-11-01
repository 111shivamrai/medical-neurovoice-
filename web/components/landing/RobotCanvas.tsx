'use client'

import React, { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Volume2, VolumeX, MessageSquareQuote, Sparkles } from 'lucide-react'

interface RobotProps {
  mouse: { x: number; y: number }
  speakingPulse: number
}

function ListeningRobotModel({ mouse, speakingPulse }: RobotProps) {
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
      bodyRef.current.position.y = Math.sin(time * 2.0) * 0.03
    }

    // Visor & Antenna glow modulated by speech synthesis speaking pulse or idle breathing
    const pulse = speakingPulse > 0 ? speakingPulse : 0.8 + Math.sin(time * 3.0) * 0.25
    if (visorRef.current && visorRef.current.material) {
      const mat = visorRef.current.material as THREE.MeshStandardMaterial
      if (mat && 'emissiveIntensity' in mat) {
        mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, pulse * 1.5, 0.12)
      }
    }

    if (antennaRef.current && antennaRef.current.material) {
      const scale = 1.0 + (speakingPulse > 0 ? speakingPulse * 0.4 : Math.sin(time * 4.0) * 0.1)
      antennaRef.current.scale.set(scale, scale, scale)
      const mat = antennaRef.current.material as THREE.MeshStandardMaterial
      if (mat && 'emissiveIntensity' in mat) {
        mat.emissiveIntensity = 1.0 + pulse * 1.6
      }
    }
  })

  return (
    <group position={[0, -0.3, 0]}>
      {/* Robot Body */}
      <group ref={bodyRef}>
        {/* Main Torso */}
        <mesh position={[0, -0.5, 0]}>
          <cylinderGeometry args={[0.55, 0.65, 0.9, 32]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.25} metalness={0.15} />
        </mesh>

        {/* Chest Accent Plate */}
        <mesh position={[0, -0.45, 0.48]}>
          <boxGeometry args={[0.4, 0.35, 0.1]} />
          <meshStandardMaterial color="#1E40AF" roughness={0.3} />
        </mesh>
        {/* Glowing Chest Core */}
        <mesh position={[0, -0.45, 0.54]}>
          <circleGeometry args={[0.08, 24]} />
          <meshBasicMaterial color="#0D7377" />
        </mesh>

        {/* Neck collar */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.3, 0.35, 0.18, 32]} />
          <meshStandardMaterial color="#D5DBE8" metalness={0.6} roughness={0.3} />
        </mesh>
      </group>

      {/* Head Group (Rotates with Cursor) */}
      <group ref={headRef} position={[0, 0.4, 0]}>
        {/* Head Shell: Matte Clinical White */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.62, 32, 32]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.2} metalness={0.1} />
        </mesh>

        {/* Visor: Glowing Cyan Faceplate */}
        <mesh ref={visorRef} position={[0, 0.05, 0.42]} rotation={[0.08, 0, 0]}>
          <boxGeometry args={[0.68, 0.28, 0.28]} />
          <meshStandardMaterial
            color="#0D7377"
            emissive="#0D7377"
            emissiveIntensity={1.2}
            roughness={0.1}
            metalness={0.4}
          />
        </mesh>

        {/* Left Headphone Ear-cup */}
        <mesh position={[-0.64, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.22, 0.22, 0.16, 24]} />
          <meshStandardMaterial color="#1E40AF" roughness={0.3} metalness={0.5} />
        </mesh>
        <mesh position={[-0.73, 0, 0]}>
          <ringGeometry args={[0.08, 0.18, 24]} />
          <meshBasicMaterial color="#0D7377" />
        </mesh>

        {/* Right Headphone Ear-cup */}
        <mesh position={[0.64, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.22, 0.22, 0.16, 24]} />
          <meshStandardMaterial color="#1E40AF" roughness={0.3} metalness={0.5} />
        </mesh>
        <mesh position={[0.73, 0, 0]}>
          <ringGeometry args={[0.08, 0.18, 24]} />
          <meshBasicMaterial color="#0D7377" />
        </mesh>

        {/* Headband connecting headphones */}
        <mesh position={[0, 0.62, 0]}>
          <torusGeometry args={[0.64, 0.04, 16, 32, Math.PI]} />
          <meshStandardMaterial color="#1E40AF" metalness={0.4} roughness={0.2} />
        </mesh>

        {/* Antenna Stem */}
        <mesh position={[0, 0.72, 0]}>
          <cylinderGeometry args={[0.02, 0.025, 0.22, 16]} />
          <meshStandardMaterial color="#D5DBE8" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Antenna Glowing Tip */}
        <mesh ref={antennaRef} position={[0, 0.85, 0]}>
          <sphereGeometry args={[0.07, 24, 24]} />
          <meshStandardMaterial
            color="#0D7377"
            emissive="#0D7377"
            emissiveIntensity={1.5}
            roughness={0.1}
          />
        </mesh>
      </group>
    </group>
  )
}

const GREETINGS = [
  { text: "Welcome to NeuroVoice. I'm here to listen whenever you're ready.", lang: 'en-IN' },
  { text: "Hello! Thirty seconds of speaking is all it takes to begin.", lang: 'en-IN' },
  { text: "Namaste, and welcome to NeuroVoice. Your voice has a lot to tell.", lang: 'en-IN' },
  { text: "नमस्ते! NeuroVoice में आपका स्वागत है। बस तीस सेकंड बोलिए।", lang: 'hi-IN' },
]

export function RobotCanvas() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const [greetingIndex, setGreetingIndex] = useState(0)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [caption, setCaption] = useState(GREETINGS[0].text)
  const [speakingPulse, setSpeakingPulse] = useState(0)
  const [hasWebGL, setHasWebGL] = useState(true)
  const pulseIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    try {
      const c = document.createElement('canvas')
      const gl = c.getContext('webgl') || c.getContext('experimental-webgl')
      if (!gl) setHasWebGL(false)
    } catch {
      setHasWebGL(false)
    }
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1
      const y = -((e.clientY / window.innerHeight) * 2 - 1)
      setMouse({ x, y })
    }
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const sayHello = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return
    }

    // Cancel current speech if ongoing
    window.speechSynthesis.cancel()
    if (pulseIntervalRef.current) clearInterval(pulseIntervalRef.current)

    // Pick next greeting in rotation
    const nextIdx = (greetingIndex + 1) % GREETINGS.length
    setGreetingIndex(nextIdx)
    const current = GREETINGS[nextIdx]
    setCaption(current.text)

    if (isMuted) return

    const utterance = new SpeechSynthesisUtterance(current.text)
    utterance.lang = current.lang
    utterance.rate = 0.95
    utterance.pitch = 1.05

    // Match voice if available
    const voices = window.speechSynthesis.getVoices()
    const targetVoice = voices.find((v) => v.lang.includes(current.lang)) || voices[0]
    if (targetVoice) utterance.voice = targetVoice

    utterance.onstart = () => {
      setIsSpeaking(true)
      pulseIntervalRef.current = setInterval(() => {
        setSpeakingPulse(Math.random() * 1.5 + 0.5)
      }, 120)
    }

    utterance.onend = () => {
      setIsSpeaking(false)
      setSpeakingPulse(0)
      if (pulseIntervalRef.current) clearInterval(pulseIntervalRef.current)
    }

    utterance.onerror = () => {
      setIsSpeaking(false)
      setSpeakingPulse(0)
      if (pulseIntervalRef.current) clearInterval(pulseIntervalRef.current)
    }

    window.speechSynthesis.speak(utterance)
  }

  const toggleMute = () => {
    const nextMute = !isMuted
    setIsMuted(nextMute)
    if (nextMute && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      setSpeakingPulse(0)
    }
  }

  return (
    <div className="relative w-full rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] p-4 flex flex-col items-center">
      {/* Top Controls: Mute Toggle */}
      <div className="w-full flex items-center justify-between pb-1 border-b border-[var(--border)]/60 text-xs text-[var(--muted)]">
        <span className="font-mono text-[11px] flex items-center gap-1.5 text-[var(--primary)] font-semibold">
          <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
          Interactive Acoustic Avatar
        </span>

        <button
          onClick={toggleMute}
          type="button"
          className="p-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-2)] text-[var(--text)] transition-colors"
          title={isMuted ? 'Unmute robot voice' : 'Mute robot voice'}
          aria-label={isMuted ? 'Unmute voice' : 'Mute voice'}
        >
          {isMuted ? <VolumeX size={15} className="text-red-500" /> : <Volume2 size={15} className="text-[var(--primary)]" />}
        </button>
      </div>

      {/* 3D Canvas or 2D Clinical Acoustic Avatar Fallback */}
      <div className="relative w-full h-[280px] sm:h-[340px] flex items-center justify-center">
        {hasWebGL ? (
          <Canvas
            camera={{ position: [0, 0.2, 3.2], fov: 45 }}
            gl={{ alpha: true, antialias: true }}
          >
            <ambientLight intensity={0.9} />
            <directionalLight position={[3, 5, 4]} intensity={1.4} />
            <directionalLight position={[-3, -2, 2]} intensity={0.6} color="#0D7377" />
            <pointLight position={[0, 0.4, 1.2]} intensity={0.8} color="#1E40AF" />
            <ListeningRobotModel mouse={mouse} speakingPulse={speakingPulse} />
          </Canvas>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center space-y-3">
            <div className="w-24 h-24 rounded-full bg-[var(--surface-2)] border-2 border-[var(--primary)] flex items-center justify-center shadow-inner">
              <Sparkles size={40} className="text-[var(--primary)] animate-pulse" />
            </div>
            <p className="text-xs text-[var(--muted)]">Acoustic Avatar Active</p>
          </div>
        )}

        {/* Say Hello Button (Centered over bottom of canvas) */}
        <button
          onClick={sayHello}
          type="button"
          className="absolute bottom-2 px-5 py-2 rounded-xl text-xs font-semibold shadow-md flex items-center gap-2 transition-all bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 active:scale-95"
        >
          <Sparkles size={14} className={isSpeaking ? 'animate-spin' : ''} />
          <span>{isSpeaking ? 'Speaking...' : 'Say hello'}</span>
        </button>
      </div>

      {/* Captions Display (Always Visible) */}
      <div className="w-full mt-3 p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-center min-h-[48px] flex items-center justify-center gap-2">
        <MessageSquareQuote size={15} className="shrink-0 text-[var(--accent)]" />
        <p className="text-xs font-medium text-[var(--text)] italic leading-snug">
          "{caption}"
        </p>
      </div>
    </div>
  )
}
