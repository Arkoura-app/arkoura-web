import { initializeApp, getApps, getApp } from 'firebase/app'
import type { FirebaseApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import type { Auth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Guard: only initialize Firebase when API key is present.
// During Next.js static generation at build time,
// NEXT_PUBLIC_* vars are not available — this prevents
// Firebase from throwing auth/invalid-api-key.
function getFirebaseApp(): FirebaseApp | null {
  if (!firebaseConfig.apiKey) return null
  return getApps().length === 0
    ? initializeApp(firebaseConfig)
    : getApp()
}

function getFirebaseAuth(): Auth | null {
  const app = getFirebaseApp()
  if (!app) return null
  return getAuth(app)
}

export const app = getFirebaseApp()
export const auth = getFirebaseAuth()
export default app
