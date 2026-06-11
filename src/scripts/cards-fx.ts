/**
 * Servicios y portafolio:
 * - .srv-card: entrada con profundidad (y/scale/opacity con stagger) sobre
 *   la grilla 3×2 existente — sin sticky, conservando el layout.
 * - .pc: reveal con clip-path inset + scale-down de la imagen interna, y
 *   etiqueta flotante "Ver →" que sigue el cursor dentro de la card.
 */
import { gsap, ScrollTrigger, reducedMotion, finePointer } from './motion';

export function initCardsFx(): void {
  if (reducedMotion) return;
  initServiceCards();
  initPortfolioReveal();
  if (finePointer) initPortfolioLabel();
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

/** Etiqueta "Ver →" que sigue el cursor dentro de las cards de portafolio. */
function initPortfolioLabel(): void {
  const pcs = document.querySelectorAll<HTMLElement>('.pc');
  if (!pcs.length) return;

  const label = document.createElement('div');
  label.className = 'pc-label';
  label.setAttribute('aria-hidden', 'true');
  label.textContent = 'Ver →';
  document.body.appendChild(label);

  let lx = 0;
  let ly = 0;
  let tx = 0;
  let ty = 0;
  let active = false;

  gsap.ticker.add(() => {
    if (!active) return;
    lx += (tx - lx) * 0.18;
    ly += (ty - ly) * 0.18;
    label.style.transform = `translate(${lx}px, ${ly}px)`;
  });

  pcs.forEach((pc) => {
    pc.addEventListener('mouseenter', (e: MouseEvent) => {
      tx = lx = e.clientX;
      ty = ly = e.clientY;
      active = true;
      label.classList.add('on');
      document.body.classList.add('hide-cursor');
    });
    pc.addEventListener('mousemove', (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    });
    pc.addEventListener('mouseleave', () => {
      active = false;
      label.classList.remove('on');
      document.body.classList.remove('hide-cursor');
    });
  });
}
