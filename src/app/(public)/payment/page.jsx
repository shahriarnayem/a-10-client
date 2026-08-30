"use client";
 
import Link from "next/link";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
 
export default function PaymentPage() {
  const benefits = ["Access all private prompt content", "Copy premium prompts", "Publish ratings and reviews", "Use creator-provided instructions"];
 
  return (
    <ProtectedRoute>
      <main className="bg-slate-950 px-5 py-20 text-white">
        <section className="mx-auto max-w-4xl rounded-[2rem] border border-violet-400/20 bg-violet-400/5 p-7 sm:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-300">Premium marketplace access</p>
          <h1 className="mt-4 text-4xl font-bold sm:text-5xl">Unlock every private AI prompt</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">Make one secure $5 payment and access premium prompt content, usage instructions, copying, ratings, and reviews.</p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">{benefits.map((benefit) => <div key={benefit} className="rounded-2xl border border-white/10 bg-white/5 p-5 text-slate-200">{benefit}</div>)}</div>
          <div className="mt-10 flex flex-col gap-5 rounded-3xl bg-white p-6 text-slate-950 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-medium text-slate-500">One-time premium payment</p><p className="mt-1 text-4xl font-bold">$5</p></div><Link href="/prompts" className="rounded-full bg-slate-950 px-6 py-3 text-center font-semibold text-white">Continue exploring prompts</Link></div>
        </section>
      </main>
    </ProtectedRoute>
  );
}
