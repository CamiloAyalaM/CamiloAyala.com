/**
 * Núcleo de motion: Lenis (smooth scroll) + GSAP/ScrollTrigger.
 * Todo lo animado del sitio se registra a través de este módulo para
 * respetar `prefers-reduced-motion` desde un único punto.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const finePointer = window.matchMedia('(pointer: fine)').matches;
export const isMobile = window.matchMedia('(max-width: 768px)').matches;

export { gsap, ScrollTrigger };

export let lenis: Lenis | null = null;

/** Ejecuta `fn` solo cuando el usuario no pidió movimiento reducido. */
export function onMotion(fn: () => void): void {
  if (!reducedMotion) fn();
}

export function initMotion(): void {
  if (reducedMotion) return;

  lenis = new Lenis({
    duration: 1.1,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis!.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  initAnchorLinks();
  initHeroParallax();
}

/** Enlaces ancla del nav (y CTAs internos) con scroll suave y offset del nav fijo. */
function initAnchorLinks(): void {
  const nav = document.getElementById('nav');
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href.length < 2) return;
      const target = document.querySelector<HTMLElement>(href);
      if (!target) return;
      e.preventDefault();
      lenis?.scrollTo(target, { offset: -(nav?.offsetHeight ?? 0) });
    });
  });
}

/** Parallax de la foto del hero, antes con listener manual de scroll. */
function initHeroParallax(): void {
  const heroPhoto = document.querySelector<HTMLElement>('.hero-photo');
  const hero = document.querySelector<HTMLElement>('.hero');
  if (!heroPhoto || !hero) return;
  gsap.to(heroPhoto, {
    y: () => hero.offsetHeight * 0.16,
    ease: 'none',
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      invalidateOnRefresh: true,
    },
  });
}
