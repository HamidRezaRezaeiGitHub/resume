import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { resume } from '@/data/resume'
import { resumeEditorSchema } from '../../scripts/content-schema'
import { renderResumeHtml } from '../../scripts/resume-html'

describe('content tooling', () => {
  it('keeps editor hints generated from the authoritative validation schema', () => {
    const schema = JSON.parse(
      readFileSync(
        resolve(import.meta.dirname, '../../schema/resume.schema.json'),
        'utf8',
      ),
    )
    expect(schema).toEqual(resumeEditorSchema())
  })

  it('updates HTML metadata and fallback contact from content, escaping markup safely', () => {
    const template = readFileSync(
      resolve(import.meta.dirname, '../../index.html'),
      'utf8',
    )
    const profile = {
      ...resume.profile,
      name: 'Example <Person> & Co.',
      headline: 'Engineer "&" Builder',
      summary: 'Builds $& systems. <img src=x onerror="alert(1)">',
      email: 'new-address@example.com',
    }
    const html = renderResumeHtml(template, profile)
    const page = new DOMParser().parseFromString(html, 'text/html')
    expect(page.title).toBe(`${profile.name} — ${profile.headline}`)
    expect(
      page.querySelector('meta[property="og:title"]')?.getAttribute('content'),
    ).toBe(page.title)
    for (const selector of [
      'meta[name="description"]',
      'meta[property="og:description"]',
    ])
      expect(page.querySelector(selector)?.getAttribute('content')).toBe(
        profile.summary,
      )
    expect(page.querySelector('noscript')?.textContent).toContain(profile.name)
    expect(page.querySelector('noscript a')?.getAttribute('href')).toBe(
      `mailto:${profile.email}`,
    )
    expect(page.querySelector('img')).toBeNull()
    expect(html).not.toContain('__RESUME_')
  })
})
