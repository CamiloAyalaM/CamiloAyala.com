/** Punto de entrada de los módulos de motion del sitio. */
import { initMotion } from './motion';
import { initTextReveal } from './text-reveal';
import { initScrollFx } from './scroll-fx';
import { initMicro } from './micro';

try {
  initMotion();
  initTextReveal();
  initScrollFx();
  // Las tarjetas (servicios, portafolio, blog, etc.) se revelan con
  // transiciones CSS puras vía IntersectionObserver (ver index.astro y
  // .rv/.rv-l en global.css): más fluido que controlarlas con GSAP.
  initMicro();
} catch (err) {
  // Si algo falla, garantizar que el contenido quede visible (anti-FOUC)
  document.documentElement.classList.remove('motion');
  throw err;
}
