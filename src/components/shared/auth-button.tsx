"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <span className="text-secondary text-sm tracking-wide">...</span>
    );
  }

  if (session?.user) {
    return (
      <div className="flex items-center gap-4">
        <Link
          href="/account"
          className="text-secondary hover:text-primary text-sm tracking-wide"
        >
          {session.user.name ?? "Account"}
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="text-secondary hover:text-primary text-xs tracking-wide"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <Link
      href="/login"
      className="text-secondary hover:text-primary text-sm tracking-wide"
    >
      Sign In
    </Link>
  );
}
