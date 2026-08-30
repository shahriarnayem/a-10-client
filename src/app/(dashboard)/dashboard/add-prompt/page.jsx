"use client";
 
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import PromptForm from "@/components/prompts/PromptForm";
import { createPrompt } from "@/lib/promptApi";
 
export default function AddPromptPage() {
  const router = useRouter();
 
  async function submitPrompt(prompt) {
    try {
      await createPrompt(prompt);
      toast.success("Your AI prompt was submitted for marketplace moderation.");
      router.push("/dashboard/my-prompts");
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  }
 
  return (
    <section className="mx-auto max-w-4xl">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">Prompt publishing</p>
      <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Add an AI prompt</h1>
      <p className="mb-10 mt-4 max-w-2xl leading-7 text-slate-300">Publish a reusable instruction with clear variables, usage guidance, supported AI tools, and a marketplace-ready thumbnail.</p>
      <PromptForm submitLabel="Submit prompt for review" onSubmit={submitPrompt} />
    </section>
  );
}
