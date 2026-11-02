'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Mic,
  MicOff,
  RotateCcw,
  ArrowLeft,
  Volume2,
  Share2,
  User,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Building2,
  Phone,
  FileText,
  FileDown,
  ChevronRight,
} from 'lucide-react'
import { downloadScreeningPdf } from '@/lib/downloadPdf'

export default function CommunityHealthWorkerModePage() {
  const [lang, setLang] = useState<'hi' | 'en'>('hi')

  // Worker Session State (Persistent)
  const [workerName, setWorkerName] = useState('Sunita Bai')
  const [phcCenter, setPhcCenter] = useState('Sehora Primary Health Centre')
  const [district, setDistrict] = useState('Jabalpur District')
  const [isEditingWorker, setIsEditingWorker] = useState(false)

  // Participant Intake State
  const [personName, setPersonName] = useState('Kamla Devi')
  const [personAge, setPersonAge] = useState('62')
  const [personSex, setPersonSex] = useState<'female' | 'male'>('female')
  const [village, setVillage] = useState('Salaiya Village')
  const [step, setStep] = useState<'intake' | 'record' | 'result'>('intake')

  // Audio Recording State
  const [isRecording, setIsRecording] = useState(false)
  const [countdown, setCountdown] = useState(15)
  const [resultTier, setResultTier] = useState<'green' | 'yellow' | 'red'>('green')
  const [screeningId, setScreeningId] = useState('NV-CHW-082')

  useEffect(() => {
    try {
      const saved = localStorage.getItem('neurovoice-chw-session')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.workerName) setWorkerName(parsed.workerName)
        if (parsed.phcCenter) setPhcCenter(parsed.phcCenter)
        if (parsed.district) setDistrict(parsed.district)
      }
    } catch {
      // ignore
    }
  }, [])

  const saveWorkerSession = () => {
    try {
      localStorage.setItem(
        'neurovoice-chw-session',
        JSON.stringify({ workerName, phcCenter, district })
      )
    } catch {
      // ignore
    }
    setIsEditingWorker(false)
  }

  // Audio voice guidance using SpeechSynthesis
  const speakGuidance = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN'
    utterance.rate = 0.9
    window.speechSynthesis.speak(utterance)
  }

  const startRecording = () => {
    setIsRecording(true)
    setCountdown(15)
    speakGuidance(
      lang === 'hi'
        ? 'कृपया तीस सेकंड के लिए आ... बोलिए।'
        : 'Please sustain the aaah sound steadily.'
    )

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setIsRecording(false)
          // Randomize or set result tier for demonstration (default green)
          setResultTier('green')
          setScreeningId(`NV-CHW-${Math.floor(100 + Math.random() * 900)}`)
          setStep('result')
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const resetAll = () => {
    setStep('intake')
    setIsRecording(false)
    setCountdown(15)
  }

  // WhatsApp Referral Slip Builder
  const buildWhatsAppSlip = () => {
    const tierText =
      resultTier === 'green'
        ? '🟢 सामान्य (No Concern Detected)'
        : resultTier === 'yellow'
        ? '🟡 निगरानी (Monitor / 30-Day Follow-Up)'
        : '🔴 विशेषज्ञ परामर्श (Priority Neurologist Consultation Advised)'

    const msg =
      `*NEUROVOICE — COMMUNITY HEALTH SCREENING REFERRAL SLIP*\n\n` +
      `📋 *Screening ID:* ${screeningId}\n` +
      `👤 *Patient:* ${personName} (${personAge} Y / ${personSex === 'female' ? 'F' : 'M'})\n` +
      `📍 *Village / Location:* ${village}, ${district}\n` +
      `🏥 *Screening Center:* ${phcCenter}\n` +
      `👩‍⚕️ *Community Worker:* ${workerName}\n` +
      `📅 *Date:* ${new Date().toLocaleDateString('en-IN')}\n\n` +
      `📊 *Acoustic Screening Result:* ${tierText}\n` +
      `💡 *Action Required:* ${
        resultTier === 'red'
          ? 'Refer to district hospital neurology clinic for formal assessment.'
          : resultTier === 'yellow'
          ? 'Re-screen in 30 days.'
          : 'Normal vocal stability. Routine annual follow-up.'
      }\n\n` +
      `⚠️ *Emergency:* In case of sudden face drooping or speech slurring, dial 112 / 108 immediately.\n` +
      `_NeuroVoice is a research screening tool, not a clinical diagnosis._`

    const url = `https://wa.me/?text=${encodeURIComponent(msg)}`
    window.open(url, '_blank')
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col justify-between p-4 sm:p-8 font-sans transition-colors duration-200">
      {/* Top Bar */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="p-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:border-[var(--primary)] transition-colors"
            title="Return to Dashboard"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-lg text-[var(--text)]">NeuroVoice</span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20">
                Community Health Worker Mode
              </span>
            </div>
            <p className="text-xs text-[var(--muted)]">
              Frontline rural neurological vocal biomarker screening interface (Offline-ready)
            </p>
          </div>
        </div>

        {/* Right Session & Lang Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLang(lang === 'hi' ? 'en' : 'hi')}
            className="px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-xs font-semibold hover:border-[var(--primary)] transition-colors"
          >
            {lang === 'hi' ? 'English' : 'हिंदी'}
          </button>
          <button
            onClick={() => setIsEditingWorker(!isEditingWorker)}
            className="px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-xs font-semibold hover:border-[var(--primary)] transition-colors flex items-center gap-1.5"
          >
            <Building2 size={13} className="text-[var(--primary)]" />
            <span>{isEditingWorker ? 'Close' : 'Worker Session'}</span>
          </button>
        </div>
      </header>

      {/* Persistent Worker Settings Drawer */}
      {isEditingWorker && (
        <div className="my-4 p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-md space-y-4 max-w-xl mx-auto w-full">
          <h3 className="font-display font-bold text-sm text-[var(--text)]">Health Worker & Center Settings</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-[11px] font-mono text-[var(--muted)] block mb-1">Worker Name</label>
              <input
                type="text"
                value={workerName}
                onChange={(e) => setWorkerName(e.target.value)}
                className="input-clinical text-xs"
              />
            </div>
            <div>
              <label className="text-[11px] font-mono text-[var(--muted)] block mb-1">Primary Health Center</label>
              <input
                type="text"
                value={phcCenter}
                onChange={(e) => setPhcCenter(e.target.value)}
                className="input-clinical text-xs"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-[11px] font-mono text-[var(--muted)] block mb-1">District / Block</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="input-clinical text-xs"
              />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button
              onClick={saveWorkerSession}
              className="btn-primary text-xs py-2 px-4 rounded-xl"
            >
              Save Worker Session
            </button>
          </div>
        </div>
      )}

      {/* Main Interactive Stage */}
      <main className="my-auto max-w-xl mx-auto w-full py-8">
        {/* STEP 1: PARTICIPANT INTAKE */}
        {step === 'intake' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] space-y-6">
            <div className="text-center space-y-2">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[var(--accent)]">
                {lang === 'hi' ? 'चरण १: मरीज़ का विवरण' : 'Step 1: Participant Intake'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-[var(--text)]">
                {lang === 'hi' ? 'नया व्यक्ति जोड़ें' : 'Add New Participant'}
              </h2>
              <p className="text-xs text-[var(--muted)]">
                {lang === 'hi'
                  ? 'स्क्रीनिंग शुरू करने से पहले बुनियादी जानकारी दर्ज करें'
                  : 'Enter basic details before initiating vocal screening.'}
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-[var(--text)] block mb-1">
                  {lang === 'hi' ? 'मरीज़ का नाम / Name' : 'Full Name'}
                </label>
                <input
                  type="text"
                  value={personName}
                  onChange={(e) => setPersonName(e.target.value)}
                  className="input-clinical text-xs"
                  placeholder="e.g. Rameshwar Patel"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[var(--text)] block mb-1">
                    {lang === 'hi' ? 'उम्र / Age' : 'Age (Years)'}
                  </label>
                  <input
                    type="number"
                    value={personAge}
                    onChange={(e) => setPersonAge(e.target.value)}
                    className="input-clinical text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[var(--text)] block mb-1">
                    {lang === 'hi' ? 'लिंग / Sex' : 'Biological Sex'}
                  </label>
                  <select
                    value={personSex}
                    onChange={(e) => setPersonSex(e.target.value as any)}
                    className="input-clinical text-xs"
                  >
                    <option value="female">Female (महिला)</option>
                    <option value="male">Male (पुरुष)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-[var(--text)] block mb-1">
                  {lang === 'hi' ? 'गाँव या कस्बा / Village' : 'Village / Ward'}
                </label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="input-clinical text-xs"
                  placeholder="e.g. Salaiya, Sehora"
                />
              </div>
            </div>

            <button
              onClick={() => setStep('record')}
              className="btn-primary w-full py-4 text-sm font-semibold rounded-2xl flex items-center justify-center gap-2 shadow-md"
            >
              <span>{lang === 'hi' ? 'आवाज़ रिकॉर्डिंग शुरू करें →' : 'Begin Voice Recording →'}</span>
            </button>
          </div>
        )}

        {/* STEP 2: AUDIO RECORDING WITH HINDI PROMPTS */}
        {step === 'record' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] space-y-6 text-center">
            <div className="space-y-2">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[var(--primary)]">
                {lang === 'hi' ? 'चरण २: आवाज़ की जाँच' : 'Step 2: Voice Capture'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-[var(--text)]">
                {personName}
              </h2>
              <p className="text-xs text-[var(--muted)]">
                {lang === 'hi'
                  ? 'मरीज़ को नीचे दिया गया वाक्य साफ़ आवाज़ में बोलने को कहें:'
                  : 'Ask the participant to sustain an aaah sound and read:'}
              </p>
            </div>

            {/* Prompt Box with Listen Button */}
            <div className="p-6 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] space-y-3">
              <p className="text-xl sm:text-2xl font-display font-bold text-[var(--text)] leading-snug">
                {lang === 'hi'
                  ? '“आ...... आज मौसम बहुत साफ़ है और सुबह की हवा ताज़ा है।”'
                  : '“Aaah... the morning sun is clear and bright today.”'}
              </p>
              <button
                type="button"
                onClick={() =>
                  speakGuidance(
                    lang === 'hi'
                      ? 'आज मौसम बहुत साफ़ है और सुबह की हवा ताज़ा है।'
                      : 'The morning sun is clear and bright today.'
                  )
                }
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--primary)]/10 text-[var(--primary)] hover:bg-[var(--primary)]/20 transition-colors"
              >
                <Volume2 size={14} />
                <span>{lang === 'hi' ? 'आवाज़ सुनें' : 'Listen Sample'}</span>
              </button>
            </div>

            {/* Giant Recording Button */}
            <button
              onClick={isRecording ? () => setIsRecording(false) : startRecording}
              className={`w-full py-8 rounded-2xl text-xl sm:text-2xl font-bold tracking-wide transition-all shadow-md flex items-center justify-center gap-3 ${
                isRecording
                  ? 'bg-[var(--danger)] text-white animate-pulse'
                  : 'btn-primary py-7'
              }`}
            >
              {isRecording ? (
                <>
                  <MicOff size={28} />
                  <span>{lang === 'hi' ? `सुन रहे हैं... (${countdown}s)` : `Listening... (${countdown}s)`}</span>
                </>
              ) : (
                <>
                  <Mic size={28} />
                  <span>{lang === 'hi' ? '🎙️ बोलिए / Record Now' : '🎙️ Record Now'}</span>
                </>
              )}
            </button>

            <button
              onClick={() => setStep('intake')}
              className="text-xs text-[var(--muted)] hover:underline"
            >
              ← {lang === 'hi' ? 'मरीज़ की जानकारी बदलें' : 'Back to participant details'}
            </button>
          </div>
        )}

        {/* STEP 3: HIGH-CONTRAST 3-TIER RESULTS & WHATSAPP REFERRAL */}
        {step === 'result' && (
          <div className="space-y-6">
            <div
              className={`p-8 sm:p-10 rounded-3xl text-center space-y-4 border-2 shadow-lg ${
                resultTier === 'green'
                  ? 'bg-[var(--success)]/10 border-[var(--success)] text-[var(--success)]'
                  : resultTier === 'yellow'
                  ? 'bg-[var(--warning)]/10 border-[var(--warning)] text-[var(--warning)]'
                  : 'bg-[var(--danger)]/10 border-[var(--danger)] text-[var(--danger)]'
              }`}
            >
              <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center text-white text-3xl font-black"
                style={{
                  backgroundColor:
                    resultTier === 'green'
                      ? 'var(--success)'
                      : resultTier === 'yellow'
                      ? 'var(--warning)'
                      : 'var(--danger)',
                }}
              >
                {resultTier === 'green' ? '✓' : resultTier === 'yellow' ? '!' : '⚠'}
              </div>

              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider block">
                  {lang === 'hi' ? 'स्क्रीनिंग परिणाम / Result' : 'Screening Outcome'}
                </span>
                <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-[var(--text)] mt-1">
                  {resultTier === 'green' && (lang === 'hi' ? 'हरा: सामान्य (कोई चिंता नहीं)' : 'Green: Low Concern')}
                  {resultTier === 'yellow' && (lang === 'hi' ? 'पीला: निगरानी रखें' : 'Yellow: Worth Monitoring')}
                  {resultTier === 'red' && (lang === 'hi' ? 'लाल: डॉक्टर से मिलें' : 'Red: Specialist Advised')}
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-[var(--text)] font-medium leading-relaxed max-w-md mx-auto">
                {resultTier === 'green' &&
                  (lang === 'hi'
                    ? 'आवाज़ की जाँच में कोई स्पष्ट रुकावट या कंपन नहीं दिखा। ६ महीने बाद दोबारा जाँच करें।'
                    : 'Acoustic vocal stability is within demographic reference boundaries. Periodic wellness check in 6 months.')}
                {resultTier === 'yellow' &&
                  (lang === 'hi'
                    ? 'हल्का बदलाव दिखा है। ३० दिनों में दोबारा जाँच करें।'
                    : 'Mild vocal variation observed. Re-screen after 30 days.')}
                {resultTier === 'red' &&
                  (lang === 'hi'
                    ? 'मरीज़ को प्राथमिक स्वास्थ्य केंद्र या जिला अस्पताल के न्यूरोलॉजिस्ट को दिखाएं।'
                    : 'Refer participant to district hospital neurology OPD for comprehensive clinical review.')}
              </p>
            </div>

            {/* Actions: Share WhatsApp Slip + Record Again */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => downloadScreeningPdf(screeningId, personName)}
                className="btn-primary w-full py-3.5 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 shadow-sm"
              >
                <FileDown size={17} />
                <span>{lang === 'hi' ? 'पीडीएफ रिपोर्ट डाउनलोड करें' : 'Download Clinical PDF Report'}</span>
              </button>

              <button
                onClick={buildWhatsAppSlip}
                className="w-full py-4 rounded-2xl bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-transform active:scale-98"
              >
                <Share2 size={18} />
                <span>{lang === 'hi' ? 'WhatsApp रेफरल पर्ची भेजें' : 'Share WhatsApp Referral Slip'}</span>
              </button>

              <button
                onClick={resetAll}
                className="btn-ghost w-full py-3 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2"
              >
                <RotateCcw size={15} />
                <span>{lang === 'hi' ? 'अगला मरीज़ जाँचें' : 'Screen Next Participant'}</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] pt-4 text-center space-y-1 text-xs text-[var(--muted)]">
        <p className="font-semibold">
          NeuroVoice Community Health Worker Mode · Built for Frontline Public Health
        </p>
        <p className="text-[11px]">
          Investigational screening support tool — not a clinical diagnosis. Raw voice audio is deleted immediately after extraction.
        </p>
      </footer>
    </div>
  )
}
