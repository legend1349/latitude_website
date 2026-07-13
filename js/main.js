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
    '.courses__intro',
    '.courses__grid',
    '.offer__heading',
    '.offer__panel--primary',
    '.offer__panel--secondary',
    '.week__intro',
    '.week__tracks',
    '.week__flow',
    '.vs__heading',
    '.vs__body',
    '.location__body',
    '.location__aside',
    '.serve__icon',
    '.serve__heading',
    '.serve__details',
    '.samples__card',
    '.timings__head',
    '.timings__table-wrap',
    '.pricing__inner',
    '.enrol__steps',
    '.feedback__inner',
    '.faq__list',
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

  // ── Calendly: load the widget only when the booking section nears view ──
  const calendlyEl = document.querySelector('.calendly-inline-widget');
  if (calendlyEl) {
    let calendlyLoaded = false;
    const loadCalendly = () => {
      if (calendlyLoaded) return;
      calendlyLoaded = true;
      const s = document.createElement('script');
      s.src = 'https://assets.calendly.com/assets/external/widget.js';
      s.async = true;
      document.body.appendChild(s);
    };
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries, obs) => {
        if (entries.some(e => e.isIntersecting)) {
          loadCalendly();
          obs.disconnect();
        }
      }, { rootMargin: '600px 0px' });
      io.observe(calendlyEl);
    } else {
      loadCalendly();
    }
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
