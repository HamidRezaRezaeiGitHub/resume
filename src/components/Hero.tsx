import { useRef } from 'react'
import { ArrowDown, ArrowDownRight, ArrowUpRight, Asterisk } from 'lucide-react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { resume } from '@/data/resume'

function SystemVisual() {
  return (
    <div className="system-visual" aria-hidden="true">
      <div className="system-caption mono">
        <span className="status-dot" /> CONNECTING THE DOTS
      </div>
      <div className="system-orbits">
        <div className="orbit orbit-one" />
        <div className="orbit orbit-two" />
        <div className="orbit orbit-three" />
        <div className="orbit-cross cross-x" />
        <div className="orbit-cross cross-y" />
      </div>
      <div className="system-core">
        <Asterisk strokeWidth={1.1} />
        <span className="mono">MAKE IT WORK.</span>
      </div>
      {resume.hero.technologies.map((tech, i) => (
        <span key={tech} className={`floating-tech floating-tech-${i}`}>
          {tech}
          <span className="tech-dot" />
        </span>
      ))}
      <span className="visual-coordinate mono">
        SYSTEMS / INTERFACES / DELIVERY
      </span>
      <span className="visual-plus plus-one">+</span>
      <span className="visual-plus plus-two">+</span>
    </div>
  )
}

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [0, 90])
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 8])
  return (
    <section
      ref={ref}
      id="top"
      className="hero container"
      aria-labelledby="hero-title"
    >
      <div className="hero-topline">
        <p className="eyebrow">
          <span className="status-dot" />
          {resume.hero.kicker}
        </p>
        <span className="mono hero-edition">A PRACTICE IN BUILDING BETTER</span>
      </div>
      <div className="hero-grid">
        <div className="hero-copy">
          <p className="hero-name">
            Hi, I’m {resume.profile.name} <span aria-hidden="true">↗</span>
          </p>
          <h1 id="hero-title" aria-label={resume.hero.title.join(' ')}>
            <span>{resume.hero.title[0]}</span>
            <span className="hero-title-second">{resume.hero.title[1]}</span>
          </h1>
          <p className="hero-intro">{resume.profile.tagline}</p>
          <div className="hero-actions">
            <a className="button button-dark" href="#work">
              {resume.hero.scrollLabel}
              <ArrowDownRight size={19} />
            </a>
            <a
              className="text-link"
              href={resume.profile.links[0].url}
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
              <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
        <motion.div
          className="hero-art"
          style={reduced ? undefined : { y, rotate }}
        >
          <SystemVisual />
        </motion.div>
      </div>
      <div className="hero-bottom">
        <span className="mono">BACKEND DEPTH. FULL-STACK PERSPECTIVE.</span>
        <a className="scroll-cue" href="#about">
          <span>There’s more below</span>
          <ArrowDown size={17} />
        </a>
      </div>
    </section>
  )
}
