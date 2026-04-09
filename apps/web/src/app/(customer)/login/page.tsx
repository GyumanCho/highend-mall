"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

const DEMO_ACCOUNTS = [
  { email: "soyeon@example.com", name: "Soyeon Kim", tier: "GOLD", role: "Customer" },
  { email: "minjae@example.com", name: "Minjae Lee", tier: "PLATINUM", role: "Customer" },
  { email: "admin@maison.com", name: "Admin", tier: "—", role: "Admin" },
] as const;

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(loginEmail: string) {
    setLoading(true);
    await signIn("credentials", { email: loginEmail, callbackUrl: "/" });
  }

  return (
    <div className="max-w-md mx-auto px-6 py-24">
      <div className="text-center mb-12">
        <h1 className="font-serif text-4xl mb-4">Welcome</h1>
        <p className="text-secondary text-sm">
          Sign in to access your personalized experience
        </p>
      </div>

      {/* Email login */}
      <div className="space-y-4 mb-12">
        <div>
          <label className="block text-xs tracking-widest uppercase text-secondary mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full border border-muted px-4 py-3 text-sm bg-transparent focus:border-primary focus:outline-none transition-colors"
          />
        </div>
        <button
          onClick={() => handleLogin(email)}
          disabled={loading || !email}
          className="w-full bg-primary text-white py-4 text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4 mb-12">
        <div className="flex-1 border-t border-muted" />
        <span className="text-xs text-secondary">or continue with</span>
        <div className="flex-1 border-t border-muted" />
      </div>

      {/* Social login placeholders */}
      <div className="space-y-3 mb-12">
        <button
          disabled
          className="w-full border border-muted py-3 text-sm text-secondary flex items-center justify-center gap-2 opacity-50 cursor-not-allowed"
        >
          Google (Coming Soon)
        </button>
        <button
          disabled
          className="w-full border border-muted py-3 text-sm text-secondary flex items-center justify-center gap-2 opacity-50 cursor-not-allowed"
        >
          Kakao (Coming Soon)
        </button>
      </div>

      {/* Demo accounts */}
      <div className="bg-surface p-6">
        <p className="text-xs tracking-widest uppercase text-secondary mb-4">
          Demo Accounts
        </p>
        <div className="space-y-2">
          {DEMO_ACCOUNTS.map((account) => (
            <button
              key={account.email}
              onClick={() => handleLogin(account.email)}
              disabled={loading}
              className="w-full text-left py-3 px-4 border border-muted hover:border-primary transition-colors text-sm disabled:opacity-50"
            >
              <span className="font-medium">{account.name}</span>
              <span className="text-secondary ml-2">
                {account.tier} · {account.role}
              </span>
            </button>
          ))}
        </div>
      </div>

      <p className="text-center mt-8">
        <Link
          href="/"
          className="text-xs text-secondary hover:text-primary underline underline-offset-4"
        >
          Continue as Guest
        </Link>
      </p>
    </div>
  );
}
