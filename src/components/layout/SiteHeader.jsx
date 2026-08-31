"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

const publicLinks = [
  { href: "/", label: "Home" },
  { href: "/prompts", label: "All Prompts" },
];

const protectedLinks = [
  { href: "/", label: "Home" },
  { href: "/prompts", label: "All Prompts" },
  { href: "/dashboard", label: "Dashboard" },
];

export default function SiteHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { user, loading, logoutUser, marketplaceUser } = useAuth();

  const displayName =
    user?.displayName ||
    marketplaceUser?.name ||
    user?.email?.split("@")[0] ||
    "User";

  const links = user ? protectedLinks : publicLinks;

  function isActiveLink(href) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  async function handleLogout() {
    await logoutUser();
    setOpen(false);
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href="/" className="text-xl font-bold">
            <span className="text-slate-950">Prompt</span>
            <span className="text-cyan-600">Market</span>
          </Link>
        </div>

        {/* Desktop Navigation - MIDDLE */}
        <nav className="hidden lg:flex lg:items-center lg:gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                isActiveLink(link.href)
                  ? "bg-cyan-50 text-cyan-700"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth Buttons - RIGHT */}
        <div className="hidden lg:flex lg:items-center lg:gap-3">
          {loading && (
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-cyan-600" />
          )}

          {!loading && !user && (
            <>
              <Link
                href="/login"
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-slate-950 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Register
              </Link>
            </>
          )}

          {!loading && user && (
            <>
              <span className="max-w-[140px] truncate text-sm text-slate-600">
                {displayName}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full bg-slate-950 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
        >
          {open ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="border-t border-slate-200 bg-white lg:hidden">
          <div className="space-y-1 px-4 py-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`block rounded-lg px-4 py-3 text-sm font-medium ${
                  isActiveLink(link.href)
                    ? "bg-cyan-50 text-cyan-700"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="border-t border-slate-200 px-4 py-3">
            {!user ? (
              <div className="space-y-2">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="block rounded-lg bg-slate-100 px-4 py-3 text-center text-sm font-medium text-slate-700"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className="block rounded-lg bg-slate-950 px-4 py-3 text-center text-sm font-semibold text-white"
                >
                  Register
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="px-4 py-2 text-sm text-slate-500">
                  Signed in as <span className="font-semibold text-slate-700">{displayName}</span>
                </p>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="block w-full rounded-lg bg-slate-950 px-4 py-3 text-center text-sm font-semibold text-white"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}