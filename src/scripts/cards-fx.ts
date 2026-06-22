/**
 * Servicios y portafolio:
 * - .srv-card: entrada con profundidad (y/scale/opacity con stagger) sobre
 *   la grilla existente — sin sticky, conservando el layout.
 * - .pc: reveal con clip-path inset + scale-down de la imagen interna.
 */
import { gsap, ScrollTrigger, reducedMotion } from './motion';

export function initCardsFx(): void {
  if (reducedMotion) return;
  initServiceCards();
  initPortfolioReveal();
}

function initServiceCards(): void {
  const cards = gsap.utils.toArray<HTMLElement>('.srv-card');
  if (!cards.length) return;
  // GSAP toma el control del reveal: quitar .rv antes de que el IO lo procese
  cards.forEach((c) => c.classList.remove('rv'));
  gsap.set(cards, { y: 44, opacity: 0, scale: 0.96 });
  ScrollTrigger.batch(cards, {
    start: 'top 88%',
    once: true,
    onEnter: (batch) => {
      // .in conserva el teaser de la barra dorada del CSS existente
      batch.forEach((b) => (b as HTMLElement).classList.add('in'));
      gsap.to(batch, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.9,
        ease: 'expo.out',
        stagger: 0.09,
        overwrite: true,
        clearProps: 'transform',
      });
    },
  });
}

function initPortfolioReveal(): void {
  gsap.utils.toArray<HTMLElement>('.pc').forEach((pc) => {
    pc.classList.remove('rv');
    const img = pc.querySelector<HTMLElement>('.pc-bg');
    gsap.set(pc, { clipPath: 'inset(12% 6% 12% 6%)', opacity: 0 });
    if (img) {
      // Suspender la transición CSS de hover mientras GSAP anima la imagen
      img.style.transition = 'none';
      gsap.set(img, { scale: 1.15 });
    }
    const tl = gsap.timeline({
      scrollTrigger: { trigger: pc, start: 'top 85%', once: true },
      onComplete: () => {
        if (img) img.style.transition = '';
      },
    });
    tl.to(
      pc,
      { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, duration: 1.1, ease: 'expo.out', clearProps: 'clipPath' },
      0
    );
    if (img) {
      tl.to(img, { scale: 1, duration: 1.2, ease: 'expo.out', clearProps: 'transform' }, 0);
    }
  });
}
