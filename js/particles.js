(function () {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const isMobile = () => window.innerWidth < 768;

  let W, H, particles = [], animId;
  let mouse = { x: null, y: null };

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function Particle() {
    this.reset = function () {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.r  = Math.random() * 1.8 + 0.8;
      this.opacity = Math.random() * 0.45 + 0.2;
    };
    this.reset();

    this.update = function () {
      this.x += this.vx;
      this.y += this.vy;

      if (mouse.x !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150 && dist > 0) {
          const force = (150 - dist) / 150 * 0.01;
          this.vx += (dx / dist) * force;
          this.vy += (dy / dist) * force;
        }
      }

      const max = 0.65;
      if (this.vx >  max) this.vx =  max;
      if (this.vx < -max) this.vx = -max;
      if (this.vy >  max) this.vy =  max;
      if (this.vy < -max) this.vy = -max;

      if (this.x < -10)    this.x = W + 10;
      if (this.x > W + 10) this.x = -10;
      if (this.y < -10)    this.y = H + 10;
      if (this.y > H + 10) this.y = -10;
    };

    this.draw = function () {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(79,195,247,' + this.opacity + ')';
      ctx.fill();
    };
  }

  function getCount() { return isMobile() ? 55 : 120; }
  function getLinkDist() { return isMobile() ? 100 : 130; }

  function init() {
    particles = [];
    const n = getCount();
    for (let i = 0; i < n; i++) particles.push(new Particle());
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const LINK_DIST = getLinkDist();

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
          const alpha = (1 - dist / LINK_DIST) * 0.14;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = 'rgba(79,195,247,' + alpha + ')';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    animId = requestAnimationFrame(draw);
  }

  let resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      resize();
      init();
    }, 150);
  });

  document.addEventListener('mousemove', function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  document.addEventListener('mouseleave', function () {
    mouse.x = null;
    mouse.y = null;
  });

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) cancelAnimationFrame(animId);
    else { resize(); draw(); }
  });

  resize();
  init();
  draw();
})();
