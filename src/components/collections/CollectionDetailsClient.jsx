/* eslint-disable @next/next/no-img-element */
"use client";
 
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import {
  getCollection,
  removePromptFromCollection,
} from "@/lib/collectionApi";
 
export default function CollectionDetailsClient() {
  const { id } = useParams();
  const { marketplaceUser } = useAuth();
  const [collection, setCollection] = useState(null);
  const [prompts, setPrompts] = useState([]);
  const [error, setError] = useState("");
 
  useEffect(() => {
    let active = true;
 
    getCollection(id)
      .then((data) => {
        if (!active) return;
        setCollection(data.collection);
        setPrompts(data.prompts || []);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      });
 
    return () => {
      active = false;
    };
  }, [id]);
 
  const isOwner = marketplaceUser?._id === collection?.ownerId;
 
  async function removePrompt(prompt) {
    try {
      const data = await removePromptFromCollection(id, prompt._id);
      setPrompts((current) =>
        current.filter((item) => item._id !== prompt._id),
      );
      setCollection((current) => ({
        ...current,
        promptCount: Math.max(0, (current.promptCount || 1) - 1),
      }));
      toast.success(data.message);
    } catch (requestError) {
      toast.error(requestError.message);
    }
  }
 
  if (error) {
    return <div className="mx-auto max-w-4xl p-10 text-rose-700">{error}</div>;
  }
 
  if (!collection) {
    return <p className="py-24 text-center text-slate-600">Loading collection…</p>;
  }
 
  return (
    <main className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">
        {collection.isPublic ? "Public prompt collection" : "Private prompt collection"}
      </p>
      <h1 className="mt-3 text-4xl font-bold text-slate-950">
        {collection.name}
      </h1>
      <p className="mt-4 max-w-3xl leading-7 text-slate-600">
        {collection.description || "A curated AI prompt collection."}
      </p>
      <p className="mt-3 text-sm text-slate-500">
        Curated by {collection.ownerName} · {collection.promptCount || 0} prompts
      </p>
 
      {prompts.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-dashed border-slate-300 p-10 text-center text-slate-600">
          This collection does not contain any approved prompts yet.
        </div>
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {prompts.map((prompt) => (
            <article
              key={prompt._id}
              className="overflow-hidden rounded-3xl border border-slate-200 bg-white"
            >
              <img
                src={prompt.imageUrl}
                alt={`${prompt.title} prompt cover`}
                className="h-48 w-full object-cover"
              />
              <div className="p-6">
                <p className="text-sm font-semibold text-cyan-700">
                  {prompt.category} · {prompt.aiModel}
                </p>
                <h2 className="mt-3 text-xl font-bold text-slate-950">
                  {prompt.title}
                </h2>
                <div className="mt-6 flex flex-wrap gap-2">
                  <Link
                    href={`/prompts/${prompt._id}`}
                    className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
                  >
                    View prompt
                  </Link>
                  {isOwner && (
                    <button
                      type="button"
                      onClick={() => removePrompt(prompt)}
                      className="rounded-lg bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
