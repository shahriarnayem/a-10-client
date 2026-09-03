"use client";
 
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import {
  getCreatorProfile,
  updateMyCreatorProfile,
} from "@/lib/creatorApi";
 
const emptyForm = {
  bio: "",
  website: "",
  location: "",
  specialties: "",
};
 
export default function CreatorProfileClient() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { marketplaceUser, refreshMarketplaceSession } = useAuth();
  const page = Number(searchParams.get("page") || 1);
 
  const [creator, setCreator] = useState(null);
  const [prompts, setPrompts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
 
  const isOwner = marketplaceUser?._id === id;
 
  useEffect(() => {
    let active = true;
 
    async function loadCreator() {
      setLoading(true);
      setError("");
 
      try {
        const data = await getCreatorProfile(id, page);
 
        if (!active) return;
 
        setCreator(data.creator);
        setPrompts(data.prompts || []);
        setPagination(data.pagination);
        setForm({
          bio: data.creator.bio || "",
          website: data.creator.website || "",
          location: data.creator.location || "",
          specialties: (data.creator.specialties || []).join(", "),
        });
      } catch (requestError) {
        if (active) setError(requestError.message);
      } finally {
        if (active) setLoading(false);
      }
    }
 
    loadCreator();
 
    return () => {
      active = false;
    };
  }, [id, page]);
 
  function changePage(nextPage) {
    router.push(`/creators/${id}?page=${nextPage}`);
  }
 
  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }
 
  async function saveProfile(event) {
    event.preventDefault();
    setSaving(true);
 
    try {
      const data = await updateMyCreatorProfile({
        ...form,
        specialties: form.specialties
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      });
 
      setCreator((current) => ({ ...current, ...data.creator }));
      await refreshMarketplaceSession();
      setEditing(false);
      toast.success(data.message);
    } catch (requestError) {
      toast.error(requestError.message);
    } finally {
      setSaving(false);
    }
  }
 
  if (loading) {
    return <p className="py-24 text-center text-slate-600">Loading creator profile…</p>;
  }
 
  if (error || !creator) {
    return (
      <main className="mx-auto max-w-4xl px-5 py-20">
        <div className="rounded-3xl bg-rose-50 p-8 text-rose-700">
          {error || "This creator is unavailable."}
        </div>
      </main>
    );
  }
 
  const metrics = [
    ["Approved prompts", creator.promptCount || 0],
    ["Followers", creator.followerCount || 0],
    ["Prompt views", creator.totalViews || 0],
    ["Prompt copies", creator.totalCopies || 0],
  ];
 
  return (
    <main className="bg-slate-50">
      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="rounded-[2rem] bg-slate-950 p-7 text-white sm:p-10">
          <div className="flex flex-col gap-7 md:flex-row md:items-center">
            <img
              src={creator.photoURL || "https://placehold.co/240x240?text=Creator"}
              alt={`${creator.name} creator profile`}
              className="h-28 w-28 rounded-3xl object-cover"
            />
 
            <div className="flex-1">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">
                Marketplace creator
              </p>
              <h1 className="mt-3 text-4xl font-bold">{creator.name}</h1>
              <p className="mt-3 max-w-3xl leading-7 text-slate-300">
                {creator.bio || "This creator has not added a public biography yet."}
              </p>
 
              <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-300">
                {creator.location && <span>{creator.location}</span>}
                {creator.website && (
                  <a
                    href={creator.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-cyan-300"
                  >
                    Creator website
                  </a>
                )}
              </div>
            </div>
 
            {isOwner && (
              <button
                type="button"
                onClick={() => setEditing((current) => !current)}
                className="rounded-full bg-cyan-400 px-5 py-3 font-semibold text-slate-950"
              >
                {editing ? "Close profile editor" : "Edit public profile"}
              </button>
            )}
          </div>
 
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-white/5 p-5">
                <p className="text-sm text-slate-400">{label}</p>
                <p className="mt-2 text-3xl font-bold">{value}</p>
              </div>
            ))}
          </div>
        </div>
 
        {editing && isOwner && (
          <form
            onSubmit={saveProfile}
            className="mt-8 grid gap-5 rounded-3xl border border-slate-200 bg-white p-7 sm:grid-cols-2"
          >
            <label className="sm:col-span-2">
              <span className="text-sm font-medium text-slate-700">Biography</span>
              <textarea
                name="bio"
                value={form.bio}
                onChange={updateField}
                maxLength={500}
                rows={4}
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
              />
            </label>
            <label>
              <span className="text-sm font-medium text-slate-700">Location</span>
              <input
                name="location"
                value={form.location}
                onChange={updateField}
                maxLength={120}
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
              />
            </label>
            <label>
              <span className="text-sm font-medium text-slate-700">HTTPS website</span>
              <input
                name="website"
                value={form.website}
                onChange={updateField}
                placeholder="https://example.com"
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
              />
            </label>
            <label className="sm:col-span-2">
              <span className="text-sm font-medium text-slate-700">
                Specialties separated by commas
              </span>
              <input
                name="specialties"
                value={form.specialties}
                onChange={updateField}
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
              />
            </label>
            <button
              disabled={saving}
              className="rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white disabled:opacity-50 sm:col-span-2"
            >
              {saving ? "Saving profile…" : "Save public profile"}
            </button>
          </form>
        )}
 
        <div className="mt-12">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">
            Creator library
          </p>
          <h2 className="mt-2 text-3xl font-bold text-slate-950">
            Approved AI prompts
          </h2>
 
          {prompts.length === 0 ? (
            <div className="mt-7 rounded-3xl border border-dashed border-slate-300 p-10 text-center text-slate-600">
              This creator has no approved marketplace prompts yet.
            </div>
          ) : (
            <div className="mt-7 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {prompts.map((prompt) => (
                <article
                  key={prompt._id}
                  className="flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white"
                >
                  <img
                    src={prompt.imageUrl}
                    alt={`${prompt.title} prompt cover`}
                    className="h-48 w-full object-cover"
                  />
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-sm font-semibold text-cyan-700">
                      {prompt.category} · {prompt.aiModel}
                    </p>
                    <h3 className="mt-3 text-xl font-bold text-slate-950">
                      {prompt.title}
                    </h3>
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                      {prompt.description}
                    </p>
                    <Link
                      href={`/prompts/${prompt._id}`}
                      className="mt-6 rounded-xl bg-slate-950 px-5 py-3 text-center font-semibold text-white"
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
                disabled={!pagination.hasPreviousPage}
                onClick={() => changePage(page - 1)}
                className="rounded-full border border-slate-300 px-5 py-2.5 disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-sm text-slate-600">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                type="button"
                disabled={!pagination.hasNextPage}
                onClick={() => changePage(page + 1)}
                className="rounded-full border border-slate-300 px-5 py-2.5 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
