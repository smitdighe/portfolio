import { useRef } from 'react'
import {
  MapPin,
  Sparkles,
  UserRound,
  Rocket,
  BarChart3,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { motion } from 'motion/react'
import type { Variants } from 'motion/react'
import LocationGlobe from '../ui/LocationGlobe'

/* ------------------------------------------------------------------ */
/*  Bento tile shell: spotlight-on-hover + staggered entrance          */
/* ------------------------------------------------------------------ */

const tileVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
}

function BentoTile({
  label,
  icon: Icon,
  className = '',
  children,
}: {
  label: string
  icon: LucideIcon
  className?: string
  children: React.ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - r.left}px`)
    el.style.setProperty('--my', `${e.clientY - r.top}px`)
  }

  return (
    <motion.div
      ref={ref}
      variants={tileVariants}
      onMouseMove={handleMove}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 ${className}`}
    >
      {/* Cursor-following cyan spotlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(240px circle at var(--mx, 50%) var(--my, 50%), rgba(34,211,238,0.12), transparent 65%)',
        }}
      />

      {/* Header: uppercase label + icon */}
      <div className="relative flex items-center gap-2">
        <Icon className="h-4 w-4 text-accent" />
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
          {label}
        </span>
      </div>

      <div className="relative mt-4 flex flex-1 flex-col">{children}</div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  About section                                                      */
/* ------------------------------------------------------------------ */

const FOCUS_TAGS = ['LLMOps', 'LangGraph', 'Multi-Agent Systems']

export default function About() {
  return (
    <section
      id="about"
      className="scroll-mt-24 px-6 py-8"
    >
      <div className="mx-auto w-full max-w-6xl">
        <p className="text-base font-medium tracking-widest text-accent">
          ABOUT ME
        </p>
        <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
          Who I Am
        </h2>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          transition={{ staggerChildren: 0.07, delayChildren: 0.05 }}
          className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3 md:[grid-template-rows:repeat(2,minmax(auto,1fr))]"
        >
          {/* Row 1 — Location + Bio */}
          <BentoTile label="Location" icon={MapPin}>
            <div className="flex flex-1 items-center justify-center">
              <LocationGlobe />
            </div>
          </BentoTile>

          <BentoTile
            label="Profile"
            icon={UserRound}
            className="md:col-span-2"
          >
            <ul className="flex flex-1 flex-col justify-center gap-3 text-lg leading-relaxed text-gray-200 sm:text-xl list-disc pl-5">
              <li>Engineering student who ships production code, not just assignments.</li>
              <li>Full-stack: <span className="text-white">Python</span>, <span className="text-white">React</span>, <span className="text-white">FastAPI</span> — trained ML models to deployed UIs.</li>
              <li>Shipped Revvy — an AI code review assistant — in under 48 hours at a hackathon.</li>
              <li>I'd rather break something building it than never build it at all.</li>
            </ul>
          </BentoTile>

          {/* Bottom left — Building Next fills the full row height (matches Location above) */}
          <BentoTile
            label="Building Next"
            icon={Rocket}
            className="md:col-span-2"
          >
            <div className="flex flex-1 flex-col justify-center">
              <h3 className="text-2xl font-bold text-white">Ledger</h3>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-gray-300">
                LLM observability platform that runs continuous eval on live
                agent traffic and auto-triages failures with a LangGraph
                diagnostic swarm.
              </p>
              <div className="mt-8 flex flex-wrap gap-2">
                {['LangGraph', 'ClickHouse', 'RAGAS', 'FastAPI'].map((t) => (
                  <span
                    key={t}
                    className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-sm text-gray-400"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </BentoTile>

          {/* Bottom right — Focused On (top) + Stats (bottom), split evenly to fill the row */}
          <motion.div
            transition={{ staggerChildren: 0.07 }}
            className="flex h-full flex-col gap-5 md:col-span-1"
          >
            <BentoTile
              label="Currently Focused On"
              icon={Sparkles}
              className="flex-1"
            >
              <div className="flex flex-1 flex-col justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  {FOCUS_TAGS.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-accent/25 bg-accent/10 px-2 py-1 text-xs font-medium text-accent"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-gray-400">
                  Building agentic systems that reason, plan, and act.
                </p>
              </div>
            </BentoTile>

            <BentoTile label="Stats" icon={BarChart3} className="flex-1">
              <div className="flex flex-1 items-center gap-4">
                <div className="flex-1">
                  <p className="text-2xl font-bold text-white">6</p>
                  <p className="mt-0.5 text-xs text-gray-400">Projects Shipped</p>
                </div>
                <div className="h-10 w-px shrink-0 bg-white/10" />
                <div className="flex-1">
                  <p className="text-2xl font-bold text-white">555+</p>
                  <p className="mt-0.5 text-xs text-gray-400">
                    GitHub Contributions
                  </p>
                </div>
              </div>
            </BentoTile>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
