/**
 * 橋本claude歯科 - メインスクリプト
 */

// === ヘッダー スクロール時の影 ===
const header = document.getElementById('header');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });
}

// === モバイルハンバーガーメニュー ===
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');

if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  // リンククリックでメニューを閉じる
  mobileNav.querySelectorAll('.mobile-nav__link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // 背景クリックで閉じる（モバイルナビ外をタップ）
  document.addEventListener('click', (e) => {
    if (
      mobileNav.classList.contains('open') &&
      !mobileNav.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

// === ナビリンク アクティブ状態 ===
const currentPage = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav__link').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

// === FAQ アコーディオン ===
document.querySelectorAll('.faq-question').forEach(question => {
  question.addEventListener('click', () => {
    const isOpen = question.classList.contains('open');
    const answer = question.nextElementSibling;

    // 全て閉じる
    document.querySelectorAll('.faq-question').forEach(q => {
      q.classList.remove('open');
      q.setAttribute('aria-expanded', 'false');
    });
    document.querySelectorAll('.faq-answer').forEach(a => {
      a.classList.remove('open');
    });

    // クリックしたものを開く（すでに開いていたら閉じたまま）
    if (!isOpen) {
      question.classList.add('open');
      question.setAttribute('aria-expanded', 'true');
      if (answer) answer.classList.add('open');
    }
  });
});

// === スムーススクロール（ページ内リンク） ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (!targetId || targetId === '#') return;
    const target = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();
    const headerH = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--header-h')
    ) || 72;
    const top = target.getBoundingClientRect().top + window.scrollY - headerH - 16;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// === フェードインアニメーション（IntersectionObserver） ===
const observerOptions = { threshold: 0.12, rootMargin: '0px 0px -40px 0px' };
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll(
  '.feature-card, .treatment-card, .staff-card, .faq-item, .flow-step, .info-box, .news-item'
).forEach(el => {
  el.classList.add('fade-in');
  fadeObserver.observe(el);
});
