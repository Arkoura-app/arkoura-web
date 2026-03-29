import { initializeApp, getApps, getApp } from 'firebase/app'
import type { FirebaseApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import type { Auth } from 'firebase/auth'

// Firebase public config — these values are intentionally
// public client identifiers, not secrets.
// Protected by Firebase security rules + authorized domains.
// See: firebase.google.com/docs/projects/api-keys
const firebaseConfig = {
  apiKey: 'AIzaSyD_gtdqgCmYbxJYzWgRZA8LJZgxKnv4RD4',
  authDomain: 'arkoura-dev.firebaseapp.com',
  projectId: 'arkoura-dev',
  storageBucket: 'arkoura-dev.appspot.com',
  messagingSenderId: '843849501519',
  appId: '1:843849501519:web:d096ae61cbe9bbfc59933a',
}

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
