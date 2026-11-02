import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { motion } from 'motion/react'
import { Header } from './Header'
import { Footer } from './Footer'
import { ScrollProgress } from '../ui/ScrollProgress'

export function RootLayout() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [pathname])

  return (
    <div className="flex min-h-screen flex-col">
      <ScrollProgress />
      <motion.div
        key={pathname}
        initial={{ clipPath: 'circle(150% at 50% 50%)' }}
        animate={{ clipPath: 'circle(0% at 50% 50%)' }}
        transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
        className="pointer-events-none fixed inset-0 z-[70] flex items-center justify-center bg-forest-dark"
      >
        <motion.span
          initial={{ opacity: 1, scale: 1 }}
          animate={{ opacity: 0, scale: 1.2 }}
          transition={{ duration: 0.45, delay: 0.2 }}
          className="font-display text-6xl tracking-[0.2em] text-cream"
        >
          EMBER
        </motion.span>
      </motion.div>
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
