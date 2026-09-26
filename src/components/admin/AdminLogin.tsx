"use client";

import { useState } from "react";
import BrandLogo from "@/components/BrandLogo";

export default function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        setError("Invalid password");
        return;
      }

      onLogin();
    } catch {
      setError("Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-[calc(100dvh-65px)] items-center justify-center overflow-hidden bg-[#f7fbfa] px-4 py-12 sm:px-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(var(--color-de-primary-rgb),0.16),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.9),rgba(122,217,202,0.12))]" />

      <div className="relative w-full max-w-[440px] rounded-lg border border-[#dce9e5] bg-white p-6 shadow-[0_24px_70px_rgba(23,53,51,0.12)] sm:p-8">
        <div className="mb-8 flex flex-col items-center text-center">
          <BrandLogo className="mb-5 text-lg" />
          <h1 className="text-2xl font-semibold text-[var(--color-de-ink)]">Admin Portal</h1>
          <p className="mt-2 max-w-xs text-sm leading-6 text-[var(--color-de-muted)]">
            Manage product listings, uploads, shipping, and orders.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-[var(--color-de-ink)]">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 w-full rounded-full border border-[#dce9e5] bg-[#f7fbfa] px-5 text-sm text-[var(--color-de-ink)] outline-none transition focus:border-[var(--color-de-primary)] focus:bg-white focus:shadow-[0_0_0_4px_rgba(var(--color-de-primary-rgb),0.12)]"
              placeholder="Enter admin password"
              required
            />
          </div>

          {error && (
            <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-full bg-[var(--color-de-primary)] px-5 text-sm font-semibold text-white shadow-[0_18px_38px_rgba(var(--color-de-primary-rgb),0.24)] transition hover:bg-[#0a746b] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
