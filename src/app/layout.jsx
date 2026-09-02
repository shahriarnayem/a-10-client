import "./globals.css";

import AppProviders from "@/components/providers/AppProviders";

export const metadata = {
  title: {
    default: "PromptMarket",
    template: "%s | PromptMarket",
  },
  description:
    "Discover, publish, and manage reusable AI prompts.",
};

export default function RootLayout({
  children,
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}