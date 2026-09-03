"use client";
 
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getAllPrompts } from "@/lib/promptApi";
 
export default function FeaturedPrompts() {
  const { user } = useAuth();
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
 
  useEffect(() => {
    let active = true;
 
    async function loadFeaturedPrompts() {
      try {
        const data = await getAllPrompts({
          sort: "popular",
          page: 1,
          limit: 6,
        });
 
        if (active) {
          setPrompts(data.prompts || []);
        }
      } catch (requestError) {
        if (active) {
          setError(requestError.message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }
 
    loadFeaturedPrompts();
 
    return () => {
      active = false;
    };
  }, []);
 
  if (loading) {
    return (
      <p className="mt-10 rounded-3xl bg-slate-100 p-10 text-center text-slate-600">
        Loading popular marketplace prompts…
      </p>
    );
  }
 
  if (error) {
    return (
      <div className="mt-10 rounded-3xl bg-rose-50 p-8 text-rose-700">
        {error}
      </div>
    );
  }
 
  if (prompts.length === 0) {
    return (
      <div className="mt-10 rounded-3xl border border-dashed border-slate-300 p-10 text-center text-slate-600">
        Approved prompts will appear here after marketplace moderation.
      </div>
    );
  }
 
  return (
    <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {prompts.map((prompt) => {
        const detailsPath = `/prompts/${prompt._id}`;
        const detailsHref = user
          ? detailsPath
          : `/login?redirect=${encodeURIComponent(detailsPath)}`;
 
        return (
          <article
            key={prompt._id}
            className="flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
          >
            <img
              src={prompt.imageUrl}
              alt={`${prompt.title} AI prompt`}
              className="h-48 w-full object-cover"
            />
            <div className="flex flex-1 flex-col p-6">
              <div className="flex flex-wrap gap-2 text-xs font-semibold">
                <span className="rounded-full bg-cyan-50 px-3 py-1 text-cyan-700">
                  {prompt.category}
                </span>
                <span className="rounded-full bg-violet-50 px-3 py-1 text-violet-700">
                  {prompt.aiModel}
                </span>
                <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-700">
                  {Number(prompt.averageRating || 0).toFixed(1)} / 5
                </span>
              </div>
 
              <h3 className="mt-5 text-xl font-bold text-slate-950">
                {prompt.title}
              </h3>
              <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                {prompt.description}
              </p>
              <div className="mt-5 flex items-center justify-between text-sm text-slate-500">
                <span>{prompt.creatorName}</span>
                <span>{prompt.copyCount || 0} copies</span>
              </div>
 
              <Link
                href={detailsHref}
                className="mt-auto rounded-xl bg-slate-950 px-5 py-3 text-center font-semibold text-white"
              >
                View prompt details
              </Link>
            </div>
          </article>
        );
      })}
    </div>
  );
}
