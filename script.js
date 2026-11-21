// Aparición suave al hacer scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Cerrar menú móvil al elegir una sección
document.querySelectorAll('.nav nav a').forEach(a =>
  a.addEventListener('click', () => document.getElementById('nav').classList.remove('open')));

// Atmósfera: lluvia fina + luciérnagas (partículas del juego)
(() => {
  const c = document.getElementById('atmosphere');
  const ctx = c.getContext('2d');
  let w, h, drops = [], flies = [];
  const resize = () => {
    w = c.width = innerWidth; h = c.height = innerHeight;
    drops = Array.from({ length: Math.round(w / 14) }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      l: 10 + Math.random() * 14, v: 9 + Math.random() * 7
    }));
    flies = Array.from({ length: 22 }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      a: Math.random() * Math.PI * 2, p: Math.random() * 6
    }));
  };
  addEventListener('resize', resize); resize();

  let t = 0;
  (function frame() {
    t += 0.016;
    ctx.clearRect(0, 0, w, h);

    ctx.strokeStyle = 'rgba(200,190,185,.18)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (const d of drops) {
      ctx.moveTo(d.x, d.y); ctx.lineTo(d.x - 2, d.y + d.l);
      d.y += d.v; d.x -= 0.4;
      if (d.y > h) { d.y = -20; d.x = Math.random() * w; }
    }
    ctx.stroke();

    for (const f of flies) {
      f.a += (Math.random() - .5) * .15;
      f.x += Math.cos(f.a) * .5; f.y += Math.sin(f.a) * .4;
      if (f.x < 0) f.x = w; if (f.x > w) f.x = 0;
      if (f.y < 0) f.y = h; if (f.y > h) f.y = 0;
      const glow = (Math.sin(t * 1.6 + f.p) + 1) / 2;
      const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, 9);
      g.addColorStop(0, `rgba(255,170,60,${.85 * glow})`);
      g.addColorStop(1, 'rgba(255,120,20,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(f.x, f.y, 9, 0, 7); ctx.fill();
    }
    requestAnimationFrame(frame);
  })();
})();
