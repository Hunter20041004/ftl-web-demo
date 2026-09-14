"use client";

import { resourceSchema, type Resource } from "@/lib/content.schema";
import { resources } from "@/lib/admin/collections";
import { EntityPage } from "./EntityPage";
import { ResourceForm, emptyResource } from "./forms/ResourceForm";

const today = () => new Date().toISOString().slice(0, 10);

export function ResourcesList() {
  return (
    <EntityPage<Resource>
      title="資源" intro="職缺、獎學金、計畫。有截止日的過期後會自動從前台下架；書單來自「活動」裡的英語讀書會。" addLabel="新增資源" noun="資源"
      collection={resources} schema={resourceSchema} empty={emptyResource} sortable
      Form={ResourceForm}
      summary={(row) => {
        const expired = Boolean(row.data.deadline && row.data.deadline < today());
        return (
          <div className={`min-w-0 ${expired ? "opacity-60" : ""}`}>
            <p className="font-medium md:truncate"><span className="mr-2 rounded-full bg-secondary px-2 py-0.5 text-xs text-primary">{row.data.kindZh}</span>{row.data.title}{expired ? <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs">已過期</span> : null}</p>
            <p className="truncate text-xs text-muted-foreground">{row.data.org}{row.data.deadline ? ` · 截止 ${row.data.deadline}` : ""}</p>
          </div>
        );
      }}
    />
  );
}
