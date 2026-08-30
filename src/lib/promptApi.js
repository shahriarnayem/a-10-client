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