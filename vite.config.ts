import { defineConfig } from 'vite';

export default defineConfig({
  base: '/botarena/',
  server: { port: 5173, host: true },
  build: {
    target: 'es2022',
    sourcemap: true,
  },
  optimizeDeps: {
    exclude: ['@dimforge/rapier3d-compat'],
  },
});
