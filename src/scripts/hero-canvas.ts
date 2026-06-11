/**
 * Hero generativo: flow field de partículas-trazo en Canvas 2D (vanilla).
 * Campo de pseudo-ruido por senos compuestos, trazos caligráficos lentos
 * en --gold / --goldt con alpha bajo. Sin dependencias.
 */
import { reducedMotion, finePointer, isMobile } from './motion';

const GOLD = [182, 144, 58] as const;
const GOLDT = [208, 168, 80] as const;
const POINTER_RADIUS = 120;

interface Particle {
  x: number;
  y: number;
  px: number;
  py: number;
  speed: number;
  life: number;
  maxLife: number;
  color: string;
  width: number;
}

/** Pseudo-ruido suave [-1, 1] por senos compuestos — sin dependencias. */
function field(x: number, y: number, t: number): number {
  const s = 0.0019;
  return (
    Math.sin(x * s * 1.7 + t * 0.11) * 0.5 +
    Math.sin(y * s * 2.3 - t * 0.07) * 0.3 +
    Math.sin((x + y) * s * 0.9 + t * 0.05) * 0.2
  );
}

export function initHeroCanvas(): void {
  const hero = document.querySelector<HTMLElement>('.hero');
  const canvas = document.querySelector<HTMLCanvasElement>('.hero-canvas');
  if (!hero || !canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let w = 0;
  let h = 0;
  let particles: Particle[] = [];
  let t = 0;
  let rafId = 0;
  let running = false;
  let heroVisible = true;
  const interactive = finePointer && !isMobile && !reducedMotion;
  const mouse = { x: -9999, y: -9999 };

  function resize(): void {
    w = hero!.offsetWidth;
    h = hero!.offsetHeight;
    canvas!.width = Math.round(w * dpr);
    canvas!.height = Math.round(h * dpr);
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx!.lineCap = 'round';
    const count = isMobile ? 120 : Math.round(Math.min(600, Math.max(300, (w * h) / 2600)));
    particles = Array.from({ length: count }, () => spawn());
  }

  function spawn(): Particle {
    const x = Math.random() * w;
    const y = Math.random() * h;
    const goldish = Math.random() < 0.65;
    const [r, g, b] = goldish ? GOLD : GOLDT;
    const a = 0.08 + Math.random() * 0.12;
    return {
      x,
      y,
      px: x,
      py: y,
      speed: 0.25 + Math.random() * 0.45,
      life: 0,
      maxLife: 240 + Math.random() * 360,
      color: `rgba(${r},${g},${b},${a})`,
      width: 0.5 + Math.random() * 0.6,
    };
  }

  function step(): void {
    t += 1;
    for (const p of particles) {
      p.px = p.x;
      p.py = p.y;
      let angle = field(p.x, p.y, t) * Math.PI * 2;
      // El puntero perturba localmente el campo (solo pointer fino)
      if (interactive) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < POINTER_RADIUS * POINTER_RADIUS && d2 > 0.01) {
          const d = Math.sqrt(d2);
          const push = (1 - d / POINTER_RADIUS) * 1.4;
          p.x += (dx / d) * push;
          p.y += (dy / d) * push;
        }
      }
      p.x += Math.cos(angle) * p.speed;
      p.y += Math.sin(angle) * p.speed;
      p.life += 1;
      if (p.life > p.maxLife || p.x < -8 || p.x > w + 8 || p.y < -8 || p.y > h + 8) {
        Object.assign(p, spawn());
        continue;
      }
      ctx!.strokeStyle = p.color;
      ctx!.lineWidth = p.width;
      ctx!.beginPath();
      ctx!.moveTo(p.px, p.py);
      ctx!.lineTo(p.x, p.y);
      ctx!.stroke();
    }
  }

  function fade(): void {
    ctx!.globalCompositeOperation = 'destination-out';
    ctx!.fillStyle = 'rgba(0,0,0,0.032)';
    ctx!.fillRect(0, 0, w, h);
    ctx!.globalCompositeOperation = 'source-over';
  }

  function loop(): void {
    if (!running) return;
    fade();
    step();
    rafId = requestAnimationFrame(loop);
  }

  function start(): void {
    if (running || reducedMotion) return;
    running = true;
    rafId = requestAnimationFrame(loop);
  }

  function stop(): void {
    running = false;
    cancelAnimationFrame(rafId);
  }

  resize();

  if (reducedMotion) {
    // Un solo frame estático del campo: se acumulan trazos y se detiene.
    for (let i = 0; i < 200; i++) step();
    return;
  }

  window.addEventListener('resize', () => {
    stop();
    resize();
    if (heroVisible && !document.hidden) start();
  });

  if (interactive) {
    hero.addEventListener('mousemove', (e: MouseEvent) => {
      const rect = hero.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    hero.addEventListener('mouseleave', () => {
      mouse.x = -9999;
      mouse.y = -9999;
    });
  }

  // Pausar el rAF cuando el hero no está visible o la pestaña queda oculta
  new IntersectionObserver(
    (entries) => {
      heroVisible = entries[0].isIntersecting;
      if (heroVisible && !document.hidden) start();
      else stop();
    },
    { threshold: 0 }
  ).observe(hero);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else if (heroVisible) start();
  });
}
