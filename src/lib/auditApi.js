import { marketplaceRequest } from "@/lib/marketplaceApi";
 
export function getAuditLog(parameters = {}) {
  const query = new URLSearchParams();
 
  Object.entries(parameters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, value);
    }
  });
 
  return marketplaceRequest(`/api/admin/audit?${query.toString()}`);
}
