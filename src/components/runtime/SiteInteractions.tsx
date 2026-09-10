"use client";

import { useEffect } from "react";

const ICONS: Record<string, string> = {
  "arrow-right": '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  "chevron-right": '<path d="m9 18 6-6-6-6"/>',
  "arrow-up-right": '<path d="M7 7h10v10"/><path d="M7 17 17 7"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
  message: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
  instagram: '<rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><path d="M17.5 6.5h.01"/>',
  threads: '<circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  book: '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>',
  briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
  trophy: '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',
  file: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v5h5"/><path d="M16 13H8M16 17H8M10 9H8"/>',
  news: '<path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8M15 18h-5M10 6h8v4h-8V6Z"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  cap: '<path d="M22 10v6"/><path d="M6 12.5V16c0 1 2.5 3 6 3s6-2 6-3v-3.5"/><path d="m2 10 10-5 10 5-10 5z"/>',
  rocket: '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91 0z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',
  shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  close: '<path d="M18 6 6 18M6 6l12 12"/>',
  globe: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
  external: '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
  check: '<path d="M21.8 10A10 10 0 1 1 17 3.34"/><path d="m9 11 3 3L22 4"/>',
  alert: '<circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>',
  inbox: '<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  trend: '<path d="M16 7h6v6"/><path d="m22 7-8.5 8.5-5-5L2 17"/>',
  sparkle: '<path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3z"/>',
  building: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01"/>',
  layers: '<path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"/><path d="m6.08 9.5-3.5 1.6a1 1 0 0 0 0 1.81l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9a1 1 0 0 0 0-1.83l-3.5-1.59"/><path d="m6.08 14.5-3.5 1.6a1 1 0 0 0 0 1.81l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9a1 1 0 0 0 0-1.83l-3.5-1.59"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',
};

function mountSprite() {
  if (document.getElementById("ftl-icon-sprite")) return;
  const symbols = Object.entries(ICONS)
    .map(([name, paths]) => `<symbol id="i-${name}" viewBox="0 0 24 24">${paths}</symbol>`)
    .join("");
  document.body.insertAdjacentHTML(
    "afterbegin",
    `<svg id="ftl-icon-sprite" aria-hidden="true" style="position:absolute;width:0;height:0;overflow:hidden">${symbols}</svg>`,
  );
}

function readLang() {
  try {
    return localStorage.getItem("ftl-lang") === "en" ? "en" : "zh";
  } catch {
    return "zh";
  }
}

function applyLang(lang: "zh" | "en") {
  document.documentElement.lang = lang === "en" ? "en" : "zh-Hant-TW";
  document.querySelectorAll<HTMLElement>("[data-en]").forEach((el) => {
    if (el.dataset.zh === undefined) el.dataset.zh = el.innerHTML;
    el.innerHTML = lang === "en" ? el.dataset.en ?? el.innerHTML : el.dataset.zh;
  });
  document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("[data-en-ph]").forEach((el) => {
    if (el.dataset.zhPh === undefined) el.dataset.zhPh = el.placeholder;
    el.placeholder = lang === "en" ? el.dataset.enPh ?? el.placeholder : el.dataset.zhPh;
  });
  document.querySelectorAll<HTMLElement>(".lang").forEach((el) => (el.dataset.lang = lang));
  document.querySelectorAll<HTMLButtonElement>("[data-set-lang]").forEach((el) =>
    el.setAttribute("aria-pressed", String(el.dataset.setLang === lang)),
  );
}

export function SiteInteractions() {
  useEffect(() => {
    mountSprite();

    document.querySelectorAll<HTMLElement>("[data-stagger]").forEach((box) => {
      Array.from(box.children).forEach((child, index) =>
        (child as HTMLElement).style.setProperty("--i", String(index)),
      );
    });

    document.querySelectorAll<HTMLElement>(".marquee__track").forEach((track) => {
      if (track.dataset.cloned === "true") return;
      const group = track.querySelector(".marquee__group");
      if (group) {
        track.appendChild(group.cloneNode(true));
        track.dataset.cloned = "true";
      }
    });

    applyLang(readLang());

    const nav = document.querySelector<HTMLElement>(".nav");
    const blueField = document.querySelector<HTMLElement>(".blue-field");
    if (nav && blueField) nav.classList.add("nav--onblue");
    const onScroll = () => {
      if (!nav) return;
      const field = document.querySelector<HTMLElement>(".blue-field");
      const trigger = field ? field.getBoundingClientRect().bottom - 40 : 8;
      nav.dataset.stuck = String(trigger < 0 || (window.scrollY > 8 && !field));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const sheet = document.getElementById("mobile-sheet");
    const setSheet = (open: boolean) => {
      if (!sheet) return;
      sheet.dataset.open = String(open);
      document.body.style.overflow = open ? "hidden" : "";
      document.querySelector<HTMLElement>("[data-menu-open]")?.setAttribute("aria-expanded", String(open));
      if (open) sheet.querySelector<HTMLElement>("a,button")?.focus();
    };

    const onClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      if (!target) return;
      if (target.closest("[data-menu-open]")) setSheet(true);
      if (target.closest("[data-menu-close], .sheet__link")) setSheet(false);

      const langButton = target.closest<HTMLButtonElement>("[data-set-lang]");
      if (langButton?.dataset.setLang === "zh" || langButton?.dataset.setLang === "en") {
        const lang = langButton.dataset.setLang;
        try { localStorage.setItem("ftl-lang", lang); } catch {}
        applyLang(lang);
      }

      const filterButton = target.closest<HTMLButtonElement>(".filter");
      const group = filterButton?.closest<HTMLElement>("[data-filter-group]");
      if (filterButton && group) {
        const targetSelector = group.dataset.filterTarget;
        const list = targetSelector ? document.querySelector<HTMLElement>(targetSelector) : null;
        if (!list) return;
        group.querySelectorAll<HTMLButtonElement>(".filter").forEach((button) =>
          button.setAttribute("aria-pressed", String(button === filterButton)),
        );
        const wanted = filterButton.dataset.filter ?? "all";
        let shown = 0;
        list.querySelectorAll<HTMLElement>("[data-cat]").forEach((card) => {
          const matches = wanted === "all" || (card.dataset.cat ?? "").split(" ").includes(wanted);
          card.hidden = !matches;
          if (matches) shown += 1;
        });
        const emptySelector = group.dataset.filterEmpty;
        if (emptySelector) document.querySelector<HTMLElement>(emptySelector)?.setAttribute("data-show", String(shown === 0));
      }
    };
    document.addEventListener("click", onClick);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && sheet?.dataset.open === "true") setSheet(false);
    };
    document.addEventListener("keydown", onKeyDown);

    const revealItems = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    let revealObserver: IntersectionObserver | undefined;
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      revealItems.forEach((item) => item.classList.add("in"));
    } else {
      revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });
      revealItems.forEach((item) => revealObserver?.observe(item));
    }

    const form = document.querySelector<HTMLFormElement>("[data-demo-form]");
    const onSubmit = (event: SubmitEvent) => {
      event.preventDefault();
      if (!form) return;
      const note = form.querySelector<HTMLElement>(".form-note");
      const submit = form.querySelector<HTMLButtonElement>("[type='submit']");
      let bad: HTMLInputElement | HTMLTextAreaElement | null = null;
      for (const field of form.querySelectorAll<HTMLElement>(".field")) {
        const input = field.querySelector<HTMLInputElement | HTMLTextAreaElement>("input,textarea");
        if (!input?.required) continue;
        const invalid = !input.value.trim() || (input instanceof HTMLInputElement && input.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim()));
        field.dataset.invalid = String(invalid);
        if (invalid && !bad) bad = input;
      }
      if (bad) {
        bad.focus();
        if (note) note.dataset.show = "false";
        return;
      }
      if (!submit) return;
      const original = submit.innerHTML;
      submit.disabled = true;
      submit.innerHTML = `<span class="spinner"></span><span>${readLang() === "en" ? "Sending…" : "送出中…"}</span>`;
      window.setTimeout(() => {
        submit.disabled = false;
        submit.innerHTML = original;
        if (note) note.dataset.show = "true";
        form.reset();
      }, 1400);
    };
    const onInput = (event: Event) => {
      const target = event.target as Element | null;
      const field = target?.closest<HTMLElement>(".field");
      if (field?.dataset.invalid === "true") field.dataset.invalid = "false";
    };
    form?.addEventListener("submit", onSubmit);
    form?.addEventListener("input", onInput);

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKeyDown);
      revealObserver?.disconnect();
      form?.removeEventListener("submit", onSubmit);
      form?.removeEventListener("input", onInput);
      document.body.style.overflow = "";
    };
  }, []);

  return null;
}