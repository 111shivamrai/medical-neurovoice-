'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Users,
  Search,
  Filter,
  MapPin,
  Phone,
  Calendar,
  Languages,
  CheckCircle,
  Building,
} from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'

export default function DoctorsPage() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const [specialtyFilter, setSpecialtyFilter] = useState('all')
  const [languageFilter, setLanguageFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const allDoctors = [
    {
      id: 'doc-01',
      name: 'Dr. V. K. Soni',
      specialty: 'Neurology & Movement Disorders',
      category: 'neurology',
      hospital: 'Netaji Subhash Chandra Bose Medical College',
      city: 'Jabalpur',
      phone: '+91 761 2370951',
      languages: ['Hindi', 'English'],
      distance: '2.4 km away',
      available: true,
      bio: 'Head of Movement Disorder Clinic. Specializes in early Parkinsonism and deep brain stimulation evaluation.',
    },
    {
      id: 'doc-02',
      name: 'Dr. Ananya Mishra',
      specialty: 'Cognitive Neurology & Memory Care',
      category: 'neurology',
      hospital: 'JMC Super Specialty Hospital',
      city: 'Jabalpur',
      phone: '+91 761 2370952',
      languages: ['Hindi', 'English'],
      distance: '2.8 km away',
      available: true,
      bio: 'Pioneer of community Alzheimer screening in Mahakoshal region. Clinical lead for bilingual linguistic decay studies.',
    },
    {
      id: 'doc-03',
      name: 'Dr. Sudhir Sharma',
      specialty: 'Stroke Rehabilitation & Neuro-ICU',
      category: 'neurology',
      hospital: 'Metro Hospital & Heart Institute',
      city: 'Jabalpur',
      phone: '+91 761 4005001',
      languages: ['Hindi', 'English'],
      distance: '4.1 km away',
      available: true,
      bio: 'Consultant Neurologist leading post-stroke longitudinal recovery protocols and acute thrombolysis care.',
    },
    {
      id: 'doc-04',
      name: 'Dr. Ritu Verma',
      specialty: 'Clinical Neurophysiology & Tremor',
      category: 'neurology',
      hospital: 'Jabalpur Hospital & Research Centre',
      city: 'Jabalpur',
      phone: '+91 761 2410214',
      languages: ['Hindi', 'English'],
      distance: '5.0 km away',
      available: true,
      bio: 'Expertise in high-density EEG, vocal acoustic tremor electromyography, and autonomic testing.',
    },
    {
      id: 'doc-05',
      name: 'Dr. Neeraj Patel',
      specialty: 'Neuro-Degenerative Care & Telemedicine',
      category: 'neurology',
      hospital: 'Civil Hospital Sehora Outreach Clinic',
      city: 'Jabalpur',
      phone: '+91 761 2620100',
      languages: ['Hindi', 'English'],
      distance: '18.5 km away',
      available: true,
      bio: 'Directs the rural telemedicine node connecting Jabalpur Medical College to Primary Health Centres.',
    },
    {
      id: 'doc-06',
      name: 'Dr. Meenakshi Sahu (MASLP)',
      specialty: 'Speech & Swallowing Rehabilitation',
      category: 'speech',
      hospital: 'Apex Rehabilitation Clinic',
      city: 'Jabalpur',
      phone: '+91 761 2678912',
      languages: ['Hindi', 'English'],
      distance: '3.2 km away',
      available: true,
      bio: 'Speech pathologist focused on acoustic biofeedback training for dysarthric and Parkinsonian hypophonia.',
    },
    {
      id: 'doc-07',
      name: 'Dr. Amit Agrawal (BASLP)',
      specialty: 'Dysarthria & Motor Speech Disorders',
      category: 'speech',
      hospital: 'Jabalpur Speech & Hearing Institute',
      city: 'Jabalpur',
      phone: '+91 761 2405678',
      languages: ['Hindi', 'English'],
      distance: '4.5 km away',
      available: true,
      bio: 'Clinical specialist in articulatory rate pacing and respiratory-phonatory coordination therapies.',
    },
    {
      id: 'doc-08',
      name: 'Dr. Priya Chouhan',
      specialty: 'Post-Stroke Aphasia Rehabilitation',
      category: 'speech',
      hospital: 'City Neuro Rehab Centre, Wright Town',
      city: 'Jabalpur',
      phone: '+91 761 2489012',
      languages: ['Hindi', 'English'],
      distance: '3.9 km away',
      available: true,
      bio: 'Specialized in constraint-induced language therapy for stroke survivors in Hindi and regional dialects.',
    },
    {
      id: 'doc-09',
      name: 'Dr. Rajesh Tiwari',
      specialty: 'Geriatric Neuro-Psychiatry & Memory Clinic',
      category: 'psychiatry',
      hospital: 'NSCB Medical College Dept of Psychiatry',
      city: 'Jabalpur',
      phone: '+91 761 2370960',
      languages: ['Hindi', 'English'],
      distance: '2.4 km away',
      available: true,
      bio: 'Senior consultant evaluating behavioral and psychiatric manifestations of early neuro-degeneration.',
    },
    {
      id: 'doc-10',
      name: 'Dr. Shalini Dubey',
      specialty: 'Neuropsychological Assessment & Cognitive Health',
      category: 'psychiatry',
      hospital: 'Manas Mental Health & Neuro Care',
      city: 'Jabalpur',
      phone: '+91 761 4056711',
      languages: ['Hindi', 'English'],
      distance: '6.2 km away',
      available: true,
      bio: 'Clinical neuropsychologist administering Hindi-validated MMSE, MoCA, and semantic battery evaluations.',
    },
  ]

  const filteredDoctors = allDoctors.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.hospital.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesSpecialty =
      specialtyFilter === 'all' || doc.category === specialtyFilter

    const matchesLanguage =
      languageFilter === 'all' || doc.languages.includes(languageFilter)

    return matchesSearch && matchesSpecialty && matchesLanguage
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#1F2937]">
        <div>
          <span className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-widest block mb-1">
            FEATURE 7 · MEDICAL SPECIALIST DIRECTORY
          </span>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
            Neurology & Speech Specialists (Jabalpur)
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Verified clinicians at Netaji Subhash Chandra Bose Medical College and affiliated institutes
          </p>
        </div>

        <Link
          href="/dashboard/appointments"
          className="py-2.5 px-5 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-bold transition-all shadow-[0_0_20px_rgba(99,102,241,0.4)]"
        >
          View My Appointments
        </Link>
      </div>

      {/* FILTER BAR: Specialty | City | Language | Available */}
      <div className="p-4 rounded-2xl bg-[#111827] border border-[#1F2937] flex flex-wrap items-center justify-between gap-4">
        <div className="flex-1 min-w-[240px] relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by doctor name, hospital, or specialty..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0A0F1E] border border-[#1F2937] text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#6366F1]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          {/* Specialty Filter */}
          <div className="flex items-center gap-1.5 font-mono">
            <span className="text-gray-400">Specialty:</span>
            <select
              value={specialtyFilter}
              onChange={(e) => setSpecialtyFilter(e.target.value)}
              className="bg-[#0A0F1E] border border-[#1F2937] text-white rounded-lg px-3 py-2 outline-none"
            >
              <option value="all">All Specialties (10)</option>
              <option value="neurology">Neurology (5)</option>
              <option value="speech">Speech Pathology (3)</option>
              <option value="psychiatry">Neuro-Psychiatry (2)</option>
            </select>
          </div>

          {/* Language Filter */}
          <div className="flex items-center gap-1.5 font-mono">
            <span className="text-gray-400">Language:</span>
            <select
              value={languageFilter}
              onChange={(e) => setLanguageFilter(e.target.value)}
              className="bg-[#0A0F1E] border border-[#1F2937] text-white rounded-lg px-3 py-2 outline-none"
            >
              <option value="all">All Languages</option>
              <option value="Hindi">Hindi</option>
              <option value="English">English</option>
            </select>
          </div>

          {/* City Match (Jabalpur) */}
          <div className="px-3 py-2 rounded-lg bg-[#0A0F1E] border border-cyan-500/20 text-cyan-400 font-mono text-xs flex items-center gap-1">
            <MapPin size={13} />
            <span>Jabalpur, MP</span>
          </div>
        </div>
      </div>

      {/* DOCTORS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDoctors.map((doc) => (
          <div
            key={doc.id}
            className="p-6 rounded-2xl bg-[#111827] border border-[#1F2937] flex flex-col justify-between transition-all hover:border-gray-600 shadow-sm group"
          >
            <div>
              {/* Top row */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3.5">
                  {/* Photo placeholder (grey avatar) */}
                  <div className="w-14 h-14 rounded-2xl bg-[#1F2937] border border-[#374151] flex items-center justify-center text-2xl flex-shrink-0 group-hover:border-[#6366F1] transition-colors">
                    <span>👨‍⚕️</span>
                  </div>

                  <div>
                    <h3 className="font-display font-bold text-lg text-white group-hover:text-cyan-300 transition-colors">
                      {doc.name}
                    </h3>
                    <p className="text-xs text-[#6366F1] font-semibold">{doc.specialty}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{doc.hospital}</p>
                  </div>
                </div>

                {/* Distance Chip */}
                <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/25 whitespace-nowrap">
                  {doc.distance}
                </span>
              </div>

              {/* Bio summary */}
              <p className="text-xs text-gray-300 leading-relaxed mb-4">
                {doc.bio}
              </p>

              {/* Contact & Languages */}
              <div className="space-y-1.5 py-3 border-t border-[#1F2937] text-xs font-mono text-gray-400">
                <div className="flex items-center gap-2">
                  <Phone size={13} className="text-gray-500" />
                  <span>{doc.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Languages size={13} className="text-gray-500" />
                  <span>Languages: {doc.languages.join(', ')}</span>
                </div>
              </div>
            </div>

            {/* Book Appointment CTA */}
            <Link
              href={`/dashboard/appointments?doctorId=${doc.id}`}
              className="mt-4 w-full py-2.5 px-4 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(99,102,241,0.25)]"
            >
              <Calendar size={14} />
              <span>Book Appointment →</span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
