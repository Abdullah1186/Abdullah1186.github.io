document.addEventListener('DOMContentLoaded', function () {

  /* ── AOS ── */
  AOS.init({ duration: 700, easing: 'ease-out-cubic', once: true, offset: 60 });

  /* ── GSAP ── */
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    heroTl
      .from('#hero-canvas',    { opacity: 0, duration: 1.2 }, 0)
      .from('.hero-typing',    { opacity: 0, y: 20, duration: 0.6 }, 0.3)
      .from('.hero-name',      { opacity: 0, y: 30, duration: 0.7 }, 0.6)
      .from('.hero-subtitle',  { opacity: 0, y: 20, duration: 0.6 }, 0.9)
      .from('.hero-bio',       { opacity: 0, y: 20, duration: 0.6 }, 1.1)
      .from('.hero-actions',   { opacity: 0, y: 20, duration: 0.5 }, 1.3)
      .from('.hero-mol-wrap',  { opacity: 0, scale: 0.9, duration: 0.8 }, 1.4);

    gsap.from('.research-card', {
      y: 50, opacity: 0, duration: 0.6, stagger: 0.14, ease: 'power3.out',
      scrollTrigger: { trigger: '#research', start: 'top 75%' }
    });

    gsap.from('.pub-card', {
      y: 40, opacity: 0, duration: 0.7, ease: 'power3.out',
      scrollTrigger: { trigger: '#publications', start: 'top 78%' }
    });

    gsap.from('.paper-card', {
      y: 40, opacity: 0, duration: 0.7, stagger: 0.15, ease: 'power3.out',
      scrollTrigger: { trigger: '#papers', start: 'top 78%' }
    });

    gsap.from('.contact-card', {
      y: 30, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: '#contact', start: 'top 80%' }
    });
  }

  /* ── Vanilla Tilt ── */
  if (typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(document.querySelectorAll('.research-card'), {
      max: 8, glare: true, 'max-glare': 0.08, speed: 400
    });
  }

  /* ── Nav scroll + active ── */
  const nav = document.querySelector('nav');
  const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');
  const sections = document.querySelectorAll('section[id]');

  function updateNav() {
    if (window.scrollY > 60) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');

    if (window.scrollY > 400) scrollTopBtn.classList.add('visible');
    else scrollTopBtn.classList.remove('visible');
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => observer.observe(s));

  /* ── Mobile menu ── */
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });

  document.querySelectorAll('.mobile-menu a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });

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

  /* ── Abstract toggles ── */
  document.querySelectorAll('.abstract-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.target);
      if (!target) return;
      target.classList.toggle('expanded');
      btn.textContent = target.classList.contains('expanded') ? '↑ Show less' : '↓ Read more';
    });
  });

  document.querySelectorAll('.paper-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.target);
      if (!target) return;
      target.classList.toggle('expanded');
      btn.textContent = target.classList.contains('expanded') ? '↑ Show less' : '↓ Read more';
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
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(bibtex).then(() => {
        toast.style.display = 'block';
        toast.style.animation = 'toast-in 0.3s ease';
        setTimeout(() => {
          toast.style.animation = 'toast-out 0.3s ease';
          setTimeout(() => { toast.style.display = 'none'; }, 300);
        }, 2200);
      });
    });
  }

  /* ── Scroll to top ── */
  const scrollTopBtn = document.getElementById('scroll-top');
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ── Molecules ── */
  if (typeof initMolecules === 'function') initMolecules();
});
