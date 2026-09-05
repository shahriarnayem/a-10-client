"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  useCallback,
  useEffect,
  useState,
} from "react";
import { toast } from "react-toastify";

import {
  getPromptVersions,
  restorePromptVersion,
} from "@/lib/promptApi";

function formatDate(value) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function PromptVersionHistory() {
  const { id } = useParams();

  const [prompt, setPrompt] = useState(null);
  const [versions, setVersions] = useState([]);
  const [expandedId, setExpandedId] = useState("");
  const [restoringId, setRestoringId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadVersions = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getPromptVersions(id);

      setPrompt(data.prompt);
      setVersions(data.versions || []);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadVersions();
  }, [loadVersions]);

  async function restore(version) {
    const confirmed = window.confirm(
      `Restore version ${version.versionNumber}? Your current prompt will be backed up first.`,
    );

    if (!confirmed) {
      return;
    }

    setRestoringId(version._id);

    try {
      const data = await restorePromptVersion(
        id,
        version._id,
      );

      toast.success(data.message);
      await loadVersions();
    } catch (requestError) {
      toast.error(requestError.message);
    } finally {
      setRestoringId("");
    }
  }

  if (loading) {
    return (
      <p className="text-slate-300">
        Loading prompt history…
      </p>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-rose-400/20 bg-rose-400/5 p-8 text-rose-200">
        {error}
      </div>
    );
  }

  return (
    <section>
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
        Creator safety
      </p>

      <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
        {prompt?.title} version history
      </h1>

      <p className="mt-4 max-w-2xl leading-7 text-slate-300">
        Restore earlier content without losing the
        current version. Creator restores return to
        moderation.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href={`/dashboard/my-prompts/${id}/edit`}
          className="rounded-full bg-cyan-400 px-5 py-2.5 font-semibold text-slate-950"
        >
          Edit current prompt
        </Link>

        <Link
          href="/dashboard/my-prompts"
          className="rounded-full border border-white/15 px-5 py-2.5 text-slate-300"
        >
          Back to My Prompts
        </Link>
      </div>

      {versions.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-dashed border-white/15 p-10 text-center text-slate-300">
          A snapshot will appear here before the next
          prompt update.
        </div>
      ) : (
        <div className="mt-10 space-y-5">
          {versions.map((version) => {
            const expanded =
              expandedId === version._id;

            return (
              <article
                key={version._id}
                className="rounded-3xl border border-white/10 bg-slate-900/60 p-6"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-cyan-300">
                      Version {version.versionNumber}
                    </p>

                    <h2 className="mt-2 text-xl font-semibold text-white">
                      {version.snapshot.title}
                    </h2>

                    <p className="mt-2 text-sm text-slate-400">
                      {formatDate(version.createdAt)} ·{" "}
                      {version.actorName}
                    </p>

                    <p className="mt-2 text-sm text-slate-300">
                      {version.reason}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedId(
                          expanded ? "" : version._id,
                        )
                      }
                      className="rounded-lg bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200"
                    >
                      {expanded
                        ? "Hide snapshot"
                        : "Inspect snapshot"}
                    </button>

                    <button
                      type="button"
                      onClick={() => restore(version)}
                      disabled={
                        restoringId === version._id
                      }
                      className="rounded-lg bg-violet-400 px-4 py-2 text-sm font-semibold text-slate-950 disabled:opacity-50"
                    >
                      {restoringId === version._id
                        ? "Restoring…"
                        : "Restore"}
                    </button>
                  </div>
                </div>

                {expanded && (
                  <div className="mt-6 grid gap-4 border-t border-white/10 pt-6 lg:grid-cols-2">
                    <div className="rounded-2xl bg-slate-950 p-5">
                      <p className="text-sm font-semibold text-slate-300">
                        Description
                      </p>

                      <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-400">
                        {version.snapshot.description}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-950 p-5">
                      <p className="text-sm font-semibold text-slate-300">
                        Metadata
                      </p>

                      <p className="mt-3 text-sm leading-6 text-slate-400">
                        {version.snapshot.category} ·{" "}
                        {version.snapshot.aiModel} ·{" "}
                        {
                          version.snapshot
                            .difficultyLevel
                        }
                      </p>

                      <p className="mt-2 text-sm text-slate-400">
                        {(version.snapshot.tags || []).join(
                          ", ",
                        )}
                      </p>
                    </div>

                    <pre className="overflow-x-auto whitespace-pre-wrap rounded-2xl bg-slate-950 p-5 text-sm leading-6 text-cyan-100 lg:col-span-2">
                      {version.snapshot.promptText}
                    </pre>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}