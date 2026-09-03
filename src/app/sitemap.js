const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "http://localhost:3000";
const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
 
export default async function sitemap() {
  const now = new Date();
  const staticEntries = [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/prompts`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/register`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/login`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];
 
  if (!apiUrl) {
    return staticEntries;
  }
 
  try {
    const response = await fetch(
      `${apiUrl}/api/prompts?page=1&limit=24&sort=latest`,
      { next: { revalidate: 3600 } },
    );
 
    if (!response.ok) {
      return staticEntries;
    }
 
    const data = await response.json();
    const promptEntries = (data.prompts || []).map((prompt) => ({
      url: `${siteUrl}/prompts/${prompt._id}`,
      lastModified: new Date(prompt.updatedAt || prompt.createdAt || now),
      changeFrequency: "weekly",
      priority: 0.7,
    }));
 
    return [...staticEntries, ...promptEntries];
  } catch {
    return staticEntries;
  }
}
