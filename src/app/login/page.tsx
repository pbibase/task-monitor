"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import GoogleButton from "@/components/GoogleButton";

export default function LoginPage() {
  const { logIn, signInWithGoogle, resetPassword } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setSubmitting(true);
    try {
      await logIn(email, password);
      router.replace("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Log in failed");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogle() {
    setError(null);
    setInfo(null);
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

  async function handleReset() {
    setError(null);
    setInfo(null);
    if (!email) {
      setError("Enter your email above first, then click reset.");
      return;
    }
    try {
      await resetPassword(email);
      setInfo("Password reset email sent.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send reset email");
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white border border-gray-200 rounded-lg p-6 space-y-4"
      >
        <h1 className="text-xl font-semibold">Log in</h1>

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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {info && <p className="text-sm text-green-600">{info}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-gray-900 text-white rounded-md py-2 text-sm font-medium disabled:opacity-50"
        >
          {submitting ? "Logging in…" : "Log in"}
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

        <div className="flex justify-between text-sm">
          <button
            type="button"
            onClick={handleReset}
            className="text-gray-600 underline"
          >
            Forgot password?
          </button>
          <Link href="/signup" className="text-gray-900 underline">
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
}
