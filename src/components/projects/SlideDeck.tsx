"use client";

import { useEffect, useRef, useState } from "react";
import type { ProjectDeck, SlideVisual } from "@/lib/content";
import { withBasePath } from "@/lib/site-data";

// 每張投影片右半邊的視覺：圖片、流程、數字或清單
function Visual({ v }: { v: SlideVisual }) {
  if (v.kind === "image") {
    // eslint-disable-next-line @next/next/no-img-element -- 專案截圖，靜態檔
    return <img className="deck__img" src={withBasePath(v.src)} alt={v.alt ?? ""} loading="lazy" />;
  }
  if (v.kind === "flow") {
    return (
      <ol className="deck__flow">
        {v.steps.map((step, i) => <li key={step}><span className="deck__flowN num">{i + 1}</span><span data-en={v.stepsEn[i]}>{step}</span></li>)}
      </ol>
    );
  }
  if (v.kind === "stats") {
    return (
      <ul className="deck__stats">
        {v.items.map(([n, zh, en]) => <li key={zh}><b className="grad-text num">{n}</b><span data-en={en}>{zh}</span></li>)}
      </ul>
    );
  }
  return (
    <ul className="bullets-plain deck__list">
      {v.items.map((item, i) => <li key={item} data-en={v.itemsEn[i]}>{item}</li>)}
    </ul>
  );
}

function Icon({ name }: { name: string }) {
  return (
    <svg className="icon" aria-hidden="true">
      <use href={`#i-${name}`} />
    </svg>
  );
}

// 專案的簡報式呈現：一張 16:9 的玻璃「投影片」，左右鍵、按鈕或點頁碼換頁。
// 第 0 張是封面（專案名、一句話、標籤），之後每張一個重點。
export function SlideDeck({ deck }: { deck: ProjectDeck }) {
  const [index, setIndex] = useState(0);
  const total = deck.slides.length + 1;
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") setIndex((i) => Math.min(total - 1, i + 1));
      if (event.key === "ArrowLeft") setIndex((i) => Math.max(0, i - 1));
    };
    root.addEventListener("keydown", onKey);
    return () => root.removeEventListener("keydown", onKey);
  }, [total]);

  const slide = index === 0 ? null : deck.slides[index - 1];

  return (
    <div ref={rootRef} className="deck" data-deck={deck.id} data-slide={index} tabIndex={0} aria-label={`${deck.name} 簡報，第 ${index + 1} 張，共 ${total} 張`}>
      <div className="deck__stage" key={index}>
        {slide === null ? (
          <div className="deck__slide deck__slide--cover">
            <div className="deck__coverText">
              <span className="deck__kicker"><span data-en={deck.ownerEn}>{deck.owner}</span>{deck.status === "wip" ? <span className="tag tag--warn" data-en="In progress">進行中</span> : null}</span>
              <h3 className="deck__title display">{deck.name}</h3>
              <p className="deck__sub en">{deck.nameEn}</p>
              <p className="deck__body" data-en={deck.taglineEn}>{deck.tagline}</p>
              <div className="tag-row">{deck.tags.map((tag, i) => <span className="tag" key={tag} data-en={deck.tagsEn[i]}>{tag}</span>)}</div>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element -- GitHub 產生的社群圖，外站來源 */}
            <img className="deck__cover" src={withBasePath(deck.cover)} alt="" loading="lazy" />
          </div>
        ) : (
          <div className="deck__slide deck__slide--split">
            <div className="deck__text">
              <span className="deck__kicker" data-en={slide.kickerEn}>{slide.kicker}</span>
              <h3 className="deck__title h1" data-en={slide.titleEn}>{slide.title}</h3>
              <p className="deck__body" data-en={slide.bodyEn}>{slide.body}</p>
            </div>
            <div className="deck__visual"><Visual v={slide.visual} /></div>
          </div>
        )}
      </div>
      <div className="deck__bar">
        <div className="deck__links">
          <a className="link-arrow" href={deck.repo} target="_blank" rel="noopener noreferrer"><span>GitHub</span><Icon name="arrow-up-right" /></a>
          {deck.demo ? <a className="link-arrow" href={deck.demo} target="_blank" rel="noopener noreferrer"><span>Demo</span><Icon name="arrow-up-right" /></a> : null}
        </div>
        <div className="deck__nav">
          <button type="button" className="week__btn" data-deck-nav="prev" aria-label="上一張" disabled={index === 0} onClick={() => setIndex((i) => Math.max(0, i - 1))}>‹</button>
          <ol className="deck__dots">
            {Array.from({ length: total }, (_, i) => (
              <li key={i}><button type="button" className={`deck__dot${i === index ? " deck__dot--on" : ""}`} aria-label={`第 ${i + 1} 張`} aria-current={i === index ? "true" : undefined} onClick={() => setIndex(i)} /></li>
            ))}
          </ol>
          <span className="deck__count num">{index + 1} / {total}</span>
          <button type="button" className="week__btn" data-deck-nav="next" aria-label="下一張" disabled={index === total - 1} onClick={() => setIndex((i) => Math.min(total - 1, i + 1))}>›</button>
        </div>
      </div>
    </div>
  );
}
