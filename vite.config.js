import { defineConfig } from 'vite'
import { copyFileSync } from 'fs'
import { resolve } from 'path'

export default defineConfig({
  root: './lpsite',
  base: './',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'lpsite/index.html'),
        'recent-articles': resolve(__dirname, 'lpsite/recent-articles.html')
      },
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js'
      }
    }
  },
  server: {
    port: 3000,
    host: true
  },
  plugins: [
    {
      name: 'copy-cname',
      writeBundle() {
        try {
          copyFileSync(
            resolve(__dirname, 'lpsite/CNAME'),
            resolve(__dirname, 'dist/CNAME')
          )
          console.log('CNAME file copied to dist directory')
        } catch (error) {
          console.warn('Could not copy CNAME file:', error.message)
        }
      }
    }
  ]
})