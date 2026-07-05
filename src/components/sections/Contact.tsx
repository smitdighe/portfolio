import { useState } from 'react'
import { Mail, Linkedin, Github, Instagram } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const ACCESS_KEY = '74626213-574d-4401-a669-31b680f435fb'

const socials: { icon: LucideIcon; label: string; href: string }[] = [
  { icon: Mail, label: 'Email', href: 'mailto:smitdighe@gmail.com' },
  {
    icon: Linkedin,
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/smit-dighe-a02422337/',
  },
  { icon: Github, label: 'GitHub', href: 'https://github.com/smitdighe' },
  { icon: Instagram, label: 'Instagram', href: 'https://www.instagram.com/smit_dighe/' },
]

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<Status>('idle')
  const [feedback, setFeedback] = useState('')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('loading')
    setFeedback('')

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          name: form.name,
          email: form.email,
          message: form.message,
        }),
      })

      const data = await res.json()

      if (data.success) {
        setStatus('success')
        setFeedback("Thanks! Your message has been sent. I'll be in touch soon.")
        setForm({ name: '', email: '', message: '' })
      } else {
        setStatus('error')
        setFeedback(data.message || 'Something went wrong. Please try again.')
      }
    } catch {
      setStatus('error')
      setFeedback('Network error. Please try again later.')
    }
  }

  return (
    <section id="contact" className="mx-auto max-w-4xl scroll-mt-24 px-6 py-10">
      {/* Heading */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Let's Connect
        </h2>
        <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-accent" />
        <p className="mx-auto mt-6 max-w-xl text-gray-300">
          I'm always open to new opportunities and collaborations. Feel free to
          reach out if you'd like to discuss projects, opportunities, or just
          want to say hello!
        </p>
      </div>

      {/* Social cards */}
      <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
        {socials.map(({ icon: Icon, label, href }) => (
          <a
            key={label}
            href={href}
            target={href.startsWith('mailto:') ? undefined : '_blank'}
            rel={href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
            onMouseMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect()
              e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
              e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
            }}
            className="group cursor-target relative flex flex-col items-center overflow-hidden rounded-xl border border-white/10 bg-white/5 p-6 text-gray-300 transition-colors hover:border-accent/40 hover:text-white"
          >
            {/* Cursor-following cyan spotlight (matches About bento tiles) */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background:
                  'radial-gradient(240px circle at var(--mx, 50%) var(--my, 50%), rgba(34,211,238,0.12), transparent 65%)',
              }}
            />
            <Icon className="relative h-6 w-6 text-accent" />
            <span className="relative mt-3 text-sm font-medium">{label}</span>
          </a>
        ))}
      </div>

      {/* Contact form */}
      <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-4">
        <input type="hidden" name="access_key" value={ACCESS_KEY} />

        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          placeholder="Your name"
          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-gray-500 focus:border-accent focus:outline-none"
        />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          placeholder="Your email"
          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-gray-500 focus:border-accent focus:outline-none"
        />
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          required
          placeholder="Your message"
          className="min-h-32 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-gray-500 focus:border-accent focus:outline-none"
        />

        <button
          type="submit"
          disabled={status === 'loading'}
          className="cursor-target w-full rounded-lg bg-accent py-3 font-semibold text-black transition-colors hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === 'loading' ? 'Sending…' : 'Send Message'}
        </button>

        {feedback && (
          <p
            className={`text-center text-sm ${
              status === 'success' ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {feedback}
          </p>
        )}
      </form>
    </section>
  )
}
