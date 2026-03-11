# Guía Rápida de Migración: HTML → Astro

## ¿Qué cambió?

Tu sitio ahora es **mucho más mantenible**:

### Antes (HTML monolítico)
```
camiloayala-v11.html  (640KB, 1 archivo gigante)
├── Todos los estilos inline
├── Todo el HTML mezclado
└── JavaScript al final
```

### Ahora (Astro modular)
```
src/
├── pages/           (Rutas automáticas)
├── components/      (Piezas reutilizables)
├── layouts/         (Templates)
├── data/           (Contenido separado)
└── styles/         (CSS global)
```

## Migración Paso a Paso

### Paso 1: Extraer HTML del index

Tu `camiloayala-v11.html` tiene toda la estructura. Necesitamos dividirla:

**Secciones a extraer:**
1. Navigation (ya está en `src/components/Navigation.astro`)
2. Hero
3. Marquee
4. Highlights
5. About
6. Education
7. Portfolio
8. Clients
9. Blog (NUEVA)
10. Services
11. CTA
12. Footer

### Paso 2: Crear `src/pages/index.astro`

Básicamente, tu HTML va a ser así:

```astro
---
// TypeScript imports
import BaseLayout from '../layouts/BaseLayout.astro';
import Navigation from '../components/Navigation.astro';
import { portfolioProjects } from '../data/portfolio';

// Datos
const projects = portfolioProjects.filter(p => p.featured);
---

<BaseLayout title="..." description="...">
  <Navigation />
  
  <!-- Hero section HTML -->
  <section class="hero">
    ...
  </section>
  
  <!-- Marquee section HTML -->
  <div class="mq-wrap">
    ...
  </div>
  
  <!-- Etc. -->
  
  <style is:global>
    /* Todos tus estilos CSS aquí */
  </style>
</BaseLayout>
```

### Paso 3: Crear `src/pages/blog.astro`

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Navigation from '../components/Navigation.astro';
import BlogCard from '../components/BlogCard.astro';
import { getAllPosts } from '../data/blog';

const allPosts = getAllPosts();
---

<BaseLayout title="Blog — Camilo Ayala" description="Artículos sobre diseño y tecnología">
  <Navigation />
  <section class="li-sec">
    <h1>Blog</h1>
    <div class="li-grid">
      {allPosts.map(post => <BlogCard {...post} />)}
    </div>
  </section>
</BaseLayout>
```

### Paso 4: Crear `src/pages/blog/[id].astro`

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import Navigation from '../../components/Navigation.astro';
import { getPostById, getAllPosts } from '../../data/blog';

export function getStaticPaths() {
  return getAllPosts().map(post => ({
    params: { id: post.id },
    props: { post }
  }));
}

const { post } = Astro.props;
---

<BaseLayout title={post.title} description={post.excerpt}>
  <Navigation />
  <article class="post">
    <h1>{post.title}</h1>
    <div class="post-meta">
      <time>{post.date.toLocaleDateString('es-ES')}</time>
      <span>{post.tags.join(', ')}</span>
    </div>
    <div class="post-content" set:html={post.content}></div>
  </article>
</BaseLayout>
```

## Integración de Imágenes Reales

### Portfolio Images

En `src/data/portfolio.ts`, cada proyecto necesita:

```typescript
{
  id: 'marriott-rewards',
  title: 'Marriott Rewards',
  image: '/assets/img/portfolio-marriott.jpg',  // ← AQUÍ
  // ...
}
```

**Cómo agregar:**

1. **Guarda tus imágenes** en `public/assets/img/`:
   - `portfolio-marriott.jpg`
   - `portfolio-durero.jpg`
   - `portfolio-modulario.jpg`
   - etc.

2. **En el HTML**, úsalas así:

```astro
{portfolioProjects.map((project) => (
  <div class="pc">
    <div class="pc-vis">
      <img src={project.image} alt={project.title} />
    </div>
    <div class="pc-desc">
      <h3>{project.title}</h3>
      <p>{project.description}</p>
    </div>
  </div>
))}
```

## Blog con Posts de LinkedIn

### Opción A: Manual (lo recomendado para empezar)

Tu archivo `src/data/blog.ts` ya tiene 5 posts de ejemplo. Para agregar más:

```typescript
export const blogPosts = [
  {
    id: 'mi-nuevo-post',
    title: 'Título del post',
    date: new Date('2025-03-15'),
    excerpt: 'Resumen corto (1-2 líneas)',
    content: `Contenido completo del post en markdown...`,
    tags: ['IA', 'Diseño'],
    reactions: 500,
    featured: true  // Solo para destacados
  },
  // ... más posts
];
```

### Opción B: Automatizado con n8n (después)

Cuando quieras integración en tiempo real:

1. **Workflow en n8n:**
   - Lee LinkedIn API cada 6 horas
   - Convierte posts a formato JSON
   - Guarda en Cloudflare KV

2. **En Astro:**
   - Fetch desde KV en build time
   - Genera páginas estáticas

## SEO Meta Tags

### Por página (automático):

```astro
---
// src/pages/blog/[id].astro
const { post } = Astro.props;
---

<BaseLayout
  title={`${post.title} — Blog`}
  description={post.excerpt}
  image={post.image || '/assets/img/default.jpg'}
>
```

### Resultado:
```html
<title>Mi Artículo — Blog</title>
<meta name="description" content="Resumen del artículo...">
<meta property="og:title" content="Mi Artículo — Blog">
<meta property="og:description" content="Resumen...">
<meta property="og:image" content="...">
<meta name="twitter:card" content="summary_large_image">
<!-- etc. -->
```

## Animaciones & Estilos

Tus animaciones CSS están en `src/styles/global.css`:

```css
@keyframes f-up {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

Úsalas en cualquier componente:

```astro
<style>
  .section {
    animation: f-up 0.8s ease 0.2s forwards;
  }
</style>
```

## Testing Local

```bash
# Instala primero
npm install

# Arranca servidor de desarrollo
npm run dev
# → http://localhost:3000

# Genera build
npm run build
# → Verifica la carpeta /dist

# Previsualiza el build
npm run preview
```

## Deploy a Cloudflare Pages

### 1. Push a GitHub
```bash
git add .
git commit -m "Convert to Astro"
git push origin main
```

### 2. En dashboard de Cloudflare Pages:
- Conecta tu repositorio
- Build command: `npm run build`
- Build output: `dist`
- ✅ Listo

Cada push a `main` genera un deploy automático.

## Checklist de Completitud

- [ ] Copiar estructura HTML de v11.html a index.astro
- [ ] Crear blog.astro
- [ ] Crear blog/[id].astro
- [ ] Copiar imágenes a public/assets/img/
- [ ] Actualizar src/data/blog.ts con tus posts reales
- [ ] Actualizar src/data/portfolio.ts con imágenes
- [ ] Test local: `npm run dev`
- [ ] Build: `npm run build`
- [ ] Deploy a Cloudflare Pages
- [ ] Verificar camiloayala.com en navegador
- [ ] Revisar Core Web Vitals en PageSpeed

## Ventajas Logradas ✅

| Aspecto | HTML | Astro |
|--------|------|-------|
| Tamaño archivo | 640KB | ~50KB HTML |
| Mantenibilidad | Difícil | Fácil |
| Reutilización | No | Sí (componentes) |
| SEO | Manual | Automático |
| Portabilidad | Limitada | Total |
| Performance | Bueno | Excelente |
| Blog dinámico | No | Sí |
| Escalabilidad | Mala | Excelente |

---

**¿Preguntas? Mira ASTRO_GUIDE.md para más detalles.**
