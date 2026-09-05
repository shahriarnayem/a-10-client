"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import { firebaseErrorMessage } from "@/lib/firebaseError";

export default function RegisterPage() {
  const router = useRouter();
  const { registerUser } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const imageFile = formData.get("photo");

    if (!imageFile || imageFile.size === 0) {
      toast.error("Please select a profile photo.");
      return;
    }

    setSubmitting(true);

    try {
      // 1. Upload profile image to ImgBB
      const imgFormData = new FormData();
      imgFormData.append("image", imageFile);

      const imgbbRes = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
        {
          method: "POST",
          body: imgFormData,
        }
      );

      const imgData = await imgbbRes.json();

      if (!imgData.success) {
        throw new Error("Failed to upload image. Please try again.");
      }

      const photoURL = imgData.data.display_url;

      // 2. Register user with uploaded image URL
      await registerUser({
        name: formData.get("name").trim(),
        email: formData.get("email").trim(),
        photoURL,
        password: formData.get("password"),
      });

      toast.success("Your AI prompt marketplace account is ready.");
      router.push("/prompts");
    } catch (error) {
      toast.error(firebaseErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass = "mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500 text-slate-800 placeholder-slate-400";
  const fileInputClass = "mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100 cursor-pointer";

  return (
    <main className="bg-slate-50 px-5 py-16">
      <section className="mx-auto max-w-lg rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">Creator community</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-950">Create a marketplace account</h1>
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <label className="block font-medium text-slate-800">
            Name
            <input name="name" required className={inputClass} placeholder="Ariana Promptcraft" />
          </label>
          <label className="block font-medium text-slate-800">
            Email
            <input name="email" type="email" required className={inputClass} placeholder="creator@example.com" />
          </label>
          <label className="block font-medium text-slate-800">
            Profile Photo
            <input name="photo" type="file" accept="image/*" required className={fileInputClass} />
          </label>
          <label className="block font-medium text-slate-800">
            Password
            <input name="password" type="password" required minLength={6} className={inputClass} placeholder="At least six characters" />
          </label>
          <button disabled={submitting} className="w-full rounded-2xl bg-slate-950 px-5 py-3.5 font-semibold text-white disabled:opacity-60 transition-opacity">
            {submitting ? "Creating marketplace account…" : "Create account"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600">
          Already publish AI prompts? <Link href="/login" className="font-semibold text-cyan-700">Sign in</Link>
        </p>
      </section>
    </main>
  );
}