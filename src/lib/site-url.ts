export function getSiteUrl(): string {
  const normalize = (url: string) =>
    url.replace(/\/$/, "").replace(/^https:\/\/ensieshop\.com$/i, "https://www.ensieshop.com");

  if (process.env.NEXT_PUBLIC_SITE_URL) {
    const configuredUrl = normalize(process.env.NEXT_PUBLIC_SITE_URL);
    if (!configuredUrl.includes(".vercel.app")) {
      return configuredUrl;
    }
  }

  return "https://www.ensieshop.com";
}
