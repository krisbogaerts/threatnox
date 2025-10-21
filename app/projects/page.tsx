import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'Projects' })

export default function Projects() {
  return (
    <div className="space-y-6 pt-10 md:pt-14">
      <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">Projects</h1>
      <p className="text-gray-600 dark:text-gray-400">Nothing to show here yet.</p>
    </div>
  )
}
