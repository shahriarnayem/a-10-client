import "./globals.css";
import AppProviders from "@/components/providers/AppProviders";
 
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "http://localhost:3000";
 
export const metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "PromptMarket",
  title: {
    default: "PromptMarket — AI Prompt Sharing Marketplace",
    template: "%s | PromptMarket",
  },
  description:
    "Discover, publish, bookmark, review, and reuse marketplace prompts for ChatGPT, Claude, Gemini, Midjourney, and practical AI workflows.",
  keywords: [
    "AI prompts",
    "prompt marketplace",
    "ChatGPT prompts",
    "Claude prompts",
    "Gemini prompts",
    "Midjourney prompts",
  ],
  authors: [{ name: "PromptMarket" }],
  creator: "PromptMarket",
  publisher: "PromptMarket",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "PromptMarket",
    title: "PromptMarket — AI Prompt Sharing Marketplace",
    description:
      "Find reusable, creator-published prompts backed by ratings, reviews, and community activity.",
  },
  twitter: {
    card: "summary_large_image",
    title: "PromptMarket — AI Prompt Sharing Marketplace",
    description:
      "Discover and publish practical prompts for leading AI tools.",
  },
  robots: {
    index: true,
    follow: true,
  },
};
 
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
