"use client";

import { useEffect, useRef } from "react";
import { withBasePath } from "@/lib/site-data";

// 首屏主視覺：三條線各自飛入、沿手描的緞帶骨架描邊，畫完後淡出換成 logo 原圖。
// 骨架只求形似——它在 1.65s 後就被 PNG 蓋掉。座標系＝ftl-logo.png 的 733×692。
// 動畫時序全在 assets/v6.css 的 .logo-draw 區塊；這裡只負責標記「完成」狀態給測試與樣式用。
// 每一筆：d＝骨架路徑（733×692 座標）、w＝筆寬、at＝起筆秒數、dur＝畫完秒數。
// 筆寬與位置是用 scratchpad/cover.mjs 量過的：五筆合起來把原圖 99.99% 的像素都刷到，
// 所以最後整張淡入不會再「冒出」沒刷到的角落。
const STROKES = [
  { id: "ribbon", d: "M 55 462 L 55 120 C 55 80 80 55 120 55 L 520 55 C 590 55 620 110 565 165 L 480 380 C 468 420 490 455 548 455 L 705 455", w: 140, at: 0.25, dur: 1.5 },
  { id: "fold", d: "M 480 95 L 455 280", w: 70, at: 1.05, dur: 0.45 },
  { id: "arm", d: "M 40 315 C 90 258 160 226 238 214", w: 135, at: 0.45, dur: 1.1 },
  { id: "stem", d: "M 325 105 L 325 440 C 325 480 350 500 390 500", w: 120, at: 0.65, dur: 1.2 },
  { id: "text", d: "M 80 615 L 660 615", w: 150, at: 1.35, dur: 0.8 },
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
            {STROKES.map((stroke) => (
              <path
                key={stroke.id}
                className="logo-draw__brush"
                d={stroke.d}
                pathLength={1}
                strokeWidth={stroke.w}
                style={{ animationDelay: `${stroke.at}s`, animationDuration: `${stroke.dur}s` }}
              />
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
