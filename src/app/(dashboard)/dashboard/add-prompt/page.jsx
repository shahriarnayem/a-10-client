/* eslint-disable @next/next/no-img-element */
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { uploadPromptCover } from "@/lib/imgbb";
import { createPrompt } from "@/lib/promptApi";

const categories = [
  "Marketing",
  "Development",
  "Business",
  "Education",
  "Design",
  "Productivity",
  "Writing",
  "Data Analysis",
];

const initialForm = {
  title: "",
  description: "",
  category: "Marketing",
  tags: "",
  aiModel: "",
  difficultyLevel: "Beginner",
  usageInstructions: "",
  promptText: "",
  visibility: "public",
};

export default function AddPromptPage() {
  const router = useRouter();

  const [form, setForm] = useState(initialForm);
  const [coverFile, setCoverFile] =
    useState(null);
  const [coverPreview, setCoverPreview] =
    useState("");
  const [submitting, setSubmitting] =
    useState(false);

  useEffect(() => {
    return () => {
      if (coverPreview.startsWith("blob:")) {
        URL.revokeObjectURL(coverPreview);
      }
    };
  }, [coverPreview]);

  function updateField(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function selectCover(event) {
    const file = event.target.files?.[0];

    if (coverPreview.startsWith("blob:")) {
      URL.revokeObjectURL(coverPreview);
    }

    if (!file) {
      setCoverFile(null);
      setCoverPreview("");
      return;
    }

    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setSubmitting(true);

    try {
      const uploadedImage =
        await uploadPromptCover(coverFile);

      const tags = form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

      await createPrompt({
        ...form,
        tags,
        imageUrl: uploadedImage.url,
        imageHost: "imgbb",
        imageHostId: uploadedImage.id,
      });

      toast.success(
        "Your AI prompt was submitted for marketplace moderation.",
      );

      router.push("/dashboard/my-prompts");
    } catch (error) {
      toast.error(
        error.message ||
          "The prompt could not be submitted.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "mt-2 w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-400/60";

  return (
    <section className="mx-auto max-w-4xl">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
        Prompt publishing
      </p>

      <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
        Add an AI prompt
      </h1>

      <p className="mb-10 mt-4 max-w-2xl leading-7 text-slate-300">
        Publish a reusable instruction with clear
        variables, usage guidance, supported tools,
        and a marketplace-ready thumbnail.
      </p>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-3xl border border-white/10 bg-slate-900/60 p-5 sm:p-8"
      >
        <label className="block font-medium">
          Prompt title

          <input
            name="title"
            value={form.title}
            onChange={updateField}
            required
            minLength={5}
            maxLength={120}
            className={inputClass}
            placeholder="Conversion-Focused Product Description"
          />
        </label>

        <label className="block font-medium">
          Prompt description

          <textarea
            name="description"
            value={form.description}
            onChange={updateField}
            required
            minLength={20}
            rows={4}
            className={inputClass}
            placeholder="Explain what this prompt produces and who should use it."
          />
        </label>

        <div className="grid gap-6 sm:grid-cols-2">
          <label className="block font-medium">
            Category

            <select
              name="category"
              value={form.category}
              onChange={updateField}
              className={inputClass}
            >
              {categories.map((category) => (
                <option key={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label className="block font-medium">
            AI tool

            <input
              name="aiModel"
              value={form.aiModel}
              onChange={updateField}
              required
              className={inputClass}
              placeholder="ChatGPT, Gemini, Claude, or Midjourney"
            />
          </label>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <label className="block font-medium">
            Difficulty

            <select
              name="difficultyLevel"
              value={form.difficultyLevel}
              onChange={updateField}
              className={inputClass}
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Pro</option>
            </select>
          </label>

          <label className="block font-medium">
            Tags

            <input
              name="tags"
              value={form.tags}
              onChange={updateField}
              required
              className={inputClass}
              placeholder="ecommerce, copywriting, conversion"
            />
          </label>
        </div>

        <label className="block font-medium">
          Usage instructions

          <textarea
            name="usageInstructions"
            value={form.usageInstructions}
            onChange={updateField}
            required
            minLength={15}
            rows={4}
            className={inputClass}
            placeholder="Explain how users should customize and use this prompt."
          />
        </label>

        <label className="block font-medium">
          Complete prompt content

          <textarea
            name="promptText"
            value={form.promptText}
            onChange={updateField}
            required
            minLength={20}
            rows={10}
            className={`${inputClass} font-mono text-sm`}
            placeholder="Create a persuasive product description for {{product}} aimed at {{audience}}."
          />
        </label>

        <fieldset>
          <legend className="font-medium">
            Visibility
          </legend>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {[
              ["public", "Public prompt"],
              [
                "private",
                "Private premium prompt",
              ],
            ].map(([value, label]) => (
              <label
                key={value}
                className={`rounded-2xl border p-4 ${
                  form.visibility === value
                    ? "border-cyan-400 bg-cyan-400/5"
                    : "border-white/10"
                }`}
              >
                <input
                  type="radio"
                  name="visibility"
                  value={value}
                  checked={
                    form.visibility === value
                  }
                  onChange={updateField}
                  className="mr-3"
                />

                {label}
              </label>
            ))}
          </div>
        </fieldset>

        <label className="block font-medium">
          Thumbnail image

          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={selectCover}
            required
            className={`${inputClass} file:mr-4 file:rounded-full file:border-0 file:bg-cyan-400 file:px-4 file:py-2 file:font-semibold file:text-slate-950`}
          />
        </label>

        {coverPreview && (
          <img
            src={coverPreview}
            alt="Selected AI prompt thumbnail"
            className="h-56 w-full rounded-2xl object-cover"
          />
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-2xl bg-cyan-400 px-6 py-3.5 font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting
            ? "Uploading to ImgBB and submitting…"
            : "Submit prompt for review"}
        </button>
      </form>
    </section>
  );
}