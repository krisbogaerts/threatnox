#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import GithubSlugger from 'github-slugger'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const root = path.resolve(__dirname, '..')
const outDir = path.join(root, 'public', 'threat-actors')
const actorsDir = path.join(outDir, 'actors')
const SOURCE_URL =
  'https://raw.githubusercontent.com/MISP/misp-galaxy/main/clusters/threat-actor.json'

/**
 * Ensure directory exists.
 */
function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

/**
 * Write JSON pretty with newline.
 */
function writeJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8')
}

/**
 * Normalize a raw MISP cluster entry into our schema.
 */
function normalizeEntry(entry, slugger) {
  const meta = entry.meta || {}
  const name = entry.value || entry.name || 'Unknown'
  const slug = slugger.slug(name)
  const aliases = Array.isArray(meta.synonyms)
    ? meta.synonyms.filter(Boolean)
    : typeof meta.synonyms === 'string'
    ? [meta.synonyms]
    : []
  const refs = Array.isArray(meta.refs)
    ? meta.refs
    : typeof meta.refs === 'string'
    ? [meta.refs]
    : []
  const countries = Array.isArray(meta.country)
    ? meta.country
    : typeof meta.country === 'string'
    ? [meta.country]
    : []
  const region = Array.isArray(meta.region)
    ? meta.region[0]
    : typeof meta.region === 'string'
    ? meta.region
    : undefined
  const motivation = Array.isArray(meta.motivation)
    ? meta.motivation[0]
    : typeof meta.motivation === 'string'
    ? meta.motivation
    : undefined
  const sophistication = Array.isArray(meta.sophistication)
    ? meta.sophistication[0]
    : typeof meta.sophistication === 'string'
    ? meta.sophistication
    : undefined
  const mitre = Array.isArray(meta['mitre-attack'])
    ? meta['mitre-attack'][0]
    : meta['mitre-attack']
  const sectors = Array.isArray(meta['cfr-target-category'])
    ? meta['cfr-target-category'].filter(Boolean)
    : typeof meta['cfr-target-category'] === 'string'
    ? [meta['cfr-target-category']]
    : []
  const firstSeen = meta['first-seen'] || meta['first_seen'] || undefined
  const lastSeen = meta['last-seen'] || meta['last_seen'] || undefined

  return {
    slug,
    name,
    uuid: entry.uuid || undefined,
    description: entry.description || meta.description || '',
    aliases,
    refs,
    country: countries[0],
    countries,
    region,
    motivation,
    sophistication,
    mitre_attack: mitre,
    sectors,
    first_seen: firstSeen,
    last_seen: lastSeen,
    related: Array.isArray(meta.related) ? meta.related : [],
    rawMeta: meta,
  }
}

async function main() {
  ensureDir(outDir)
  ensureDir(actorsDir)

  console.log('Fetching MISP Galaxy Threat Actors...')
  const res = await fetch(SOURCE_URL, { redirect: 'follow' })
  if (!res.ok) {
    throw new Error(`Failed to fetch source: ${res.status} ${res.statusText}`)
  }
  const data = await res.json()

  const list = (data.values || data.cluster || data || []).filter(Boolean)
  const slugger = new GithubSlugger()
  const normalized = list.map((e, i) => ({ ...normalizeEntry(e, slugger), order: i }))

  // Write index
  writeJSON(path.join(outDir, 'index.json'), normalized)

  // Write per-actor files
  for (const actor of normalized) {
    writeJSON(path.join(actorsDir, `${actor.slug}.json`), actor)
  }

  // Create basic search data (no external dependency). Client will do simple includes matching.
  const searchData = normalized.map((a) => ({
    id: a.slug,
    name: a.name,
    aliases: a.aliases,
    country: a.country,
    description: a.description?.slice(0, 400) || '',
  }))
  writeJSON(path.join(outDir, 'search-data.json'), searchData)

  console.log(`Wrote ${normalized.length} actors to ${outDir}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
