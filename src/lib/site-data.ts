export type NavItem = {
  href: string;
  zh: string;
  en: string;
};

export type SocialItem = {
  icon: "message" | "instagram" | "threads" | "mail";
  label: string;
  href: string;
};

export const navItems: NavItem[] = [
  { href: "/", zh: "首頁", en: "Home" },
  { href: "/about/", zh: "關於我們", en: "About" },
  { href: "/projects/", zh: "專案", en: "Projects" },
  { href: "/insights/", zh: "洞察", en: "Insights" },
  { href: "/resources/", zh: "資源", en: "Resources" },
  { href: "/events/", zh: "活動", en: "Events" },
  { href: "/contact/", zh: "聯絡我們", en: "Contact" },
];

export const socialItems: SocialItem[] = [
  { icon: "message", label: "LINE Bot @nccufintechlab", href: "https://page.line.me/nccufintechlab" },
  { icon: "instagram", label: "Instagram @nccufintechlab", href: "https://www.instagram.com/nccufintechlab/" },
  { icon: "threads", label: "Threads @nccufintechlab", href: "https://www.threads.com/@nccufintechlab" },
  { icon: "mail", label: "Email", href: "mailto:nccufintechlab@gmail.com" },
];

export function getBasePath() {
  return (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");
}

export function withBasePath(path: string) {
  const basePath = getBasePath();
  if (!path.startsWith("/")) return path;
  return `${basePath}${path}` || "/";
}
