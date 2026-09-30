import { readFile, writeFile } from 'node:fs/promises'
import { injectPrerender } from './prerender-html.ts'

const htmlPath = new URL('../dist/index.html', import.meta.url)
const serverEntry = new URL('../dist-ssr/entry-server.js', import.meta.url)
const { render } = (await import(serverEntry.href)) as { render: () => string }

const html = await readFile(htmlPath, 'utf8')
await writeFile(htmlPath, injectPrerender(html, render()))

console.log('Prerendered the resume into dist/index.html')
