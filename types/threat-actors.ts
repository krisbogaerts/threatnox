export interface ThreatActor {
  slug: string
  name: string
  uuid?: string
  description?: string
  aliases: string[]
  refs: string[]
  country?: string
  countries?: string[]
  region?: string
  motivation?: string
  sophistication?: string
  mitre_attack?: string
  related?: unknown[]
  rawMeta?: Record<string, unknown>
}

export interface ThreatActorSearchItem {
  id: string
  name: string
  aliases: string[]
  country?: string
  description: string
}
