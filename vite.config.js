import { defineConfig } from 'vite';

// Vite config: use `src` as project root so index.html can stay in src/
export default defineConfig({
  root: 'src',
  base: './',
  server: {
    port: 5173,
  },
  build: {
    outDir: '../dist', // put built files in project root /dist so Tauri can find them
    emptyOutDir: true,
  },
});
