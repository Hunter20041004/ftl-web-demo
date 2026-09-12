import { SitePageShell } from "@/components/layout/SitePageShell";
import { ProjectsWall } from "@/components/projects/ProjectsWall";

// 專案頁：專案牆，一行三張；點進去看該專案的投影片。
export function ProjectsPage() {
  return (
    <SitePageShell>
      <main id="main" className="page">
        <section className="pagehead">
          <div className="wrap reveal">
            <span className="eyebrow" data-en="Projects" suppressHydrationWarning>專案</span>
            <h1 className="h1" data-en="What members have built" suppressHydrationWarning>社員做過的專案</h1>
          </div>
        </section>
        <section className="section--tight section">
          <div className="wrap">
            <ProjectsWall />
          </div>
        </section>
      </main>
    </SitePageShell>
  );
}
