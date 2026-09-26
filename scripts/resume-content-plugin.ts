import { readFileSync } from 'node:fs'
import type { Plugin } from 'vite'
import { resumeContentSchema } from '../src/data/resume.schema.ts'
import { renderResumeHtml } from './resume-html.ts'
import { renderLlmsIndex, renderResumeMarkdown } from './resume-markdown.ts'

export function resumeContentPlugin(contentFile: URL): Plugin {
  const readContent = () =>
    resumeContentSchema.parse(JSON.parse(readFileSync(contentFile, 'utf8')))

  const documents = [
    {
      fileName: 'resume.md',
      type: 'text/markdown',
      render: renderResumeMarkdown,
    },
    { fileName: 'llms.txt', type: 'text/plain', render: renderLlmsIndex },
  ]

  return {
    name: 'resume-content',
    transformIndexHtml(html) {
      return renderResumeHtml(html, readContent().profile)
    },
    generateBundle() {
      const content = readContent()
      for (const document of documents)
        this.emitFile({
          type: 'asset',
          fileName: document.fileName,
          source: document.render(content),
        })
    },
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        const pathname = request.url?.split('?')[0]
        const document = documents.find(
          (item) => `/${item.fileName}` === pathname,
        )
        if (!document || !['GET', 'HEAD'].includes(request.method ?? ''))
          return next()

        try {
          // Re-read on each request so edits are visible without restarting Vite.
          const body = document.render(readContent())
          response.setHeader('Content-Type', `${document.type}; charset=utf-8`)
          response.setHeader('Cache-Control', 'no-cache')
          response.end(request.method === 'HEAD' ? undefined : body)
        } catch (error) {
          next(error)
        }
      })
    },
  }
}
