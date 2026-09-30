// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { render } from './entry-server'
import { resume } from './data/resume'

describe('server-rendered resume', () => {
  it('renders the content without browser globals', () => {
    const html = render()
    expect(html).toContain(resume.profile.name)
    expect(html).toContain(resume.sections.experience.title)
    expect(html).toContain(
      resume.experiences[0]?.bullets?.[0]?.text ?? 'Missing experience bullet',
    )
    expect(html).toContain(resume.sections.skills.title)
    expect(html).toContain(resume.sections.education.title)
  })
})
