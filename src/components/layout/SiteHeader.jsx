"use client";
 
import Link from "next/link";
import { useState } from "react";
 
const links = [
  { href: "/", label: "Home" },
  { href: "/prompts", label: "All Prompts" },
];
 
export default function SiteHeader() {
  const [open, setOpen] = useState(false);
 
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <Link href="/" className="text-xl font-bold text-slate-950">
          Prompt<span className="text-cyan-600">Market</span>
        </Link>
 
        <nav className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-slate-600 hover:text-cyan-700">
              {link.label}
            </Link>
          ))}
          <Link href="/login" className="text-sm font-medium text-slate-700">Login</Link>
          <Link href="/register" className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white">Register</Link>
        </nav>
 
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="rounded-xl border border-slate-200 px-4 py-2 text-sm md:hidden"
          aria-expanded={open}
        >
          {open ? "Close menu" : "Open menu"}
        </button>
      </div>
 
      {open && (
        <nav className="space-y-2 border-t border-slate-200 px-5 py-4 md:hidden">
          {[...links, { href: "/login", label: "Login" }, { href: "/register", label: "Register" }].map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="block rounded-xl bg-slate-50 px-4 py-3 text-sm font-medium">
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
