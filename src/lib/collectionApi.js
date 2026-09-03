import { marketplaceRequest } from "@/lib/marketplaceApi";
 
export function getMyCollections() {
  return marketplaceRequest("/api/collections/mine");
}
 
export function getCollection(collectionId) {
  return marketplaceRequest(`/api/collections/${collectionId}`);
}
 
export function createCollection(collection) {
  return marketplaceRequest("/api/collections", {
    method: "POST",
    body: JSON.stringify(collection),
  });
}
 
export function updateCollection(collectionId, collection) {
  return marketplaceRequest(`/api/collections/${collectionId}`, {
    method: "PATCH",
    body: JSON.stringify(collection),
  });
}
 
export function deleteCollection(collectionId) {
  return marketplaceRequest(`/api/collections/${collectionId}`, {
    method: "DELETE",
  });
}
 
export function addPromptToCollection(collectionId, promptId) {
  return marketplaceRequest(
    `/api/collections/${collectionId}/prompts/${promptId}`,
    { method: "POST" },
  );
}
 
export function removePromptFromCollection(collectionId, promptId) {
  return marketplaceRequest(
    `/api/collections/${collectionId}/prompts/${promptId}`,
    { method: "DELETE" },
  );
}
