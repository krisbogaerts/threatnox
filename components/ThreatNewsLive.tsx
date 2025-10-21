'use client'

import Image from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'

type Item = {
  title: string
  link: string
  pubDate: Date
  categories: string[]
  source?: string
}

type Filter = 'last_20' | 'last_50' | 'last_day' | 'firehose'
type Channel = 'all' | 'emerging' | 'security' | 'threatintel' | 'vulns'

function domainFromUrl(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return ''
  }
}

function faviconUrl(host: string) {
  if (!host) return ''
  // Google s2 favicons; sz=16 keeps it tiny and fast
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=16`
}

function shortSource(host: string) {
  if (!host) return ''
  const parts = host.split('.')
  if (parts.length <= 2) return host
  return parts.slice(-2).join('.')
}

function timeAgo(d: Date): string {
  const sec = Math.max(1, Math.floor((Date.now() - d.getTime()) / 1000))
  if (sec < 60) return `${sec}s`
  const min = Math.floor(sec / 60)
  if (min < 60) return `${min}m`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}h`
  const day = Math.floor(hr / 24)
  return `${day}d`
}

export default function ThreatNewsLive() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<Filter>('last_20')
  const [buildTime, setBuildTime] = useState<number | null>(null)
  const [channel, setChannel] = useState<Channel>('emerging')
  const searchRef = useRef<HTMLInputElement | null>(null)
  const [density, setDensity] = useState<'compact' | 'comfy'>(() => {
    if (typeof window === 'undefined') return 'compact'
    return (localStorage.getItem('tn_density') as 'compact' | 'comfy') || 'compact'
  })
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        setLoading(true)
        setError('')
        // Fetch RSS
        const res = await fetch('/threat-news-live/rss.xml', { cache: 'no-store' })
        if (!res.ok) throw new Error(`RSS ${res.status}`)
        const text = await res.text()
        const parser = new DOMParser()
        const xml = parser.parseFromString(text, 'text/xml')
        const nodes = Array.from(xml.querySelectorAll('item'))
        const parsed: Item[] = nodes.map((n) => ({
          title: n.querySelector('title')?.textContent?.trim() || '',
          link: n.querySelector('link')?.textContent?.trim() || '#',
          pubDate: new Date(n.querySelector('pubDate')?.textContent || ''),
          categories: Array.from(n.querySelectorAll('category'))
            .map((c) => c.textContent?.trim() || '')
            .filter(Boolean),
          source: n.querySelector('source')?.textContent?.trim() || undefined,
        }))
        // Sort newest first
        parsed.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime())
        if (!cancelled) setItems(parsed)
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Failed to load feed'
        if (!cancelled) setError(msg)
      } finally {
        if (!cancelled) setLoading(false)
      }

      try {
        const bt = await fetch('/threat-news-live/build_time.txt', { cache: 'no-store' })
        if (bt.ok) {
          const s = (await bt.text()).trim()
          const n = Number(s)
          if (!Number.isNaN(n) && !cancelled) setBuildTime(n)
        }
      } catch {
        const _ = null
      }
    }

    load()
    return () => {
      cancelled = true
    }
    // Keyboard shortcuts
    function onKeydown(e: KeyboardEvent) {
      if (e.key === '/') {
        e.preventDefault()
        searchRef.current?.focus()
        return
      }
      // Filters 1..4
      if (e.key === '1') setFilter('last_day')
      if (e.key === '2') setFilter('last_20')
      if (e.key === '3') setFilter('last_50')
      if (e.key === '4') setFilter('firehose')
      // Channels q w e r (all, security, threatintel, vulns) and t for emerging
      if (e.key.toLowerCase() === 'q') setChannel('all')
      if (e.key.toLowerCase() === 'w') setChannel('security')
      if (e.key.toLowerCase() === 'e') setChannel('threatintel')
      if (e.key.toLowerCase() === 'r') setChannel('vulns')
      if (e.key.toLowerCase() === 't') setChannel('emerging')
    }

    window.addEventListener('keydown', onKeydown)
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll)
    return () => {
      cancelled = true
      window.removeEventListener('keydown', onKeydown)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('tn_density', density)
    } catch {
      const _ = null
    }
  }, [density])

  const filtered = useMemo(() => {
    let arr = items
    // channel presets
    if (channel !== 'all') {
      arr = arr.filter((i) => {
        const cats = i.categories.map((c) => c.toLowerCase())
        if (channel === 'security') return cats.includes('security')
        if (channel === 'threatintel') return cats.includes('threatintel')
        if (channel === 'vulns') return cats.includes('vulns') || cats.includes('vulnerability')
        // emerging: simple heuristic by tag or keywords in title
        const title = i.title.toLowerCase()
        const kw = ['urgent', 'zero-day', '0-day', 'exploit', 'exploited', 'critical']
        return cats.includes('emerging') || kw.some((k) => title.includes(k))
      })
    }
    // filter
    if (filter === 'last_day') {
      const since = new Date()
      since.setDate(since.getDate() - 1)
      arr = arr.filter((i) => i.pubDate >= since)
    } else if (filter === 'last_20') {
      arr = arr.slice(0, 20)
    } else if (filter === 'last_50') {
      arr = arr.slice(0, 50)
    } // firehose = all

    // search
    const q = search.trim().toLowerCase()
    if (q) {
      const terms = q.split(/\s+/)
      arr = arr.filter((i) => {
        const hay = [
          i.title.toLowerCase(),
          i.source?.toLowerCase() || '',
          ...i.categories.map((c) => c.toLowerCase()),
        ].join(' ')
        return terms.every((t) => hay.includes(t))
      })
    }

    return arr
  }, [items, search, filter, channel])

  const grouped = useMemo(() => {
    const groups: Record<string, Item[]> = {}
    for (const it of filtered) {
      const key = it.pubDate.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
      })
      groups[key] = groups[key] || []
      groups[key].push(it)
    }
    // preserve order by date descending
    const order = Object.keys(groups).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
    return { groups, order }
  }, [filtered])

  const rowPadding = density === 'compact' ? 'py-1' : 'py-2'
  const rowText = density === 'compact' ? 'text-sm' : 'text-[15px]'

  return (
    <div className="space-y-4">
      <div
        className={`sticky top-14 z-10 -mx-2 px-2 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-gray-950/50 ${
          scrolled ? 'border-b border-gray-200 shadow-sm dark:border-gray-800' : ''
        }`}
      >
        <div className="flex items-center justify-between gap-4 py-2">
          <div className="flex flex-wrap items-center gap-2">
            {/* Channel presets */}
            <div className="mr-2 flex flex-wrap items-center gap-2">
              <button
                onClick={() => setChannel('emerging')}
                className={`rounded-full border px-2 py-0.5 text-xs ${channel === 'emerging' ? 'border-primary-400 text-primary-700 dark:text-primary-300' : 'border-gray-300 text-gray-700 dark:border-gray-700 dark:text-gray-300'}`}
                title="t"
              >
                ⚠️ Emerging
              </button>
              <button
                onClick={() => setChannel('security')}
                className={`rounded-full border px-2 py-0.5 text-xs ${channel === 'security' ? 'border-primary-400 text-primary-700 dark:text-primary-300' : 'border-gray-300 text-gray-700 dark:border-gray-700 dark:text-gray-300'}`}
                title="w"
              >
                Security News
              </button>
              <button
                onClick={() => setChannel('threatintel')}
                className={`rounded-full border px-2 py-0.5 text-xs ${channel === 'threatintel' ? 'border-primary-400 text-primary-700 dark:text-primary-300' : 'border-gray-300 text-gray-700 dark:border-gray-700 dark:text-gray-300'}`}
                title="e"
              >
                Threat Intelligence
              </button>
              <button
                onClick={() => setChannel('vulns')}
                className={`rounded-full border px-2 py-0.5 text-xs ${channel === 'vulns' ? 'border-primary-400 text-primary-700 dark:text-primary-300' : 'border-gray-300 text-gray-700 dark:border-gray-700 dark:text-gray-300'}`}
                title="r"
              >
                Exploits & Vulns
              </button>
              <button
                onClick={() => setChannel('all')}
                className={`rounded-full border px-2 py-0.5 text-xs ${channel === 'all' ? 'border-primary-400 text-primary-700 dark:text-primary-300' : 'border-gray-300 text-gray-700 dark:border-gray-700 dark:text-gray-300'}`}
                title="q"
              >
                All
              </button>
            </div>
            {/* ... */}
          </div>
          <div className="text-right text-xs text-gray-500 dark:text-gray-400">
            <div className="hidden md:block">/ focus • 1–4 filters • q/w/e/r/t channel</div>
            <div>
              Updated{' '}
              {buildTime
                ? new Date(buildTime * 1000).toLocaleString()
                : items[0]
                  ? items[0].pubDate.toLocaleString()
                  : '—'}
            </div>
          </div>
        </div>
      </div>

      {/* ... */}

      {loading ? (
        <ul className="mt-4 space-y-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <li key={i} className="animate-pulse">
              <div className="h-3 w-2/3 rounded bg-gray-200 dark:bg-gray-800" />
            </li>
          ))}
        </ul>
      ) : error ? (
        <div className="py-8 text-red-600 dark:text-red-400">{error}</div>
      ) : filtered.length === 0 ? (
        <div className="py-8 text-gray-500 dark:text-gray-400">No matching items</div>
      ) : (
        <div className="space-y-6">
          {grouped.order.map((day) => (
            <div key={day} className="space-y-1.5" id={day.replaceAll(' ', '-')}>
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  {day}
                </div>
                <a
                  href={`#${day.replaceAll(' ', '-')}`}
                  className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 hover:text-gray-500"
                  aria-label={`Anchor link for ${day}`}
                >
                  #
                </a>
              </div>
              <ul className="space-y-1">
                {grouped.groups[day].map((it, idx) => (
                  <li key={idx} className={`${rowPadding} ${rowText} group`}>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 flex-1 items-center gap-2">
                        <a
                          href={it.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="min-w-0 shrink truncate text-gray-900 hover:underline dark:text-gray-100"
                          title={it.title}
                        >
                          {it.title}
                        </a>
                        {it.categories.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {it.categories.slice(0, 3).map((c) => (
                              <span
                                key={c}
                                className="border-primary-100 bg-primary-50 text-primary-700 dark:border-primary-400/20 dark:bg-primary-400/10 dark:text-primary-300 rounded-full border px-2 py-0.5 text-[11px]"
                              >
                                {c}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs whitespace-nowrap text-gray-500 dark:text-gray-400">
                        {timeAgo(it.pubDate)} ·
                        {(() => {
                          const host = domainFromUrl(it.link)
                          const src = faviconUrl(host)
                          return (
                            <>
                              {src && (
                                <Image
                                  src={src}
                                  alt=""
                                  width={16}
                                  height={16}
                                  className="inline-block"
                                />
                              )}
                              <span>{it.source || shortSource(host) || host}</span>
                            </>
                          )
                        })()}
                        <a
                          href={it.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="transition-opacity opacity-0 group-hover:opacity-100"
                          aria-label="Open in new tab"
                        >
                          ↗
                        </a>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
