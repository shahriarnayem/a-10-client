"use client";
 
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import PromptForm from "@/components/prompts/PromptForm";
import { getPromptById, updatePrompt } from "@/lib/promptApi";
 
export default function EditPromptPage() {
  const { id } = useParams();
  const router = useRouter();
  const [prompt, setPrompt] = useState(null);
  const [error, setError] = useState("");
 
  useEffect(() => {
    getPromptById(id).then((data) => setPrompt(data.prompt)).catch((requestError) => setError(requestError.message));
  }, [id]);
 
  async function savePrompt(values) {
    try {
      await updatePrompt(id, values);
      toast.success("The updated AI prompt was submitted for marketplace moderation.");
      router.push("/dashboard/my-prompts");
    } catch (requestError) {
      toast.error(requestError.message);
      throw requestError;
    }
  }
 
  if (error) return <div className="rounded-3xl border border-rose-400/20 bg-rose-400/5 p-8"><h1 className="text-2xl font-semibold">Prompt editor unavailable</h1><p className="mt-3 text-slate-300">{error}</p></div>;
  if (!prompt) return <p className="text-slate-300">Loading your AI prompt publishing information…</p>;
 
  return (
    <section className="mx-auto max-w-4xl">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">Prompt management</p>
      <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Update AI prompt</h1>
      <p className="mb-10 mt-4 max-w-2xl leading-7 text-slate-300">Updated creator submissions return to moderation before appearing in discovery.</p>
      <PromptForm initialValues={prompt} submitLabel="Save and resubmit prompt" onSubmit={savePrompt} />
    </section>
  );
}
