import { Link } from 'react-router-dom'
import { categories } from '../../lib/categories'

export function Footer() {
  return (
    <footer className="border-t border-line bg-sand">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
        <div>
          <p className="font-display text-4xl tracking-[0.12em] text-forest">EMBER</p>
          <p className="mt-3 max-w-xs text-sm text-ink/60">
            Small-batch coffee roasted every week, plus the gear and cups to enjoy it properly.
          </p>
        </div>

        <div>
          <p className="text-sm font-medium text-ink">Shop</p>
          <ul className="mt-3 space-y-2 text-sm text-ink/60">
            {categories.map((category) => (
              <li key={category.value}>
                <Link to={`/shop/${category.value}`} className="hover:text-forest">
                  {category.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/shop" className="hover:text-forest">
                All products
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-medium text-ink">Help</p>
          <ul className="mt-3 space-y-2 text-sm text-ink/60">
            <li>
              <Link to="/account" className="hover:text-forest">
                Your account
              </Link>
            </li>
            <li>
              <Link to="/cart" className="hover:text-forest">
                Your bag
              </Link>
            </li>
            <li>
              <Link to="/wishlist" className="hover:text-forest">
                Wishlist
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-medium text-ink">Stay in touch</p>
          <p className="mt-3 text-sm text-ink/60">New roasts and brewing tips, twice a month.</p>
          <form className="mt-3 flex border-b border-forest/40">
            <input
              type="email"
              placeholder="Email address"
              className="w-full bg-transparent py-2 text-sm outline-none placeholder:text-ink/40"
            />
            <button type="submit" className="text-sm text-forest">
              Join
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-line px-6 py-5 text-center text-xs text-ink/50">
        © {new Date().getFullYear()} Ember. All rights reserved.
      </div>
    </footer>
  )
}
