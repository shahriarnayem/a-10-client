import { marketplaceRequest } from "@/lib/marketplaceApi";
 
export function createPremiumCheckout(returnTo = "/prompts") {
  return marketplaceRequest("/api/payments/checkout-session", {
    method: "POST",
    body: JSON.stringify({ returnTo }),
  });
}
 
export function getPremiumCheckout(sessionId) {
  return marketplaceRequest(
    `/api/payments/checkout-session/${encodeURIComponent(sessionId)}`,
  );
}
