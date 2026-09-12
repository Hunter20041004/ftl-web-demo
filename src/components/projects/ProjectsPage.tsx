import { SitePageShell } from "@/components/layout/SitePageShell";
import { SlideDeck } from "@/components/projects/SlideDeck";
import { projectDecks } from "@/lib/content";

// 專案頁：每個專案一疊投影片。第一版先放社員公開在 GitHub 上的專案；社課分組專案 9/21 分組後再加。
export function ProjectsPage() {
  return (
    <SitePageShell>
      <main id="main" className="page">
        <section className="pagehead">
          <div className="wrap reveal">
            <span className="eyebrow" data-en="Projects">專案</span>
            <h1 className="h1" data-en="Projects, presented as slides">用簡報的方式看專案</h1>
            <p className="lead" data-en="Each project is a short deck: the problem, the approach, what was built, and the evidence. Use the arrows or the ← → keys. Team projects for 115-1 will be added after teams form on 09/21.">每個專案是一疊短簡報：問題、做法、做了什麼、證據。用箭頭或鍵盤 ← → 翻頁。115-1 的分組專案在 9/21 分組後陸續加入。</p>
          </div>
        </section>
        <section className="section--tight section">
          <div className="wrap">
            <div className="stack" style={{ gap: "clamp(32px,4vw,56px)" }} data-stagger>
              {projectDecks.map((deck) => (
                <div className="reveal reveal--rise" key={deck.id} id={deck.id}>
                  <SlideDeck deck={deck} />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </SitePageShell>
  );
}
