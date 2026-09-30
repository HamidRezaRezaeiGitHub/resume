// @vitest-environment node
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { injectPrerender } from '../../scripts/prerender-html.ts'
import { render } from '../entry-server.tsx'
import { resume } from '../data/resume.ts'

const template = readFileSync(
  new URL('../../index.html', import.meta.url),
  'utf8',
)

describe('homepage prerender insertion', () => {
  it('inserts resume content without changing head discovery or client entry', () => {
    const html = injectPrerender(template, render())
    expect(html).toContain(`<div id="root"><div class="site">`)
    expect(html).toContain(resume.profile.name)
    expect(html).toContain(resume.experiences[0]?.bullets?.[0]?.text)
    expect(html).toContain('href="/resume.md"')
    expect(html).toContain('src="/src/main.tsx"')
  })

  it('fails if the built root is missing or duplicated', () => {
    expect(() =>
      injectPrerender(template.replace('id="root"', 'id="app"'), 'content'),
    ).toThrow('Expected exactly one empty root')
    expect(() =>
      injectPrerender(template + '<div id="root"></div>', 'content'),
    ).toThrow('Expected exactly one empty root')
    expect(() => injectPrerender(template, ' ')).toThrow(
      'The server-rendered homepage is empty',
    )
  })
})
