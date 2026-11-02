import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion, useScroll, useTransform } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { useProducts } from '../hooks/useProducts'
import { useSiteSettings } from '../hooks/useSiteSettings'
import { ProductCard } from '../components/product/ProductCard'
import { Reveal } from '../components/ui/Reveal'
import { Counter } from '../components/ui/Counter'
import { Magnetic } from '../components/ui/Magnetic'
import { ParallaxImage } from '../components/ui/ParallaxImage'
import { Steam } from '../components/ui/Steam'
import { categories, roastLabels } from '../lib/categories'
import { resolveSiteImage } from '../lib/siteImages'

const ease = [0.22, 1, 0.36, 1] as const

const steps = [
  { key: 'story_1_image', title: 'Harvest', text: 'Ripe cherries are picked by hand at altitude, one pass at a time, on small farms we visit every year.' },
  { key: 'story_2_image', title: 'Roast', text: 'Small batches roasted to order in our drum roaster, watched by ear and by eye until the profile is right.' },
  { key: 'story_3_image', title: 'Grind', text: 'Beans rest for a few days, then are ground fresh for your method so nothing is lost on the way.' },
  { key: 'story_4_image', title: 'Brew', text: 'Water, time and patience. The cup you pour at home should taste like the one we tuned in the roastery.' },
]

const stats = [
  { to: 12, suffix: '', label: 'Partner farms' },
  { to: 48, suffix: ' h', label: 'Bean to doorstep' },
  { to: 9000, suffix: '+', label: 'Cups brewed weekly' },
]

function Marquee({ words, slow = false, outline = false }: { words: string[]; slow?: boolean; outline?: boolean }) {
  const row = [...words, ...words]
  return (
    <div className="overflow-hidden whitespace-nowrap py-3">
      <div className={`inline-flex ${slow ? 'animate-marquee-slow' : 'animate-marquee'}`}>
        {row.map((word, index) => (
          <span
            key={`${word}-${index}`}
            className={`mx-6 font-display text-6xl md:text-8xl ${outline ? 'text-outline' : ''}`}
          >
            {word}
            <span className="mx-6 text-clay">•</span>
          </span>
        ))}
      </div>
    </div>
  )
}

export function Home() {
  const { settings } = useSiteSettings()
  const { products } = useProducts({ pageSize: 24 })
  const navigate = useNavigate()
  const [roast, setRoast] = useState(3)
  const [step, setStep] = useState(0)

  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const cupY = useTransform(heroProgress, [0, 1], ['0%', '25%'])
  const ringRotate = useTransform(heroProgress, [0, 1], [0, 160])
  const textY = useTransform(heroProgress, [0, 1], ['0%', '-30%'])

  const storyRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress: storyProgress } = useScroll({ target: storyRef, offset: ['start start', 'end end'] })
  const activeStep = useTransform(storyProgress, (value) => Math.min(3, Math.floor(value * 4)))
  const barScale = useTransform(storyProgress, [0, 1], [0, 1])

  activeStep.on('change', (value) => setStep(value))

  const featuredOnly = products.filter((product) => product.is_featured)
  const featured = (featuredOnly.length > 0 ? featuredOnly : products).slice(0, 8)

  const heroImage = resolveSiteImage(settings, 'hero_image')
  const ringText = 'FRESHLY ROASTED • SMALL BATCH • SINGLE ORIGIN • '

  return (
    <div className="bg-cream text-ink">
      <section ref={heroRef} className="relative overflow-hidden bg-forest-dark text-cream">
        <div className="bg-grain pointer-events-none absolute inset-0 animate-grain opacity-30" />
        <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-10 px-6 py-20 lg:grid-cols-2">
          <motion.div style={{ y: textY }}>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease }}
              className="text-[11px] uppercase tracking-[0.4em] text-moss-light"
            >
              Specialty coffee roasters
            </motion.p>
            <h1 className="mt-6 text-6xl leading-[0.95] md:text-7xl lg:text-[6.2rem]">
              {['Roasted', 'slow.', 'Poured', 'right.'].map((word, index) => (
                <span key={word} className="mr-4 inline-block overflow-hidden align-bottom">
                  <motion.span
                    className={`inline-block ${index % 2 === 1 ? 'italic text-clay' : ''}`}
                    initial={{ y: '110%' }}
                    animate={{ y: 0 }}
                    transition={{ duration: 1, delay: 0.2 + index * 0.12, ease }}
                  >
                    {word}
                  </motion.span>
                </span>
              ))}
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
              className="mt-8 max-w-md text-base leading-relaxed text-cream/70"
            >
              Beans from twelve farms, roasted in small batches the day you order. Taste the difference between coffee and fresh coffee.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2, ease }}
              className="mt-10 flex gap-4"
            >
              <Magnetic>
                <Link to="/shop/beans" className="inline-flex items-center gap-2 rounded-full bg-clay px-8 py-4 text-sm tracking-wide text-cream">
                  Shop beans <ArrowRight size={16} />
                </Link>
              </Magnetic>
              <Magnetic>
                <Link to="/shop" className="inline-flex items-center rounded-full border border-cream/30 px-8 py-4 text-sm tracking-wide">
                  All products
                </Link>
              </Magnetic>
            </motion.div>
          </motion.div>

          <div className="relative mx-auto flex h-[420px] w-[420px] max-w-full items-center justify-center md:h-[520px] md:w-[520px]">
            <motion.svg
              style={{ rotate: ringRotate }}
              viewBox="0 0 200 200"
              className="absolute inset-0 h-full w-full text-moss-light"
            >
              <defs>
                <path id="ring" d="M100 100m-86 0a86 86 0 1 1 172 0a86 86 0 1 1 -172 0" />
              </defs>
              <text fill="currentColor" fontSize="9.5" letterSpacing="3.2">
                <textPath href="#ring">{ringText}</textPath>
              </text>
            </motion.svg>
            <motion.div
              style={{ y: cupY }}
              initial={{ clipPath: 'circle(0% at 50% 50%)' }}
              animate={{ clipPath: 'circle(50% at 50% 50%)' }}
              transition={{ duration: 1.4, delay: 0.3, ease }}
              className="h-[320px] w-[320px] overflow-hidden rounded-full md:h-[400px] md:w-[400px]"
            >
              <img src={heroImage} alt="Fresh coffee" className="h-full w-full object-cover" />
            </motion.div>
            <Steam className="absolute -top-6 left-1/2 h-28 w-28 -translate-x-1/2 text-cream/40" />
          </div>
        </div>
      </section>

      <section className="overflow-hidden border-b border-line bg-cream py-6 text-forest">
        <div className="-rotate-2">
          <Marquee words={['Single origin', 'Small batch', 'Roasted to order', 'Direct trade']} />
        </div>
        <div className="rotate-1 text-forest/60">
          <Marquee words={['Espresso', 'Filter', 'Cold brew', 'Pour-over']} slow outline />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <Reveal>
          <p className="text-[11px] uppercase tracking-[0.4em] text-clay">Find your roast</p>
          <h2 className="mt-3 text-5xl text-forest md:text-6xl">How dark do you like it?</h2>
        </Reveal>
        <div className="mt-12 grid items-center gap-10 md:grid-cols-[1fr_auto]">
          <div>
            <input
              type="range"
              min={1}
              max={5}
              step={1}
              value={roast}
              onChange={(event) => setRoast(Number(event.target.value))}
              className="w-full accent-[#c8641f]"
              aria-label="Roast level"
            />
            <div className="mt-3 flex justify-between text-[11px] uppercase tracking-[0.2em] text-ink/50">
              {[1, 2, 3, 4, 5].map((level) => (
                <span key={level} className={level === roast ? 'text-clay' : ''}>
                  {roastLabels[level]}
                </span>
              ))}
            </div>
            <motion.div
              animate={{ backgroundColor: ['#e5d6bd', '#e5d6bd', '#c9a27a', '#8a5a34', '#4a2a16', '#241109'][roast] }}
              transition={{ duration: 0.5 }}
              className="mt-8 h-24 rounded-full"
            />
          </div>
          <Magnetic>
            <button
              onClick={() => navigate(`/shop/beans?roast=${roast}`)}
              className="inline-flex items-center gap-2 rounded-full bg-forest px-8 py-4 text-sm text-cream"
            >
              Show {roastLabels[roast].toLowerCase()} roasts <ArrowRight size={16} />
            </button>
          </Magnetic>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid gap-6 md:grid-cols-3">
          {categories.map((item, index) => (
            <Reveal key={item.value} delay={index * 0.1}>
              <Link to={`/shop/${item.value}`} className="group relative block h-[440px] overflow-hidden rounded-t-[999px]">
                <img
                  src={resolveSiteImage(settings, `cat_${item.value}_image`)}
                  alt={item.label}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/80 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-0 right-0 text-center text-cream">
                  <p className="font-display text-4xl">{item.label}</p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.3em] opacity-0 transition-opacity group-hover:opacity-100">
                    Explore
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-sand py-24">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <p className="text-[11px] uppercase tracking-[0.4em] text-clay">Fresh picks</p>
            <h2 className="mt-3 text-5xl text-forest md:text-6xl">On the roaster this week</h2>
          </Reveal>
          <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-14 lg:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section ref={storyRef} className="relative h-[400vh] bg-forest-dark text-cream">
        <div className="sticky top-0 grid h-screen items-center gap-10 overflow-hidden px-6 lg:grid-cols-2">
          <div className="mx-auto max-w-md">
            <p className="text-[11px] uppercase tracking-[0.4em] text-moss-light">From farm to cup</p>
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5, ease }}
              >
                <p className="mt-8 font-display text-8xl text-clay">0{step + 1}</p>
                <h3 className="mt-2 text-5xl">{steps[step].title}</h3>
                <p className="mt-4 text-base leading-relaxed text-cream/70">{steps[step].text}</p>
              </motion.div>
            </AnimatePresence>
            <div className="mt-10 h-px w-full bg-cream/20">
              <motion.div style={{ scaleX: barScale }} className="h-px origin-left bg-clay" />
            </div>
          </div>
          <div className="relative mx-auto h-[60vh] w-full max-w-md overflow-hidden rounded-t-[999px]">
            <AnimatePresence>
              <motion.img
                key={step}
                src={resolveSiteImage(settings, steps[step].key)}
                alt={steps[step].title}
                initial={{ clipPath: 'inset(100% 0 0 0)' }}
                animate={{ clipPath: 'inset(0% 0 0 0)' }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, ease }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </AnimatePresence>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-10 text-center md:grid-cols-3">
          {stats.map((item) => (
            <Reveal key={item.label}>
              <p className="font-display text-7xl text-forest">
                <Counter to={item.to} suffix={item.suffix} />
              </p>
              <p className="mt-2 text-[11px] uppercase tracking-[0.3em] text-ink/50">{item.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem]">
          <ParallaxImage
            src={resolveSiteImage(settings, 'story_3_image')}
            alt="Coffee grinding"
            className="h-[420px]"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-forest-dark/60 text-center text-cream">
            <h2 className="text-5xl md:text-7xl">Your first bag ships free</h2>
            <Magnetic className="mt-8 inline-block">
              <Link to="/shop/beans" className="rounded-full bg-clay px-8 py-4 text-sm tracking-wide text-cream">
                Start with beans
              </Link>
            </Magnetic>
          </div>
        </div>
      </section>
    </div>
  )
}
