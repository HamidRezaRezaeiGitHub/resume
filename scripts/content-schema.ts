import { mkdirSync, writeFileSync } from 'node:fs'
import { format } from 'prettier'
import { z } from 'zod'
import { resumeContentSchema } from '../src/data/resume.schema.ts'

export function resumeEditorSchema() {
  return {
    ...z.toJSONSchema(resumeContentSchema, { target: 'draft-07', io: 'input' }),
    title: 'Resume content',
    description:
      'Generated from src/data/resume.schema.ts. Editor hints cover structure; npm run validate:content also checks dates, IDs, relationships and PDF assets.',
  }
}

if (import.meta.main) {
  const directory = new URL('../schema/', import.meta.url)
  mkdirSync(directory, { recursive: true })
  writeFileSync(
    new URL('resume.schema.json', directory),
    await format(JSON.stringify(resumeEditorSchema()), { parser: 'json' }),
  )
}
