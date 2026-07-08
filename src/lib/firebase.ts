import { getApps, initializeApp, type FirebaseApp, type FirebaseOptions } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId
);

function getFirebaseApp(): FirebaseApp {
  return getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
}

// All consumers (AuthContext, lib/tasks.ts, lib/users.ts) only touch `auth`/`db`
// inside useEffect or event handlers, which never run during Next.js's server
// prerender pass. Deferring initialization to the browser avoids crashing the
// build when NEXT_PUBLIC_FIREBASE_* env vars aren't set yet. `auth`/`db` stay
// null until real config is present (see isFirebaseConfigured) so the app can
// show a setup screen instead of throwing auth/invalid-api-key.
const canInit = typeof window !== "undefined" && isFirebaseConfigured;

export const auth: Auth | null = canInit ? getAuth(getFirebaseApp()) : null;
export const db: Firestore | null = canInit ? getFirestore(getFirebaseApp()) : null;
