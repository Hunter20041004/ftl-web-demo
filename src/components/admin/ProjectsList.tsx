"use client";

import { projectDeckSchema, type ProjectDeck } from "@/lib/content.schema";
import { projects } from "@/lib/admin/collections";
import { publicMediaUrl } from "@/lib/admin/media";
import { EntityPage } from "./EntityPage";
import { ProjectForm, emptyProject } from "./forms/ProjectForm";

export function ProjectsList() {
  return (
    <EntityPage<ProjectDeck>
      title="專案" intro="拖曳決定順序；首頁只顯示前 3 個，專案頁顯示全部。" addLabel="新增專案" noun="專案"
      collection={projects} schema={projectDeckSchema} empty={emptyProject} sortable wide
      draftCheck={(d) => (d.id ? {} : { id: "必填（其他欄位可先空著）" }) as Record<string, string>}
      Form={ProjectForm}
      summary={(row) => (
        <div className="flex items-center gap-4">
          <div className="h-12 w-20 shrink-0 overflow-hidden rounded-lg bg-white shadow-[var(--glass-hi),var(--shadow-soft)]">
            {/* eslint-disable-next-line @next/next/no-img-element -- Storage 公開網址 */}
            {row.data.cover ? <img src={publicMediaUrl(row.data.cover)} alt="" className="h-full w-full object-cover" /> : null}
          </div>
          <div className="min-w-0">
            <p className="font-medium md:truncate">{row.data.name}{row.data.status === "wip" ? <span className="ml-2 rounded-full bg-secondary px-2 py-0.5 text-xs text-primary">進行中</span> : null}</p>
            <p className="truncate text-xs text-muted-foreground">{row.data.tagline}</p>
          </div>
        </div>
      )}
    />
  );
}
