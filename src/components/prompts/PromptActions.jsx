"use client";
 
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getPromptEngagement,
  recordPromptCopy,
  reportPrompt,
  savePromptReview,
  togglePromptBookmark,
} from "@/lib/promptApi";
 
const reportReasons = [
  "Spam",
  "Copyright Violation",
  "Harmful Content",
  "Misleading Information",
  "Other",
];
 
export default function PromptActions({
  prompt,
  onPromptChange,
  onReviewSaved,
}) {
  const [engagement, setEngagement] = useState({
    bookmarked: false,
    review: null,
    hasOpenReport: false,
    canCopy: false,
  });
  const [rating, setRating] = useState("5");
  const [comment, setComment] = useState("");
  const [reason, setReason] = useState("Spam");
  const [description, setDescription] = useState("");
  const [busyAction, setBusyAction] = useState("");
 
  useEffect(() => {
    let active = true;
 
    getPromptEngagement(prompt._id)
      .then((data) => {
        if (!active) {
          return;
        }
 
        const nextEngagement = data.engagement || {};
        setEngagement(nextEngagement);
 
        if (nextEngagement.review) {
          setRating(String(nextEngagement.review.rating));
          setComment(nextEngagement.review.comment || "");
        }
      })
      .catch((error) => {
        toast.error(error.message);
      });
 
    return () => {
      active = false;
    };
  }, [prompt._id]);
 
  async function handleCopy() {
    if (!prompt.promptText || prompt.isLocked) {
      toast.info("Unlock this private prompt before copying it.");
      return;
    }
 
    setBusyAction("copy");
 
    try {
      await navigator.clipboard.writeText(prompt.promptText);
      const data = await recordPromptCopy(prompt._id);
      onPromptChange({
        ...prompt,
        copyCount: data.copyCount,
      });
      toast.success(data.message);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBusyAction("");
    }
  }
 
  async function handleBookmark() {
    setBusyAction("bookmark");
 
    try {
      const data = await togglePromptBookmark(prompt._id);
      setEngagement((current) => ({
        ...current,
        bookmarked: data.bookmarked,
      }));
      toast.success(data.message);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBusyAction("");
    }
  }
 
  async function handleReview(event) {
    event.preventDefault();
    setBusyAction("review");
 
    try {
      const data = await savePromptReview(prompt._id, {
        rating: Number(rating),
        comment,
      });
      setEngagement((current) => ({
        ...current,
        review: data.review,
      }));
      onPromptChange({
        ...prompt,
        averageRating: data.averageRating,
        reviewCount: data.reviewCount,
      });
      await onReviewSaved?.(data.review);
      toast.success(data.message);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBusyAction("");
    }
  }
 
  async function handleReport(event) {
    event.preventDefault();
    setBusyAction("report");
 
    try {
      const data = await reportPrompt(prompt._id, {
        reason,
        description,
      });
      setEngagement((current) => ({
        ...current,
        hasOpenReport: true,
      }));
      setDescription("");
      toast.success(data.message);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBusyAction("");
    }
  }
 
  return (
    <section className="mt-10 grid gap-6 lg:grid-cols-2">
      <div className="rounded-3xl border border-slate-200 bg-white p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">
          Save and reuse
        </p>
        <h2 className="mt-3 text-2xl font-bold text-slate-950">
          Prompt actions
        </h2>
 
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={handleCopy}
            disabled={busyAction === "copy" || prompt.isLocked}
            className="rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busyAction === "copy" ? "Copying…" : "Copy prompt"}
          </button>
 
          <button
            type="button"
            onClick={handleBookmark}
            disabled={busyAction === "bookmark"}
            className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-800 disabled:opacity-50"
          >
            {busyAction === "bookmark"
              ? "Saving…"
              : engagement.bookmarked
                ? "Remove bookmark"
                : "Bookmark prompt"}
          </button>
        </div>
 
        <p className="mt-4 text-sm leading-6 text-slate-500">
          Copy activity helps creators understand which reusable AI instructions
          are most useful to the community.
        </p>
      </div>
 
      <form
        onSubmit={handleReview}
        className="rounded-3xl border border-slate-200 bg-white p-6"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
          Community rating
        </p>
        <h2 className="mt-3 text-2xl font-bold text-slate-950">
          {engagement.review ? "Update your review" : "Review this prompt"}
        </h2>
 
        <label className="mt-6 block text-sm font-medium text-slate-700">
          Rating
          <select
            value={rating}
            onChange={(event) => setRating(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
          >
            <option value="5">5 — Excellent</option>
            <option value="4">4 — Very useful</option>
            <option value="3">3 — Useful</option>
            <option value="2">2 — Needs work</option>
            <option value="1">1 — Not useful</option>
          </select>
        </label>
 
        <label className="mt-4 block text-sm font-medium text-slate-700">
          Review comment
          <textarea
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            rows={4}
            minLength={10}
            maxLength={600}
            required
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
            placeholder="Explain how the prompt performed in a real AI workflow."
          />
        </label>
 
        <button
          disabled={busyAction === "review"}
          className="mt-4 rounded-xl bg-amber-400 px-5 py-3 font-semibold text-slate-950 disabled:opacity-50"
        >
          {busyAction === "review" ? "Saving review…" : "Save review"}
        </button>
      </form>
 
      <form
        onSubmit={handleReport}
        className="rounded-3xl border border-rose-200 bg-rose-50 p-6 lg:col-span-2"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-700">
          Marketplace safety
        </p>
        <h2 className="mt-3 text-2xl font-bold text-slate-950">
          Report this prompt
        </h2>
 
        {engagement.hasOpenReport ? (
          <p className="mt-4 text-rose-700">
            Your report is waiting for an administrator to review it.
          </p>
        ) : (
          <div className="mt-5 grid gap-4 lg:grid-cols-[0.35fr_0.65fr]">
            <label className="text-sm font-medium text-slate-700">
              Reason
              <select
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                className="mt-2 w-full rounded-xl border border-rose-200 bg-white px-4 py-3"
              >
                {reportReasons.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
 
            <label className="text-sm font-medium text-slate-700">
              Details
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={3}
                minLength={10}
                maxLength={800}
                required
                className="mt-2 w-full rounded-xl border border-rose-200 bg-white px-4 py-3"
                placeholder="Give moderators enough detail to investigate."
              />
            </label>
 
            <button
              disabled={busyAction === "report"}
              className="rounded-xl bg-rose-600 px-5 py-3 font-semibold text-white disabled:opacity-50 lg:col-span-2 lg:justify-self-start"
            >
              {busyAction === "report" ? "Sending report…" : "Send report"}
            </button>
          </div>
        )}
      </form>
    </section>
  );
}
