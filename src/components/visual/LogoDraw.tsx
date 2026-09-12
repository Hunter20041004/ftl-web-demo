"use client";

import { useEffect, useRef } from "react";
import { withBasePath } from "@/lib/site-data";

// 首屏主視覺：三條線各自飛入、沿手描的緞帶骨架描邊，畫完後淡出換成 logo 原圖。
// 骨架只求形似——它在 1.65s 後就被 PNG 蓋掉。座標系＝ftl-logo.png 的 733×692。
// 動畫時序全在 assets/v6.css 的 .logo-draw 區塊；這裡只負責標記「完成」狀態給測試與樣式用。
const STROKES = [
  { d: "M 55 500 L 55 120 C 55 80 80 55 120 55 L 520 55 C 575 55 605 100 580 150 L 495 380 C 480 420 500 455 545 455 L 705 455", from: "left" },
  { d: "M 40 300 C 90 250 160 218 238 208", from: "right" },
  { d: "M 325 105 L 325 440 C 325 480 350 500 390 500", from: "top" },
  // 第四筆：橫掃下方「FinTech Lab / NCCU」字樣，讓字也是被寫出來的，不是另外淡入的
  { d: "M 80 615 L 660 615", from: "text" },
] as const;

export function LogoDraw() {
  const rootRef = useRef<HTMLDivElement>(null);
  const logoSrc = withBasePath("/assets/ftl-logo.png");

  // 完成狀態直接寫在 DOM 屬性上（不走 React state）：這是動畫收尾的旗標，
  // 給測試與 CSS 讀，不需要重新 render。
  useEffect(() => {
    const root = rootRef.current;
    const img = root?.querySelector<HTMLImageElement>(".logo-draw__img");
    if (!root || !img) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.dataset.logoState = "done";
      return;
    }
    // hydration 可能晚於動畫結束（開發模式、慢機器），所以不用 animationend 事件，
    // 改問瀏覽器「那支動畫還在跑嗎」：在跑就等它結束，不在跑就代表已經結束。
    const fadeIn = (img.getAnimations() as CSSAnimation[]).find((a) => a.animationName === "logo-fade-in");
    if (!fadeIn) {
      root.dataset.logoState = "done";
      return;
    }
    let cancelled = false;
    fadeIn.finished.then(() => { if (!cancelled) root.dataset.logoState = "done"; }).catch(() => {});
    return () => { cancelled = true; };
  }, []);

  return (
    <div ref={rootRef} className="logo-draw" data-logo-state="drawing" aria-hidden="true">
      <svg className="logo-draw__svg" viewBox="0 0 733 692">
        <defs>
          {/* 遮罩：粗筆沿骨架描邊，筆到哪裡原圖就露出到哪裡 */}
          <mask id="logo-draw-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="733" height="692">
            {STROKES.map((stroke, index) => (
              <path key={stroke.from} className="logo-draw__brush" d={stroke.d} pathLength={1} data-from={stroke.from} style={{ "--i": index } as React.CSSProperties} />
            ))}
          </mask>
        </defs>
        <image className="logo-draw__paint" href={logoSrc} width="733" height="692" mask="url(#logo-draw-mask)" />
      </svg>
      {/* eslint-disable-next-line @next/next/no-img-element -- 靜態匯出、PNG 原圖，不走 next/image */}
      <img className="logo-draw__img" src={logoSrc} alt="" width={733} height={692} />
    </div>
  );
}
