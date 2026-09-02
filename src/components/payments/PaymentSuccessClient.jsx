"use client";
 
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { getPremiumCheckout } from "@/lib/paymentApi";
 
function safeReturnPath(value) {
  return value?.startsWith("/") ? value : "/prompts";
}
 
function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const { refreshMarketplaceSession } = useAuth();
  const sessionId = searchParams.get("session_id");
  const fallbackReturnTo = safeReturnPath(searchParams.get("returnTo"));
  const [checkout, setCheckout] = useState(null);
  const [error, setError] = useState("");
 
  useEffect(() => {
    let active = true;
 
    async function verifyPayment() {
      if (!sessionId) {
        setError("The Stripe Checkout Session ID is missing.");
        return;
      }
 
      try {
        const data = await getPremiumCheckout(sessionId);
 
        if (data.checkout.paymentStatus !== "paid") {
          throw new Error("Stripe has not marked this checkout as paid.");
        }
 
        await refreshMarketplaceSession();
 
        if (active) {
          setCheckout(data.checkout);
        }
      } catch (requestError) {
        if (active) {
          setError(requestError.message);
        }
      }
    }
 
    verifyPayment();
 
    return () => {
      active = false;
    };
  }, [refreshMarketplaceSession, sessionId]);
 
  if (error) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-20">
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-8">
          <h1 className="text-3xl font-bold text-slate-950">
            Payment verification unavailable
          </h1>
          <p className="mt-4 text-rose-700">{error}</p>
          <Link
            href="/payment"
            className="mt-6 inline-block rounded-full bg-slate-950 px-5 py-3 font-semibold text-white"
          >
            Return to premium access
          </Link>
        </div>
      </main>
    );
  }
 
  if (!checkout) {
    return (
      <p className="py-24 text-center text-slate-600">
        Verifying your Stripe payment and unlocking private prompts…
      </p>
    );
  }
 
  const returnTo = safeReturnPath(checkout.returnTo || fallbackReturnTo);
 
  return (
    <main className="bg-emerald-50 px-5 py-20">
      <section className="mx-auto max-w-3xl rounded-[2rem] border border-emerald-200 bg-white p-8 text-center shadow-sm sm:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">
          Payment complete
        </p>
        <h1 className="mt-4 text-4xl font-bold text-slate-950">
          Premium access is active
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-slate-600">
          Stripe confirmed your ${checkout.amount.toFixed(2)} payment. Private
          prompt content and creator instructions are now unlocked.
        </p>
        <Link
          href={returnTo}
          className="mt-8 inline-block rounded-full bg-emerald-600 px-6 py-3 font-semibold text-white"
        >
          Continue to marketplace content
        </Link>
      </section>
    </main>
  );
}
 
export default function PaymentSuccessClient() {
  return (
    <ProtectedRoute>
      <PaymentSuccessContent />
    </ProtectedRoute>
  );
}
