import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' lets the built site work from any sub-path, e.g. GitHub Pages at /natalies-calendar/
export default defineConfig({
  plugins: [react()],
  base: './',
});
