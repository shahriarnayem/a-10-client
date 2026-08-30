"use client";
 
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
 
const navigation = [
  { href: "/dashboard", label: "Workspace overview" },
  { href: "/dashboard/add-prompt", label: "Add AI prompt" },
  { href: "/dashboard/my-prompts", label: "My prompts" },
  { href: "/prompts", label: "Explore prompts" },
];
 
export default function DashboardShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const { marketplaceUser, logoutUser } = useAuth();
 
  async function handleLogout() {
    await logoutUser();
    router.push("/");
  }
 
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-white/10 px-5 py-4 lg:hidden">
        <div className="flex items-center justify-between">
          <Link href="/" className="font-semibold">Prompt<span className="text-cyan-400">Market</span></Link>
          <button type="button" onClick={() => setMenuOpen((current) => !current)} className="rounded-xl border border-white/10 px-4 py-2 text-sm">{menuOpen ? "Close workspace" : "Open workspace"}</button>
        </div>
        {menuOpen && <nav className="mt-4 space-y-2 border-t border-white/10 pt-4">{navigation.map((item) => <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className="block rounded-xl bg-white/5 px-4 py-3 text-sm">{item.label}</Link>)}</nav>}
      </header>
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="hidden w-72 shrink-0 border-r border-white/10 bg-slate-900/40 p-6 lg:flex lg:flex-col">
          <Link href="/" className="text-xl font-bold">Prompt<span className="text-cyan-400">Market</span></Link>
          <div className="mt-8 rounded-2xl border border-cyan-400/15 bg-cyan-400/5 p-4"><p className="font-medium">{marketplaceUser?.name}</p><p className="mt-1 text-sm text-slate-400">{marketplaceUser?.email}</p><div className="mt-3 flex gap-2"><span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs uppercase text-cyan-300">{marketplaceUser?.role}</span><span className="rounded-full bg-violet-400/10 px-3 py-1 text-xs uppercase text-violet-300">{marketplaceUser?.subscription || "free"}</span></div></div>
          <nav className="mt-8 space-y-2">{navigation.map((item) => { const active = item.href === "/dashboard" ? pathname === item.href : pathname.startsWith(item.href); return <Link key={item.href} href={item.href} className={`block rounded-xl px-4 py-3 text-sm font-medium ${active ? "bg-cyan-400 text-slate-950" : "text-slate-300 hover:bg-white/5"}`}>{item.label}</Link>; })}</nav>
          <button type="button" onClick={handleLogout} className="mt-auto rounded-xl border border-white/10 px-4 py-3 text-left text-sm text-slate-300">Sign out of marketplace</button>
        </aside>
        <main className="min-w-0 flex-1 px-5 py-8 sm:px-8 lg:px-12">{children}</main>
      </div>
    </div>
  );
}
