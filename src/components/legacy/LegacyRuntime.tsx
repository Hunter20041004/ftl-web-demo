"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useCallback } from "react";

const legacyRouteMap: Record<string, string> = {
  "index.html": "/",
  "about.html": "/about/",
  "projects.html": "/projects/",
  "insights.html": "/insights/",
  "resources.html": "/resources/",
  "events.html": "/events/",
  "contact.html": "/contact/",
};

function normalizeBasePath() {
  return (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");
}

export function LegacyRuntime() {
  const pathname = usePathname();
  const basePath = normalizeBasePath();

  const repairLegacyRuntime = useCallback(() => {
    document.querySelectorAll<HTMLAnchorElement>("a[href]").forEach((anchor) => {
      const href = anchor.getAttribute("href");
      if (!href) return;
      const [path, hash = ""] = href.split("#");
      const mapped = legacyRouteMap[path];
      if (mapped) anchor.setAttribute("href", `${basePath}${mapped}${hash ? `#${hash}` : ""}`);
    });

    const current = pathname === "/" ? "/" : `${pathname.replace(/\/$/, "")}/`;
    document.querySelectorAll<HTMLAnchorElement>(".nav__link,.sheet__link").forEach((anchor) => {
      const url = new URL(anchor.href, window.location.origin);
      const comparable = url.pathname.replace(basePath, "") || "/";
      if (comparable === current) anchor.setAttribute("aria-current", "page");
      else anchor.removeAttribute("aria-current");
    });
  }, [basePath, pathname]);

  return (
    <Script
      id="legacy-ftl-runtime"
      src={`${basePath}/assets/ftl.js`}
      strategy="afterInteractive"
      onLoad={repairLegacyRuntime}
    />
  );
}
