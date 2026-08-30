import { marketplaceRequest } from "@/lib/marketplaceApi";
 
export function createPrompt(prompt) {
  return marketplaceRequest("/api/prompts", { method: "POST", body: JSON.stringify(prompt) });
}
 
export function getMyPrompts() {
  return marketplaceRequest("/api/prompts/mine");
}
 
export function getPromptById(promptId) {
  return marketplaceRequest(`/api/prompts/${promptId}`);
}
 
export function updatePrompt(promptId, prompt) {
  return marketplaceRequest(`/api/prompts/${promptId}`, { method: "PATCH", body: JSON.stringify(prompt) });
}
 
export function deletePrompt(promptId) {
  return marketplaceRequest(`/api/prompts/${promptId}`, { method: "DELETE" });
}
 
export function getPromptAnalytics(promptId) {
  return marketplaceRequest(`/api/prompts/${promptId}/analytics`);
}
