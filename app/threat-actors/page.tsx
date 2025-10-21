import { genPageMetadata } from 'app/seo'
import Client from './Client'
import RansomwareVictimsCard from '@/components/RansomwareVictimsCard'
import { Suspense } from 'react'

export const metadata = genPageMetadata({ title: 'Threat Actors' })

export default function ThreatActorsPage() {
  return (
    <>
      <div className="mb-4 xl:hidden">
        <RansomwareVictimsCard maxItems={10} />
      </div>
      <div className="xl:grid xl:grid-cols-4 xl:gap-6">
        <div className="xl:col-span-3">
          <Suspense
            fallback={<div className="py-8 text-gray-500 dark:text-gray-400">Loading…</div>}
          >
            <Client />
          </Suspense>
        </div>
        <div className="hidden xl:mt-22 xl:block">
          <RansomwareVictimsCard maxItems={10} />
        </div>
      </div>
    </>
  )
}
