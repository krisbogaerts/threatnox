'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from '@/components/Link'

interface RssItem {
  title: string
  link: string
  summary?: string
  pubDate?: string
  category?: string
  guid?: string
  group?: string
  victim?: string
  country?: string
}

interface RssPayload {
  updatedAt?: string
  count?: number
  items: RssItem[]
}

function countryToFlag(cc?: string) {
  if (!cc) return ''
  const code = cc.toUpperCase()
  if (!/^[A-Z]{2}$/.test(code)) return code
  const pts = [...code].map((c) => 127397 + c.charCodeAt(0))
  return String.fromCodePoint(...pts)
}

export default function RansomwareVictimsCard({ maxItems = 15 }: { maxItems?: number }) {
  const [data, setData] = useState<RssPayload>({ items: [] })
  const [loading, setLoading] = useState(true)
  const [group, setGroup] = useState('')

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const res = await fetch('/ransomware/rss.json', { cache: 'no-store' })
        if (!res.ok) throw new Error('failed rss')
        const payload = (await res.json()) as RssPayload
        if (!cancelled) setData(payload)
      } catch (e) {
        console.error('Failed to load ransomware RSS', e)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const items = useMemo(() => {
    const list = data.items || []
    const filtered = group
      ? list.filter((i) => (i.group || '').toLowerCase() === group.toLowerCase())
      : list
    return filtered.slice(0, maxItems)
  }, [data.items, group, maxItems])

  const groups = useMemo(() => {
    const set = new Set<string>()
    for (const i of data.items || []) if (i.group) set.add(i.group)
    return Array.from(set).sort()
  }, [data.items])

  const updated = data.updatedAt ? new Date(data.updatedAt) : null

  return (
    <aside className="rounded-lg border border-gray-200 bg-white/70 p-3 shadow-sm dark:border-gray-800 dark:bg-gray-900/50">
      <div>
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
          Live Ransomware Victims
        </h3>
        <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
          <span>{updated ? `Updated: ${updated.toLocaleTimeString()}` : ''}</span>
        </div>
      </div>
      <div className="mt-2">
        <select
          className="focus:ring-primary-500 block w-full rounded-md border border-gray-200 bg-white px-2 py-1 text-xs text-gray-900 shadow-sm focus:ring-2 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-100"
          value={group}
          onChange={(e) => setGroup(e.target.value)}
        >
          <option value="">All groups</option>
          {groups.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-3 h-px w-full bg-gray-100 dark:bg-gray-800" />
      {loading ? (
        <div className="py-5 text-center text-sm text-gray-500 dark:text-gray-400">Loading…</div>
      ) : items.length === 0 ? (
        <div className="py-5 text-center text-sm text-gray-500 dark:text-gray-400">No entries</div>
      ) : (
        <ul className="mt-2 space-y-2">
          {items.map((i) => {
            const date = i.pubDate ? new Date(i.pubDate) : null
            const label = i.victim || i.title || 'Open'
            return (
              <li
                key={i.guid || i.link}
                className="relative rounded-md border border-gray-100 p-2 pr-7 pb-6 dark:border-gray-800"
              >
                <div className="min-w-0">
                  <div className="flex items-start gap-2 text-sm font-medium text-gray-800 dark:text-gray-200">
                    {i.country && (
                      <span title={i.country} className="text-gray-700 dark:text-gray-300">
                        {countryToFlag(i.country)}
                      </span>
                    )}
                    <span className="break-words">{i.victim || i.title}</span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                    {i.group && (
                      <Link
                        href={`/threat-actors?q=${encodeURIComponent(i.group)}`}
                        className="hover:border-primary-400 hover:text-primary-700 dark:hover:text-primary-300 rounded-full border border-gray-200 px-2 py-0.5 text-[11px] text-gray-700 dark:border-gray-700 dark:text-gray-300"
                      >
                        {i.group}
                      </Link>
                    )}
                    {date && (
                      <span className="text-gray-500 dark:text-gray-400">
                        {date.toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <a
                  href={i.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${label}`}
                  className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 absolute right-2 bottom-2 text-sm"
                >
                  →
                </a>
              </li>
            )
          })}
        </ul>
      )}
    </aside>
  )
}
