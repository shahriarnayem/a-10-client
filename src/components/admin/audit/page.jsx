import { Suspense } from "react";
import AuditLogClient from "@/components/admin/AuditLogClient";
 
export default function AdminAuditPage() {
  return (
    <Suspense fallback={<p className="text-slate-300">Loading audit log…</p>}>
      <AuditLogClient />
    </Suspense>
  );
}
