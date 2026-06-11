/** Punto de entrada de los módulos de motion del sitio. */
import { initMotion } from './motion';
import { initTextReveal } from './text-reveal';
import { initScrollFx } from './scroll-fx';
import { initCardsFx } from './cards-fx';
import { initMicro } from './micro';

try {
  initMotion();
  initTextReveal();
  initScrollFx();
  initCardsFx();
  initMicro();
} catch (err) {
  // Si algo falla, garantizar que el contenido quede visible (anti-FOUC)
  document.documentElement.classList.remove('motion');
  throw err;
}
