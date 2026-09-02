import { marketplaceRequest } from "@/lib/marketplaceApi";
 
export function getAdminOverview() {
  return marketplaceRequest("/api/admin/overview");
}
 
export function getAdminPrompts(status = "pending") {
  return marketplaceRequest(
    `/api/admin/prompts?status=${encodeURIComponent(status)}&limit=50`,
  );
}
 
export function moderateAdminPrompt(promptId, action, rejectionFeedback = "") {
  return marketplaceRequest(`/api/admin/prompts/${promptId}/moderate`, {
    method: "PATCH",
    body: JSON.stringify({ action, rejectionFeedback }),
  });
}
 
export function getAdminUsers(search = "") {
  const query = new URLSearchParams({ limit: "50" });
 
  if (search.trim()) {
    query.set("search", search.trim());
  }
 
  return marketplaceRequest(`/api/admin/users?${query.toString()}`);
}
 
export function updateAdminUser(userId, changes) {
  return marketplaceRequest(`/api/admin/users/${userId}`, {
    method: "PATCH",
    body: JSON.stringify(changes),
  });
}
 
export function sendAdminWarning(userId, message) {
  return marketplaceRequest(`/api/admin/users/${userId}/warnings`, {
    method: "POST",
    body: JSON.stringify({ message }),
  });
}
 
export function getAdminReports(status = "open") {
  return marketplaceRequest(
    `/api/admin/reports?status=${encodeURIComponent(status)}`,
  );
}
 
export function resolveAdminReport(reportId, status, resolutionNote) {
  return marketplaceRequest(`/api/admin/reports/${reportId}`, {
    method: "PATCH",
    body: JSON.stringify({ status, resolutionNote }),
  });
}
