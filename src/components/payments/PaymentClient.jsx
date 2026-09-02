"use client";
 
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { createPremiumCheckout } from "@/lib/paymentApi";
 
const benefits = [
  "Access all private AI prompt content",
  "Copy premium prompts into real workflows",
  "Use complete creator instructions",
  "Keep permanent marketplace premium access",
];
 
function safeReturnPath(value) {
  return value?.startsWith("/") ? value : "/prompts";
}
 
function PaymentContent() {
  const searchParams = useSearchParams();
  const { marketplaceUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const returnTo = safeReturnPath(searchParams.get("returnTo"));
  const cancelled = searchParams.get("cancelled") === "1";
  const premium =
    marketplaceUser?.subscription === "premium" ||
    marketplaceUser?.subscriptionStatus === "active";
 
  async function handleCheckout() {
    setLoading(true);
 
    try {
      const data = await createPremiumCheckout(returnTo);
 
      if (!data.url) {
        throw new Error("Stripe did not return a checkout destination.");
      }
 
      window.location.assign(data.url);
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  }
 
  return (
    <main className="bg-slate-950 px-5 py-20 text-white">
      <section className="mx-auto max-w-4xl">
        <div className="rounded-[2rem] border border-violet-400/20 bg-violet-400/5 p-7 sm:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-300">
            Premium marketplace access
          </p>
          <h1 className="mt-4 text-4xl font-bold sm:text-5xl">
            Unlock every private AI prompt
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            Make one secure $5 payment through Stripe and keep premium access
            for this marketplace account.
          </p>
 
          {cancelled && (
            <div className="mt-6 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-amber-200">
              Checkout was cancelled. No payment was recorded.
            </div>
          )}
 
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {benefits.map((benefit) => (
              <div
                key={benefit}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 text-slate-200"
              >
                {benefit}
              </div>
            ))}
          </div>
 
          <div className="mt-10 flex flex-col gap-5 rounded-3xl bg-white p-6 text-slate-950 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                One-time premium payment
              </p>
              <p className="mt-1 text-4xl font-bold">$5</p>
            </div>
 
            {premium ? (
              <Link
                href={returnTo}
                className="rounded-full bg-emerald-500 px-6 py-3 text-center font-semibold text-white"
              >
                Premium active — continue
              </Link>
            ) : (
              <button
                type="button"
                onClick={handleCheckout}
                disabled={loading}
                className="rounded-full bg-slate-950 px-6 py-3 font-semibold text-white disabled:opacity-50"
              >
                {loading ? "Opening secure checkout…" : "Pay $5 with Stripe"}
              </button>
            )}
          </div>
 
          <p className="mt-5 text-center text-sm text-slate-400">
            Card details are collected by Stripe Checkout, not by PromptMarket.
          </p>
        </div>
      </section>
    </main>
  );
}
 
export default function PaymentClient() {
  return (
    <ProtectedRoute>
      <PaymentContent />
    </ProtectedRoute>
  );
}