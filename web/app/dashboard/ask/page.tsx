'use client'

import React, { useState, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import {
  Send,
  Bot,
  User,
  Volume2,
  VolumeX,
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
  "What is Parkinson's disease?",
  "My result was Moderate — what should I do?",
  "How does voice analysis detect neurological changes?",
  "What is dysarthria and how does it affect speech?",
  "Should I see a doctor if my result was Low?",
  "How often should I do a voice screening?",
]

export default function VoiceIQPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content:
        "Hello! I'm here to help you understand your voice health. You can ask me about any of the conditions we screen for, what your results mean, or when to see a doctor.",
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
    } catch {
      const fallbackText =
        'Voice measurements evaluate subtle changes in vocal cord stability and speech flow. While noticeable changes suggest consulting a medical specialist, this screening does not provide a formal medical diagnosis.'
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
    <div className="h-[calc(100vh-5rem)] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="shrink-0 mb-3">
        <h1 className="font-display text-xl sm:text-2xl font-bold text-[var(--text)]">
          VoiceIQ Assistant
        </h1>
        <p className="text-xs text-[var(--muted)] mt-0.5">
          Ask anything about your voice health, your results, or the conditions we screen for. Available in Hindi and English.
        </p>
      </div>

      {/* Main 2-Panel Area: fits exactly in one screen, no page scrolling */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-5 items-stretch overflow-hidden pb-1">
        {/* Left Panel: 38% width, 3D Robot */}
        <div className="w-full lg:w-[38%] shrink-0 flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm overflow-hidden p-3 justify-between">
          <div className="flex items-center justify-between pb-1 border-b border-[var(--border)]">
            <span className="text-xs font-semibold text-[var(--text-muted)]">
              AI Voice Guide
            </span>
            {/* Single Mute Button in top-right */}
            <button
              onClick={toggleMute}
              className="p-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-2)] text-[var(--muted)] transition-colors"
              title="Mute assistant voice"
              aria-label="Mute assistant voice"
            >
              {voiceMuted ? <VolumeX size={15} className="text-red-500" /> : <Volume2 size={15} className="text-[var(--primary)]" />}
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center py-2 overflow-hidden">
            <div className="w-full max-w-[340px]">
              <RobotCanvas
                mode="chat"
                externalSpeaking={isAssistantSpeaking}
                onSpeechEnd={() => setIsAssistantSpeaking(false)}
              />
            </div>
          </div>

          <div className="text-[11px] text-center text-[var(--muted)] pt-1 border-t border-[var(--border)]">
            Powered by NeuroVoice AI · Interactive voice synthesis active
          </div>
        </div>

        {/* Right Panel: 62% width, Chat Interface */}
        <div className="w-full lg:w-[62%] flex-1 flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm overflow-hidden min-h-0">
          {/* Disclaimer: Single grey line of small text at top of chat */}
          <div className="shrink-0 bg-[var(--surface-2)] border-b border-[var(--border)] px-4 py-2 text-[11px] text-[var(--muted)] text-center">
            General information only. Not a substitute for medical advice.
          </div>

          {/* Chat Messages Scroll Area: scroll happens inside this container ONLY */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-[var(--accent)]/15 text-[var(--accent)] flex items-center justify-center shrink-0 mt-0.5 border border-[var(--accent)]/30">
                    <Bot size={15} />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[var(--primary)] text-white rounded-tr-sm shadow-sm'
                      : 'bg-[var(--surface-2)] text-[var(--text)] border border-[var(--border)] rounded-tl-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  <span
                    className={`block text-[10px] mt-1.5 text-right ${
                      msg.role === 'user' ? 'text-white/70' : 'text-[var(--muted)]'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-[var(--primary)]/15 text-[var(--primary)] flex items-center justify-center shrink-0 mt-0.5 border border-[var(--primary)]/30">
                    <User size={15} />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 items-center text-xs text-[var(--muted)]">
                <div className="w-7 h-7 rounded-full bg-[var(--accent)]/15 text-[var(--accent)] flex items-center justify-center shrink-0 border border-[var(--accent)]/30">
                  <Bot size={15} />
                </div>
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)]">
                  <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-bounce [animation-delay:0.4s]" />
                  <span className="ml-2 text-xs">Reviewing medical voice science...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* 6 Clickable Question Chips: horizontal scrollable row above input */}
          <div className="shrink-0 px-3 py-2 border-t border-[var(--border)] bg-[var(--surface)] overflow-x-auto flex gap-1.5 no-scrollbar">
            {SUGGESTED_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(q)}
                disabled={isLoading}
                className="shrink-0 px-3 py-1 rounded-full text-xs font-medium bg-[var(--surface-2)] hover:bg-[var(--border)] text-[var(--text)] border border-[var(--border)] transition-colors whitespace-nowrap active:scale-95"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Area: fixed at bottom of chat panel */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSendMessage()
            }}
            className="shrink-0 p-2.5 bg-[var(--surface)] border-t border-[var(--border)] flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              maxLength={200}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask a question about your voice health (max 200 chars)..."
              disabled={isLoading}
              className="flex-1 bg-[var(--surface-2)] border border-[var(--border)] rounded-xl px-3.5 py-2 text-xs sm:text-sm text-[var(--text)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--primary)] transition-colors"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="btn-primary p-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
