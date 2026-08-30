/* eslint-disable @next/next/no-img-element */
"use client";
 
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getAllPrompts, getPromptFilters } from "@/lib/promptApi";
 
export default function AllPromptsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [filters, setFilters] = useState({ categories: [], aiTools: [], difficulties: ["Beginner", "Intermediate", "Pro"] });
  const [prompts, setPrompts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
 
  const category = searchParams.get("category") || "";
  const aiTool = searchParams.get("aiTool") || "";
  const difficulty = searchParams.get("difficulty") || "";
  const sort = searchParams.get("sort") || "latest";
  const page = Number(searchParams.get("page") || 1);
 
  useEffect(() => {
    getPromptFilters().then(setFilters).catch(() => setFilters({ categories: [], aiTools: [], difficulties: ["Beginner", "Intermediate", "Pro"] }));
  }, []);
 
  useEffect(() => {
    async function loadPrompts() {
      setLoading(true);
      setError("");
      try {
        const data = await getAllPrompts({ search: searchParams.get("search") || "", category, aiTool, difficulty, sort, page, limit: 6 });
        setPrompts(data.prompts || []);
        setPagination(data.pagination);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    }
    loadPrompts();
  }, [aiTool, category, difficulty, page, searchParams, sort]);
 
  function updateQuery(changes) {
    const query = new URLSearchParams(searchParams.toString());
    Object.entries(changes).forEach(([key, value]) => value ? query.set(key, value) : query.delete(key));
    router.push(`/prompts?${query.toString()}`);
  }
 
  function handleSearch(event) {
    event.preventDefault();
    updateQuery({ search: search.trim(), page: "1" });
  }
 
  function clearFilters() {
    setSearch("");
    router.push("/prompts");
  }
 
  return (
    <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-600">Prompt discovery</p>
        <h1 className="mt-3 text-4xl font-bold text-slate-950 sm:text-5xl">Explore AI prompts</h1>
        <p className="mt-5 leading-7 text-slate-600">Find reusable instructions for marketing, development, business, education, design, writing, productivity, and data analysis.</p>
      </div>
 
      <form onSubmit={handleSearch} className="mt-10 grid gap-4 rounded-3xl bg-slate-950 p-5 lg:grid-cols-6">
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search title, tag, or AI tool" className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500 lg:col-span-2" />
        <select value={category} onChange={(event) => updateQuery({ category: event.target.value, page: "1" })} className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white"><option value="">All categories</option>{filters.categories.map((item) => <option key={item}>{item}</option>)}</select>
        <select value={aiTool} onChange={(event) => updateQuery({ aiTool: event.target.value, page: "1" })} className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white"><option value="">All AI tools</option>{filters.aiTools.map((item) => <option key={item}>{item}</option>)}</select>
        <select value={difficulty} onChange={(event) => updateQuery({ difficulty: event.target.value, page: "1" })} className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white"><option value="">All difficulties</option>{filters.difficulties.map((item) => <option key={item}>{item}</option>)}</select>
        <button className="rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950">Search prompts</button>
        <select value={sort} onChange={(event) => updateQuery({ sort: event.target.value, page: "1" })} className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white lg:col-span-2"><option value="latest">Latest prompts</option><option value="popular">Most popular by rating</option><option value="copied">Most copied</option></select>
        <button type="button" onClick={clearFilters} className="rounded-xl border border-white/10 px-5 py-3 text-slate-300">Clear discovery filters</button>
      </form>
 
      {loading && <p className="py-16 text-center text-slate-600">Searching the AI prompt marketplace…</p>}
      {!loading && error && <div className="mt-10 rounded-3xl bg-rose-50 p-8 text-rose-700">{error}</div>}
      {!loading && !error && !prompts.length && <div className="mt-10 rounded-3xl border border-dashed border-slate-300 p-12 text-center"><h2 className="text-2xl font-semibold text-slate-950">No matching AI prompts</h2><p className="mt-3 text-slate-600">Try another tool, tag, category, or difficulty.</p></div>}
 
      {!loading && !error && prompts.length > 0 && (
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {prompts.map((prompt) => {
            const detailsPath = `/prompts/${prompt._id}`;
            const detailsHref = user ? detailsPath : `/login?redirect=${encodeURIComponent(detailsPath)}`;
            return (
              <article key={prompt._id} className="flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <img src={prompt.imageUrl} alt={`${prompt.title} AI prompt`} className="h-52 w-full object-cover" />
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex flex-wrap gap-2 text-xs font-semibold"><span className="rounded-full bg-cyan-50 px-3 py-1 text-cyan-700">{prompt.category}</span><span className="rounded-full bg-violet-50 px-3 py-1 text-violet-700">{prompt.aiModel}</span><span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">{prompt.difficultyLevel || "Beginner"}</span></div>
                  <h2 className="mt-5 text-xl font-bold text-slate-950">{prompt.title}</h2>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{prompt.description}</p>
                  <div className="mt-6 flex items-center justify-between text-sm text-slate-500"><span>{prompt.creatorName}</span><span>{prompt.copyCount || 0} copies</span></div>
                  <Link href={detailsHref} className="mt-6 rounded-xl bg-slate-950 px-5 py-3 text-center font-semibold text-white">View prompt details</Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
 
      {pagination && pagination.totalPages > 1 && <div className="mt-12 flex items-center justify-center gap-4"><button type="button" disabled={!pagination.hasPreviousPage} onClick={() => updateQuery({ page: String(page - 1) })} className="rounded-full border border-slate-300 px-5 py-2.5 disabled:opacity-40">Previous</button><span className="text-sm text-slate-600">Page {pagination.page} of {pagination.totalPages}</span><button type="button" disabled={!pagination.hasNextPage} onClick={() => updateQuery({ page: String(page + 1) })} className="rounded-full border border-slate-300 px-5 py-2.5 disabled:opacity-40">Next</button></div>}
    </section>
  );
}
