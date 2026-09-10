import { readFileSync } from "node:fs";
import { join } from "node:path";

export type LegacyPageName =
  | "index"
  | "about"
  | "projects"
  | "insights"
  | "resources"
  | "events"
  | "contact";

const routeMap: Record<string, string> = {
  "index.html": "/",
  "about.html": "/about/",
  "projects.html": "/projects/",
  "insights.html": "/insights/",
  "resources.html": "/resources/",
  "events.html": "/events/",
  "contact.html": "/contact/",
};

function basePath() {
  return process.env.NEXT_PUBLIC_BASE_PATH?.replace(/\/$/, "") ?? "";
}

function withBase(path: string) {
  const base = basePath();
  return `${base}${path}` || "/";
}

function rewriteInternalLinks(html: string) {
  let next = html;
  for (const [legacy, route] of Object.entries(routeMap)) {
    next = next.replaceAll(`href=\"${legacy}`, `href=\"${withBase(route)}`);
    next = next.replaceAll(`href='${legacy}`, `href='${withBase(route)}`);
  }
  next = next.replaceAll('src=\"assets/', `src=\"${withBase("/assets/")}`);
  next = next.replaceAll("src='assets/", `src='${withBase("/assets/")}`);
  return next;
}

export function readLegacyPage(name: LegacyPageName) {
  const source = readFileSync(join(process.cwd(), `${name}.html`), "utf8");
  const main = source.match(/<main\b([^>]*)>([\s\S]*?)<\/main>/i);
  if (!main) throw new Error(`Could not find <main> in ${name}.html`);

  const classMatch = main[1].match(/class=[\"']([^\"']+)[\"']/i);
  const idMatch = main[1].match(/id=[\"']([^\"']+)[\"']/i);
  const title = source.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim();
  const description = source.match(/<meta\s+name=[\"']description[\"']\s+content=[\"']([^\"']*)[\"']/i)?.[1]?.trim();

  return {
    html: rewriteInternalLinks(main[2]),
    mainClassName: classMatch?.[1] ?? "page",
    mainId: idMatch?.[1] ?? "main",
    title,
    description,
  };
}
