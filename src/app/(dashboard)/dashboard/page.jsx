"use client";
 
import { useAuth } from "@/context/AuthContext";
 
export default function DashboardPage() {
  const { marketplaceUser } = useAuth();
  const details = [
    ["Marketplace role", marketplaceUser?.role || "user"],
    ["Prompt access", marketplaceUser?.subscription || "free"],
    ["Account status", marketplaceUser?.accountStatus || "active"],
  ];
 
  return (
    <section>
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">Creator workspace</p>
      <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Welcome, {marketplaceUser?.name}</h1>
      <p className="mt-4 max-w-2xl leading-7 text-slate-300">Organize reusable AI instructions, publish original prompts, and monitor marketplace engagement.</p>
      <div className="mt-10 grid gap-5 md:grid-cols-3">{details.map(([label, value]) => <article key={label} className="rounded-3xl border border-white/10 bg-slate-900/60 p-6"><p className="text-sm text-slate-400">{label}</p><p className="mt-3 text-2xl font-semibold capitalize">{value}</p></article>)}</div>
    </section>
  );
}
