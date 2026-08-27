import Link from "next/link";
 
export default function SiteFooter() {
  return (
    <footer className="bg-slate-950 px-5 py-12 text-slate-300 sm:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-3">
        <div>
          <p className="text-xl font-bold text-white">Prompt<span className="text-cyan-400">Market</span></p>
          <p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">
            A community marketplace for discovering, publishing, and improving reusable AI prompts.
          </p>
        </div>
        <div>
          <p className="font-semibold text-white">Marketplace</p>
          <div className="mt-4 space-y-3 text-sm">
            <Link className="block" href="/prompts">Explore prompts</Link>
            <Link className="block" href="/register">Become a creator</Link>
          </div>
        </div>
        <div>
          <p className="font-semibold text-white">Prompt quality</p>
          <p className="mt-4 text-sm leading-6 text-slate-400">
            Every submitted prompt enters moderation before appearing in discovery.
          </p>
        </div>
      </div>
      <p className="mx-auto mt-10 max-w-7xl border-t border-white/10 pt-6 text-xs text-slate-500">
        AI Prompt Marketplace - built for responsible prompt sharing.
      </p>
    </footer>
  );
}
