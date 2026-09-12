"use client";

import { useEffect } from "react";

const HOME_SELECTOR = 'main.page[data-visual-baseline="v1-main-fa033f0"]';

function setActive(items: HTMLElement[], index: number) {
  items.forEach((item, itemIndex) => {
    const active = itemIndex === index;
    item.dataset.active = String(active);
    item.setAttribute("aria-current", active ? "true" : "false");
  });
}

export function HomeReferenceExperience() {
  useEffect(() => {
    const home = document.querySelector<HTMLElement>(HOME_SELECTOR);
    if (!home) return;

    document.body.dataset.startupReference = "true";
    home.dataset.startupReference = "true";

    const cleanups: Array<() => void> = [];

    // AgentCat-inspired persistent CTA: keep one high-intent action available in the sticky nav.
    const navSide = document.querySelector<HTMLElement>(".nav__side");
    let navCta = document.querySelector<HTMLAnchorElement>(".nav__cta");
    if (navSide && !navCta) {
      navCta = document.createElement("a");
      navCta.className = "nav__cta";
      const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");
      navCta.href = `${basePath}/contact/`;
      navCta.dataset.en = "Join FTL";
      let lang: "zh" | "en" = "zh";
      try {
        lang = localStorage.getItem("ftl-lang") === "en" ? "en" : "zh";
      } catch {
        lang = "zh";
      }
      navCta.textContent = lang === "en" ? "Join FTL" : "加入 FTL";
      navSide.prepend(navCta);
      cleanups.push(() => navCta?.remove());
    }

    // Hero behaves like a product demo stage: tab focus changes the topology emphasis.
    const hero = home.querySelector<HTMLElement>(".hero");
    const heroStage = hero?.querySelector<HTMLElement>(".pane--rows");
    const heroNetwork = hero?.querySelector<HTMLElement>('[data-transaction-network="hero"]');
    const heroRows = heroStage ? Array.from(heroStage.querySelectorAll<HTMLElement>(".ios-row")) : [];
    if (hero && heroStage && heroNetwork && heroRows.length) {
      heroStage.dataset.referenceStage = "hero";
      heroStage.classList.add("hero__reference-stage");

      const chrome = document.createElement("div");
      chrome.className = "hero-stage__chrome";
      chrome.innerHTML = '<span class="hero-stage__label">FTL NETWORK</span><span class="hero-stage__status"><i aria-hidden="true"></i>LIVE</span>';
      heroStage.prepend(chrome);
      cleanups.push(() => chrome.remove());

      const focusHero = (index: number) => {
        hero.dataset.heroFocus = String(index);
        heroNetwork.dataset.focus = String(index);
        setActive(heroRows, index);
      };
      focusHero(0);

      heroRows.forEach((row, index) => {
        const enter = () => focusHero(index);
        row.addEventListener("pointerenter", enter);
        row.addEventListener("focus", enter);
        cleanups.push(() => {
          row.removeEventListener("pointerenter", enter);
          row.removeEventListener("focus", enter);
        });
      });

      const move = (event: PointerEvent) => {
        const rect = heroStage.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
        const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
        heroStage.style.setProperty("--ref-x", `${(x * 100).toFixed(2)}%`);
        heroStage.style.setProperty("--ref-y", `${(y * 100).toFixed(2)}%`);
      };
      const leave = () => {
        heroStage.style.setProperty("--ref-x", "72%");
        heroStage.style.setProperty("--ref-y", "28%");
      };
      heroStage.addEventListener("pointermove", move, { passive: true });
      heroStage.addEventListener("pointerleave", leave);
      cleanups.push(() => {
        heroStage.removeEventListener("pointermove", move);
        heroStage.removeEventListener("pointerleave", leave);
      });
    }

    // AgentCat-style width-shifting story carousel, while keeping the existing editorial content.
    const weekly = home.querySelector<HTMLElement>("#weekly .weekly");
    const weeklyCards = weekly ? Array.from(weekly.querySelectorAll<HTMLElement>(".card")) : [];
    if (weekly && weeklyCards.length) {
      weekly.dataset.startupCarousel = "true";
      const focusWeekly = (index: number) => {
        weekly.dataset.activeCard = String(index);
        setActive(weeklyCards, index);
      };
      focusWeekly(0);
      weeklyCards.forEach((card, index) => {
        const enter = () => focusWeekly(index);
        card.addEventListener("pointerenter", enter);
        card.addEventListener("focus", enter);
        cleanups.push(() => {
          card.removeEventListener("pointerenter", enter);
          card.removeEventListener("focus", enter);
        });
      });
    }

    // Anchr-inspired architecture stack: one mission layer is foregrounded at a time.
    const mission = home.querySelector<HTMLElement>("#mission .numlist");
    const missionRows = mission ? Array.from(mission.querySelectorAll<HTMLElement>(":scope > .nl")) : [];
    if (mission && missionRows.length) {
      mission.dataset.layerStack = "true";
      const focusMission = (index: number) => {
        mission.dataset.activeLayer = String(index);
        setActive(missionRows, index);
      };
      focusMission(0);
      missionRows.forEach((row, index) => {
        row.tabIndex = 0;
        row.setAttribute("role", "button");
        const activate = () => focusMission(index);
        const keydown = (event: KeyboardEvent) => {
          if (event.key !== "Enter" && event.key !== " ") return;
          event.preventDefault();
          activate();
        };
        row.addEventListener("pointerenter", activate);
        row.addEventListener("focus", activate);
        row.addEventListener("click", activate);
        row.addEventListener("keydown", keydown);
        cleanups.push(() => {
          row.removeEventListener("pointerenter", activate);
          row.removeEventListener("focus", activate);
          row.removeEventListener("click", activate);
          row.removeEventListener("keydown", keydown);
        });
      });
    }

    // Outcomes behave like a restrained state-driven stack instead of static rows.
    const agenda = home.querySelector<HTMLElement>("#events .agenda");
    const eventCards = agenda ? Array.from(agenda.querySelectorAll<HTMLElement>(".card--event")) : [];
    if (agenda && eventCards.length) {
      agenda.dataset.outcomeStack = "true";
      const focusEvent = (index: number) => {
        agenda.dataset.activeEvent = String(index);
        setActive(eventCards, index);
      };
      focusEvent(0);
      eventCards.forEach((card, index) => {
        const enter = () => focusEvent(index);
        card.addEventListener("pointerenter", enter);
        card.addEventListener("focus", enter);
        cleanups.push(() => {
          card.removeEventListener("pointerenter", enter);
          card.removeEventListener("focus", enter);
        });
      });
    }

    // Contact gets a very soft pointer-following light field, keeping the same brand blue.
    const contact = home.querySelector<HTMLElement>("#contact");
    if (contact && window.matchMedia("(hover:hover) and (pointer:fine)").matches) {
      const move = (event: PointerEvent) => {
        const rect = contact.getBoundingClientRect();
        contact.style.setProperty("--contact-x", `${event.clientX - rect.left}px`);
        contact.style.setProperty("--contact-y", `${event.clientY - rect.top}px`);
      };
      contact.addEventListener("pointermove", move, { passive: true });
      cleanups.push(() => contact.removeEventListener("pointermove", move));
    }

    return () => {
      cleanups.reverse().forEach((cleanup) => cleanup());
      delete document.body.dataset.startupReference;
    };
  }, []);

  return null;
}
