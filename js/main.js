/* Latitude — main.js
   Mobile nav · Scroll nav shadow · Form stub · Footer year
   ---
   Phase 2: replace form stub with fetch('/api/enquire', ...) here
*/

(function () {
  'use strict';

  // ── Footer year ──────────────────────────────────────────
  const yearEl = document.getElementById('footerYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ── Nav: shadow on scroll ────────────────────────────────
  const nav = document.getElementById('nav');
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    };
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

    // Close nav when a link is clicked
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        links.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      });
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

    // Build dots
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'testimonials__dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });

    function goTo(index) {
      current = index;
      track.style.transform = 'translateX(-' + (current * 100) + '%)';
      dotsWrap.querySelectorAll('.testimonials__dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
      });
      prevBtn.disabled = current === 0;
      nextBtn.disabled = current === slides.length - 1;
    }

    prevBtn.addEventListener('click', () => goTo(current - 1));
    nextBtn.addEventListener('click', () => goTo(current + 1));

    // Swipe support on touch devices
    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const delta = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(delta) > 40) goTo(delta > 0 ? Math.min(current + 1, slides.length - 1) : Math.max(current - 1, 0));
    });

    goTo(0);
  }

  // Show success message when Formspree hides the form on submission
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
