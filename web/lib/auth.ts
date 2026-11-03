import { auth, googleProvider } from './firebase'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth'

export interface UserSession {
  uid: string
  email: string | null
  displayName: string | null
  photoURL?: string | null
  gender?: 'Male' | 'Female' | 'Prefer not to say' | string | null
  location?: string | null
  createdAt?: string | null
  role?: string
  isDemo?: boolean
}

const LOCAL_USER_KEY = 'neurovoice_current_user'
const AUTH_TOKEN_KEY = 'neurovoice-auth-token'
const ROLE_KEY = 'neurovoice-role'

export function isDemoMode(): boolean {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
  return !apiKey || apiKey.trim() === '' || apiKey.startsWith('AIzaSyDemo') || apiKey.includes('Placeholder') || apiKey.length < 20
}

export function getLocalUser(): UserSession | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(LOCAL_USER_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // ignore
  }
  return null
}

export function setLocalUser(user: UserSession): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user))
    localStorage.setItem(AUTH_TOKEN_KEY, `demo-token-${user.uid}`)
    if (user.role) localStorage.setItem(ROLE_KEY, user.role)
    window.dispatchEvent(new Event('neurovoice-auth-change'))
  } catch {
    // ignore
  }
}

export function clearLocalUser(): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(LOCAL_USER_KEY)
    localStorage.removeItem(AUTH_TOKEN_KEY)
    localStorage.removeItem(ROLE_KEY)
    sessionStorage.clear()
    window.dispatchEvent(new Event('neurovoice-auth-change'))
  } catch {
    // ignore
  }
}

export function subscribeToAuth(callback: (user: UserSession | null) => void) {
  // 1. Immediately emit current local user if available
  const initialLocal = getLocalUser()
  if (initialLocal) {
    callback(initialLocal)
  }

  // 2. Subscribe to Firebase Auth
  let unsubFirebase = () => {}
  try {
    unsubFirebase = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        const local = getLocalUser()
        const session: UserSession = {
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: fbUser.displayName || local?.displayName || null,
          photoURL: fbUser.photoURL || local?.photoURL || null,
          gender: local?.gender || 'Prefer not to say',
          location: local?.location || 'Madhya Pradesh, India',
          createdAt: fbUser.metadata?.creationTime || local?.createdAt || new Date().toISOString(),
          role: local?.role || 'patient',
          isDemo: false,
        }
        setLocalUser(session)
        callback(session)
      } else {
        const local = getLocalUser()
        callback(local)
      }
    })
  } catch {
    // ignore
  }

  // 3. Listen to local session changes
  const handleCustomChange = () => {
    callback(getLocalUser())
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('neurovoice-auth-change', handleCustomChange)
    window.addEventListener('storage', handleCustomChange)
  }

  return () => {
    unsubFirebase()
    if (typeof window !== 'undefined') {
      window.removeEventListener('neurovoice-auth-change', handleCustomChange)
      window.removeEventListener('storage', handleCustomChange)
    }
  }
}
