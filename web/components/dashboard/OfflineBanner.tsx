'use client'

import React, { useState, useEffect } from 'react'
import { WifiOff, RefreshCw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false)

  useEffect(() => {
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    // Initial check
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setIsOffline(true)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-4 py-2 text-xs font-mono font-medium flex items-center justify-between z-50 sticky top-0 shadow-md"
        >
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-center">
            <WifiOff size={14} className="animate-pulse" />
            <span>
              You are offline — results and recordings will be saved locally and sync automatically when connected.
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
