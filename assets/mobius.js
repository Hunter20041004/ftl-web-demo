/* ══════════════════════════════════════════════════════════════
   全域莫比烏斯系統 — 一條，橫跨整份文件

   ⚠️ 設計前提（改動前請先讀）
   這不是「每個區塊各放一段裝飾」。整頁只有 **一條** 帶子，
   幾何用「文件座標」算出來（0..pageHeight），一次生成，
   所有區塊看到的都是同一條帶子的不同片段。

   幾何＝被拉長成縱向跑道形的莫比烏斯帶：
     · 脊線是一條閉合迴圈，下行段走完整頁、上行段在遠景折返
     · 帶子沿脊線半扭轉一圈 → 正面會變成背面（單面性）
     · 兩段在投影上交錯 → cross-over
     · 迴圈底端落在頁尾附近 → 看得到它彎回去（收束）
     · 邊界只有一條（莫比烏斯的單邊性）→ 光點沿邊跑要走完整頁兩遍
   ══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var PAGE = document.querySelector('.page');
  if (!PAGE) return;

  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── 向量小工具 ─────────────────────────────────────────── */
  function cross(a, b) {
    return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  }
  function unit(a) {
    var l = Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]) || 1;
    return [a[0] / l, a[1] / l, a[2] / l];
  }
  var TAU = Math.PI * 2;

  /* ── 參數 ───────────────────────────────────────────────
     cy/ry 讓迴圈頂端落在 -0.10H（頁面上方切掉）、
     底端落在 0.94H（頁尾前看得到轉彎）。 */
  var BASE = {
    cx: 0.50, rx: 0.40, px: 0.62,     // 主橫向擺盪
    rx2: 0.175, px2: 2.15,            // 二次諧波：讓左右掃動不對稱，製造交錯
    cy: 0.42, ry: 0.52,
    rz: 1.00, pz: 0.10, rz2: 0.34,    // 深度（無單位，之後正規化）
    w0: 0.076, w1: 0.034, wp: 1.7,    // 帶寬（佔頁寬）
    /* 半扭轉的「圈數」。莫比烏斯的單面性只要求**奇數**個半扭轉，
       所以 3 跟 1 一樣都是真的莫比烏斯帶（單面、單邊）。
       用 1 的話，整整 3858px 才轉半圈 —— 肉眼看不出在轉，
       只會看到一條懶洋洋的弧線。用 3 才看得到帶子翻面、
       側身收成一條線、再翻回來。 */
    tilt: 3.00
  };
  /* 呼吸＝在兩組略有差異的參數之間交叉淡入淡出。
     不是旋轉，是曲面本身在慢慢變形。 */
  var VAR_A = { tilt: 3.00, px: 0.62, rx2: 0.175, w1: 0.034 };
  var VAR_B = { tilt: 3.00, px: 0.71, rx2: 0.205, w1: 0.048 };

  function params(v, fit) {
    var p = {}, k;
    for (k in BASE) p[k] = BASE[k];
    for (k in v) p[k] = v[k];
    for (k in (fit || {})) p[k] = fit[k];
    return p;
  }

  /* ── 幾何 ───────────────────────────────────────────────── */
  function build(W, H, P, steps) {
    function spine(u) {
      return [
        P.cx * W + P.rx * W * Math.sin(u + P.px) + P.rx2 * W * Math.sin(2 * u + P.px2),
        P.cy * H - P.ry * H * Math.cos(u),
        P.rz * Math.sin(u + P.pz) + P.rz2 * Math.sin(2 * u + 0.4)
      ];
    }
    var du = TAU / steps;
    /* 沿脊線的活動標架：b1 大致在迴圈平面內，b2 指向深度 */
    function frame(u) {
      var a = spine(u - du * 0.5), b = spine(u + du * 0.5);
      var T = unit([b[0] - a[0], b[1] - a[1], b[2] - a[2]]);
      var b1 = unit(cross(T, [0, 0, 1]));
      return { p: spine(u), T: T, b1: b1, b2: unit(cross(T, b1)) };
    }
    function halfw(u) { return (P.w0 + P.w1 * Math.sin(u * P.wp + 0.6)) * W * 0.5; }
    /* 帶子上的一點。cos(u/2)/sin(u/2) 的週期是 4π —— 這就是半扭轉，
       繞脊線一圈之後標架翻面，正面接到背面。 */
    function pt(u, v, fr) {
      var f = fr || frame(u), c = Math.cos(u * P.tilt / 2), s = Math.sin(u * P.tilt / 2);
      var d = [f.b1[0] * c + f.b2[0] * s, f.b1[1] * c + f.b2[1] * s, f.b1[2] * c + f.b2[2] * s];
      return [f.p[0] + v * d[0], f.p[1] + v * d[1], f.p[2] + v * d[2], d];
    }

    var zmax = P.rz + P.rz2;
    var quads = [], conts = [];
    var prev = null, prevF = null, prevW = 0;
    for (var i = 0; i <= steps; i++) {
      var u = i * du, f = frame(u), w = halfw(u);
      var A = pt(u, -w, f), B = pt(u, w, f);
      if (prev) {
        var zc = (f.p[2] + prevF.p[2]) * 0.5;
        /* 面的朝向：法線 z 的正負決定我們看到正面還是背面 */
        var n = cross(f.T, A[3]);
        quads.push({
          d: 'M' + prev[0][0].toFixed(1) + ' ' + prev[0][1].toFixed(1) +
             'L' + prev[1][0].toFixed(1) + ' ' + prev[1][1].toFixed(1) +
             'L' + B[0].toFixed(1) + ' ' + B[1].toFixed(1) +
             'L' + A[0].toFixed(1) + ' ' + A[1].toFixed(1) + 'Z',
          z: zc / zmax,
          back: n[2] < 0
        });
      }
      /* 等高線：每 11 步橫跨帶面畫一條，材質靠密度不靠陰影 */
      if (i % 7 === 0) {
        conts.push({
          d: 'M' + A[0].toFixed(1) + ' ' + A[1].toFixed(1) + 'L' + B[0].toFixed(1) + ' ' + B[1].toFixed(1),
          z: f.p[2] / zmax
        });
      }
      prev = [A, B]; prevF = f; prevW = w;
    }

    /* 單邊：莫比烏斯帶的邊界只有一條。u 從 0 跑到 4π 才回到起點，
       所以這條線會把整頁走兩遍 —— 光點就跑在它上面。 */
    var edge = '', spineD = '';
    for (var j = 0; j <= steps * 2; j++) {
      var uu = j * du, um = uu % TAU;
      var ff = frame(um), ww = halfw(um);
      var cc = Math.cos(uu * P.tilt / 2), ss = Math.sin(uu * P.tilt / 2);
      var dd = [ff.b1[0] * cc + ff.b2[0] * ss, ff.b1[1] * cc + ff.b2[1] * ss];
      var ex = ff.p[0] + ww * dd[0], ey = ff.p[1] + ww * dd[1];
      edge += (j ? 'L' : 'M') + ex.toFixed(1) + ' ' + ey.toFixed(1);
    }
    for (var k = 0; k <= steps; k++) {
      var sp = spine(k * du);
      spineD += (k ? 'L' : 'M') + sp[0].toFixed(1) + ' ' + sp[1].toFixed(1);
    }
    return { quads: quads, conts: conts, edge: edge, spine: spineD };
  }

  /* ── 上色 ───────────────────────────────────────────────
     近的更實、更亮；遠的更淡。背面用比較深的藍，
     讓「看到背面」這件事讀得出來。 */
  function paint(g, W, H, dark) {
    var FRONT = dark ? '#BFEBFF' : '#7FD8F8';
    var BACK  = dark ? '#5FA8E8' : '#3E86D8';
    var far = [], near = [];
    g.quads.forEach(function (q) {
      var t = (q.z + 1) / 2;                       // 0=最遠 1=最近
      var a = (dark ? 0.17 : 0.15) + t * (dark ? 0.22 : 0.23);
      if (q.back) a *= 0.82;
      /* 遠段不再打糊（太貴），改用「更淡 + 更接近背景色」表達距離 */
      if (q.z < 0) a *= 0.62;
      (q.z < 0 ? far : near).push(
        '<path d="' + q.d + '" fill="' + (q.back ? BACK : FRONT) +
        '" fill-opacity="' + a.toFixed(3) + '"/>');
    });
    var contF = [], contN = [];
    g.conts.forEach(function (c) {
      var t = (c.z + 1) / 2;
      (c.z < 0 ? contF : contN).push(
        '<path d="' + c.d + '" stroke-opacity="' + (0.12 + t * 0.46).toFixed(3) + '"/>');
    });
    return '<svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">' +
      '<g class="mob__far">'  + far.join('')  + '<g class="cont">' + contF.join('') + '</g></g>' +
      '<g class="mob__near">' + near.join('') + '<g class="cont">' + contN.join('') + '</g>' +
        /* 柔光用三層由寬到窄、由淡到濃的描邊疊出來。
           ⚠️ 不要改回 filter:blur() —— 這一層有 1280×3858 那麼大，
           實測捲動時中位 frame 從 16.7ms 掉到 33.4ms（60fps → 30fps）。 */
        '<path class="glow glow--3" d="' + g.spine + '"/>' +
        '<path class="glow glow--2" d="' + g.spine + '"/>' +
        '<path class="glow glow--1" d="' + g.spine + '"/>' +
        '<path class="edge" d="' + g.edge + '"/>' +
        '<path class="pulse" d="' + g.edge + '"/>' +
      '</g></svg>';
  }

  /* ── 掛載 ───────────────────────────────────────────────── */
  var layer = null, slabLayer = null, bg = null, lastKey = '';

  /* 依實際量到的區塊位置，長出一條上下緣羽化的縱向漸層。
     羽化距離刻意大（140px），冰藍與白之間就不會有切口。 */
  function field(H) {
    var pageTop = PAGE.getBoundingClientRect().top + window.scrollY;
    var stops = ['rgba(232,241,253,0) 0px'];
    var F = 140;
    document.querySelectorAll('.section--alt').forEach(function (sec) {
      var r = sec.getBoundingClientRect();
      var a = r.top + window.scrollY - pageTop, b = a + r.height;
      stops.push('rgba(232,241,253,0) ' + Math.round(a - F) + 'px');
      stops.push('rgba(232,241,253,.92) ' + Math.round(a + F * 0.55) + 'px');
      stops.push('rgba(232,241,253,.92) ' + Math.round(b - F * 0.55) + 'px');
      stops.push('rgba(232,241,253,0) ' + Math.round(b + F) + 'px');
    });
    stops.push('rgba(232,241,253,0) ' + H + 'px');
    return 'linear-gradient(180deg,' + stops.join(',') + ')';
  }

  function mount() {
    var W = PAGE.clientWidth;
    var H = PAGE.scrollHeight;
    if (!W || !H) return;
    var key = W + 'x' + H;
    if (key === lastKey) return;
    lastKey = key;

    /* 窄螢幕的頁面比例大約 1:16，脊線在那種比例下幾乎是一條直線 ——
       照桌機參數畫出來會退化成幾條平行的垂直條紋，不是帶子。
       所以窄螢幕要：橫向擺盪加大、帶子加寬、扭轉次數提高（5 仍是奇數，
       仍然是真的莫比烏斯帶），讓結構靠「翻面」而不是靠「左右掃」被看見。 */
    var narrow = W < 760;
    var fit = narrow ? { rx: 0.56, rx2: 0.30, w0: 0.20, w1: 0.075, tilt: 5.00, wp: 2.4 } : {};
    var steps = narrow ? 460 : 620;
    var gA = build(W, H, params(VAR_A, fit), steps);
    var gB = REDUCED ? null : build(W, H, params(VAR_B, fit), steps);

    function shell(dark) {
      return '<div class="mob__v mob__v--a">' + paint(gA, W, H, dark) + '</div>' +
             (gB ? '<div class="mob__v mob__v--b">' + paint(gB, W, H, dark) + '</div>' : '');
    }

    /* 大氣層：原本冰藍是「每個區塊自己的底色」，那正是區塊感的來源。
       把它抽出來變成一整頁的場，上下緣羽化 —— 帶子就浮在它上面，
       穿過冰藍區時是「進入一片較濃的空氣」，不是被一塊底色蓋掉。 */
    if (!bg) {
      bg = document.createElement('div');
      bg.className = 'mob-bg';
      bg.setAttribute('aria-hidden', 'true');
      PAGE.insertBefore(bg, PAGE.firstChild);
    }
    bg.style.height = H + 'px';
    bg.style.backgroundImage = field(H);
    /* 只有這一頁真的長出大氣場，才准 .section--alt 交出自己的底色。
       其他頁沒載這支 script，維持原本的冰藍實塊；JS 掛掉時也一樣。 */
    document.documentElement.classList.add('mob-on');

    if (!layer) {
      layer = document.createElement('div');
      layer.className = 'mob';
      layer.setAttribute('aria-hidden', 'true');
      PAGE.insertBefore(layer, bg.nextSibling);
    }
    layer.style.height = H + 'px';
    layer.innerHTML = shell(false);

    /* 深藍實塊擋不住光，所以那一段用同一組座標、同一份幾何再畫一次，
       只換材質（亮的壓在深藍上）。位移＝實塊在文件裡的位置，
       所以帶子跨越實塊上下邊界時是接得起來的，不是另一張圖。 */
    var slab = document.querySelector('.slab');
    if (slab) {
      if (!slabLayer) {
        slabLayer = document.createElement('div');
        slabLayer.className = 'mob mob--in';
        slabLayer.setAttribute('aria-hidden', 'true');
        slab.insertBefore(slabLayer, slab.firstChild);
      }
      var off = slab.getBoundingClientRect().top - PAGE.getBoundingClientRect().top;
      slabLayer.style.top = (-off) + 'px';
      slabLayer.style.height = H + 'px';
      slabLayer.innerHTML = shell(true);
    }

    /* 光點的虛線長度必須照那條邊的實際長度設，否則它會跑在畫面外。
       邊長隨頁高變，不能寫死。 */
    [layer, slabLayer].forEach(function (L) {
      if (!L) return;
      L.querySelectorAll('.pulse').forEach(function (el) {
        var len = el.getTotalLength();
        el.style.strokeDasharray = '52 ' + Math.round(len);
        el.style.strokeDashoffset = Math.round(len + 52);
        el.style.setProperty('--mob-dash', Math.round(len + 52));
      });
    });
  }

  /* ── 動態：捲動 ＋ 滑鼠，都只寫 transform ─────────────────
     幾何完全不重算。捲動讓整層很輕微地位移與傾斜，
     感覺是「頁面在穿過這個系統」，不是系統在動。 */
  var sx = 0, sy = 0, mx = 0, my = 0, raf = null;

  function write() {
    raf = null;
    var t = 'translate3d(' + (sx + mx).toFixed(2) + 'px,' + (sy + my).toFixed(2) + 'px,0)';
    if (layer) layer.style.transform = t;
    if (slabLayer) slabLayer.style.transform = t;
  }
  function schedule() { if (!raf) raf = requestAnimationFrame(write); }

  if (!REDUCED) {
    window.addEventListener('scroll', function () {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var p = max > 0 ? window.scrollY / max : 0;
      sx = (p - 0.5) * 30;            // 全程左右各 15px，餘光才察覺得到
      sy = (p - 0.5) * -18;
      schedule();
    }, { passive: true });

    if (window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
      window.addEventListener('mousemove', function (e) {
        mx = (e.clientX / window.innerWidth - 0.5) * 10;
        my = (e.clientY / window.innerHeight - 0.5) * 10;
        schedule();
      }, { passive: true });
    }
  }

  /* ── 生命週期 ───────────────────────────────────────────
     字體載入完頁高才會定下來，太早算會對不準。 */
  function boot() {
    mount();
    /* ResizeObserver 看的是 border box，抓不到「內容變高」；
       頁高會因為晚到的字體與換行再動一次，所以補幾次重算。
       實測過：第一次 mount 時 3858，字體收斂後變 3867。 */
    [80, 400, 1200].forEach(function (d) { setTimeout(mount, d); });
    window.addEventListener('load', mount);
    var ro = new ResizeObserver(function () { mount(); });
    ro.observe(PAGE);
    ro.observe(document.body);
    var t = null;
    window.addEventListener('resize', function () {
      clearTimeout(t); t = setTimeout(function () { lastKey = ''; mount(); }, 220);
    });
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(boot);
  else window.addEventListener('load', boot);
})();
