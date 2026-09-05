
"use client";

import Link from "next/link";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useEffect, useState } from "react";
import { getFollowingFeed } from "@/lib/followApi";

export default function FollowingFeedClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const requestedPage = Number(
    searchParams.get("page") || 1,
  );

  const page =
    Number.isFinite(requestedPage) &&
    requestedPage > 0
      ? requestedPage
      : 1;

  const [prompts, setPrompts] =
    useState([]);
  const [pagination, setPagination] =
    useState(null);
  const [loading, setLoading] =
    useState(true);
  const [error, setError] =
    useState("");

  useEffect(() => {
    let active = true;

    async function loadFeed() {
      setLoading(true);
      setError("");

      try {
        const data =
          await getFollowingFeed(page);

        if (!active) {
          return;
        }

        setPrompts(data.prompts || []);
        setPagination(
          data.pagination || null,
        );
      } catch (requestError) {
        if (active) {
          setError(
            requestError.message ||
              "Unable to load your following feed.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadFeed();

    return () => {
      active = false;
    };
  }, [page]);

  function changePage(nextPage) {
    router.push(
      `/dashboard/feed?page=${nextPage}`,
    );
  }

  return (
    <section>
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
        Personalized discovery
      </p>

      <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
        Following feed
      </h1>

      <p className="mt-4 max-w-2xl leading-7 text-slate-300">
        See the newest approved prompts
        from creators you follow.
      </p>

      {loading && (
        <p className="mt-10 text-slate-300">
          Loading your feed…
        </p>
      )}

      {!loading && error && (
        <div className="mt-10 rounded-3xl border border-rose-400/20 bg-rose-400/5 p-8 text-rose-200">
          {error}
        </div>
      )}

      {!loading &&
        !error &&
        prompts.length === 0 && (
          <div className="mt-10 rounded-3xl border border-dashed border-white/15 p-10 text-center">
            <h2 className="text-2xl font-semibold text-white">
              Your feed is ready
            </h2>

            <p className="mt-3 text-slate-300">
              Follow creators from their
              public profiles to see new
              prompts here.
            </p>

            <Link
              href="/prompts"
              className="mt-6 inline-block rounded-full bg-cyan-400 px-5 py-3 font-semibold text-slate-950"
            >
              Explore creators and prompts
            </Link>
          </div>
        )}

      {!loading &&
        !error &&
        prompts.length > 0 && (
          <div className="mt-10 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {prompts.map((prompt) => (
              <article
                key={prompt._id}
                className="flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60"
              >
                <img
                  src={
                    prompt.imageUrl ||
                    "https://placehold.co/1200x800?text=AI+Prompt"
                  }
                  alt={`${prompt.title} prompt cover`}
                  className="h-48 w-full object-cover"
                />

                <div className="flex flex-1 flex-col p-6">
                  <Link
                    href={`/creators/${prompt.creatorId}`}
                    className="text-sm font-semibold text-cyan-300"
                  >
                    {prompt.creatorName}
                  </Link>

                  <h2 className="mt-3 text-xl font-bold text-white">
                    {prompt.title}
                  </h2>

                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-300">
                    {prompt.description}
                  </p>

                  <Link
                    href={`/prompts/${prompt._id}`}
                    className="mt-6 rounded-xl bg-cyan-400 px-5 py-3 text-center font-semibold text-slate-950"
                  >
                    View prompt
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

      {pagination?.totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-4">
          <button
            type="button"
            disabled={
              !pagination.hasPreviousPage
            }
            onClick={() =>
              changePage(page - 1)
            }
            className="rounded-full border border-white/15 px-5 py-2.5 text-white disabled:opacity-40"
          >
            Previous
          </button>

          <span className="text-sm text-slate-300">
            Page {pagination.page} of{" "}
            {pagination.totalPages}
          </span>

          <button
            type="button"
            disabled={
              !pagination.hasNextPage
            }
            onClick={() =>
              changePage(page + 1)
            }
            className="rounded-full border border-white/15 px-5 py-2.5 text-white disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}