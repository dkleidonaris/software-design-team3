import {
  defineConfig
} from 'vite';

// Εδώ μπορείς να προσαρμόσεις routes, root dir, κ.λπ.
export default defineConfig({
  root: '.',
  publicDir: 'public',

  build: {
    outDir: 'dist',
    emptyOutDir: true, // καθαρίζει το dist πριν το build
  },

  server: {
    port: 5173,
    open: true, // ανοίγει browser αυτόματα
    watch: {
      usePolling: true // αν σε Linux/WSL έχεις πρόβλημα με file change detection
    }
  },

  preview: {
    port: 4173,
    open: true
  }
});
