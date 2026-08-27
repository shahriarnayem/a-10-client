export const metadata = {
  title: "Explore AI Prompts | PromptMarket",
  description: "Search reusable AI prompts by tool, category, and creator.",
};
 
export default function PromptsPage() {
  return (
    <main className="mx-auto min-h-[60vh] max-w-7xl px-5 py-20 sm:px-8">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">Prompt discovery</p>
      <h1 className="mt-3 text-4xl font-bold text-slate-950">Explore reusable AI prompts</h1>
      <p className="mt-5 max-w-2xl leading-7 text-slate-600">
        Browse moderated prompt systems for writing, research, development, marketing, design, and productivity.
      </p>
    </main>
  );
}
