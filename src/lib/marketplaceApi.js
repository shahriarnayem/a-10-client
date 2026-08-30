const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:5000";
 
export function getMarketplaceToken() {
  return typeof window === "undefined" ? null : sessionStorage.getItem("aiPromptMarketplaceToken");
}
 
export async function marketplaceRequest(path, options = {}) {
  const token = getMarketplaceToken();
  const headers = new Headers(options.headers || {});
  if (!(options.body instanceof FormData) && options.body) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);
 
  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = await response.json().catch(() => ({ message: "The marketplace server returned an unreadable response." }));
  if (!response.ok) throw new Error(data.message || "The AI prompt marketplace request was unsuccessful.");
  return data;
}