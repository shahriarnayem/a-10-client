import { Suspense } from "react";
import CreatorProfileClient from "@/components/creators/CreatorProfileClient";
 
export default function CreatorProfilePage() {
  return (
    <Suspense fallback={<p className="py-24 text-center">Loading creator…</p>}>
      <CreatorProfileClient />
    </Suspense>
  );
}
