#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const root = path.resolve(__dirname, '..')
const outDir = path.join(root, 'public', 'ransomware')
const outFile = path.join(outDir, 'rss.json')
const SOURCE_URL = 'https://www.ransomware.live/rss.xml'

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

function decodeEntities(s) {
  if (!s) return ''
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}

function stripTags(s) {
  return s.replace(/<[^>]+>/g, '')
}

function getTagValue(block, tag) {
  const lower = block.toLowerCase()
  const openIdx = lower.indexOf(`<${tag}`)
  if (openIdx === -1) return ''
  const gt = block.indexOf('>', openIdx)
  if (gt === -1) return ''
  const closeIdx = lower.indexOf(`</${tag}>`, gt)
  if (closeIdx === -1) return ''
  const raw = block.substring(gt + 1, closeIdx)
  return decodeEntities(stripTags(raw).trim())
}

function parseItems(xml) {
  const items = []
  const itemRe = /<item>([\s\S]*?)<\/item>/gi
  let m
  while ((m = itemRe.exec(xml))) {
    const block = m[1]
    const title = getTagValue(block, 'title')
    const link = getTagValue(block, 'link')
    const description = getTagValue(block, 'description')
    const pubDate = getTagValue(block, 'pubdate')
    const category = getTagValue(block, 'category')
    const guid = getTagValue(block, 'guid')
    // Extract group and victim from title pattern: "<group> has just published a new victim : <victim>"
    let group = ''
    let victim = ''
    const cleanTitle = title.replace(/^[^A-Za-z0-9]+\s*/, '').trim()
    const parts = cleanTitle.split(/\s+has\s+just\s+published\s+a\s+new\s+victim\s*:\s*/i)
    if (parts.length === 2) {
      group = parts[0].trim()
      victim = parts[1].trim()
    }
    // Derive country from <category> when it looks like ISO-3166 alpha-2
    const country = /^[A-Za-z]{2}$/.test(category) ? category.toUpperCase() : ''

    // Build item
    items.push({
      title,
      link,
      summary: description.replace(/\n+/g, ' ').trim(),
      pubDate,
      category,
      guid,
      group,
      victim,
      country,
    })
  }
  return items
}

async function main() {
  ensureDir(outDir)
  const res = await fetch(SOURCE_URL, { redirect: 'follow' })
  if (!res.ok) throw new Error(`Failed to fetch RSS ${res.status}`)
  const xml = await res.text()
  const items = parseItems(xml)
  const payload = {
    updatedAt: new Date().toISOString(),
    count: items.length,
    items,
  }
  fs.writeFileSync(outFile, JSON.stringify(payload, null, 2) + '\n', 'utf8')
  console.log(`Wrote ${items.length} rss items to ${outFile}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
