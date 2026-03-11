import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://camiloayala.com',
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
