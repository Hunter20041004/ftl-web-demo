import type { ReactNode } from "react";
import { SiteFooter, SiteHeader } from "@/components/layout/SiteChrome";
import { SiteInteractions } from "@/components/runtime/SiteInteractions";
import { MobiusVisual } from "@/components/visual/MobiusVisual";

type SitePageShellProps = {
  children: ReactNode;
  mobius?: boolean;
};

export function SitePageShell({ children, mobius = false }: SitePageShellProps) {
  return (
    <>
      <SiteHeader />
      {mobius ? <MobiusVisual /> : null}
      {children}
      <SiteFooter />
      <SiteInteractions />
    </>
  );
}
