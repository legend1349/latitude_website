/* Latitude — main.js */
(function () {
  'use strict';

  // ── JS capability flag (used by CSS scroll reveals) ──────
  document.documentElement.classList.add('js');

  // ── Footer year ──────────────────────────────────────────
  const yearEl = document.getElementById('footerYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ── Nav: shadow on scroll ────────────────────────────────
  const nav = document.getElementById('nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ── Mobile nav toggle ────────────────────────────────────
  const burger = document.getElementById('navBurger');
  const links  = document.getElementById('navLinks');
  if (burger && links) {
    burger.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', String(open));
    });
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        links.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ── Scroll reveal ────────────────────────────────────────
  const revealSelector = [
    '.about__body',
    '.about__aside',
    '.mission__quote',
    '.mission__body',
    '.offer__panel--primary',
    '.offer__panel--secondary',
    '.vs__heading',
    '.vs__body',
    '.serve__heading',
    '.serve__details',
    '.testimonials__header',
    '.testimonials__track-wrap',
    '.testimonials__dots',
    '.timings__eyebrow',
    '.timings__heading',
    '.timings__table-wrap',
    '.contact__header',
    '.contact__form',
  ].join(', ');

  const revealEls = document.querySelectorAll(revealSelector);

  if ('IntersectionObserver' in window && revealEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    const viewportH = window.innerHeight;
    revealEls.forEach(el => {
      const rect = el.getBoundingClientRect();
      // Skip elements already visible on load — only animate below the fold
      if (rect.top > viewportH * 0.85) {
        el.setAttribute('data-reveal', '');
        observer.observe(el);
      }
    });
  }

  // ── Testimonial slider ───────────────────────────────────
  const track    = document.getElementById('testimonialTrack');
  const prevBtn  = document.getElementById('testimonialPrev');
  const nextBtn  = document.getElementById('testimonialNext');
  const dotsWrap = document.getElementById('testimonialDots');

  if (track && prevBtn && nextBtn && dotsWrap) {
    const slides = Array.from(track.children);
    let current = 0;
    let autoTimer = null;
    const AUTO_INTERVAL = 5000;

    // Dots as visual spans (prev/next handle keyboard)
    dotsWrap.removeAttribute('aria-hidden');
    dotsWrap.setAttribute('aria-label', 'Testimonial indicators');
    slides.forEach((_, i) => {
      const dot = document.createElement('span');
      dot.className = 'testimonials__dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-hidden', 'true');
      dot.addEventListener('click', () => { goTo(i); resetAuto(); });
      dotsWrap.appendChild(dot);
    });

    function goTo(index) {
      current = Math.max(0, Math.min(index, slides.length - 1));
      track.style.transform = 'translateX(-' + (current * 100) + '%)';
      dotsWrap.querySelectorAll('.testimonials__dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
      });
      prevBtn.disabled = current === 0;
      nextBtn.disabled = current === slides.length - 1;
    }

    function startAuto() {
      autoTimer = setInterval(() => {
        goTo(current < slides.length - 1 ? current + 1 : 0);
      }, AUTO_INTERVAL);
    }

    function resetAuto() {
      clearInterval(autoTimer);
      startAuto();
    }

    prevBtn.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
    nextBtn.addEventListener('click', () => { goTo(current + 1); resetAuto(); });

    // Pause on hover / focus within the section
    const testimonialSection = track.closest('.testimonials');
    if (testimonialSection) {
      testimonialSection.addEventListener('mouseenter', () => clearInterval(autoTimer));
      testimonialSection.addEventListener('mouseleave', startAuto);
      testimonialSection.addEventListener('focusin',   () => clearInterval(autoTimer));
      testimonialSection.addEventListener('focusout',  startAuto);
    }

    // Swipe support
    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const delta = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(delta) > 40) {
        goTo(delta > 0 ? current + 1 : current - 1);
        resetAuto();
      }
    });

    goTo(0);
    startAuto();
  }

  // ── Form success detection ───────────────────────────────
  const enquiryForm = document.getElementById('enquiryForm');
  const formSuccess = document.getElementById('formSuccess');
  if (enquiryForm && formSuccess) {
    new MutationObserver(() => {
      if (enquiryForm.style.display === 'none') {
        formSuccess.style.display = 'flex';
      }
    }).observe(enquiryForm, { attributes: true, attributeFilter: ['style'] });
  }

})();
