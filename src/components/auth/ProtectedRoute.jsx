"use client";
 
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
 
export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { firebaseUser, marketplaceUser, loading, authError, refreshMarketplaceSession } = useAuth();
 
  useEffect(() => {
    if (!loading && !firebaseUser) router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
  }, [firebaseUser, loading, pathname, router]);
 
  if (loading) {
    return <div className="grid min-h-screen place-items-center bg-slate-950 px-6"><p className="text-slate-300">Loading your prompt marketplace workspace…</p></div>;
  }
  if (!firebaseUser) return null;
  if (authError || !marketplaceUser) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-950 px-6 text-white">
        <div className="max-w-md rounded-3xl border border-rose-400/20 bg-slate-900 p-8 text-center">
          <h1 className="text-2xl font-semibold">Marketplace session unavailable</h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">{authError || "Your marketplace profile could not be loaded."}</p>
          <button type="button" onClick={refreshMarketplaceSession} className="mt-6 rounded-full bg-cyan-400 px-5 py-2.5 font-semibold text-slate-950">Reconnect marketplace</button>
        </div>
      </div>
    );
  }
  return children;
}
