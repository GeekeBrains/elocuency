import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import { join } from 'path';

export default defineConfig({
  root: __dirname,
  cacheDir: 'dist/',
  publicDir: '/src',
  plugins: [react(), nxViteTsPaths(), nxCopyAssetsPlugin(['*.md'])],

  build: {
    outDir: join(__dirname, 'dist/'),
    sourcemap: true,
    emptyOutDir: true, // Borra el contenido de la carpeta de salida en cada build
  },
  server: {
    port: 4200,
  },

  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },

  test: {
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: 'dist/',
      provider: 'v8',
    },
  },
});
