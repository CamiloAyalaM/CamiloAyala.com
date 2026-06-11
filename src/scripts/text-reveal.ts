/**
 * Tipografía en movimiento: split por palabras (preservando <em>, <strong>
 * y <br> internos) + reveal con stagger. El H1 anima en load; los headings
 * de sección (.sec) al entrar en viewport (una vez).
 *
 * Anti-FOUC: los headings solo se ocultan bajo `html.motion` (clase puesta
 * por un script inline en <head> únicamente con JS activo y sin
 * prefers-reduced-motion); sin JS el texto se ve normal.
 */
import { gsap, reducedMotion } from './motion';

/** Envuelve cada palabra en .w (máscara) > .wi (palabra), preservando markup interno. */
function wrapWords(el: HTMLElement): HTMLElement[] {
  const inners: HTMLElement[] = [];
  const walk = (node: Node): void => {
    for (const child of Array.from(node.childNodes)) {
      if (child.nodeType === Node.TEXT_NODE) {
        const text = child.textContent ?? '';
        if (!text.trim()) continue;
        const frag = document.createDocumentFragment();
        for (const part of text.split(/(\s+)/)) {
          if (!part) continue;
          if (/^\s+$/.test(part)) {
            frag.appendChild(document.createTextNode(' '));
            continue;
          }
          const w = document.createElement('span');
          w.className = 'w';
          const wi = document.createElement('span');
          wi.className = 'wi';
          wi.textContent = part;
          w.appendChild(wi);
          frag.appendChild(w);
          inners.push(wi);
        }
        node.replaceChild(frag, child);
      } else if (child.nodeType === Node.ELEMENT_NODE && (child as HTMLElement).tagName !== 'BR') {
        walk(child);
      }
    }
  };
  walk(el);
  return inners;
}

/** Al terminar el reveal: liberar la máscara y dibujar el subrayado de los <em>. */
function finish(el: HTMLElement): void {
  el.querySelectorAll<HTMLElement>('.w').forEach((w) => {
    w.style.overflow = 'visible';
  });
  el.querySelectorAll('em').forEach((em) => em.classList.add('drawn'));
}

function prepare(el: HTMLElement): HTMLElement[] {
  const words = wrapWords(el);
  gsap.set(words, { yPercent: 110, rotate: 2.5, transformOrigin: '0% 100%' });
  gsap.set(el, { autoAlpha: 1 });
  return words;
}

export function initTextReveal(): void {
  if (reducedMotion) return;

  const h1 = document.querySelector<HTMLElement>('.h1');
  if (h1) {
    const words = prepare(h1);
    gsap.to(words, {
      yPercent: 0,
      rotate: 0,
      duration: 1.05,
      ease: 'expo.out',
      stagger: 0.06,
      delay: 0.25,
      onComplete: () => finish(h1),
    });
  }

  document.querySelectorAll<HTMLElement>('.sec').forEach((sec) => {
    const words = prepare(sec);
    gsap.to(words, {
      yPercent: 0,
      rotate: 0,
      duration: 1,
      ease: 'expo.out',
      stagger: 0.05,
      scrollTrigger: { trigger: sec, start: 'top 85%', once: true },
      onComplete: () => finish(sec),
    });
  });
}
