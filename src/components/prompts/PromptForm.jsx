/* eslint-disable @next/next/no-img-element */
"use client";
 
import { useEffect, useState } from "react";
import { uploadPromptCover } from "@/lib/imgbb";
 
const categories = ["Marketing", "Development", "Business", "Education", "Design", "Productivity", "Writing", "Data Analysis"];
const emptyPrompt = { title: "", description: "", category: "Marketing", tags: "", aiModel: "", difficultyLevel: "Beginner", usageInstructions: "", promptText: "", visibility: "public", imageUrl: "" };
 
function formValues(prompt = emptyPrompt) {
  return {
    title: prompt.title || "",
    description: prompt.description || "",
    category: prompt.category || "Marketing",
    tags: Array.isArray(prompt.tags) ? prompt.tags.join(", ") : prompt.tags || "",
    aiModel: prompt.aiModel || "",
    difficultyLevel: prompt.difficultyLevel || "Beginner",
    usageInstructions: prompt.usageInstructions || "",
    promptText: prompt.promptText || "",
    visibility: prompt.visibility || (prompt.accessLevel === "premium" ? "private" : "public"),
    imageUrl: prompt.imageUrl || "",
  };
}
 
export default function PromptForm({ initialValues = emptyPrompt, onSubmit, submitLabel }) {
  const [form, setForm] = useState(() => formValues(initialValues));
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(initialValues.imageUrl || "");
  const [submitting, setSubmitting] = useState(false);
 
  useEffect(() => {
    setForm(formValues(initialValues));
    setCoverPreview(initialValues.imageUrl || "");
    setCoverFile(null);
  }, [initialValues]);
 
  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }
 
  function selectCover(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (coverPreview?.startsWith("blob:")) URL.revokeObjectURL(coverPreview);
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  }
 
  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    try {
      let imageUrl = form.imageUrl;
      if (coverFile) imageUrl = (await uploadPromptCover(coverFile)).url;
      if (!imageUrl) throw new Error("Choose a marketplace prompt thumbnail.");
      await onSubmit({ ...form, imageUrl, tags: form.tags.split(",").map((tag) => tag.trim()).filter(Boolean) });
    } finally {
      setSubmitting(false);
    }
  }
 
  const inputClass = "mt-2 w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-400/60";
 
  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-white/10 bg-slate-900/60 p-5 sm:p-8">
      <label className="block font-medium">Prompt title<input name="title" value={form.title} onChange={updateField} required minLength={5} maxLength={120} className={inputClass} placeholder="Conversion-Focused Product Description" /></label>
      <label className="block font-medium">Prompt description<textarea name="description" value={form.description} onChange={updateField} required minLength={20} maxLength={1000} rows={4} className={inputClass} placeholder="Creates persuasive ecommerce copy for a defined product, audience, and conversion goal." /></label>
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block font-medium">Category<select name="category" value={form.category} onChange={updateField} className={inputClass}>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
        <label className="block font-medium">AI tool<input name="aiModel" value={form.aiModel} onChange={updateField} required className={inputClass} placeholder="ChatGPT, Gemini, Claude, or Midjourney" /></label>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block font-medium">Difficulty<select name="difficultyLevel" value={form.difficultyLevel} onChange={updateField} className={inputClass}><option>Beginner</option><option>Intermediate</option><option>Pro</option></select></label>
        <label className="block font-medium">Tags<input name="tags" value={form.tags} onChange={updateField} required className={inputClass} placeholder="ecommerce, copywriting, conversion" /></label>
      </div>
      <label className="block font-medium">Usage instructions<textarea name="usageInstructions" value={form.usageInstructions} onChange={updateField} required minLength={15} rows={4} className={inputClass} placeholder="Replace every variable before submitting the prompt to the selected AI tool." /></label>
      <label className="block font-medium">Complete prompt content<textarea name="promptText" value={form.promptText} onChange={updateField} required minLength={20} rows={10} className={`${inputClass} font-mono text-sm`} placeholder="Create a persuasive description for {{product}} aimed at {{audience}}." /></label>
      <fieldset><legend className="font-medium">Visibility</legend><div className="mt-3 grid gap-3 sm:grid-cols-2">{[["public", "Public prompt"], ["private", "Private premium prompt"]].map(([value, label]) => <label key={value} className={`cursor-pointer rounded-2xl border p-4 ${form.visibility === value ? "border-cyan-400 bg-cyan-400/5" : "border-white/10"}`}><input type="radio" name="visibility" value={value} checked={form.visibility === value} onChange={updateField} className="mr-3" />{label}</label>)}</div></fieldset>
      <label className="block font-medium">Thumbnail image<input type="file" accept="image/jpeg,image/png,image/webp" onChange={selectCover} required={!form.imageUrl} className={`${inputClass} file:mr-4 file:rounded-full file:border-0 file:bg-cyan-400 file:px-4 file:py-2 file:font-semibold file:text-slate-950`} /></label>
      {coverPreview && <img src={coverPreview} alt="AI prompt marketplace thumbnail preview" className="h-56 w-full rounded-2xl object-cover" />}
      <button disabled={submitting} className="w-full rounded-2xl bg-cyan-400 px-6 py-3.5 font-semibold text-slate-950 disabled:opacity-60">{submitting ? "Saving marketplace prompt…" : submitLabel}</button>
    </form>
  );
}
