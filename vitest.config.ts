import { defineConfig } from 'vitest/config';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  resolve: {
    alias: {
      '@config': fileURLToPath(new URL('./src/app/config', import.meta.url)),
      '@core': fileURLToPath(new URL('./src/app/core', import.meta.url)),
      '@shared': fileURLToPath(new URL('./src/app/shared', import.meta.url)),
      '@features': fileURLToPath(
        new URL('./src/app/features', import.meta.url),
      ),
      '@components': fileURLToPath(
        new URL('./src/app/shared/components', import.meta.url),
      ),
      '@services': fileURLToPath(new URL('./src/app/core/services', import.meta.url)),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test-setup.ts',
    include: ['src/**/*.spec.ts'],
  },
});
