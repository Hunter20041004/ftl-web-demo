// 中文標題沒有詞邊界，瀏覽器會在任意字中間換行；有「：」的標題就固定在冒號後換行，
// 讓「主標：副標」永遠分成上下兩行（英文版由 data-en 整段替換，不受影響）。
export function SplitTitle({ text }: { text: string }) {
  const idx = text.indexOf("：");
  if (idx < 0 || idx === text.length - 1) return <>{text}</>;
  return (
    <>
      <span className="t-head">{text.slice(0, idx + 1)}</span>
      {text.slice(idx + 1)}
    </>
  );
}
