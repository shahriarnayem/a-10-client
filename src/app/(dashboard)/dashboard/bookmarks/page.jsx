/* eslint-disable @next/next/no-img-element */
"use client";
 
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getMyBookmarkedPrompts,
  togglePromptBookmark,
} from "@/lib/promptApi";
 
export default function BookmarkedPromptsPage() {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState("");
 
  const loadBookmarks = useCallback(async () => {
    setLoading(true);
    setError("");
 
    try {
      const data = await getMyBookmarkedPrompts();
      setPrompts(data.prompts || []);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, []);
 
  useEffect(() => {
    loadBookmarks();
  }, [loadBookmarks]);
 
  async function handleRemove(promptId) {
    setRemovingId(promptId);
 
    try {
      const data = await togglePromptBookmark(promptId);
      setPrompts((current) =>
        current.filter((prompt) => prompt._id !== promptId),
      );
      toast.success(data.message);
    } catch (requestError) {
      toast.error(requestError.message);
    } finally {
      setRemovingId("");
    }
  }
 
  return (
    <section>
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
        Saved marketplace library
      </p>
      <div className="mt-3 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            Bookmarked prompts
          </h1>
          <p className="mt-4 max-w-2xl leading-7 text-slate-300">
            Return to reusable AI instructions you saved while exploring the
            marketplace.
          </p>
        </div>
        <Link
          href="/prompts"
          className="rounded-full bg-cyan-400 px-5 py-3 text-center font-semibold text-slate-950"
        >
          Explore more prompts
        </Link>
      </div>
 
      {loading && (
        <p className="mt-10 text-slate-300">Loading bookmarked prompts…</p>
      )}
 
      {!loading && error && (
        <div className="mt-10 rounded-3xl border border-rose-400/20 bg-rose-400/5 p-8">
          <p className="text-slate-300">{error}</p>
          <button
            type="button"
            onClick={loadBookmarks}
            className="mt-5 rounded-full bg-rose-300 px-5 py-2.5 font-semibold text-slate-950"
          >
            Reload bookmarks
          </button>
        </div>
      )}
 
      {!loading && !error && prompts.length === 0 && (
        <div className="mt-10 rounded-3xl border border-dashed border-white/15 p-10 text-center">
          <h2 className="text-2xl font-semibold text-white">
            No bookmarked prompts yet
          </h2>
          <p className="mt-3 text-slate-300">
            Save useful prompts from any marketplace detail page.
          </p>
        </div>
      )}
 
      {!loading && !error && prompts.length > 0 && (
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {prompts.map((prompt) => (
            <article
              key={prompt._id}
              className="flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60"
            >
              <img
                src={prompt.imageUrl}
                alt={`${prompt.title} AI prompt`}
                className="h-48 w-full object-cover"
              />
              <div className="flex flex-1 flex-col p-6">
                <div className="flex flex-wrap gap-2 text-xs font-semibold">
                  <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-cyan-300">
                    {prompt.category}
                  </span>
                  <span className="rounded-full bg-violet-400/10 px-3 py-1 text-violet-300">
                    {prompt.aiModel}
                  </span>
                </div>
                <h2 className="mt-4 text-xl font-bold text-white">
                  {prompt.title}
                </h2>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-300">
                  {prompt.description}
                </p>
                <p className="mt-5 text-sm text-slate-400">
                  {prompt.copyCount || 0} copies · {prompt.reviewCount || 0} reviews
                </p>
 
                <div className="mt-auto grid gap-3 pt-6 sm:grid-cols-2">
                  <Link
                    href={`/prompts/${prompt._id}`}
                    className="rounded-xl bg-cyan-400 px-4 py-3 text-center font-semibold text-slate-950"
                  >
                    Open prompt
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleRemove(prompt._id)}
                    disabled={removingId === prompt._id}
                    className="rounded-xl border border-white/15 px-4 py-3 font-semibold text-slate-200 disabled:opacity-50"
                  >
                    {removingId === prompt._id ? "Removing…" : "Remove"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
