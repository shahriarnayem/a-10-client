"use client";
 
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getPromptAnalytics } from "@/lib/promptApi";
 
export default function PromptAnalyticsPage() {
  const { id } = useParams();
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState("");
 
  useEffect(() => {
    getPromptAnalytics(id).then((data) => setAnalytics(data.analytics)).catch((requestError) => setError(requestError.message));
  }, [id]);
 
  if (error) return <div className="rounded-3xl border border-rose-400/20 bg-rose-400/5 p-8"><h1 className="text-2xl font-semibold">Prompt analytics unavailable</h1><p className="mt-3 text-slate-300">{error}</p></div>;
  if (!analytics) return <p className="text-slate-300">Calculating prompt engagement…</p>;
 
  const metrics = [
    ["Prompt views", analytics.views],
    ["Prompt copies", analytics.copies],
    ["Bookmarks", analytics.bookmarks],
    ["Published reviews", analytics.reviews],
    ["Average rating", analytics.averageRating],
    ["Community reports", analytics.reports],
  ];
 
  return (
    <section>
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">Creator analytics</p>
      <h1 className="mt-3 text-3xl font-bold sm:text-4xl">{analytics.title}</h1>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{metrics.map(([label, value]) => <article key={label} className="rounded-3xl border border-white/10 bg-slate-900/60 p-6"><p className="text-sm text-slate-400">{label}</p><p className="mt-3 text-4xl font-bold">{value || 0}</p></article>)}</div>
    </section>
  );
}
