"use client";

import { useEffect } from "react";

export function MotionEnhancements() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const counters = Array.from(document.querySelectorAll<HTMLElement>(".stat b, .step b"));
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target as HTMLElement;
        const raw = el.textContent?.trim() ?? "";
        const target = Number.parseInt(raw, 10);
        if (Number.isNaN(target)) return;
        const shouldPad = raw.length > String(target).length;
        const start = performance.now();
        const duration = 900;
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          const value = Math.round(target * eased);
          const rendered = shouldPad ? String(value).padStart(raw.length, "0") : String(value);
          el.textContent = rendered;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        counterObserver.unobserve(el);
      });
    }, { threshold: 0.6 });
    counters.forEach((el) => counterObserver.observe(el));

    const hero = document.querySelector<HTMLElement>(".hero");
    let cleanupHero = () => {};
    if (hero && window.matchMedia("(hover:hover) and (pointer:fine)").matches) {
      const layers = [
        { el: hero.querySelector<HTMLElement>(".hero__bloom"), factor: 8 },
        { el: hero.querySelector<HTMLElement>(".hero__grid"), factor: -2 },
      ].filter((layer): layer is { el: HTMLElement; factor: number } => Boolean(layer.el));
      let x = 0;
      let y = 0;
      let raf = 0;
      const apply = () => {
        raf = 0;
        layers.forEach(({ el, factor }) => {
          el.style.transform = `translate3d(${(x * factor).toFixed(2)}px, ${(y * factor).toFixed(2)}px, 0)`;
        });
      };
      const queue = () => { if (!raf) raf = requestAnimationFrame(apply); };
      const onMove = (event: MouseEvent) => {
        const rect = hero.getBoundingClientRect();
        x = (event.clientX - rect.left) / rect.width - 0.5;
        y = (event.clientY - rect.top) / rect.height - 0.5;
        queue();
      };
      const onLeave = () => { x = 0; y = 0; queue(); };
      hero.addEventListener("mousemove", onMove, { passive: true });
      hero.addEventListener("mouseleave", onLeave);
      cleanupHero = () => {
        hero.removeEventListener("mousemove", onMove);
        hero.removeEventListener("mouseleave", onLeave);
        if (raf) cancelAnimationFrame(raf);
        layers.forEach(({ el }) => { el.style.transform = ""; });
      };
    }

    return () => {
      counterObserver.disconnect();
      cleanupHero();
    };
  }, []);

  return null;
}
