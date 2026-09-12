import { SitePageShell } from "@/components/layout/SitePageShell";
import { books, chainSeries, resources, type Resource } from "@/lib/content";
import { withBasePath } from "@/lib/site-data";

function Icon({ name }: { name: string }) {
  return (
    <svg className="icon" aria-hidden="true">
      <use href={`#i-${name}`} />
    </svg>
  );
}

const kindIcon: Record<string, string> = { job: "briefcase", scholarship: "sparkle", program: "rocket" };
const kindTag: Record<string, string> = { job: "tag", scholarship: "tag tag--ok", program: "tag tag--cyan" };

const filters: Array<[string, string, string]> = [
  ["all", "All", "全部"],
  ["job", "Jobs", "職缺"],
  ["scholarship", "Scholarships", "獎學金"],
  ["program", "Programs", "計畫"],
  ["book", "Books", "書單"],
];

// 資源頁：一個清單、一組篩選鈕。職缺／獎學金／計畫／產學各一張卡，書單每本一張（封面＋簡介）。
function ResourceCard({ item }: { item: Resource }) {
  const isJob = item.kind === "job";
  const inner = (
    <>
      <div className="card__top"><span className="ios-row__icon"><Icon name={kindIcon[item.kind]} /></span><span className={kindTag[item.kind]} data-en={item.kindEn}>{item.kindZh}</span></div>
      <h3 className="h3" data-en={item.titleEn}>{item.title}</h3>
      <p className="dim" style={{ fontSize: ".95rem" }} data-en={item.orgEn}>{item.org}</p>
      <p className="card__body" data-en={item.summaryEn}>{item.summary}</p>
      {item.details ? (
        <details className="issue__sources">
          <summary data-en="Details">工作內容與條件</summary>
          <ul className="bullets-plain">{item.details.map((line, i) => <li key={line} data-en={item.detailsEn?.[i]}>{line}</li>)}</ul>
          {item.contact ? <p className="card__body mt-4"><b data-en="Contact｜">聯絡｜</b><span data-en="Aaron Chao｜Human Resources｜aaron.chao@chubb.com｜02-8161-1988 #8719">{item.contact}</span></p> : null}
        </details>
      ) : null}
      <div className="card__foot">
        {isJob ? <a className="link-arrow" href="mailto:aaron.chao@chubb.com"><span data-en="Apply now">立即投遞</span><Icon name="arrow-up-right" /></a> : <><span className="dim" style={{ fontSize: ".9rem" }} data-en="Open source">開啟來源</span><Icon name="arrow-up-right" /></>}
      </div>
    </>
  );
  return isJob
    ? <article className="card reveal reveal--rise res-item" data-cat={item.kind}>{inner}</article>
    : <a className="card reveal reveal--rise res-item" data-cat={item.kind} href={item.href} target="_blank" rel="noopener noreferrer">{inner}</a>;
}

export function ResourcesPage() {
  const proofOfStake = { title: "Proof of Stake — The Making of Ethereum and the Philosophy of Blockchains", author: "Vitalik Buterin", cover: "/assets/books/proof-of-stake.jpg", when: `${chainSeries.name} 英文場 · 10/21`, whenEn: `${chainSeries.nameEn}, English session · 10/21`, synopsis: "以太坊創辦人的文集。從「世界電腦」的設計、智能合約與 Gas，談到工作量證明轉向權益證明，以及區塊鏈的治理與公共財命題。", synopsisEn: "Essays by Ethereum’s founder: the design of the “world computer”, smart contracts and gas, the move from proof of work to proof of stake, and questions of governance and public goods." };
  return (
    <SitePageShell>
      <main id="main" className="page">
        <section className="pagehead">
          <div className="wrap reveal">
            <span className="eyebrow" data-en="Resources">資源</span>
            <h1 className="h1" data-en="Jobs, scholarships, programs and books">職缺、獎學金、計畫與書單</h1>
          </div>
        </section>

        <section className="section--tight section" id="resources">
          <div className="wrap">
            <div className="filters reveal" data-filter-group="" data-filter-target="#resource-list" data-filter-empty="#resource-empty" role="group" aria-label="資源類型篩選">
              {filters.map(([cat, en, zh], index) => (
                <button className="filter" type="button" data-filter={cat} aria-pressed={index === 0} data-en={en} key={cat}>{zh}</button>
              ))}
            </div>
            <div className="res-grid" id="resource-list" data-stagger="">
              {resources.map((item) => <ResourceCard item={item} key={item.title} />)}
              {[...books.map((b) => ({ title: b.title, author: b.author, cover: b.cover, when: `英語讀書會 Week ${String(b.week).padStart(2, "0")} · ${b.date}`, whenEn: `English reading club, week ${b.week} · ${b.date}`, synopsis: b.synopsis, synopsisEn: b.synopsisEn })), proofOfStake].map((book) => (
                <article className="card book reveal reveal--rise res-item" data-cat="book" key={book.title}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- 靜態封面圖 */}
                  <img className="book__cover" src={withBasePath(book.cover)} alt="" loading="lazy" />
                  <div className="book__body">
                    <span className="tag tag--warn" data-en="Book">書單</span>
                    <h3 className="h3 en">{book.title}</h3>
                    <p className="dim en" style={{ fontSize: ".95rem" }}>{book.author}</p>
                    <p className="card__body" data-en={book.synopsisEn}>{book.synopsis}</p>
                  </div>
                </article>
              ))}
            </div>
            <div className="empty" id="resource-empty" data-show="false"><Icon name="inbox" /><p data-en="Nothing in this category.">這個類型目前沒有項目。</p></div>
          </div>
        </section>
      </main>
    </SitePageShell>
  );
}
