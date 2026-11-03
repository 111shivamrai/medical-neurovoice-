import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY

if (!apiKey || apiKey.trim() === '' || apiKey.startsWith('AIzaSyDemo')) {
  if (typeof window !== 'undefined') {
    console.warn(
      '[NeuroVoice Developer Warning] NEXT_PUBLIC_FIREBASE_API_KEY is empty or unconfigured in web/.env.local. Operating in seamless local clinical demo mode.'
    )
  }
}

const firebaseConfig = {
  apiKey: apiKey && apiKey.trim() !== '' ? apiKey : 'AIzaSyPlaceholderForDemoModeInit00000',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'neurovoice-3c2c7.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'neurovoice-3c2c7',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'neurovoice-3c2c7.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
}

export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
export const googleProvider = new GoogleAuthProvider()
