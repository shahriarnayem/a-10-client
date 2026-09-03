const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "http://localhost:3000";
 
export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/prompts"],
        disallow: ["/dashboard", "/payment"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
