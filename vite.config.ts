import { defineConfig } from 'vite';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        port: 8280,
        open: true
    },
    build: {
        lib: {
            entry: resolve(__dirname, 'src/main.ts'),
            name: 'Sinan',
            fileName: (format) => `sinan.${format}.js`
        }
    }
});
