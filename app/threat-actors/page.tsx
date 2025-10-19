import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import ListLayout from '@/layouts/ListLayout'
import { genPageMetadata } from 'app/seo'
import { slug } from 'github-slugger'

export const metadata = genPageMetadata({ title: 'Threat Actors' })

export default async function ThreatActorsPage() {
  const filteredPosts = allCoreContent(
    sortPosts(
      allBlogs.filter((post) => post.tags && post.tags.map((t) => slug(t)).includes('threat-actor'))
    )
  )

  return <ListLayout posts={filteredPosts} title="Threat Actors" />
}
