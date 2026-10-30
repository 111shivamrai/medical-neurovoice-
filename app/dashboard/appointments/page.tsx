'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Plus,
  ArrowRight,
  Check,
  FileText,
} from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'

export default function AppointmentsPage() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('list')
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [bookingStep, setBookingStep] = useState<1 | 2 | 3 | 4>(1)

  // Booking Form State
  const [selectedDisorder, setSelectedDisorder] = useState("Parkinson's Disease Screening")
  const [selectedDoctor, setSelectedDoctor] = useState('Dr. V. K. Soni (Neurology)')
  const [selectedDate, setSelectedDate] = useState('06 Nov 2026')
  const [selectedSlot, setSelectedSlot] = useState('10:30 AM')
  const [referenceNumber, setReferenceNumber] = useState('')

  const [appointments, setAppointments] = useState([
    {
      id: 'apt-01',
      doctor: 'Dr. V. K. Soni',
      specialty: 'Neurology & Movement Disorders',
      hospital: 'Netaji Subhash Chandra Bose Medical College',
      disorder: "Parkinson's Disease Screening",
      dateTime: '04 Nov 2026 · 10:30 AM',
      status: 'Upcoming', // 'Upcoming' | 'Completed' | 'Cancelled'
      ref: 'JMC-APT-88219',
    },
    {
      id: 'apt-02',
      doctor: 'Dr. Meenakshi Sahu',
      specialty: 'Speech & Swallowing Rehab',
      hospital: 'Apex Rehab Clinic, Jabalpur',
      disorder: 'Dysarthria Articulatory Review',
      dateTime: '28 Oct 2026 · 02:00 PM',
      status: 'Completed',
      ref: 'JMC-APT-77102',
    },
    {
      id: 'apt-03',
      doctor: 'Dr. Ananya Mishra',
      specialty: 'Cognitive Neurology & Dementia',
      hospital: 'JMC Super Specialty Hospital',
      disorder: "Alzheimer's Linguistic Evaluation",
      dateTime: '15 Sep 2026 · 11:00 AM',
      status: 'Cancelled',
      ref: 'JMC-APT-66044',
    },
  ])

  const handleConfirmBooking = () => {
    const generatedRef = `JMC-APT-${Math.floor(10000 + Math.random() * 90000)}`
    setReferenceNumber(generatedRef)
    setAppointments([
      {
        id: `apt-${Date.now()}`,
        doctor: selectedDoctor.split(' (')[0],
        specialty: 'Neurology Clinical Evaluation',
        hospital: 'Jabalpur Medical College',
        disorder: selectedDisorder,
        dateTime: `${selectedDate} · ${selectedSlot}`,
        status: 'Upcoming',
        ref: generatedRef,
      },
      ...appointments,
    ])
    setBookingStep(4)
  }

  const cancelAppointment = (id: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'Cancelled' } : a))
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#1F2937]">
        <div>
          <span className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-widest block mb-1">
            FEATURE-X · APPOINTMENT CONSULTATIONS
          </span>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
            Clinical Appointments
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Schedule, reschedule, or review hospital consultations with Jabalpur specialists
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Calendar vs List View Toggle */}
          <div className="p-1 rounded-xl bg-[#111827] border border-[#1F2937] flex items-center text-xs font-mono">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'list'
                  ? 'bg-[#6366F1] text-white font-bold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'calendar'
                  ? 'bg-[#6366F1] text-white font-bold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Calendar
            </button>
          </div>

          <button
            onClick={() => {
              setIsBookingOpen(true)
              setBookingStep(1)
            }}
            className="py-2.5 px-5 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-bold transition-all shadow-[0_0_20px_rgba(99,102,241,0.4)] flex items-center gap-1.5"
          >
            <Plus size={15} />
            <span>Book Appointment</span>
          </button>
        </div>
      </div>

      {/* MODAL: BOOK APPOINTMENT FLOW */}
      {isBookingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-[#111827] border border-[#1F2937] p-6 sm:p-8 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#1F2937]">
              <div>
                <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest block">
                  Step {bookingStep} of 4
                </span>
                <h3 className="font-display font-bold text-xl text-white">
                  {bookingStep === 1 && 'Select Reason / Disorder'}
                  {bookingStep === 2 && 'Pick Specialist Doctor'}
                  {bookingStep === 3 && 'Choose Date & Time Slot'}
                  {bookingStep === 4 && 'Appointment Confirmed'}
                </h3>
              </div>
              <button
                onClick={() => setIsBookingOpen(false)}
                className="text-gray-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            {/* Step 1: Disorder / Reason */}
            {bookingStep === 1 && (
              <div className="space-y-3">
                {[
                  "Parkinson's Disease Screening Follow-up",
                  "Alzheimer's & Cognitive Assessment",
                  'Dysarthria Speech Rehabilitation',
                  'Post-Stroke Recovery Review',
                ].map((reason) => (
                  <button
                    key={reason}
                    onClick={() => {
                      setSelectedDisorder(reason)
                      setBookingStep(2)
                    }}
                    className={`w-full p-4 rounded-xl text-left border text-xs font-semibold transition-all ${
                      selectedDisorder === reason
                        ? 'border-[#6366F1] bg-indigo-500/15 text-white shadow-sm'
                        : 'border-[#1F2937] bg-[#0A0F1E] text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    {reason}
                  </button>
                ))}
              </div>
            )}

            {/* Step 2: Pick Doctor */}
            {bookingStep === 2 && (
              <div className="space-y-3">
                {[
                  'Dr. V. K. Soni (Neurology & Movement Disorders)',
                  'Dr. Ananya Mishra (Cognitive Neurology)',
                  'Dr. Meenakshi Sahu (Speech Pathologist)',
                ].map((doc) => (
                  <button
                    key={doc}
                    onClick={() => {
                      setSelectedDoctor(doc)
                      setBookingStep(3)
                    }}
                    className={`w-full p-4 rounded-xl text-left border text-xs font-semibold transition-all ${
                      selectedDoctor === doc
                        ? 'border-[#6366F1] bg-indigo-500/15 text-white'
                        : 'border-[#1F2937] bg-[#0A0F1E] text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    {doc}
                  </button>
                ))}
                <div className="pt-2">
                  <button
                    onClick={() => setBookingStep(1)}
                    className="text-xs text-gray-400 hover:text-white"
                  >
                    ← Back
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Date & Time */}
            {bookingStep === 3 && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-400 block mb-1 font-mono">Date:</label>
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-[#0A0F1E] border border-[#1F2937] rounded-xl p-3 text-xs text-white"
                  >
                    <option value="06 Nov 2026">Friday, 06 Nov 2026</option>
                    <option value="09 Nov 2026">Monday, 09 Nov 2026</option>
                    <option value="11 Nov 2026">Wednesday, 11 Nov 2026</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-gray-400 block mb-1 font-mono">Time Slot:</label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {['09:30 AM', '10:30 AM', '02:00 PM', '03:30 PM'].map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-2.5 rounded-lg border font-mono ${
                          selectedSlot === slot
                            ? 'border-cyan-400 bg-cyan-500/15 text-cyan-300'
                            : 'border-[#1F2937] bg-[#0A0F1E] text-gray-400 hover:text-white'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    onClick={() => setBookingStep(2)}
                    className="text-xs text-gray-400 hover:text-white"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handleConfirmBooking}
                    className="py-2.5 px-6 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-bold"
                  >
                    Confirm Booking →
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Confirmed */}
            {bookingStep === 4 && (
              <div className="text-center space-y-4 py-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                  <Check size={32} />
                </div>
                <h4 className="font-display font-bold text-xl text-white">
                  Booking Confirmed!
                </h4>
                <p className="text-xs text-gray-400">
                  Your appointment has been registered in the Jabalpur Medical College OPD system.
                </p>
                <div className="p-4 rounded-xl bg-[#0A0F1E] border border-[#1F2937] text-left text-xs font-mono space-y-1">
                  <div>
                    <span className="text-gray-400">Reference: </span>
                    <span className="text-cyan-400 font-bold">{referenceNumber}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Doctor: </span>
                    <span className="text-white">{selectedDoctor}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Schedule: </span>
                    <span className="text-white">{selectedDate} · {selectedSlot}</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsBookingOpen(false)}
                  className="w-full py-3 rounded-xl bg-[#6366F1] text-white text-xs font-bold"
                >
                  Close & View Appointments
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CALENDAR VIEW OR LIST VIEW */}
      {viewMode === 'calendar' ? (
        <div className="p-6 rounded-2xl bg-[#111827] border border-[#1F2937] text-center space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-base text-white">November 2026</h3>
            <span className="text-xs font-mono text-cyan-400">JMC OPD Schedule</span>
          </div>
          {/* Calendar Month Grid */}
          <div className="grid grid-cols-7 gap-2 text-xs font-mono">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
              <div key={d} className="py-2 text-gray-500 font-bold">
                {d}
              </div>
            ))}
            {Array.from({ length: 30 }).map((_, i) => {
              const day = i + 1
              const hasApt = day === 4 || day === 6 || day === 8
              return (
                <div
                  key={day}
                  className={`py-3 rounded-xl border text-center transition-colors ${
                    hasApt
                      ? 'border-[#6366F1] bg-indigo-500/20 text-white font-bold'
                      : 'border-[#1F2937] bg-[#0A0F1E] text-gray-400 hover:border-gray-600'
                  }`}
                >
                  <span>{day}</span>
                  {hasApt && <span className="block text-[9px] text-cyan-300">OPD</span>}
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        /* List View */
        <div className="space-y-4">
          {appointments.map((apt) => (
            <div
              key={apt.id}
              className="p-6 rounded-2xl bg-[#111827] border border-[#1F2937] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h4 className="font-display font-bold text-base text-white">{apt.doctor}</h4>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                      apt.status === 'Upcoming'
                        ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                        : apt.status === 'Completed'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-gray-500/15 text-gray-400 border border-gray-500/30'
                    }`}
                  >
                    {apt.status}
                  </span>
                </div>
                <p className="text-xs text-indigo-300">{apt.specialty}</p>
                <p className="text-xs text-gray-400">{apt.disorder} · Ref #{apt.ref}</p>
                <p className="text-xs font-mono text-cyan-400 flex items-center gap-1.5 pt-1">
                  <Clock size={12} />
                  <span>{apt.dateTime}</span>
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Link
                  href="/dashboard/history"
                  className="py-2 px-3 rounded-lg border border-[#1F2937] text-gray-300 hover:text-white text-xs font-mono flex items-center gap-1"
                >
                  <FileText size={13} />
                  <span>View Report</span>
                </Link>

                {apt.status === 'Upcoming' && (
                  <button
                    onClick={() => cancelAppointment(apt.id)}
                    className="py-2 px-3 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs font-mono"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
