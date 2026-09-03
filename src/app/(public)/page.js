import Link from "next/link";
import FeaturedPrompts from "@/components/prompts/FeaturedPrompts";
 
const benefits = [
  [
    "Creator-reviewed structure",
    "Prompts include clear goals, variables, supported tools, and usage guidance.",
  ],
  [
    "Faster AI workflows",
    "Save proven instructions instead of rebuilding the same prompt for every project.",
  ],
  [
    "Community evidence",
    "Ratings, reviews, copy activity, and creator profiles help users choose confidently.",
  ],
];
 
const workflows = [
  "Marketing campaigns",
  "Software development",
  "Research synthesis",
  "Creative direction",
];
 
export default function HomePage() {
  return (
    <main>
      <section className="overflow-hidden bg-slate-950 px-5 py-24 text-white sm:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
              Community prompt intelligence
            </p>
            <h1 className="mt-5 text-5xl font-bold leading-tight sm:text-6xl">
              Turn clear instructions into reliable AI results.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Explore reusable prompts for ChatGPT, Gemini, Claude, Midjourney,
              business, development, learning, and creative production.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/prompts"
                className="rounded-full bg-cyan-400 px-6 py-3 text-center font-semibold text-slate-950"
              >
                Explore AI prompts
              </Link>
              <Link
                href="/register"
                className="rounded-full border border-white/15 px-6 py-3 text-center font-semibold"
              >
                Publish your expertise
              </Link>
            </div>
          </div>
 
          <div className="rounded-[2rem] border border-cyan-400/20 bg-cyan-400/5 p-7">
            <p className="text-sm font-semibold text-cyan-300">
              Popular AI workflows
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {workflows.map((workflow) => (
                <div
                  key={workflow}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5"
                >
                  {workflow}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
 
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">
              Community favorites
            </p>
            <h2 className="mt-3 max-w-3xl text-4xl font-bold text-slate-950">
              Popular prompts backed by marketplace activity.
            </h2>
          </div>
          <Link
            href="/prompts"
            className="font-semibold text-cyan-700"
          >
            Browse all prompts
          </Link>
        </div>
 
        <FeaturedPrompts />
      </section>
 
      <section className="bg-slate-50 px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">
            Why PromptMarket
          </p>
          <h2 className="mt-3 max-w-3xl text-4xl font-bold text-slate-950">
            A better system for sharing practical AI knowledge.
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {benefits.map(([title, description]) => (
              <article
                key={title}
                className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm"
              >
                <h3 className="text-xl font-semibold text-slate-950">
                  {title}
                </h3>
                <p className="mt-3 leading-7 text-slate-600">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
 
      <section className="bg-cyan-50 px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-4xl font-bold text-slate-950">
            Share one prompt. Improve thousands of AI sessions.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl leading-7 text-slate-600">
            Build a creator profile, submit original prompt systems, and learn
            from community feedback.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-block rounded-full bg-slate-950 px-6 py-3 font-semibold text-white"
          >
            Join the prompt community
          </Link>
        </div>
      </section>
    </main>
  );
}
