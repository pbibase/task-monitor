"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
    } else if (!profile) {
      router.replace("/complete-profile");
    } else {
      router.replace("/dashboard");
    }
  }, [user, profile, loading, router]);

  return (
    <div className="flex-1 flex items-center justify-center text-gray-500">
      Loading…
    </div>
  );
}
