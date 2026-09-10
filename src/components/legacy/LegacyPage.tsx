import { SiteFooter, SiteHeader } from "@/components/layout/SiteChrome";
import { SiteInteractions } from "@/components/runtime/SiteInteractions";
import { MobiusVisual } from "@/components/visual/MobiusVisual";
import { readLegacyPage, type LegacyPageName } from "@/lib/legacy-page";

export function LegacyPage({ name, mobius = false }: { name: LegacyPageName; mobius?: boolean }) {
  const page = readLegacyPage(name);

  return (
    <>
      <SiteHeader />
      {mobius ? <MobiusVisual /> : null}
      <main
        id={page.mainId}
        className={page.mainClassName}
        dangerouslySetInnerHTML={{ __html: page.html }}
      />
      <SiteFooter />
      <SiteInteractions />
    </>
  );
}
