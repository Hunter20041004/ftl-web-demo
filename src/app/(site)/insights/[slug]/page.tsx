import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SitePageShell } from "@/components/layout/SitePageShell";
import { ArticleBody } from "@/components/insights/ArticleBody";
import { articles } from "@/lib/content";
import { withBasePath } from "@/lib/site-data";

// 每篇洞察文章一個靜態頁：/insights/<slug>/
export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = articles.find((x) => x.slug === slug);
  return { title: a ? `${a.title} ｜ 政大金融科技創新實驗室` : "洞察文章", description: a?.summary };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = articles.find((x) => x.slug === slug);
  if (!a) notFound();
  // 英文內文選填：沒有就顯示中文內文（不加說明文字）
  return (
    <SitePageShell>
      <main id="main" className="page">
        <section className="pagehead">
          <div className="wrap reveal">
            <a className="link-arrow" href={withBasePath("/insights/#research")}><span data-en="All articles" suppressHydrationWarning>所有洞察文章</span></a>
            <span className="eyebrow mt-4" style={{ display: "block" }} data-en="Insight article" suppressHydrationWarning>洞察文章</span>
            <h1 className="h1" data-en={a.titleEn} suppressHydrationWarning>{a.title}</h1>
            <p className="lead"><span data-en={a.authorEn} suppressHydrationWarning>{a.author}</span> · <span className="num">{a.date}</span></p>
            {a.tags.length ? <div className="tag-row mt-4">{a.tags.map((t, i) => <span className="tag tag--ghost" key={t} data-en={a.tagsEn[i]} suppressHydrationWarning>{t}</span>)}</div> : null}
          </div>
        </section>
        <section className="section--tight section">
          <div className="wrap">
            <article className="panel reveal article">
              {a.cover ? (
                /* eslint-disable-next-line @next/next/no-img-element -- 靜態檔 */
                <img className="article__hero" src={withBasePath(a.cover)} alt="" />
              ) : null}
              <p className="lead article__summary" data-en={a.summaryEn} suppressHydrationWarning>{a.summary}</p>
              <div className="lang-zh-only"><ArticleBody markdown={a.body} /></div>
              {a.bodyEn ? <div className="lang-en-only"><ArticleBody markdown={a.bodyEn} /></div> : null}
            </article>
          </div>
        </section>
      </main>
    </SitePageShell>
  );
}
