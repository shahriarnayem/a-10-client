import { Suspense } from "react";
import AllPromptsClient from "@/components/prompts/AllPromptsClient";
 
export const metadata = {
  title: "Explore AI Prompts",
  description: "Discover reusable prompts for ChatGPT, Gemini, Claude, Midjourney, productivity, marketing, development, and creative work.",
};
 
export default function AllPromptsPage() {
  return (
    <Suspense fallback={<p className="py-20 text-center text-slate-600">Loading AI prompt discovery…</p>}>
      <AllPromptsClient />
    </Suspense>
  );
}
