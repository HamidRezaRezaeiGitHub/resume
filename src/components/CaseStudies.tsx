import { motion } from 'motion/react'
import { resume } from '@/data/resume'
import { Section } from '@/components/Section'

export function CaseStudies() {
  return (
    <Section
      id="work"
      eyebrow={resume.sections.caseStudies.eyebrow}
      title={resume.sections.caseStudies.title}
      description={resume.sections.caseStudies.description}
    >
      <div className="grid gap-6 md:grid-cols-2">
        {resume.caseStudies.map((cs, i) => (
          <motion.article
            key={cs.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, delay: (i % 2) * 0.05 }}
            className="flex flex-col rounded-xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-cat-experience">
              {cs.context}
            </p>
            <h3 className="mt-2 text-lg font-semibold">{cs.title}</h3>
            <p className="mt-3 text-sm text-muted-foreground">
              {cs.description}
            </p>

            {cs.highlights && cs.highlights.length > 0 && (
              <ul className="mt-4 space-y-2">
                {cs.highlights.map((h) => (
                  <li
                    key={h}
                    className="flex gap-2 text-sm text-muted-foreground"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-2 size-1.5 shrink-0 rounded-full bg-cat-experience"
                    />
                    {h}
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-4">
              {cs.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-secondary-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.article>
        ))}
      </div>
    </Section>
  )
}
