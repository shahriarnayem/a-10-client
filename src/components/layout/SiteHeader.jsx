"use client";
 
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
 
const publicLinks = [
  { href: "/", label: "Home" },
  { href: "/prompts", label: "All Prompts" },
];
 
export default function SiteHeader() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { user, loading, logoutUser } = useAuth();
 
  async function handleLogout() {
    await logoutUser();
    setOpen(false);
    router.push("/");
  }
 
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <Link href="/" className="text-xl font-bold text-slate-950">Prompt<span className="text-cyan-600">Market</span></Link>
        <nav className="hidden items-center gap-7 md:flex">
          {publicLinks.map((link) => <Link key={link.href} href={link.href} className="text-sm font-medium text-slate-600 hover:text-cyan-700">{link.label}</Link>)}
          {!loading && !user && <><Link href="/login" className="text-sm font-medium text-slate-700">Login</Link><Link href="/register" className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white">Register</Link></>}
          {!loading && user && <><Link href="/dashboard" className="text-sm font-semibold text-cyan-700">Dashboard</Link><span className="max-w-36 truncate text-sm text-slate-500">{user.displayName || user.email}</span><button type="button" onClick={handleLogout} className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white">Logout</button></>}
        </nav>
        <button type="button" onClick={() => setOpen((current) => !current)} className="rounded-xl border border-slate-200 px-4 py-2 text-sm md:hidden">{open ? "Close menu" : "Open menu"}</button>
      </div>
      {open && <nav className="space-y-2 border-t border-slate-200 px-5 py-4 md:hidden">{publicLinks.map((link) => <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="block rounded-xl bg-slate-50 px-4 py-3 text-sm font-medium">{link.label}</Link>)}{!user ? <><Link href="/login" onClick={() => setOpen(false)} className="block rounded-xl bg-slate-50 px-4 py-3 text-sm font-medium">Login</Link><Link href="/register" onClick={() => setOpen(false)} className="block rounded-xl bg-slate-950 px-4 py-3 text-sm font-medium text-white">Register</Link></> : <><Link href="/dashboard" onClick={() => setOpen(false)} className="block rounded-xl bg-cyan-50 px-4 py-3 text-sm font-semibold text-cyan-800">Dashboard</Link><button type="button" onClick={handleLogout} className="w-full rounded-xl bg-slate-950 px-4 py-3 text-left text-sm font-medium text-white">Logout</button></>}</nav>}
    </header>
  );
}
