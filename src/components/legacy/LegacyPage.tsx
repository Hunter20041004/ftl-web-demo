import { SiteFooter, SiteHeader } from "@/components/layout/SiteChrome";
import { LegacyRuntime } from "@/components/legacy/LegacyRuntime";
import { readLegacyPage, type LegacyPageName } from "@/lib/legacy-page";

export function LegacyPage({ name, mobius = false }: { name: LegacyPageName; mobius?: boolean }) {
  const page = readLegacyPage(name);

  return (
    <>
      <SiteHeader />
      <main
        id={page.mainId}
        className={page.mainClassName}
        dangerouslySetInnerHTML={{ __html: page.html }}
      />
      <SiteFooter />
      <LegacyRuntime mobius={mobius} />
    </>
  );
}
