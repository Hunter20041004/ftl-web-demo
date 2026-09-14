// 靜態輸出規定動態路由至少要產一頁；沒有文章時產一頁「目前沒有文章」的佔位頁，
// 幹部把文章全部刪掉時建置才不會失敗。
export const EMPTY_ARTICLE_SLUG = "_none";

export function articleParams(articles: ReadonlyArray<{ slug: string }>): { slug: string }[] {
  if (articles.length === 0) return [{ slug: EMPTY_ARTICLE_SLUG }];
  return articles.map((a) => ({ slug: a.slug }));
}
