import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'About' })

export default function AboutPage() {
  return (
    <div className="space-y-8 pt-10 md:pt-14">
      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Mission</h2>
         <p className="text-gray-600 dark:text-gray-400">Curated cybersecurity headlines for fast daily scanning.</p>
        <p className="text-gray-700 dark:text-gray-300">Help security teams and practitioners quickly spot what matters across threat intel, exploits and vulnerabilities, and incident reports.</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">What you’ll find</h2>
        <ul className="list-disc space-y-1 pl-5 text-gray-700 dark:text-gray-300">
          <li>Emerging threats and notable campaigns</li>
          <li>Exploits & vulnerabilities with practical impact</li>
          <li>Threat intelligence and incident reporting</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Editorial policy</h2>
        <ul className="list-disc space-y-1 pl-5 text-gray-700 dark:text-gray-300">
          <li>Prioritize signal over volume and practical relevance</li>
          <li>Favor reputable, primary sources</li>
          <li>Link directly to original publishers</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Data sources & attribution</h2>
        <p className="text-gray-700 dark:text-gray-300">Headlines are gathered from public sources.</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Updates & privacy</h2>
        <ul className="list-disc space-y-1 pl-5 text-gray-700 dark:text-gray-300">
          <li>Lists refresh multiple times per day</li>
          <li>No personal data is collected beyond basic operational analytics (if enabled)</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Contact</h2>
        <p className="text-gray-700 dark:text-gray-300">For tips or corrections, please open an issue on the project repository or reach out via the site’s contact method.</p>
      </section>
    </div>
  )
}
