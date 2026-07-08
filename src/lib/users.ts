import {
  collection,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import type { UserProfile, UserRole } from "./types";

export async function createUserProfile(
  uid: string,
  email: string,
  displayName: string,
  role: UserRole
) {
  await setDoc(doc(db!, "users", uid), {
    uid,
    email,
    displayName,
    role,
    createdAt: serverTimestamp(),
  });
}

export async function listUsers(): Promise<UserProfile[]> {
  const snap = await getDocs(collection(db!, "users"));
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      uid: d.id,
      email: data.email,
      displayName: data.displayName,
      role: data.role,
      createdAt: data.createdAt?.toMillis?.() ?? Date.now(),
    };
  });
}
