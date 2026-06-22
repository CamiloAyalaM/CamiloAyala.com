/**
 * Servicios y portafolio: reveals limpios al entrar en viewport.
 * Solo se animan `opacity` y `transform` (translate/scale) — propiedades
 * compositadas por GPU — con curvas suaves para una entrada fluida.
 * - .srv-card: fade-up con stagger.
 * - .pc: fade-up de la tarjeta + scale-down sutil de la imagen interna.
 */
import { gsap, ScrollTrigger, reducedMotion } from './motion';

// Curva tipo "easeOutQuint": arranque firme y asentamiento muy suave,
// sin el latigazo de expo.out.
const EASE = 'power4.out';

function initServiceCards(): void {
  const cards = gsap.utils.toArray<HTMLElement>('.srv-card');
  if (!cards.length) return;
  // GSAP toma el control del reveal: quitar .rv antes de que el IO lo procese
  cards.forEach((c) => c.classList.remove('rv'));
  gsap.set(cards, { y: 30, autoAlpha: 0, force3D: true });
  ScrollTrigger.batch(cards, {
    start: 'top 92%',
    once: true,
    onEnter: (batch) => {
      gsap.to(batch, {
        y: 0,
        autoAlpha: 1,
        duration: 0.8,
        ease: EASE,
        stagger: 0.08,
        overwrite: true,
        clearProps: 'transform,opacity,visibility',
      });
    },
  });
}

function initPortfolioReveal(): void {
  gsap.utils.toArray<HTMLElement>('.pc').forEach((pc) => {
    pc.classList.remove('rv');
    const img = pc.querySelector<HTMLElement>('.pc-bg');
    gsap.set(pc, { y: 36, autoAlpha: 0, force3D: true });
    if (img) {
      // Suspender la transición CSS de hover mientras GSAP anima la imagen
      img.style.transition = 'none';
      gsap.set(img, { scale: 1.1, force3D: true });
    }
    const tl = gsap.timeline({
      scrollTrigger: { trigger: pc, start: 'top 90%', once: true },
      onComplete: () => {
        if (img) img.style.transition = '';
      },
    });
    tl.to(
      pc,
      { y: 0, autoAlpha: 1, duration: 0.9, ease: EASE, clearProps: 'transform,opacity,visibility' },
      0
    );
    if (img) {
      tl.to(img, { scale: 1, duration: 1.1, ease: EASE, clearProps: 'transform' }, 0);
    }
  });
}

export function initCardsFx(): void {
  if (reducedMotion) return;
  initServiceCards();
  initPortfolioReveal();
}
