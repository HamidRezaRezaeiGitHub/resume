import path from 'node:path'
import { readFileSync } from 'node:fs'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vitest/config'
import { resumeContentSchema } from './src/data/resume.schema.ts'
import { renderResumeHtml } from './scripts/resume-html.ts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'resume-content-html',
      transformIndexHtml(html) {
        const content = resumeContentSchema.parse(
          JSON.parse(
            readFileSync(
              new URL('./src/data/resume.json', import.meta.url),
              'utf8',
            ),
          ),
        )
        return renderResumeHtml(html, content.profile)
      },
    },
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
  },
})
