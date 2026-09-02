import { Suspense } from "react";
import PaymentSuccessClient from "@/components/payments/PaymentSuccessClient";
 
export const metadata = {
  title: "Payment Complete",
  description: "Verify PromptMarket premium access after Stripe Checkout.",
};
 
export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <p className="py-24 text-center text-slate-600">
          Loading payment confirmation…
        </p>
      }
    >
      <PaymentSuccessClient />
    </Suspense>
  );
}
