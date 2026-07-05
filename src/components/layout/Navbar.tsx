import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import ThemeToggle from '../ui/ThemeToggle'
import { useActiveSection } from '../../lib/useActiveSection'

const links = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]

const ids = links.map((link) => link.href.slice(1))

export default function Navbar() {
  const active = useActiveSection(ids)
  const [open, setOpen] = useState(false)

  const handleNav = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    e.preventDefault()
    document
      .getElementById(href.slice(1))
      ?.scrollIntoView({ behavior: 'smooth' })
    setOpen(false)
  }

  return (
    <header className="fixed inset-x-0 top-6 z-50">
      <div className="relative mx-auto flex max-w-6xl items-center justify-between px-6">
        {/* Left: theme toggle */}
        <ThemeToggle />

        {/* Center: floating pill nav (desktop) */}
        <nav className="absolute left-1/2 hidden -translate-x-1/2 md:block">
          <ul className="flex items-center gap-1 rounded-full border border-white/10 bg-black/40 px-2 py-1.5 backdrop-blur-md">
            {links.map((link) => {
              const isActive = active === link.href.slice(1)
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => handleNav(e, link.href)}
                    className={`cursor-target block rounded-full px-4 py-1.5 text-sm transition-colors ${
                      isActive
                        ? 'bg-white/10 text-white'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Right (mobile only): hamburger toggle */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle navigation menu"
          aria-expanded={open}
          className="cursor-target flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/40 text-gray-200 backdrop-blur-md transition-colors hover:bg-white/10 hover:text-white md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu panel */}
      {open && (
        <nav className="mx-auto mt-3 max-w-6xl px-6 md:hidden">
          <ul className="flex flex-col gap-1 rounded-2xl border border-white/10 bg-black/60 p-2 backdrop-blur-md">
            {links.map((link) => {
              const isActive = active === link.href.slice(1)
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => handleNav(e, link.href)}
                    className={`cursor-target block rounded-xl px-4 py-2.5 text-sm transition-colors ${
                      isActive
                        ? 'bg-white/10 text-white'
                        : 'text-gray-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
      )}
    </header>
  )
}
