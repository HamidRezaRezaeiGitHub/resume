import { motion } from 'motion/react'
import { ExternalLink } from 'lucide-react'
import { projects } from '@/data/resume'
import { Section } from '@/components/Section'

export function Projects() {
  return (
    <Section
      id="projects"
      eyebrow="Beyond Work"
      title="Personal & open-source"
      description="Products and open-source tools I build outside of my day job."
    >
      <div className="grid gap-6 md:grid-cols-3">
        {projects.map((p, i) => (
          <motion.article
            key={p.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, delay: i * 0.06 }}
            className="flex flex-col rounded-xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-lg font-semibold text-cat-project">
                {p.name}
              </h3>
              {p.stage && (
                <span className="rounded-full border border-cat-project/40 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-cat-project">
                  {p.stage}
                </span>
              )}
            </div>
            <p className="text-xs font-medium text-muted-foreground">
              {p.role}
            </p>

            <p className="mt-3 flex-1 text-sm text-muted-foreground">
              {p.description}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {p.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-secondary-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>

            {p.links && p.links.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-4 border-t border-border pt-4">
                {p.links.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-1 text-sm font-medium text-cat-project underline-offset-4 hover:underline"
                  >
                    {link.label}
                    <ExternalLink className="size-3.5" />
                  </a>
                ))}
              </div>
            )}
          </motion.article>
        ))}
      </div>
    </Section>
  )
}
