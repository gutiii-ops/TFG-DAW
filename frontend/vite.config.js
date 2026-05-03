import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgrd from 'vite-plugin-svgr';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgrd()],
});
