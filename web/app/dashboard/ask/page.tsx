'use client'

import React, { useState, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import {
  Send,
  Bot,
  User,
  Sparkles,
  Volume2,
  VolumeX,
  ShieldAlert,
  ArrowRight,
  HelpCircle,
  RefreshCw,
} from 'lucide-react'
import { getLocalUser } from '@/lib/auth'

// Dynamically import 3D Robot Canvas in chat mode
const RobotCanvas = dynamic(
  () => import('@/components/landing/RobotCanvas').then((mod) => mod.RobotCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[360px] rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-[var(--primary)] border-t-transparent animate-spin" />
      </div>
    ),
  }
)

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

const SUGGESTED_QUESTIONS = [
  'What do my voice stability scores mean?',
  "How does NeuroVoice detect early Parkinson's signs?",
  "Can vocal biomarkers distinguish Alzheimer's from normal aging?",
  'What should I do if my jitter or shimmer is elevated?',
  'How often should I repeat my voice screening?',
]

export default function AskPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content:
        'Hello! I am your NeuroVoice Clinical Assistant. You can ask me anything about your vocal biomarkers, neuromuscular acoustic patterns, screening protocols, or when to consult a specialist.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isAssistantSpeaking, setIsAssistantSpeaking] = useState(false)
  const [voiceMuted, setVoiceMuted] = useState(false)

  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const speakAloud = (text: string) => {
    if (voiceMuted || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return
    }
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.96
    utterance.pitch = 1.0

    const voices = window.speechSynthesis.getVoices()
    const selectedVoice =
      voices.find((v) => v.name.includes('Google US English') || v.name.includes('Ravi')) ||
      voices.find((v) => v.lang.toLowerCase().includes('en-in')) ||
      voices.find((v) => v.lang.toLowerCase().startsWith('en'))

    if (selectedVoice) utterance.voice = selectedVoice

    utterance.onstart = () => setIsAssistantSpeaking(true)
    utterance.onend = () => setIsAssistantSpeaking(false)
    utterance.onerror = () => setIsAssistantSpeaking(false)

    window.speechSynthesis.speak(utterance)
  }

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim()
    if (!text || isLoading) return

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMsg])
    setInputMessage('')
    setIsLoading(true)

    const user = getLocalUser()
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

    try {
      const response = await fetch(`${apiBase}/api/assistant/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          user_id: user?.uid || 'user',
          context: {
            user_name: user?.displayName || 'User',
            role: user?.role || 'patient',
          },
        }),
      })

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`)
      }

      const data = await response.json()
      const botResponseText = data.response || data.message || 'I have analyzed your query based on current clinical screening standards.'

      const botMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        role: 'assistant',
        content: botResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }

      setMessages((prev) => [...prev, botMsg])
      speakAloud(botResponseText)
    } catch (err) {
      const fallbackText =
        'Vocal biomarker analysis evaluates acoustic perturbations (jitter, shimmer, harmonic-to-noise ratio) reflecting subtle neuromuscular coordination changes. While elevated variance warrants specialist clinical correlation, it does not constitute a clinical diagnosis.'
      const botMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        role: 'assistant',
        content: fallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages((prev) => [...prev, botMsg])
      speakAloud(fallbackText)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleMute = () => {
    const nextMute = !voiceMuted
    setVoiceMuted(nextMute)
    if (nextMute && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      setIsAssistantSpeaking(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 pb-32">
      {/* Header */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--surface-2)] border border-[var(--border)] text-[var(--accent)] mb-2">
          <Sparkles size={13} />
          <span>Interactive Clinical Assistant</span>
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[var(--text)]">
          Ask NeuroVoice AI
        </h1>
        <p className="text-sm text-[var(--muted)] mt-1">
          Real-time clinical insights powered by Gemini medical AI and neurological voice science.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (40%): 3D Medical AI Robot Avatar */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--surface)] shadow-sm p-4">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[var(--border)] text-xs">
              <span className="font-semibold text-[var(--text)] flex items-center gap-1.5">
                <Bot size={16} className="text-[var(--accent)]" />
                Medical Avatar
              </span>
              <button
                onClick={toggleMute}
                className="p-1 rounded-md border border-[var(--border)] hover:bg-[var(--surface-2)] text-[var(--muted)] transition-colors"
                title={voiceMuted ? 'Unmute assistant speech' : 'Mute assistant speech'}
              >
                {voiceMuted ? <VolumeX size={15} className="text-red-500" /> : <Volume2 size={15} className="text-[var(--primary)]" />}
              </button>
            </div>

            <div className="w-full flex justify-center">
              <RobotCanvas
                mode="chat"
                externalSpeaking={isAssistantSpeaking}
                onSpeechEnd={() => setIsAssistantSpeaking(false)}
              />
            </div>
          </div>
        </div>

        {/* Right Column (60%): Interactive Chat Interface */}
        <div className="lg:col-span-7 flex flex-col h-[650px] rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm overflow-hidden">
          {/* Clinical Disclaimer Banner */}
          <div className="bg-[var(--surface-2)] border-b border-[var(--border)] p-3 px-4 flex items-start gap-2.5 text-xs text-[var(--muted)]">
            <ShieldAlert size={16} className="text-amber-500 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Clinical Educational Support:</strong> NeuroVoice Assistant provides screening information and voice science education. It does not provide medical diagnoses or prescriptions. For medical advice, consult a physician.
            </p>
          </div>

          {/* Chat Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-[var(--accent)]/15 text-[var(--accent)] flex items-center justify-center shrink-0 mt-1 border border-[var(--accent)]/30">
                    <Bot size={16} />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[var(--primary)] text-white rounded-tr-sm shadow-sm'
                      : 'bg-[var(--surface-2)] text-[var(--text)] border border-[var(--border)] rounded-tl-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  <span
                    className={`block text-[10px] mt-2 text-right ${
                      msg.role === 'user' ? 'text-white/70' : 'text-[var(--muted)]'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-[var(--primary)]/15 text-[var(--primary)] flex items-center justify-center shrink-0 mt-1 border border-[var(--primary)]/30">
                    <User size={16} />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 items-center text-xs text-[var(--muted)]">
                <div className="w-8 h-8 rounded-full bg-[var(--accent)]/15 text-[var(--accent)] flex items-center justify-center shrink-0 border border-[var(--accent)]/30">
                  <Bot size={16} />
                </div>
                <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)]">
                  <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-bounce [animation-delay:0.4s]" />
                  <span className="ml-2 text-xs">Analyzing clinical literature...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Suggested Question Chips */}
          <div className="px-4 py-2 border-t border-[var(--border)] bg-[var(--surface)] overflow-x-auto flex gap-2 no-scrollbar">
            {SUGGESTED_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(q)}
                disabled={isLoading}
                className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium bg-[var(--surface-2)] hover:bg-[var(--border)] text-[var(--text)] border border-[var(--border)] transition-colors text-left"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSendMessage()
            }}
            className="p-3 bg-[var(--surface)] border-t border-[var(--border)] flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              maxLength={200}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask a question about your voice biomarkers (max 200 chars)..."
              disabled={isLoading}
              className="flex-1 bg-[var(--surface-2)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-[var(--text)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--primary)] transition-colors"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="btn-primary p-2.5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              aria-label="Send message"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
