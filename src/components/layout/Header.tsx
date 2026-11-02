import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { Heart, Menu, Search, ShoppingBag, User, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { categories } from '../../lib/categories'

function Badge({ count, tone }: { count: number; tone: string }) {
  return (
    <motion.span
      key={count}
      initial={{ scale: 0.3 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 12 }}
      className={`absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px] text-cream ${tone}`}
    >
      {count}
    </motion.span>
  )
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuth()
  const { itemCount } = useCart()
  const { lines: wishlistLines } = useWishlist()
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious() ?? 0
    setScrolled(latest > 20)
    setHidden(latest > previous && latest > 160 && !searchOpen)
  })

  function submitSearch(event: React.FormEvent) {
    event.preventDefault()
    const term = query.trim()
    if (!term) return
    navigate(`/shop?search=${encodeURIComponent(term)}`)
    setQuery('')
    setSearchOpen(false)
    setMenuOpen(false)
  }

  return (
    <motion.header
      animate={{ y: hidden ? '-100%' : 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={`sticky top-0 z-40 border-b backdrop-blur-xl transition-colors duration-500 ${
        scrolled ? 'border-line bg-cream/90' : 'border-transparent bg-cream/60'
      }`}
    >
      <div className="mx-auto grid h-16 max-w-7xl grid-cols-3 items-center px-6">
        <div className="flex items-center">
          <button
            className="-ml-2 p-2 md:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} strokeWidth={1.5} />
          </button>
          <nav className="hidden items-center gap-7 md:flex">
            {categories.map((category) => (
              <NavLink
                key={category.value}
                to={`/shop/${category.value}`}
                className={({ isActive }) =>
                  `group relative text-sm tracking-wide transition-colors hover:text-forest ${
                    isActive ? 'text-forest' : 'text-ink/70'
                  }`
                }
              >
                {category.label}
                <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-forest transition-transform duration-500 group-hover:scale-x-100" />
              </NavLink>
            ))}
          </nav>
        </div>

        <Link to="/" className="group flex items-center gap-2 justify-self-center font-display text-4xl tracking-[0.12em] text-forest">
          <svg viewBox="0 0 64 64" className="h-7 w-7 transition-transform duration-700 group-hover:rotate-[200deg]" aria-hidden="true">
            <ellipse cx="32" cy="32" rx="14" ry="22" transform="rotate(35 32 32)" className="fill-forest" />
            <path d="M21 20c9 5 13 18 22 24" className="stroke-cream" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          </svg>
          EMBER
        </Link>

        <div className="flex items-center justify-end gap-4">
          <motion.button
            whileHover={{ scale: 1.15, rotate: -8 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setSearchOpen((open) => !open)}
            className="p-1"
            aria-label="Search"
          >
            <Search size={20} strokeWidth={1.5} />
          </motion.button>

          <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>
            <Link to="/wishlist" className="relative block p-1" aria-label="Wishlist">
              <Heart size={20} strokeWidth={1.5} />
              {wishlistLines.length > 0 && <Badge count={wishlistLines.length} tone="bg-clay" />}
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>
            <Link to={user ? '/account' : '/login'} className="block p-1" aria-label="Account">
              <User size={20} strokeWidth={1.5} />
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>
            <Link to="/cart" className="relative block p-1" aria-label="Cart">
              <ShoppingBag size={20} strokeWidth={1.5} />
              {itemCount > 0 && <Badge count={itemCount} tone="bg-forest" />}
            </Link>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {searchOpen && (
          <motion.form
            onSubmit={submitSearch}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-t border-line bg-cream"
          >
            <div className="mx-auto flex max-w-7xl items-center gap-3 px-6 py-3">
              <Search size={18} strokeWidth={1.5} className="text-ink/50" />
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search coffee, gear, cups"
                className="w-full bg-transparent text-sm outline-none placeholder:text-ink/40"
              />
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-forest-dark/60 md:hidden"
            onClick={() => setMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 260, damping: 30 }}
              className="flex h-full w-72 flex-col gap-6 border-r border-line bg-cream p-6"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                className="self-end p-2"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
              >
                <X size={22} strokeWidth={1.5} />
              </button>
              {categories.map((category, index) => (
                <motion.div
                  key={category.value}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.07 }}
                >
                  <NavLink
                    to={`/shop/${category.value}`}
                    onClick={() => setMenuOpen(false)}
                    className="font-display text-3xl text-forest"
                  >
                    {category.label}
                  </NavLink>
                </motion.div>
              ))}
              <NavLink
                to="/shop"
                onClick={() => setMenuOpen(false)}
                className="text-sm text-ink/70 underline underline-offset-4"
              >
                All products
              </NavLink>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
