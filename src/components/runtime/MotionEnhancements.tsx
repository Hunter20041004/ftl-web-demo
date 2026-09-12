"use client";

import { useEffect } from "react";

// 捲動填色：.fill-text 裡的每個詞進入視口時逐一加 .in，字從淡藍虛影灌成深色。
// 只有這一個捲動動效；首屏 logo 的動畫是純 CSS（見 LogoDraw）。
export function MotionEnhancements() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.querySelectorAll<HTMLElement>(".fill-text .w").forEach((word) => word.classList.add("in"));
      return;
    }

    const blocks = Array.from(document.querySelectorAll<HTMLElement>("[data-fill-text]"));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const words = Array.from(entry.target.querySelectorAll<HTMLElement>(".w"));
        words.forEach((word, index) => {
          window.setTimeout(() => word.classList.add("in"), index * 140);
        });
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.5 });
    blocks.forEach((block) => observer.observe(block));

    return () => observer.disconnect();
  }, []);

  return null;
}
