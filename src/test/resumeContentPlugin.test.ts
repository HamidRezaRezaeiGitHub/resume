// @vitest-environment node
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { afterEach, describe, expect, it } from 'vitest'
import { build, createServer } from 'vite'
import { resume } from '@/data/resume'
import { resumeContentPlugin } from '../../scripts/resume-content-plugin'

const roots: string[] = []

async function workspace() {
  const root = await mkdtemp(join(tmpdir(), 'resume-content-'))
  roots.push(root)
  const contentFile = pathToFileURL(join(root, 'resume.json'))
  await writeFile(contentFile, JSON.stringify(resume))
  await writeFile(
    join(root, 'index.html'),
    '<html><head><title>__RESUME_TITLE__</title></head><body></body></html>',
  )
  return {
    root,
    contentFile,
    config: {
      root,
      configFile: false as const,
      publicDir: false as const,
      logLevel: 'silent' as const,
      plugins: [resumeContentPlugin(contentFile)],
    },
  }
}

afterEach(async () => {
  await Promise.all(
    roots.splice(0).map((root) => rm(root, { recursive: true, force: true })),
  )
})

describe('resume content build and development integration', () => {
  it('emits current Markdown and discovery files on every build without a public source copy', async () => {
    const { root, contentFile, config } = await workspace()
    await build(config)
    const markdown = await readFile(join(root, 'dist/resume.md'), 'utf8')
    expect(markdown).toContain(`# ${resume.profile.name}`)
    expect(markdown).toContain(resume.experiences[0].bullets![0].text)
    expect(await readFile(join(root, 'dist/llms.txt'), 'utf8')).toContain(
      '(/resume.md)',
    )

    const updated = structuredClone(resume)
    updated.profile.name = 'Updated Person'
    updated.experiences[0].bullets = [
      { id: 'updated-bullet', text: 'New public achievement.' },
    ]
    await writeFile(contentFile, JSON.stringify(updated))
    await build(config)
    const rebuilt = await readFile(join(root, 'dist/resume.md'), 'utf8')
    expect(rebuilt).toContain('# Updated Person')
    expect(rebuilt).toContain('- New public achievement.')
    expect(rebuilt).not.toContain(resume.experiences[0].bullets![0].text)
    expect(await readFile(join(root, 'dist/index.html'), 'utf8')).toContain(
      'Updated Person',
    )
    expect(await readFile(join(root, 'dist/llms.txt'), 'utf8')).toContain(
      '# Updated Person',
    )
    await expect(readFile(join(root, 'public/resume.md'))).rejects.toThrow()
  })

  it('fails the build on invalid content instead of publishing an incomplete resume', async () => {
    const { contentFile, config } = await workspace()
    await writeFile(contentFile, JSON.stringify({ ...resume, skills: [] }))
    await expect(build(config)).rejects.toThrow()
  })

  it('serves current plain text in development, including HEAD requests and query strings', async () => {
    const { contentFile, config } = await workspace()
    const server = await createServer({
      ...config,
      server: { host: '127.0.0.1', port: 0, hmr: false },
    })
    try {
      await server.listen()
      const address = server.httpServer!.address()
      if (!address || typeof address === 'string')
        throw new Error('Expected a local HTTP address')
      const url = `http://127.0.0.1:${address.port}`
      const response = await fetch(`${url}/resume.md?check=1`)
      expect(response.headers.get('content-type')).toBe(
        'text/markdown; charset=utf-8',
      )
      expect(await response.text()).toContain(`# ${resume.profile.name}`)

      const updated = structuredClone(resume)
      updated.profile.summary = 'Fresh content without restarting the server.'
      await writeFile(contentFile, JSON.stringify(updated))
      expect(await (await fetch(`${url}/resume.md`)).text()).toContain(
        updated.profile.summary,
      )

      const head = await fetch(`${url}/resume.md`, { method: 'HEAD' })
      expect(head.status).toBe(200)
      expect(await head.text()).toBe('')
      const index = await fetch(`${url}/llms.txt`)
      expect(index.headers.get('content-type')).toBe(
        'text/plain; charset=utf-8',
      )
      expect(await index.text()).toContain('(/resume.md)')
    } finally {
      await server.close()
    }
  })
})
