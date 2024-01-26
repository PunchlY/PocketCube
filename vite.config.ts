import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
    build: {
        sourcemap: true,
        lib: {
            entry: resolve('src/rubik.ts'),
            formats: ['es', 'cjs'],
            fileName: 'index',
        },
        rollupOptions: {
            external: ['magic-string', 'estree-walker'],
        },
    },
    resolve: {
        alias: {
            'solvedata.json': './src/solve/de.ts',
            'solvedata.min.json': './solvedata.min.json',
        },
    },
    plugins: [dts({ rollupTypes: true })],
});
