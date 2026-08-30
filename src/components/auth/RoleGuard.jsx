"use client";
 
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
 
export default function RoleGuard({ allowedRoles, children }) {
  const router = useRouter();
  const { marketplaceUser, loading } = useAuth();
  const allowed = allowedRoles.includes(marketplaceUser?.role);
 
  useEffect(() => {
    if (!loading && marketplaceUser && !allowed) router.replace("/dashboard");
  }, [allowed, loading, marketplaceUser, router]);
 
  return loading || !marketplaceUser || !allowed ? null : children;
}
