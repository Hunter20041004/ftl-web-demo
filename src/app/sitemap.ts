import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const origin = "https://hunter20041004.github.io/ftl-web-demo";
const routes = ["", "/about", "/projects", "/insights", "/resources", "/events", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({ url: `${origin}${route}/`, changeFrequency: "weekly" }));
}
