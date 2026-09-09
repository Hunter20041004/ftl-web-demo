/* ============================================================
   NCCU FinTech Innovation Lab — 共用腳本
   1) SVG 圖示 sprite   2) 導覽列 / 頁尾  3) 中英切換
   4) 捲動進場  5) 篩選器  6) 表單狀態
   ============================================================ */
(function () {
  'use strict';

  /* ---------- 1. 圖示 sprite（Lucide 線條風格，統一 1.7px 筆畫）---------- */
  var ICONS = {
    'arrow-right': '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    'chevron-right': '<path d="m9 18 6-6-6-6"/>',
    'arrow-up-right': '<path d="M7 7h10v10"/><path d="M7 17 17 7"/>',
    'mail': '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
    'message': '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
    'instagram': '<rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><path d="M17.5 6.5h.01"/>',
    'facebook': '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
    'threads': '<circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"/>',
    'linkedin': '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>',
    'calendar': '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    'book': '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>',
    'briefcase': '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
    'trophy': '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',
    'file': '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v5h5"/><path d="M16 13H8M16 17H8M10 9H8"/>',
    'news': '<path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8M15 18h-5M10 6h8v4h-8V6Z"/>',
    'users': '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    'cap': '<path d="M22 10v6"/><path d="M6 12.5V16c0 1 2.5 3 6 3s6-2 6-3v-3.5"/><path d="m2 10 10-5 10 5-10 5z"/>',
    'rocket': '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91 0z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',
    'shield': '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
    'menu': '<path d="M4 6h16M4 12h16M4 18h16"/>',
    'close': '<path d="M18 6 6 18M6 6l12 12"/>',
    'globe': '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
    'external': '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    'check': '<path d="M21.8 10A10 10 0 1 1 17 3.34"/><path d="m9 11 3 3L22 4"/>',
    'alert': '<circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>',
    'inbox': '<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
    'pin': '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
    'clock': '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    'trend': '<path d="M16 7h6v6"/><path d="m22 7-8.5 8.5-5-5L2 17"/>',
    'sparkle': '<path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3z"/>',
    'building': '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01"/>',
    'layers': '<path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"/><path d="m6.08 9.5-3.5 1.6a1 1 0 0 0 0 1.81l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9a1 1 0 0 0 0-1.83l-3.5-1.59"/><path d="m6.08 14.5-3.5 1.6a1 1 0 0 0 0 1.81l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9a1 1 0 0 0 0-1.83l-3.5-1.59"/>',
    'search': '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    'target': '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    'download': '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>'
  };

  function mountSprite() {
    var parts = '';
    for (var k in ICONS) {
      parts += '<symbol id="i-' + k + '" viewBox="0 0 24 24">' + ICONS[k] + '</symbol>';
    }
    // 必須交給 HTML parser 產生（createElement('svg') 造出來的是 HTML 元素，
    // 不在 SVG 命名空間，<use> 會參照不到）
    document.body.insertAdjacentHTML('afterbegin',
      '<svg aria-hidden="true" style="position:absolute;width:0;height:0;overflow:hidden">' + parts + '</svg>');
  }

  function icon(name, cls) {
    return '<svg class="icon ' + (cls || '') + '" aria-hidden="true"><use href="#i-' + name + '"/></svg>';
  }

  /* ---------- 2. 導覽列 / 頁尾 ---------- */
  var NAV = [
    { href: 'index.html',     zh: '首頁',   en: 'Home' },
    { href: 'about.html',     zh: '關於我們', en: 'About' },
    { href: 'projects.html',  zh: '專案',   en: 'Projects' },
    { href: 'insights.html',  zh: '洞察',   en: 'Insights' },
    { href: 'resources.html', zh: '資源',   en: 'Resources' },
    { href: 'events.html',    zh: '活動',   en: 'Events' },
    { href: 'contact.html',   zh: '聯絡我們', en: 'Contact' }
  ];

  // 全部經 2026-09-09 公開查證：IG 個人頁 metadata、IG bio、LINE 官方帳號頁
  var SOCIAL = [
    { icon: 'message',   label: 'LINE Bot @nccufintechlab', href: 'https://page.line.me/nccufintechlab' },
    { icon: 'instagram', label: 'Instagram @nccufintechlab', href: 'https://www.instagram.com/nccufintechlab/' },
    { icon: 'threads',   label: 'Threads @nccufintechlab',   href: 'https://www.threads.com/@nccufintechlab' },
    { icon: 'mail',      label: 'Email',                     href: 'mailto:nccufintechlab@gmail.com' }
  ];

  // 正式 logo：直接沿用 nccu-fintechlab-social 專案的檔案
  var BRAND_MARK = '<img src="assets/ftl-logo.png" alt="FTL · FinTech Lab · NCCU" width="733" height="692">';

  function currentPage() {
    var p = location.pathname.split('/').pop();
    return (!p || p === '') ? 'index.html' : p;
  }

  /* 這個站是公開的 demo，資料多半是示意值（人數、幹部、合作對象、活動）。
     公開在網路上就一定要讓訪客一眼看出來，不然會被當成社團的正式資訊。 */
  function renderNotice() {
    var host = document.getElementById('site-header');
    if (!host || document.querySelector('.devbar')) return;
    var bar = document.createElement('div');
    bar.className = 'devbar';
    bar.innerHTML = '<span class="devbar__dot" aria-hidden="true"></span>' +
      '<span data-en="Work in progress \u2014 numbers, roster, partners and events on this site ' +
      'are placeholders, not official information.">' +
      '開發中的展示版 —— 站上的人數、幹部名單、合作對象與活動皆為示意資料，非正式資訊。</span>';
    host.parentNode.insertBefore(bar, host);
  }

  function renderHeader() {
    var host = document.getElementById('site-header');
    if (!host) return;
    var here = currentPage();

    var links = NAV.map(function (n) {
      var cur = n.href === here ? ' aria-current="page"' : '';
      return '<a class="nav__link" href="' + n.href + '" data-en="' + n.en + '"' + cur + '>' + n.zh + '</a>';
    }).join('');

    var sheetLinks = NAV.map(function (n) {
      var cur = n.href === here ? ' aria-current="page"' : '';
      return '<a class="sheet__link" href="' + n.href + '"' + cur + '><span data-en="' + n.en + '">' + n.zh + '</span>' + icon('chevron-right') + '</a>';
    }).join('');

    var langToggle =
      '<div class="lang" data-lang="zh" role="group" aria-label="Language / 語言">' +
        '<span class="lang__slider" aria-hidden="true"></span>' +
        '<button class="lang__btn" type="button" data-set-lang="zh" aria-pressed="true">中文</button>' +
        '<button class="lang__btn" type="button" data-set-lang="en" aria-pressed="false">EN</button>' +
      '</div>';

    host.innerHTML =
      '<a class="skip" href="#main" data-en="Skip to main content">跳到主要內容</a>' +
      '<header class="nav" data-stuck="false">' +
        '<div class="wrap nav__inner">' +
          '<a class="brand" href="index.html" aria-label="NCCU FinTech Innovation Lab">' + BRAND_MARK +
              '<span class="brand__id">NCCU FinTech Innovation Lab</span></a>' +
          '<nav class="nav__links" aria-label="主要導覽">' + links + '</nav>' +
          '<div class="nav__side">' + langToggle +
            '<button class="nav__burger" type="button" data-menu-open aria-label="開啟選單" aria-expanded="false">' + icon('menu') + '</button>' +
          '</div>' +
        '</div>' +
      '</header>' +
      '<div class="sheet" data-open="false" id="mobile-sheet" role="dialog" aria-modal="true" aria-label="選單">' +
        '<div class="wrap" style="padding:0">' +
          '<div class="sheet__head">' +
            '<a class="brand" href="index.html">' + BRAND_MARK + '</a>' +
            '<button class="nav__burger" style="display:grid" type="button" data-menu-close aria-label="關閉選單">' + icon('close') + '</button>' +
          '</div>' +
          '<nav class="sheet__list" aria-label="主要導覽">' + sheetLinks + '</nav>' +
          '<div class="sheet__foot">' +
            '<a class="btn btn--primary btn--block btn--lg" href="contact.html" data-en="Join FTL">加入 FTL</a>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  function col(title, en, items) {
    return '<div class="footer__col"><h4 data-en="' + en + '">' + title + '</h4><div class="footer__list">' +
      items.map(function (i) { return '<a href="' + i.href + '" data-en="' + i.en + '">' + i.zh + '</a>'; }).join('') +
      '</div></div>';
  }

  function renderFooter() {
    var host = document.getElementById('site-footer');
    if (!host) return;

    var col = function (title, en, items) {
      return '<div><h4 data-en="' + en + '">' + title + '</h4><div class="footer__list">' +
        items.map(function (i) { return '<a href="' + i.href + '" data-en="' + i.en + '">' + i.zh + '</a>'; }).join('') +
        '</div></div>';
    };

    host.innerHTML =
      '<footer class="footer">' +
        '<div class="wrap">' +
          '<div class="footer__top">' +
            '<div class="footer__brand">' +
              '<img class="flogo" src="assets/ftl-logo.png" alt="FTL · FinTech Lab · NCCU">' +
              '<p data-en="Finance × Technology × Industry × Building things. NCCU’s first FinTech academic society.">' +
                '金融 × 科技 × 產學 × 實作。政大第一個 FinTech 學術社團。</p>' +
              '<div class="social">' +
                SOCIAL.map(function (x) {
                  return '<a href="' + x.href + '" aria-label="' + x.label + '" title="' + x.label + '">' + icon(x.icon) + '</a>';
                }).join('') +
              '</div>' +
            '</div>' +
            col('探索', 'Explore', [
              { href: 'about.html', zh: '關於我們', en: 'About' },
              { href: 'projects.html', zh: '專案', en: 'Projects' },
              { href: 'insights.html', zh: '洞察', en: 'Insights' },
              { href: 'events.html', zh: '活動', en: 'Events' }
            ]) +
            col('資源', 'Resources', [
              { href: 'resources.html#jobs', zh: '職缺快報', en: 'Job Alerts' },
              { href: 'resources.html#library', zh: 'FTL 圖書館', en: 'FTL Library' },
              { href: 'resources.html#contests', zh: '競賽資訊', en: 'Competitions' },
              { href: 'insights.html#weekly', zh: 'FinTech 週報', en: 'Weekly Digest' }
            ]) +
            col('聯絡', 'Contact', [
              { href: 'https://page.line.me/nccufintechlab', zh: 'LINE Bot', en: 'LINE Bot' },
              { href: 'mailto:nccufintechlab@gmail.com', zh: 'Email', en: 'Email' },
              { href: 'https://www.instagram.com/nccufintechlab/', zh: 'Instagram', en: 'Instagram' },
              { href: 'https://www.threads.com/@nccufintechlab', zh: 'Threads', en: 'Threads' }
            ]) +
          '</div>' +
        '</div>' +
        '<div class="footer__bar"><div class="wrap footer__bottom">' +
          '<span data-en="© 2026 NCCU FinTech Innovation Lab · Demo site">© 2026 政大金融科技創新實驗室 · 展示用網站</span>' +
          '<span data-en="Guided by the NCCU College of Commerce FinTech Research Center">政大商學院金融科技研究中心 指導成立</span>' +
        '</div></div>' +
      '</footer>';
  }

  /* ---------- 3. 中英切換 ---------- */
  var LANG_KEY = 'ftl-lang';

  function readLang() {
    try { return localStorage.getItem(LANG_KEY) === 'en' ? 'en' : 'zh'; } catch (e) { return 'zh'; }
  }
  function saveLang(v) { try { localStorage.setItem(LANG_KEY, v); } catch (e) {} }

  function applyLang(lang) {
    document.documentElement.lang = lang === 'en' ? 'en' : 'zh-Hant-TW';

    document.querySelectorAll('[data-en]').forEach(function (el) {
      if (el.dataset.zh === undefined) el.dataset.zh = el.innerHTML;
      el.innerHTML = lang === 'en' ? el.dataset.en : el.dataset.zh;
    });
    document.querySelectorAll('[data-en-ph]').forEach(function (el) {
      if (el.dataset.zhPh === undefined) el.dataset.zhPh = el.placeholder || '';
      el.placeholder = lang === 'en' ? el.dataset.enPh : el.dataset.zhPh;
    });

    document.querySelectorAll('.lang').forEach(function (g) { g.dataset.lang = lang; });
    document.querySelectorAll('[data-set-lang]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.setLang === lang));
    });
  }

  /* ---------- 4. 捲動進場 ---------- */
  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window) ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      items.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------- 5. 篩選器（圖書館 / 活動）---------- */
  function initFilters() {
    document.querySelectorAll('[data-filter-group]').forEach(function (group) {
      var targetSel = group.dataset.filterTarget;
      var list = document.querySelector(targetSel);
      if (!list) return;
      var empty = document.querySelector(group.dataset.filterEmpty || '');

      group.addEventListener('click', function (ev) {
        var btn = ev.target.closest('.filter');
        if (!btn) return;
        group.querySelectorAll('.filter').forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });

        var want = btn.dataset.filter;
        var shown = 0;
        list.querySelectorAll('[data-cat]').forEach(function (card) {
          var ok = want === 'all' || card.dataset.cat.split(' ').indexOf(want) > -1;
          card.hidden = !ok;
          if (ok) shown++;
        });
        if (empty) empty.dataset.show = String(shown === 0);
      });
    });
  }

  /* ---------- 6. 表單（驗證 → 載入中 → 成功）---------- */
  function initForm() {
    var form = document.querySelector('[data-demo-form]');
    if (!form) return;
    var note = form.querySelector('.form-note');
    var submit = form.querySelector('[type="submit"]');
    var original = submit ? submit.innerHTML : '';

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var bad = null;

      form.querySelectorAll('.field').forEach(function (f) {
        var input = f.querySelector('input, textarea');
        if (!input || !input.required) return;
        var v = input.value.trim();
        var invalid = !v || (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v));
        f.dataset.invalid = String(invalid);
        if (invalid && !bad) bad = input;
      });

      if (bad) { bad.focus(); if (note) note.dataset.show = 'false'; return; }

      submit.disabled = true;
      submit.innerHTML = '<span class="spinner"></span><span>' +
        (readLang() === 'en' ? 'Sending…' : '送出中…') + '</span>';

      setTimeout(function () {
        submit.disabled = false;
        submit.innerHTML = original;
        if (note) note.dataset.show = 'true';
        form.reset();
      }, 1400);
    });

    form.addEventListener('input', function (ev) {
      var f = ev.target.closest('.field');
      if (f && f.dataset.invalid === 'true') f.dataset.invalid = 'false';
    });
  }

  /* ---------- 7. 其他互動 ---------- */
  function initNavBehaviour() {
    var nav = document.querySelector('.nav');
    var sheet = document.getElementById('mobile-sheet');

    if (nav) {
      // 首屏是藍色場域時導覽列反白，捲離之後換回白底
      if (document.querySelector('.blue-field')) nav.classList.add('nav--onblue');
      var trigger = function () {
        var f = document.querySelector('.blue-field');
        return f ? f.getBoundingClientRect().bottom - 40 : 8;
      };
      var host = document.getElementById('site-header');
      var onScroll = function () {
        var v = String(trigger() < 0 || (window.scrollY > 8 && !document.querySelector('.blue-field')));
        nav.dataset.stuck = v; if (host) host.dataset.stuck = v;
      };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    var setSheet = function (open) {
      if (!sheet) return;
      sheet.dataset.open = String(open);
      document.body.style.overflow = open ? 'hidden' : '';
      var trigger = document.querySelector('[data-menu-open]');
      if (trigger) trigger.setAttribute('aria-expanded', String(open));
      if (open) { var f = sheet.querySelector('a,button'); if (f) f.focus(); }
    };

    document.addEventListener('click', function (ev) {
      if (ev.target.closest('[data-menu-open]')) setSheet(true);
      if (ev.target.closest('[data-menu-close]')) setSheet(false);
      if (ev.target.closest('.sheet__link')) setSheet(false);

      var langBtn = ev.target.closest('[data-set-lang]');
      if (langBtn) {
        var v = langBtn.dataset.setLang;
        saveLang(v);
        applyLang(v);
      }
    });

    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape' && sheet && sheet.dataset.open === 'true') setSheet(false);
    });
  }

  /* ---------- 啟動 ---------- */
  function boot() {
    mountSprite();
    renderNotice();
    renderHeader();
    renderFooter();

    // 跑馬燈：把內容複製一份接在後面，才能無縫循環
    document.querySelectorAll('.marquee__track').forEach(function (track) {
      var g = track.querySelector('.marquee__group');
      if (g) track.appendChild(g.cloneNode(true));
    });

    // reveal 的 stagger index
    document.querySelectorAll('[data-stagger]').forEach(function (box) {
      Array.prototype.forEach.call(box.children, function (c, i) { c.style.setProperty('--i', i); });
    });

    applyLang(readLang());
    initNavBehaviour();
    initReveal();
    initFilters();
    initForm();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();

/* 數字捲進畫面才開始跑（靜態數字看起來像印刷品，不像實驗室） */
(function () {
  'use strict';
  var els = document.querySelectorAll('.stat b, .step b');
  if (!els.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var run = function (el) {
    var raw = el.textContent.trim();
    var target = parseInt(raw, 10);
    if (isNaN(target)) return;
    var pad = raw.length > String(target).length;   // 保留 08 這種前導零
    var t0 = null, dur = 900;
    el.classList.add('count');
    var step = function (t) {
      if (!t0) t0 = t;
      var p = Math.min(1, (t - t0) / dur);
      var e = 1 - Math.pow(1 - p, 3);
      var n = Math.round(target * e);
      el.textContent = pad ? String(n).padStart(raw.length, '0') : String(n);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } });
  }, { threshold: 0.6 });
  els.forEach(function (el) { io.observe(el); });
})();

/* ══════════════════════════════════════════════════════════════
   滑鼠景深：三層以不同速度位移。幅度刻意很小（最多 8px），
   目的是讓畫面「有前後」，不是做視差特效。
   ══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var hero = document.querySelector('.hero');
  if (!hero) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;

  // 緞帶那一層已經搬到全域（assets/mobius.js 自己處理滑鼠與捲動），
  // 這裡只留首屏自己的前後兩層。
  var layers = [
    { el: hero.querySelector('.hero__bloom'), k: 8 },   // 最遠，動最多
    { el: hero.querySelector('.hero__grid'),  k: -2 }   // 最近，反向、動最少
  ].filter(function (l) { return l.el; });
  if (!layers.length) return;

  var tx = 0, ty = 0, raf = null;
  function apply() {
    raf = null;
    layers.forEach(function (l) {
      l.el.style.transform = 'translate3d(' + (tx * l.k).toFixed(2) + 'px,' +
                                              (ty * l.k).toFixed(2) + 'px,0)';
    });
  }
  hero.addEventListener('mousemove', function (e) {
    var r = hero.getBoundingClientRect();
    tx = (e.clientX - r.left) / r.width - 0.5;      // -0.5 ~ 0.5
    ty = (e.clientY - r.top) / r.height - 0.5;
    if (!raf) raf = requestAnimationFrame(apply);
  }, { passive: true });
  hero.addEventListener('mouseleave', function () {
    tx = ty = 0;
    if (!raf) raf = requestAnimationFrame(apply);
  });
})();
