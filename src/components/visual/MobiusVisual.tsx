"use client";

import Script from "next/script";
import { getBasePath } from "@/lib/site-data";

export function MobiusVisual() {
  const basePath = getBasePath();
  return (
    <Script
      id="legacy-mobius-runtime"
      src={`${basePath}/assets/mobius.js`}
      strategy="afterInteractive"
    />
  );
}
