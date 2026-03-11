# Astro Conversion Guide: camiloayala.com

## 📋 Estructura del Proyecto Astro

Este es tu nuevo sitio en Astro — completamente modular, portable y optimizado para SEO.

```
camiloayala-astro/
├── src/
│   ├── pages/
│   │   ├── index.astro          # Página principal
│   │   ├── blog.astro           # Página de blog
│   │   └── blog/[id].astro      # Página individual de artículos
│   ├── components/
│   │   ├── Navigation.astro     # Navegación fija
│   │   ├── BlogCard.astro       # Tarjeta de artículo
│   │   └── (más componentes)
│   ├── layouts/
│   │   └── BaseLayout.astro     # Layout base con SEO
│   ├── data/
│   │   ├── blog.ts              # Datos de artículos
│   │   └── portfolio.ts         # Datos de proyectos
│   └── styles/
│       └── global.css           # Estilos globales
├── public/
│   └── assets/img/              # Imágenes (logos, fotos)
├── astro.config.mjs             # Configuración de Astro
├── package.json
└── tsconfig.json
```

## 🚀 Próximos Pasos

### 1. **Crear el archivo index.astro**

El archivo principal ya está listo en tu repositorio. Simplemente cópialo o usa la estructura que proporcionamos.

**Puntos clave:**
- Hero section con animaciones
- Sección de blog con posts de LinkedIn
- Portafolio con proyectos
- Servicios y CTA
- Footer

### 2. **Crear la página de Blog**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Navigation from '../components/Navigation.astro';
import BlogCard from '../components/BlogCard.astro';
import { getAllPosts } from '../data/blog';

const allPosts = getAllPosts();
---

<BaseLayout
  title="Blog — Camilo Ayala Monje"
  description="Reflexiones sobre diseño estratégico, educación, tecnología e IA."
>
  <Navigation />
  <section class="blog-section">
    <h1>Últimas publicaciones</h1>
    <div class="blog-grid">
      {allPosts.map((post) => (
        <BlogCard {...post} />
      ))}
    </div>
  </section>
</BaseLayout>
```

### 3. **Crear página individual de artículos**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import Navigation from '../../components/Navigation.astro';
import { getPostById, getAllPosts } from '../../data/blog';

export function getStaticPaths() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    params: { id: post.id },
    props: { post },
  }));
}

const { post } = Astro.props;
---

<BaseLayout
  title={post.title}
  description={post.excerpt}
>
  <Navigation />
  <article class="post">
    <h1>{post.title}</h1>
    <div class="post-meta">
      <time>{post.date.toLocaleDateString('es-ES')}</time>
    </div>
    <div class="post-content" set:html={post.content}></div>
  </article>
</BaseLayout>
```

## 📊 SEO Optimización

Tu sitio Astro incluye:

✅ **Meta tags dinámicos** — Cada página genera su propio `<title>`, `<description>`, OG tags
✅ **JSON-LD Schema** — Datos estructurados para Google
✅ **Canonical URLs** — Evita duplicados
✅ **Open Graph** — Mejor vista en redes sociales
✅ **Twitter Cards** — Previsualizaciones en Twitter/X

### Cómo personalizar SEO por página:

```astro
---
const post = getPostById('mi-articulo');
---

<BaseLayout
  title={`${post.title} — Blog`}
  description={post.excerpt}
  image={post.image}
>
  <!-- Contenido -->
</BaseLayout>
```

## 🎨 Integrando Imágenes Reales del Portafolio

En tu `src/data/portfolio.ts`, cada proyecto tiene un campo `image`:

```typescript
{
  id: 'marriott-rewards',
  title: 'Marriott Rewards',
  image: '/assets/img/portfolio-marriott.jpg',
  // ...
}
```

**Pasos para integrar:**

1. **Guarda tus imágenes** en `public/assets/img/`
2. **Usa el campo `image`** en las tarjetas del portafolio:

```astro
{portfolioProjects.map((project) => (
  <div class="pc">
    <img src={project.image} alt={project.title} />
    <!-- Resto del contenido -->
  </div>
))}
```

3. **Optimización automática** — Astro comprime imágenes automáticamente en build

## 🔗 LinkedIn Integration (Blog)

Tu blog está alimentado por datos estáticos en `src/data/blog.ts`. Para **actualizar automáticamente** desde LinkedIn:

### Opción A: Manual (semanal)
Simplemente edita `src/data/blog.ts` con nuevos posts.

### Opción B: n8n + Cloudflare KV (automatizado)

1. **Configura un workflow en n8n** que:
   - Lee tus posts recientes de LinkedIn (API)
   - Los transforma a formato JSON
   - Los guarda en Cloudflare KV

2. **En Astro**, fetch desde KV en build time:

```astro
---
const posts = await fetch('https://api.cloudflare.com/client/v4/accounts/.../kv/namespaces/.../values/blog-posts')
  .then(r => r.json());
---
```

## 🚢 Deploy en Cloudflare Pages

### 1. **Conecta tu repositorio GitHub**

```bash
# En tu repo
git add .
git commit -m "Convert to Astro"
git push origin main
```

### 2. **En Cloudflare Pages:**
- Conecta tu repo CamiloAyalaM/CamiloAyala.com
- Build command: `npm run build`
- Build output directory: `dist`
- Environment: Automático

### 3. **Cada push a `main` genera un deploy automático**

## 📦 Instalación Local

```bash
# Instala dependencias
npm install

# Desarrollo (hot reload)
npm run dev

# Build para producción
npm run build

# Previsualiza el build
npm run preview
```

## ✨ Características Incluidas

✅ **Animaciones suaves** — Fade-ins, scroll reveals, transiciones
✅ **Cursor personalizado** — Anillo seguidor con efecto smooth
✅ **Responsive design** — Móvil, tablet, desktop
✅ **Performance** — Astro genera HTML estático (sin JavaScript innecesario)
✅ **SEO first** — Meta tags, schema, Open Graph automáticos
✅ **Accesibilidad** — Semántica HTML correcta
✅ **Modularidad** — Componentes reutilizables y fáciles de mantener

## 🔄 Portabilidad

Una de las mayores ventajas de Astro:

- **`npm run build`** genera una carpeta `/dist` con HTML/CSS/JS puro
- Esa carpeta puede ir en:
  - Cloudflare Pages ✅
  - Vercel
  - Netlify
  - Hostinger (FTP)
  - Cualquier servidor estático

No hay dependencias del servidor, no hay Node.js necesario en producción.

## 📝 Mantenimiento

### Agregar un nuevo post de blog:

```typescript
// En src/data/blog.ts
export const blogPosts = [
  {
    id: 'nuevo-post',
    title: 'Mi nuevo artículo',
    date: new Date('2025-03-15'),
    excerpt: 'Resumen...',
    content: 'Contenido completo...',
    tags: ['tag1', 'tag2'],
    reactions: 100,
    featured: true
  },
  // ... resto de posts
];
```

### Actualizar proyecto de portafolio:

```typescript
// En src/data/portfolio.ts
export const portfolioProjects = [
  {
    id: 'nuevo-proyecto',
    title: 'Nombre del proyecto',
    image: '/assets/img/portfolio-nuevo.jpg',
    // ... resto de campos
  }
];
```

## 🎯 Checklist Final

- [ ] Copiar `camiloayala-v11.html` y extraer componentes HTML
- [ ] Crear `src/pages/index.astro` con toda la estructura
- [ ] Crear `src/pages/blog.astro` para página de blog
- [ ] Crear `src/pages/blog/[id].astro` para artículos individuales
- [ ] Agregar imágenes reales en `public/assets/img/`
- [ ] Actualizar `src/data/blog.ts` con posts reales de LinkedIn
- [ ] Ejecutar `npm run build` y verificar `/dist`
- [ ] Conectar a Cloudflare Pages
- [ ] Probar en producción
- [ ] Agregar scripts de Google Analytics (opcional)

## 💬 Soporte

Si necesitas:
- Agregar más componentes
- Personalizar animaciones
- Integrar con APIs
- Optimizar performance

Abre un issue o avísame. Astro es muy flexible y podemos iterar rápidamente.

---

**Tu nuevo sitio está listo para crecer. Welcome to Astro! 🚀**
