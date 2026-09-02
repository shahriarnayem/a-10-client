import { Suspense } from "react";
import PaymentClient from "@/components/payments/PaymentClient";
 
export const metadata = {
  title: "Premium Access",
  description:
    "Unlock every private AI prompt with one secure marketplace payment.",
};
 
export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <p className="bg-slate-950 py-24 text-center text-slate-300">
          Loading premium access…
        </p>
      }
    >
      <PaymentClient />
    </Suspense>
  );
}
