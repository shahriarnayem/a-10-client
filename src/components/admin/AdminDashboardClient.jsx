"use client";
 
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getAdminOverview,
  getAdminPrompts,
  getAdminReports,
  getAdminUsers,
  moderateAdminPrompt,
  resolveAdminReport,
  sendAdminWarning,
  updateAdminUser,
} from "@/lib/adminApi";
 
const roles = ["user", "creator", "admin"];
const subscriptions = ["free", "premium"];
const accountStatuses = ["active", "blocked"];
 
function metricLabel(value) {
  return value.replace(/([A-Z])/g, " $1").replace(/^./, (letter) =>
    letter.toUpperCase(),
  );
}
 
export default function AdminDashboardClient() {
  const [overview, setOverview] = useState(null);
  const [prompts, setPrompts] = useState([]);
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyKey, setBusyKey] = useState("");
  const [rejectionFeedback, setRejectionFeedback] = useState({});
  const [warningMessages, setWarningMessages] = useState({});
  const [resolutionNotes, setResolutionNotes] = useState({});
 
  const loadDashboard = useCallback(async () => {
    setLoading(true);
 
    try {
      const [overviewData, promptData, reportData, userData] =
        await Promise.all([
          getAdminOverview(),
          getAdminPrompts("pending"),
          getAdminReports("open"),
          getAdminUsers(),
        ]);
 
      setOverview(overviewData.overview);
      setPrompts(promptData.prompts || []);
      setReports(reportData.reports || []);
      setUsers(userData.users || []);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, []);
 
  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);
 
  async function handleModeration(promptId, action) {
    const feedback = rejectionFeedback[promptId] || "";
    setBusyKey(`prompt-${promptId}`);
 
    try {
      const data = await moderateAdminPrompt(promptId, action, feedback);
      setPrompts((current) =>
        current.filter((prompt) => prompt._id !== promptId),
      );
      setOverview((current) => ({
        ...current,
        pendingPrompts: Math.max(0, (current?.pendingPrompts || 1) - 1),
      }));
      toast.success(data.message);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBusyKey("");
    }
  }
 
  async function handleUserUpdate(userId, changes) {
    setBusyKey(`user-${userId}`);
 
    try {
      const data = await updateAdminUser(userId, changes);
      setUsers((current) =>
        current.map((user) => (user._id === userId ? data.user : user)),
      );
      toast.success(data.message);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBusyKey("");
    }
  }
 
  async function handleWarning(userId) {
    setBusyKey(`warning-${userId}`);
 
    try {
      const data = await sendAdminWarning(
        userId,
        warningMessages[userId] || "",
      );
      setWarningMessages((current) => ({ ...current, [userId]: "" }));
      toast.success(data.message);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBusyKey("");
    }
  }
 
  async function handleReport(reportId, status) {
    setBusyKey(`report-${reportId}`);
 
    try {
      const data = await resolveAdminReport(
        reportId,
        status,
        resolutionNotes[reportId] || "",
      );
      setReports((current) =>
        current.filter((report) => report._id !== reportId),
      );
      setOverview((current) => ({
        ...current,
        openReports: Math.max(0, (current?.openReports || 1) - 1),
      }));
      toast.success(data.message);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBusyKey("");
    }
  }
 
  if (loading) {
    return <p className="text-slate-300">Loading marketplace administration…</p>;
  }
 
  return (
    <section>
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
        Marketplace administration
      </p>
      <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            Admin dashboard
          </h1>
          <p className="mt-3 max-w-2xl leading-7 text-slate-300">
            Moderate submissions, review reports, manage access, and send user
            warnings.
          </p>
        </div>
        <button
          type="button"
          onClick={loadDashboard}
          className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-slate-200"
        >
          Refresh dashboard
        </button>
      </div>
 
      {overview && (
        <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Object.entries(overview).map(([key, value]) => (
            <article
              key={key}
              className="rounded-3xl border border-white/10 bg-slate-900/60 p-6"
            >
              <p className="text-sm text-slate-400">{metricLabel(key)}</p>
              <p className="mt-3 text-4xl font-bold text-white">{value}</p>
            </article>
          ))}
        </div>
      )}
 
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-white">Pending prompts</h2>
 
        {prompts.length === 0 ? (
          <p className="mt-4 rounded-2xl border border-dashed border-white/15 p-6 text-slate-400">
            No prompt submissions are waiting for moderation.
          </p>
        ) : (
          <div className="mt-5 space-y-4">
            {prompts.map((prompt) => (
              <article
                key={prompt._id}
                className="rounded-3xl border border-white/10 bg-slate-900/60 p-6"
              >
                <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                  <div className="max-w-3xl">
                    <div className="flex flex-wrap gap-2 text-xs font-semibold">
                      <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-cyan-300">
                        {prompt.category}
                      </span>
                      <span className="rounded-full bg-violet-400/10 px-3 py-1 text-violet-300">
                        {prompt.aiModel}
                      </span>
                    </div>
                    <h3 className="mt-4 text-xl font-semibold text-white">
                      {prompt.title}
                    </h3>
                    <p className="mt-3 leading-7 text-slate-300">
                      {prompt.description}
                    </p>
                    <p className="mt-3 text-sm text-slate-400">
                      Creator: {prompt.creatorName} · {prompt.creatorEmail}
                    </p>
                    <Link
                      href={`/prompts/${prompt._id}`}
                      className="mt-4 inline-block text-sm font-semibold text-cyan-300"
                    >
                      Inspect full prompt
                    </Link>
                  </div>
 
                  <div className="w-full xl:max-w-sm">
                    <textarea
                      value={rejectionFeedback[prompt._id] || ""}
                      onChange={(event) =>
                        setRejectionFeedback((current) => ({
                          ...current,
                          [prompt._id]: event.target.value,
                        }))
                      }
                      rows={3}
                      placeholder="Required feedback when rejecting"
                      className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder:text-slate-500"
                    />
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        disabled={busyKey === `prompt-${prompt._id}`}
                        onClick={() => handleModeration(prompt._id, "approve")}
                        className="rounded-xl bg-emerald-400 px-4 py-3 font-semibold text-slate-950 disabled:opacity-50"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        disabled={busyKey === `prompt-${prompt._id}`}
                        onClick={() => handleModeration(prompt._id, "reject")}
                        className="rounded-xl bg-rose-500 px-4 py-3 font-semibold text-white disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
 
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-white">Open reports</h2>
 
        {reports.length === 0 ? (
          <p className="mt-4 rounded-2xl border border-dashed border-white/15 p-6 text-slate-400">
            No community reports are waiting for moderation.
          </p>
        ) : (
          <div className="mt-5 grid gap-5 xl:grid-cols-2">
            {reports.map((report) => (
              <article
                key={report._id}
                className="rounded-3xl border border-rose-400/20 bg-rose-400/5 p-6"
              >
                <p className="text-sm font-semibold text-rose-300">
                  {report.reason}
                </p>
                <h3 className="mt-2 text-xl font-semibold text-white">
                  {report.prompt?.title || report.promptTitle || "Removed prompt"}
                </h3>
                <p className="mt-3 leading-7 text-slate-300">
                  {report.description}
                </p>
                <p className="mt-3 text-sm text-slate-400">
                  Reporter: {report.userName || report.userEmail}
                </p>
 
                <textarea
                  value={resolutionNotes[report._id] || ""}
                  onChange={(event) =>
                    setResolutionNotes((current) => ({
                      ...current,
                      [report._id]: event.target.value,
                    }))
                  }
                  rows={2}
                  placeholder="Moderation resolution note"
                  className="mt-4 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder:text-slate-500"
                />
 
                <div className="mt-3 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => handleReport(report._id, "resolved")}
                    disabled={busyKey === `report-${report._id}`}
                    className="rounded-xl bg-emerald-400 px-4 py-2.5 font-semibold text-slate-950 disabled:opacity-50"
                  >
                    Resolve
                  </button>
                  <button
                    type="button"
                    onClick={() => handleReport(report._id, "dismissed")}
                    disabled={busyKey === `report-${report._id}`}
                    className="rounded-xl border border-white/15 px-4 py-2.5 font-semibold text-slate-200 disabled:opacity-50"
                  >
                    Dismiss
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
 
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-white">Marketplace users</h2>
 
        <div className="mt-5 overflow-x-auto rounded-3xl border border-white/10 bg-slate-900/60">
          <table className="w-full min-w-[1200px] text-left">
            <thead className="border-b border-white/10 text-xs uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-5 py-4">User</th>
                <th className="px-5 py-4">Role</th>
                <th className="px-5 py-4">Subscription</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Send warning</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="px-5 py-5">
                    <p className="font-medium text-white">{user.name}</p>
                    <p className="mt-1 text-sm text-slate-400">{user.email}</p>
                  </td>
                  <td className="px-5 py-5">
                    <select
                      value={user.role || "user"}
                      disabled={busyKey === `user-${user._id}`}
                      onChange={(event) =>
                        handleUserUpdate(user._id, { role: event.target.value })
                      }
                      className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-white"
                    >
                      {roles.map((role) => (
                        <option key={role}>{role}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-5">
                    <select
                      value={user.subscription || "free"}
                      disabled={busyKey === `user-${user._id}`}
                      onChange={(event) =>
                        handleUserUpdate(user._id, {
                          subscription: event.target.value,
                        })
                      }
                      className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-white"
                    >
                      {subscriptions.map((subscription) => (
                        <option key={subscription}>{subscription}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-5">
                    <select
                      value={user.accountStatus || "active"}
                      disabled={busyKey === `user-${user._id}`}
                      onChange={(event) =>
                        handleUserUpdate(user._id, {
                          accountStatus: event.target.value,
                        })
                      }
                      className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-white"
                    >
                      {accountStatuses.map((status) => (
                        <option key={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-5">
                    <div className="flex min-w-[360px] gap-2">
                      <input
                        value={warningMessages[user._id] || ""}
                        onChange={(event) =>
                          setWarningMessages((current) => ({
                            ...current,
                            [user._id]: event.target.value,
                          }))
                        }
                        placeholder="Marketplace warning message"
                        className="min-w-0 flex-1 rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-white placeholder:text-slate-500"
                      />
                      <button
                        type="button"
                        onClick={() => handleWarning(user._id)}
                        disabled={busyKey === `warning-${user._id}`}
                        className="rounded-lg bg-amber-400 px-4 py-2 font-semibold text-slate-950 disabled:opacity-50"
                      >
                        Send
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}
