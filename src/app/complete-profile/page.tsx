"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { createUserProfile } from "@/lib/users";
import type { UserRole } from "@/lib/types";
import type { User } from "firebase/auth";

export default function CompleteProfilePage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
    } else if (profile) {
      router.replace("/dashboard");
    }
  }, [loading, user, profile, router]);

  if (loading || !user || profile) return null;

  return <CompleteProfileForm user={user} />;
}

function CompleteProfileForm({ user }: { user: User }) {
  const { logOut } = useAuth();
  const router = useRouter();
  const [displayName, setDisplayName] = useState(user.displayName ?? "");
  const [role, setRole] = useState<UserRole>("assignee");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await createUserProfile(user.uid, user.email!, displayName, role);
      router.replace("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save profile");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white border border-gray-200 rounded-lg p-6 space-y-4"
      >
        <h1 className="text-xl font-semibold">One more step</h1>
        <p className="text-sm text-gray-600">
          Confirm your name and pick your role to finish setting up your account.
        </p>

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
          {submitting ? "Saving…" : "Continue"}
        </button>

        <button
          type="button"
          onClick={() => logOut()}
          className="w-full text-xs text-gray-400 underline"
        >
          Cancel and sign out
        </button>
      </form>
    </div>
  );
}
