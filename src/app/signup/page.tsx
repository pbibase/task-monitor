"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import GoogleButton from "@/components/GoogleButton";
import type { UserRole } from "@/lib/types";

export default function SignupPage() {
  const { signUp, signInWithGoogle } = useAuth();
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("assignee");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await signUp(email, password, displayName, role);
      router.replace("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogle() {
    setError(null);
    setGoogleSubmitting(true);
    try {
      await signInWithGoogle();
      router.replace("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign-in failed");
    } finally {
      setGoogleSubmitting(false);
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white border border-gray-200 rounded-lg p-6 space-y-4"
      >
        <h1 className="text-xl font-semibold">Create account</h1>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Name</label>
          <input
            required
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Email</label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Password</label>
          <input
            required
            type="password"
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="assignee">Assignee (Worker)</option>
            <option value="manager">Manager (Assigner / Admin)</option>
          </select>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-gray-900 text-white rounded-md py-2 text-sm font-medium disabled:opacity-50"
        >
          {submitting ? "Creating account…" : "Sign up"}
        </button>

        <div className="flex items-center gap-3 text-xs text-gray-400">
          <div className="flex-1 border-t border-gray-200" />
          or
          <div className="flex-1 border-t border-gray-200" />
        </div>

        <GoogleButton
          onClick={handleGoogle}
          disabled={googleSubmitting}
          label={googleSubmitting ? "Signing in…" : "Continue with Google"}
        />

        <p className="text-sm text-gray-600 text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-gray-900 underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
