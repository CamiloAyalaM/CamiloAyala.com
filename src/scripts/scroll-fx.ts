/**
 * Scroll rico (estética limpia): scroll-spy del nav y marquee de
 * instituciones reactivo a la velocidad de scroll.
 */
import { gsap, lenis, ScrollTrigger, reducedMotion } from './motion';

export function initScrollFx(): void {
  if (reducedMotion) return;
  initScrollSpy();
  initMarquee();
}

/** Resalta en el nav el enlace de la sección dominante. */
function initScrollSpy(): void {
  const links = new Map<string, HTMLAnchorElement>();
  document
    .querySelectorAll<HTMLAnchorElement>('#nav .nav-links a[href^="#"]')
    .forEach((a) => links.set(a.getAttribute('href')!.slice(1), a));

  links.forEach((link, id) => {
    const section = document.getElementById(id);
    if (!section) return;
    ScrollTrigger.create({
      trigger: section,
      start: 'top 45%',
      end: 'bottom 45%',
      onToggle: (self) => {
        if (self.isActive) {
          links.forEach((l) => l.classList.remove('active'));
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      },
    });
  });
}

/** El marquee de skills responde a la velocidad de scroll (lenis.velocity). */
function initMarquee(): void {
  const track = document.querySelector<HTMLElement>('.mq-track');
  if (!track || !lenis) return;
  track.style.animation = 'none';

  let x = 0;
  let vel = 0;
  const BASE_SPEED = 55; // px/s — cinta institucional en mono compacto

  gsap.ticker.add((_time, deltaTime) => {
    const dt = deltaTime / 1000;
    const target = Math.max(-50, Math.min(50, lenis!.velocity || 0));
    vel += (target - vel) * 0.07;
    x -= (BASE_SPEED + vel * 2.2) * dt;
    const half = track.scrollWidth / 2;
    if (half > 0) {
      x = (((x % half) + half) % half) - half;
    }
    track.style.transform = `translate3d(${x}px,0,0)`;
  });
}
