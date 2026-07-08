"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { createUserProfile } from "@/lib/users";
import type { UserProfile, UserRole } from "@/lib/types";

interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    displayName: string,
    role: UserRole
  ) => Promise<void>;
  logIn: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// AuthProvider is only ever mounted by RootLayout when isFirebaseConfigured is
// true (see layout.tsx), so `auth`/`db` are guaranteed non-null here.

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth!, (firebaseUser) => {
      setUser(firebaseUser);
      if (!firebaseUser) {
        setProfile(null);
        setLoading(false);
      }
    });
    return unsubAuth;
  }, []);

  useEffect(() => {
    if (!user) return;
    const unsubProfile = onSnapshot(doc(db!, "users", user.uid), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setProfile({
          uid: user.uid,
          email: data.email,
          displayName: data.displayName,
          role: data.role,
          createdAt: data.createdAt?.toMillis?.() ?? Date.now(),
        });
      }
      setLoading(false);
    });
    return unsubProfile;
  }, [user]);

  async function signUp(
    email: string,
    password: string,
    displayName: string,
    role: UserRole
  ) {
    const cred = await createUserWithEmailAndPassword(auth!, email, password);
    await updateProfile(cred.user, { displayName });
    await createUserProfile(cred.user.uid, email, displayName, role);
  }

  async function logIn(email: string, password: string) {
    await signInWithEmailAndPassword(auth!, email, password);
  }

  async function logOut() {
    await signOut(auth!);
  }

  async function resetPassword(email: string) {
    await sendPasswordResetEmail(auth!, email);
  }

  return (
    <AuthContext.Provider
      value={{ user, profile, loading, signUp, logIn, logOut, resetPassword }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
