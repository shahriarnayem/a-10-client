"use client";
 
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getAuditLog } from "@/lib/auditApi";
 
function formatDate(value) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "medium",
  }).format(new Date(value));
}
 
const methodStyles = {
  POST: "bg-emerald-400/10 text-emerald-300",
  PUT: "bg-blue-400/10 text-blue-300",
  PATCH: "bg-amber-400/10 text-amber-300",
  DELETE: "bg-rose-400/10 text-rose-300",
};
 
export default function AuditLogClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { marketplaceUser, loading: authLoading } = useAuth();
  const page = Number(searchParams.get("page") || 1);
  const resource = searchParams.get("resource") || "";
  const method = searchParams.get("method") || "";
  const appliedSearch = searchParams.get("search") || "";
 
  const [search, setSearch] = useState(appliedSearch);
  const [entries, setEntries] = useState([]);
  const [resources, setResources] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
 
  useEffect(() => {
    if (authLoading || marketplaceUser?.role !== "admin") return;
 
    let active = true;
 
    async function loadAuditLog() {
      setLoading(true);
      setError("");
 
      try {
        const data = await getAuditLog({
          page,
          limit: 20,
          resource,
          method,
          search: appliedSearch,
        });
 
        if (!active) return;
 
        setEntries(data.entries || []);
        setResources(data.resources || []);
        setPagination(data.pagination);
      } catch (requestError) {
        if (active) setError(requestError.message);
      } finally {
        if (active) setLoading(false);
      }
    }
 
    loadAuditLog();
 
    return () => {
      active = false;
    };
  }, [
    appliedSearch,
    authLoading,
    marketplaceUser?.role,
    method,
    page,
    resource,
  ]);
 
  function updateQuery(changes) {
    const query = new URLSearchParams(searchParams.toString());
 
    Object.entries(changes).forEach(([key, value]) => {
      if (value) query.set(key, value);
      else query.delete(key);
    });
 
    router.push(`/dashboard/admin/audit?${query.toString()}`);
  }
 
  function submitSearch(event) {
    event.preventDefault();
    updateQuery({ search: search.trim(), page: "1" });
  }
 
  if (authLoading) {
    return <p className="text-slate-300">Checking administrator access…</p>;
  }
 
  if (marketplaceUser?.role !== "admin") {
    return (
      <div className="rounded-3xl border border-rose-400/20 bg-rose-400/5 p-8">
        <h1 className="text-2xl font-semibold text-white">
          Administrator access required
        </h1>
        <p className="mt-3 text-slate-300">
          Your marketplace role cannot inspect the administrator audit log.
        </p>
      </div>
    );
  }
 
  return (
    <section>
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
        Marketplace governance
      </p>
      <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
        Administrator audit log
      </h1>
      <p className="mt-4 max-w-3xl leading-7 text-slate-300">
        Inspect successful marketplace changes without exposing request bodies or
        authentication and payment secrets.
      </p>
 
      <form
        onSubmit={submitSearch}
        className="mt-9 grid gap-4 rounded-3xl border border-white/10 bg-slate-900/60 p-5 lg:grid-cols-5"
      >
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Actor, route, action, or resource ID"
          className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white lg:col-span-2"
        />
 
        <select
          value={resource}
          onChange={(event) =>
            updateQuery({ resource: event.target.value, page: "1" })
          }
          className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
        >
          <option value="">All resources</option>
          {resources.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
 
        <select
          value={method}
          onChange={(event) =>
            updateQuery({ method: event.target.value, page: "1" })
          }
          className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
        >
          <option value="">All methods</option>
          <option>POST</option>
          <option>PUT</option>
          <option>PATCH</option>
          <option>DELETE</option>
        </select>
 
        <button className="rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950">
          Search activity
        </button>
      </form>
 
      {loading && <p className="mt-10 text-slate-300">Loading audit records…</p>}
 
      {!loading && error && (
        <div className="mt-10 rounded-3xl border border-rose-400/20 bg-rose-400/5 p-8 text-rose-200">
          {error}
        </div>
      )}
 
      {!loading && !error && entries.length === 0 && (
        <div className="mt-10 rounded-3xl border border-dashed border-white/15 p-10 text-center text-slate-300">
          No successful mutations match the selected audit filters.
        </div>
      )}
 
      {!loading && !error && entries.length > 0 && (
        <div className="mt-10 overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left">
              <thead className="border-b border-white/10 text-xs uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-5 py-4">Time</th>
                  <th className="px-5 py-4">Actor</th>
                  <th className="px-5 py-4">Method</th>
                  <th className="px-5 py-4">Resource</th>
                  <th className="px-5 py-4">Path</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {entries.map((entry) => (
                  <tr key={entry._id}>
                    <td className="px-5 py-4 text-sm text-slate-400">
                      {formatDate(entry.createdAt)}
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-white">{entry.actorName}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {entry.actorEmail || entry.actorRole}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          methodStyles[entry.method] || "bg-white/5 text-slate-300"
                        }`}
                      >
                        {entry.method}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-300">
                      {entry.resource}
                      {entry.resourceId && (
                        <p className="mt-1 font-mono text-xs text-slate-500">
                          {entry.resourceId}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-slate-300">
                      {entry.path}
                    </td>
                    <td className="px-5 py-4 text-sm text-emerald-300">
                      {entry.statusCode}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-400">
                      {entry.durationMs} ms
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
 
      {pagination?.totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-4">
          <button
            type="button"
            disabled={!pagination.hasPreviousPage}
            onClick={() => updateQuery({ page: String(page - 1) })}
            className="rounded-full border border-white/15 px-5 py-2.5 text-white disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-sm text-slate-300">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            type="button"
            disabled={!pagination.hasNextPage}
            onClick={() => updateQuery({ page: String(page + 1) })}
            className="rounded-full border border-white/15 px-5 py-2.5 text-white disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}
