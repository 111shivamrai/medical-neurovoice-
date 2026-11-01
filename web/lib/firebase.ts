import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyDemoFakeKeyForNeuroVoiceBuildCheck00',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'neurovoice-jmc.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'neurovoice-jmc',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'neurovoice-jmc.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '102938475610',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:102938475610:web:8a9b0c1d2e3f4a5b6c7d',
}

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const googleProvider = new GoogleAuthProvider()
