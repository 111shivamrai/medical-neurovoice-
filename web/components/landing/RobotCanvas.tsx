'use client'

import React, { useRef, useState, useEffect, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Volume2, VolumeX, MessageSquareQuote } from 'lucide-react'

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

const ROBOT_GREETINGS = [
  { text: "Hello! I am NeuroVoice AI, your vocal screening assistant. Ready to assess your voice health?", lang: "en-US" },
  { text: "नमस्ते! मैं न्यूरोवॉइस एआई हूँ। आपकी आवाज़ के स्वास्थ्य की जांच के लिए तैयार हूँ।", lang: "hi-IN" },
  { text: "Voice biomarkers can reveal early neurological changes years before severe symptoms.", lang: "en-US" },
  { text: "आपकी आवाज़ में सूक्ष्म बदलाव बहुत कुछ बता सकते हैं। चलिए 30 सेकंड की जांच शुरू करें।", lang: "hi-IN" },
  { text: "I monitor vocal fold stability, vowel precision, and natural conversational cadence.", lang: "en-US" },
  { text: "हम पार्किंसंस, अल्जाइमर और डिस्आर्थ्रिया के शुरुआती संकेतों का विश्लेषण करते हैं।", lang: "hi-IN" },
  { text: "Clear speech and steady breathing help capture the highest acoustic quality.", lang: "en-US" },
  { text: "यह जांच सरल, सुरक्षित और आपके फोन के माइक्रोफोन पर पूरी तरह काम करती है।", lang: "hi-IN" },
  { text: "Our multi-task clinical protocol takes just thirty seconds across three voice prompts.", lang: "en-US" },
  { text: "शुरू करने के लिए 'Start Free Screening' पर क्लिक करें।", lang: "hi-IN" },
]

/**
 * Creates dynamic textures for Holographic Screens
 */
function useHolographicCanvases() {
  return useMemo(() => {
    if (typeof document === 'undefined') return { ecgTexture: null, rightScreenTexture: null }

    // Left Screen: Animated ECG Waveform Canvas
    const ecgCanvas = document.createElement('canvas')
    ecgCanvas.width = 1024
    ecgCanvas.height = 512
    const ctx1 = ecgCanvas.getContext('2d')
    if (ctx1) {
      ctx1.fillStyle = 'rgba(5, 15, 40, 0.92)'
      ctx1.fillRect(0, 0, 1024, 512)

      // Subtle cyan grid
      ctx1.strokeStyle = 'rgba(34, 211, 238, 0.18)'
      ctx1.lineWidth = 1.5
      for (let x = 0; x < 1024; x += 64) {
        ctx1.beginPath()
        ctx1.moveTo(x, 0)
        ctx1.lineTo(x, 512)
        ctx1.stroke()
      }
      for (let y = 0; y < 512; y += 64) {
        ctx1.beginPath()
        ctx1.moveTo(0, y)
        ctx1.lineTo(1024, y)
        ctx1.stroke()
      }

      // Title & labels
      ctx1.fillStyle = '#22D3EE'
      ctx1.font = 'bold 24px monospace'
      ctx1.fillText('NEUROVOICE · ACOUSTIC MONITOR v2.8', 40, 48)

      ctx1.fillStyle = 'rgba(34, 211, 238, 0.35)'
      ctx1.fillRect(40, 72, 380, 8)
      ctx1.fillRect(40, 92, 260, 6)

      // Continuous ECG repeating waveform pattern
      ctx1.shadowColor = '#22D3EE'
      ctx1.shadowBlur = 14
      ctx1.strokeStyle = '#22D3EE'
      ctx1.lineWidth = 4
      ctx1.beginPath()
      const segWidth = 512
      for (let offset = 0; offset <= 1024; offset += segWidth) {
        const pts = [
          [offset, 300], [offset + 70, 300], [offset + 95, 290], [offset + 115, 310], [offset + 135, 300],
          [offset + 170, 300], [offset + 190, 325], [offset + 210, 140], [offset + 230, 380], [offset + 250, 280],
          [offset + 270, 300], [offset + 320, 300], [offset + 350, 275], [offset + 380, 300], [offset + segWidth, 300]
        ]
        pts.forEach(([x, y], i) => {
          if (offset === 0 && i === 0) ctx1.moveTo(x, y)
          else ctx1.lineTo(x, y)
        })
      }
      ctx1.stroke()
      ctx1.shadowBlur = 0

      // Glowing Pulse Circle
      ctx1.fillStyle = '#FFFFFF'
      ctx1.beginPath()
      ctx1.arc(210, 140, 10, 0, Math.PI * 2)
      ctx1.fill()
      ctx1.fillStyle = '#22D3EE'
      ctx1.beginPath()
      ctx1.arc(210, 140, 18, 0, Math.PI * 2)
      ctx1.fill()
    }

    // Right Screen: Human body outline & Data readout chart
    const rightCanvas = document.createElement('canvas')
    rightCanvas.width = 1024
    rightCanvas.height = 768
    const ctx2 = rightCanvas.getContext('2d')
    if (ctx2) {
      ctx2.fillStyle = 'rgba(5, 15, 40, 0.92)'
      ctx2.fillRect(0, 0, 1024, 768)

      // Grid
      ctx2.strokeStyle = 'rgba(34, 211, 238, 0.15)'
      ctx2.lineWidth = 1.5
      for (let x = 0; x < 1024; x += 64) {
        ctx2.beginPath()
        ctx2.moveTo(x, 0)
        ctx2.lineTo(x, 768)
        ctx2.stroke()
      }
      for (let y = 0; y < 768; y += 64) {
        ctx2.beginPath()
        ctx2.moveTo(0, y)
        ctx2.lineTo(1024, y)
        ctx2.stroke()
      }

      ctx2.fillStyle = '#22D3EE'
      ctx2.font = 'bold 24px monospace'
      ctx2.fillText('NEURO-ANATOMICAL TELEMETRY', 40, 50)

      // Vertical data readout chart lines
      for (let i = 0; i < 7; i++) {
        const y = 110 + i * 45
        ctx2.fillStyle = 'rgba(34, 211, 238, 0.4)'
        ctx2.fillRect(40, y, 160 + (i * 47) % 220, 12)
        ctx2.fillStyle = '#FFFFFF'
        ctx2.font = '16px monospace'
        ctx2.fillText(`CH-0${i + 1} NOMINAL`, 460, y + 10)
      }

      // Stick figure / anatomical outline with circles for joints
      const cx = 820
      const cy = 360
      ctx2.strokeStyle = '#22D3EE'
      ctx2.lineWidth = 4
      ctx2.fillStyle = '#22D3EE'

      // Head
      ctx2.beginPath()
      ctx2.arc(cx, cy - 140, 40, 0, Math.PI * 2)
      ctx2.stroke()
      // Spine
      ctx2.beginPath()
      ctx2.moveTo(cx, cy - 100)
      ctx2.lineTo(cx, cy + 80)
      ctx2.stroke()
      // Shoulders & Arms
      ctx2.beginPath()
      ctx2.moveTo(cx - 70, cy - 40)
      ctx2.lineTo(cx + 70, cy - 40)
      ctx2.lineTo(cx + 90, cy + 40)
      ctx2.moveTo(cx - 70, cy - 40)
      ctx2.lineTo(cx - 90, cy + 40)
      ctx2.stroke()
      // Legs
      ctx2.beginPath()
      ctx2.moveTo(cx, cy + 80)
      ctx2.lineTo(cx - 50, cy + 220)
      ctx2.moveTo(cx, cy + 80)
      ctx2.lineTo(cx + 50, cy + 220)
      ctx2.stroke()

      // Joint circles
      ;[[cx - 70, cy - 40], [cx + 70, cy - 40], [cx - 90, cy + 40], [cx + 90, cy + 40], [cx, cy + 80], [cx - 50, cy + 220], [cx + 50, cy + 220]].forEach(([jx, jy]) => {
        ctx2.beginPath()
        ctx2.arc(jx, jy, 8, 0, Math.PI * 2)
        ctx2.fill()
      })
    }

    const t1 = new THREE.CanvasTexture(ecgCanvas)
    t1.wrapS = THREE.RepeatWrapping
    t1.wrapT = THREE.ClampToEdgeWrapping
    const t2 = new THREE.CanvasTexture(rightCanvas)
    return { ecgTexture: t1, rightScreenTexture: t2 }
  }, [])
}

/**
 * 5-Finger Hand Builder (Point gesture or Grip gesture)
 */
function RoboticHand({ isPointing = false, isLeft = false }: { isPointing?: boolean; isLeft?: boolean }) {
  const jointMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#B8C8D8', metalness: 0.6, roughness: 0.3 }), [])
  const fingerMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#E8EEF5', metalness: 0.08, roughness: 0.35 }), [])
  const palmMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#E8EEF5', metalness: 0.08, roughness: 0.35 }), [])

  return (
    <group scale={isLeft ? [-1, 1, 1] : [1, 1, 1]}>
      {/* Palm connecting all fingers */}
      <mesh material={palmMat} position={[0, -0.05, 0]}>
        <boxGeometry args={[0.095, 0.1, 0.045]} />
      </mesh>

      {/* Index Finger (Straightened and pointing up/forward if pointing) */}
      <group position={[0.032, -0.1, 0.01]} rotation={isPointing ? [-0.65, 0, 0.15] : [0.9, 0, 0]}>
        <mesh material={fingerMat} position={[0, -0.027, 0]}>
          <cylinderGeometry args={[0.016, 0.014, 0.055, 16]} />
        </mesh>
        <mesh material={jointMat} position={[0, -0.055, 0]}>
          <torusGeometry args={[0.015, 0.005, 12, 16]} />
        </mesh>
        <group position={[0, -0.055, 0]} rotation={isPointing ? [0.1, 0, 0] : [0.7, 0, 0]}>
          <mesh material={fingerMat} position={[0, -0.027, 0]}>
            <cylinderGeometry args={[0.014, 0.012, 0.055, 16]} />
          </mesh>
          <mesh material={jointMat} position={[0, -0.055, 0]}>
            <torusGeometry args={[0.013, 0.005, 12, 16]} />
          </mesh>
          <mesh material={fingerMat} position={[0, -0.08, 0]}>
            <cylinderGeometry args={[0.012, 0.01, 0.05, 16]} />
          </mesh>
        </group>
      </group>

      {/* Middle Finger (Curled inward) */}
      <group position={[0.01, -0.1, 0.01]} rotation={isPointing ? [0.95, 0, 0] : [1.0, 0, 0]}>
        <mesh material={fingerMat} position={[0, -0.028, 0]}>
          <cylinderGeometry args={[0.016, 0.014, 0.058, 16]} />
        </mesh>
        <mesh material={jointMat} position={[0, -0.058, 0]}>
          <torusGeometry args={[0.015, 0.005, 12, 16]} />
        </mesh>
        <group position={[0, -0.058, 0]} rotation={[0.85, 0, 0]}>
          <mesh material={fingerMat} position={[0, -0.028, 0]}>
            <cylinderGeometry args={[0.014, 0.012, 0.055, 16]} />
          </mesh>
          <mesh material={fingerMat} position={[0, -0.065, 0]}>
            <cylinderGeometry args={[0.012, 0.01, 0.045, 16]} />
          </mesh>
        </group>
      </group>

      {/* Ring Finger (Curled inward) */}
      <group position={[-0.014, -0.098, 0.01]} rotation={[1.1, 0, 0]}>
        <mesh material={fingerMat} position={[0, -0.025, 0]}>
          <cylinderGeometry args={[0.015, 0.013, 0.052, 16]} />
        </mesh>
        <group position={[0, -0.052, 0]} rotation={[0.85, 0, 0]}>
          <mesh material={fingerMat} position={[0, -0.025, 0]}>
            <cylinderGeometry args={[0.013, 0.011, 0.05, 16]} />
          </mesh>
        </group>
      </group>

      {/* Pinky Finger (Curled inward) */}
      <group position={[-0.035, -0.092, 0.01]} rotation={[1.15, 0, 0]}>
        <mesh material={fingerMat} position={[0, -0.022, 0]}>
          <cylinderGeometry args={[0.014, 0.012, 0.045, 16]} />
        </mesh>
        <group position={[0, -0.045, 0]} rotation={[0.85, 0, 0]}>
          <mesh material={fingerMat} position={[0, -0.022, 0]}>
            <cylinderGeometry args={[0.012, 0.01, 0.04, 16]} />
          </mesh>
        </group>
      </group>

      {/* Thumb (Shorter, angled outward from palm) */}
      <group position={[0.05, -0.035, 0.015]} rotation={[0.4, -0.5, -0.6]}>
        <mesh material={fingerMat} position={[0, -0.024, 0]}>
          <cylinderGeometry args={[0.016, 0.014, 0.048, 16]} />
        </mesh>
        <mesh material={jointMat} position={[0, -0.048, 0]}>
          <torusGeometry args={[0.015, 0.005, 12, 16]} />
        </mesh>
        <mesh material={fingerMat} position={[0, -0.07, 0]}>
          <cylinderGeometry args={[0.014, 0.012, 0.045, 16]} />
        </mesh>
      </group>
    </group>
  )
}

/**
 * Full Master Prompt 8 Robot Model
 */
function MedicalAIRobotMasterModel({
  mouse,
  isSpeaking,
  isClicking,
  isMobile,
  mode,
}: RobotModelProps) {
  const robotGroupRef = useRef<THREE.Group>(null)
  const bodyGroupRef = useRef<THREE.Group>(null)
  const headGroupRef = useRef<THREE.Group>(null)
  const rightArmGroupRef = useRef<THREE.Group>(null)
  const leftEyeMatRef = useRef<THREE.MeshStandardMaterial>(null)
  const rightEyeMatRef = useRef<THREE.MeshStandardMaterial>(null)
  const leftEyeLightRef = useRef<THREE.PointLight>(null)
  const rightEyeLightRef = useRef<THREE.PointLight>(null)

  const clickTimer = useRef(0)

  const { ecgTexture, rightScreenTexture } = useHolographicCanvases()

  // Stethoscope CatmullRom curves per exact spec
  const { leftStethGeo, rightStethGeo } = useMemo(() => {
    const leftCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.3, -0.72, 0.1),
      new THREE.Vector3(-0.16, -0.84, 0.13),
      new THREE.Vector3(-0.06, -0.92, 0.145),
      new THREE.Vector3(0, -0.95, 0.15),
    ])
    const rightCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.3, -0.72, 0.1),
      new THREE.Vector3(0.16, -0.84, 0.13),
      new THREE.Vector3(0.06, -0.92, 0.145),
      new THREE.Vector3(0, -0.95, 0.15),
    ])
    return {
      leftStethGeo: new THREE.TubeGeometry(leftCurve, 32, 0.018, 16, false),
      rightStethGeo: new THREE.TubeGeometry(rightCurve, 32, 0.018, 16, false),
    }
  }, [])

  // Shared Materials per exact spec
  const headMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#E8EEF5',
        metalness: 0.08,
        roughness: 0.35,
        envMapIntensity: 0.4,
      }),
    []
  )

  const coatMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#F0F4F8',
        metalness: 0.05,
        roughness: 0.45,
      }),
    []
  )

  const lapelMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#E8EEF5',
        metalness: 0.05,
        roughness: 0.35,
        side: THREE.DoubleSide,
      }),
    []
  )

  const tieMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#3A4A5C',
        roughness: 0.9,
        side: THREE.DoubleSide,
      }),
    []
  )

  const stethMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#9BAAB8',
        roughness: 0.5,
        metalness: 0.2,
      }),
    []
  )

  const eyeMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#4DAEE8',
        emissive: '#22D3EE',
        emissiveIntensity: 1.8,
        transparent: true,
        opacity: 0.95,
      }),
    []
  )

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime()

    // 1. IDLE FLOAT
    if (robotGroupRef.current) {
      robotGroupRef.current.position.y = 0.55 + Math.sin(t * 0.7) * 0.06
    }

    // 2. IDLE BREATHING
    if (bodyGroupRef.current) {
      bodyGroupRef.current.scale.y = 1.0 + Math.sin(t * 1.1) * 0.012
      bodyGroupRef.current.scale.x = 1.0 - Math.sin(t * 1.1) * 0.004
    }

    // 3. HEAD MOUSE FOLLOW
    if (headGroupRef.current) {
      if (isMobile) {
        headGroupRef.current.rotation.y = Math.sin(t * 0.4) * 0.15
        headGroupRef.current.rotation.x = Math.sin(t * 0.3) * 0.05
      } else {
        const targetRotY = (mouse.x - 0.5) * 0.5
        const targetRotX = (mouse.y - 0.5) * -0.25
        headGroupRef.current.rotation.y = THREE.MathUtils.lerp(headGroupRef.current.rotation.y, targetRotY, 0.04)
        headGroupRef.current.rotation.x = THREE.MathUtils.lerp(headGroupRef.current.rotation.x, targetRotX, 0.04)
      }

      // 7. CLICK GREETING ANIMATION
      if (isClicking) {
        clickTimer.current = 0.7
      }
      if (clickTimer.current > 0) {
        clickTimer.current -= delta
        if (clickTimer.current > 0.4) {
          headGroupRef.current.rotation.z = THREE.MathUtils.lerp(headGroupRef.current.rotation.z, 0.18, 0.2)
        } else {
          headGroupRef.current.rotation.z = THREE.MathUtils.lerp(headGroupRef.current.rotation.z, 0.0, 0.15)
        }
      } else if (isSpeaking) {
        // Head tilts very slightly while speaking
        headGroupRef.current.rotation.z = Math.sin(t * 3) * 0.025
      } else {
        headGroupRef.current.rotation.z = THREE.MathUtils.lerp(headGroupRef.current.rotation.z, 0.0, 0.05)
      }
    }

    // 4. EYE GLOW PULSE & 5. SPEAKING ANIMATION
    let intensity = 1.5 + Math.sin(t * 2.0) * 0.4
    if (isSpeaking) {
      intensity = 2.5 + Math.sin(t * 12) * 1.0
    }
    if (leftEyeMatRef.current) leftEyeMatRef.current.emissiveIntensity = intensity
    if (rightEyeMatRef.current) rightEyeMatRef.current.emissiveIntensity = intensity
    if (leftEyeLightRef.current) leftEyeLightRef.current.intensity = intensity * 0.5
    if (rightEyeLightRef.current) rightEyeLightRef.current.intensity = intensity * 0.5

    // Right hand (pointing) moves slightly while speaking
    if (rightArmGroupRef.current) {
      if (isSpeaking) {
        rightArmGroupRef.current.rotation.z = Math.sin(t * 8) * 0.06
        rightArmGroupRef.current.rotation.x = -0.1 + Math.sin(t * 4) * 0.04
      } else {
        rightArmGroupRef.current.rotation.z = THREE.MathUtils.lerp(rightArmGroupRef.current.rotation.z, 0, 0.05)
        rightArmGroupRef.current.rotation.x = THREE.MathUtils.lerp(rightArmGroupRef.current.rotation.x, 0, 0.05)
      }
    }

    // 6. ECG SCREEN ANIMATION (move UV offset leftward each frame)
    if (ecgTexture) {
      ecgTexture.offset.x = (t * 0.15) % 1.0
    }
  })

  return (
    <group ref={robotGroupRef} position={[0, 0.55, 0]}>
      {/* ─── BACKGROUND SCENE: Dark Navy Gradient Backdrop ─── */}
      <mesh position={[0, -0.6, -2.8]}>
        <planeGeometry args={[5.0, 5.0]} />
        <meshBasicMaterial color="#0A1E35" side={THREE.DoubleSide} />
      </mesh>

      {/* ─── HOLOGRAPHIC SCREENS (Behind Robot) ─── */}
      {/* LEFT SCREEN: Animated ECG Waveform */}
      <group position={[-0.9, -0.5, -2.0]} rotation={[0, 0.15, 0]}>
        <mesh>
          <planeGeometry args={[1.4, 1.0]} />
          {ecgTexture ? (
            <meshBasicMaterial map={ecgTexture} transparent opacity={0.88} side={THREE.DoubleSide} />
          ) : (
            <meshBasicMaterial color="#050F28" transparent opacity={0.85} side={THREE.DoubleSide} />
          )}
        </mesh>
        {/* Cyan Glowing Border */}
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[1.42, 1.02]} />
          <meshBasicMaterial color="#22D3EE" wireframe transparent opacity={0.4} />
        </mesh>
      </group>

      {/* RIGHT SCREEN: Anatomical Chart & Telemetry Readout */}
      <group position={[0.9, -0.4, -2.2]} rotation={[0, -0.15, 0]}>
        <mesh>
          <planeGeometry args={[1.2, 0.9]} />
          {rightScreenTexture ? (
            <meshBasicMaterial map={rightScreenTexture} transparent opacity={0.88} side={THREE.DoubleSide} />
          ) : (
            <meshBasicMaterial color="#050F28" transparent opacity={0.85} side={THREE.DoubleSide} />
          )}
        </mesh>
        {/* Cyan Glowing Border */}
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[1.22, 0.92]} />
          <meshBasicMaterial color="#22D3EE" wireframe transparent opacity={0.4} />
        </mesh>
      </group>

      {/* ─── HEAD GROUP ─── */}
      <group ref={headGroupRef} position={[0, 0, 0]}>
        {/* Head Shape: SphereGeometry(0.42, 64, 64) scaleY: 1.08 */}
        <mesh position={[0, 0, 0]} scale={[1.0, 1.08, 1.0]} material={headMat}>
          <sphereGeometry args={[0.42, 64, 64]} />
        </mesh>

        {/* EYES: Almond/oval concave discs set INTO face */}
        {/* Left Eye */}
        <mesh
          position={[-0.14, 0.05, 0.38]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={[1.1, 1.0, 0.9]}
        >
          <cylinderGeometry args={[0.09, 0.09, 0.02, 32]} />
          <primitive object={eyeMat} ref={leftEyeMatRef} attach="material" />
        </mesh>
        <pointLight
          ref={leftEyeLightRef}
          position={[-0.14, 0.05, 0.42]}
          color="#22D3EE"
          intensity={0.9}
          distance={0.4}
        />

        {/* Right Eye */}
        <mesh
          position={[0.14, 0.05, 0.38]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={[1.1, 1.0, 0.9]}
        >
          <cylinderGeometry args={[0.09, 0.09, 0.02, 32]} />
          <primitive object={eyeMat} ref={rightEyeMatRef} attach="material" />
        </mesh>
        <pointLight
          ref={rightEyeLightRef}
          position={[0.14, 0.05, 0.42]}
          color="#22D3EE"
          intensity={0.9}
          distance={0.4}
        />

        {/* HEAD TOP EMBLEM: 3 Concentric Rings */}
        <group position={[0, 0.44, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          {/* Ring 1 (outer) */}
          <mesh>
            <torusGeometry args={[0.12, 0.012, 16, 64]} />
            <meshStandardMaterial color="#8AAABB" metalness={0.5} roughness={0.3} />
          </mesh>
          {/* Ring 2 (middle) */}
          <mesh>
            <torusGeometry args={[0.075, 0.01, 16, 64]} />
            <meshStandardMaterial color="#6B9AAD" metalness={0.5} roughness={0.3} />
          </mesh>
          {/* Ring 3 (inner) */}
          <mesh>
            <torusGeometry args={[0.038, 0.012, 16, 64]} />
            <meshStandardMaterial color="#4DAEE8" emissive="#22D3EE" emissiveIntensity={0.8} />
          </mesh>
          {/* Center Dot */}
          <mesh position={[0, 0, 0.005]}>
            <sphereGeometry args={[0.018, 16, 16]} />
            <meshStandardMaterial color="#22D3EE" emissive="#22D3EE" emissiveIntensity={1.5} />
          </mesh>
        </group>

        {/* EAR MODULES */}
        {/* Left Ear */}
        <group position={[-0.44, 0.0, 0.0]}>
          <mesh material={headMat}>
            <sphereGeometry args={[0.07, 32, 32]} />
          </mesh>
          <mesh position={[-0.05, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <circleGeometry args={[0.04, 24]} />
            <meshStandardMaterial color="#6B9AAD" roughness={0.4} />
          </mesh>
        </group>

        {/* Right Ear */}
        <group position={[0.44, 0.0, 0.0]}>
          <mesh material={headMat}>
            <sphereGeometry args={[0.07, 32, 32]} />
          </mesh>
          <mesh position={[0.05, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <circleGeometry args={[0.04, 24]} />
            <meshStandardMaterial color="#6B9AAD" roughness={0.4} />
          </mesh>
        </group>
      </group>

      {/* ─── NECK: 3 Stacked Ring Segments + Base Ring ─── */}
      <group position={[0, 0, 0]}>
        <mesh position={[0, -0.46, 0]} rotation={[Math.PI / 2, 0, 0]} material={headMat}>
          <torusGeometry args={[0.14, 0.025, 16, 32]} />
        </mesh>
        <mesh position={[0, -0.52, 0]} rotation={[Math.PI / 2, 0, 0]} material={headMat}>
          <torusGeometry args={[0.14, 0.025, 16, 32]} />
        </mesh>
        <mesh position={[0, -0.58, 0]} rotation={[Math.PI / 2, 0, 0]} material={headMat}>
          <torusGeometry args={[0.14, 0.025, 16, 32]} />
        </mesh>
        {/* Base Ring at y: -0.62 */}
        <mesh position={[0, -0.62, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.18, 0.015, 16, 32]} />
          <meshStandardMaterial color="#9BAAB8" roughness={0.3} metalness={0.7} />
        </mesh>
      </group>

      {/* ─── BODY / TORSO: DOCTOR'S WHITE COAT ─── */}
      <group ref={bodyGroupRef}>
        {/* Coat Body: BoxGeometry(0.72, 0.9, 0.22) at (0, -1.1, 0) */}
        <mesh position={[0, -1.1, 0]} material={coatMat}>
          <boxGeometry args={[0.72, 0.9, 0.22]} />
        </mesh>

        {/* Necktie: PlaneGeometry(0.06, 0.38) at (0, -0.95, 0.12) */}
        <mesh position={[0, -0.95, 0.12]} material={tieMat}>
          <planeGeometry args={[0.06, 0.38]} />
        </mesh>

        {/* Left Lapel (viewer's right): flat tapered triangle */}
        <mesh position={[0.12, -0.88, 0.13]} rotation={[0, 0, -0.16]} material={lapelMat}>
          <planeGeometry args={[0.18, 0.44]} />
        </mesh>

        {/* Right Lapel (viewer's left): flat tapered triangle */}
        <mesh position={[-0.12, -0.88, 0.13]} rotation={[0, 0, 0.16]} material={lapelMat}>
          <planeGeometry args={[0.18, 0.44]} />
        </mesh>

        {/* STETHOSCOPE: CatmullRomCurve3 tubes + diaphragm */}
        <group>
          <mesh geometry={leftStethGeo} material={stethMat} />
          <mesh geometry={rightStethGeo} material={stethMat} />
          {/* Diaphragm Piece at chest meeting point (0, -0.95, 0.15) */}
          <mesh position={[0, -0.95, 0.15]}>
            <sphereGeometry args={[0.03, 24, 24]} />
            <meshStandardMaterial color="#A0ADB8" roughness={0.2} metalness={0.8} />
          </mesh>
        </group>

        {/* ─── ARMS AND HANDS ─── */}
        {/* RIGHT ARM (viewer's LEFT — Pointing Hand) */}
        <group ref={rightArmGroupRef} position={[-0.42, -0.72, 0]}>
          {/* Upper Arm: CylinderGeometry(0.09, 0.08, 0.38, 32) at (-0.42, -0.9, 0.0) relative */}
          <mesh position={[0, -0.18, 0]} rotation={[0.2, 0, 0.32]} material={headMat}>
            <cylinderGeometry args={[0.09, 0.08, 0.38, 32]} />
          </mesh>

          {/* Forearm bent at elbow */}
          <group position={[-0.08, -0.36, 0.08]} rotation={[-0.6, 0.1, 0.2]}>
            <mesh position={[0, -0.16, 0]} material={headMat}>
              <cylinderGeometry args={[0.075, 0.07, 0.34, 32]} />
            </mesh>
            {/* Wrist Ring */}
            <mesh position={[0, -0.32, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.078, 0.015, 16, 32]} />
              <meshStandardMaterial color="#9BAAB8" roughness={0.3} metalness={0.6} />
            </mesh>

            {/* Hand with 5 fingers: index pointing up/forward */}
            <group position={[0, -0.33, 0]}>
              <RoboticHand isPointing={true} isLeft={false} />
            </group>
          </group>
        </group>

        {/* LEFT ARM (viewer's RIGHT — Clipboard Hand) */}
        <group position={[0.42, -0.72, 0]}>
          {/* Upper Arm */}
          <mesh position={[0.02, -0.18, 0]} rotation={[-0.1, 0, -0.18]} material={headMat}>
            <cylinderGeometry args={[0.09, 0.08, 0.38, 32]} />
          </mesh>

          {/* Forearm angled forward to hold clipboard */}
          <group position={[0.06, -0.36, 0.08]} rotation={[0.4, -0.2, -0.1]}>
            <mesh position={[0, -0.16, 0]} material={headMat}>
              <cylinderGeometry args={[0.075, 0.07, 0.34, 32]} />
            </mesh>
            {/* Wrist Ring */}
            <mesh position={[0, -0.32, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.078, 0.015, 16, 32]} />
              <meshStandardMaterial color="#9BAAB8" roughness={0.3} metalness={0.6} />
            </mesh>

            {/* Hand gripping clipboard */}
            <group position={[0, -0.33, 0]}>
              <RoboticHand isPointing={false} isLeft={true} />

              {/* CLIPBOARD */}
              <group position={[0.04, -0.05, 0.06]} rotation={[-0.3, 0.2, 0]}>
                {/* Backing: BoxGeometry(0.22, 0.28, 0.018), #C8A878 */}
                <mesh position={[0, 0, 0]}>
                  <boxGeometry args={[0.22, 0.28, 0.018]} />
                  <meshStandardMaterial color="#C8A878" roughness={0.6} />
                </mesh>
                {/* Paper: PlaneGeometry(0.18, 0.22), #F5F5F0 */}
                <mesh position={[0, -0.01, 0.011]}>
                  <planeGeometry args={[0.18, 0.22]} />
                  <meshStandardMaterial color="#F5F5F0" roughness={0.9} />
                </mesh>
                {/* Clip at top: BoxGeometry(0.08, 0.025, 0.025), #9BAAB8 */}
                <mesh position={[0, 0.12, 0.016]}>
                  <boxGeometry args={[0.08, 0.025, 0.025]} />
                  <meshStandardMaterial color="#9BAAB8" metalness={0.8} roughness={0.2} />
                </mesh>
                {/* 4 Paper Lines: thin PlaneGeometry strips, #CCCCCC, 0.3 opacity */}
                {[0.05, 0.0, -0.05, -0.1].map((ly, i) => (
                  <mesh key={i} position={[0, ly, 0.013]}>
                    <planeGeometry args={[0.14, 0.008]} />
                    <meshBasicMaterial color="#CCCCCC" transparent opacity={0.3} />
                  </mesh>
                ))}
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  )
}

/**
 * Lighting per exact specification
 */
function RobotLighting() {
  return (
    <>
      <ambientLight color="#1A3050" intensity={0.6} />
      {/* Key light: front-right */}
      <directionalLight position={[2.5, 3.0, 2.5]} intensity={1.4} color="#FFFFFF" />
      {/* Fill light: front-left cyan */}
      <directionalLight position={[-2.0, 1.0, 2.0]} intensity={0.7} color="#88CCEE" />
      {/* Rim light: behind */}
      <directionalLight position={[0, -0.5, -3.0]} intensity={0.5} color="#4488BB" />
    </>
  )
}

/**
 * Exported RobotCanvas Component
 * Used in BOTH HeroSection and Ask / VoiceIQ page
 */
export function RobotCanvas({
  mode = 'hero',
  externalSpeaking,
  onSpeechEnd,
}: RobotCanvasProps) {
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 })
  const [greetingIndex, setGreetingIndex] = useState(0)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [caption, setCaption] = useState(ROBOT_GREETINGS[0].text)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
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
      setMouse({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      })
    }
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [isMobile])

  useEffect(() => {
    if (externalSpeaking !== undefined) {
      setIsSpeaking(externalSpeaking)
    }
  }, [externalSpeaking])

  const sayHello = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return

    window.speechSynthesis.cancel()

    setIsClicking(true)
    setTimeout(() => setIsClicking(false), 700)

    const nextIdx = (greetingIndex + 1) % ROBOT_GREETINGS.length
    setGreetingIndex(nextIdx)
    const current = ROBOT_GREETINGS[nextIdx]
    setCaption(current.text)

    if (isMuted) return

    const utterance = new SpeechSynthesisUtterance(current.text)
    utterance.lang = current.lang
    utterance.rate = 0.95
    utterance.pitch = 1.0

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
    if (selectedVoice) utterance.voice = selectedVoice

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => {
      setIsSpeaking(false)
      if (onSpeechEnd) onSpeechEnd()
    }
    utterance.onerror = () => setIsSpeaking(false)

    window.speechSynthesis.speak(utterance)
  }

  const toggleMute = () => {
    const next = !isMuted
    setIsMuted(next)
    if (next && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }

  return (
    <div className="relative w-full flex flex-col items-center">
      {/* Container Card */}
      <div
        className="relative w-full h-[340px] sm:h-[400px] flex items-center justify-center overflow-hidden rounded-2xl shadow-lg border border-[var(--border)]"
        style={{
          background: 'radial-gradient(circle at 40% 50%, #0D2B52 0%, #0A1E35 100%)',
        }}
      >
        {/* Single Mute Button in top-right */}
        <button
          onClick={toggleMute}
          type="button"
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-slate-900/70 border border-slate-700/60 backdrop-blur-sm flex items-center justify-center hover:bg-slate-800 transition-colors shadow-sm"
          title={isMuted ? 'Unmute assistant voice' : 'Mute assistant voice'}
          aria-label={isMuted ? 'Unmute voice' : 'Mute voice'}
        >
          {isMuted ? (
            <VolumeX size={15} className="text-red-400" />
          ) : (
            <Volume2 size={15} className="text-cyan-400" />
          )}
        </button>

        {/* 3D Canvas */}
        <Canvas
          camera={{ position: [0, -0.4, 3.2], fov: 42 }}
          gl={{ alpha: true, antialias: true }}
          onCreated={({ scene }) => {
            scene.fog = new THREE.Fog('#0A1E35', 3, 8)
          }}
        >
          <RobotLighting />
          <MedicalAIRobotMasterModel
            mouse={mouse}
            isSpeaking={isSpeaking}
            isClicking={isClicking}
            isMobile={isMobile}
            mode={mode}
          />
        </Canvas>

        {/* "Say hello" button for Hero Mode */}
        {mode === 'hero' && (
          <button
            onClick={sayHello}
            disabled={isSpeaking}
            type="button"
            className="btn-primary absolute bottom-3 px-5 py-2 rounded-full text-xs font-semibold shadow-lg flex items-center gap-2 transition-all active:scale-95 disabled:opacity-75 z-20"
          >
            <Volume2 size={14} className={isSpeaking ? 'animate-pulse text-cyan-200' : ''} />
            <span>{isSpeaking ? 'Speaking...' : 'Say hello'}</span>
          </button>
        )}
      </div>

      {/* Styled Caption Box (Hero Mode) */}
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
