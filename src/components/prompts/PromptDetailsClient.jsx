/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  useCallback,
  useEffect,
  useState,
} from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import SaveToCollectionButton from "@/components/collections/SaveToCollectionButton";
import PromptActions from "@/components/prompts/PromptActions";
import {
  getPromptById,
  getPromptReviews,
} from "@/lib/promptApi";

function formatDate(value) {
  if (!value) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(value));
}

function PromptDetailsContent() {
  const { id } = useParams();

  const [prompt, setPrompt] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");

  const loadReviews = useCallback(async () => {
    const reviewData = await getPromptReviews(id);
    setReviews(reviewData.reviews || []);
  }, [id]);

  useEffect(() => {
    let active = true;

    async function loadPrompt() {
      try {
        const [promptData, reviewData] =
          await Promise.all([
            getPromptById(id),
            getPromptReviews(id),
          ]);

        if (active) {
          setPrompt(promptData.prompt);
          setReviews(reviewData.reviews || []);
        }
      } catch (requestError) {
        if (active) {
          setError(requestError.message);
        }
      }
    }

    loadPrompt();

    return () => {
      active = false;
    };
  }, [id]);

  if (error) {
    return (
      <section className="mx-auto max-w-4xl px-5 py-20">
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-8">
          <h1 className="text-2xl font-bold text-slate-950">
            Prompt details unavailable
          </h1>

          <p className="mt-3 text-rose-700">
            {error}
          </p>

          <Link
            href="/prompts"
            className="mt-6 inline-block rounded-full bg-slate-950 px-5 py-3 font-semibold text-white"
          >
            Explore other prompts
          </Link>
        </div>
      </section>
    );
  }

  if (!prompt) {
    return (
      <p className="py-24 text-center text-slate-600">
        Loading complete AI prompt details…
      </p>
    );
  }

  const visibility =
    prompt.visibility ||
    (prompt.accessLevel === "premium"
      ? "private"
      : "public");

  const creatorProfileLink = prompt.creatorId
    ? `/creators/${prompt.creatorId}`
    : `/creators/${encodeURIComponent(prompt.creatorEmail || "")}`;

  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    prompt.creatorName || "Creator"
  )}&background=0284c7&color=fff`;

  const creatorPhoto =
    prompt.creatorPhotoURL ||
    prompt.photoURL ||
    prompt.creatorPhoto ||
    prompt.creatorImage ||
    prompt.userPhoto ||
    fallbackAvatar;

  return (
    <main className="bg-slate-50">
      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.35fr_0.65fr]">
          <article>
            <img
              src={prompt.imageUrl}
              alt={`${prompt.title} AI prompt`}
              className="h-[300px] w-full rounded-3xl object-cover sm:h-[440px]"
            />

            <div className="mt-8 flex flex-wrap gap-2">
              <span className="rounded-full bg-cyan-100 px-4 py-2 text-sm font-semibold text-cyan-800">
                {prompt.category}
              </span>

              <span className="rounded-full bg-violet-100 px-4 py-2 text-sm font-semibold text-violet-800">
                {prompt.aiModel}
              </span>

              <span className="rounded-full bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">
                {prompt.difficultyLevel ||
                  "Beginner"}
              </span>

              <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold capitalize text-amber-800">
                {visibility}
              </span>
            </div>

            <h1 className="mt-6 text-4xl font-bold leading-tight text-slate-950 sm:text-5xl">
              {prompt.title}
            </h1>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              {prompt.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              {prompt.tags?.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-slate-300 px-3 py-1 text-sm text-slate-600"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <section className="mt-10 rounded-3xl bg-slate-950 p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-2xl font-semibold text-white">
                  Prompt content
                </h2>

                <span className="text-sm text-slate-400">
                  {prompt.copyCount || 0}{" "}
                  marketplace copies
                </span>
              </div>

              {prompt.isLocked ? (
                <div className="relative mt-6 overflow-hidden rounded-2xl border border-violet-400/20 bg-white/5 p-6">
                  <div className="select-none space-y-3 blur-md">
                    <div className="h-4 rounded bg-slate-600" />
                    <div className="h-4 w-11/12 rounded bg-slate-600" />
                    <div className="h-4 w-4/5 rounded bg-slate-600" />
                    <div className="h-4 w-10/12 rounded bg-slate-600" />
                  </div>

                  <div className="absolute inset-0 grid place-items-center bg-slate-950/50 p-6 text-center">
                    <div>
                      <p className="text-xl font-semibold text-white">
                        Premium prompt content
                      </p>

                      <p className="mt-2 text-sm leading-6 text-slate-300">
                        Unlock private prompts with
                        one $5 marketplace payment.
                      </p>

                      <Link
                        href={`/payment?returnTo=${encodeURIComponent(
                          `/prompts/${prompt._id}`,
                        )}`}
                        className="mt-5 inline-block rounded-full bg-violet-400 px-5 py-3 font-semibold text-slate-950"
                      >
                        Unlock Premium
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <pre className="mt-6 whitespace-pre-wrap rounded-2xl border border-white/10 bg-black/30 p-6 font-mono text-sm leading-7 text-cyan-100">
                    {prompt.promptText}
                  </pre>

                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-white">
                      Usage instructions
                    </h3>

                    <p className="mt-3 leading-7 text-slate-300">
                      {prompt.usageInstructions ||
                        "Replace the prompt variables with information relevant to your AI task."}
                    </p>
                  </div>
                </>
              )}
            </section>

            <div className="mt-6 space-y-4">
              <PromptActions
                prompt={prompt}
                onPromptChange={setPrompt}
                onReviewSaved={loadReviews}
              />

              <SaveToCollectionButton
                promptId={prompt._id}
              />
            </div>

            <section className="mt-10">
              <div className="flex items-end justify-between gap-5">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">
                    Community feedback
                  </p>

                  <h2 className="mt-2 text-3xl font-bold text-slate-950">
                    Reviews and ratings
                  </h2>
                </div>

                <div className="text-right">
                  <p className="text-3xl font-bold text-slate-950">
                    {Number(
                      prompt.averageRating || 0,
                    ).toFixed(1)}
                  </p>

                  <p className="text-sm text-slate-500">
                    {prompt.reviewCount ||
                      reviews.length}{" "}
                    reviews
                  </p>
                </div>
              </div>

              {reviews.length === 0 ? (
                <div className="mt-6 rounded-3xl border border-dashed border-slate-300 p-8 text-center text-slate-600">
                  This AI prompt has not received a
                  marketplace review yet.
                </div>
              ) : (
                <div className="mt-6 space-y-4">
                  {reviews.map((review) => (
                    <article
                      key={review._id}
                      className="rounded-3xl border border-slate-200 bg-white p-6"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold text-slate-950">
                            {review.userName ||
                              review.name}
                          </p>

                          <p className="mt-1 text-sm text-slate-500">
                            {review.userEmail ||
                              review.email}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="font-semibold text-amber-600">
                            {review.rating}/5 rating
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {formatDate(
                              review.createdAt,
                            )}
                          </p>
                        </div>
                      </div>

                      <p className="mt-4 leading-7 text-slate-600">
                        {review.comment}
                      </p>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </article>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">
                Prompt creator
              </p>

              <div className="mt-4 flex items-center gap-4">
                <Link
                  href={creatorProfileLink}
                  className="shrink-0 transition-opacity hover:opacity-80"
                >
                  <img
                    src={creatorPhoto}
                    alt={`${prompt.creatorName || "Creator"} creator profile`}
                    className="h-14 w-14 rounded-full border border-slate-200 object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = fallbackAvatar;
                    }}
                  />
                </Link>
                <div>
                  <Link
                    href={creatorProfileLink}
                    className="text-2xl font-bold text-slate-950 transition-colors hover:text-cyan-700"
                  >
                    {prompt.creatorName || "Anonymous Creator"}
                  </Link>
                  <p className="text-sm text-slate-600">
                    {prompt.creatorEmail}
                  </p>
                </div>
              </div>

              <dl className="mt-7 space-y-4 border-t border-slate-200 pt-6">
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">
                    AI tool
                  </dt>

                  <dd className="font-medium text-slate-950">
                    {prompt.aiModel}
                  </dd>
                </div>

                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">
                    Difficulty
                  </dt>

                  <dd className="font-medium text-slate-950">
                    {prompt.difficultyLevel ||
                      "Beginner"}
                  </dd>
                </div>

                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">
                    Views
                  </dt>

                  <dd className="font-medium text-slate-950">
                    {prompt.viewCount || 0}
                  </dd>
                </div>

                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">
                    Copies
                  </dt>

                  <dd className="font-medium text-slate-950">
                    {prompt.copyCount || 0}
                  </dd>
                </div>

                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">
                    Published
                  </dt>

                  <dd className="text-right font-medium text-slate-950">
                    {formatDate(prompt.createdAt)}
                  </dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

export default function PromptDetailsClient() {
  return (
    <ProtectedRoute>
      <PromptDetailsContent />
    </ProtectedRoute>
  );
}