/**
 * Scroll rico: barra de progreso de lectura, scroll-spy del nav,
 * morphing de fondo entre bloques oscuro/claro existentes y marquee
 * de skills reactivo a la velocidad de scroll.
 */
import { gsap, ScrollTrigger, lenis, reducedMotion } from './motion';

export function initScrollFx(): void {
  if (reducedMotion) return;
  initProgressBar();
  initScrollSpy();
  initBgMorph();
  initMarquee();
  initGhosts();
}

/** Parallax sutil de las palabras fantasma de fondo. */
function initGhosts(): void {
  document.querySelectorAll<HTMLElement>('.ghost').forEach((ghost) => {
    gsap.fromTo(
      ghost,
      { yPercent: 22 },
      {
        yPercent: -22,
        ease: 'none',
        scrollTrigger: {
          trigger: ghost.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      }
    );
  });
}

/** Hairline dorada fija arriba (2px) con scaleX scrubbed. */
function initProgressBar(): void {
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);
  gsap.fromTo(
    bar,
    { scaleX: 0 },
    {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: { start: 0, end: 'max', scrub: 0.3 },
    }
  );
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

/**
 * Morphing del fondo del body en la transición oscuro→claro existente
 * (servicios sobre --ink → sobre mí sobre --cream). Las secciones claras
 * son transparentes y dejan ver el body, cuyo color se interpola.
 */
function initBgMorph(): void {
  const about = document.querySelector('.about-sec');
  if (!about) return;
  gsap.fromTo(
    document.body,
    { backgroundColor: '#0d0b09' },
    {
      backgroundColor: '#f4f0e8',
      ease: 'none',
      scrollTrigger: {
        trigger: about,
        start: 'top bottom',
        end: 'top 55%',
        scrub: true,
      },
    }
  );
}

/** El marquee de skills responde a la velocidad de scroll (lenis.velocity). */
function initMarquee(): void {
  const track = document.querySelector<HTMLElement>('.mq-track');
  if (!track || !lenis) return;
  track.style.animation = 'none';

  let x = 0;
  let vel = 0;
  const BASE_SPEED = 80; // px/s — proporcional al nuevo cuerpo display del marquee

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
