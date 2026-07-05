import { useEffect, useRef } from 'react'

type Vec3 = { x: number; y: number; z: number }

// --- Pre-baked lat/lng wireframe as arrays of unit vectors, rotated each frame.
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
// Same source data as the Skills globe — reused for the continent-dot render.
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

const toVec = (lat: number, lng: number): Vec3 => {
  const la = (lat * Math.PI) / 180
  const lo = (lng * Math.PI) / 180
  return {
    x: Math.cos(la) * Math.sin(lo),
    y: Math.sin(la),
    z: Math.cos(la) * Math.cos(lo),
  }
}

// Sample dot markers along the continent edges (unit vectors on the sphere).
function buildContinents(): Vec3[] {
  const SPACING = 2 // degrees between dots along an edge
  const dots: Vec3[] = []
  for (const poly of CONTINENTS) {
    for (let i = 0; i < poly.length - 1; i++) {
      const [lat1, lng1] = poly[i]
      const [lat2, lng2] = poly[i + 1]
      const steps = Math.max(
        1,
        Math.round(Math.hypot(lat2 - lat1, lng2 - lng1) / SPACING),
      )
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

// Vadodara, Gujarat, India
const VADODARA = toVec(22.31, 73.18)

const SPIN_SPEED = 0.012 // constant, gentle auto-rotation
// Straight vertical spin axis (no Earth-like axial tilt). A small constant
// viewing tilt tips the camera so we look slightly down onto the sphere.
const VIEW_TILT = 0.32
const ALPHA_BUCKETS = 6 // depth-shaded strokes/dots per frame

export default function LocationGlobe() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const lines = buildWireframe()
    const continents = buildContinents()

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

    let spin = 0
    let rafId = 0
    const frame = (now: number) => {
      spin += SPIN_SPEED

      const cosY = Math.cos(spin)
      const sinY = Math.sin(spin)
      const cosX = Math.cos(VIEW_TILT)
      const sinX = Math.sin(VIEW_TILT)

      const cx = size / 2
      const cy = size / 2
      const R = size * 0.42

      const rot = (p: Vec3) => {
        // 1. spin around the vertical (Y) polar axis
        const x1 = p.x * cosY + p.z * sinY
        const z1 = -p.x * sinY + p.z * cosY
        const y1 = p.y
        // 2. constant camera tilt around X (look slightly from above)
        const y2 = y1 * cosX - z1 * sinX
        const z2 = y1 * sinX + z1 * cosX
        return { sx: cx + x1 * R, sy: cy - y2 * R, z: z2 }
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, size, size)

      // --- Wireframe ---
      ctx.lineWidth = 1
      const buckets: Path2D[] = Array.from(
        { length: ALPHA_BUCKETS },
        () => new Path2D(),
      )
      for (const line of lines) {
        let prev = rot(line[0])
        for (let i = 1; i < line.length; i++) {
          const cur = rot(line[i])
          const depth = (prev.z + cur.z) / 2
          const t = (depth + 1) / 2
          const b = clamp(Math.floor(t * ALPHA_BUCKETS), 0, ALPHA_BUCKETS - 1)
          buckets[b].moveTo(prev.sx, prev.sy)
          buckets[b].lineTo(cur.sx, cur.sy)
          prev = cur
        }
      }
      for (let b = 0; b < ALPHA_BUCKETS; b++) {
        const t = (b + 0.5) / ALPHA_BUCKETS
        ctx.strokeStyle = `rgba(34, 211, 238, ${0.04 + t * 0.16})`
        ctx.stroke(buckets[b])
      }

      // --- Continent outline dots (front hemisphere only) ---
      const dotBuckets: Path2D[] = Array.from(
        { length: ALPHA_BUCKETS },
        () => new Path2D(),
      )
      for (const c of continents) {
        const { sx, sy, z } = rot(c)
        if (z <= 0) continue
        const b = clamp(Math.floor(z * ALPHA_BUCKETS), 0, ALPHA_BUCKETS - 1)
        const r = 0.55 + z * 0.75
        dotBuckets[b].moveTo(sx + r, sy)
        dotBuckets[b].arc(sx, sy, r, 0, Math.PI * 2)
      }
      for (let b = 0; b < ALPHA_BUCKETS; b++) {
        const t = (b + 0.5) / ALPHA_BUCKETS
        ctx.fillStyle = `rgba(103, 232, 249, ${0.14 + t * 0.5})`
        ctx.fill(dotBuckets[b])
      }

      // --- Vadodara marker ---
      const m = rot(VADODARA)
      if (m.z > 0) {
        const depth = (m.z + 1) / 2
        const pulse = (Math.sin(now / 500) + 1) / 2 // 0..1
        // expanding pulse ring
        ctx.beginPath()
        ctx.arc(m.sx, m.sy, 4 + pulse * 7, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(34, 211, 238, ${0.5 * (1 - pulse)})`
        ctx.lineWidth = 1.5
        ctx.stroke()
        // glow
        ctx.beginPath()
        ctx.arc(m.sx, m.sy, 5.5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(34, 211, 238, ${0.25 * depth})`
        ctx.fill()
        // solid dot with light core
        ctx.beginPath()
        ctx.arc(m.sx, m.sy, 3, 0, Math.PI * 2)
        ctx.fillStyle = '#22d3ee'
        ctx.fill()
        ctx.beginPath()
        ctx.arc(m.sx, m.sy, 1.2, 0, Math.PI * 2)
        ctx.fillStyle = '#ecfeff'
        ctx.fill()
      }

      rafId = requestAnimationFrame(frame)
    }
    rafId = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(rafId)
      ro.disconnect()
    }
  }, [])

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[200px]">
      {/* Glow ring behind the globe */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-[8%] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(34,211,238,0.18) 0%, transparent 62%)',
          boxShadow:
            '0 0 40px rgba(34,211,238,0.25), inset 0 0 0 1px rgba(34,211,238,0.18)',
        }}
      />
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div ref={containerRef} className="absolute inset-0" />
    </div>
  )
}
