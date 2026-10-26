import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],

  base: '/',

  build: {
    outDir: 'dist',

    // Do not publish source maps with production assets.
    sourcemap: false,

    // Keep Vite 8's default production minifier.
    minify: true,

    // Separate vendor libraries from application code.
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'react-vendor',
              test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/,
            },
            {
              name: 'animation-vendor',
              test: /node_modules[\\/](gsap|@gsap|lenis)[\\/]/,
            },
          ],
        },
      },
    },
  },
})