import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { splitVendorChunkPlugin } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), splitVendorChunkPlugin()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  define: {
    'process.env.GROQ_API_KEY': JSON.stringify('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')
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Group React dependencies together
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          
          // Group PDF/DOCX generation dependencies
          'vendor-document': ['jspdf', 'docx', 'file-saver'],
          
          // Group UI components and utilities
          'vendor-ui': ['react-hot-toast', 'lucide-react'],
          
          // Separate large third-party libraries
          'vendor-groq': ['groq-sdk'],
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Increase limit to 1000kb if needed
  }
})
