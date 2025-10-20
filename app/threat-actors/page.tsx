import { genPageMetadata } from 'app/seo'
import Client from './Client'
import RansomwareVictimsCard from '@/components/RansomwareVictimsCard'

export const metadata = genPageMetadata({ title: 'Threat Actors' })

export default function ThreatActorsPage() {
  return (
    <>
      <div className="mb-4 xl:hidden">
        <RansomwareVictimsCard maxItems={10} />
      </div>
      <div className="xl:grid xl:grid-cols-4 xl:gap-6">
        <div className="xl:col-span-3">
          <Client />
        </div>
        <div className="hidden xl:mt-22 xl:block">
          <RansomwareVictimsCard maxItems={10} />
        </div>
      </div>
    </>
  )
}
