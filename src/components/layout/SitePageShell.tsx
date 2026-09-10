import type { ReactNode } from "react";
import { SiteFooter, SiteHeader } from "@/components/layout/SiteChrome";
import { BasePathLinks } from "@/components/runtime/BasePathLinks";
import { MotionEnhancements } from "@/components/runtime/MotionEnhancements";
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
      <BasePathLinks />
      <SiteInteractions />
      <MotionEnhancements />
    </>
  );
}
