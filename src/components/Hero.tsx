import { motion } from 'motion/react'
import { ArrowDown } from 'lucide-react'
import { profile } from '@/data/resume'

export function Hero() {
  return (
    <section className="relative flex min-h-svh flex-col items-center justify-center px-6 text-center">
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-muted-foreground"
      >
        {profile.headline}
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="max-w-4xl text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl"
      >
        {profile.name}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-6 max-w-2xl text-balance text-lg text-muted-foreground"
      >
        {profile.tagline}
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.35 }}
        className="mt-8 flex flex-wrap items-center justify-center gap-3"
      >
        {profile.links.map((link) => (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noreferrer noopener"
            className="rounded-full border border-border px-5 py-2 text-sm font-medium transition-colors hover:bg-accent"
          >
            {link.label}
          </a>
        ))}
      </motion.div>

      <motion.a
        href="#timeline"
        aria-label="Scroll to timeline"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="absolute bottom-10 text-muted-foreground"
      >
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          className="block"
        >
          <ArrowDown className="size-6" />
        </motion.span>
      </motion.a>
    </section>
  )
}
