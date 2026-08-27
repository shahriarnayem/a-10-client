"use client";
 
export default function GlobalError({ error, reset }) {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 px-6 text-white">
      <section className="max-w-lg rounded-3xl border border-rose-400/20 bg-rose-400/5 p-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-300">Marketplace interruption</p>
        <h1 className="mt-3 text-3xl font-bold">Prompt content could not be loaded</h1>
        <p className="mt-4 leading-7 text-slate-300">{error.message || "The marketplace encountered an unexpected problem."}</p>
        <button type="button" onClick={reset} className="mt-6 rounded-full bg-rose-300 px-5 py-3 font-semibold text-slate-950">Try loading again</button>
      </section>
    </main>
  );
}
