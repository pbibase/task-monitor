"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import clsx from "clsx";

export default function Navbar() {
  const { profile, logOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const links = [
    { href: "/dashboard", label: "Tasks" },
    { href: "/dashboard/kanban", label: "Kanban" },
  ];

  async function handleLogout() {
    await logOut();
    router.replace("/login");
  }

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 flex items-center h-14 gap-6">
        <span className="font-semibold text-lg">TaskFlow</span>
        <div className="flex gap-4">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={clsx(
                "text-sm px-2 py-1 rounded-md",
                pathname === l.href
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              {l.label}
            </Link>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-3 text-sm text-gray-600">
          {profile && (
            <span>
              {profile.displayName}{" "}
              <span className="text-xs uppercase tracking-wide text-gray-400">
                ({profile.role})
              </span>
            </span>
          )}
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-50"
          >
            Log out
          </button>
        </div>
      </div>
    </nav>
  );
}
