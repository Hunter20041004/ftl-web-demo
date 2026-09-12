"use client";

import { useEffect, useRef } from "react";
import { withBasePath } from "@/lib/site-data";
import { PIECE_DILATE, PIECE_TRANSFORM, PIECES, type PieceKey } from "@/components/visual/logo-pieces";

// 首屏主視覺：四支刷子各自從畫面外沿著緞帶骨架刷進來，刷過的地方原圖 PNG 就露出來。
// 每支刷子只能露出自己那幾片緞帶（用分件輪廓當遮罩），所以刷子可以很寬——
// 緞帶一出現就是完整的，不會有沒刷到的角落留到最後才補。
// 全部刷完後一道高光斜掃過 logo 作收；之後只剩極慢的浮動。時序在 assets/v6.css。
//
// d＝刷子的路徑（733×692 座標，起點在畫面外）、w＝刷寬、at＝起筆秒數、dur＝刷完秒數。
// 覆蓋率用 scratchpad/cover4.mjs 逐像素量過：未覆蓋 22 px（0.01%）。
// exclude＝這支刷子「不准露出」的別人緞帶：主緞帶那支很寬（輪廓又膨脹過），經過 T 的頂端與
// F 中臂的接縫時會提早露出對方幾個像素。用「對方的輪廓 ∩ 一個矩形」擋掉——只擋接縫以外的部分，
// 接縫本身仍由主緞帶露出，否則會在自己的緞帶邊上留一條白縫。矩形是 PNG 座標 [x, y, w, h]。
type Stroke = {
  id: string; pieces: readonly PieceKey[]; clipY?: number;
  exclude?: ReadonlyArray<{ piece: PieceKey; within: [number, number, number, number] }>;
  d: string; w: number; at: number; dur: number;
};
const STROKES: ReadonlyArray<Stroke> = [
  { id: "ribbon", pieces: ["lRibbon", "lFoot", "fStem", "top"], exclude: [{ piece: "tStem", within: [260, 108, 160, 420] }, { piece: "fArm", within: [122, 190, 200, 160] }], d: "M 55 1000 L 55 462 L 55 120 C 55 80 80 55 120 55 L 520 55 C 590 55 620 110 565 165 L 480 380 C 468 420 490 455 548 455 L 770 455", w: 240, at: 0.1, dur: 2.0 },
  { id: "arm", pieces: ["fArm"], d: "M -760 340 L 40 315 C 90 258 160 226 238 214 L 290 208", w: 170, at: 0.9, dur: 1.25 },
  { id: "stem", pieces: ["tStem"], d: "M 325 -520 L 325 105 L 325 440 C 325 480 350 500 390 500 L 440 500", w: 170, at: 0.5, dur: 1.4 },
  { id: "text", pieces: [], clipY: 530, d: "M -760 615 L 80 615 L 720 615", w: 150, at: 1.5, dur: 1.0 },
];

// 刷子是圓頭的，前緣比路徑點超前半個筆寬；路徑往起點方向多退半個筆寬，
// 刷出來的前緣才會從畫面外開始、剛好在骨架終點停下。
const NUM = /-?\d+(?:\.\d+)?/g;
function extendStart(d: string, by: number) {
  const [x1, y1, x2, y2] = (d.match(NUM) ?? []).slice(0, 4).map(Number);
  const len = Math.hypot(x2 - x1, y2 - y1) || 1;
  const sx = x1 - ((x2 - x1) / len) * by;
  const sy = y1 - ((y2 - y1) / len) * by;
  return `M ${sx.toFixed(1)} ${sy.toFixed(1)} L ${x1} ${y1} ${d.slice(d.indexOf("L"))}`;
}
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
          {/* 擋別人緞帶用的矩形（見 Stroke.exclude） */}
          {STROKES.flatMap((stroke) => (stroke.exclude ?? []).map(({ piece, within: [x, y, w, h] }) => (
            <clipPath key={`${stroke.id}-${piece}`} id={`logo-exclude-${stroke.id}-${piece}`}><rect x={x} y={y} width={w} height={h} /></clipPath>
          )))}
          {/* 每支刷子的「可露出範圍」：自己那幾片緞帶的輪廓（膨脹一點，接縫才不會留白），再挖掉別人的 */}
          {STROKES.map((stroke) => (
            <mask key={stroke.id} id={`logo-piece-${stroke.id}`} maskUnits="userSpaceOnUse" x="-1000" y="-1000" width="3000" height="3000">
              {stroke.pieces.length ? (
                <g transform={PIECE_TRANSFORM}>
                  {stroke.pieces.map((key) => (
                    <path key={key} d={PIECES[key]} fill="#fff" stroke="#fff" strokeWidth={PIECE_DILATE} strokeLinejoin="round" />
                  ))}
                </g>
              ) : (
                <rect x="0" y={stroke.clipY} width="733" height={692 - (stroke.clipY ?? 0)} fill="#fff" />
              )}
              {stroke.exclude?.map(({ piece }) => (
                <g key={piece} clipPath={`url(#logo-exclude-${stroke.id}-${piece})`}>
                  <g transform={PIECE_TRANSFORM}><path d={PIECES[piece]} fill="#000" /></g>
                </g>
              ))}
            </mask>
          ))}
          {/* 總遮罩：四支刷子各在自己的範圍內描邊 */}
          <mask id="logo-draw-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="733" height="692">
            {STROKES.map((stroke) => (
              <g key={stroke.id} mask={`url(#logo-piece-${stroke.id})`}>
                <path
                  className="logo-draw__brush"
                  d={extendStart(stroke.d, stroke.w / 2)}
                  pathLength={1}
                  strokeWidth={stroke.w}
                  style={{ animationDelay: `${stroke.at}s`, animationDuration: `${stroke.dur}s` }}
                />
              </g>
            ))}
          </mask>
        </defs>
        <image className="logo-draw__paint" href={logoSrc} width="733" height="692" mask="url(#logo-draw-mask)" />
      </svg>
      {/* eslint-disable-next-line @next/next/no-img-element -- 靜態匯出、PNG 原圖，不走 next/image */}
      <img className="logo-draw__img" src={logoSrc} alt="" width={733} height={692} />
      {/* 高光：一道斜的亮帶用 logo 本身當遮罩掃過去，掃完消失，logo 本體不變 */}
      <div className="logo-draw__shine" style={{ WebkitMaskImage: `url(${logoSrc})`, maskImage: `url(${logoSrc})` }} />
    </div>
  );
}
