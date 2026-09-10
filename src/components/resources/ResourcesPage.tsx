import { SitePageShell } from "@/components/layout/SitePageShell";
import { withBasePath } from "@/lib/site-data";

function Icon({ name, className = "icon" }: { name: string; className?: string }) {
  return <svg className={className} aria-hidden="true"><use href={`#i-${name}`} /></svg>;
}

const jobs = [
  {
    titleEn: "Data Analyst Intern — Partner Bank 01, Risk Management",
    titleZh: "數據分析實習生｜合作企業 01 · 風險管理部",
    typeEn: "Internship", typeZh: "實習",
    metaEn: "Taipei · 3 days/week · SQL + Python required",
    metaZh: "台北 · 每週 3 天 · 需要 SQL 與 Python",
    statusEn: "Closes 09.20", statusZh: "09.20 截止", statusClass: "tag tag--warn",
  },
  {
    titleEn: "Product Intern — Partner Startup 03, RegTech",
    titleZh: "產品實習生｜合作新創 03 · 法遵科技",
    typeEn: "Internship", typeZh: "實習",
    metaEn: "Hybrid · No coding required · Writing sample expected",
    metaZh: "混合辦公 · 不需寫程式 · 需附寫作作品",
    statusEn: "Rolling", statusZh: "隨到隨審", statusClass: "tag tag--ok",
  },
  {
    titleEn: "Quantitative Research Assistant — Partner Fund 04",
    titleZh: "量化研究助理｜合作機構 04 · 資產管理",
    typeEn: "Part-time", typeZh: "兼職",
    metaEn: "Statistics or Finance background · Time-series coursework helps",
    metaZh: "統計或財金背景 · 修過時間序列會加分",
    statusEn: "Closes 09.30", statusZh: "09.30 截止", statusClass: "tag tag--warn",
  },
  {
    titleEn: "2027 Management Associate Program — Partner Firm 02",
    titleZh: "2027 儲備幹部計畫｜合作企業 02 · 券商",
    typeEn: "Full-time", typeZh: "全職",
    metaEn: "Graduating 2027 · Opens October, prepare the case study early",
    metaZh: "2027 年畢業 · 十月開放，建議提早準備個案",
    statusEn: "Opens 10.01", statusZh: "10.01 開放", statusClass: "tag",
  },
] as const;

const library = [
  {
    cat: "book", icon: "book", title: "The Pay Off — Gottfried Leibbrandt & Natasha de Terán",
    typeEn: "Book", typeZh: "書籍",
    noteEn: "The clearest explanation of payment rails we’ve found. Start here.",
    noteZh: "目前找到把支付軌道講得最清楚的一本。從這本開始。",
  },
  {
    cat: "book", icon: "book", title: "Credit Scoring and Its Applications — Thomas, Edelman & Crook",
    typeEn: "Book", typeZh: "書籍",
    noteEn: "Dry, but chapters 4–6 are the reference we keep going back to during workshops.",
    noteZh: "很乾，但第 4–6 章是我們工作坊一直回頭查的參考。",
  },
  {
    cat: "paper", icon: "file", title: "On the Rise of FinTech: Credit Scoring Using Digital Footprints",
    typeEn: "Paper", typeZh: "論文",
    noteEn: "Berg et al., RFS 2020. The result is striking; read the robustness section before quoting it.",
    noteZh: "Berg et al., RFS 2020。結果很驚人；引用前先讀穩健性那節。",
  },
  {
    cat: "paper", icon: "file", title: "The Rise of Digital Money — IMF FinTech Notes",
    typeEn: "Paper", typeZh: "論文",
    noteEn: "Short, and it defines the vocabulary most Taiwanese coverage uses loosely.",
    noteZh: "很短，而且它定義了台灣多數報導用得很鬆散的那些名詞。",
  },
  {
    cat: "report", icon: "trend", title: "Global Payments Report 2026（產業報告）", titleEn: "Global Payments Report 2026 (industry)",
    typeEn: "Report", typeZh: "產業報告",
    noteEn: "Useful numbers, promotional framing. Take the charts, leave the narrative.",
    noteZh: "數字有用，敘事偏推銷。拿圖表，不要拿結論。",
  },
  {
    cat: "report", icon: "trend", title: "金管會金融科技發展年報（台灣）", titleEn: "FSC Annual FinTech Development Report (Taiwan)",
    typeEn: "Report", typeZh: "產業報告",
    noteEn: "The only place with consistent local numbers. Boring, indispensable.",
    noteZh: "唯一有一致本地數字的來源。無聊，但不可取代。",
  },
  {
    cat: "book", icon: "book", title: "Storytelling with Data — Cole Nussbaumer Knaflic",
    typeEn: "Book", typeZh: "書籍",
    noteEn: "Not FinTech, but half our project reviews fail on presentation, not analysis.",
    noteZh: "不是金融科技，但我們有一半的專案檢視是敗在表達而不是分析。",
  },
] as const;

const contests = [
  {
    statusEn: "21 days left", statusZh: "剩 21 天", statusClass: "tag tag--warn", due: "DUE 09.26",
    titleEn: "National FinTech Innovation Competition", titleZh: "全國金融科技創新競賽",
    bodyEn: "Team of 3–5, one prototype, ten-minute pitch. FTL is entering two teams; one seat is still open.",
    bodyZh: "3–5 人一組，一個原型，十分鐘簡報。FTL 報名兩隊，還有一個空位。",
    actionEn: "Join a team", actionZh: "加入隊伍",
  },
  {
    statusEn: "Registration open", statusZh: "開放報名", statusClass: "tag", due: "DUE 10.15",
    titleEn: "Bank Data Analytics Case Challenge", titleZh: "銀行數據分析個案挑戰賽",
    bodyEn: "Real anonymised transaction data. Heavy on SQL. Last year’s winning deck is in the library.",
    bodyZh: "提供真實去識別化交易資料，SQL 用量很大。去年冠軍的簡報放在圖書館。",
    actionEn: "See details", actionZh: "看細節",
  },
  {
    statusEn: "Registration open", statusZh: "開放報名", statusClass: "tag", due: "DUE 11.08",
    titleEn: "Asia-Pacific Student RegTech Hackathon", titleZh: "亞太學生法遵科技黑客松",
    bodyEn: "48 hours, English-only judging. Good first international competition — the bar is lower than the name suggests.",
    bodyZh: "48 小時，全英文評審。適合當第一場國際賽——門檻比名字聽起來低。",
    actionEn: "See details", actionZh: "看細節",
  },
] as const;

export function ResourcesPage() {
  return (
    <SitePageShell>
      <main id="main" className="page">
        <section className="pagehead">
          <div className="wrap reveal">
            <span className="eyebrow" data-en="Resources">資源</span>
            <h1 className="h1" data-en="The stuff we wish someone had handed us in year one">大一時希望有人直接給我們的那些東西</h1>
            <p className="lead" data-en="Jobs worth applying to, books and papers worth the weekend, and competitions worth the risk. Curated by officers, updated weekly.">值得投的職缺、值得花一個週末的書與論文、值得冒險的競賽。由幹部篩選，每週更新。</p>
          </div>
        </section>

        <section className="section--tight section" id="jobs">
          <div className="wrap">
            <div className="sec-head reveal"><div><span className="eyebrow" data-en="Job alerts">職缺快報</span><h2 className="h1" data-en="Openings we’d apply to ourselves">我們自己也會投的職缺</h2><p className="lead mt-4" data-en="We only list roles where a student can realistically get an interview, and we say what the bar actually is. Employer names below are placeholders.">只列學生真的有機會拿到面試的職缺，並寫清楚門檻大概在哪。以下公司名稱為示意。</p></div></div>
            <div className="rows" data-stagger="">
              {jobs.map((job) => (
                <a className="row reveal" href="#" key={job.titleEn}>
                  <span className="ios-row__icon"><Icon name="briefcase" /></span>
                  <span className="row__main"><span className="row__title" data-en={job.titleEn}>{job.titleZh}</span><span className="row__meta"><span className="tag tag--ghost" data-en={job.typeEn}>{job.typeZh}</span><span data-en={job.metaEn}>{job.metaZh}</span></span></span>
                  <span className="row__side"><span className={job.statusClass} data-en={job.statusEn}>{job.statusZh}</span><Icon name="chevron-right" className="icon row__chev" /></span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <hr className="divider" />

        <section className="section section--alt" id="library">
          <div className="wrap">
            <div className="sec-head reveal"><div><span className="eyebrow" data-en="FTL Library">FTL 圖書館</span><h2 className="h1" data-en="Read this, skip that">這本值得，那本可以跳過</h2><p className="lead mt-4" data-en="Every entry carries a one-line note from the member who read it — including the ones who thought it was overrated.">每一筆都附上讀過的成員寫的一句話——包含覺得它被高估的那些。</p></div></div>
            <div className="filters reveal" data-filter-group="" data-filter-target="#lib-list" data-filter-empty="#lib-empty" role="group" aria-label="分類篩選">
              <button className="filter" type="button" data-filter="all" aria-pressed="true" data-en="All">全部</button>
              <button className="filter" type="button" data-filter="book" aria-pressed="false" data-en="Books">書籍</button>
              <button className="filter" type="button" data-filter="paper" aria-pressed="false" data-en="Papers">論文</button>
              <button className="filter" type="button" data-filter="report" aria-pressed="false" data-en="Industry reports">產業報告</button>
            </div>
            <div className="rows" id="lib-list" data-stagger="">
              {library.map((item) => (
                <a className="row reveal" href="#" data-cat={item.cat} key={item.title}>
                  <span className="ios-row__icon"><Icon name={item.icon} /></span>
                  <span className="row__main"><span className="row__title" data-en={"titleEn" in item ? item.titleEn : undefined}>{item.title}</span><span className="row__meta"><span className="tag tag--ghost" data-en={item.typeEn}>{item.typeZh}</span><span data-en={item.noteEn}>{item.noteZh}</span></span></span>
                  <span className="row__side"><Icon name="chevron-right" className="icon row__chev" /></span>
                </a>
              ))}
            </div>
            <div className="empty" id="lib-empty" data-show="false">
              <Icon name="inbox" />
              <p data-en="Nothing in this category yet. Suggest something — we add reader picks every month.">這個分類還沒有東西。推薦給我們吧，每個月都會加入成員的推薦。</p>
              <a className="btn" href={withBasePath("/contact/")} data-en="Suggest an entry">推薦一筆</a>
            </div>
          </div>
        </section>

        <hr className="divider" />

        <section className="section" id="contests">
          <div className="wrap">
            <div className="sec-head reveal"><div><span className="eyebrow" data-en="Competitions">競賽</span><h2 className="h1" data-en="Worth the risk">值得冒這個險的比賽</h2><p className="lead mt-4" data-en="FTL forms teams for these. If you want in but have no teammates, that is exactly what the club is for.">FTL 會替這些比賽組隊。想參加但沒隊友——社團存在的理由就是這個。</p></div></div>
            <div className="grid grid-3" data-stagger="">
              {contests.map((contest) => (
                <a className="card reveal" href="#" key={contest.due}>
                  <div className="card__top"><span className={contest.statusClass} data-en={contest.statusEn}>{contest.statusZh}</span><span className="card__index num">{contest.due}</span></div>
                  <h3 className="h3" data-en={contest.titleEn}>{contest.titleZh}</h3>
                  <p className="card__body" data-en={contest.bodyEn}>{contest.bodyZh}</p>
                  <div className="card__foot"><span className="link-arrow"><span data-en={contest.actionEn}>{contest.actionZh}</span><Icon name="arrow-right" /></span></div>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
    </SitePageShell>
  );
}
