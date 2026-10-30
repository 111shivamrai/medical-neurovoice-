'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Mic, MicOff, RotateCcw, ArrowLeft, Volume2 } from 'lucide-react'

export default function AshaSimpleModePage() {
  const [lang, setLang] = useState<'hi' | 'en'>('hi')
  const [isRecording, setIsRecording] = useState(false)
  const [recorded, setRecorded] = useState(false)
  const [countdown, setCountdown] = useState(15)
  const [resultTier, setResultTier] = useState<'green' | 'yellow' | 'red'>('green')

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'hi' ? 'en' : 'hi'))
  }

  const startSpeak = () => {
    setIsRecording(true)
    setRecorded(false)
    setCountdown(15)

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setIsRecording(false)
          setRecorded(true)
          // Default green triage for healthy recording
          setResultTier('green')
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const resetTest = () => {
    setRecorded(false)
    setIsRecording(false)
    setCountdown(15)
  }

  return (
    <div className="min-h-screen bg-white text-black flex flex-col justify-between p-6 sm:p-12 font-sans selection:bg-black selection:text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b-2 border-black pb-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-base font-bold text-black hover:underline"
        >
          <ArrowLeft size={20} />
          <span>{lang === 'hi' ? 'वापस डैशबोर्ड' : 'Back to Dashboard'}</span>
        </Link>

        <button
          onClick={toggleLanguage}
          className="px-4 py-2 border-2 border-black rounded-lg font-bold text-sm bg-gray-100 hover:bg-gray-200"
        >
          {lang === 'hi' ? 'Switch to English' : 'हिंदी में बदलें'}
        </button>
      </div>

      {/* Main Interactive Stage */}
      <div className="my-auto max-w-2xl mx-auto w-full text-center">
        {!recorded ? (
          <div className="space-y-8">
            <div className="space-y-3">
              <span className="text-sm font-mono font-bold tracking-widest uppercase bg-yellow-100 px-3 py-1 rounded border border-yellow-300">
                {lang === 'hi' ? 'आशा कार्यकर्ता सरल मोड (ASHA Simple Mode)' : 'ASHA Worker Simple Mode'}
              </span>
              <h1 className="text-3xl sm:text-5xl font-black text-black leading-tight">
                {lang === 'hi'
                  ? 'मरीज़ की आवाज़ रिकॉर्ड करें'
                  : 'Record Patient Voice Sample'}
              </h1>
              <p className="text-lg font-medium text-gray-700">
                {lang === 'hi'
                  ? 'मरीज़ से नीचे दिया गया वाक्य बोलने को कहें:'
                  : 'Ask the patient to read aloud clearly:'}
              </p>
            </div>

            {/* Huge Sentence Prompt */}
            <div className="p-6 sm:p-8 bg-gray-100 border-4 border-black rounded-2xl shadow-[6px_6px_0px_#000]">
              <p className="text-2xl sm:text-3xl font-bold text-black leading-snug">
                {lang === 'hi'
                  ? '"आज मौसम साफ़ है और सुबह की हवा ताज़ा लग रही है।"'
                  : '"The morning sun reflects across the clear river."'}
              </p>
            </div>

            {/* Massive Full-Width Speak Now Button */}
            <button
              onClick={isRecording ? () => setIsRecording(false) : startSpeak}
              className={`w-full py-8 sm:py-10 rounded-2xl text-2xl sm:text-3xl font-black uppercase tracking-wider border-4 border-black transition-all shadow-[8px_8px_0px_#000] flex items-center justify-center gap-4 ${
                isRecording
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-[#6366F1] text-white hover:bg-[#4F46E5] active:translate-x-1 active:translate-y-1 active:shadow-none'
              }`}
            >
              {isRecording ? (
                <>
                  <MicOff size={36} />
                  <span>
                    {lang === 'hi' ? `सुन रहे हैं... (${countdown} सेकंड)` : `Listening... (${countdown}s)`}
                  </span>
                </>
              ) : (
                <>
                  <Mic size={36} />
                  <span>
                    {lang === 'hi' ? '🎙️ बोलिए / Speak Now' : '🎙️ Speak Now'}
                  </span>
                </>
              )}
            </button>
          </div>
        ) : (
          /* Giant Color Block Fills the Screen */
          <div className="space-y-6">
            <div
              className="p-12 sm:p-16 rounded-3xl text-white text-center border-4 border-black shadow-[10px_10px_0px_#000]"
              style={{
                background:
                  resultTier === 'green'
                    ? '#10B981'
                    : resultTier === 'yellow'
                    ? '#F59E0B'
                    : '#EF4444',
              }}
            >
              <div className="text-6xl sm:text-8xl mb-4 font-black">
                {resultTier === 'green' ? '✓' : resultTier === 'yellow' ? '!' : '⚠'}
              </div>

              <h2 className="text-3xl sm:text-5xl font-black leading-tight mb-4">
                {resultTier === 'green' && (lang === 'hi' ? 'कोई चिंता नहीं / No concern detected' : 'No concern detected')}
                {resultTier === 'yellow' && (lang === 'hi' ? 'निगरानी करें / Monitor — recheck in 2 weeks' : 'Monitor — recheck in 2 weeks')}
                {resultTier === 'red' && (lang === 'hi' ? 'अस्पताल जाएं / Please visit a neurologist' : 'Please visit a neurologist')}
              </h2>

              <p className="text-xl sm:text-2xl font-bold bg-black/20 p-4 rounded-xl">
                {resultTier === 'green' &&
                  (lang === 'hi'
                    ? 'आवाज़ की जाँच सामान्य है। 6 महीने बाद दोबारा जाँच करें।'
                    : 'Voice metrics normal. Re-check in 6 months.')}
                {resultTier === 'yellow' &&
                  (lang === 'hi'
                    ? 'हल्का बदलाव दिखा है। दो हफ़्ते बाद दोबारा जाँच करें।'
                    : 'Mild variation. Re-screen after 2 weeks.')}
                {resultTier === 'red' &&
                  (lang === 'hi'
                    ? 'मरीज़ को जबलपुर मेडिकल कॉलेज न्यूरोलॉजी ओपीडी भेजें।'
                    : 'Refer patient to Jabalpur Medical College Neurology OPD.')}
              </p>
            </div>

            {/* Record Again Button */}
            <button
              onClick={resetTest}
              className="w-full py-5 rounded-2xl bg-black text-white font-black text-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 border-2 border-black"
            >
              <RotateCcw size={22} />
              <span>{lang === 'hi' ? 'दोबारा जाँच करें / Record Again' : 'Record Again'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="border-t-2 border-black pt-4 text-center text-xs font-mono font-bold text-gray-700">
        जबलपुर मेडिकल कॉलेज · राष्ट्रीय ग्रामीण स्वास्थ्य मिशन मध्यप्रदेश
      </div>
    </div>
  )
}
