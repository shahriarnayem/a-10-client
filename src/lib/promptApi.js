import { marketplaceRequest } from "@/lib/marketplaceApi";

export function createPrompt(prompt) {
  return marketplaceRequest("/api/prompts", {
    method: "POST",
    body: JSON.stringify(prompt),
  });
}

export function getMyPrompts() {
  return marketplaceRequest("/api/prompts/mine");
}

export function getPromptById(promptId) {
  return marketplaceRequest(`/api/prompts/${promptId}`);
}

export function updatePrompt(promptId, prompt) {
  return marketplaceRequest(`/api/prompts/${promptId}`, {
    method: "PATCH",
    body: JSON.stringify(prompt),
  });
}

export function deletePrompt(promptId) {
  return marketplaceRequest(`/api/prompts/${promptId}`, {
    method: "DELETE",
  });
}

export function getPromptAnalytics(promptId) {
  return marketplaceRequest(
    `/api/prompts/${promptId}/analytics`,
  );
}

export function getAllPrompts(searchParameters = {}) {
  const query = new URLSearchParams();

  Object.entries(searchParameters).forEach(
    ([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        value !== ""
      ) {
        query.set(key, value);
      }
    },
  );

  return marketplaceRequest(
    `/api/prompts?${query.toString()}`,
  );
}

export function getPromptFilters() {
  return marketplaceRequest("/api/prompts/filters");
}

export function getPromptReviews(promptId) {
  return marketplaceRequest(
    `/api/prompts/${promptId}/reviews`,
  );
}

export function getPromptEngagement(promptId) {
  return marketplaceRequest(
    `/api/prompts/${promptId}/engagement`,
  );
}

export function recordPromptCopy(promptId) {
  return marketplaceRequest(
    `/api/prompts/${promptId}/copy`,
    {
      method: "POST",
    },
  );
}

export function togglePromptBookmark(promptId) {
  return marketplaceRequest(
    `/api/prompts/${promptId}/bookmark`,
    {
      method: "POST",
    },
  );
}

export function getMyBookmarkedPrompts() {
  return marketplaceRequest(
    "/api/prompts/bookmarks/mine",
  );
}

export function savePromptReview(promptId, review) {
  return marketplaceRequest(
    `/api/prompts/${promptId}/review`,
    {
      method: "PUT",
      body: JSON.stringify(review),
    },
  );
}

export function reportPrompt(promptId, report) {
  return marketplaceRequest(
    `/api/prompts/${promptId}/report`,
    {
      method: "POST",
      body: JSON.stringify(report),
    },
  );
}