import { parseMarkdown, type Span } from "@/lib/markdown";

// 文章內文：把小型 Markdown 的節點畫成 HTML。文字永遠是文字（React 會跳脫），所以後台輸入不會變成程式。
function Spans({ spans }: { spans: Span[] }) {
  return (
    <>
      {spans.map((s, i) =>
        s.type === "bold" ? <strong key={i}>{s.text}</strong>
        : s.type === "link" ? <a key={i} href={s.href} target={s.href.startsWith("/") ? undefined : "_blank"} rel="noopener noreferrer">{s.text}</a>
        : <span key={i}>{s.text}</span>,
      )}
    </>
  );
}

export function ArticleBody({ markdown }: { markdown: string }) {
  return (
    <div className="article__body">
      {parseMarkdown(markdown).map((b, i) =>
        b.type === "heading" ? (b.level === 2 ? <h2 className="h2" key={i}><Spans spans={b.spans} /></h2> : <h3 className="h3" key={i}><Spans spans={b.spans} /></h3>)
        : b.type === "list" ? <ul className="bullets-plain" key={i}>{b.items.map((it, j) => <li key={j}><Spans spans={it} /></li>)}</ul>
        : b.type === "quote" ? <blockquote className="article__quote" key={i}><Spans spans={b.spans} /></blockquote>
        : <p className="card__body" key={i}><Spans spans={b.spans} /></p>,
      )}
    </div>
  );
}
