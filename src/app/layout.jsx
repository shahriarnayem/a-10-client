import './globals.css';

export const metadata = {
  title: {
    default: 'AI Prompt Marketplace',
    template: '%s | AI Prompt Marketplace',
  },
  description:
    'Discover, share, bookmark, and manage high-quality prompts for ChatGPT, Gemini, Claude, Midjourney, and other AI tools.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}