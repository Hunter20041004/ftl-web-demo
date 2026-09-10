import { LegacyRuntime } from "@/components/legacy/LegacyRuntime";
import { readLegacyPage, type LegacyPageName } from "@/lib/legacy-page";

export function LegacyPage({ name, mobius = false }: { name: LegacyPageName; mobius?: boolean }) {
  const page = readLegacyPage(name);

  return (
    <>
      <div id="site-header" />
      <main
        id={page.mainId}
        className={page.mainClassName}
        dangerouslySetInnerHTML={{ __html: page.html }}
      />
      <div id="site-footer" />
      <LegacyRuntime mobius={mobius} />
    </>
  );
}
