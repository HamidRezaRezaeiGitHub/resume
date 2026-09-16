import { motion } from 'motion/react'
import { Check } from 'lucide-react'
import { about } from '@/data/resume'
import { Section } from '@/components/Section'

export function About() {
  return (
    <Section id="about" eyebrow="About" title="Who I am">
      <div className="grid gap-10 md:grid-cols-[1.2fr_1fr]">
        <p className="text-lg leading-relaxed text-muted-foreground">
          {about.intro}
        </p>
        <ul className="space-y-3">
          {about.themes.map((theme, i) => (
            <motion.li
              key={theme}
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="flex items-start gap-3"
            >
              <Check className="mt-0.5 size-5 shrink-0 text-cat-project" />
              <span className="text-sm text-foreground">{theme}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
