import { ArrowUpRight, Github } from 'lucide-react'
import {
  siPython,
  siScikitlearn,
  siFastapi,
  siReact,
  siTypescript,
  siTailwindcss,
  siSupabase,
  siLanggraph,
  siPostgresql,
} from 'simple-icons'
import type { SimpleIcon } from 'simple-icons'
import ScrollStack, { ScrollStackItem } from '../ui/ScrollStack'

import verityImg from '../../assets/Verity.png'
import revvyImg from '../../assets/Revvy.png'
import gitlyticsImg from '../../assets/Gitlytics.png'
import binRouteImg from '../../assets/BinRoute.png'
import findocagentImg from '../../assets/FinDocAgent.png'
import fathomImg from '../../assets/Fathom.png'

interface Tech {
  icon: SimpleIcon
  name: string
}

interface Project {
  title: string
  description: string
  image: string
  demoUrl: string
  githubUrl: string
  tech: Tech[]
}

const projects: Project[] = [
  {
    title: 'FinDocAgent',
    description:
      'FinDocAgent answers questions about dense SEC filings by dispatching a team of specialized agents that retrieve, reason, and cross-check. Retrieval-augmented generation grounds every answer in the source document, with citations you can trace back to the exact filing. It turns hundreds of pages of 10-Ks into a conversation.',
      image: findocagentImg,
    demoUrl: 'https://fin-doc-agent.vercel.app/',
    githubUrl: 'https://github.com/smitdighe/FinDocAgent',
    tech: [
      { icon: siPython, name: 'Python' },
      { icon: siFastapi, name: 'FastAPI' },
      { icon: siLanggraph, name: 'LangGraph' },
      { icon: siPostgresql, name: 'Postgres' },
      { icon: siSupabase, name: 'Supabase' },
    ],
  },
  {
    title: 'Fathom',
    description:
      'Fathom researches any topic on its own — searching, reading, and reflecting in a loop until it has enough to write. It synthesizes findings into a structured, fully cited report instead of a wall of links. An autonomous analyst that hands you the conclusion, not the homework.',
    image: fathomImg,
    demoUrl: 'https://fathom-dev.vercel.app/',
    githubUrl: 'https://github.com/smitdighe/Fathom',
    tech: [
      { icon: siPython, name: 'Python' },
      { icon: siFastapi, name: 'FastAPI' },
      { icon: siLanggraph, name: 'LangGraph' },
      { icon: siReact, name: 'React' },
    ],
  },
  {
    title: 'Verity',
    description:
      'Verity flags fraudulent job postings before they ever reach an applicant. A LogisticRegression model scores each listing, while SHAP surfaces exactly which words and signals drove the verdict. Recruiters get a transparent, explainable decision instead of a black-box number.',
    image: verityImg,
    demoUrl: 'https://verity-iota-two.vercel.app/',
    githubUrl: 'https://github.com/smitdighe/verity',
    tech: [
      { icon: siPython, name: 'Python' },
      { icon: siScikitlearn, name: 'scikit-learn' },
      { icon: siFastapi, name: 'FastAPI' },
      { icon: siReact, name: 'React' },
    ],
  },
  {
    title: 'Revvy',
    description:
      'Revvy is an AI pair reviewer that reads your diff and flags bugs, security holes, and performance traps. Every finding arrives with a plain-English explanation and a concrete suggested fix. Built and shipped in under 48 hours at a hackathon.',
    image: revvyImg,
    demoUrl: 'https://revvy-iota.vercel.app/',
    githubUrl: 'https://github.com/smitdighe/revvy',
    tech: [
      { icon: siReact, name: 'React' },
      { icon: siFastapi, name: 'FastAPI' },
      { icon: siPython, name: 'Python' },
    ],
  },
  {
    title: 'Gitlytics',
    description:
      'Gitlytics transforms any GitHub profile into a visual story — language breakdowns, contribution trends, and repository highlights. It pulls live data straight from the GitHub API and renders it into clean, shareable charts. A fast way to understand a developer at a glance.',
    image: gitlyticsImg,
    demoUrl: 'https://gitlytics-red.vercel.app/',
    githubUrl: 'https://github.com/smitdighe/gitlytics',
    tech: [
      { icon: siReact, name: 'React' },
      { icon: siTypescript, name: 'TypeScript' },
      { icon: siTailwindcss, name: 'Tailwind' },
    ],
  },
  {
    title: 'BinRoute',
    description:
      'BinRoute gives fleet managers a live command center for waste collection. Track bin fill levels, plan efficient pickup routes, and monitor trucks from a single dashboard. Designed to cut fuel costs and missed pickups across a city.',
    image: binRouteImg,
    demoUrl: 'https://bin-route.vercel.app/',
    githubUrl: 'https://github.com/smitdighe/binroute',
    tech: [
      { icon: siReact, name: 'React' },
      { icon: siTypescript, name: 'TypeScript' },
      { icon: siSupabase, name: 'Supabase' },
      { icon: siTailwindcss, name: 'Tailwind' },
    ],
  },
]

function TechPill({ tech }: { tech: Tech }) {
  return (
    <span
      style={{ ['--brand' as string]: `#${tech.icon.hex}` }}
      className="group/pill inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-2 text-xs font-medium text-gray-300 backdrop-blur-sm transition-colors duration-200 hover:border-[var(--brand)]/50 hover:text-white hover:shadow-[0_0_12px_-2px_var(--brand)]"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-3.5 w-3.5 fill-gray-500 transition-colors duration-200 group-hover/pill:[fill:var(--brand)]"
        aria-hidden="true"
      >
        <path d={tech.icon.path} />
      </svg>
      {tech.name}
    </span>
  )
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="flex h-full w-full flex-col md:flex-row">
      {/* Left 60% — screenshot */}
      <div className="relative h-[45%] w-full overflow-hidden md:h-full md:w-3/5">
        <img
          src={project.image}
          alt={`${project.title} screenshot`}
          loading="lazy"
          className="h-full w-full rounded-t-2xl object-cover md:rounded-l-2xl md:rounded-tr-none"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 to-transparent md:bg-gradient-to-r" />
      </div>

      {/* Right 40% — content */}
      <div className="flex flex-1 flex-col justify-between gap-4 p-7 md:w-2/5">
        {/* Top: title + LIVE badge */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-2xl font-bold text-white sm:text-3xl">
            {project.title}
          </h3>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            LIVE
          </span>
        </div>

        {/* Middle: description + tech pills */}
        <div className="flex flex-col gap-8">
          <p className="text-sm leading-[1.6] text-gray-300">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <TechPill key={t.name} tech={t} />
            ))}
          </div>
        </div>

        {/* Bottom: actions */}
        <div className="flex flex-wrap items-center gap-3">
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-target inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-cyan-300"
          >
            Live Demo
            <ArrowUpRight className="h-4 w-4" />
          </a>
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-target inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-4 py-2 text-sm font-medium text-gray-200 transition-colors hover:border-white/30 hover:bg-white/5 hover:text-white"
          >
            <Github className="h-4 w-4" />
            View GitHub
          </a>
        </div>
      </div>
    </div>
  )
}

export default function Projects() {
  return (
    <section id="projects" className="scroll-mt-24 overflow-hidden px-6 py-12">
      <div className="mx-auto w-full max-w-5xl">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">Projects</h2>

        <div className="mt-1 h-[640px] overflow-hidden">
          <ScrollStack
            itemDistance={140}
            itemStackDistance={26}
            baseScale={0.9}
            itemScale={0.015}
            stackPosition="18%"
            scaleEndPosition="8%"
          >
            {projects.map((project) => (
              <ScrollStackItem
                key={project.title}
                itemClassName="overflow-hidden border border-white/10 bg-[#0d0d14]"
              >
                <ProjectCard project={project} />
              </ScrollStackItem>
            ))}
          </ScrollStack>
        </div>
      </div>
    </section>
  )
}
