import Link from "next/link";
 
export default function NotFoundPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 px-6 text-white">
      <section className="max-w-xl text-center">
        <p className="text-7xl font-bold text-cyan-400">404</p>
        <h1 className="mt-5 text-3xl font-bold">This prompt marketplace page was not found</h1>
        <p className="mt-4 leading-7 text-slate-300">The prompt, creator workspace, or discovery route may have moved.</p>
        <Link href="/prompts" className="mt-7 inline-block rounded-full bg-cyan-400 px-6 py-3 font-semibold text-slate-950">Explore available prompts</Link>
      </section>
    </main>
  );
}
