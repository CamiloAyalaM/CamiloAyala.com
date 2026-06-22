/**
 * Micro-interacciones: reveal final del footer con stagger.
 */
import { gsap, reducedMotion } from './motion';

export function initMicro(): void {
  if (reducedMotion) return;
  initFooterReveal();
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
