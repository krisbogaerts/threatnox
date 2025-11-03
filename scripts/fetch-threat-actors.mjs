#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import GithubSlugger from 'github-slugger'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const root = path.resolve(__dirname, '..')

// Input aggregated bundle from ta-aggregator
const SRC_PATH = path.join(root, 'public', 'actors.public.json')

// Output folders (current site structure)
const outDir = path.join(root, 'public', 'threat-actors')
const actorsDir = path.join(outDir, 'actors')

// Helpers
function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}
function writeJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8')
}
function toSlug(actor, slugger) {
  if (typeof actor?.id === 'string' && actor.id.startsWith('ta:')) {
    return actor.id.slice(3)
  }
  const name = actor?.name || 'unknown'
  return slugger.slug(name)
}
function unique(arr) {
  const s = new Set((arr || []).filter(Boolean))
  return s.size ? Array.from(s) : []
}

function main() {
  ensureDir(outDir)
  ensureDir(actorsDir)

  if (!fs.existsSync(SRC_PATH)) {
    console.error(`Missing ${SRC_PATH}. Make sure actors.public.json is present.`)
    process.exit(1)
  }

  const raw = JSON.parse(fs.readFileSync(SRC_PATH, 'utf8'))
  const actors = Array.isArray(raw?.actors) ? raw.actors : []
  const slugger = new GithubSlugger()
  const normalized = []

  let written = 0
  for (const a of actors) {
    const slug = toSlug(a, slugger)
    const refs = unique((a.references || []).map((r) => r?.url).filter(Boolean))
    const sectorsTop = Array.isArray(a.sectors) ? a.sectors : null
    const sectorsVictim = a?.diamond?.victim?.sectors
    const sectors =
      Array.isArray(sectorsTop) && sectorsTop.length
        ? sectorsTop
        : Array.isArray(sectorsVictim) && sectorsVictim.length
          ? sectorsVictim
          : null
    const country = a?.country ?? null
    const countriesVictim = a?.diamond?.victim?.geography
    const countries = country
      ? [country]
      : Array.isArray(countriesVictim) && countriesVictim.length
        ? countriesVictim
        : null
    const aliases = unique(a?.aliases || [])
    const ttpIds = unique((a?.ttp_mappings || []).map((t) => t?.technique))
    const out = {
      // match current schema under public/threat-actors/actors/*.json
      slug,
      name: a?.name || slug,
      uuid: null, // no uuid in aggregator export; leave null or add a deterministic hash if later needed
      description: a?.description || '',
      aliases,
      refs,
      country,
      countries,
      sectors,
      related: [], // keep empty; can be populated later if needed
      rawMeta: {
        sources: a?.sources || [],
        description_sources: a?.description_sources || null,
        external_ids: a?.external_ids || null,
        entity_type: a?.entity_type || 'unknown',
        ttp_mappings: ttpIds,
      },
      order: 0, // optional; keep 0 unless your UI depends on this for sort
    }
    normalized.push(out)
    const filePath = path.join(actorsDir, `${slug}.json`)
    writeJSON(filePath, out)
    written++
  }

  // Write index and search data files expected by the site
  const sorted = normalized.sort((a, b) => a.slug.localeCompare(b.slug))
  writeJSON(path.join(outDir, 'index.json'), sorted)
  const searchData = sorted.map((a) => ({
    id: a.slug,
    name: a.name,
    aliases: a.aliases,
    country: a.country,
    description: (a.description || '').slice(0, 400),
  }))
  writeJSON(path.join(outDir, 'search-data.json'), searchData)

  console.log(`Wrote ${written} actor files to ${actorsDir}`)
}

main()
