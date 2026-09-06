(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 滚动进度条 ---------- */
  var progressBar = document.getElementById('progressBar');
  function updateProgress() {
    if (!progressBar) return;
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
    progressBar.style.width = pct + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  /* ---------- 移动端菜单 ---------- */
  var header = document.getElementById('siteHeader');
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');
  if (navToggle && header) {
    navToggle.addEventListener('click', function () {
      var open = header.classList.toggle('nav-open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    if (navLinks) {
      navLinks.addEventListener('click', function (e) {
        if (e.target && e.target.tagName === 'A') {
          header.classList.remove('nav-open');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      });
    }
  }

  /* ---------- 滚动显现 + 技能条动画 ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if (reduced || !('IntersectionObserver' in window)) {
    reveals.forEach ? reveals.forEach(function (r) { r.classList.add('visible'); }) : null;
    document.querySelectorAll('.sb-fill').forEach(function (f) {
      f.style.width = f.getAttribute('data-w');
    });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          var fills = entry.target.querySelectorAll('.sb-fill');
          fills.forEach(function (f) {
            requestAnimationFrame(function () {
              f.style.width = f.getAttribute('data-w') || f.style.getPropertyValue('--w') || '0';
            });
          });
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (r) { io.observe(r); });

    // 技能条容器可能不在 .reveal 元素内部（.skill-bars 本身带 .reveal），已覆盖；
    // 兜底：直接监听 .sb-fill
    var fillObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var f = entry.target;
          f.style.width = f.getAttribute('data-w');
          fillObserver.unobserve(f);
        }
      });
    }, { threshold: 0.4 });
    document.querySelectorAll('.sb-fill').forEach(function (f) { fillObserver.observe(f); });
  }

  /* ---------- 回到顶部 ---------- */
  var backTop = document.getElementById('backTop');
  if (backTop) {
    backTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    });
    window.addEventListener('scroll', function () {
      backTop.classList.toggle('show', window.scrollY > 600);
    }, { passive: true });
  }

  /* ---------- 导出 PDF ---------- */
  var printBtn = document.getElementById('printBtn');
  if (printBtn) {
    printBtn.addEventListener('click', function () { window.print(); });
  }

  /* ---------- 证书灯箱 ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxCap = document.getElementById('lightboxCap');
  var lightboxClose = document.getElementById('lightboxClose');
  var lastFocus = null;

  function openLightbox(item) {
    if (!lightbox || !lightboxImg) return;
    lastFocus = document.activeElement;
    lightboxImg.src = item.getAttribute('data-full') || '';
    lightboxImg.alt = item.getAttribute('data-caption') || '证书大图';
    if (lightboxCap) lightboxCap.textContent = item.getAttribute('data-caption') || '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (lightboxClose) lightboxClose.focus();
  }
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }

  document.querySelectorAll('.gallery-item').forEach(function (item) {
    item.addEventListener('click', function () { openLightbox(item); });
    item.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(item);
      }
    });
  });
  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightbox && lightbox.classList.contains('open')) closeLightbox();
  });

  /* ---------- 平滑滚动（原生 scroll-behavior 降级由 CSS 处理） ---------- */
})();
