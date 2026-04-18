document.addEventListener('DOMContentLoaded', function () {

  /* ── Scroll-to-top (declared first) ── */
  var scrollTopBtn = document.getElementById('scroll-top');
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── Nav frost on scroll ── */
  var nav = document.querySelector('nav');
  function updateNav() {
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 60);
    if (scrollTopBtn) scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
  }
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  /* ── Active nav link via IntersectionObserver ── */
  var navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');
  var sections = document.querySelectorAll('section[id]');

  var activeObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        var id = e.target.id;
        navLinks.forEach(function (a) {
          a.classList.toggle('active', a.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { rootMargin: '-35% 0px -55% 0px' });
  sections.forEach(function (s) { activeObs.observe(s); });

  /* ── Mobile menu ── */
  var hamburger = document.querySelector('.hamburger');
  var mobileMenu = document.querySelector('.mobile-menu');
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

  /* ── Scroll reveal (no AOS dependency) ── */
  var reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('revealed');
          revealObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { revealObs.observe(el); });
  }

  /* ── Typing animation ── */
  var phrases = ['Chemical Modelling Researcher', '3D Molecule Generation', 'Software Developer'];
  var pi = 0, ci = 0, deleting = false;
  var typingEl = document.getElementById('typing-text');
  function type() {
    if (!typingEl) return;
    var phrase = phrases[pi];
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
  document.querySelectorAll('.abstract-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var target = document.getElementById(btn.dataset.target);
      if (!target) return;
      target.classList.toggle('expanded');
      btn.textContent = target.classList.contains('expanded') ? '\u2191 Show less' : '\u2193 Read more';
    });
  });

  /* ── BibTeX copy ── */
  var bibtex = '@article{koczorbenda2025structural,\n  title={Structural bias in three-dimensional autoregressive generative machine learning of organic molecules},\n  author={Koczor-Benda, Zsuzsanna and Gilkes, J and Bartucca, F and Al-Fekaiki, A and Maurer, Reinhard J},\n  journal={Journal of Chemical Information and Modeling},\n  year={2025},\n  publisher={ACS Publications},\n  doi={10.1021/acs.jcim.5c00665}\n}';

  var copyBtn = document.getElementById('copy-bibtex');
  var toast = document.getElementById('toast');
  if (copyBtn && toast) {
    copyBtn.addEventListener('click', function () {
      function showToast() {
        toast.style.display = 'block';
        toast.style.animation = 'none';
        void toast.offsetWidth;
        toast.style.animation = 'toast-in 0.3s ease';
        setTimeout(function () {
          toast.style.animation = 'toast-out 0.3s ease';
          setTimeout(function () { toast.style.display = 'none'; }, 300);
        }, 2200);
      }
      if (navigator.clipboard) {
        navigator.clipboard.writeText(bibtex).then(showToast).catch(showToast);
      } else {
        var ta = document.createElement('textarea');
        ta.value = bibtex;
        document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
        showToast();
      }
    });
  }

  /* ── GSAP scroll animations (optional enhancement) ── */
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    gsap.from('.hero-typing',   { opacity: 0, y: 20, duration: 0.7, delay: 0.2 });
    gsap.from('.hero-name',     { opacity: 0, y: 30, duration: 0.7, delay: 0.5 });
    gsap.from('.hero-subtitle', { opacity: 0, y: 20, duration: 0.6, delay: 0.8 });
    gsap.from('.hero-bio',      { opacity: 0, y: 20, duration: 0.6, delay: 1.0 });
    gsap.from('.hero-actions',  { opacity: 0, y: 20, duration: 0.5, delay: 1.2 });
  }

  /* ── Vanilla Tilt ── */
  if (typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(document.querySelectorAll('.research-card, .project-card'), {
      max: 7, glare: true, 'max-glare': 0.06, speed: 400
    });
  }

  /* ── Molecules ── */
  if (typeof initMolecules === 'function') initMolecules();
});
