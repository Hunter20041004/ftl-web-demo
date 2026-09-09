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

  /* ── 沿頁面的「表現」曲線 ───────────────────────────────
     這一組決定「哪裡看得見、看見多少、看見的是什麼」。

     ⚠️ 控制點是依「實際量到的區塊位置」長出來的，不是寫死的 q 值。
     之前寫死的版本因為控制點跟真正的區塊邊界對不上，
     結果深藍區的視覺重量是首屏的 6 倍（量出來的，不是猜的）。

     每個區塊給一組目標：
       vis   整體可見度      body 曲面濃度    edge 邊線
       cont  等高線          glow 柔光        w    半帶寬（佔頁寬）
     首屏是最強的一刻，內容區只收到回音。 */
  /* ⚠️ 想整體調濃／調淡，只動這一個數字就好。
     1 = 現在這樣；1.3 大約是「明顯看得到」；0.7 是「幾乎只剩空氣感」。 */
  var INTENSITY = 1.0;

  /* 窄螢幕的頁面比例接近 1:16，任何線條都會被讀成「垂直條紋」。
     所以手機上把邊線與等高線壓下去，改成幾乎只留光。 */
  var NARROW_LINE = 0.22;

  var SCORE = [
    /* key          vis   body  edge  cont  glow   w     */
    ['.hero',      1.00, 1.00, 1.15, 0.95, 1.30, 0.155],
    ['#weekly',    0.34, 0.12, 0.22, 0.08, 0.17, 0.062],
    ['#mission',   0.44, 0.16, 0.70, 0.52, 0.09, 0.076],
    ['#events',    0.34, 0.10, 0.32, 0.12, 0.30, 0.056],
    ['#contact',   0.34, 0.16, 0.30, 0.12, 0.14, 0.080],
    ['#partners',  0.72, 0.24, 0.80, 0.48, 0.30, 0.100]
  ];

  var ENV = null;   /* 由 buildEnv() 依實際版面填好 */

  function buildEnv(H) {
    var pageTop = PAGE.getBoundingClientRect().top + window.scrollY;
    var keys = ['vis','body','edge','cont','glow','w'];
    var pts = {}; keys.forEach(function (k) { pts[k] = []; });

    SCORE.forEach(function (row, i) {
      var el = document.querySelector(row[0]);
      /* 找不到就整組表現曲線會塌掉，而且是安靜地塌 ——
         實測過一次：'hero' 少了一個點，首屏的視覺重量直接歸零。 */
      if (!el) { console.warn('[mobius] 找不到區塊 ' + row[0] + '，表現曲線會不完整'); return; }
      var r = el.getBoundingClientRect();
      var a = (r.top + window.scrollY - pageTop) / H;
      var b = (r.top + window.scrollY - pageTop + r.height) / H;
      /* 每個區塊放三個控制點：進場、中心（給峰值）、離場。
         相鄰區塊之間靠 smoothstep 連起來，所以不會有硬切換。 */
      keys.forEach(function (k, ki) {
        var peak = row[ki + 1];
        pts[k].push([clamp(a + (b-a)*0.10, 0, 1), peak * 0.72]);
        pts[k].push([clamp(a + (b-a)*0.50, 0, 1), peak]);
        pts[k].push([clamp(a + (b-a)*0.90, 0, 1), peak * 0.72]);
      });
    });
    var out = {};
    keys.forEach(function (k) {
      pts[k].sort(function (x, y) { return x[0] - y[0]; });
      out[k] = ramp(pts[k]);
    });
    out.width = out.w;
    return out;
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
  var COLOR_BACK = rampRGB([
    [0.00, [ 96,164,226]],
    [0.42, [ 86,150,214]],
    [0.68, [170,206,240]],
    [0.80, [208,232,252]],
    [1.00, [110,168,220]]
  ]);

  /* ── 幾何 ───────────────────────────────────────────────── */
  function build(W, H, P, steps) {
    function spine(u) {
      return [
        P.cx*W + W*(P.a1*Math.sin(u+P.p1) + P.a2*Math.sin(2*u+P.p2) + P.a3*Math.sin(3*u+P.p3)),
        P.cy*H - P.ry*H*Math.cos(u),
        P.rz*Math.sin(u+P.pz) + P.rz2*Math.sin(2*u+0.4) + P.rz3*Math.sin(3*u+1.9)
      ];
    }
    var du = TAU / steps;
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
      var c = Math.cos(u*P.tilt/2), s = Math.sin(u*P.tilt/2);
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
        var n = cross(f.T, d);
        surf.push({
          d: 'M'+A0[0].toFixed(1)+' '+A0[1].toFixed(1)+'L'+B0[0].toFixed(1)+' '+B0[1].toFixed(1)+
             'L'+B1[0].toFixed(1)+' '+B1[1].toFixed(1)+'L'+A1[0].toFixed(1)+' '+A1[1].toFixed(1)+'Z',
          z: (f.p[2]+prevF.p[2])*0.5/zmax, back: n[2] < 0, q: q
        });
        /* 邊線切成短段，每段自己的濃度 —— 這樣才能「有時一條邊、
           有時沒有邊」，而不是永遠兩條平行輪廓。 */
        if (i % 3 === 0) {
          edge.push({ d:'M'+B0[0].toFixed(1)+' '+B0[1].toFixed(1)+'L'+B1[0].toFixed(1)+' '+B1[1].toFixed(1),
                      q:q, z:f.p[2]/zmax, side:0 });
          edge.push({ d:'M'+A0[0].toFixed(1)+' '+A0[1].toFixed(1)+'L'+A1[0].toFixed(1)+' '+A1[1].toFixed(1),
                      q:q, z:f.p[2]/zmax, side:1 });
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
      var cc = Math.cos(uu*P.tilt/2), ss = Math.sin(uu*P.tilt/2);
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
      var a = ENV.body(s.q) * ENV.vis(s.q) * K * (dark ? 0.055 : 0.20) * (0.45 + t*0.75);
      if (s.back) a *= 0.7;
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
      var a = ENV.edge(e.q) * ENV.vis(e.q) * lean * patchE(e.q) * KL * (dark?0.26:0.62) * (0.35+((e.z+1)/2)*0.9);
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
  var layer = null, slabLayer = null, bg = null, lastKey = '';

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
    var gA = build(W, H, params(VAR_A, fit), steps);
    var gB = REDUCED ? null : build(W, H, params(VAR_B, fit), steps);

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

  if (!REDUCED) {
    window.addEventListener('scroll', function () {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var p = max > 0 ? window.scrollY / max : 0;
      sx = (p - 0.5) * 26; sy = (p - 0.5) * -14;
      schedule();
    }, { passive: true });
    if (window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
      window.addEventListener('mousemove', function (e) {
        mx = (e.clientX/window.innerWidth - 0.5) * 9;
        my = (e.clientY/window.innerHeight - 0.5) * 9;
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
