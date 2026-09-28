// Particle field + interactions. Written by the AI, like everything else here.
(function () {
  var canvas = document.getElementById('particles');
  var ctx = canvas.getContext('2d');
  var W, H, particles = [], mouse = { x: -9999, y: -9999 };
  var COLORS = ['#ff2e88', '#22e6ff', '#8b5cf6', '#f5f2ff'];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  var COUNT = Math.min(110, Math.floor(window.innerWidth / 12));
  for (var i = 0; i < COUNT; i++) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - .5) * .45,
      vy: (Math.random() - .5) * .45,
      r: Math.random() * 2.1 + .6,
      c: COLORS[(Math.random() * COLORS.length) | 0]
    });
  }

  window.addEventListener('mousemove', function (e) {
    mouse.x = e.clientX; mouse.y = e.clientY;
    var glow = document.getElementById('cursorGlow');
    if (glow) { glow.style.left = e.clientX + 'px'; glow.style.top = e.clientY + 'px'; }
  });

  function tick() {
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      var dx = p.x - mouse.x, dy = p.y - mouse.y;
      var d2 = dx * dx + dy * dy;
      if (d2 < 22500) {
        var f = (150 - Math.sqrt(d2)) / 150 * .55;
        p.vx += (dx / (Math.sqrt(d2) + .01)) * f;
        p.vy += (dy / (Math.sqrt(d2) + .01)) * f;
      }
      p.vx *= .985; p.vy *= .985;
      p.x += p.vx; p.y += p.vy;
      if (p.x < -20) p.x = W + 20; if (p.x > W + 20) p.x = -20;
      if (p.y < -20) p.y = H + 20; if (p.y > H + 20) p.y = -20;
      ctx.globalAlpha = .85;
      ctx.fillStyle = p.c;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, 6.2832);
      ctx.fill();
    }
    ctx.globalAlpha = .12;
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = .7;
    for (var a = 0; a < particles.length; a++) {
      for (var b = a + 1; b < particles.length; b++) {
        var ddx = particles[a].x - particles[b].x;
        var ddy = particles[a].y - particles[b].y;
        var dd = ddx * ddx + ddy * ddy;
        if (dd < 12000) {
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(tick);
  }
  tick();

  // Scroll reveals
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); }
    });
  }, { threshold: .18 });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  // Card spotlight follows cursor
  document.querySelectorAll('.card').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  // Count-up stats
  var counted = false;
  var statIO = new IntersectionObserver(function (entries) {
    if (counted || !entries.some(function (e) { return e.isIntersecting; })) return;
    counted = true;
    document.querySelectorAll('.stat-num').forEach(function (el) {
      var target = parseInt(el.getAttribute('data-count'), 10);
      var t0 = performance.now(), dur = 1100;
      (function step(now) {
        var k = Math.min(1, (now - t0) / dur);
        el.textContent = Math.round(target * (1 - Math.pow(1 - k, 3)));
        if (k < 1) requestAnimationFrame(step);
      })(t0);
    });
    statIO.disconnect();
  }, { threshold: .3 });
  document.querySelectorAll('.stat').forEach(function (el) { statIO.observe(el); });
})();
