import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://camiloayala.com',
  build: {
    inlineStylesheets: 'always',
  },
  vite: {
    ssr: {
      external: ['sharp']
    }
  },
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },
});
