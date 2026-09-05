"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useState,
} from "react";
import { toast } from "react-toastify";

import {
  deletePrompt,
  getMyPrompts,
} from "@/lib/promptApi";

const statusStyles = {
  approved: "bg-emerald-400/10 text-emerald-300",
  pending: "bg-amber-400/10 text-amber-300",
  rejected: "bg-rose-400/10 text-rose-300",
};

export default function MyPromptsPage() {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");

  const loadPrompts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getMyPrompts();

      setPrompts(data.prompts || []);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPrompts();
  }, [loadPrompts]);

  async function handleDelete(prompt) {
    const confirmed = window.confirm(
      `Remove "${prompt.title}" and its related marketplace activity?`,
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(prompt._id);

    try {
      const data = await deletePrompt(prompt._id);

      setPrompts((current) =>
        current.filter(
          (item) => item._id !== prompt._id,
        ),
      );

      toast.success(data.message);
    } catch (requestError) {
      toast.error(requestError.message);
    } finally {
      setDeletingId("");
    }
  }

  return (
    <section>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
            Creator library
          </p>

          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
            My AI prompts
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-slate-300">
            Update submissions, remove prompts, and
            inspect marketplace engagement.
          </p>
        </div>

        <Link
          href="/dashboard/add-prompt"
          className="rounded-full bg-cyan-400 px-5 py-3 text-center font-semibold text-slate-950"
        >
          Add another prompt
        </Link>
      </div>

      {loading && (
        <p className="mt-10 text-slate-300">
          Loading your marketplace prompts…
        </p>
      )}

      {!loading && error && (
        <div className="mt-10 rounded-3xl border border-rose-400/20 bg-rose-400/5 p-8">
          <p>{error}</p>

          <button
            type="button"
            onClick={loadPrompts}
            className="mt-5 rounded-full bg-rose-300 px-5 py-2.5 font-semibold text-slate-950"
          >
            Reload prompt library
          </button>
        </div>
      )}

      {!loading && !error && !prompts.length && (
        <div className="mt-10 rounded-3xl border border-dashed border-white/15 p-10 text-center">
          <h2 className="text-2xl font-semibold">
            Publish your first AI prompt
          </h2>

          <p className="mt-3 text-slate-300">
            Your submitted marketplace prompts will
            appear here.
          </p>
        </div>
      )}

      {!loading && !error && prompts.length > 0 && (
        <div className="mt-10 overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left">
              <thead className="border-b border-white/10 text-xs uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-6 py-4">Prompt</th>
                  <th className="px-6 py-4">AI tool</th>
                  <th className="px-6 py-4">
                    Visibility
                  </th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Copies</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/10">
                {prompts.map((prompt) => (
                  <tr key={prompt._id}>
                    <td className="px-6 py-5">
                      <p className="font-medium">
                        {prompt.title}
                      </p>

                      <p className="mt-1 text-sm text-slate-400">
                        {prompt.category} ·{" "}
                        {prompt.difficultyLevel ||
                          "Beginner"}
                      </p>
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-300">
                      {prompt.aiModel}
                    </td>

                    <td className="px-6 py-5 text-sm capitalize text-slate-300">
                      {prompt.visibility || "public"}
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                          statusStyles[prompt.status] ||
                          "bg-slate-400/10 text-slate-300"
                        }`}
                      >
                        {prompt.status}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-300">
                      {prompt.copyCount || 0}
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/dashboard/my-prompts/${prompt._id}/edit`}
                          className="rounded-lg bg-cyan-400/10 px-3 py-2 text-xs font-semibold text-cyan-300"
                        >
                          Update
                        </Link>

                        <Link
                          href={`/dashboard/my-prompts/${prompt._id}/analytics`}
                          className="rounded-lg bg-violet-400/10 px-3 py-2 text-xs font-semibold text-violet-300"
                        >
                          Analytics
                        </Link>

                        <Link
                          href={`/dashboard/my-prompts/${prompt._id}/versions`}
                          className="rounded-lg bg-amber-400/10 px-3 py-2 text-xs font-semibold text-amber-300"
                        >
                          History
                        </Link>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(prompt)
                          }
                          disabled={
                            deletingId === prompt._id
                          }
                          className="rounded-lg bg-rose-400/10 px-3 py-2 text-xs font-semibold text-rose-300 disabled:opacity-50"
                        >
                          {deletingId === prompt._id
                            ? "Removing…"
                            : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}