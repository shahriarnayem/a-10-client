import { marketplaceRequest } from "@/lib/marketplaceApi";
 
export function getNotifications(unreadOnly = false) {
  return marketplaceRequest(
    `/api/notifications?unreadOnly=${unreadOnly ? "true" : "false"}`,
  );
}
 
export function markNotificationRead(notificationId) {
  return marketplaceRequest(`/api/notifications/${notificationId}/read`, {
    method: "PATCH",
  });
}
 
export function markAllNotificationsRead() {
  return marketplaceRequest("/api/notifications/read-all", {
    method: "PATCH",
  });
}
