import { marketplaceRequest } from "@/lib/marketplaceApi";

export function getCreatorProfile(
  creatorId,
  page = 1,
) {
  return marketplaceRequest(
    `/api/creators/${creatorId}?page=${page}&limit=6`,
  );
}

export function updateMyCreatorProfile(
  profile,
) {
  return marketplaceRequest(
    "/api/creators/me",
    {
      method: "PATCH",
      body: JSON.stringify(profile),
    },
  );
}