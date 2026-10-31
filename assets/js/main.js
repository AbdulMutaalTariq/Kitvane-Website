/**
 * Kitvane — Global Modern JavaScript
 * Premium Creative-Tech Platform Interaction System
 * - Scroll Progress Bar
 * - Sticky Glassmorphism Navbar (.scrolled)
 * - Desktop-Only 3D Card Tilt (Disabled on Touch)
 * - Website-Wide Scroll Reveal Animations (IntersectionObserver)
 * - FAQ Accordion with Smooth Transition
 * - Toast Notifications & Clipboard Copy
 * - Mobile Navigation
 * - Respects prefers-reduced-motion
 */

'use strict';

// ── 1. Scroll Progress Bar ─────────────────────────────────────────
(function initScrollProgress() {
  let bar = document.getElementById('scroll-progress');
  if (!bar) {
    bar = document.createElement('div');
    bar.id = 'scroll-progress';
    bar.className = 'scroll-progress-bar';
    document.body.appendChild(bar);
  }

  function updateProgress() {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = totalHeight > 0 ? Math.min(Math.max(window.scrollY / totalHeight, 0), 1) : 0;
    bar.style.transform = `scaleX(${progress})`;
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress, { passive: true });
  updateProgress();
})();

// ── 2. Sticky Glassmorphism Navbar Scroll Effect ────────────────────
(function initNavbarGlass() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  function onScroll() {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// ── 3. Website-Wide Scroll Reveal Animations ───────────────────────
(function initScrollReveals() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Select all reveal targets
  const targets = document.querySelectorAll(
    '.reveal-fade-up, .reveal-fade-in, .reveal-scale-in, .card, .tool-box, .why-card, .faq-item, .content-section h2, .content-section p, .table-wrap, .footer__grid > div'
  );

  if (!targets.length) return;

  if (prefersReduced || !('IntersectionObserver' in window)) {
    targets.forEach(el => el.classList.add('is-revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        obs.unobserve(entry.target); // Animate once
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -30px 0px'
  });

  targets.forEach((el, index) => {
    // If not explicitly set with a reveal class, add base reveal class
    if (!el.classList.contains('reveal-fade-up') &&
        !el.classList.contains('reveal-fade-in') &&
        !el.classList.contains('reveal-scale-in')) {
      el.classList.add('reveal-fade-up');
    }
    observer.observe(el);
  });
})();

// ── 4. Decorative Background FX Tracking ────────────────────────────
(function(){
  if (matchMedia('(prefers-reduced-motion: reduce)').matches ||
      matchMedia('(pointer: coarse)').matches) return;
  var el = document.querySelector('.bg-fx'), x = 0, y = 0, queued = false;
  if (!el) return;
  addEventListener('pointermove', function(e){
    x = e.clientX; y = e.clientY;
    if (queued) return; queued = true;
    requestAnimationFrame(function(){
      el.style.setProperty('--mx', x + 'px');
      el.style.setProperty('--my', y + 'px');
      queued = false;
    });
  }, {passive:true});
})();

// ── 5. 3D Card Tilt with Liquid Glass Internal Highlight ───────────
(function initCardTilt() {
  // Strict requirement: Disable on touch devices and mobile
  const isTouch = window.matchMedia('(pointer: coarse)').matches || window.innerWidth <= 900;
  if (isTouch) return;

  const tiltCards = document.querySelectorAll('.card, .why-card');
  if (!tiltCards.length) return;

  tiltCards.forEach(card => {
    let bounds = null;

    function handleMouseEnter() {
      bounds = card.getBoundingClientRect();
      card.style.transition = 'transform 0.1s ease-out, border-color 0.25s, box-shadow 0.25s';
    }

    function handleMouseMove(e) {
      if (!bounds) bounds = card.getBoundingClientRect();
      const mouseX = e.clientX - bounds.left;
      const mouseY = e.clientY - bounds.top;

      // Update cursor position for internal liquid glass reflection
      card.style.setProperty('--card-glow-x', `${mouseX}px`);
      card.style.setProperty('--card-glow-y', `${mouseY}px`);

      // Coordinate from -1 to 1
      const normX = (mouseX / bounds.width - 0.5) * 2;
      const normY = (mouseY / bounds.height - 0.5) * 2;

      // Subtle, refined 3D tilt: 4 to 6 degrees max
      const rotateX = (-normY * 6).toFixed(2);
      const rotateY = (normX * 6).toFixed(2);

      card.style.setProperty(
        'transform',
        `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`,
        'important'
      );
    }

    function handleMouseLeave() {
      card.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.25s, box-shadow 0.25s';
      card.style.setProperty(
        'transform',
        'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)',
        'important'
      );
      bounds = null;
    }

    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);
  });
})();

// ── 6. FAQ Accordion ───────────────────────────────────────────────
(function initFAQ() {
  const faqButtons = document.querySelectorAll('.faq-item__question');

  faqButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentItem = btn.closest('.faq-item');
      if (!currentItem) return;

      const isAlreadyOpen = currentItem.classList.contains('active') || currentItem.classList.contains('is-open');

      // Close all other items
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
        item.classList.remove('is-open');
        const q = item.querySelector('.faq-item__question');
        if (q) q.setAttribute('aria-expanded', 'false');
      });

      // Toggle current
      if (!isAlreadyOpen) {
        currentItem.classList.add('active');
        currentItem.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
})();

// ── 7. Toast Notification ──────────────────────────────────────────
function showToast(message = 'Copied to clipboard!', duration = 2400) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), duration);
}

window.showToast = showToast;

// ── 8. Fast Clipboard Copy ─────────────────────────────────────────
function copyToClipboard(text, message = '✓ Copied to clipboard!') {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text)
      .then(() => showToast(message))
      .catch(() => fallbackCopy(text, message));
  } else {
    fallbackCopy(text, message);
  }
}

function fallbackCopy(text, message) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  try {
    document.execCommand('copy');
    showToast(message);
  } catch (err) {
    showToast('Press Ctrl+C to copy');
  }
  document.body.removeChild(ta);
}

window.copyToClipboard = copyToClipboard;

// ── 9. Mobile Navigation Toggle ────────────────────────────────────
(function initMobileNav() {
  const hamburger = document.querySelector('.navbar__hamburger');
  const nav = document.querySelector('.navbar__nav');
  if (!hamburger || !nav) return;

  hamburger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    hamburger.setAttribute('aria-expanded', isOpen);

    const spans = hamburger.querySelectorAll('span');
    if (spans.length === 3) {
      if (isOpen) {
        spans[0].style.transform = 'translateY(7px) rotate(45deg)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
      } else {
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    }
  });

  nav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      nav.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
      const spans = hamburger.querySelectorAll('span');
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });
})();

// ── 10. Active Nav Link Detection ──────────────────────────────────
(function setActiveNavLink() {
  const path = window.location.pathname.replace(/\/index\.html$/, '/');
  document.querySelectorAll('.navbar__nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (!href) return;
    if (href === path || (href !== '/' && href !== '../' && path.includes(href.replace('../', '')))) {
      a.classList.add('active');
    }
  });
})();

// ── 11. Format Number Utility ──────────────────────────────────────
function formatNumber(num, decimals = 2) {
  return Number(num).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}
window.formatNumber = formatNumber;

// ── 12. Trigger Lucide Icons ───────────────────────────────────────
if (window.lucide && typeof window.lucide.createIcons === 'function') {
  window.lucide.createIcons();
}
