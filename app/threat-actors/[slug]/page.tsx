import fs from 'fs'
import path from 'path'
import Link from '@/components/Link'
import { notFound } from 'next/navigation'

interface Actor {
  slug: string
  name: string
  aliases: string[]
  country?: string
  countries?: string[]
  description?: string
  refs: string[]
  mitre_attack?: string
  motivation?: string
  sophistication?: string
  region?: string
}

function readJSON<T>(p: string): T | null {
  try {
    const s = fs.readFileSync(p, 'utf8')
    return JSON.parse(s) as T
  } catch {
    return null
  }
}

export async function generateStaticParams() {
  const indexPath = path.join(process.cwd(), 'public', 'threat-actors', 'index.json')
  const list = readJSON<Actor[]>(indexPath) || []
  return list.map((a) => ({ slug: a.slug }))
}

export default async function ThreatActorPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params
  const file = path.join(
    process.cwd(),
    'public',
    'threat-actors',
    'actors',
    `${slug}.json`
  )
  const actor = readJSON<Actor>(file)
  if (!actor) return notFound()

  return (
    <div className="space-y-6">
      <header className="space-y-2 pt-3 pb-3">
        <div className="flex items-start justify-between">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            {actor.name}
          </h1>
          {actor.country && (
            <span className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-700 dark:border-gray-700 dark:text-gray-300">
              {actor.country}
            </span>
          )}
        </div>
        {actor.aliases?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {actor.aliases.slice(0, 10).map((al) => (
              <span
                key={al}
                className="rounded-full border border-primary-100 bg-primary-50 px-2 py-0.5 text-xs text-primary-700 dark:border-primary-400/20 dark:bg-primary-400/10 dark:text-primary-300"
              >
                {al}
              </span>
            ))}
          </div>
        )}
      </header>

      {actor.description && (
        <section>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Overview
          </h2>
          <p className="prose max-w-none text-gray-700 dark:prose-invert/80 dark:text-gray-300">
            {actor.description}
          </p>
        </section>
      )}

      <section>
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Quick facts
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {actor.mitre_attack && (
            <div className="rounded-lg border border-gray-200 p-3 text-sm dark:border-gray-800">
              <div className="text-gray-500 dark:text-gray-400">MITRE ATT&CK</div>
              <a
                href={`https://attack.mitre.org/groups/${actor.mitre_attack}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:underline dark:text-primary-400"
              >
                {actor.mitre_attack}
              </a>
            </div>
          )}
          {actor.motivation && (
            <div className="rounded-lg border border-gray-200 p-3 text-sm dark:border-gray-800">
              <div className="text-gray-500 dark:text-gray-400">Motivation</div>
              <div>{actor.motivation}</div>
            </div>
          )}
          {actor.sophistication && (
            <div className="rounded-lg border border-gray-200 p-3 text-sm dark:border-gray-800">
              <div className="text-gray-500 dark:text-gray-400">Sophistication</div>
              <div>{actor.sophistication}</div>
            </div>
          )}
          {actor.region && (
            <div className="rounded-lg border border-gray-200 p-3 text-sm dark:border-gray-800">
              <div className="text-gray-500 dark:text-gray-400">Region</div>
              <div>{actor.region}</div>
            </div>
          )}
        </div>
      </section>

      {actor.refs?.length > 0 && (
        <section>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            References
          </h2>
          <ul className="space-y-2 text-sm">
            {actor.refs.map((r) => (
              <li key={r}>
                <a
                  href={r}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:underline dark:text-primary-400"
                >
                  {r}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="pt-2">
        <Link href="/threat-actors" className="text-primary-600 hover:underline dark:text-primary-400">
          ← Back to Threat Actors
        </Link>
      </div>
    </div>
  )
}
