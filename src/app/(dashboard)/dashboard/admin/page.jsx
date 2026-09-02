"use client";
 
import AdminDashboardClient from "@/components/admin/AdminDashboardClient";
import RoleGuard from "@/components/auth/RoleGuard";
 
export default function AdminDashboardPage() {
  return (
    <RoleGuard allowedRoles={["admin"]}>
      <AdminDashboardClient />
    </RoleGuard>
  );
}
