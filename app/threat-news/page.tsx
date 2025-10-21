import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import ListLayout from '@/layouts/ListLayout'
import { genPageMetadata } from 'app/seo'
import { slug } from 'github-slugger'
import ThreatNewsLive from '@/components/ThreatNewsLive'

export const metadata = genPageMetadata({ title: 'Threat News' })

export default async function ThreatNewsPage() {
  const filteredPosts = allCoreContent(
    sortPosts(
      allBlogs.filter((post) => post.tags && post.tags.map((t) => slug(t)).includes('threat-news'))
    )
  )

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h2 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-100">
          Latest external threat news
        </h2>
        <ThreatNewsLive />
      </section>

      <section>
        <ListLayout posts={filteredPosts} title="Threat News" />
      </section>
    </div>
  )
}
