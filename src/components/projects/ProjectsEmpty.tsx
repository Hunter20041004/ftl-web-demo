// 專案空狀態：幹部在後台把專案全部下架時（例如換學期），首頁與專案頁不能只剩標題一片空。

export function ProjectsEmpty() {
  return (
    <div className="empty" data-projects-empty="" data-show="true">
      <svg className="icon" aria-hidden="true"><use href="#i-sparkle" /></svg>
      <p data-en="New projects for this semester are in the works — stay tuned." suppressHydrationWarning>本學期新專案籌備中，敬請期待。</p>
    </div>
  );
}
