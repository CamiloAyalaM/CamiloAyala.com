/**
 * Micro-interacciones: botones magnéticos en CTAs principales y reveal
 * final del footer con stagger.
 */
import { gsap, reducedMotion, finePointer } from './motion';

export function initMicro(): void {
  if (reducedMotion) return;
  if (finePointer) {
    document
      .querySelectorAll<HTMLElement>('.btn-g, .nav-cta, .li-banner-a')
      .forEach(magnetize);
  }
  initFooterReveal();
}

/** Atracción al cursor (~30% del delta) con retorno elastic out. */
function magnetize(el: HTMLElement): void {
  const STRENGTH = 0.3;
  // La transición CSS de transform pelearía con GSAP frame a frame
  el.style.transition = 'background 0.22s, box-shadow 0.22s';
  el.addEventListener('mousemove', (e: MouseEvent) => {
    const r = el.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    gsap.to(el, { x: dx * STRENGTH, y: dy * STRENGTH, duration: 0.4, ease: 'power3.out' });
  });
  el.addEventListener('mouseleave', () => {
    gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.4)' });
  });
}

function initFooterReveal(): void {
  const footer = document.querySelector<HTMLElement>('.footer');
  if (!footer || !footer.children.length) return;
  const items = Array.from(footer.children);
  gsap.set(items, { y: 18, opacity: 0 });
  gsap.to(items, {
    y: 0,
    opacity: 1,
    duration: 0.8,
    ease: 'power3.out',
    stagger: 0.12,
    scrollTrigger: { trigger: footer, start: 'top bottom', once: true },
  });
}
