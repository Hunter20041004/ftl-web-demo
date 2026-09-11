"use client";

import { useEffect } from "react";
import { getBasePath } from "@/lib/site-data";

export function MobiusVisual() {
  const basePath = getBasePath();

  useEffect(() => {
    if (document.getElementById("legacy-mobius-runtime")) return;

    const materializeRibbon = () => {
      document
        .querySelectorAll<SVGPathElement>(".mob .pulse:not([data-ribbon-materialized])")
        .forEach((pulse) => {
          pulse.dataset.ribbonMaterialized = "true";
          pulse.removeAttribute("style");
          pulse.classList.remove("pulse");
          pulse.classList.add("mob-ribbon__specular");

          const glint = pulse.cloneNode(false) as SVGPathElement;
          glint.removeAttribute("style");
          glint.removeAttribute("class");
          glint.removeAttribute("data-ribbon-materialized");
          glint.classList.add("mob-ribbon__glint");

          pulse.after(glint);
        });
    };

    const observer = new MutationObserver(materializeRibbon);
    observer.observe(document.body, { childList: true, subtree: true });

    const script = document.createElement("script");
    script.id = "legacy-mobius-runtime";
    script.src = `${basePath}/assets/mobius.js`;
    script.async = true;
    script.addEventListener("load", materializeRibbon);
    document.body.appendChild(script);

    return () => {
      observer.disconnect();
      script.remove();
      document.documentElement.classList.remove("mob-on");
      document.querySelectorAll(".mob, .mob-bg, .mob-fg").forEach((node) => node.remove());
    };
  }, [basePath]);

  return null;
}
