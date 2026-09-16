import { motion, useScroll } from 'motion/react'
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  return (
    <motion.div
      style={{ scaleX: scrollYProgress }}
      className="scroll-progress"
      aria-hidden="true"
    />
  )
}
