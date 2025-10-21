'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from '@/components/Link'
import { useSearchParams } from 'next/navigation'

type Actor = {
  slug: string
  name: string
  aliases: string[]
  country?: string
  description?: string
  refs: string[]
  mitre_attack?: string
  sectors?: string[]
  last_seen?: string
  order?: number
}

export default function Client() {
  const searchParams = useSearchParams()
  const [actors, setActors] = useState<Actor[]>([])
  const [query, setQuery] = useState('')
  const [country, setCountry] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [sector, setSector] = useState<string>('')
  const [sort, setSort] = useState<'name_asc' | 'name_desc' | 'recent'>('recent')

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const res = await fetch('/threat-actors/index.json')
        const data = await res.json()
        if (!cancelled) setActors(data)
      } catch (e) {
        console.error('Failed to load threat actors index', e)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  // Prefill search from ?q= for deep links
  useEffect(() => {
    const q = searchParams?.get('q') || ''
    if (q && !query) setQuery(q)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const countries = useMemo(() => {
    return Array.from(new Set(actors.map((a) => a.country).filter(Boolean))) as string[]
  }, [actors])

  const sectors = useMemo(() => {
    const all = new Set<string>()
    for (const a of actors) {
      for (const s of a.sectors || []) all.add(s)
    }
    return Array.from(all).sort()
  }, [actors])

  const latest = useMemo(() => {
    return [...actors]
      .sort((a, b) => {
        const aHas = !!a.last_seen
        const bHas = !!b.last_seen
        if (aHas && bHas) {
          return new Date(b.last_seen!).getTime() - new Date(a.last_seen!).getTime()
        }
        if (aHas) return -1
        if (bHas) return 1
        // Fallback to input order (higher index means more recent in source list)
        return (b.order ?? 0) - (a.order ?? 0)
      })
      .slice(0, 8)
  }, [actors])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return actors
      .filter((a) => (country ? a.country === country : true))
      .filter((a) => (sector ? (a.sectors || []).includes(sector) : true))
      .filter((a) =>
        !q
          ? true
          : a.name.toLowerCase().includes(q) ||
            (a.aliases || []).some((al) => al.toLowerCase().includes(q)) ||
            (a.description || '').toLowerCase().includes(q)
      )
      .sort((a, b) => {
        if (sort === 'name_desc') return b.name.localeCompare(a.name)
        if (sort === 'recent') {
          const aHas = !!a.last_seen
          const bHas = !!b.last_seen
          if (aHas && bHas) {
            return new Date(b.last_seen!).getTime() - new Date(a.last_seen!).getTime()
          }
          if (aHas) return -1
          if (bHas) return 1
          return (b.order ?? 0) - (a.order ?? 0)
        }
        return a.name.localeCompare(b.name)
      })
  }, [actors, query, country, sector, sort])

  return (
    <div className="space-y-6">
      <div className="space-y-2 pt-3 pb-5 md:space-y-3">
        <h1 className="text-xl leading-8 font-semibold tracking-tight text-gray-900 sm:text-2xl md:text-3xl dark:text-gray-100">
          Threat Actors
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Built from MISP Galaxy, updated daily.
        </p>
        {latest.length > 0 && (
          <div className="rounded-lg border border-gray-200 bg-white/60 p-3 shadow-sm dark:border-gray-800 dark:bg-gray-900/40">
            <div className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Latest actors
            </div>
            <div className="flex flex-wrap gap-2">
              {latest.map((a) => (
                <Link
                  key={a.slug}
                  href={`/threat-actors/${a.slug}`}
                  className="hover:border-primary-400 hover:text-primary-700 dark:hover:text-primary-300 rounded-full border border-gray-200 px-2 py-0.5 text-xs text-gray-700 dark:border-gray-700 dark:text-gray-300"
                >
                  {a.name}
                </Link>
              ))}
            </div>
          </div>
        )}
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-4">
          <input
            type="text"
            placeholder="Search by name, alias, description"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="focus:ring-primary-500 block w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-900 shadow-sm focus:ring-2 sm:col-span-2 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-100"
          />
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="focus:ring-primary-500 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 shadow-sm focus:ring-2 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-100"
          >
            <option value="">All countries</option>
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            className="focus:ring-primary-500 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 shadow-sm focus:ring-2 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-100"
          >
            <option value="">All sectors</option>
            {sectors.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <label htmlFor="sort" className="text-sm text-gray-600 dark:text-gray-400">
            Sort
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as 'name_asc' | 'name_desc' | 'recent')}
            className="focus:ring-primary-500 rounded-md border border-gray-200 bg-white px-2 py-1 text-sm text-gray-900 shadow-sm focus:ring-2 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-100"
          >
            <option value="name_asc">Name A–Z</option>
            <option value="name_desc">Name Z–A</option>
            <option value="recent">Recent (last seen)</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="py-8 text-gray-500 dark:text-gray-400">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="py-8 text-gray-500 dark:text-gray-400">No matching actors</div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {filtered.map((a) => (
            <li key={a.slug} className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
              <div className="flex items-start justify-between">
                <h2 className="text-lg font-bold tracking-tight">
                  <Link
                    href={`/threat-actors/${a.slug}`}
                    className="text-gray-900 dark:text-gray-100"
                  >
                    {a.name}
                  </Link>
                </h2>
                {a.country && (
                  <span className="rounded-full border border-gray-200 px-2 py-0.5 text-xs text-gray-600 dark:border-gray-700 dark:text-gray-300">
                    {a.country}
                  </span>
                )}
              </div>
              {a.aliases?.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {a.aliases.slice(0, 6).map((al) => (
                    <span
                      key={al}
                      className="border-primary-100 bg-primary-50 text-primary-700 dark:border-primary-400/20 dark:bg-primary-400/10 dark:text-primary-300 rounded-full border px-2 py-0.5 text-xs"
                    >
                      {al}
                    </span>
                  ))}
                </div>
              )}
              {a.description && (
                <p className="mt-2 line-clamp-3 text-sm text-gray-600 dark:text-gray-400">
                  {a.description}
                </p>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                {a.mitre_attack && (
                  <a
                    className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                    href={`https://attack.mitre.org/groups/${a.mitre_attack}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    MITRE: {a.mitre_attack} →
                  </a>
                )}
                <Link
                  href={`/threat-actors/${a.slug}`}
                  className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  View profile →
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
