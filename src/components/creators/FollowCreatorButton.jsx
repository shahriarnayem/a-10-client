"use client";
 
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import {
  followCreator,
  getFollowStatus,
  unfollowCreator,
} from "@/lib/followApi";
 
export default function FollowCreatorButton({ creatorId, onChange }) {
  const { marketplaceUser } = useAuth();
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
 
  const isOwner = marketplaceUser?._id === creatorId;
 
  useEffect(() => {
    let active = true;
 
    if (!marketplaceUser || isOwner) {
      setLoading(false);
      return undefined;
    }
 
    getFollowStatus(creatorId)
      .then((data) => {
        if (active) setFollowing(Boolean(data.following));
      })
      .catch(() => {
        if (active) setFollowing(false);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
 
    return () => {
      active = false;
    };
  }, [creatorId, isOwner, marketplaceUser]);
 
  if (!marketplaceUser || isOwner) return null;
 
  async function toggleFollow() {
    setSaving(true);
 
    try {
      const data = following
        ? await unfollowCreator(creatorId)
        : await followCreator(creatorId);
 
      setFollowing(data.following);
      onChange?.(data.following ? 1 : -1);
      toast.success(data.message);
    } catch (requestError) {
      toast.error(requestError.message);
    } finally {
      setSaving(false);
    }
  }
 
  return (
    <button
      type="button"
      onClick={toggleFollow}
      disabled={loading || saving}
      className={`rounded-full px-5 py-3 font-semibold disabled:opacity-50 ${
        following
          ? "border border-white/15 text-white"
          : "bg-violet-400 text-slate-950"
      }`}
    >
      {loading ? "Checking…" : saving ? "Saving…" : following ? "Following" : "Follow creator"}
    </button>
  );
}
