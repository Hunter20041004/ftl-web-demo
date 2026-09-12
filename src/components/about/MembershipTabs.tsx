"use client";

import { useState } from "react";
import { membership } from "@/lib/content";
import { withBasePath } from "@/lib/site-data";

function Icon({ name }: { name: string }) {
  return (
    <svg className="icon" aria-hidden="true">
      <use href={`#i-${name}`} />
    </svg>
  );
}

type Kind = "project" | "auditor";

// 社員相關資訊：先選身份，四個步驟的內容跟著切換。
// 專案生＝書審＋面試 → 繳 3,000 → 出席領回；旁聽生＝免書審 → 繳 1,500，沒有獎勵金。
export function MembershipTabs() {
  const [kind, setKind] = useState<Kind>("project");
  const type = membership.types[kind === "project" ? 0 : 1];

  return (
    <div className="mtabs" data-membership={kind}>
      <div className="mtabs__switch" role="tablist" aria-label="社員身份">
        {(["project", "auditor"] as Kind[]).map((k, i) => (
          <button
            key={k}
            type="button"
            role="tab"
            className={`mtabs__tab${kind === k ? " mtabs__tab--on" : ""}`}
            aria-selected={kind === k}
            data-membership-tab={k}
            data-en={membership.types[i].en} suppressHydrationWarning
            onClick={() => setKind(k)}
          >
            {membership.types[i].name}
          </button>
        ))}
      </div>

      <div className="flow" key={kind}>
        <article className="flow__step reveal in" id="types">
          <span className="flow__n">1</span>
          <div className="flow__body">
            <div className="card">
              <div className="card__top"><h3 className="h2" data-en={type.en} suppressHydrationWarning>{type.name}</h3><span className="tag num" data-en={type.feeEn} suppressHydrationWarning>{type.fee}</span></div>
              <p className="card__body"><b data-en="How｜" suppressHydrationWarning>入社方式｜</b><span data-en={type.howEn} suppressHydrationWarning>{type.how}</span></p>
              <p className="card__body"><b data-en="Includes｜" suppressHydrationWarning>包含｜</b><span data-en={type.perksEn} suppressHydrationWarning>{type.perks}</span></p>
            </div>
          </div>
        </article>

        <article className="flow__step reveal in" id="timeline">
          <span className="flow__n">2</span>
          <div className="flow__body">
            {kind === "project" ? (
              <>
                <h3 className="h2" data-en="Screening and interview" suppressHydrationWarning>書審與面試</h3>
                <p className="card__body mt-3" data-en="Fill in the Google form and submit a résumé; interviews are held in groups." suppressHydrationWarning>填寫 Google 表單並繳交履歷，面試採團體面試。</p>
                <ol className="timeline-glass mt-5">
                  {membership.timeline.map((step) => (
                    <li className="tstep" key={step.date}>
                      <span className="tstep__date num">{step.date}</span>
                      <span className="tstep__label" data-en={step.en} suppressHydrationWarning>{step.zh}</span>
                    </li>
                  ))}
                </ol>
              </>
            ) : (
              <>
                <h3 className="h2" data-en="No screening" suppressHydrationWarning>免書審</h3>
                <p className="card__body mt-3" data-en="Auditors join at any time of the year through the LINE Bot." suppressHydrationWarning>全年隨時透過 LINE Bot 繳費入社。</p>
              </>
            )}
          </div>
        </article>

        <article className="flow__step reveal in" id="payment">
          <span className="flow__n">3</span>
          <div className="flow__body">
            <h3 className="h2"><span data-en="Pay" suppressHydrationWarning>繳費</span>　<span className="grad-text num" data-en={type.feeEn} suppressHydrationWarning>{type.fee}</span></h3>
            <ol className="steps mt-4">
              {membership.payment.map((step, index) => (
                <li className="card" key={step}><span className="numchip">{index + 1}</span><p className="card__body" data-en={kind === "auditor" && index === 0 ? "Add the official LINE Bot and fill in your basic details." : membership.paymentEn[index]} suppressHydrationWarning>{kind === "auditor" && index === 0 ? "加入官方 LINE Bot，完成基本資料填寫。" : step}</p></li>
              ))}
            </ol>
          </div>
        </article>

        <article className="flow__step reveal in" id="reward">
          <span className="flow__n">4</span>
          <div className="flow__body">
            {kind === "project" ? (
              <>
                <h3 className="h2" data-en="Attendance reward" suppressHydrationWarning>出席獎勵金</h3>
                <div className="grid grid-2 mt-4" style={{ alignItems: "start" }}>
                  <div className="panel">
                    <table className="tiers">
                      <thead><tr><th data-en="Sessions attended (of 11)" suppressHydrationWarning>出席堂數（計 11 堂）</th><th data-en="Reward" suppressHydrationWarning>獎勵金</th></tr></thead>
                      <tbody>
                        {membership.reward.tiers.map(([sessions, amount, sessionsEn, amountEn]) => (
                          <tr key={sessions}><td data-en={sessionsEn} suppressHydrationWarning>{sessions}</td><td className="num"><b className="grad-text" data-en={amountEn} suppressHydrationWarning>{amount}</b></td></tr>
                        ))}
                      </tbody>
                    </table>
                    <p className="card__body mt-4" data-en={membership.reward.countedSessionsEn} suppressHydrationWarning>{membership.reward.countedSessions}</p>
                  </div>
                  <div className="stack" style={{ gap: 14 }}>
                    <div className="card"><h4 className="h3" data-en="How attendance is counted" suppressHydrationWarning>出席怎麼算</h4><p className="card__body" data-en={membership.reward.attendanceEn} suppressHydrationWarning>{membership.reward.attendance}</p></div>
                    <div className="card"><h4 className="h3" data-en="When it is paid" suppressHydrationWarning>什麼時候發</h4><p className="card__body" data-en={membership.reward.payoutEn} suppressHydrationWarning>{membership.reward.payout}</p></div>
                    <div className="card"><h4 className="h3" data-en="Points prize (separate)" suppressHydrationWarning>積分獎金（另計）</h4><p className="card__body" data-en={membership.reward.pointsEn} suppressHydrationWarning>{membership.reward.points}</p></div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h3 className="h2" data-en="Attend sessions" suppressHydrationWarning>上社課</h3>
                <p className="card__body mt-3" data-en="Auditors are not eligible for the attendance reward." suppressHydrationWarning>旁聽生不適用出席獎勵金。</p>
                <a className="link-arrow mt-4" href={withBasePath("/events/")}><span data-en="Semester calendar" suppressHydrationWarning>整學期行事曆</span><Icon name="arrow-right" /></a>
              </>
            )}
          </div>
        </article>
      </div>
    </div>
  );
}
