import type { ReactNode } from "react";
import { SiteFooter, SiteHeader } from "@/components/layout/SiteChrome";
import { BasePathLinks } from "@/components/runtime/BasePathLinks";
import { MotionEnhancements } from "@/components/runtime/MotionEnhancements";
import { SiteInteractions } from "@/components/runtime/SiteInteractions";

type SitePageShellProps = {
  children: ReactNode;
};

export function SitePageShell({ children }: SitePageShellProps) {
  return (
    <>
      <SiteHeader />
      {children}
      <SiteFooter />
      <BasePathLinks />
      <SiteInteractions />
      <MotionEnhancements />
    </>
  );
}
