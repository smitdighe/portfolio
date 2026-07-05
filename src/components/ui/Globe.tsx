import { useEffect, useRef } from 'react'
import {
  siPython,
  siJavascript,
  siTypescript,
  siReact,
  siTailwindcss,
  siFastapi,
  siFlask,
  siNodedotjs,
  siExpress,
  siMysql,
  siPostgresql,
  siSupabase,
  siLangchain,
  siDocker,
  siGit,
  siGithub,
} from 'simple-icons'
import type { SimpleIcon } from 'simple-icons'

// Techs in listed order. Names are overridden to match the short labels the
// section advertises (simple-icons titles differ, e.g. "Tailwind CSS").
const TECHS: { icon: SimpleIcon; name: string }[] = [
  { icon: siPython, name: 'Python' },
  { icon: siJavascript, name: 'JavaScript' },
  { icon: siTypescript, name: 'TypeScript' },
  { icon: siReact, name: 'React' },
  { icon: siTailwindcss, name: 'Tailwind' },
  { icon: siFastapi, name: 'FastAPI' },
  { icon: siFlask, name: 'Flask' },
  { icon: siNodedotjs, name: 'Node.js' },
  { icon: siExpress, name: 'Express' },
  { icon: siMysql, name: 'MySQL' },
  { icon: siPostgresql, name: 'PostgreSQL' },
  { icon: siSupabase, name: 'Supabase' },
  { icon: siLangchain, name: 'LangChain' },
  { icon: siDocker, name: 'Docker' },
  { icon: siGit, name: 'Git' },
  { icon: siGithub, name: 'GitHub' },
]

type Vec3 = { x: number; y: number; z: number }

// Evenly distribute N unit vectors over a sphere (Fibonacci sphere). These are
// the fixed "home" positions of the icons; rotation is applied every frame.
function fibonacciSphere(n: number): Vec3[] {
  const points: Vec3[] = []
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2 // 1 -> -1
    const r = Math.sqrt(1 - y * y)
    const theta = golden * i
    points.push({ x: Math.cos(theta) * r, y, z: Math.sin(theta) * r })
  }
  return points
}

// Pre-baked lat/lng wireframe as arrays of unit vectors, rotated each frame.
function buildWireframe() {
  const meridians: Vec3[][] = []
  const parallels: Vec3[][] = []
  const NUM_MERIDIANS = 12
  const MERIDIAN_STEPS = 48
  const NUM_PARALLELS = 9
  const PARALLEL_STEPS = 64

  for (let m = 0; m < NUM_MERIDIANS; m++) {
    const lng = (m / NUM_MERIDIANS) * Math.PI * 2
    const line: Vec3[] = []
    for (let s = 0; s <= MERIDIAN_STEPS; s++) {
      const lat = -Math.PI / 2 + (s / MERIDIAN_STEPS) * Math.PI
      line.push({
        x: Math.cos(lat) * Math.sin(lng),
        y: Math.sin(lat),
        z: Math.cos(lat) * Math.cos(lng),
      })
    }
    meridians.push(line)
  }

  for (let p = 1; p <= NUM_PARALLELS; p++) {
    const lat = -Math.PI / 2 + (p / (NUM_PARALLELS + 1)) * Math.PI
    const line: Vec3[] = []
    for (let s = 0; s <= PARALLEL_STEPS; s++) {
      const lng = (s / PARALLEL_STEPS) * Math.PI * 2
      line.push({
        x: Math.cos(lat) * Math.sin(lng),
        y: Math.sin(lat),
        z: Math.cos(lat) * Math.cos(lng),
      })
    }
    parallels.push(line)
  }

  return [...meridians, ...parallels]
}

// Coarse real-world landmass outlines as [lat, lng] vertex loops (degrees).
// Approximate but recognizable; sampled into dot markers along their edges.
const CONTINENTS: [number, number][][] = [
  // North America
  [
    [71, -156], [70, -141], [69, -128], [68, -110], [67, -95], [63, -82],
    [60, -78], [63, -70], [58, -64], [52, -56], [47, -60], [45, -67],
    [41, -70], [40, -74], [35, -76], [30, -81], [25, -80], [29, -83],
    [30, -88], [29, -94], [26, -97], [21, -97], [18, -95], [16, -95],
    [15, -92], [13, -88], [9, -82], [8, -78], [13, -87], [16, -96],
    [20, -105], [23, -110], [28, -114], [32, -117], [34, -120], [40, -124],
    [48, -124], [55, -131], [60, -146], [69, -141], [71, -156],
  ],
  // Greenland
  [
    [83, -30], [80, -20], [70, -22], [60, -44], [64, -52], [70, -54],
    [76, -60], [80, -50], [82, -40], [83, -30],
  ],
  // South America
  [
    [12, -72], [11, -64], [6, -58], [1, -50], [-5, -35], [-8, -35],
    [-13, -38], [-23, -41], [-30, -50], [-35, -54], [-41, -63], [-47, -66],
    [-52, -69], [-53, -72], [-45, -74], [-37, -73], [-30, -71], [-23, -70],
    [-18, -70], [-14, -76], [-8, -79], [-4, -81], [0, -80], [6, -77],
    [9, -77], [11, -72], [12, -72],
  ],
  // Africa
  [
    [35, -6], [37, 10], [33, 11], [31, 19], [30, 32], [27, 34], [22, 37],
    [12, 43], [11, 51], [2, 42], [-4, 39], [-11, 40], [-17, 37], [-26, 33],
    [-34, 26], [-34, 19], [-29, 17], [-22, 14], [-17, 12], [-11, 13],
    [-5, 9], [4, 9], [5, -4], [9, -14], [15, -17], [21, -17], [27, -13],
    [31, -10], [35, -6],
  ],
  // Europe
  [
    [36, -9], [43, -9], [48, -5], [51, 2], [53, 5], [57, 8], [58, 5],
    [62, 5], [68, 15], [71, 25], [68, 40], [60, 30], [55, 21], [54, 14],
    [45, 13], [40, 18], [37, 15], [36, -9],
  ],
  // Great Britain
  [
    [58, -5], [57, -2], [54, 0], [51, 1], [50, -4], [52, -5], [55, -6],
    [58, -5],
  ],
  // Asia
  [
    [66, 40], [68, 55], [73, 70], [76, 100], [73, 140], [66, 170],
    [62, 178], [60, 160], [55, 155], [52, 141], [45, 135], [39, 127],
    [35, 126], [31, 122], [23, 117], [22, 110], [10, 105], [9, 100],
    [13, 99], [16, 95], [21, 90], [20, 86], [15, 80], [8, 78], [15, 73],
    [20, 70], [24, 67], [25, 61], [27, 50], [30, 48], [37, 48], [41, 48],
    [44, 50], [47, 52], [50, 48], [55, 50], [60, 45], [66, 40],
  ],
  // Australia
  [
    [-11, 131], [-12, 137], [-15, 141], [-19, 147], [-25, 153], [-33, 152],
    [-38, 147], [-38, 141], [-35, 138], [-32, 134], [-34, 123], [-33, 116],
    [-28, 114], [-22, 114], [-18, 122], [-14, 127], [-11, 131],
  ],
  // Madagascar
  [
    [-12, 49], [-15, 50], [-20, 49], [-25, 47], [-24, 44], [-18, 44],
    [-13, 48], [-12, 49],
  ],
]

// Sample dot markers along the continent edges (unit vectors on the sphere).
function buildContinents(): Vec3[] {
  const SPACING = 2 // degrees between dots along an edge
  const dots: Vec3[] = []
  const toVec = (lat: number, lng: number): Vec3 => {
    const la = (lat * Math.PI) / 180
    const lo = (lng * Math.PI) / 180
    return {
      x: Math.cos(la) * Math.sin(lo),
      y: Math.sin(la),
      z: Math.cos(la) * Math.cos(lo),
    }
  }
  for (const poly of CONTINENTS) {
    for (let i = 0; i < poly.length - 1; i++) {
      const [lat1, lng1] = poly[i]
      const [lat2, lng2] = poly[i + 1]
      const steps = Math.max(1, Math.round(Math.hypot(lat2 - lat1, lng2 - lng1) / SPACING))
      for (let s = 0; s < steps; s++) {
        const f = s / steps
        dots.push(toVec(lat1 + (lat2 - lat1) * f, lng1 + (lng2 - lng1) * f))
      }
    }
  }
  return dots
}

const clamp = (v: number, min: number, max: number) =>
  Math.min(Math.max(v, min), max)

const SPIN_SPEED = 0.0088 // constant auto-rotation, never pauses
const BASE_TILT = 0.12 // resting X tilt so we look slightly from above
// Earth's axial tilt: the spin axis leans ~23.5° off vertical, so auto-rotation
// happens around this tilted pole rather than a straight-up axis.
const AXIAL_TILT = (23.5 * Math.PI) / 180
const COS_TILT = Math.cos(AXIAL_TILT)
const SIN_TILT = Math.sin(AXIAL_TILT)
// Damping for how fast the displayed rotation chases its drag target. Below 1
// so release decelerates smoothly; high enough that dragging still feels snappy
// and jitter-free.
const ROTATION_LERP = 0.18
const ALPHA_BUCKETS = 6 // depth-shaded wireframe strokes per frame

export default function Globe() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const badgeRefs = useRef<(HTMLDivElement | null)[]>([])

  // Live rotation state read by the render loop. tilt/yawOffset are the values
  // actually drawn; targetTilt/targetYaw are what drag sets, and the drawn
  // values ease toward them each frame for smooth, jitter-free motion.
  const spin = useRef(0)
  const tilt = useRef(BASE_TILT)
  const yawOffset = useRef(0)
  const targetTilt = useRef(BASE_TILT)
  const targetYaw = useRef(0)
  // Drag snapshot taken at pointer-down; null when not actively dragging.
  const drag = useRef<{
    startX: number
    startY: number
    yaw: number
    tilt: number
  } | null>(null)

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const lines = buildWireframe()
    const continents = buildContinents()
    const homes = fibonacciSphere(TECHS.length)

    let size = 0
    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    const resize = () => {
      size = container.clientWidth
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = size * dpr
      canvas.height = size * dpr
      canvas.style.width = `${size}px`
      canvas.style.height = `${size}px`
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(container)

    let rafId = 0
    const frame = () => {
      // Auto-rotate always; an active drag adjusts tilt/yaw directly (see the
      // pointer handlers), so the globe holds its dragged orientation and keeps
      // spinning from there. Passive hover no longer affects rotation.
      spin.current += SPIN_SPEED
      // Ease the drawn rotation toward its drag target; on release the target
      // holds and the drawn value keeps easing in, giving smooth deceleration.
      tilt.current += (targetTilt.current - tilt.current) * ROTATION_LERP
      yawOffset.current += (targetYaw.current - yawOffset.current) * ROTATION_LERP

      const angleY = spin.current + yawOffset.current
      const angleX = tilt.current
      const cosY = Math.cos(angleY)
      const sinY = Math.sin(angleY)
      const cosX = Math.cos(angleX)
      const sinX = Math.sin(angleX)

      const cx = size / 2
      const cy = size / 2
      // Sphere radius, but never so large that a surface badge (half ≈ 45px)
      // would reach past the container edge — keeps every icon inside the box
      // regardless of how narrow the section gets on small screens.
      const R = Math.min(size * 0.42, size / 2 - 52)

      const rot = (p: Vec3) => {
        // 1. spin around the sphere's own polar (Y) axis
        const sx1 = p.x * cosY + p.z * sinY
        const sz1 = -p.x * sinY + p.z * cosY
        const sy1 = p.y
        // 2. lean that polar axis ~23.5° off vertical (rotate around Z)
        const ax = sx1 * COS_TILT - sy1 * SIN_TILT
        const ay = sx1 * SIN_TILT + sy1 * COS_TILT
        // 3. viewing tilt (resting + drag) around X
        const y2 = ay * cosX - sz1 * sinX
        const z2 = ay * sinX + sz1 * cosX
        return { sx: cx + ax * R, sy: cy - y2 * R, z: z2 }
      }

      // --- Wireframe ---
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, size, size)
      ctx.lineWidth = 1
      // Segments are binned by depth into a handful of Path2D buckets so the
      // whole mesh strokes in ALPHA_BUCKETS draw calls while still fading back.
      const buckets: Path2D[] = Array.from(
        { length: ALPHA_BUCKETS },
        () => new Path2D(),
      )
      for (const line of lines) {
        let prev = rot(line[0])
        for (let i = 1; i < line.length; i++) {
          const cur = rot(line[i])
          const depth = (prev.z + cur.z) / 2 // -1 back .. 1 front
          const t = (depth + 1) / 2
          const b = clamp(Math.floor(t * ALPHA_BUCKETS), 0, ALPHA_BUCKETS - 1)
          buckets[b].moveTo(prev.sx, prev.sy)
          buckets[b].lineTo(cur.sx, cur.sy)
          prev = cur
        }
      }
      for (let b = 0; b < ALPHA_BUCKETS; b++) {
        const t = (b + 0.5) / ALPHA_BUCKETS
        // purple-tinted wireframe, brighter toward the front
        ctx.strokeStyle = `rgba(196, 160, 255, ${0.05 + t * 0.28})`
        ctx.stroke(buckets[b])
      }

      // --- Continent outline dots ---
      // Only the front-facing hemisphere is drawn (back-face culled), binned by
      // depth into the same bucket count so it fills in a few draw calls.
      const dotBuckets: Path2D[] = Array.from(
        { length: ALPHA_BUCKETS },
        () => new Path2D(),
      )
      for (const c of continents) {
        const { sx, sy, z } = rot(c)
        if (z <= 0) continue // back-face cull
        const b = clamp(Math.floor(z * ALPHA_BUCKETS), 0, ALPHA_BUCKETS - 1)
        const r = 0.7 + z * 0.9
        dotBuckets[b].moveTo(sx + r, sy)
        dotBuckets[b].arc(sx, sy, r, 0, Math.PI * 2)
      }
      for (let b = 0; b < ALPHA_BUCKETS; b++) {
        const t = (b + 0.5) / ALPHA_BUCKETS
        ctx.fillStyle = `rgba(214, 190, 255, ${0.12 + t * 0.5})`
        ctx.fill(dotBuckets[b])
      }

      // --- Icon badges on the surface ---
      homes.forEach((home, i) => {
        const el = badgeRefs.current[i]
        if (!el) return
        const { sx, sy, z } = rot(home)
        const depth = (z + 1) / 2 // 0 back .. 1 front
        const scale = 0.72 + depth * 0.36
        const opacity = clamp((z + 0.15) / 0.5, 0, 1)
        el.style.transform = `translate(${sx}px, ${sy}px) translate(-50%, -50%) scale(${scale})`
        el.style.opacity = `${opacity}`
        // Keep depth ordering among badges, but stay well below the Navbar
        // (z-50) so an icon can never paint over the fixed nav.
        el.style.zIndex = `${10 + Math.round(z * 10)}`
        el.style.pointerEvents = z > 0 ? 'auto' : 'none'
      })

      rafId = requestAnimationFrame(frame)
    }
    rafId = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(rafId)
      ro.disconnect()
    }
  }, [])

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    drag.current = {
      startX: e.clientX,
      startY: e.clientY,
      yaw: targetYaw.current,
      tilt: targetTilt.current,
    }
    e.currentTarget.setPointerCapture(e.pointerId)
    e.currentTarget.style.cursor = 'grabbing'
  }

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return
    targetYaw.current =
      drag.current.yaw + (e.clientX - drag.current.startX) * 0.01
    targetTilt.current = clamp(
      drag.current.tilt + (e.clientY - drag.current.startY) * 0.01,
      -1.2,
      1.2,
    )
  }

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return
    drag.current = null
    e.currentTarget.style.cursor = 'grab'
  }

  return (
    <div
      ref={containerRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
      className="relative isolate mx-auto aspect-square w-full max-w-lg cursor-grab touch-none select-none overflow-hidden"
    >
      <canvas ref={canvasRef} className="absolute inset-0" />

      {TECHS.map((tech, i) => (
        <div
          key={tech.name}
          ref={(el) => {
            badgeRefs.current[i] = el
          }}
          style={{ ['--brand' as string]: `#${tech.icon.hex}` }}
          className="group absolute left-0 top-0 will-change-transform"
        >
          <div className="flex h-[90px] w-[90px] items-center justify-center rounded-full border border-white/10 bg-black/60 backdrop-blur-sm">
            <svg
              viewBox="0 0 24 24"
              className="h-[45px] w-[45px] fill-gray-500 transition-colors duration-200 group-hover:[fill:var(--brand)]"
              aria-hidden="true"
            >
              <path d={tech.icon.path} />
            </svg>
          </div>
          <span className="pointer-events-none absolute left-1/2 top-full mt-3 -translate-x-1/2 whitespace-nowrap rounded-md bg-black/60 px-2.5 py-1 text-base text-gray-300 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            {tech.name}
          </span>
        </div>
      ))}
    </div>
  )
}
