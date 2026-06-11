/** Punto de entrada de los módulos de motion del sitio. */
import { initMotion } from './motion';
import { initHeroCanvas } from './hero-canvas';
import { initTextReveal } from './text-reveal';

try {
  initMotion();
  initHeroCanvas();
  initTextReveal();
} catch (err) {
  // Si algo falla, garantizar que el contenido quede visible (anti-FOUC)
  document.documentElement.classList.remove('motion');
  throw err;
}
