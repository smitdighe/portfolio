// Serverless proxy for live GitHub contribution stats.
//
// Keeps the GitHub token server-side and exposes only the aggregated numbers
// the About bento grid needs. Deploy target: Vercel (Node runtime). Requires
// env vars:
//   GITHUB_TOKEN     — a classic/fine-grained PAT with read:user scope
//   GITHUB_USERNAME  — optional; defaults to "smitdighe"

const QUERY = `
  query ($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
            }
          }
        }
      }
    }
  }
`

function computeStreaks(days) {
  // days: [{ date, count }] sorted ascending by date.
  const empty = { length: 0, start: null, end: null }

  // Longest streak: the longest consecutive run of days with contributions.
  let longest = { ...empty }
  let run = { ...empty }
  for (const d of days) {
    if (d.count > 0) {
      if (run.length === 0) run.start = d.date
      run.length++
      run.end = d.date
      if (run.length > longest.length) longest = { ...run }
    } else {
      run = { ...empty }
    }
  }

  // Current streak: trailing run ending today. A zero on *today itself* does
  // not break the streak (the day may just not have any contributions yet).
  const current = { ...empty }
  let i = days.length - 1
  if (i >= 0 && days[i].count === 0) i-- // tolerate an empty "today"
  for (; i >= 0; i--) {
    if (days[i].count > 0) {
      current.length++
      current.start = days[i].date
      if (!current.end) current.end = days[i].date
    } else {
      break
    }
  }

  return { longest, current }
}

export default async function handler(req, res) {
  const token = process.env.GITHUB_TOKEN
  const login = process.env.GITHUB_USERNAME || 'smitdighe'

  if (!token) {
    res.status(500).json({ error: 'GITHUB_TOKEN is not configured' })
    return
  }

  try {
    const ghRes = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'portfolio-bento',
      },
      body: JSON.stringify({ query: QUERY, variables: { login } }),
    })

    if (!ghRes.ok) {
      res.status(502).json({ error: `GitHub API error ${ghRes.status}` })
      return
    }

    const json = await ghRes.json()
    const calendar =
      json?.data?.user?.contributionsCollection?.contributionCalendar
    if (!calendar) {
      res.status(502).json({ error: 'Malformed GitHub response' })
      return
    }

    const days = calendar.weeks
      .flatMap((w) => w.contributionDays)
      .map((d) => ({ date: d.date, count: d.contributionCount }))
      .sort((a, b) => (a.date < b.date ? -1 : 1))

    const { longest, current } = computeStreaks(days)

    const payload = {
      totalContributions: calendar.totalContributions,
      totalRange: {
        start: days.length ? days[0].date : null,
        end: days.length ? days[days.length - 1].date : null,
      },
      currentStreak: current,
      longestStreak: longest,
    }

    // Cache at the edge for an hour; contribution counts move slowly.
    res.setHeader(
      'Cache-Control',
      's-maxage=3600, stale-while-revalidate=86400',
    )
    res.status(200).json(payload)
  } catch (err) {
    res.status(500).json({ error: err?.message || 'Unknown error' })
  }
}
