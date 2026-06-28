import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

const pageVariants = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
}

export const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.07 } },
}

export const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' as const } },
}

export const fadeIn = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
}

export default function PageWrapper({ children }: { children: ReactNode }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  )
}
