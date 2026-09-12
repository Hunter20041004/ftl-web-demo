"use client";

import { useEffect, useRef, useState } from "react";
import { SlideDeck } from "@/components/projects/SlideDeck";
import { withBasePath } from "@/lib/site-data";
import { projectDecks, type ProjectDeck } from "@/lib/content";

function Icon({ name }: { name: string }) {
  return (
    <svg className="icon" aria-hidden="true">
      <use href={`#i-${name}`} />
    </svg>
  );
}

// 專案牆：一行三張卡；點一張就在對話框裡打開那個專案的投影片。網址帶 #專案id 時直接打開。
export function ProjectsWall() {
  const [open, setOpen] = useState<ProjectDeck | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const fromHash = () => {
      const id = window.location.hash.slice(1);
      const deck = projectDecks.find((d) => d.id === id) ?? null;
      setOpen(deck);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const close = () => {
    setOpen(null);
    if (window.location.hash) history.replaceState(null, "", window.location.pathname);
  };
  // 原生 dialog 的 close 事件是排隊觸發的；如果在它到達前又打開了另一個專案，這個過期的 close 要略過
  const onNativeClose = () => {
    if (dialogRef.current?.open) return;
    close();
  };

  return (
    <>
      <div className="grid grid-3" data-stagger>
        {projectDecks.map((deck) => (
          <button type="button" className="card project-teaser reveal reveal--rise" data-project={deck.id} id={deck.id} key={deck.id} onClick={() => { history.replaceState(null, "", `#${deck.id}`); setOpen(deck); }}>
            {/* eslint-disable-next-line @next/next/no-img-element -- GitHub 社群圖 */}
            <img className="project-teaser__img" src={withBasePath(deck.cover)} alt="" loading="lazy" />
            <div className="card__top"><h3 className="h3" data-en={deck.nameEn}>{deck.name}</h3>{deck.status === "wip" ? <span className="tag tag--warn" data-en="In progress">進行中</span> : <span className="tag tag--ghost" data-en={deck.ownerEn}>{deck.owner}</span>}</div>
            <p className="card__body" data-en={deck.taglineEn}>{deck.tagline}</p>
            <div className="tag-row">{deck.tags.map((tag, i) => <span className="tag" key={tag} data-en={deck.tagsEn[i]}>{tag}</span>)}</div>
          </button>
        ))}
      </div>
      <dialog ref={dialogRef} className="project-dialog" onClose={onNativeClose} onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
        {open ? (
          <div className="project-dialog__inner">
            <button type="button" className="week__btn project-dialog__close" aria-label="關閉" onClick={close}><Icon name="close" /></button>
            <SlideDeck deck={open} />
          </div>
        ) : null}
      </dialog>
    </>
  );
}
