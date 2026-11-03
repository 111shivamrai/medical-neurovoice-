'use client'

import React, { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Volume2, VolumeX, MessageSquareQuote, Bot } from 'lucide-react'

interface RobotProps {
  mouse: { x: number; y: number }
  speakingPulse: number
  isMobile: boolean
}

/**
 * Medical AI Robot Model
 * Master Prompt C, Task 13:
 * White clinical doctor's aesthetic with stethoscope, glowing cyan circular eyes (#22D3EE),
 * soft NeuroVoice chest emblem, left hand holding medical tablet, right arm welcoming gesture.
 */
function MedicalAIRobotModel({ mouse, speakingPulse, isMobile }: RobotProps) {
  const headRef = useRef<THREE.Group>(null)
  const leftEyeRef = useRef<THREE.Mesh>(null)
  const rightEyeRef = useRef<THREE.Mesh>(null)
  const chestEmblemRef = useRef<THREE.Mesh>(null)
  const bodyRef = useRef<THREE.Group>(null)
  const rightArmRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    const time = state.clock.getElapsedTime()

    // Smooth head tracking towards cursor (±12 degrees = ±0.21 rad)
    if (headRef.current) {
      if (isMobile) {
        // Auto-rotate gently on mobile without cursor follow
        headRef.current.rotation.y = Math.sin(time * 0.9) * 0.16
        headRef.current.rotation.x = Math.sin(time * 0.6) * 0.06
      } else {
        const targetRotY = THREE.MathUtils.clamp(mouse.x * 0.35, -0.21, 0.21)
        const targetRotX = THREE.MathUtils.clamp(-mouse.y * 0.25, -0.18, 0.18)
        headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, targetRotY, 0.08)
        headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, targetRotX, 0.08)
      }
    }

    // Idle breathing (scale 0.98 - 1.0, 3s loop)
    if (bodyRef.current) {
      const breathScale = 0.99 + Math.sin(time * (Math.PI * 2) / 3.0) * 0.015
      bodyRef.current.scale.set(breathScale, breathScale, breathScale)
      bodyRef.current.position.y = Math.sin(time * 2.0) * 0.02
    }

    // Welcoming subtle gesture for right arm
    if (rightArmRef.current) {
      rightArmRef.current.rotation.z = -0.3 + Math.sin(time * 1.5) * 0.04
    }

    // Eye glow intensity sync with speakingPulse (or breathing when idle)
    const basePulse = speakingPulse > 0 ? speakingPulse : 0.85 + Math.sin(time * 3.5) * 0.25
    const eyeIntensity = THREE.MathUtils.lerp(1.2, 2.8, basePulse / 2.0)

    if (leftEyeRef.current?.material) {
      const mat = leftEyeRef.current.material as THREE.MeshStandardMaterial
      if ('emissiveIntensity' in mat) mat.emissiveIntensity = eyeIntensity
    }
    if (rightEyeRef.current?.material) {
      const mat = rightEyeRef.current.material as THREE.MeshStandardMaterial
      if ('emissiveIntensity' in mat) mat.emissiveIntensity = eyeIntensity
    }
    if (chestEmblemRef.current?.material) {
      const mat = chestEmblemRef.current.material as THREE.MeshStandardMaterial
      if ('emissiveIntensity' in mat) mat.emissiveIntensity = 0.8 + basePulse * 0.6
    }
  })

  return (
    <group position={[0, -0.25, 0]}>
      {/* ─── MAIN TORSO & MEDICAL LAB COAT ─── */}
      <group ref={bodyRef}>
        {/* Humanoid Torso (White/off-white matte body) */}
        <mesh position={[0, -0.5, 0]}>
          <cylinderGeometry args={[0.52, 0.62, 0.95, 32]} />
          <meshStandardMaterial color="#F8FAFC" roughness={0.3} metalness={0.1} />
        </mesh>

        {/* Doctor Lab Coat Lapel Left */}
        <mesh position={[-0.22, -0.35, 0.44]} rotation={[0.05, 0.12, 0.2]}>
          <boxGeometry args={[0.22, 0.6, 0.06]} />
          <meshStandardMaterial color="#EDF2F7" roughness={0.35} metalness={0.08} />
        </mesh>
        {/* Doctor Lab Coat Lapel Right */}
        <mesh position={[0.22, -0.35, 0.44]} rotation={[0.05, -0.12, -0.2]}>
          <boxGeometry args={[0.22, 0.6, 0.06]} />
          <meshStandardMaterial color="#EDF2F7" roughness={0.35} metalness={0.08} />
        </mesh>

        {/* Stethoscope Tubing draped over shoulders */}
        <mesh position={[0, -0.22, 0.38]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.34, 0.022, 16, 32, Math.PI]} />
          <meshStandardMaterial color="#1E293B" roughness={0.4} metalness={0.2} />
        </mesh>
        {/* Stethoscope Chest Piece / Bell */}
        <mesh position={[0.08, -0.55, 0.52]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.02, 24]} />
          <meshStandardMaterial color="#94A3B8" roughness={0.2} metalness={0.85} />
        </mesh>

        {/* Circular NeuroVoice Emblem (glowing cyan softly) */}
        <mesh ref={chestEmblemRef} position={[0, -0.36, 0.5]}>
          <circleGeometry args={[0.09, 32]} />
          <meshStandardMaterial
            color="#22D3EE"
            emissive="#22D3EE"
            emissiveIntensity={1.0}
            roughness={0.15}
            metalness={0.2}
          />
        </mesh>

        {/* Segmented Ring Connectors (Neck) */}
        <mesh position={[0, 0.02, 0]}>
          <torusGeometry args={[0.22, 0.035, 16, 32]} />
          <meshStandardMaterial color="#64748B" roughness={0.3} metalness={0.7} />
        </mesh>
        <mesh position={[0, 0.08, 0]}>
          <torusGeometry args={[0.19, 0.03, 16, 32]} />
          <meshStandardMaterial color="#94A3B8" roughness={0.3} metalness={0.7} />
        </mesh>
      </group>

      {/* ─── HEAD (Smooth oval, glowing cyan circular eye panels) ─── */}
      <group ref={headRef} position={[0, 0.46, 0]}>
        {/* Smooth Oval Head Shell */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.56, 32, 32]} />
          <meshStandardMaterial color="#F8FAFC" roughness={0.28} metalness={0.1} />
        </mesh>

        {/* Clinical Visor Shield Inset */}
        <mesh position={[0, 0.05, 0.42]} rotation={[0.06, 0, 0]}>
          <boxGeometry args={[0.62, 0.24, 0.18]} />
          <meshStandardMaterial color="#0F172A" roughness={0.2} metalness={0.5} />
        </mesh>

        {/* Circular Eye Panel Left (Cyan Glow #22D3EE) */}
        <mesh ref={leftEyeRef} position={[-0.16, 0.06, 0.52]}>
          <circleGeometry args={[0.06, 24]} />
          <meshStandardMaterial
            color="#22D3EE"
            emissive="#22D3EE"
            emissiveIntensity={1.5}
            roughness={0.1}
          />
        </mesh>

        {/* Circular Eye Panel Right (Cyan Glow #22D3EE) */}
        <mesh ref={rightEyeRef} position={[0.16, 0.06, 0.52]}>
          <circleGeometry args={[0.06, 24]} />
          <meshStandardMaterial
            color="#22D3EE"
            emissive="#22D3EE"
            emissiveIntensity={1.5}
            roughness={0.1}
          />
        </mesh>

        {/* Head Side Node Left */}
        <mesh position={[-0.58, 0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.12, 0.12, 0.08, 24]} />
          <meshStandardMaterial color="#0284C7" roughness={0.3} metalness={0.5} />
        </mesh>
        {/* Head Side Node Right */}
        <mesh position={[0.58, 0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.12, 0.12, 0.08, 24]} />
          <meshStandardMaterial color="#0284C7" roughness={0.3} metalness={0.5} />
        </mesh>
      </group>

      {/* ─── LEFT HAND: HOLDING TABLET / CLIPBOARD ─── */}
      <group position={[-0.52, -0.4, 0.28]} rotation={[0.2, 0.4, -0.15]}>
        {/* Upper arm */}
        <mesh position={[0, 0.15, 0]}>
          <cylinderGeometry args={[0.08, 0.09, 0.35, 16]} />
          <meshStandardMaterial color="#F8FAFC" roughness={0.3} metalness={0.1} />
        </mesh>
        {/* Forearm & Hand */}
        <mesh position={[0.08, -0.1, 0.15]} rotation={[-0.5, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.075, 0.3, 16]} />
          <meshStandardMaterial color="#F8FAFC" roughness={0.3} metalness={0.1} />
        </mesh>
        {/* Medical Tablet / Clipboard */}
        <mesh position={[0.12, -0.12, 0.32]} rotation={[-0.4, 0.2, 0.1]}>
          <boxGeometry args={[0.38, 0.52, 0.03]} />
          <meshStandardMaterial color="#1E293B" roughness={0.3} metalness={0.6} />
        </mesh>
        {/* Glowing Screen on Tablet */}
        <mesh position={[0.12, -0.12, 0.34]} rotation={[-0.4, 0.2, 0.1]}>
          <boxGeometry args={[0.33, 0.46, 0.01]} />
          <meshStandardMaterial
            color="#0284C7"
            emissive="#0284C7"
            emissiveIntensity={0.8}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* ─── RIGHT ARM: WELCOMING GESTURE ─── */}
      <group ref={rightArmRef} position={[0.55, -0.32, 0]}>
        {/* Upper arm angled outward */}
        <mesh position={[0.12, -0.05, 0.08]} rotation={[0, 0, -0.4]}>
          <cylinderGeometry args={[0.08, 0.085, 0.36, 16]} />
          <meshStandardMaterial color="#F8FAFC" roughness={0.3} metalness={0.1} />
        </mesh>
        {/* Forearm raised welcomingly */}
        <mesh position={[0.26, 0.12, 0.22]} rotation={[-0.6, 0, -0.3]}>
          <cylinderGeometry args={[0.07, 0.075, 0.32, 16]} />
          <meshStandardMaterial color="#F8FAFC" roughness={0.3} metalness={0.1} />
        </mesh>
        {/* Hand with open palm */}
        <mesh position={[0.34, 0.26, 0.32]} rotation={[-0.5, 0.3, 0]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#EDF2F7" roughness={0.3} metalness={0.2} />
        </mesh>
      </group>
    </group>
  )
}

/**
 * Five Rotating Greetings (Task 13 specification)
 */
const GREETINGS = [
  {
    text: "Welcome to NeuroVoice. I'm here to listen whenever you're ready. Just thirty seconds of speaking is all it takes.",
    lang: 'en-IN',
  },
  {
    text: "Hello! I'm your NeuroVoice assistant. I can analyse your voice for early signs of neurological changes. Shall we begin?",
    lang: 'en-IN',
  },
  {
    text: 'नमस्ते! मैं NeuroVoice आपकी आवाज़ सुनने के लिए यहाँ हूँ। बस तीस सेकंड बोलिए — हम बाकी काम कर लेंगे।',
    lang: 'hi-IN',
  },
  {
    text: 'आपका स्वागत है। आपकी आवाज़ में वो संकेत हैं जो आपके स्वास्थ्य के बारे में बहुत कुछ बताते हैं।',
    lang: 'hi-IN',
  },
  {
    text: 'Good to see you. Your voice carries patterns that can reveal a lot about your neurological health. Let\'s take a look together.',
    lang: 'en-IN',
  },
]

export function RobotCanvas() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const [greetingIndex, setGreetingIndex] = useState(0)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [caption, setCaption] = useState(GREETINGS[0].text)
  const [speakingPulse, setSpeakingPulse] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
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

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (isMobile) return

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1
      const y = -((e.clientY / window.innerHeight) * 2 - 1)
      setMouse({ x, y })
    }
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [isMobile])

  /**
   * Speak greeting with priority voice selection
   */
  const sayHello = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return
    }

    window.speechSynthesis.cancel()
    if (pulseIntervalRef.current) clearInterval(pulseIntervalRef.current)

    // Cycle through 5 greetings
    const nextIdx = (greetingIndex + 1) % GREETINGS.length
    setGreetingIndex(nextIdx)
    const current = GREETINGS[nextIdx]
    setCaption(current.text)

    if (isMuted) return

    const utterance = new SpeechSynthesisUtterance(current.text)
    utterance.lang = current.lang
    utterance.rate = 0.95
    utterance.pitch = 1.0

    // Priority voice selection:
    // Priority 1: Google Hindi IN (for Hindi)
    // Priority 2: Microsoft Ravi Online / Google US English (for English)
    // Priority 3: Any 'hi-IN' or 'en-IN' voice
    // Fallback: first available voice
    const voices = window.speechSynthesis.getVoices()
    let selectedVoice = null

    if (current.lang === 'hi-IN') {
      selectedVoice =
        voices.find((v) => v.name.includes('Google Hindi') || v.name.includes('Hindi')) ||
        voices.find((v) => v.lang.toLowerCase().includes('hi'))
    } else {
      selectedVoice =
        voices.find((v) => v.name.includes('Microsoft Ravi') || v.name.includes('Google US English')) ||
        voices.find((v) => v.lang.toLowerCase().includes('en-in')) ||
        voices.find((v) => v.lang.toLowerCase().includes('en-us')) ||
        voices.find((v) => v.lang.toLowerCase().startsWith('en'))
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice
    } else if (voices.length > 0) {
      utterance.voice = voices[0]
    }

    utterance.onstart = () => {
      setIsSpeaking(true)
      pulseIntervalRef.current = setInterval(() => {
        setSpeakingPulse(Math.random() * 1.5 + 0.8)
      }, 100)
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
      {/* Top Controls: Mute Toggle Only (NO 'Interactive Acoustic Avatar' label) */}
      <div className="w-full flex items-center justify-end pb-1 text-xs text-[var(--muted)]">
        <button
          onClick={toggleMute}
          type="button"
          className="p-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-2)] text-[var(--text)] transition-colors"
          title={isMuted ? 'Unmute robot voice' : 'Mute robot voice'}
          aria-label={isMuted ? 'Unmute voice' : 'Mute voice'}
        >
          {isMuted ? (
            <VolumeX size={15} className="text-red-500" />
          ) : (
            <Volume2 size={15} className="text-[var(--primary)]" />
          )}
        </button>
      </div>

      {/* 3D Canvas with Holographic Grid Line Background */}
      <div className="relative w-full h-[290px] sm:h-[350px] flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-b from-[var(--surface-2)]/30 to-[var(--surface)]">
        {/* Subtle holographic grid lines */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />

        {hasWebGL ? (
          <Canvas
            camera={{ position: [0, 0.2, 3.1], fov: 45 }}
            gl={{ alpha: true, antialias: true }}
          >
            {/* Three-point lighting */}
            <ambientLight intensity={0.7} />
            {/* Key light: White */}
            <directionalLight position={[3, 4, 3]} intensity={1.5} color="#FFFFFF" />
            {/* Fill light: Cyan */}
            <directionalLight position={[-3, 1, 2]} intensity={0.9} color="#22D3EE" />
            {/* Rim light: Indigo */}
            <directionalLight position={[0, -2, -3]} intensity={0.8} color="#4338CA" />

            <MedicalAIRobotModel
              mouse={mouse}
              speakingPulse={speakingPulse}
              isMobile={isMobile}
            />
          </Canvas>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center space-y-3">
            <div className="w-24 h-24 rounded-full bg-[var(--surface-2)] border-2 border-[var(--primary)] flex items-center justify-center shadow-inner">
              <Bot size={40} className="text-[var(--primary)]" />
            </div>
            <p className="text-xs text-[var(--muted)]">Medical AI Assistant Ready</p>
          </div>
        )}

        {/* [Say hello] rounded button below robot */}
        <button
          onClick={sayHello}
          disabled={isSpeaking}
          type="button"
          className="absolute bottom-2 px-5 py-2 rounded-full text-xs font-semibold shadow-md flex items-center gap-2 transition-all bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] active:scale-95 disabled:opacity-75 disabled:cursor-not-allowed"
        >
          <Volume2 size={14} className={isSpeaking ? 'animate-pulse text-cyan-200' : ''} />
          <span>{isSpeaking ? 'Speaking...' : 'Say hello'}</span>
        </button>
      </div>

      {/* Styled Captions Box Always Shown Below Robot */}
      <div className="w-full mt-3 p-3.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-center min-h-[50px] flex items-center justify-center gap-2.5">
        <MessageSquareQuote size={16} className="shrink-0 text-[var(--accent)]" />
        <p className="text-xs font-medium text-[var(--text)] italic leading-snug">
          &ldquo;{caption}&rdquo;
        </p>
      </div>
    </div>
  )
}
