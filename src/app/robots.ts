import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://hunter20041004.github.io/ftl-web-demo/sitemap.xml",
  };
}
