export default function Loading() {
  return (
    <div className="grid min-h-screen place-items-center bg-slate-950 px-6">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-cyan-400/20 border-t-cyan-400" />
        <p className="mt-4 text-sm text-slate-300">Loading AI prompt marketplace content…</p>
      </div>
    </div>
  );
}
