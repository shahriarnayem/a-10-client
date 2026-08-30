"use client";
 
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import { firebaseErrorMessage } from "@/lib/firebaseError";
 
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginUser, googleLogin } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const redirect = searchParams.get("redirect") || "/prompts";
 
  async function emailLogin(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setSubmitting(true);
    try {
      await loginUser(formData.get("email").trim(), formData.get("password"));
      toast.success("Welcome back to the AI prompt marketplace.");
      router.push(redirect);
    } catch (error) {
      toast.error(firebaseErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }
 
  async function handleGoogleLogin() {
    setSubmitting(true);
    try {
      await googleLogin();
      toast.success("Google account connected to PromptMarket.");
      router.push(redirect);
    } catch (error) {
      toast.error(firebaseErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }
 
  const inputClass = "mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500";
 
  return (
    <section className="mx-auto max-w-lg rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">Marketplace access</p>
      <h1 className="mt-3 text-3xl font-bold text-slate-950">Sign in to explore complete prompts</h1>
      <form onSubmit={emailLogin} className="mt-8 space-y-5">
        <label className="block font-medium text-slate-800">Email<input name="email" type="email" required className={inputClass} placeholder="creator@example.com" /></label>
        <label className="block font-medium text-slate-800">Password<input name="password" type="password" required className={inputClass} placeholder="Your marketplace password" /></label>
        <button disabled={submitting} className="w-full rounded-2xl bg-slate-950 px-5 py-3.5 font-semibold text-white disabled:opacity-60">{submitting ? "Connecting marketplace session…" : "Sign in"}</button>
      </form>
      <button type="button" onClick={handleGoogleLogin} disabled={submitting} className="mt-4 w-full rounded-2xl border border-slate-300 px-5 py-3.5 font-semibold text-slate-800 disabled:opacity-60">Continue with Google</button>
      <p className="mt-6 text-center text-sm text-slate-600">New to PromptMarket? <Link href="/register" className="font-semibold text-cyan-700">Create an account</Link></p>
    </section>
  );
}
 
export default function LoginPage() {
  return (
    <main className="bg-slate-50 px-5 py-16">
      <Suspense fallback={<p className="text-center text-slate-600">Loading marketplace login…</p>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
