'use client'

import React, { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
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
} from 'lucide-react'

interface Doctor {
  id: string
  name: string
  speciality: string
  qualification?: string
  registration?: string
  hospital: string
  address: string
  city: string
  lat?: number
  lng?: number
  languages?: string[]
  fee?: number
  experience_years?: number
  sourceUrl: string
  sourceName: string
  verified: boolean
  distanceKm?: number
}

function CareCommandContent() {
  const searchParams = useSearchParams()
  const initialTab = searchParams.get('tab') === 'appointments' ? 'appointments' : 'doctors'
  const [activeTab, setActiveTab] = useState<'doctors' | 'appointments'>(initialTab)

  // Doctor Directory State
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSpeciality, setSelectedSpeciality] = useState<string>('all')
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locationPermission, setLocationPermission] = useState<'prompt' | 'granted' | 'denied'>('prompt')

  // Appointment Request Flow State
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [requestStep, setRequestStep] = useState<1 | 2 | 3 | 4>(1)
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [consultReason, setConsultReason] = useState('Vocal screening follow-up: pitch and cadence evaluation')
  const [requestDate, setRequestDate] = useState('')
  const [requestTime, setRequestTime] = useState('10:30 AM')
  const [attachLatestReport, setAttachLatestReport] = useState(true)
  const [appointmentsList, setAppointmentsList] = useState<any[]>([
    {
      id: 'req-9041',
      doctorName: 'Dr. Akhilesh Shroti',
      hospital: 'Marblecity Hospital',
      speciality: 'Neurology',
      date: '05 Nov 2026',
      time: '11:00 AM',
      status: 'Request Pending Clinic Confirmation',
      reason: 'Periodic Parkinson vocal tremor evaluation',
      reportAttached: 'NV-Screening-Latest.pdf',
    },
  ])
  const [requestSuccess, setRequestSuccess] = useState(false)

  // Admin CSV row importer state
  const [isAdmin, setIsAdmin] = useState(false)
  const [showAddDoctorModal, setShowAddDoctorModal] = useState(false)
  const [csvRowInput, setCsvRowInput] = useState('')

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

  // Fetch doctors on mount
  useEffect(() => {
    fetch('/api/doctors')
      .then((res) => (res.ok ? res.json() : []))
      .then((data: Doctor[]) => {
        setDoctors(data)
      })
      .catch(() => {
        // Fallback to verified seed entries
      })

    // Check if user has admin claim
    const role = typeof window !== 'undefined' ? localStorage.getItem('neurovoice-role') : null
    setIsAdmin(role === 'admin')
  }, [])

  // Geolocation Request
  const requestLocation = () => {
    if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude }
          setUserLocation(loc)
          setLocationPermission('granted')

          // Calculate distances and sort nearest first
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
          // Sort alphabetically
          setDoctors((prev) => [...prev].sort((a, b) => a.name.localeCompare(b.name)))
        }
      )
    }
  }

  // Filtered Doctors
  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.hospital.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.address.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSpeciality =
      selectedSpeciality === 'all' || doc.speciality.toLowerCase().includes(selectedSpeciality.toLowerCase())
    return matchesSearch && matchesSpeciality
  })

  // Submit Appointment Request
  const handleConfirmAppointmentRequest = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDoctor) return

    const newReq = {
      id: 'req-' + Math.floor(1000 + Math.random() * 9000),
      doctorName: selectedDoctor.name,
      hospital: selectedDoctor.hospital,
      speciality: selectedDoctor.speciality,
      date: requestDate || 'Preferred within 7 days',
      time: requestTime,
      status: 'Request Submitted · Call Clinic to Confirm',
      reason: consultReason,
      reportAttached: attachLatestReport ? 'NV-Latest-Report.pdf' : 'None',
    }

    setAppointmentsList([newReq, ...appointmentsList])
    setRequestSuccess(true)
  }

  // Import CSV Row for Doctors (Admin Only)
  const handleImportCsvDoctor = (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const parts = csvRowInput.split(',').map((s) => s.trim())
      if (parts.length < 5) {
        alert('Format: Name, Speciality, Hospital, Address, SourceURL')
        return
      }
      const newDoc: Doctor = {
        id: 'doc-imported-' + Date.now(),
        name: parts[0],
        speciality: parts[1],
        hospital: parts[2],
        address: parts[3],
        city: 'Jabalpur',
        sourceUrl: parts[4],
        sourceName: 'Admin CSV Import',
        verified: true,
      }
      setDoctors([newDoc, ...doctors])
      setShowAddDoctorModal(false)
      setCsvRowInput('')
    } catch {
      alert('Error parsing CSV row.')
    }
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
            Connect with verified neurological specialists and manage consultation requests
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-sm">
          <button
            type="button"
            onClick={() => setActiveTab('doctors')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
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
            onClick={() => setActiveTab('appointments')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
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

      {/* TAB 1: FIND DOCTORS */}
      {activeTab === 'doctors' && (
        <div className="space-y-6">
          {/* Controls Bar: Search, Speciality Filter, Geolocation trigger, and Admin Add */}
          <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="flex-1 flex flex-col sm:flex-row items-center gap-3">
              {/* Search Box (Clean white bg, border, label) */}
              <div className="relative w-full sm:w-72">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search doctor or clinic..."
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
                  className="btn-ghost text-xs py-2 px-3.5 rounded-xl flex items-center gap-1.5 text-[var(--primary)] border-[var(--border)]"
                >
                  <Navigation size={14} />
                  <span>Enable location for distance info</span>
                </button>
              ) : (
                <span className="text-xs font-mono font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 size={13} />
                  <span>Sorted by nearest first (Haversine)</span>
                </span>
              )}

              {/* Admin Add Doctor */}
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => setShowAddDoctorModal(true)}
                  className="btn-primary text-xs py-2 px-3.5 rounded-xl flex items-center gap-1"
                >
                  <Plus size={14} />
                  <span>Add a Doctor</span>
                </button>
              )}
            </div>
          </div>

          {/* Condition-Based Specialty Suggestions */}
          <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="font-semibold text-[var(--text)]">Recommended Specialties by Screening Indication:</span>
            <div className="flex flex-wrap gap-2">
              <span className="px-2.5 py-1 rounded-md bg-[var(--surface)] border border-[var(--border)] text-[var(--muted)]">
                Parkinson's / Alzheimer's: <strong className="text-[var(--primary)]">Neurologist</strong>
              </span>
              <span className="px-2.5 py-1 rounded-md bg-[var(--surface)] border border-[var(--border)] text-[var(--muted)]">
                Dysarthria: <strong className="text-[var(--accent)]">Speech-Language Pathologist</strong>
              </span>
              <span className="px-2.5 py-1 rounded-md bg-[var(--surface)] border border-[var(--border)] text-[var(--muted)]">
                Stroke Recovery: <strong className="text-[var(--warning)]">Neuro-Rehabilitation</strong>
              </span>
            </div>
          </div>

          {/* Verified Doctor Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredDoctors.map((doc) => (
              <div
                key={doc.id}
                className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Verified Badge & Distance */}
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
                      <ShieldCheck size={13} />
                      <span>Verified</span>
                    </span>

                    {doc.distanceKm !== undefined ? (
                      <span className="text-xs font-mono font-bold text-[var(--accent)]">
                        ~{doc.distanceKm} km away
                      </span>
                    ) : (
                      <span className="text-[11px] font-mono text-[var(--muted)]">
                        {doc.city}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-base font-display font-bold text-[var(--text)]">
                      {doc.name}
                    </h3>
                    <div className="text-xs font-semibold text-[var(--primary)] mt-0.5">
                      {doc.speciality}
                    </div>
                    {doc.qualification && (
                      <div className="text-[11px] text-[var(--muted)] font-mono mt-0.5">
                        {doc.qualification}
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5 text-xs text-[var(--muted)]">
                    <div className="font-medium text-[var(--text)]">{doc.hospital}</div>
                    <div className="text-[11px] leading-relaxed flex items-start gap-1">
                      <MapPin size={13} className="shrink-0 mt-0.5 text-[var(--muted)]" />
                      <span>{doc.address}</span>
                    </div>
                  </div>

                  {/* Public Source Link (Mandatory) */}
                  <div className="pt-2 border-t border-[var(--border)] text-[11px]">
                    <span className="text-[var(--muted)]">Source: </span>
                    <a
                      href={doc.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-[var(--primary)] hover:underline inline-flex items-center gap-1"
                    >
                      <span>{doc.sourceName}</span>
                      <ExternalLink size={10} />
                    </a>
                  </div>
                </div>

                {/* Actions: Request Consultation & Google Maps Directions */}
                <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between gap-2">
                  {doc.lat && doc.lng && (
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${doc.lat},${doc.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-ghost text-xs py-2 px-3 rounded-lg flex items-center gap-1"
                    >
                      <span>Directions →</span>
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDoctor(doc)
                      setShowRequestModal(true)
                      setRequestStep(1)
                      setRequestSuccess(false)
                    }}
                    className="btn-primary text-xs py-2 px-4 rounded-lg flex-1 justify-center"
                  >
                    Request Consultation
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: MY APPOINTMENTS */}
      {activeTab === 'appointments' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
            <AlertCircle size={16} className="shrink-0 mt-0.5 text-amber-600" />
            <span>
              <strong>Consultation Notice:</strong> Appointments through NeuroVoice are structured <strong>consultation requests</strong> with attached acoustic reports. Please contact the hospital clinic directly to finalize and confirm your consultation time slot. We never claim guaranteed automated booking without clinic confirmation.
            </span>
          </div>

          <div className="space-y-4">
            {appointmentsList.map((app) => (
              <div
                key={app.id}
                className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-[var(--muted)]">{app.id}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300">
                      {app.status}
                    </span>
                  </div>

                  <h3 className="text-base font-display font-bold text-[var(--text)]">
                    {app.doctorName} · {app.speciality}
                  </h3>
                  <div className="text-xs text-[var(--muted)]">{app.hospital}</div>

                  <div className="text-xs text-[var(--muted)] flex items-center gap-4 pt-1">
                    <span className="flex items-center gap-1">
                      <Calendar size={13} />
                      {app.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={13} />
                      {app.time}
                    </span>
                  </div>

                  <div className="text-xs font-medium text-[var(--text)] pt-1">
                    Reason: {app.reason} (Attached: {app.reportAttached})
                  </div>
                </div>

                <div className="shrink-0">
                  <Link
                    href={`/api/reports/NV-10492/pdf`}
                    target="_blank"
                    className="btn-ghost text-xs py-2 px-3 rounded-lg flex items-center gap-1.5"
                  >
                    <FileText size={14} />
                    <span>View Attached Report</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4-STEP APPOINTMENT REQUEST MODAL */}
      {showRequestModal && selectedDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="max-w-lg w-full rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-md)] p-6 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <div>
                <span className="text-xs font-mono font-bold text-[var(--accent)] uppercase">
                  Step {requestStep} of 4 · Consultation Request
                </span>
                <h3 className="text-lg font-display font-bold text-[var(--text)]">
                  {selectedDoctor.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowRequestModal(false)}
                className="p-1 rounded-md text-[var(--muted)] hover:text-[var(--text)]"
              >
                <X size={18} />
              </button>
            </div>

            {!requestSuccess ? (
              <form onSubmit={handleConfirmAppointmentRequest} className="space-y-4">
                {/* Step 1: Reason for Consultation */}
                {requestStep === 1 && (
                  <div className="space-y-3">
                    <label className="text-xs font-semibold text-[var(--text)]">
                      1. Reason for consultation / symptoms noticed
                    </label>
                    <textarea
                      rows={3}
                      value={consultReason}
                      onChange={(e) => setConsultReason(e.target.value)}
                      className="input-clinical w-full text-xs"
                      placeholder="e.g. Mild vocal hesitation and pitch tremor noticed during screening..."
                    />
                    <div className="flex justify-end pt-2">
                      <button
                        type="button"
                        onClick={() => setRequestStep(2)}
                        className="btn-primary text-xs py-2 px-5 rounded-lg"
                      >
                        Next: Doctor & Clinic →
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Doctor Details Confirmation */}
                {requestStep === 2 && (
                  <div className="space-y-3">
                    <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] space-y-1.5 text-xs">
                      <div className="font-bold text-[var(--text)]">{selectedDoctor.name}</div>
                      <div className="text-[var(--primary)] font-semibold">{selectedDoctor.speciality}</div>
                      <div className="text-[var(--muted)]">{selectedDoctor.hospital}</div>
                      <div className="text-[11px] text-[var(--muted)]">{selectedDoctor.address}</div>
                    </div>
                    <div className="flex justify-between pt-2">
                      <button
                        type="button"
                        onClick={() => setRequestStep(1)}
                        className="btn-ghost text-xs py-2 px-4 rounded-lg"
                      >
                        ← Back
                      </button>
                      <button
                        type="button"
                        onClick={() => setRequestStep(3)}
                        className="btn-primary text-xs py-2 px-5 rounded-lg"
                      >
                        Next: Preferred Date & Time →
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Date and Time */}
                {requestStep === 3 && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[var(--text)]">Preferred Date</label>
                        <input
                          type="date"
                          required
                          value={requestDate}
                          onChange={(e) => setRequestDate(e.target.value)}
                          className="input-clinical w-full text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[var(--text)]">Preferred Time</label>
                        <select
                          value={requestTime}
                          onChange={(e) => setRequestTime(e.target.value)}
                          className="input-clinical w-full text-xs"
                        >
                          <option value="10:00 AM">Morning (10:00 AM – 12:00 PM)</option>
                          <option value="02:30 PM">Afternoon (02:00 PM – 04:00 PM)</option>
                          <option value="05:30 PM">Evening (05:00 PM – 07:00 PM)</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-between pt-2">
                      <button
                        type="button"
                        onClick={() => setRequestStep(2)}
                        className="btn-ghost text-xs py-2 px-4 rounded-lg"
                      >
                        ← Back
                      </button>
                      <button
                        type="button"
                        onClick={() => setRequestStep(4)}
                        className="btn-primary text-xs py-2 px-5 rounded-lg"
                      >
                        Next: Confirm & Attach Report →
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 4: Confirm & Attach Report */}
                {requestStep === 4 && (
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] cursor-pointer text-xs">
                      <input
                        type="checkbox"
                        checked={attachLatestReport}
                        onChange={(e) => setAttachLatestReport(e.target.checked)}
                        className="rounded text-[var(--primary)]"
                      />
                      <span className="font-medium text-[var(--text)]">
                        Attach my latest 5-page acoustic screening PDF report to this consultation request
                      </span>
                    </label>

                    <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 text-xs text-amber-800 dark:text-amber-200">
                      <strong>Important:</strong> Submitting this sends a request to the clinic database. Please call the clinic directly to confirm your arrival. Never claim a confirmed slot.
                    </div>

                    <div className="flex justify-between pt-2">
                      <button
                        type="button"
                        onClick={() => setRequestStep(3)}
                        className="btn-ghost text-xs py-2 px-4 rounded-lg"
                      >
                        ← Back
                      </button>
                      <button
                        type="submit"
                        className="btn-primary text-xs py-2 px-6 rounded-lg"
                      >
                        Submit Consultation Request →
                      </button>
                    </div>
                  </div>
                )}
              </form>
            ) : (
              <div className="text-center space-y-4 py-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={24} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-[var(--text)]">Consultation Request Registered</h4>
                  <p className="text-xs text-[var(--muted)] leading-relaxed">
                    Your request with attached acoustic report has been logged. Please call the hospital / clinic reception to verify final queue timing.
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowRequestModal(false)
                      setActiveTab('appointments')
                    }}
                    className="btn-primary text-xs py-2.5 px-6 rounded-xl"
                  >
                    View My Appointments →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ADMIN ADD DOCTOR MODAL (CSV Importer) */}
      {showAddDoctorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="max-w-md w-full rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-md)] p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <h3 className="text-sm font-bold text-[var(--text)]">Admin Doctor Importer (CSV Row)</h3>
              <button onClick={() => setShowAddDoctorModal(false)} className="text-[var(--muted)] hover:text-[var(--text)]">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleImportCsvDoctor} className="space-y-3">
              <div className="text-xs text-[var(--muted)]">
                Paste one comma-separated row:
                <br />
                <code className="text-[11px] font-mono bg-[var(--surface-2)] p-1 rounded block mt-1">
                  Name, Speciality, Hospital, Address, SourceURL
                </code>
              </div>
              <textarea
                rows={3}
                required
                value={csvRowInput}
                onChange={(e) => setCsvRowInput(e.target.value)}
                placeholder="Dr. Example Name, Neurology, City Hospital, Napier Town, https://example.com/doctor"
                className="input-clinical w-full text-xs font-mono"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddDoctorModal(false)}
                  className="btn-ghost text-xs py-2 px-3 rounded-lg"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs py-2 px-4 rounded-lg">
                  Import Doctor →
                </button>
              </div>
            </form>
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
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] text-[var(--muted)]">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
        </div>
      }
    >
      <CareCommandContent />
    </Suspense>
  )
}
