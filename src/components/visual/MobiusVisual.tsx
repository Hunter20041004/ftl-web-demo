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
          pulse.classList.add("mob-ribbon__halo");

          const core = pulse.cloneNode(false) as SVGPathElement;
          core.removeAttribute("style");
          core.removeAttribute("class");
          core.removeAttribute("data-ribbon-materialized");
          core.classList.add("mob-ribbon__core");

          const dash = pulse.cloneNode(false) as SVGPathElement;
          dash.removeAttribute("style");
          dash.removeAttribute("class");
          dash.removeAttribute("data-ribbon-materialized");
          dash.classList.add("mob-ribbon__dash");

          pulse.after(core);
          core.after(dash);
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
