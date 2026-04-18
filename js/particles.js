(function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const isMobile = () => window.innerWidth < 768;
  const COUNT = () => isMobile() ? 45 : 85;

  let W, H, particles = [], animId;
  let mouse = { x: null, y: null };

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function Particle() {
    this.reset = function () {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.r  = Math.random() * 2 + 1;
      this.opacity = Math.random() * 0.5 + 0.3;
    };
    this.reset();

    this.update = function () {
      this.x += this.vx;
      this.y += this.vy;

      if (mouse.x !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (120 - dist) / 120 * 0.012;
          this.vx += (dx / dist) * force;
          this.vy += (dy / dist) * force;
        }
      }

      const max = 0.7;
      if (this.vx >  max) this.vx =  max;
      if (this.vx < -max) this.vx = -max;
      if (this.vy >  max) this.vy =  max;
      if (this.vy < -max) this.vy = -max;

      if (this.x < -10) this.x = W + 10;
      if (this.x > W + 10) this.x = -10;
      if (this.y < -10) this.y = H + 10;
      if (this.y > H + 10) this.y = -10;
    };

    this.draw = function () {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(79, 195, 247, ${this.opacity})`;
      ctx.fill();
    };
  }

  function init() {
    particles = [];
    const n = COUNT();
    for (let i = 0; i < n; i++) particles.push(new Particle());
  }

  const LINK_DIST = isMobile() ? 100 : 130;

  function draw() {
    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < particles.length; i++) {
      const a = particles[i];
      a.update();
      a.draw();

      for (let j = i + 1; j < particles.length; j++) {
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < LINK_DIST) {
          const alpha = (1 - dist / LINK_DIST) * 0.18;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(79, 195, 247, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    animId = requestAnimationFrame(draw);
  }

  function start() {
    resize();
    init();
    draw();
  }

  window.addEventListener('resize', () => {
    resize();
    init();
  });

  canvas.closest('section').addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  canvas.closest('section').addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(animId);
    else draw();
  });

  start();
})();
