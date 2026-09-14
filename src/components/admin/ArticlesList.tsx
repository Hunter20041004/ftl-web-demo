"use client";

import { articleSchema, type Article } from "@/lib/content.schema";
import { articles } from "@/lib/admin/collections";
import { EntityPage } from "./EntityPage";
import { ArticleForm, emptyArticle } from "./forms/ArticleForm";

const listOptions = { order: "published_at", ascending: false } as const;

export function ArticlesList() {
  return (
    <EntityPage<Article>
      title="洞察文章" intro="社團自己寫的研究與觀察，每篇有自己的網址。依日期新到舊排列。" addLabel="新增文章" noun="文章"
      collection={articles} schema={articleSchema} empty={emptyArticle} listOptions={listOptions} wide
      draftCheck={(d) => (d.slug ? {} : { slug: "必填（其他欄位可先空著）" }) as Record<string, string>}
      Form={ArticleForm}
      summary={(row) => (
        <div className="min-w-0">
          <p className="font-medium md:truncate"><span className="mr-2 font-mono text-xs text-muted-foreground">{row.data.date}</span>{row.data.title}</p>
          <p className="truncate text-xs text-muted-foreground">{row.data.author}・/insights/{row.data.slug}/</p>
        </div>
      )}
    />
  );
}
