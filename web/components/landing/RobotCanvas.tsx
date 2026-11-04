'use client'

import React, { useRef, useState, useEffect, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Volume2, VolumeX, MessageSquareQuote, Bot, Sparkles } from 'lucide-react'

export interface RobotCanvasProps {
  mode?: 'hero' | 'chat'
  externalSpeaking?: boolean
  onSpeechEnd?: () => void
}

interface RobotModelProps {
  mouse: { x: number; y: number }
  isSpeaking: boolean
  isClicking: boolean
  isMobile: boolean
  mode: 'hero' | 'chat'
}

/**
 * Procedural Holographic Screen Textures (ECG Waveform & Telemetry Data)
 * Exact match to Image 1's glowing cyan medical background monitors
 */
function useHolographicTextures() {
  return useMemo(() => {
    if (typeof document === 'undefined') return { ecgTexture: null, dataTexture: null }

    // 1. Left Screen: ECG Waveform & Vitals Monitor
    const ecgCanvas = document.createElement('canvas')
    ecgCanvas.width = 512
    ecgCanvas.height = 340
    const ctx1 = ecgCanvas.getContext('2d')
    if (ctx1) {
      ctx1.fillStyle = '#06162B'
      ctx1.fillRect(0, 0, 512, 340)

      // Grid
      ctx1.strokeStyle = 'rgba(34, 211, 238, 0.15)'
      ctx1.lineWidth = 1
      for (let x = 0; x < 512; x += 32) {
        ctx1.beginPath()
        ctx1.moveTo(x, 0)
        ctx1.lineTo(x, 340)
        ctx1.stroke()
      }
      for (let y = 0; y < 340; y += 32) {
        ctx1.beginPath()
        ctx1.moveTo(0, y)
        ctx1.lineTo(512, y)
        ctx1.stroke()
      }

      // Title & Telemetry Header
      ctx1.fillStyle = '#22D3EE'
      ctx1.font = 'bold 16px monospace'
      ctx1.fillText('NEUROVOICE · ACOUSTIC MONITOR v2.4', 20, 32)

      ctx1.font = '12px monospace'
      ctx1.fillStyle = 'rgba(148, 163, 184, 0.9)'
      ctx1.fillText('GLOTTAL STABILITY: NOMINAL [98.4%]', 20, 56)
      ctx1.fillText('VOCAL FOLD HARMONICS: 24.2 dB', 20, 74)

      // Glowing Cyan ECG Waveform
      ctx1.shadowColor = '#22D3EE'
      ctx1.shadowBlur = 12
      ctx1.strokeStyle = '#22D3EE'
      ctx1.lineWidth = 3
      ctx1.beginPath()
      const ecgPoints = [
        [0, 180], [60, 180], [80, 175], [95, 185], [110, 180],
        [140, 180], [155, 195], [170, 90], [185, 230], [200, 170],
        [215, 180], [250, 180], [270, 165], [290, 180],
        [340, 180], [355, 195], [370, 90], [385, 230], [400, 170],
        [415, 180], [460, 180], [512, 180]
      ]
      ecgPoints.forEach(([x, y], i) => {
        if (i === 0) ctx1.moveTo(x, y)
        else ctx1.lineTo(x, y)
      })
      ctx1.stroke()
      ctx1.shadowBlur = 0

      // Pulse rate block
      ctx1.fillStyle = 'rgba(34, 211, 238, 0.12)'
      ctx1.fillRect(20, 240, 160, 70)
      ctx1.strokeStyle = '#22D3EE'
      ctx1.strokeRect(20, 240, 160, 70)
      ctx1.fillStyle = '#FFFFFF'
      ctx1.font = 'bold 28px monospace'
      ctx1.fillText('72 BPM', 36, 280)
      ctx1.font = '11px monospace'
      ctx1.fillStyle = '#22D3EE'
      ctx1.fillText('STEADY CADENCE', 36, 298)
    }

    // 2. Right Screen: Neurological Anatomical Wireframe & Data Columns
    const dataCanvas = document.createElement('canvas')
    dataCanvas.width = 512
    dataCanvas.height = 340
    const ctx2 = dataCanvas.getContext('2d')
    if (ctx2) {
      ctx2.fillStyle = '#06162B'
      ctx2.fillRect(0, 0, 512, 340)

      // Grid
      ctx2.strokeStyle = 'rgba(34, 211, 238, 0.12)'
      ctx2.lineWidth = 1
      for (let x = 0; x < 512; x += 32) {
        ctx2.beginPath()
        ctx2.moveTo(x, 0)
        ctx2.lineTo(x, 340)
        ctx2.stroke()
      }
      for (let y = 0; y < 340; y += 32) {
        ctx2.beginPath()
        ctx2.moveTo(0, y)
        ctx2.lineTo(512, y)
        ctx2.stroke()
      }

      ctx2.fillStyle = '#22D3EE'
      ctx2.font = 'bold 15px monospace'
      ctx2.fillText('NEURAL BIOMARKER TELEMETRY', 20, 32)

      ctx2.font = '11px monospace'
      ctx2.fillStyle = 'rgba(148, 163, 184, 0.9)'
      ctx2.fillText('CH 1: JITTER PERTURBATION   0.38% [OK]', 20, 60)
      ctx2.fillText('CH 2: SHIMMER AMPLITUDE     1.82% [OK]', 20, 80)
      ctx2.fillText('CH 3: HARMONIC RATIO        25.1 dB [OK]', 20, 100)
      ctx2.fillText('CH 4: FORMANT DISPERSION    F1/F2 STABLE', 20, 120)

      // Silhouette / Anatomical wireframe outline
      ctx2.strokeStyle = '#22D3EE'
      ctx2.lineWidth = 2
      ctx2.beginPath()
      ctx2.arc(380, 100, 30, 0, Math.PI * 2) // Head
      ctx2.moveTo(380, 130)
      ctx2.lineTo(380, 240) // Spine
      ctx2.moveTo(340, 160)
      ctx2.lineTo(420, 160) // Shoulders
      ctx2.stroke()

      // Concentric brain wave arcs
      ctx2.strokeStyle = 'rgba(34, 211, 238, 0.5)'
      ctx2.beginPath()
      ctx2.arc(380, 100, 42, -Math.PI * 0.7, -Math.PI * 0.3)
      ctx2.stroke()
      ctx2.beginPath()
      ctx2.arc(380, 100, 52, -Math.PI * 0.75, -Math.PI * 0.25)
      ctx2.stroke()

      // Diagnostic Status Bar
      ctx2.fillStyle = 'rgba(16, 185, 129, 0.2)'
      ctx2.fillRect(20, 250, 470, 50)
      ctx2.strokeStyle = '#10B981'
      ctx2.strokeRect(20, 250, 470, 50)
      ctx2.fillStyle = '#10B981'
      ctx2.font = 'bold 14px monospace'
      ctx2.fillText('✓ CLINICAL PROTOCOL: ACTIVE READY', 36, 280)
    }

    const t1 = new THREE.CanvasTexture(ecgCanvas)
    const t2 = new THREE.CanvasTexture(dataCanvas)
    return { ecgTexture: t1, dataTexture: t2 }
  }, [])
}

/**
 * 3D Humanoid Medical AI Robot Model
 * Master Prompt 7, Fix 1: Exact Image 1 Specifications
 * Doctor's white coat with lapel crease, stethoscope around neck,
 * clipboard in left hand, right hand welcoming/pointing,
 * cyan glowing eyes with PointLight, segmented ring neck, circular head ring.
 */
function MedicalAIRobotModel({
  mouse,
  isSpeaking,
  isClicking,
  isMobile,
  mode,
}: RobotModelProps) {
  const rootGroupRef = useRef<THREE.Group>(null)
  const headRef = useRef<THREE.Group>(null)
  const leftEyeRef = useRef<THREE.Mesh>(null)
  const rightEyeRef = useRef<THREE.Mesh>(null)
  const leftEyeLightRef = useRef<THREE.PointLight>(null)
  const rightEyeLightRef = useRef<THREE.PointLight>(null)
  const mouthRef = useRef<THREE.Mesh>(null)
  const bodyRef = useRef<THREE.Group>(null)
  const rightArmRef = useRef<THREE.Group>(null)
  const stethoscopeRef = useRef<THREE.Group>(null)
  const foreheadGlowRef = useRef<THREE.Mesh>(null)

  const { ecgTexture, dataTexture } = useHolographicTextures()

  // Track click animation timer
  const clickAnimTimer = useRef(0)

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime()

    // 1. IDLE ANIMATIONS
    // Slow floating translateY from 0 to -8px (approx 0.08 units in 3D scene), 4s ease loop
    if (rootGroupRef.current) {
      rootGroupRef.current.position.y = -0.22 + Math.sin(time * (Math.PI / 2)) * 0.04
    }

    // Breathing: scale.y oscillates 0.98 to 1.0, 3s loop
    if (bodyRef.current) {
      const breathScaleY = 0.99 + Math.sin(time * ((Math.PI * 2) / 3)) * 0.01
      bodyRef.current.scale.set(1.0, breathScaleY, 1.0)
    }

    // 2. MOUSE FOLLOW (Head only, lerp 0.05, max ±0.3 rad)
    if (headRef.current) {
      if (mode === 'chat') {
        headRef.current.rotation.y = Math.sin(time * 0.8) * 0.05
        headRef.current.rotation.x = Math.sin(time * 0.5) * 0.03
      } else if (isMobile) {
        headRef.current.rotation.y += Math.sin(time * 0.5) * 0.003
      } else {
        const targetRotY = THREE.MathUtils.clamp((mouse.x - 0.5) * 0.4, -0.3, 0.3)
        const targetRotX = THREE.MathUtils.clamp((mouse.y - 0.5) * -0.2, -0.3, 0.3)
        headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, targetRotY, 0.05)
        headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, targetRotX, 0.05)
      }

      // 4. CLICK ANIMATION (Tilt head 15 deg = 0.26 rad to the right for 0.5s, then return)
      if (isClicking) {
        clickAnimTimer.current = 0.5
      }
      if (clickAnimTimer.current > 0) {
        clickAnimTimer.current -= delta
        headRef.current.rotation.z = THREE.MathUtils.lerp(headRef.current.rotation.z, 0.26, 0.15)
      } else {
        headRef.current.rotation.z = THREE.MathUtils.lerp(headRef.current.rotation.z, 0, 0.1)
      }
    }

    // 3. SPEAKING ANIMATION
    let targetGlow = 1.1 + Math.sin(time * Math.PI) * 0.3
    if (isSpeaking) {
      targetGlow = 2.0 + Math.sin(time * 10) * 0.4
    }
    if (clickAnimTimer.current > 0.25) {
      targetGlow = 3.0
    }

    if (leftEyeRef.current?.material) {
      const mat = leftEyeRef.current.material as THREE.MeshStandardMaterial
      mat.emissiveIntensity = targetGlow
    }
    if (rightEyeRef.current?.material) {
      const mat = rightEyeRef.current.material as THREE.MeshStandardMaterial
      mat.emissiveIntensity = targetGlow
    }
    if (leftEyeLightRef.current) leftEyeLightRef.current.intensity = targetGlow * 0.9
    if (rightEyeLightRef.current) rightEyeLightRef.current.intensity = targetGlow * 0.9

    if (foreheadGlowRef.current?.material) {
      const mat = foreheadGlowRef.current.material as THREE.MeshStandardMaterial
      mat.emissiveIntensity = isSpeaking ? 1.8 : 0.9 + Math.sin(time * 2) * 0.3
    }

    // Mouth animation: opens and closes when speaking
    if (mouthRef.current) {
      if (isSpeaking) {
        mouthRef.current.scale.y = 0.5 + 0.5 * Math.abs(Math.sin(time * 8))
        mouthRef.current.scale.x = 1.0 + 0.2 * Math.sin(time * 6)
      } else {
        mouthRef.current.scale.set(1.0, 0.25, 1.0)
      }
    }

    // Pointing welcoming arm gesture: lifts slightly while speaking
    if (rightArmRef.current) {
      if (isSpeaking) {
        rightArmRef.current.rotation.z = 0.25 - Math.sin(time * 4) * 0.1
        rightArmRef.current.rotation.x = -0.15 + Math.sin(time * 3) * 0.08
      } else {
        rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, 0.22, 0.05)
        rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, -0.1, 0.05)
      }
    }

    // Stethoscope sways gently
    if (stethoscopeRef.current) {
      stethoscopeRef.current.rotation.z = Math.sin(time * 2) * 0.02
    }
  })

  // Body Material: White/off-white matte (#F0F4F8, metalness: 0.05, roughness: 0.4)
  const bodyMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#F0F4F8',
    metalness: 0.05,
    roughness: 0.4,
  }), [])

  // Head Material: #E8EEF4 (slightly cooler white than body)
  const headMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#E8EEF4',
    metalness: 0.05,
    roughness: 0.35,
  }), [])

  // Chrome / Metallic Hardware Material
  const chromeMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#E2E8F0',
    metalness: 0.9,
    roughness: 0.15,
  }), [])

  return (
    <group ref={rootGroupRef} position={[0, -0.2, 0]}>
      {/* ─── HOLOGRAPHIC MEDICAL SCREEN MONITORS IN BACKGROUND (Image 1 Match) ─── */}
      <group position={[0, 0.35, -1.25]}>
        {/* Left Screen: ECG Waveform */}
        <mesh position={[-1.02, 0.1, 0]} rotation={[0, 0.22, 0]}>
          <planeGeometry args={[1.05, 0.7]} />
          {ecgTexture ? (
            <meshBasicMaterial map={ecgTexture} transparent opacity={0.82} side={THREE.DoubleSide} />
          ) : (
            <meshBasicMaterial color="#0D2540" transparent opacity={0.6} side={THREE.DoubleSide} />
          )}
        </mesh>
        {/* Cyan Frame Left */}
        <mesh position={[-1.02, 0.1, 0.01]} rotation={[0, 0.22, 0]}>
          <planeGeometry args={[1.07, 0.72]} />
          <meshBasicMaterial color="#22D3EE" wireframe transparent opacity={0.35} />
        </mesh>

        {/* Right Screen: Anatomical & Feature Telemetry */}
        <mesh position={[1.02, 0.1, 0]} rotation={[0, -0.22, 0]}>
          <planeGeometry args={[1.05, 0.7]} />
          {dataTexture ? (
            <meshBasicMaterial map={dataTexture} transparent opacity={0.82} side={THREE.DoubleSide} />
          ) : (
            <meshBasicMaterial color="#0D2540" transparent opacity={0.6} side={THREE.DoubleSide} />
          )}
        </mesh>
        {/* Cyan Frame Right */}
        <mesh position={[1.02, 0.1, 0.01]} rotation={[0, -0.22, 0]}>
          <planeGeometry args={[1.07, 0.72]} />
          <meshBasicMaterial color="#22D3EE" wireframe transparent opacity={0.35} />
        </mesh>
      </group>

      {/* ─── HUMAN BODY / TORSO WITH DOCTOR LAB COAT (Image 1 Match) ─── */}
      <group ref={bodyRef}>
        {/* Main Humanoid Torso */}
        <mesh position={[0, -0.48, 0]} material={bodyMat}>
          <cylinderGeometry args={[0.52, 0.62, 0.95, 32]} />
        </mesh>

        {/* Inner Shirt Collar (Crisp White) */}
        <mesh position={[0, -0.16, 0.42]}>
          <boxGeometry args={[0.26, 0.18, 0.08]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
        </mesh>

        {/* Dark Navy Medical Tie */}
        <mesh position={[0, -0.28, 0.44]} rotation={[0.08, 0, 0]}>
          <cylinderGeometry args={[0.045, 0.065, 0.32, 16]} />
          <meshStandardMaterial color="#0A2540" roughness={0.5} />
        </mesh>

        {/* Doctor Coat Left Chest Panel with subtle lapel crease */}
        <mesh position={[-0.22, -0.36, 0.44]} rotation={[0.04, 0.14, 0.18]}>
          <boxGeometry args={[0.24, 0.64, 0.06]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.35} metalness={0.02} />
        </mesh>

        {/* Doctor Coat Right Chest Panel */}
        <mesh position={[0.22, -0.36, 0.44]} rotation={[0.04, -0.14, -0.18]}>
          <boxGeometry args={[0.24, 0.64, 0.06]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.35} metalness={0.02} />
        </mesh>

        {/* Shoulder Armor Pads (Rounded Humanoid Contours) */}
        <mesh position={[-0.56, -0.18, 0.02]} scale={[1.25, 0.85, 1.0]} material={bodyMat}>
          <sphereGeometry args={[0.18, 24, 24]} />
        </mesh>
        <mesh position={[0.56, -0.18, 0.02]} scale={[1.25, 0.85, 1.0]} material={bodyMat}>
          <sphereGeometry args={[0.18, 24, 24]} />
        </mesh>

        {/* STETHOSCOPE (Around Neck & Hanging Down - Image 1 Match) */}
        <group ref={stethoscopeRef}>
          {/* Torus tube draped around neck & shoulders */}
          <mesh position={[0, -0.04, 0.18]} rotation={[Math.PI / 2 - 0.35, 0, 0]}>
            <torusGeometry args={[0.28, 0.018, 16, 32, Math.PI]} />
            <meshStandardMaterial color="#1E293B" roughness={0.3} metalness={0.4} />
          </mesh>
          {/* Stethoscope Left Tube Stem */}
          <mesh position={[-0.14, -0.32, 0.44]} rotation={[0.15, 0, -0.06]}>
            <cylinderGeometry args={[0.014, 0.014, 0.36, 16]} />
            <meshStandardMaterial color="#1E293B" roughness={0.3} metalness={0.4} />
          </mesh>
          {/* Stethoscope Right Tube Stem */}
          <mesh position={[0.13, -0.34, 0.45]} rotation={[0.16, 0, 0.08]}>
            <cylinderGeometry args={[0.014, 0.014, 0.4, 16]} />
            <meshStandardMaterial color="#1E293B" roughness={0.3} metalness={0.4} />
          </mesh>
          {/* Stethoscope Metallic Chest Piece / Bell */}
          <mesh position={[0.14, -0.55, 0.48]} rotation={[Math.PI / 2, 0, 0]} material={chromeMat}>
            <cylinderGeometry args={[0.055, 0.055, 0.02, 24]} />
          </mesh>
          {/* Inner Cyan Bell Ring */}
          <mesh position={[0.14, -0.55, 0.492]} rotation={[Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.04, 24]} />
            <meshStandardMaterial color="#22D3EE" emissive="#22D3EE" emissiveIntensity={0.8} />
          </mesh>
        </group>

        {/* Segmented Rings Neck (3x TorusGeometry stacked per spec) */}
        {/* Central Spine Core */}
        <mesh position={[0, 0.07, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.18, 24]} />
          <meshStandardMaterial color="#0F172A" roughness={0.5} metalness={0.8} />
        </mesh>
        {/* Vertical Cervical Hydraulic Pistons */}
        {[-0.12, -0.04, 0.04, 0.12].map((x, i) => (
          <mesh key={`piston-${i}`} position={[x, 0.07, -0.06]}>
            <cylinderGeometry args={[0.015, 0.015, 0.18, 12]} />
            <meshStandardMaterial color="#CBD5E1" roughness={0.2} metalness={0.9} />
          </mesh>
        ))}

        <mesh position={[0, 0.01, 0]}>
          <torusGeometry args={[0.22, 0.03, 16, 32]} />
          <meshStandardMaterial color="#64748B" roughness={0.3} metalness={0.7} />
        </mesh>
        <mesh position={[0, 0.07, 0]}>
          <torusGeometry args={[0.19, 0.028, 16, 32]} />
          <meshStandardMaterial color="#94A3B8" roughness={0.3} metalness={0.7} />
        </mesh>
        <mesh position={[0, 0.13, 0]}>
          <torusGeometry args={[0.17, 0.025, 16, 32]} />
          <meshStandardMaterial color="#CBD5E1" roughness={0.3} metalness={0.7} />
        </mesh>

        {/* Throat Actuator Center Ring (Image 1 characteristic) */}
        <mesh position={[0, 0.06, 0.2]}>
          <cylinderGeometry args={[0.05, 0.05, 0.03, 24]} />
          <meshStandardMaterial color="#1E293B" metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.06, 0.22]}>
          <circleGeometry args={[0.03, 24]} />
          <meshStandardMaterial color="#22D3EE" emissive="#22D3EE" emissiveIntensity={1.4} />
        </mesh>
      </group>

      {/* ─── HEAD (Humanoid Sleek Android - Exact Image 1 Match) ─── */}
      <group ref={headRef} position={[0, 0.52, 0]}>
        {/* Sleek Humanoid Head Cranium (#E8EEF4) */}
        <mesh position={[0, 0.04, -0.02]} scale={[0.92, 1.12, 0.88]} material={headMat}>
          <sphereGeometry args={[0.54, 32, 32]} />
        </mesh>



        {/* Forehead Circular Diagnostic Ring (Image 1 Iconic Forehead Sensor) */}
        <group position={[0, 0.32, 0.42]} rotation={[0.24, 0, 0]}>
          {/* Outer Chrome Ring */}
          <mesh>
            <torusGeometry args={[0.088, 0.015, 16, 32]} />
            <meshStandardMaterial color="#CBD5E1" roughness={0.25} metalness={0.8} />
          </mesh>
          {/* Cyan Glowing Middle Ring */}
          <mesh position={[0, 0, 0.004]}>
            <torusGeometry args={[0.055, 0.012, 16, 32]} />
            <meshStandardMaterial color="#22D3EE" emissive="#22D3EE" emissiveIntensity={1.2} />
          </mesh>
          {/* Inner Cyan Glowing Disc */}
          <mesh ref={foreheadGlowRef} position={[0, 0, 0.008]}>
            <circleGeometry args={[0.038, 32]} />
            <meshStandardMaterial
              color="#22D3EE"
              emissive="#22D3EE"
              emissiveIntensity={1.3}
              roughness={0.1}
            />
          </mesh>
          {/* Center Dark Core Dot */}
          <mesh position={[0, 0, 0.014]}>
            <circleGeometry args={[0.016, 24]} />
            <meshStandardMaterial color="#04101E" roughness={0.9} />
          </mesh>
        </group>

        {/* Upper Forehead Accent Rings (Image 1 side skull nodes) */}
        <mesh position={[-0.24, 0.34, 0.32]} rotation={[0.3, -0.4, 0]}>
          <torusGeometry args={[0.045, 0.009, 16, 24]} />
          <meshStandardMaterial color="#22D3EE" emissive="#22D3EE" emissiveIntensity={0.8} />
        </mesh>
        <mesh position={[0.24, 0.34, 0.32]} rotation={[0.3, 0.4, 0]}>
          <torusGeometry args={[0.045, 0.009, 16, 24]} />
          <meshStandardMaterial color="#22D3EE" emissive="#22D3EE" emissiveIntensity={0.8} />
        </mesh>

        {/* Circular Detail Ring on Top of Head (#B0C4D8) */}
        <mesh position={[0, 0.58, 0.02]} rotation={[Math.PI / 2 + 0.12, 0, 0]}>
          <torusGeometry args={[0.16, 0.026, 16, 32]} />
          <meshStandardMaterial color="#B0C4D8" roughness={0.25} metalness={0.5} />
        </mesh>

        {/* Side Headset Ear Modules (Sleek White & Cyan like Image 1) */}
        <group position={[-0.52, 0.06, 0]} rotation={[0, 0, Math.PI / 2]}>
          <mesh>
            <cylinderGeometry args={[0.12, 0.12, 0.08, 24]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.3} metalness={0.2} />
          </mesh>
          <mesh position={[0, 0.042, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.08, 0.012, 16, 24]} />
            <meshStandardMaterial color="#22D3EE" emissive="#22D3EE" emissiveIntensity={1.0} />
          </mesh>
        </group>

        <group position={[0.52, 0.06, 0]} rotation={[0, 0, Math.PI / 2]}>
          <mesh>
            <cylinderGeometry args={[0.12, 0.12, 0.08, 24]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.3} metalness={0.2} />
          </mesh>
          <mesh position={[0, -0.042, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.08, 0.012, 16, 24]} />
            <meshStandardMaterial color="#22D3EE" emissive="#22D3EE" emissiveIntensity={1.0} />
          </mesh>
        </group>

        {/* Sculpted Humanoid Nose (Image 1 clean refined android nose) */}
        <mesh position={[0, 0.04, 0.49]} rotation={[0.12, 0, 0]}>
          <boxGeometry args={[0.038, 0.11, 0.04]} />
          <meshStandardMaterial color="#E8EEF4" roughness={0.3} />
        </mesh>

        {/* ─── LEFT EYE: Wide Intelligent Glowing Cyan Eye (Image 1 Exact Match) ─── */}
        <group position={[-0.18, 0.12, 0.48]}>
          {/* Recessed Dark Eye Cavity */}
          <mesh>
            <circleGeometry args={[0.082, 32]} />
            <meshStandardMaterial color="#030C17" roughness={0.5} />
          </mesh>
          {/* Circular Chrome Bezel Rim (XY plane facing camera) */}
          <mesh position={[0, 0, 0.008]}>
            <torusGeometry args={[0.08, 0.008, 16, 32]} />
            <meshStandardMaterial color="#E2E8F0" roughness={0.15} metalness={0.9} />
          </mesh>
          {/* Bright Cyan Glowing Iris Disc */}
          <mesh ref={leftEyeRef} position={[0, 0, 0.012]}>
            <circleGeometry args={[0.07, 32]} />
            <meshStandardMaterial
              color="#22D3EE"
              emissive="#22D3EE"
              emissiveIntensity={1.8}
              roughness={0.05}
            />
          </mesh>
          {/* Concentric Cyan Ring */}
          <mesh position={[0, 0, 0.015]}>
            <torusGeometry args={[0.05, 0.006, 16, 32]} />
            <meshStandardMaterial color="#A5F3FC" emissive="#22D3EE" emissiveIntensity={2.2} />
          </mesh>
          {/* Dark Center Pupil */}
          <mesh position={[0, 0, 0.018]}>
            <circleGeometry args={[0.026, 24]} />
            <meshStandardMaterial color="#020813" roughness={0.9} />
          </mesh>
          {/* High-Intensity Cyan Eye PointLight */}
          <pointLight
            ref={leftEyeLightRef}
            position={[0, 0, 0.12]}
            color="#22D3EE"
            intensity={1.8}
            distance={1.5}
          />
        </group>

        {/* ─── RIGHT EYE: Wide Intelligent Glowing Cyan Eye (Image 1 Exact Match) ─── */}
        <group position={[0.18, 0.12, 0.48]}>
          {/* Recessed Dark Eye Cavity */}
          <mesh>
            <circleGeometry args={[0.082, 32]} />
            <meshStandardMaterial color="#030C17" roughness={0.5} />
          </mesh>
          {/* Circular Chrome Bezel Rim (XY plane facing camera) */}
          <mesh position={[0, 0, 0.008]}>
            <torusGeometry args={[0.08, 0.008, 16, 32]} />
            <meshStandardMaterial color="#E2E8F0" roughness={0.15} metalness={0.9} />
          </mesh>
          {/* Bright Cyan Glowing Iris Disc */}
          <mesh ref={rightEyeRef} position={[0, 0, 0.012]}>
            <circleGeometry args={[0.07, 32]} />
            <meshStandardMaterial
              color="#22D3EE"
              emissive="#22D3EE"
              emissiveIntensity={1.8}
              roughness={0.05}
            />
          </mesh>
          {/* Concentric Cyan Ring */}
          <mesh position={[0, 0, 0.015]}>
            <torusGeometry args={[0.05, 0.006, 16, 32]} />
            <meshStandardMaterial color="#A5F3FC" emissive="#22D3EE" emissiveIntensity={2.2} />
          </mesh>
          {/* Dark Center Pupil */}
          <mesh position={[0, 0, 0.018]}>
            <circleGeometry args={[0.026, 24]} />
            <meshStandardMaterial color="#020813" roughness={0.9} />
          </mesh>
          {/* High-Intensity Cyan Eye PointLight */}
          <pointLight
            ref={rightEyeLightRef}
            position={[0, 0, 0.12]}
            color="#22D3EE"
            intensity={1.8}
            distance={1.5}
          />
        </group>

        {/* Friendly Serene Mouth Line (Clean Android Smile Slot) */}
        <group position={[0, -0.14, 0.49]}>
          <mesh ref={mouthRef}>
            <cylinderGeometry args={[0.08, 0.08, 0.014, 16, 1, false, 0, Math.PI]} />
            <meshStandardMaterial
              color="#0F172A"
              emissive="#22D3EE"
              emissiveIntensity={0.5}
              roughness={0.3}
            />
          </mesh>
        </group>
      </group>

      {/* ─── VIEWER'S LEFT (ROBOT'S RIGHT): WELCOMING / POINTING GESTURE (Image 1 Match) ─── */}
      <group ref={rightArmRef} position={[-0.52, -0.32, 0.05]}>
        {/* Upper arm sleeve in doctor white */}
        <mesh position={[-0.08, -0.06, 0.08]} rotation={[0, 0, 0.28]} material={bodyMat}>
          <cylinderGeometry args={[0.08, 0.09, 0.35, 20]} />
        </mesh>
        {/* Elbow Joint Sphere */}
        <mesh position={[-0.14, -0.22, 0.12]} material={chromeMat}>
          <sphereGeometry args={[0.065, 20, 20]} />
        </mesh>
        {/* Forearm raised welcomingly towards center */}
        <mesh position={[-0.08, -0.16, 0.28]} rotation={[-0.75, 0.2, 0.25]} material={bodyMat}>
          <cylinderGeometry args={[0.07, 0.078, 0.32, 20]} />
        </mesh>
        {/* Wrist Joint with glowing cyan ring */}
        <mesh position={[0.02, -0.06, 0.44]} material={chromeMat}>
          <sphereGeometry args={[0.055, 16, 16]} />
        </mesh>
        <mesh position={[0.02, -0.06, 0.44]} rotation={[0, 0.4, 0]}>
          <torusGeometry args={[0.058, 0.008, 12, 24]} />
          <meshStandardMaterial color="#22D3EE" emissive="#22D3EE" emissiveIntensity={1.0} />
        </mesh>
        {/* Articulated Robotic Hand Palm */}
        <mesh position={[0.06, -0.02, 0.48]} rotation={[-0.4, 0.3, 0]}>
          <boxGeometry args={[0.07, 0.09, 0.035]} />
          <meshStandardMaterial color="#E8EEF4" roughness={0.3} metalness={0.4} />
        </mesh>
        {/* Pointing Index Finger upward/forward */}
        <mesh position={[0.1, 0.08, 0.54]} rotation={[-0.2, 0.2, -0.1]}>
          <cylinderGeometry args={[0.016, 0.016, 0.09, 14]} />
          <meshStandardMaterial color="#CBD5E1" roughness={0.25} metalness={0.7} />
        </mesh>
        {/* Glowing cyan knuckle ring */}
        <mesh position={[0.095, 0.06, 0.53]} rotation={[-0.2, 0.2, -0.1]}>
          <torusGeometry args={[0.019, 0.005, 8, 16]} />
          <meshStandardMaterial color="#22D3EE" emissive="#22D3EE" emissiveIntensity={1.2} />
        </mesh>
        {/* Curled Supporting Robot Fingers */}
        {[-0.02, -0.05, -0.08].map((y, i) => (
          <mesh
            key={`finger-${i}`}
            position={[0.08, y, 0.51]}
            rotation={[-0.6, 0.3, 0]}
          >
            <cylinderGeometry args={[0.014, 0.014, 0.05, 12]} />
            <meshStandardMaterial color="#94A3B8" roughness={0.3} metalness={0.8} />
          </mesh>
        ))}
      </group>

      {/* ─── VIEWER'S RIGHT (ROBOT'S LEFT): HOLDING MEDICAL CLIPBOARD (Image 1 Match) ─── */}
      <group position={[0.52, -0.36, 0.15]} rotation={[0.1, -0.28, 0.05]}>
        {/* Upper arm sleeve */}
        <mesh position={[0.06, -0.04, 0.06]} rotation={[0, 0, -0.25]} material={bodyMat}>
          <cylinderGeometry args={[0.08, 0.09, 0.35, 20]} />
        </mesh>
        {/* Elbow Joint */}
        <mesh position={[0.12, -0.2, 0.1]} material={chromeMat}>
          <sphereGeometry args={[0.065, 20, 20]} />
        </mesh>
        {/* Forearm angled forward holding board */}
        <mesh position={[-0.02, -0.12, 0.24]} rotation={[-0.55, -0.2, -0.2]} material={bodyMat}>
          <cylinderGeometry args={[0.07, 0.078, 0.3, 20]} />
        </mesh>
        {/* Hand with cyan wrist ring */}
        <mesh position={[-0.1, -0.06, 0.36]} material={chromeMat}>
          <sphereGeometry args={[0.055, 16, 16]} />
        </mesh>
        <mesh position={[-0.1, -0.06, 0.36]} rotation={[0, -0.3, 0]}>
          <torusGeometry args={[0.058, 0.008, 12, 24]} />
          <meshStandardMaterial color="#22D3EE" emissive="#22D3EE" emissiveIntensity={1.0} />
        </mesh>

        {/* Clinical Clipboard Backboard */}
        <mesh position={[-0.16, 0.04, 0.44]} rotation={[-0.35, -0.25, 0.1]}>
          <boxGeometry args={[0.44, 0.6, 0.025]} />
          <meshStandardMaterial color="#94A3B8" roughness={0.3} metalness={0.5} />
        </mesh>
        {/* Medical Document / Paper */}
        <mesh position={[-0.16, 0.04, 0.455]} rotation={[-0.35, -0.25, 0.1]}>
          <boxGeometry args={[0.39, 0.53, 0.01]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
        </mesh>
        {/* Chrome Clip at top */}
        <mesh position={[-0.16, 0.3, 0.47]} rotation={[-0.35, -0.25, 0.1]} material={chromeMat}>
          <boxGeometry args={[0.16, 0.055, 0.03]} />
        </mesh>
        {/* Clinical Chart Lines & ECG waveform on paper */}
        {[-0.12, -0.06, 0.0, 0.06, 0.12, 0.18].map((yOff, i) => (
          <mesh
            key={`line-${i}`}
            position={[-0.16, yOff, 0.465]}
            rotation={[-0.35, -0.25, 0.1]}
          >
            <boxGeometry args={[i === 1 ? 0.22 : 0.3, 0.012, 0.004]} />
            <meshStandardMaterial color={i === 1 ? '#0284C7' : '#64748B'} />
          </mesh>
        ))}

        {/* Robotic Fingers Gripping Clipboard Edge */}
        {[0, 0.04, 0.08, 0.12].map((yOff, i) => (
          <mesh
            key={`grip-${i}`}
            position={[-0.02, yOff - 0.02, 0.48]}
            rotation={[-0.35, -0.25, 0.1]}
          >
            <cylinderGeometry args={[0.013, 0.013, 0.07, 12]} />
            <meshStandardMaterial color="#CBD5E1" roughness={0.2} metalness={0.7} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

/**
 * 10 GREETINGS (English and Hindi Alternating)
 * Master Prompt 7, Fix 1 specification
 */
export const ROBOT_GREETINGS = [
  {
    id: 1,
    lang: 'en-IN',
    text: 'Welcome to NeuroVoice. I am your AI health assistant. I can analyse your voice for early signs of neurological changes. Just thirty seconds is all it takes.',
  },
  {
    id: 2,
    lang: 'hi-IN',
    text: 'नमस्ते! मैं NeuroVoice हूँ। आपकी आवाज़ में वो संकेत हैं जो आपकी सेहत के बारे में बहुत कुछ बताते हैं। बस तीस सेकंड बोलिए — हम बाकी काम कर लेंगे।',
  },
  {
    id: 3,
    lang: 'en-IN',
    text: 'Hello! Think of me as a doctor who listens to your voice instead of checking your pulse. Thirty seconds of speaking tells me a lot about your neurological health.',
  },
  {
    id: 4,
    lang: 'hi-IN',
    text: 'आपका स्वागत है। मैं आपकी आवाज़ को ध्यान से सुनूँगा और बताऊँगा कि क्या कोई बात डॉक्टर से करने लायक है। शुरू करें?',
  },
  {
    id: 5,
    lang: 'en-IN',
    text: 'Your voice carries patterns that most people never notice. I listen for tiny changes in pitch, rhythm, and steadiness that can be early signs of neurological conditions. Shall we begin?',
  },
  {
    id: 6,
    lang: 'hi-IN',
    text: 'नमस्ते! NeuroVoice में आपका स्वागत है। हिंदी या अंग्रेज़ी — जो भाषा आपको आरामदायक लगे, उसमें बोलिए। हम सब समझ लेंगे।',
  },
  {
    id: 7,
    lang: 'en-IN',
    text: 'Good to see you. Early detection of neurological changes can make a real difference. Let me listen to your voice and we will look for patterns together.',
  },
  {
    id: 8,
    lang: 'hi-IN',
    text: 'आपकी आवाज़ में है पहला संकेत। मैं उसे सुनकर आपको बताऊँगा कि आगे क्या करना चाहिए। तैयार हैं?',
  },
  {
    id: 9,
    lang: 'en-IN',
    text: 'NeuroVoice uses the same voice measurements that neurological researchers use — analysed automatically, explained clearly, available to anyone with a smartphone.',
  },
  {
    id: 10,
    lang: 'hi-IN',
    text: 'बस तीस सेकंड की आवाज़। कोई अस्पताल नहीं, कोई मशीन नहीं। सिर्फ आपकी आवाज़ और हमारा विश्लेषण।',
  },
]

export function RobotCanvas({
  mode = 'hero',
  externalSpeaking = false,
  onSpeechEnd,
}: RobotCanvasProps) {
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 })
  const [greetingIndex, setGreetingIndex] = useState(0)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [caption, setCaption] = useState(ROBOT_GREETINGS[0].text)
  const [spokenWordsCount, setSpokenWordsCount] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [hasWebGL, setHasWebGL] = useState(true)

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
    if (isMobile || mode === 'chat') return

    const handleMouseMove = (e: MouseEvent) => {
      setMouse({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      })
    }
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [isMobile, mode])

  // Sync external speaking if passed (e.g. In Ask Chatbot mode)
  useEffect(() => {
    if (externalSpeaking !== undefined) {
      setIsSpeaking(externalSpeaking)
    }
  }, [externalSpeaking])

  /**
   * Speak greeting with priority voice selection
   */
  const sayHello = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return
    }

    window.speechSynthesis.cancel()

    // Trigger click animation (tilts head 15 deg, eye pulse)
    setIsClicking(true)
    setTimeout(() => setIsClicking(false), 500)

    // Cycle through 10 greetings
    const nextIdx = (greetingIndex + 1) % ROBOT_GREETINGS.length
    setGreetingIndex(nextIdx)
    const current = ROBOT_GREETINGS[nextIdx]
    setCaption(current.text)
    setSpokenWordsCount(0)

    if (isMuted) return

    const utterance = new SpeechSynthesisUtterance(current.text)
    utterance.lang = current.lang
    utterance.rate = 0.95
    utterance.pitch = 1.0

    // Priority voice selection:
    // Try 'Google हिन्दी' or any voice with lang 'hi-IN' for Hindi
    // Try 'Google US English' or any voice with lang 'en-IN'/'en-US' for English
    const voices = window.speechSynthesis.getVoices()
    let selectedVoice = null

    if (current.lang === 'hi-IN') {
      selectedVoice =
        voices.find((v) => v.name.includes('Google हिन्दी') || v.name.includes('Hindi')) ||
        voices.find((v) => v.lang.toLowerCase().includes('hi'))
    } else {
      selectedVoice =
        voices.find((v) => v.name.includes('Google US English') || v.name.includes('Ravi')) ||
        voices.find((v) => v.lang.toLowerCase().includes('en-in')) ||
        voices.find((v) => v.lang.toLowerCase().includes('en-us')) ||
        voices.find((v) => v.lang.toLowerCase().startsWith('en'))
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice
    } else if (voices.length > 0) {
      utterance.voice = voices[0]
    }

    // Word boundary tracking for real-time progressive caption updates
    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        setSpokenWordsCount((prev) => prev + 1)
      }
    }

    utterance.onstart = () => {
      setIsSpeaking(true)
    }

    utterance.onend = () => {
      setIsSpeaking(false)
      if (onSpeechEnd) onSpeechEnd()
    }

    utterance.onerror = () => {
      setIsSpeaking(false)
      if (onSpeechEnd) onSpeechEnd()
    }

    window.speechSynthesis.speak(utterance)
  }

  const toggleMute = () => {
    const nextMute = !isMuted
    setIsMuted(nextMute)
    if (nextMute && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }

  return (
    <div className="relative w-full rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] p-4 flex flex-col items-center">
      {/* Top Controls: Mute Toggle Only (NO 'Interactive Acoustic Avatar' or other headings) */}
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

      {/* 3D Canvas with Dark Blue Gradient and Holographic Grid Lines */}
      <div
        className="relative w-full h-[320px] sm:h-[380px] flex items-center justify-center overflow-hidden rounded-xl"
        style={{
          background: 'radial-gradient(circle at 40% 50%, #0D2347 0%, #060D1A 100%)',
        }}
      >
        {/* Subtle holographic grid lines (#1A3A5C with 0.15 opacity) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, #1A3A5C 1px, transparent 1px), linear-gradient(to bottom, #1A3A5C 1px, transparent 1px)`,
            backgroundSize: '28px 28px',
            opacity: 0.15,
          }}
        />

        {hasWebGL ? (
          <Canvas
            camera={{ position: [0, 0.15, 2.95], fov: 45 }}
            gl={{ alpha: true, antialias: true }}
          >
            {/* Specified Three-Point Lighting */}
            {/* Ambient: #1A2A4A, intensity 0.4 */}
            <ambientLight intensity={0.4} color="#1A2A4A" />
            {/* Key light: white, intensity 1.2, position (2, 3, 2) */}
            <directionalLight position={[2, 3, 2]} intensity={1.2} color="#FFFFFF" />
            {/* Fill light: #22D3EE (cyan), intensity 0.6, position (-2, 0, 1) */}
            <directionalLight position={[-2, 0, 1]} intensity={0.6} color="#22D3EE" />
            {/* Rim light: #6366F1 (indigo), intensity 0.4, position (0, -1, -3) */}
            <directionalLight position={[0, -1, -3]} intensity={0.4} color="#6366F1" />

            <MedicalAIRobotModel
              mouse={mouse}
              isSpeaking={isSpeaking}
              isClicking={isClicking}
              isMobile={isMobile}
              mode={mode}
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

        {/* [Say hello] rounded button below robot (Hero Mode only) */}
        {mode === 'hero' && (
          <button
            onClick={sayHello}
            disabled={isSpeaking}
            type="button"
            className="btn-primary absolute bottom-3 px-5 py-2 rounded-full text-xs font-semibold shadow-lg flex items-center gap-2 transition-all active:scale-95 disabled:opacity-75 disabled:cursor-not-allowed"
          >
            <Volume2 size={14} className={isSpeaking ? 'animate-pulse text-cyan-200' : ''} />
            <span>{isSpeaking ? 'Speaking...' : 'Say hello'}</span>
          </button>
        )}
      </div>

      {/* Styled Caption Box Below Robot */}
      {mode === 'hero' && (
        <div className="w-full mt-3 p-3.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-center min-h-[54px] flex items-center justify-center gap-2.5">
          <MessageSquareQuote size={16} className="shrink-0 text-[var(--accent)]" />
          <p className="text-xs font-medium text-[var(--text)] italic leading-snug">
            &ldquo;{caption}&rdquo;
          </p>
        </div>
      )}
    </div>
  )
}
