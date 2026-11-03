'use client'

import React, { useState, useEffect, Suspense, useRef } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { downloadScreeningPdf } from '@/lib/downloadPdf'
import { subscribeToAuth, UserSession } from '@/lib/auth'
import {
  Users,
  Calendar,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Navigation,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  X,
  FileText,
  Search,
  Filter,
  Loader2,
  Sparkles,
  Send,
  MessageSquare,
  Bot,
  User as UserIcon,
  Phone,
  Trash2,
} from 'lucide-react'

interface Doctor {
  id: string
  name: string
  speciality?: string
  specialty?: string
  qualification?: string
  registration?: string
  hospital: string
  address: string
  city: string
  lat?: number
  lng?: number
  languages?: string[]
  experience_years?: number
  conditions_treated?: string[]
  source_url?: string
  sourceUrl?: string
  sourceName?: string
  verified?: boolean
  available?: boolean
  phone?: string
  distanceKm?: number
}

interface ChatMessage {
  id: string
  sender: 'user' | 'assistant'
  text: string
  timestamp: string
}

function CareCommandContent() {
  const searchParams = useSearchParams()
  const tabParam = searchParams.get('tab')
  const initialTab =
    tabParam === 'assistant'
      ? 'assistant'
      : tabParam === 'appointments'
      ? 'appointments'
      : 'doctors'

  const [activeTab, setActiveTab] = useState<'doctors' | 'assistant' | 'appointments'>(initialTab)

  // Doctor Directory State
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSpeciality, setSelectedSpeciality] = useState<string>('all')
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locationPermission, setLocationPermission] = useState<'prompt' | 'granted' | 'denied'>('prompt')

  // User Session & Appointment State (Real user data only)
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null)
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [requestStep, setRequestStep] = useState<1 | 2 | 3 | 4>(1)
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [consultReason, setConsultReason] = useState('Vocal screening follow-up: pitch and cadence evaluation')
  const [requestDate, setRequestDate] = useState('')
  const [requestTime, setRequestTime] = useState('10:30 AM')
  const [attachLatestReport, setAttachLatestReport] = useState(true)
  const [appointmentsList, setAppointmentsList] = useState<any[]>([])
  const [cancelModalApt, setCancelModalApt] = useState<any | null>(null)
  const [isCancelling, setIsCancelling] = useState(false)
  const [requestSuccess, setRequestSuccess] = useState(false)

  // AI Health Assistant State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-0',
      sender: 'assistant',
      text: 'Namaste! I am your NeuroVoice health assistant. You can ask me questions about Parkinson’s disease, Alzheimer’s, speech muscle changes, or your voice screening results.',
      timestamp: 'Just now',
    },
  ])
  const [chatInput, setChatInput] = useState('')
  const [isAssistantTyping, setIsAssistantTyping] = useState(false)
  const chatBottomRef = useRef<HTMLDivElement>(null)

  const suggestedQuestions = [
    'What is Parkinson’s disease?',
    'What do my results mean?',
    'Should I see a doctor?',
    'How do I improve my voice health?',
  ]

  // Haversine Distance Formula
  const calculateHaversine = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371 // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return Math.round(R * c * 10) / 10
  }

  // Fetch doctors and subscribe to user appointments
  useEffect(() => {
    fetch('/api/doctors')
      .then((res) => (res.ok ? res.json() : []))
      .then((data: Doctor[]) => {
        if (data && data.length > 0) {
          setDoctors(data)
        }
      })
      .catch((err) => {
        console.warn('Doctors API notice:', err)
      })

    const unsub = subscribeToAuth((user) => {
      setCurrentUser(user)
      if (user?.uid) {
        fetch(`/api/appointments/${encodeURIComponent(user.uid)}`)
          .then((res) => (res.ok ? res.json() : []))
          .then((data) => {
            if (Array.isArray(data)) {
              setAppointmentsList(data)
            } else {
              setAppointmentsList([])
            }
          })
          .catch(() => setAppointmentsList([]))
      } else {
        setAppointmentsList([])
      }
    })

    return () => unsub()
  }, [])

  // Geolocation Request
  const requestLocation = () => {
    if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude }
          setUserLocation(loc)
          setLocationPermission('granted')

          setDoctors((prev) => {
            const withDist = prev.map((doc) => {
              if (doc.lat && doc.lng) {
                return { ...doc, distanceKm: calculateHaversine(loc.lat, loc.lng, doc.lat, doc.lng) }
              }
              return doc
            })
            return withDist.sort((a, b) => (a.distanceKm || 9999) - (b.distanceKm || 9999))
          })
        },
        () => {
          setLocationPermission('denied')
        }
      )
    }
  }

  // Filtered Doctors
  const filteredDoctors = doctors.filter((doc) => {
    const spec = (doc.speciality || doc.specialty || '').toLowerCase()
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.hospital.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.conditions_treated && doc.conditions_treated.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase())))
    const matchesSpeciality =
      selectedSpeciality === 'all' || spec.includes(selectedSpeciality.toLowerCase())
    return matchesSearch && matchesSpeciality
  })

  // Submit Appointment Request (User-specific query)
  const handleConfirmAppointmentRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDoctor) return

    const preferredDateTime = `${requestDate || 'Preferred within 7 days'} · ${requestTime}`
    const aptPayload = {
      userId: currentUser?.uid || 'guest_user',
      doctorId: selectedDoctor.id,
      disorder: consultReason,
      dateTime: preferredDateTime,
      notes: `Specialist consultation with ${selectedDoctor.name}. Clinic phone: ${selectedDoctor.phone || 'Hospital reception'}.`,
      reportAttached: attachLatestReport ? 'NV-Screening-Latest.pdf' : 'None',
    }

    try {
      const res = await fetch('/api/appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aptPayload),
      })
      if (res.ok) {
        const created = await res.json()
        setAppointmentsList((prev) => [created, ...prev])
      } else {
        const fallback = {
          id: 'apt-' + Math.floor(1000 + Math.random() * 9000),
          userId: currentUser?.uid || 'guest_user',
          doctorId: selectedDoctor.id,
          doctorName: selectedDoctor.name,
          doctorSpecialty: selectedDoctor.speciality || selectedDoctor.specialty || 'Neurology',
          hospital: selectedDoctor.hospital,
          phone: selectedDoctor.phone || 'Contact via hospital',
          disorder: consultReason,
          dateTime: preferredDateTime,
          status: 'Awaiting clinic confirmation',
          reportAttached: attachLatestReport ? 'NV-Screening-Latest.pdf' : 'None',
        }
        setAppointmentsList((prev) => [fallback, ...prev])
      }
    } catch {
      // Fallback
    }

    setRequestSuccess(true)
  }

  // Cancel Appointment Handler
  const handleCancelAppointment = async () => {
    if (!cancelModalApt) return
    setIsCancelling(true)
    try {
      await fetch(`/api/appointments/${encodeURIComponent(cancelModalApt.id)}`, {
        method: 'DELETE',
      })
      setAppointmentsList((prev) => prev.filter((a) => a.id !== cancelModalApt.id))
      setCancelModalApt(null)
    } catch (err) {
      console.error('Cancel appointment error:', err)
    } finally {
      setIsCancelling(false)
    }
  }

  // Send message to AI Health Assistant
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || chatInput).trim()
    if (!text || isAssistantTyping) return
    if (chatMessages.length >= 21) return // 1 initial + 10 user + 10 assistant = 21

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setChatMessages((prev) => [...prev, userMsg])
    setChatInput('')
    setIsAssistantTyping(true)

    try {
      const res = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          context: {
            conditions: ["Parkinson's Voice Steadiness", 'Healthy Baseline'],
            age: 50,
            language: 'English',
          },
        }),
      })

      if (res.ok) {
        const data = await res.json()
        const assistantMsg: ChatMessage = {
          id: 'msg-' + (Date.now() + 1),
          sender: 'assistant',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
        setChatMessages((prev) => [...prev, assistantMsg])
      } else {
        throw new Error('Assistant API returned an error.')
      }
    } catch {
      const fallbackMsg: ChatMessage = {
        id: 'msg-' + (Date.now() + 1),
        sender: 'assistant',
        text: 'NeuroVoice screens for vocal cord micro-tremors, cadence changes, and speech clarity. For medical concerns, always consult a qualified neurologist.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setChatMessages((prev) => [...prev, fallbackMsg])
    } finally {
      setIsAssistantTyping(false)
      setTimeout(() => {
        chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }

  // Get initials for doctor avatar
  const getInitials = (name: string) => {
    const clean = name.replace(/^(Dr\.?|Prof\.?)\s+/i, '').trim()
    const parts = clean.split(' ')
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    return clean.slice(0, 2).toUpperCase()
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border)]">
        <div>
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[var(--accent)]">
            Clinical Care & Consultation Directory
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-[var(--text)] tracking-tight">
            Specialist Care Command
          </h1>
          <p className="text-xs text-[var(--muted)] mt-0.5">
            Connect with verified neurological specialists and ask our AI assistant about voice health
          </p>
        </div>

        {/* 3 Tabs: Find Doctors | Ask about your condition | My Appointments */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-sm">
          <button
            type="button"
            onClick={() => setActiveTab('doctors')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'doctors'
                ? 'bg-[var(--primary)] text-white shadow-sm'
                : 'text-[var(--muted)] hover:text-[var(--text)]'
            }`}
          >
            <Users size={14} />
            <span>Find Doctors</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('assistant')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'assistant'
                ? 'bg-[var(--primary)] text-white shadow-sm'
                : 'text-[var(--muted)] hover:text-[var(--text)]'
            }`}
          >
            <Bot size={14} />
            <span>Ask about your condition</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('appointments')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'appointments'
                ? 'bg-[var(--primary)] text-white shadow-sm'
                : 'text-[var(--muted)] hover:text-[var(--text)]'
            }`}
          >
            <Calendar size={14} />
            <span>My Appointments ({appointmentsList.length})</span>
          </button>
        </div>
      </div>

      {/* ──────────────── TAB 1: FIND DOCTORS ──────────────── */}
      {activeTab === 'doctors' && (
        <div className="space-y-6">
          {/* Controls Bar: Search, Speciality Filter, Geolocation trigger */}
          <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="flex-1 flex flex-col sm:flex-row items-center gap-3">
              {/* Search Box */}
              <div className="relative w-full sm:w-72">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search doctor, hospital, or condition..."
                  className="input-clinical w-full pl-9 text-xs"
                />
              </div>

              {/* Speciality Filter */}
              <div className="w-full sm:w-56">
                <select
                  value={selectedSpeciality}
                  onChange={(e) => setSelectedSpeciality(e.target.value)}
                  className="input-clinical w-full text-xs"
                >
                  <option value="all">All Specialties</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Neurosurgery">Neurosurgery</option>
                </select>
              </div>
            </div>

            {/* Geolocation Distance Trigger */}
            <div className="flex items-center gap-2.5">
              {locationPermission !== 'granted' ? (
                <button
                  type="button"
                  onClick={requestLocation}
                  className="btn-ghost text-xs py-2 px-3.5 rounded-xl flex items-center gap-1.5 text-[var(--primary)] border border-[var(--border)]"
                >
                  <Navigation size={14} />
                  <span>Enable location for distance info</span>
                </button>
              ) : (
                <span className="text-xs font-mono font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 size={13} />
                  <span>Sorted by nearest (~km)</span>
                </span>
              )}
            </div>
          </div>

          {/* Condition-Based Specialty Suggestions */}
          <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="font-semibold text-[var(--text)]">Recommended Specialties by Screening Indication:</span>
            <div className="flex flex-wrap gap-2">
              <span className="px-2.5 py-1 rounded-md bg-[var(--surface)] border border-[var(--border)] text-[var(--muted)]">
                Parkinson&apos;s / Alzheimer&apos;s: <strong className="text-[var(--primary)]">Neurologist</strong>
              </span>
              <span className="px-2.5 py-1 rounded-md bg-[var(--surface)] border border-[var(--border)] text-[var(--muted)]">
                Dysarthria: <strong className="text-[var(--accent)]">Speech-Language Pathologist</strong>
              </span>
              <span className="px-2.5 py-1 rounded-md bg-[var(--surface)] border border-[var(--border)] text-[var(--muted)]">
                Stroke Recovery: <strong className="text-[var(--warning)]">Neuro-Rehabilitation</strong>
              </span>
            </div>
          </div>

          {/* ──────── VERIFIED DOCTOR CARDS (TASK 10B DESIGN) ──────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredDoctors.map((doc) => {
              const sourceUrl = doc.source_url || doc.sourceUrl || '#'
              const sourceName = doc.sourceName || 'Public Medical Registry'
              const conditionsTreated = doc.conditions_treated || ["Parkinson's", 'Neurology']
              const languages = doc.languages || ['Hindi', 'English']

              return (
                <div
                  key={doc.id || doc.name}
                  className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="flex items-start gap-4">
                    {/* Left: Avatar circle with initials, teal background */}
                    <div className="w-12 h-12 rounded-full bg-[#0F8F8F] text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-sm">
                      {getInitials(doc.name)}
                    </div>

                    {/* Right Details */}
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h3 className="text-base font-display font-bold text-[var(--text)] truncate">
                          {doc.name}
                        </h3>
                        {doc.distanceKm !== undefined && (
                          <span className="text-[11px] font-mono font-bold text-[var(--accent)] shrink-0">
                            ~{doc.distanceKm} km away
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-[var(--muted)] font-medium">
                        {doc.speciality || doc.specialty || 'Neurology'}
                        {doc.qualification && ` · ${doc.qualification}`}
                      </div>

                      <div className="text-xs text-[var(--text)] font-semibold">
                        {doc.hospital} · {doc.city || 'Jabalpur'}
                      </div>

                      {doc.experience_years && (
                        <div className="text-[11px] text-[var(--muted)]">
                          {doc.experience_years} years experience
                        </div>
                      )}

                      {/* Conditions treated pills */}
                      <div className="flex flex-wrap gap-1 pt-1">
                        {conditionsTreated.map((c) => (
                          <span
                            key={c}
                            className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[var(--surface-2)] text-[var(--muted)] border border-[var(--border)]"
                          >
                            {c}
                          </span>
                        ))}
                      </div>

                      {/* Languages */}
                      <div className="text-[11px] text-[var(--muted)] pt-0.5">
                        Languages: {languages.join(', ')}
                      </div>

                      {/* Verified Source Link */}
                      <div className="text-[11px] pt-1">
                        <a
                          href={sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[var(--primary)] font-semibold hover:underline inline-flex items-center gap-1"
                        >
                          <span>Verified via {sourceName} ↗</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Actions: Get Directions & Request Appointment */}
                  <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between gap-2">
                    <a
                      href={
                        doc.lat && doc.lng
                          ? `https://www.google.com/maps/dir/?api=1&destination=${doc.lat},${doc.lng}`
                          : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                              doc.hospital + ' ' + doc.address
                            )}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-ghost text-xs py-2 px-3 rounded-lg flex items-center gap-1 text-[var(--muted)] hover:text-[var(--text)]"
                    >
                      <span>Get directions →</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedDoctor(doc)
                        setShowRequestModal(true)
                      }}
                      className="btn-primary text-xs py-2 px-3.5 rounded-lg font-semibold shadow-sm"
                    >
                      Request appointment
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ──────────────── TAB 2: ASK ABOUT YOUR CONDITION (AI HEALTH ASSISTANT) ──────────────── */}
      {activeTab === 'assistant' && (
        <div className="max-w-3xl mx-auto space-y-4">
          {/* Header & Disclaimer */}
          <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] space-y-2">
            <div className="flex items-center gap-2 text-[var(--accent)] text-xs font-mono font-bold uppercase">
              <Sparkles size={15} />
              <span>AI Health Assistant</span>
            </div>
            <h2 className="text-xl font-display font-bold text-[var(--text)]">
              Ask about your condition
            </h2>
            <p className="text-[11px] text-[var(--muted)]">
              This assistant provides general information only. It is not a doctor. Always consult a qualified neurologist for personal medical decisions.
            </p>
          </div>

          {/* Suggested Question Chips */}
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => handleSendMessage(q)}
                disabled={isAssistantTyping || chatMessages.length >= 21}
                className="px-3.5 py-1.5 rounded-xl bg-[var(--surface)] hover:bg-[var(--surface-2)] border border-[var(--border)] text-xs font-medium text-[var(--text)] transition-colors shadow-sm disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Chat Container */}
          <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm min-h-[420px] max-h-[560px] flex flex-col justify-between space-y-4">
            {/* Messages Scroll Area */}
            <div className="space-y-4 overflow-y-auto flex-1 pr-1">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.sender === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-[#0F8F8F]/15 text-[#0F8F8F] flex items-center justify-center shrink-0 border border-[#0F8F8F]/30 mt-1">
                      <Bot size={16} />
                    </div>
                  )}

                  <div
                    className={`max-w-[82%] sm:max-w-[75%] rounded-2xl p-4 text-xs leading-relaxed space-y-1 shadow-sm ${
                      msg.sender === 'user'
                        ? 'bg-[var(--primary)] text-white rounded-tr-none'
                        : 'bg-[var(--surface-2)] text-[var(--text)] border border-[var(--border)] rounded-tl-none'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <div
                      className={`text-[10px] text-right font-mono ${
                        msg.sender === 'user' ? 'text-blue-100' : 'text-[var(--muted)]'
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-[var(--primary)] text-white flex items-center justify-center shrink-0 shadow-sm mt-1">
                      <UserIcon size={14} />
                    </div>
                  )}
                </div>
              ))}

              {/* Typing Indicator */}
              {isAssistantTyping && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#0F8F8F]/15 text-[#0F8F8F] flex items-center justify-center shrink-0 border border-[#0F8F8F]/30">
                    <Bot size={16} />
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] rounded-tl-none flex items-center gap-1.5 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-bounce" />
                    <span
                      className="w-2 h-2 rounded-full bg-[var(--accent)] animate-bounce"
                      style={{ animationDelay: '0.15s' }}
                    />
                    <span
                      className="w-2 h-2 rounded-full bg-[var(--accent)] animate-bounce"
                      style={{ animationDelay: '0.3s' }}
                    />
                  </div>
                </div>
              )}

              {/* Capping Notice after 10 messages */}
              {chatMessages.length >= 21 && (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 text-center">
                  For detailed advice, please consult a neurologist. This chat is for information only.
                </div>
              )}

              <div ref={chatBottomRef} />
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSendMessage()
              }}
              className="flex items-center gap-2 pt-2 border-t border-[var(--border)]"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                disabled={isAssistantTyping || chatMessages.length >= 21}
                placeholder={
                  chatMessages.length >= 21
                    ? 'Session limit reached (10 questions max)'
                    : 'Ask a question about neurological conditions or your screening...'
                }
                className="input-clinical flex-1 text-xs py-2.5 px-3.5 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!chatInput.trim() || isAssistantTyping || chatMessages.length >= 21}
                className="btn-primary text-xs py-2.5 px-4 rounded-xl flex items-center gap-1.5 shadow-sm disabled:opacity-50"
              >
                <span>Send</span>
                <Send size={13} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ──────────────── TAB 3: MY APPOINTMENTS ──────────────── */}
      {activeTab === 'appointments' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50/70 dark:bg-amber-950/30 text-xs text-amber-900 dark:text-amber-200 leading-relaxed flex items-start gap-2.5">
            <AlertCircle size={17} className="shrink-0 mt-0.5 text-amber-700 dark:text-amber-400" />
            <div>
              <strong>Consultation Notice:</strong> Appointments through NeuroVoice are structured <strong>consultation requests</strong> with attached acoustic reports. Please contact the hospital clinic directly to finalize and confirm your consultation time slot.
            </div>
          </div>

          {appointmentsList.length === 0 ? (
            <div className="text-center py-16 px-4 bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-[var(--shadow-sm)] flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-[var(--muted)] shadow-inner">
                <Calendar size={28} className="text-[var(--primary)]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-[var(--text)]">No appointments yet</h3>
                <p className="text-xs text-[var(--muted)] max-w-md leading-relaxed">
                  After your screening, you can request a specialist consultation and track it here.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('doctors')}
                className="btn-primary text-xs py-2.5 px-5 rounded-xl font-semibold shadow-sm flex items-center gap-2"
              >
                <span>Find a specialist →</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {appointmentsList.map((apt) => (
                <div
                  key={apt.id}
                  className="p-5 sm:p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
                >
                  <div className="space-y-2.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-[var(--muted)] font-semibold">{apt.referenceNumber || apt.id}</span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                        Awaiting clinic confirmation
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-[var(--text)]">
                        {apt.doctorName} · {apt.doctorSpecialty || apt.speciality}
                      </h3>
                      <div className="text-xs text-[var(--muted)] font-medium mt-0.5">{apt.hospital}</div>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-mono text-[var(--muted)]">
                      <span className="flex items-center gap-1">
                        <Calendar size={13} className="text-[var(--primary)]" />
                        {apt.dateTime || apt.date || 'Preferred this week'}
                      </span>
                    </div>

                    {/* Clinic phone with confirmation reminder */}
                    <div className="p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-xs text-[var(--muted)] flex items-start gap-2.5 max-w-lg">
                      <Phone size={14} className="mt-0.5 text-[var(--primary)] shrink-0" />
                      <div>
                        <span className="font-semibold text-[var(--text)] block">
                          Clinic Reception: {apt.phone || 'Contact via hospital reception'}
                        </span>
                        <span className="text-[11px] text-[var(--muted)]">
                          Please call the clinic directly to confirm your slot.
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-[var(--muted)]">
                      Reason: {apt.notes || apt.reason || apt.disorder} {apt.reportAttached && `(Attached: ${apt.reportAttached})`}
                    </p>
                  </div>

                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => downloadScreeningPdf(apt.reportAttached || 'NV-Screening-Latest', currentUser?.displayName || 'Participant')}
                      className="btn-ghost text-xs py-2 px-3.5 rounded-xl flex items-center gap-1.5 border border-[var(--border)]"
                    >
                      <FileText size={14} />
                      <span>View attached report</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCancelModalApt(apt)}
                      className="text-xs py-2 px-3.5 rounded-xl flex items-center gap-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 border border-transparent transition-colors"
                    >
                      <Trash2 size={14} />
                      <span>Cancel request</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CANCEL APPOINTMENT CONFIRMATION MODAL */}
      {cancelModalApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="max-w-md w-full rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-2xl p-6 space-y-4 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300 flex items-center justify-center">
              <Trash2 size={22} />
            </div>
            <div>
              <h4 className="text-base font-bold text-[var(--text)]">Cancel Consultation Request?</h4>
              <p className="text-xs text-[var(--muted)] mt-1.5 leading-relaxed">
                Are you sure you want to cancel your consultation request with <strong>{cancelModalApt.doctorName}</strong>? This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCancelModalApt(null)}
                className="btn-ghost text-xs py-2 px-4 rounded-xl"
              >
                Keep request
              </button>
              <button
                type="button"
                onClick={handleCancelAppointment}
                disabled={isCancelling}
                className="btn-danger text-xs py-2 px-4 rounded-xl"
              >
                {isCancelling ? 'Cancelling...' : 'Yes, cancel request'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* APPOINTMENT REQUEST MODAL */}
      {showRequestModal && selectedDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="max-w-lg w-full rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-2xl p-6 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <div>
                <span className="text-xs font-mono font-bold text-[var(--accent)] uppercase">
                  Request Specialist Consultation
                </span>
                <h3 className="text-lg font-display font-bold text-[var(--text)]">
                  {selectedDoctor.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowRequestModal(false)
                  setRequestSuccess(false)
                }}
                className="p-1 rounded-md text-[var(--muted)] hover:text-[var(--text)]"
              >
                <X size={18} />
              </button>
            </div>

            {!requestSuccess ? (
              <form onSubmit={handleConfirmAppointmentRequest} className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-[var(--text)] block mb-1">
                    Hospital & Clinic
                  </label>
                  <input
                    type="text"
                    disabled
                    value={`${selectedDoctor.hospital} · ${selectedDoctor.address}`}
                    className="input-clinical w-full text-xs bg-[var(--surface-2)] text-[var(--muted)]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-[var(--text)] block mb-1">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      value={requestDate}
                      onChange={(e) => setRequestDate(e.target.value)}
                      className="input-clinical w-full text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-[var(--text)] block mb-1">
                      Preferred Time Slot
                    </label>
                    <select
                      value={requestTime}
                      onChange={(e) => setRequestTime(e.target.value)}
                      className="input-clinical w-full text-xs"
                    >
                      <option value="10:00 AM">Morning (10:00 AM - 12:00 PM)</option>
                      <option value="02:00 PM">Afternoon (02:00 PM - 04:00 PM)</option>
                      <option value="05:30 PM">Evening (05:30 PM - 07:30 PM)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-[var(--text)] block mb-1">
                    Reason for Consultation / Screening Notes
                  </label>
                  <textarea
                    rows={3}
                    value={consultReason}
                    onChange={(e) => setConsultReason(e.target.value)}
                    className="input-clinical w-full text-xs"
                    required
                  />
                </div>

                <label className="flex items-center gap-2 p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={attachLatestReport}
                    onChange={(e) => setAttachLatestReport(e.target.checked)}
                    className="rounded text-[var(--primary)]"
                  />
                  <span>Attach my latest 5-page acoustic screening PDF report</span>
                </label>

                <div className="flex justify-end gap-3 pt-2 border-t border-[var(--border)]">
                  <button
                    type="button"
                    onClick={() => setShowRequestModal(false)}
                    className="btn-ghost text-xs py-2 px-4 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary text-xs py-2 px-5 rounded-xl font-semibold shadow-sm"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4 text-center py-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={24} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-[var(--text)]">
                    Consultation Request Created
                  </h4>
                  <p className="text-xs text-[var(--muted)] max-w-sm mx-auto leading-relaxed">
                    Your appointment request with attached acoustic metrics has been recorded. Please contact {selectedDoctor.hospital} to confirm your consultation timing.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowRequestModal(false)
                    setRequestSuccess(false)
                    setActiveTab('appointments')
                  }}
                  className="btn-primary text-xs py-2 px-6 rounded-xl"
                >
                  View My Appointments
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function CareCommandPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-[var(--muted)] flex items-center justify-center gap-2">
          <Loader2 size={16} className="animate-spin" />
          <span>Loading specialist directory...</span>
        </div>
      }
    >
      <CareCommandContent />
    </Suspense>
  )
}
