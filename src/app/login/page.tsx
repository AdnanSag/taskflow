"use client";

import { useState } from "react";
import { loginAction } from "@/app/actions/auth";
import Link from "next/link";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError("");
    const result = await loginAction(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-accent/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-violet/10 rounded-full blur-[128px]" />
      </div>

      <div className="relative w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-accent to-violet bg-clip-text text-transparent">
            TaskFlow
          </h1>
          <p className="text-text-secondary mt-2">
            Kanban tahtanıza giriş yapın
          </p>
        </div>

        {/* Form Card */}
        <div className="glass-strong rounded-2xl p-8">
          <form action={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-danger/10 border border-danger/30 text-danger rounded-xl px-4 py-3 text-sm animate-fade-in">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-text-secondary mb-2"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-3 rounded-xl bg-bg-tertiary border border-border text-text-primary placeholder-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all duration-200"
                placeholder="ornek@email.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-text-secondary mb-2"
              >
                Şifre
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-4 py-3 rounded-xl bg-bg-tertiary border border-border text-text-primary placeholder-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all duration-200"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-accent to-violet text-white font-semibold hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-bg-primary transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && (
                <svg
                  className="spinner h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              )}
              {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-text-secondary text-sm">
              Hesabınız yok mu?{" "}
              <Link
                href="/register"
                className="text-accent hover:text-accent-light font-medium transition-colors"
              >
                Kayıt Ol
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
