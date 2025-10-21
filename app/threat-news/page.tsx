import { genPageMetadata } from 'app/seo'
import ThreatNewsLive from '@/components/ThreatNewsLive'

export const metadata = genPageMetadata({ title: 'Threat News' })

export default async function ThreatNewsPage() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h2 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-100">
          Latest external threat news
        </h2>
        <ThreatNewsLive />
      </section>
    </div>
  )
}
