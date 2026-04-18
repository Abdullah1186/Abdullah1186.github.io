document.addEventListener('DOMContentLoaded', function () {

  /* ── AOS ── */
  if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 700, easing: 'ease-out-cubic', once: true, offset: 60 });
  }

  /* ── Scroll to top (declared first so updateNav can reference it) ── */
  const scrollTopBtn = document.getElementById('scroll-top');
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── Nav scroll frost + scroll-to-top visibility ── */
  const nav = document.querySelector('nav');

  function updateNav() {
    if (!nav) return;
    if (window.scrollY > 60) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');

    if (scrollTopBtn) {
      if (window.scrollY > 400) scrollTopBtn.classList.add('visible');
      else scrollTopBtn.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  /* ── Nav active link via IntersectionObserver ── */
  const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');
  const sections = document.querySelectorAll('section[id]');

  const sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(function (a) {
          a.classList.toggle('active', a.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { rootMargin: '-35% 0px -55% 0px' });

  sections.forEach(function (s) { sectionObserver.observe(s); });

  /* ── Mobile menu ── */
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });

    mobileMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });
  }

  /* ── Typing animation ── */
  const phrases = ['Chemistry Researcher', 'ML for Molecules', 'Generative Model Developer'];
  let pi = 0, ci = 0, deleting = false;
  const typingEl = document.getElementById('typing-text');

  function type() {
    if (!typingEl) return;
    const phrase = phrases[pi];
    if (!deleting) {
      typingEl.textContent = phrase.slice(0, ++ci);
      if (ci === phrase.length) { deleting = true; setTimeout(type, 1800); return; }
      setTimeout(type, 65);
    } else {
      typingEl.textContent = phrase.slice(0, --ci);
      if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; setTimeout(type, 400); return; }
      setTimeout(type, 38);
    }
  }
  type();

  /* ── Abstract / paper toggles ── */
  document.querySelectorAll('.abstract-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const target = document.getElementById(btn.dataset.target);
      if (!target) return;
      target.classList.toggle('expanded');
      btn.textContent = target.classList.contains('expanded') ? '\u2191 Show less' : '\u2193 Read more';
    });
  });

  /* ── BibTeX copy ── */
  const bibtex = `@article{koczorbenda2025structural,
  title={Structural bias in three-dimensional autoregressive generative machine learning of organic molecules},
  author={Koczor-Benda, Zsuzsanna and Gilkes, J and Bartucca, F and Al-Fekaiki, A and Maurer, Reinhard J},
  journal={Journal of Chemical Information and Modeling},
  year={2025},
  publisher={ACS Publications},
  doi={10.1021/acs.jcim.5c00665}
}`;

  const copyBtn = document.getElementById('copy-bibtex');
  const toast   = document.getElementById('toast');

  if (copyBtn && toast) {
    copyBtn.addEventListener('click', function () {
      navigator.clipboard.writeText(bibtex).then(function () {
        toast.style.display = 'block';
        toast.style.animation = 'none';
        void toast.offsetWidth; /* reflow to restart animation */
        toast.style.animation = 'toast-in 0.3s ease';
        setTimeout(function () {
          toast.style.animation = 'toast-out 0.3s ease';
          setTimeout(function () { toast.style.display = 'none'; }, 300);
        }, 2200);
      }).catch(function () {
        /* fallback for non-https */
        const ta = document.createElement('textarea');
        ta.value = bibtex;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        toast.style.display = 'block';
        setTimeout(function () { toast.style.display = 'none'; }, 2500);
      });
    });
  }

  /* ── GSAP ── */
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    /* Hero entrance */
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    heroTl
      .from('.hero-typing',   { opacity: 0, y: 20, duration: 0.6 }, 0.2)
      .from('.hero-name',     { opacity: 0, y: 30, duration: 0.7 }, 0.5)
      .from('.hero-subtitle', { opacity: 0, y: 20, duration: 0.6 }, 0.8)
      .from('.hero-bio',      { opacity: 0, y: 20, duration: 0.6 }, 1.0)
      .from('.hero-actions',  { opacity: 0, y: 20, duration: 0.5 }, 1.2)
      .from('.hero-mol-wrap', { opacity: 0, scale: 0.9, duration: 0.8 }, 1.3);

    /* Section scroll reveals */
    gsap.from('.research-card', {
      y: 50, opacity: 0, duration: 0.6, stagger: 0.14, ease: 'power3.out',
      scrollTrigger: { trigger: '#research', start: 'top 78%' }
    });

    gsap.from('.pub-card', {
      y: 40, opacity: 0, duration: 0.7, ease: 'power3.out',
      scrollTrigger: { trigger: '#publications', start: 'top 80%' }
    });

    gsap.from('.paper-card', {
      y: 40, opacity: 0, duration: 0.7, stagger: 0.15, ease: 'power3.out',
      scrollTrigger: { trigger: '#papers', start: 'top 80%' }
    });

    gsap.from('.project-card', {
      y: 40, opacity: 0, duration: 0.6, stagger: 0.12, ease: 'power3.out',
      scrollTrigger: { trigger: '#projects', start: 'top 80%' }
    });

    gsap.from('.contact-card', {
      y: 30, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: '#contact', start: 'top 82%' }
    });
  }

  /* ── Vanilla Tilt ── */
  if (typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(document.querySelectorAll('.research-card, .project-card'), {
      max: 7, glare: true, 'max-glare': 0.07, speed: 400
    });
  }

  /* ── Molecules ── */
  if (typeof initMolecules === 'function') initMolecules();
});
