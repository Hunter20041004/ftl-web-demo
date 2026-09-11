"use client";

import { useEffect } from "react";
import { getBasePath } from "@/lib/site-data";

export function MobiusVisual() {
  const basePath = getBasePath();

  useEffect(() => {
    if (document.getElementById("legacy-mobius-runtime")) return;

    const script = document.createElement("script");
    script.id = "legacy-mobius-runtime";
    script.src = `${basePath}/assets/mobius.js`;
    script.async = true;
    document.body.appendChild(script);

    return () => {
      script.remove();
      document.documentElement.classList.remove("mob-on");
      document.querySelectorAll(".mob, .mob-bg, .mob-fg").forEach((node) => node.remove());
    };
  }, [basePath]);

  return null;
}
