export function getSiteUrl(): string {
  const normalize = (url: string) =>
    url.replace(/\/$/, "").replace(/^https:\/\/ensieshop\.com$/i, "https://www.ensieshop.com");

  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return normalize(process.env.NEXT_PUBLIC_SITE_URL);
  }
  if (process.env.VERCEL_URL) {
    return normalize(`https://${process.env.VERCEL_URL}`);
  }
  return "https://www.ensieshop.com";
}
