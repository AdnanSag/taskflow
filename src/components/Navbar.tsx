"use client";

import { logoutAction } from "@/app/actions/auth";
import Link from "next/link";
import { useState } from "react";

interface NavbarProps {
  userName?: string | null;
  boardTitle?: string;
}

export default function Navbar({ userName, boardTitle }: NavbarProps) {
  const [loggingOut, setLoggingOut] = useState(false);

  return (
    <nav className="glass-strong sticky top-0 z-50 border-b border-border/50">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & breadcrumb */}
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-xl font-bold bg-gradient-to-r from-accent to-violet bg-clip-text text-transparent hover:opacity-80 transition-opacity"
            >
              TaskFlow
            </Link>
            {boardTitle && (
              <>
                <svg
                  className="w-4 h-4 text-text-muted"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                <span className="text-text-primary font-medium truncate max-w-[200px]">
                  {boardTitle}
                </span>
              </>
            )}
          </div>

          {/* User menu */}
          <div className="flex items-center gap-4">
            {userName && (
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-violet flex items-center justify-center text-sm font-semibold text-white">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm text-text-secondary">{userName}</span>
              </div>
            )}
            <form
              action={async () => {
                setLoggingOut(true);
                await logoutAction();
              }}
            >
              <button
                type="submit"
                disabled={loggingOut}
                className="px-3 py-1.5 text-sm rounded-lg border border-border text-text-secondary hover:text-text-primary hover:border-border-light transition-all duration-200 disabled:opacity-50"
              >
                {loggingOut ? "..." : "Çıkış"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </nav>
  );
}
