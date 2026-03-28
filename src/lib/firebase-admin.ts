import { type App, cert, getApps, initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

let app: App

function getAdminApp(): App {
  if (getApps().length === 0) {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY
    if (!privateKey) {
      throw new Error('FIREBASE_PRIVATE_KEY is not set')
    }
    app = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID!,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
        privateKey: privateKey.replace(/\\n/g, '\n'),
      }),
    })
  } else {
    app = getApps()[0]!
  }
  return app
}

export function getAdminDb() {
  return getFirestore(getAdminApp())
}
