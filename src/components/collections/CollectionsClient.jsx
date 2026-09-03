"use client";
 
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  createCollection,
  deleteCollection,
  getMyCollections,
  updateCollection,
} from "@/lib/collectionApi";
 
const initialForm = {
  name: "",
  description: "",
  isPublic: false,
};
 
export default function CollectionsClient() {
  const [collections, setCollections] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
 
  const loadCollections = useCallback(async () => {
    setLoading(true);
    setError("");
 
    try {
      const data = await getMyCollections();
      setCollections(data.collections || []);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, []);
 
  useEffect(() => {
    loadCollections();
  }, [loadCollections]);
 
  function updateField(event) {
    const { name, value, checked, type } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }
 
  function startEdit(collection) {
    setEditingId(collection._id);
    setForm({
      name: collection.name,
      description: collection.description || "",
      isPublic: Boolean(collection.isPublic),
    });
  }
 
  function resetForm() {
    setEditingId("");
    setForm(initialForm);
  }
 
  async function saveCollection(event) {
    event.preventDefault();
    setSaving(true);
 
    try {
      const data = editingId
        ? await updateCollection(editingId, form)
        : await createCollection(form);
 
      toast.success(data.message);
      resetForm();
      await loadCollections();
    } catch (requestError) {
      toast.error(requestError.message);
    } finally {
      setSaving(false);
    }
  }
 
  async function removeCollection(collection) {
    if (!window.confirm(`Delete "${collection.name}"?`)) return;
 
    try {
      const data = await deleteCollection(collection._id);
      setCollections((current) =>
        current.filter((item) => item._id !== collection._id),
      );
      toast.success(data.message);
    } catch (requestError) {
      toast.error(requestError.message);
    }
  }
 
  return (
    <section>
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
        Saved knowledge
      </p>
      <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
        Prompt collections
      </h1>
      <p className="mt-4 max-w-2xl leading-7 text-slate-300">
        Organize approved prompts into private work lists or public community
        collections.
      </p>
 
      <form
        onSubmit={saveCollection}
        className="mt-9 grid gap-5 rounded-3xl border border-white/10 bg-slate-900/60 p-6 sm:grid-cols-2"
      >
        <label>
          <span className="text-sm font-medium text-slate-200">Collection name</span>
          <input
            name="name"
            value={form.name}
            onChange={updateField}
            required
            minLength={3}
            maxLength={80}
            className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
          />
        </label>
 
        <label>
          <span className="text-sm font-medium text-slate-200">Visibility</span>
          <span className="mt-2 flex min-h-12 items-center rounded-xl border border-white/10 bg-slate-950 px-4 text-slate-300">
            <input
              type="checkbox"
              name="isPublic"
              checked={form.isPublic}
              onChange={updateField}
              className="mr-3"
            />
            Public collection
          </span>
        </label>
 
        <label className="sm:col-span-2">
          <span className="text-sm font-medium text-slate-200">Description</span>
          <textarea
            name="description"
            value={form.description}
            onChange={updateField}
            maxLength={400}
            rows={3}
            className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
          />
        </label>
 
        <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row">
          <button
            disabled={saving}
            className="rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 disabled:opacity-50"
          >
            {saving
              ? "Saving collection…"
              : editingId
                ? "Update collection"
                : "Create collection"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-xl border border-white/10 px-5 py-3 text-slate-300"
            >
              Cancel edit
            </button>
          )}
        </div>
      </form>
 
      {loading && <p className="mt-10 text-slate-300">Loading collections…</p>}
 
      {!loading && error && (
        <div className="mt-10 rounded-3xl border border-rose-400/20 bg-rose-400/5 p-7 text-rose-200">
          {error}
        </div>
      )}
 
      {!loading && !error && collections.length === 0 && (
        <div className="mt-10 rounded-3xl border border-dashed border-white/15 p-10 text-center text-slate-300">
          Create your first collection, then add prompts from a prompt details page.
        </div>
      )}
 
      {!loading && !error && collections.length > 0 && (
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {collections.map((collection) => (
            <article
              key={collection._id}
              className="rounded-3xl border border-white/10 bg-slate-900/60 p-6"
            >
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
                    {collection.isPublic ? "Public" : "Private"}
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-white">
                    {collection.name}
                  </h2>
                </div>
                <span className="rounded-full bg-white/5 px-3 py-1 text-sm text-slate-300">
                  {collection.promptCount || 0} prompts
                </span>
              </div>
 
              <p className="mt-4 leading-7 text-slate-300">
                {collection.description || "No description provided."}
              </p>
 
              <div className="mt-6 flex flex-wrap gap-2">
                <Link
                  href={`/collections/${collection._id}`}
                  className="rounded-lg bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-300"
                >
                  Open collection
                </Link>
                <button
                  type="button"
                  onClick={() => startEdit(collection)}
                  className="rounded-lg bg-violet-400/10 px-4 py-2 text-sm font-semibold text-violet-300"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => removeCollection(collection)}
                  className="rounded-lg bg-rose-400/10 px-4 py-2 text-sm font-semibold text-rose-300"
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
