// Serverless proxy for the profile README's view counter.
//
// GitHub's image proxy fails to fetch komarev.com on some page loads, which
// shows a broken badge on the profile. Fetching it from here, with retries,
// keeps the original komarev counter (each request still counts one view)
// while GitHub only talks to Vercel. No env vars needed.

const BADGE_URL =
  'https://komarev.com/ghpvc/?username=smitdighe&label=PROFILE+VIEWS&color=FF7B54&style=for-the-badge'
const ATTEMPTS = 3
const TIMEOUT_MS = 3000

async function fetchBadge() {
  let lastError = null
  for (let attempt = 0; attempt < ATTEMPTS; attempt++) {
    try {
      const upstream = await fetch(BADGE_URL, {
        headers: { 'User-Agent': 'portfolio-views-badge' },
        signal: AbortSignal.timeout(TIMEOUT_MS),
      })
      const type = upstream.headers.get('content-type') || ''
      if (upstream.ok && type.startsWith('image/svg+xml')) {
        return await upstream.text()
      }
      lastError = new Error(`komarev responded ${upstream.status} ${type}`)
    } catch (err) {
      lastError = err
    }
  }
  throw lastError
}

export default async function handler(req, res) {
  try {
    const svg = await fetchBadge()
    // Never cache: every request is one profile view.
    res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8')
    res.setHeader(
      'Cache-Control',
      'max-age=0, no-cache, no-store, must-revalidate',
    )
    res.status(200).send(svg)
  } catch (err) {
    res.setHeader('Cache-Control', 'no-store')
    res.status(502).json({ error: err?.message || 'Unknown error' })
  }
}
