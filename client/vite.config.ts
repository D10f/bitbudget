import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    resolve: {
        alias: {
            '@app': path.resolve(__dirname, 'src/app'),
            '@assets': path.resolve(__dirname, 'src/assets'),
            '@components': path.resolve(__dirname, 'src/components'),
            '@features': path.resolve(__dirname, 'src/features'),
            '@helpers': path.resolve(__dirname, 'src/helpers'),
            '@routes': path.resolve(__dirname, 'src/routes'),
            '@services': path.resolve(__dirname, 'src/services'),
        },
    },
    plugins: [react()],
});
