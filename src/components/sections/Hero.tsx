import { useMemo, useState } from 'react'
import { Quote } from 'lucide-react'
import RotatingText from '../ui/RotatingText'
import portrait from '../../assets/portfolio.png'

const QUOTES = [
  { text: 'Programs must be written for people to read, and only incidentally for machines to execute.', author: 'Harold Abelson'},
  { text: 'Any sufficiently advanced technology is indistinguishable from magic.', author: 'Arthur C. Clarke'},
  { text: 'The best way to predict the future is to invent it.', author: 'Alan Kay' },
  { text: 'Simplicity is the soul of efficiency.', author: 'Austin Freeman' },
  { text: 'Machines take me by surprise with great frequency.', author: 'Alan Turing' },
  { text: 'Talk is cheap. Show me the code.', author: 'Linus Torvalds' },
  { text: 'First, solve the problem. Then, write the code.', author: 'John Johnson' },
  { text: "Code is like humor. When you have to explain it, it's bad.", author: 'Cory House'},
  { text: 'Make it work, make it right, make it fast.', author: 'Kent Beck' },
]

// Deterministic pick seeded by the calendar day, so the quote is stable for the
// whole day and rotates the next.
function pickDailyQuote() {
  const seed = new Date().toDateString()
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  }
  return QUOTES[hash % QUOTES.length]
}

export default function Hero() {
  const [flipped, setFlipped] = useState(false)
  const quote = useMemo(pickDailyQuote, [])

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section id="home" className="min-h-screen scroll-mt-24 px-6 pt-24">
      {/* Dim + blur the rest of the page while the photo is flipped. */}
      <div
        aria-hidden
        className={`pointer-events-none fixed inset-0 z-[100] bg-black/30 backdrop-blur-md transition-opacity duration-500 ${
          flipped ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <div className="mx-auto flex max-w-6xl flex-col items-center gap-20 py-24 md:flex-row">
        {/* Left half: photo with cyan glow */}
        <div className="w-full md:w-5/12">
          <div className="relative mx-auto max-w-sm">
            <div
              aria-hidden
              className="absolute -inset-6 -z-10 rounded-full bg-cyan-400/20 blur-3xl"
            />
            <div
              className={`relative aspect-[4/5] w-full [perspective:1200px] ${
                flipped ? 'z-[110]' : ''
              }`}
              onMouseEnter={() => setFlipped(true)}
              onMouseLeave={() => setFlipped(false)}
            >
              <div
                className="relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d]"
                style={{ transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
              >
                {/* Front: photo */}
                <div className="absolute inset-0 overflow-hidden rounded-2xl border border-white/10 [backface-visibility:hidden]">
                  <img
                    src={portrait}
                    alt="Smit Dighe"
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Back: daily quote */}
                <div className="absolute inset-0 flex flex-col rounded-2xl border border-white/10 bg-background p-8 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                  <Quote className="h-8 w-8 shrink-0 text-cyan-400/60" />
                  <div className="flex flex-1 flex-col items-center justify-center">
                    <p className="text-center font-serif text-xl leading-relaxed text-gray-200">
                      {quote.text}
                    </p>
                    <p className="mt-4 text-sm font-medium text-accent">
                      — {quote.author}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right half: intro copy */}
        <div className="flex w-full flex-col items-start justify-center text-left md:w-7/12">
          <p className="text-sm text-white-400">Hi, I'm Smit Dighe</p>

          <h1 className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-6 text-4xl font-bold leading-tight text-white sm:text-5xl">
            <span>Full-Stack Dev | </span>
            
            <RotatingText
              texts={[
                'AI/ML Developer',
                'Building AI-Powered apps',
                'LangChain & RAG Systems',
              ]}
              mainClassName="text-white overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center"
              splitBy="characters"
              staggerFrom="first"
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '-120%', opacity: 0 }}
              staggerDuration={0.025}
              splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
              transition={{ type: 'spring', damping: 30, stiffness: 400 }}
              rotationInterval={3000}
            />
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-gray-300">
            I build AI-powered full-stack apps — from trained ML models to
            production UIs. Currently deep diving in LangChain, LangGraph &amp;
            multi-agent systems.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => scrollTo('projects')}
              className="cursor-target rounded-full bg-accent px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-cyan-300"
            >
              View Projects
            </button>
            <button
              type="button"
              onClick={() => scrollTo('contact')}
              className="cursor-target rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-white transition-colors hover:border-white/40 hover:bg-white/5"
            >
              Contact Me
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
