"use client";

import { useEffect } from "react";

export function BasePathLinks() {
  useEffect(() => {
    const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");
    if (!basePath) return;

    document.querySelectorAll<HTMLAnchorElement>('a[href^="/"]').forEach((anchor) => {
      const href = anchor.getAttribute("href");
      if (!href || href === basePath || href.startsWith(`${basePath}/`)) return;
      anchor.setAttribute("href", `${basePath}${href}`);
    });
  }, []);

  return null;
}
