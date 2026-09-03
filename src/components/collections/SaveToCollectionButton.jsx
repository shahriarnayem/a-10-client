"use client";

import {
  useEffect,
  useState,
} from "react";
import { toast } from "react-toastify";
import {
  addPromptToCollection,
  getMyCollections,
} from "@/lib/collectionApi";

export default function SaveToCollectionButton({
  promptId,
}) {
  const [collections, setCollections] =
    useState([]);

  const [collectionId, setCollectionId] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  useEffect(() => {
    let active = true;

    getMyCollections()
      .then((data) => {
        if (!active) {
          return;
        }

        const items =
          data.collections || [];

        setCollections(items);
        setCollectionId(
          items[0]?._id || "",
        );
      })
      .catch(() => {
        if (active) {
          setCollections([]);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  async function savePrompt() {
    if (!collectionId) {
      toast.info(
        "Create a prompt collection from your dashboard first.",
      );
           return;
    }

    setSaving(true);

    try {
      const data =
        await addPromptToCollection(
          collectionId,
          promptId,
        );

      toast.success(data.message);
    } catch (requestError) {
      toast.error(requestError.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
      <select
        value={collectionId}
        onChange={(event) =>
          setCollectionId(
            event.target.value,
          )
        }
        className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm"
      >
        {collections.length === 0 && (
          <option value="">
            No collections yet
          </option>
        )}

        {collections.map(
          (collection) => (
            <option
              key={collection._id}
              value={collection._id}
            >
              {collection.name}
            </option>
          ),
        )}
      </select>

      <button
        type="button"
        onClick={savePrompt}
        disabled={saving}
        className="rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
      >
        {saving
          ? "Saving…"
          : "Add to collection"}
      </button>
    </div>
  );
}