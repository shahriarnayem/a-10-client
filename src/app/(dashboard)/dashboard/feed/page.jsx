import { Suspense } from "react";
import FollowingFeedClient from "@/components/feed/FollowingFeedClient";

export default function FollowingFeedPage() {
  return (
    <Suspense
      fallback={
        <p className="text-slate-300">
          Loading following feed…
        </p>
      }
    >
      <FollowingFeedClient />
    </Suspense>
  );
}