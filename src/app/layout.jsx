import "./globals.css";
import AppProviders from "@/components/providers/AppProviders";
 
export const metadata = {
  title: {
    default: "PromptMarket",
    template: "%s | PromptMarket",
  },
  description: "Discover and publish reusable prompts for leading AI tools.",
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
