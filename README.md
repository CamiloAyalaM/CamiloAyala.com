# camiloayala.com — Astro Edition

> Diseño Estratégico, Marketing & Comunicación Digital
> 
> **Sitio personal de Camilo Ayala Monje construido con Astro**

## 🌐 Características

- ✅ **Completamente estático** — HTML puro, sin servidor
- ✅ **SEO optimizado** — Meta tags dinámicos, schema JSON-LD, Open Graph
- ✅ **Blog integrado** — Posts de LinkedIn en tu sitio
- ✅ **Imágenes optimizadas** — Compresión automática en build
- ✅ **Animations & interactions** — Cursor personalizado, reveal effects, smooth transitions
- ✅ **Responsive design** — Mobile-first, desktop-perfect
- ✅ **Portable** — Funciona en Cloudflare Pages, Vercel, Netlify, Hostinger, etc.
- ✅ **Mantenible** — Componentes reutilizables, datos separados

## 📦 Stack Tecnológico

- **Astro 4.x** — Framework para sitios estáticos
- **TypeScript** — Type safety
- **CSS3** — Animaciones y responsive design
- **Cloudflare Pages** — Deploy automático desde GitHub

## 🚀 Quick Start

### Instalación

```bash
# Clona el repositorio
git clone https://github.com/CamiloAyalaM/CamiloAyala.com.git
cd CamiloAyala.com

# Instala dependencias
npm install

# Arranca servidor de desarrollo
npm run dev
# → Abre http://localhost:3000
```

### Build & Deploy

```bash
# Genera build optimizado
npm run build

# Previsualiza el build
npm run preview

# Push a GitHub
git add .
git commit -m "Update changes"
git push origin main
# → Cloudflare Pages despliega automáticamente
```

## 📁 Estructura del Proyecto

```
src/
├── pages/                    # Rutas automáticas (Astro)
│   ├── index.astro          # Página principal
│   ├── blog.astro           # Listado de artículos
│   └── blog/
│       └── [id].astro       # Artículo individual
├── components/              # Componentes reutilizables
│   ├── Navigation.astro     # Barra de navegación
│   ├── BlogCard.astro       # Tarjeta de artículo
│   └── ...
├── layouts/
│   └── BaseLayout.astro     # Layout principal (SEO, meta tags)
├── data/
│   ├── blog.ts              # Datos de posts
│   └── portfolio.ts         # Datos de proyectos
├── styles/
│   └── global.css           # Estilos globales
└── utils/                   # Utilidades compartidas
public/
├── assets/img/              # Imágenes optimizadas
└── ...
```

## 📝 Agregar Contenido

### Nuevo Post de Blog

Edita `src/data/blog.ts`:

```typescript
export const blogPosts = [
  {
    id: 'mi-nuevo-post',
    title: 'Título del Post',
    date: new Date('2025-03-15'),
    excerpt: 'Resumen corto...',
    content: `Contenido completo del post...`,
    tags: ['IA', 'Diseño'],
    reactions: 500,
    featured: true
  },
  // ... más posts
];
```

El artículo estará disponible en `/blog/mi-nuevo-post`

### Nuevo Proyecto de Portafolio

Edita `src/data/portfolio.ts`:

```typescript
export const portfolioProjects = [
  {
    id: 'nuevo-proyecto',
    title: 'Nombre del Proyecto',
    category: 'Categoría · Subcategoría',
    client: 'Nombre del Cliente',
    description: 'Descripción...',
    metrics: 'Métrica 1 · Métrica 2',
    role: 'Tu rol',
    year: '2025',
    tags: ['tag1', 'tag2'],
    featured: true,
    image: '/assets/img/portfolio-nuevo.jpg'
  },
  // ... más proyectos
];
```

### Nuevas Imágenes

1. **Guarda la imagen** en `public/assets/img/`
2. **Referencia en los datos:**
   ```typescript
   {
     id: 'proyecto',
     image: '/assets/img/mi-imagen.jpg',
     // ...
   }
   ```
3. **Astro las optimiza automáticamente en build**

## 🎯 SEO

Cada página tiene SEO automático:

- ✅ Title y description personalizados
- ✅ Open Graph (Facebook, LinkedIn)
- ✅ Twitter Cards
- ✅ JSON-LD Schema (Datos estructurados)
- ✅ Canonical URLs
- ✅ Mobile-friendly meta tags

### Personalizar SEO por página:

```astro
<BaseLayout
  title="Mi Título | Blog"
  description="Descripción de máx 160 caracteres"
  image="/assets/img/cover.jpg"
  url="https://camiloayala.com/blog/mi-post"
>
```

## 🎨 Personalización de Estilos

### Variables CSS (Design System)

En `src/styles/global.css`:

```css
:root {
  --ink: #0d0b09;           /* Color principal oscuro */
  --cream: #f4f0e8;         /* Fondo claro */
  --gold: #b6903a;          /* Acento dorado */
  --serif: 'Cormorant Garamond', serif;
  --sans: 'Manrope', sans-serif;
  --mono: 'DM Mono', monospace;
}
```

Cambia estos valores para ajustar toda la paleta.

### Animaciones

Todas las animaciones están en `src/styles/global.css`:

```css
@keyframes f-up {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}
```

Úsalas en cualquier componente:

```astro
<style>
  .elemento {
    animation: f-up 0.8s ease 0.2s forwards;
  }
</style>
```

## 📱 Responsive Design

El sitio está optimizado para:
- Mobile (320px)
- Tablet (768px)
- Desktop (1024px+)

Breakpoints principales en el CSS:

```css
@media (max-width: 1024px) { /* Tablet */ }
@media (max-width: 768px) { /* Mobile */ }
```

## 🔗 Integración LinkedIn (Futuro)

El blog actualmente usa datos estáticos. Para **integración automática** con LinkedIn:

### Opción 1: Manual
Actualiza `src/data/blog.ts` cada vez que publiques en LinkedIn.

### Opción 2: Automático con n8n (Avanzado)

```
LinkedIn API
    ↓
n8n Workflow (cada 6h)
    ↓
Cloudflare KV
    ↓
Astro fetch + build
    ↓
Blog actualizado automáticamente
```

Instrucciones en `ASTRO_GUIDE.md`

## 🚢 Deploy

### Cloudflare Pages (Recomendado)

1. **Conecta tu repositorio GitHub**
2. **En Cloudflare Pages:**
   - Build command: `npm run build`
   - Build output directory: `dist`
3. **Listo** — Deploy automático en cada push a `main`

### Otras opciones

**Vercel:**
```bash
npm i -g vercel
vercel
```

**Netlify:**
- Conecta tu repositorio en netlify.com
- Build command: `npm run build`
- Publish directory: `dist`

**Hostinger (FTP):**
```bash
npm run build
# Sube la carpeta `/dist` vía FTP
```

## 📊 Rendimiento

Astro genera sitios **extremadamente rápidos**:

- Páginas estáticas = sin procesamiento del servidor
- Zero JavaScript innecesario
- Imágenes optimizadas automáticamente
- Crítica CSS inlined

**Esperado:**
- LCP: < 1.5s
- FID: < 100ms
- CLS: < 0.1

Verifica con [PageSpeed Insights](https://pagespeed.web.dev)

## 🛠️ Desarrollo

### Archivos Importantes

| Archivo | Propósito |
|---------|-----------|
| `src/pages/index.astro` | Página principal |
| `src/layouts/BaseLayout.astro` | Template con SEO |
| `src/data/blog.ts` | Contenido del blog |
| `src/data/portfolio.ts` | Proyectos y servicios |
| `src/styles/global.css` | Estilos globales |
| `astro.config.mjs` | Configuración de Astro |

### Comandos Útiles

```bash
npm run dev      # Desarrollo con hot reload
npm run build    # Build optimizado
npm run preview  # Previsualiza el build
npm run astro -- --help  # Ayuda de Astro
```

## 📚 Documentación Adicional

- **[ASTRO_GUIDE.md](./ASTRO_GUIDE.md)** — Guía completa de características
- **[MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)** — Cómo migrar de HTML
- **[Docs de Astro](https://docs.astro.build)** — Documentación oficial

## 🤝 Contribuciones

Este sitio es personal pero funciona como base para aprender Astro. 

Para cambios:
1. Crea una rama (`git checkout -b feature/mejora`)
2. Haz tus cambios
3. Push y abre un PR

## 📧 Contacto

- **LinkedIn:** [@camiloayalam](https://linkedin.com/in/camiloayalam)
- **Email:** camiloayalamonje@gmail.com
- **Behance:** [camiloayala](https://behance.net/camiloayala)

## 📄 Licencia

Este proyecto es código abierto bajo licencia MIT. Úsalo libremente como base para tu propio sitio.

---

**Construido con ❤️ en Bogotá, Colombia**

**Stack:** Astro + Cloudflare Pages + TypeScript

**Deploy Status:** [![Cloudflare Pages](https://img.shields.io/badge/Deploy-Active-brightgreen)](https://camiloayala.com)

**Last Updated:** March 2025
