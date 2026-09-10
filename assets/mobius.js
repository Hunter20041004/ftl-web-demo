/* ══════════════════════════════════════════════════════════════
   全域莫比烏斯場 — 一條幾何，沿路改變它「怎麼被看見」

   ⚠️ 改動前請先讀這段
   這裡刻意把 **幾何** 和 **渲染** 分開：

     GEOMETRY  一條閉合脊線 ＋ 沿著它的莫比烏斯帶（奇數個半扭轉）
               整份文件只有這一條，不是每區各一段。

     RENDERING 沿著同一條線，用「文件位置 q（0=頁首 1=頁尾）」
               去查表決定：帶寬、面的濃度、邊線濃度、等高線濃度、
               柔光濃度、顏色。所以它會出現→淡掉→只剩一條邊→
               變成一團光→再浮出來。

   連續 ≠ 一直看得見。這是這一版最重要的一句話。

   四個渲染層，全部長在同一條幾何上：
     1 halo   大範圍柔光（用「巢狀漸窄的帶」做出模糊感，不用 filter）
     2 surf   曲面本身（多數地方幾乎透明）
     3 cont   等高線／邊線（稀疏，常常整段是 0）
     4 pulse  沿著唯一那條邊跑的光點
   ══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var PAGE = document.querySelector('.page');
  if (!PAGE) return;
  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var TAU = Math.PI * 2;

  function cross(a, b) {
    return [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];
  }
  function unit(a) {
    var l = Math.sqrt(a[0]*a[0]+a[1]*a[1]+a[2]*a[2]) || 1;
    return [a[0]/l, a[1]/l, a[2]/l];
  }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }

  /* 沿頁面位置查表用的平滑折線。t 用 smoothstep，轉折才不會有稜角。 */
  function ramp(pts) {
    return function (q) {
      if (q <= pts[0][0]) return pts[0][1];
      for (var i = 1; i < pts.length; i++) {
        if (q <= pts[i][0]) {
          var t = (q - pts[i-1][0]) / (pts[i][0] - pts[i-1][0]);
          t = t * t * (3 - 2 * t);
          return pts[i-1][1] + (pts[i][1] - pts[i-1][1]) * t;
        }
      }
      return pts[pts.length-1][1];
    };
  }
  function rampRGB(pts) {
    var ch = [0,1,2].map(function (c) {
      return ramp(pts.map(function (p) { return [p[0], p[1][c]]; }));
    });
    return function (q) { return [ch[0](q)|0, ch[1](q)|0, ch[2](q)|0]; };
  }

  /* ── 幾何參數 ─────────────────────────────────────────────
     橫向擺盪用三個諧波疊起來，總擺幅接近整個頁寬。
     ⚠️ 不要把 a1/a2/a3 調小 —— 擺幅一小，脊線就會變成一條
     幾乎垂直的線，帶子的兩條邊會退化成兩條平行直線（看起來像水管）。 */
  var BASE = {
    cx: 0.50, a1: 0.40, p1: 0.55,
              a2: 0.22, p2: 2.30,
              a3: 0.10, p3: 4.10,
    cy: 0.42, ry: 0.52,
    rz: 1.00, pz: 0.10, rz2: 0.42, rz3: 0.20,
    tilt: 3.00                       /* 半扭轉次數，奇數才是莫比烏斯 */
  };
  var VAR_A = { p1: 0.55, a2: 0.22, rz2: 0.42 };
  var VAR_B = { p1: 0.64, a2: 0.26, rz2: 0.50 };

  function params(v, fit) {
    var p = {}, k;
    for (k in BASE) p[k] = BASE[k];
    for (k in (v || {})) p[k] = v[k];
    for (k in (fit || {})) p[k] = fit[k];
    return p;
  }

  /* ── 三個 ANCHOR：整頁的視覺敘事 ───────────────────────────
     不再以 section 為單位打分數（「現在到了 Events 所以 opacity=.34」
     那種寫法會讓效果跟區塊邊界對齊，看起來像每區各有一段裝飾）。

     改成沿文件進度 q 的三個錨點，中間是 trace：

       ANCHOR A  首屏右側 —— 最強的一次翻面
         trace
       ANCHOR B  社團宗旨下半 → 近期活動上半（刻意不切在區塊交界上）
         trace
       ANCHOR C  深藍區上緣之前 → 深藍區中段
         resolution

     錨點的位置在 runtime 由 DOM 算出來，不寫死。 */
  /* ⚠️ 想整體調濃／調淡，只動這一個數字。
     1 = 現在這樣；1.3 ≈ 明顯看得到；0.7 ≈ 幾乎只剩空氣感。 */
  var INTENSITY = 1.42;
  /* 窄螢幕比例接近 1:16，任何線條都會被讀成垂直條紋 → 線壓低，只留光 */
  var NARROW_LINE = 0.22;

  var TRACE = { vis:.07, body:.02, edge:.20, cont:.02, glow:.115, w:.013 };
  var PEAK  = { vis:1.0, body:1.00, edge:1.00, cont:.85, glow:1.00, w:.205 };

  var ENV = null, ANCHORS = null;

  function anchorPlan(H) {
    var pageTop = PAGE.getBoundingClientRect().top + window.scrollY;
    function box(sel) {
      var e = document.querySelector(sel); if (!e) return null;
      var r = e.getBoundingClientRect();
      return { a:(r.top+window.scrollY-pageTop)/H, b:(r.top+window.scrollY-pageTop+r.height)/H };
    }
    var hero = box('.hero'), pane = box('.pane--rows'), mis = box('#mission'),
        ev = box('#events'), con = box('#contact');
    /* ⚠️ 用 .pane--rows 的中心會落在 q≈0.05，一半在頁面上緣外被裁掉，
       等於浪費掉最重要的那個 anchor。改成兩片玻璃的整體中心偏下。 */
    var stats = box('.pane--stats');
    /* ⚠️ 錨點放在玻璃片中央的話，翻面整段都被卡片遮住，看不到。
       放在 stats 下緣到 hero 下緣之間那塊空白 —— 交叉點露在外面，
       帶子的其他部分才從卡片後面穿過去。 */
    var A = (stats && hero) ? (stats.b + hero.b) / 2
          : (hero ? hero.a + (hero.b - hero.a) * 0.72 : 0.14);
    /* B 刻意落在 mission 下半，而不是 mission/events 的交界線上 —— */
    /* 事件對齊區塊邊界的話，又會變成「每一區自己的效果」。 */
    var B = (mis && ev) ? mis.b - (mis.b - mis.a) * 0.18 : 0.55;
    var C = con ? con.a + (con.b - con.a) * 0.34 : 0.80;
    return [ { q:A, s:0.085, k:1.00 },
             { q:B, s:0.062, k:0.66 },
             { q:C, s:0.078, k:0.98 } ];
  }

  function buildEnv(H) {
    ANCHORS = anchorPlan(H);
    function bump(q) {
      var m = 0;
      for (var i = 0; i < ANCHORS.length; i++) {
        var a = ANCHORS[i], t = (q - a.q) / a.s;
        var v = a.k * Math.exp(-t * t);
        if (v > m) m = v;
      }
      return m > 1 ? 1 : m;
    }
    function mix(key, curve) {
      var lo = TRACE[key], hi = PEAK[key];
      return function (q) {
        var bmp = bump(q);
        return lo + (hi - lo) * (curve ? Math.pow(bmp, curve) : bmp);
      };
    }
    return {
      vis:  mix('vis'),   body: mix('body', 1.5), edge: mix('edge', 0.8),
      cont: mix('cont', 1.7), glow: mix('glow'),  width: mix('w', 1.2),
      bump: bump
    };
  }

  /* 顏色沿路演化。⚠️ 進入深藍實塊之前就開始轉成近白 ——
     所以在淺色區它會先「淡到幾乎不見」，進到深藍後同一個顏色
     才重新變成光。這樣交界處不會有材質突然換掉的斷點。 */
  /* ⚠️ 轉白的位置必須落在深藍區「裡面」（q≈0.80-0.88），不能落在它前面。
     量過一次：白點放在 0.68-0.74 的話，帶子在進入深藍區之前就已經
     白到看不見，於是它會「剛好從深藍區的上緣開始出現」——
     那就是使用者說的「貼上去的」。現在上緣兩側都看得到，只是濃淡不同。 */
  var COLOR = rampRGB([
    [0.00, [143,217,248]],   // 首屏：青
    [0.22, [150,200,240]],
    [0.42, [124,190,236]],
    [0.62, [150,205,242]],
    [0.74, [178,220,248]],   // 深藍區上緣：still 藍，白底上看得到
    [0.80, [224,242,255]],   // 進到深藍區內部才轉成近白的光
    [0.88, [232,246,255]],
    [0.95, [168,210,242]],   // 回到淺色區，慢慢轉回藍
    [1.00, [150,200,238]]
  ]);
  /* 背面比正面深一階。差異要細微 —— 它不是另一個面，
     只是同一個面的另一側，用光線語言區分。 */
  var COLOR_BACK = rampRGB([
    [0.00, [ 72,140,208]],
    [0.42, [ 66,128,196]],
    [0.74, [126,178,226]],
    [0.82, [186,218,246]],
    [1.00, [ 88,150,206]]
  ]);

  /* ── 幾何 ───────────────────────────────────────────────── */
  function build(W, H, P, steps, anchorQ) {
    function spine(u) {
      return [
        P.cx*W + W*(P.a1*Math.sin(u+P.p1) + P.a2*Math.sin(2*u+P.p2) + P.a3*Math.sin(3*u+P.p3)),
        P.cy*H - P.ry*H*Math.cos(u),
        P.rz*Math.sin(u+P.pz) + P.rz2*Math.sin(2*u+0.4) + P.rz3*Math.sin(3*u+1.9)
      ];
    }
    var du = TAU / steps;

    /* ── 扭轉相位：把「翻面」排到 anchor 上 ────────────────────
       原本是 cos(u * tilt / 2)，扭轉平均分佈在整圈上，翻面會發生在
       幾何算出來的位置，而不是敘事想要的位置。

       改成累積相位 phi(u)：先給一條在 anchor 附近隆起的密度曲線，
       再積分成單調遞增的相位。只要 phi(2π) - phi(0) = 3π
       （奇數個半扭轉），它仍然是不折不扣的莫比烏斯帶。 */
    var TOTAL = Math.PI * P.tilt;              /* tilt=3 → 3π，奇數 */
    var PHI = (function () {
      var uA = (anchorQ || []).map(function (q) {
        var c = (P.cy - q) / P.ry;
        return Math.acos(c < -1 ? -1 : c > 1 ? 1 : c);   /* 下行段對應的 u */
      });
      var N = 720, dens = new Float64Array(N + 1), cum = new Float64Array(N + 1), tot = 0, i;
      for (i = 0; i <= N; i++) {
        var uu2 = i * TAU / N, d = 0.45;       /* 基礎密度：其他地方也緩慢在轉 */
        for (var j2 = 0; j2 < uA.length; j2++) {
          var t2 = (uu2 - uA[j2]) / 0.30;
          d += 2.6 * Math.exp(-t2 * t2);
        }
        dens[i] = d;
      }
      for (i = 1; i <= N; i++) { tot += (dens[i] + dens[i-1]) / 2; cum[i] = tot; }
      return function (u) {
        var wrap = Math.floor(u / TAU), r = u - wrap * TAU;
        var x = r / TAU * N, i0 = Math.floor(x), f = x - i0;
        if (i0 >= N) { i0 = N - 1; f = 1; }
        var c = cum[i0] + (cum[i0+1] - cum[i0]) * f;
        return wrap * TOTAL + (c / tot) * TOTAL;
      };
    })();

    function frame(u) {
      var a = spine(u-du*0.5), b = spine(u+du*0.5);
      var T = unit([b[0]-a[0], b[1]-a[1], b[2]-a[2]]);
      var b1 = unit(cross(T, [0,0,1]));
      return { p: spine(u), T: T, b1: b1, b2: unit(cross(T, b1)) };
    }
    /* 帶寬查的是「這一點在文件的哪個高度」，不是查 u ——
       所以寬度變化跟頁面內容對得起來。 */
    function halfw(f) { return ENV.width(clamp(f.p[1]/H, 0, 1)) * W * 0.5; }
    function dir(u, f) {
      var ph = PHI(u), c = Math.cos(ph), s = Math.sin(ph);
      return [f.b1[0]*c + f.b2[0]*s, f.b1[1]*c + f.b2[1]*s, f.b1[2]*c + f.b2[2]*s];
    }
    function pt(f, d, v) { return [f.p[0]+v*d[0], f.p[1]+v*d[1]]; }

    var zmax = P.rz + P.rz2 + P.rz3;
    var surf = [], cont = [], edge = [], halo = [];
    var HALO_EVERY = Math.max(2, Math.round(steps / 190));
    var prevF = null, prevD = null, prevW = 0, prevHalo = null;

    for (var i = 0; i <= steps; i++) {
      var u = i*du, f = frame(u), d = dir(u, f), w = halfw(f);
      var q = clamp(f.p[1]/H, 0, 1);
      if (prevF) {
        var A0 = pt(prevF, prevD, -prevW), B0 = pt(prevF, prevD, prevW);
        var A1 = pt(f, d, -w),             B1 = pt(f, d, w);
        var n = unit(cross(f.T, d));
        /* face = 這一小片有多正對觀者。1 = 正面朝我們，0 = 側身。
           翻面之所以看得懂，就是靠這個值在扭轉處掃過 1 → 0 → 1。 */
        var face = Math.abs(n[2]);
        surf.push({
          d: 'M'+A0[0].toFixed(1)+' '+A0[1].toFixed(1)+'L'+B0[0].toFixed(1)+' '+B0[1].toFixed(1)+
             'L'+B1[0].toFixed(1)+' '+B1[1].toFixed(1)+'L'+A1[0].toFixed(1)+' '+A1[1].toFixed(1)+'Z',
          z: (f.p[2]+prevF.p[2])*0.5/zmax, back: n[2] < 0, q: q, face: face
        });
        /* 邊線切成短段，每段自己的濃度 —— 這樣才能「有時一條邊、
           有時沒有邊」，而不是永遠兩條平行輪廓。 */
        if (i % 3 === 0) {
          edge.push({ d:'M'+B0[0].toFixed(1)+' '+B0[1].toFixed(1)+'L'+B1[0].toFixed(1)+' '+B1[1].toFixed(1),
                      q:q, z:f.p[2]/zmax, side:0, face:face });
          edge.push({ d:'M'+A0[0].toFixed(1)+' '+A0[1].toFixed(1)+'L'+A1[0].toFixed(1)+' '+A1[1].toFixed(1),
                      q:q, z:f.p[2]/zmax, side:1, face:face });
        }
      }
      if (i % 6 === 0 && prevF) {
        var a = pt(f, d, -w), b = pt(f, d, w);
        cont.push({ d:'M'+a[0].toFixed(1)+' '+a[1].toFixed(1)+'L'+b[0].toFixed(1)+' '+b[1].toFixed(1),
                    q:q, z:f.p[2]/zmax });
      }
      /* 柔光：同一條脊線，但帶寬放大好幾倍。用三層巢狀、由寬到窄的
         帶疊出柔邊 —— 這是「不用 filter 的模糊」。 */
      if (i % HALO_EVERY === 0) {
        var cur = [f, d, w, q];
        if (prevHalo) halo.push({ a: prevHalo, b: cur });
        prevHalo = cur;
      }
      prevF = f; prevD = d; prevW = w;
    }

    /* 唯一的那條邊：u 走到 4π 才回到起點，所以它把整頁走兩遍 */
    var pulse = '';
    for (var j = 0; j <= steps*2; j++) {
      var uu = j*du, um = uu % TAU, ff = frame(um);
      var ph2 = PHI(uu), cc = Math.cos(ph2), ss = Math.sin(ph2);
      var dd = [ff.b1[0]*cc + ff.b2[0]*ss, ff.b1[1]*cc + ff.b2[1]*ss];
      var ww = halfw(ff);
      pulse += (j?'L':'M') + (ff.p[0]+ww*dd[0]).toFixed(1) + ' ' + (ff.p[1]+ww*dd[1]).toFixed(1);
    }
    return { surf: surf, cont: cont, edge: edge, halo: halo, pulse: pulse, W: W, H: H };
  }

  /* ── 渲染：同一份幾何，兩種材質 ─────────────────────────
     dark = 壓在深藍實塊上的那份。幾何完全一樣、位置完全一樣，
     只有材質不同（淺色區是半透明的面，深藍區只剩光與一條淡邊）。 */
  function paint(g, dark, narrow) {
    var out = { halo: [], surf: [], cont: [], edge: [] };
    var K = INTENSITY * (narrow ? 0.82 : 1), KL = INTENSITY * (narrow ? NARROW_LINE : 1);
    var rgb = function (c) { return 'rgb('+c[0]+','+c[1]+','+c[2]+')'; };

    /* 1 — 柔光。三層巢狀帶，寬→窄、淡→稍濃 */
    /* ⚠️ 深藍區的乘數刻意比淺色區低很多。同樣的 alpha，
       亮色壓在深藍上的觀感強度是壓在白底上的好幾倍 ——
       量過：不調的話深藍區的視覺重量會是首屏的 6 倍。 */
    var RINGS = dark ? [[3.4,.013],[2.1,.017],[1.25,.022]]
                     : [[3.6,.034],[2.2,.044],[1.3,.056]];
    g.halo.forEach(function (seg) {
      /* ⚠️ 柔光只吃 glow，不再乘 vis。兩個都乘的話反應是二次的，
         中間段的分數會直接塌到看不見（調過三輪才發現）。 */
      var q = seg.b[3], gl = ENV.glow(q) * K;
      if (gl < 0.005) return;      /* 太高會變成可見度懸崖，調過一次 */
      var col = rgb(COLOR(q));
      RINGS.forEach(function (r) {
        var k = r[0];
        var A0=[seg.a[0].p[0]-seg.a[1][0]*seg.a[2]*k, seg.a[0].p[1]-seg.a[1][1]*seg.a[2]*k];
        var B0=[seg.a[0].p[0]+seg.a[1][0]*seg.a[2]*k, seg.a[0].p[1]+seg.a[1][1]*seg.a[2]*k];
        var A1=[seg.b[0].p[0]-seg.b[1][0]*seg.b[2]*k, seg.b[0].p[1]-seg.b[1][1]*seg.b[2]*k];
        var B1=[seg.b[0].p[0]+seg.b[1][0]*seg.b[2]*k, seg.b[0].p[1]+seg.b[1][1]*seg.b[2]*k];
        out.halo.push('<path d="M'+A0[0].toFixed(1)+' '+A0[1].toFixed(1)+
          'L'+B0[0].toFixed(1)+' '+B0[1].toFixed(1)+'L'+B1[0].toFixed(1)+' '+B1[1].toFixed(1)+
          'L'+A1[0].toFixed(1)+' '+A1[1].toFixed(1)+'Z" fill="'+col+
          '" fill-opacity="'+(r[1]*gl).toFixed(4)+'"/>');
      });
    });

    /* 2 — 曲面。多數位置幾乎透明 */
    g.surf.forEach(function (s) {
      var t = (s.z+1)/2;
      /* 正對觀者時實、側身時淡 —— 曲面「轉過去」看得出來的關鍵 */
      var fa = 0.26 + 0.74 * (s.face === undefined ? 1 : s.face);
      var a = ENV.body(s.q) * ENV.vis(s.q) * K * (dark ? 0.055 : 0.20) * (0.45 + t*0.75) * fa;
      /* 背面：更深一階的藍、再稍微淡一點。差異刻意細微，
         但在翻面處會讓人讀得出「換面了」。 */
      if (s.back) a *= 0.86;
      if (a < 0.0012) return;
      out.surf.push('<path d="'+s.d+'" fill="'+rgb((s.back?COLOR_BACK:COLOR)(s.q))+
        '" fill-opacity="'+a.toFixed(4)+'"/>');
    });

    /* 3 — 等高線與邊線。稀疏，且濃度沿路查表 */
    /* 邊線與等高線要「有時候有、有時候完全沒有」。
       只靠區塊分數的話，同一區裡會整段均勻出現，看起來又變成輪廓分明的物件。
       這兩條高頻窗把它們打散成塊狀，而且相位錯開，
       避免邊線與等高線同時出現變成一根網格管子。 */
    function patchE(q) { var v = Math.sin(q*TAU*3.7 + 1.10); return v>0 ? Math.pow(v,1.5) : 0; }
    function patchC(q) { var v = Math.sin(q*TAU*2.6 + 4.05); return v>0 ? Math.pow(v,1.8) : 0; }

    g.cont.forEach(function (c) {
      var a = ENV.cont(c.q) * ENV.vis(c.q) * patchC(c.q) * KL * (dark?0.22:0.66) * (0.4+((c.z+1)/2)*0.8);
      if (a < 0.004) return;
      out.cont.push('<path d="'+c.d+'" stroke="'+rgb(COLOR(c.q))+'" stroke-opacity="'+a.toFixed(4)+'"/>');
    });
    g.edge.forEach(function (e) {
      /* 兩條邊給不同權重 —— 常常只有其中一條看得見 */
      var lean = e.side ? 0.45 : 1.0;
      /* 側身時看到的就是邊 —— 所以 face 越低，邊越明顯。
         這一項跟上面的 fa 是互補的，翻面處於是變成「面淡掉、邊浮出來」。 */
      var ef = 0.45 + 1.05 * (1 - (e.face === undefined ? 1 : e.face));
      var a = ENV.edge(e.q) * ENV.vis(e.q) * lean * patchE(e.q) * KL * ef * (dark?0.26:0.62) * (0.35+((e.z+1)/2)*0.9);
      if (a < 0.005) return;
      var col = rgb(COLOR(e.q));
      /* 寬而淡的一筆墊在細線下面 → 讀起來是「邊緣受光」，
         不是「物件的輪廓」。使用者上一版的抱怨就是輪廓太硬。 */
      out.edge.push('<path class="lit" d="'+e.d+'" stroke="'+col+
        '" stroke-opacity="'+(a*0.42).toFixed(4)+'"/>');
      out.edge.push('<path d="'+e.d+'" stroke="'+col+'" stroke-opacity="'+a.toFixed(4)+'"/>');
    });

    return '<svg viewBox="0 0 '+g.W+' '+g.H+'" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">'+
      '<g class="mob__halo">'+out.halo.join('')+'</g>'+
      '<g class="mob__surf">'+out.surf.join('')+'</g>'+
      '<g class="mob__cont">'+out.cont.join('')+'</g>'+
      '<g class="mob__edge">'+out.edge.join('')+'</g>'+
      '<path class="pulse" d="'+g.pulse+'"/>'+
      '</svg>';
  }

  /* ── 掛載 ───────────────────────────────────────────────── */
  var layer = null, slabLayer = null, bg = null, fg = null, lastKey = '';

  function field(H) {
    var pageTop = PAGE.getBoundingClientRect().top + window.scrollY;
    var stops = ['rgba(232,241,253,0) 0px'], F = 170;
    document.querySelectorAll('.section--alt').forEach(function (sec) {
      var r = sec.getBoundingClientRect();
      var a = r.top + window.scrollY - pageTop, b = a + r.height;
      stops.push('rgba(232,241,253,0) '   + Math.round(a - F) + 'px');
      stops.push('rgba(232,241,253,.88) ' + Math.round(a + F*0.6) + 'px');
      stops.push('rgba(232,241,253,.88) ' + Math.round(b - F*0.6) + 'px');
      stops.push('rgba(232,241,253,0) '   + Math.round(b + F) + 'px');
    });
    stops.push('rgba(232,241,253,0) ' + H + 'px');
    return 'linear-gradient(180deg,' + stops.join(',') + ')';
  }

  function mount() {
    var W = PAGE.clientWidth, H = PAGE.scrollHeight;
    if (!W || !H) return;
    var key = W + 'x' + H;
    if (key === lastKey) return;
    lastKey = key;

    ENV = buildEnv(H);

    var narrow = W < 760;
    /* 窄螢幕頁面比例接近 1:16，脊線本來就會偏直。
       加大擺盪、提高扭轉次數（5 仍是奇數），讓結構靠翻面被看見。 */
    var fit = narrow ? { a1:0.52, a2:0.30, a3:0.14, tilt:5.00 } : {};
    var steps = narrow ? 420 : 600;
    var aq = ANCHORS.map(function (a) { return a.q; });
    var gA = build(W, H, params(VAR_A, fit), steps, aq);
    var gB = REDUCED ? null : build(W, H, params(VAR_B, fit), steps, aq);

    function shell(dark) {
      return '<div class="mob__v mob__v--a">' + paint(gA, dark, narrow) + '</div>' +
             (gB ? '<div class="mob__v mob__v--b">' + paint(gB, dark, narrow) + '</div>' : '');
    }

    if (!bg) {
      bg = document.createElement('div');
      bg.className = 'mob-bg'; bg.setAttribute('aria-hidden','true');
      PAGE.insertBefore(bg, PAGE.firstChild);
    }
    bg.style.height = H + 'px';
    bg.style.backgroundImage = field(H);
    document.documentElement.classList.add('mob-on');

    if (!layer) {
      layer = document.createElement('div');
      layer.className = 'mob'; layer.setAttribute('aria-hidden','true');
      PAGE.insertBefore(layer, bg.nextSibling);
    }
    layer.style.height = H + 'px';
    layer.innerHTML = shell(false);

    /* 前景霧：疊在帶子「上面」、內容「下面」。
       ⚠️ 存在的理由是遮蔽 —— 如果帶子永遠在所有東西的最後面，
       它就只是背景圖，不會有空間感。這一層讓其中一段被空氣蓋掉，
       另一段才顯得是穿到卡片後面。 */
    if (!fg) {
      fg = document.createElement('div');
      fg.className = 'mob-fg'; fg.setAttribute('aria-hidden','true');
      PAGE.insertBefore(fg, layer.nextSibling);
    }
    fg.style.height = H + 'px';
    var aY = ANCHORS[0].q * 100;
    fg.style.backgroundImage =
      'radial-gradient(58% 15% at 12% ' + (aY + 1.2).toFixed(2) + '%, rgba(251,250,255,.92), rgba(251,250,255,0) 70%),' +
      'radial-gradient(34% 9% at 86% ' + (ANCHORS[1].q*100 + 2).toFixed(2) + '%, rgba(251,250,255,.72), rgba(251,250,255,0) 72%),' +
      'radial-gradient(40% 7% at 8% '  + (ANCHORS[2].q*100 - 3).toFixed(2) + '%, rgba(251,250,255,.62), rgba(251,250,255,0) 74%)';

    var slab = document.querySelector('.slab');
    if (slab) {
      if (!slabLayer) {
        slabLayer = document.createElement('div');
        slabLayer.className = 'mob mob--in'; slabLayer.setAttribute('aria-hidden','true');
        slab.insertBefore(slabLayer, slab.firstChild);
      }
      var off = slab.getBoundingClientRect().top - PAGE.getBoundingClientRect().top;
      slabLayer.style.top = (-off) + 'px';
      slabLayer.style.height = H + 'px';
      slabLayer.innerHTML = shell(true);
    }

    [layer, slabLayer].forEach(function (L) {
      if (!L) return;
      L.querySelectorAll('.pulse').forEach(function (el) {
        var len = el.getTotalLength();
        el.style.strokeDasharray = '60 ' + Math.round(len);
        el.style.strokeDashoffset = Math.round(len + 60);
      });
    });
  }

  /* ── 動態：只寫 transform，幾何不重算 ───────────────────── */
  var sx = 0, sy = 0, mx = 0, my = 0, raf = null;
  function write() {
    raf = null;
    var t = 'translate3d(' + (sx+mx).toFixed(2) + 'px,' + (sy+my).toFixed(2) + 'px,0)';
    if (layer) layer.style.transform = t;
    if (slabLayer) slabLayer.style.transform = t;
  }
  function schedule() { if (!raf) raf = requestAnimationFrame(write); }

  /* 互動刻意只留兩個：滑鼠景深（幾 px）＋ 沿邊跑的光點。
     ⚠️ 不要再加第三個。原本還有一個捲動位移，三個疊起來
     會變成「每個東西都在動」，那正是要避免的 AI 感。 */
  if (!REDUCED) {
    if (window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
      window.addEventListener('mousemove', function (e) {
        mx = (e.clientX/window.innerWidth - 0.5) * 5;
        my = (e.clientY/window.innerHeight - 0.5) * 5;
        schedule();
      }, { passive: true });
    }
  }

  function boot() {
    mount();
    [80, 400, 1200].forEach(function (d) { setTimeout(mount, d); });
    window.addEventListener('load', mount);
    var ro = new ResizeObserver(function () { mount(); });
    ro.observe(PAGE); ro.observe(document.body);
    var t = null;
    window.addEventListener('resize', function () {
      clearTimeout(t); t = setTimeout(function () { lastKey = ''; mount(); }, 220);
    });
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(boot);
  else window.addEventListener('load', boot);
})();
