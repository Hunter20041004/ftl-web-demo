// 中文標題沒有詞邊界，瀏覽器會在任意字中間換行；有「：」的標題就固定在冒號後換行，
// 讓「主標：副標」永遠分成上下兩行。英文整段放在第一個 span 的 data-en，第二個 span 在英文模式清空。
// 兩個 span 都是純文字，所以英文模式下 React 掛載時只會遇到文字不同，suppressHydrationWarning 擋得住。
export function SplitTitle({ text, en }: { text: string; en: string }) {
  const idx = text.indexOf("：");
  if (idx < 0 || idx === text.length - 1) return <span data-en={en} suppressHydrationWarning>{text}</span>;
  return (
    <>
      <span className="t-head" data-en={en} suppressHydrationWarning>{text.slice(0, idx + 1)}</span>
      <span data-en="" suppressHydrationWarning>{text.slice(idx + 1)}</span>
    </>
  );
}
