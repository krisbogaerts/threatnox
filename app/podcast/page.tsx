import podcastData from '@/data/podcastData'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'Podcast' })

export default function Podcast() {
  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pb-8 pt-6 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            SecureHub Podcast
          </h1>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            Deep dives into cybersecurity topics, threat analysis, and conversations with industry
            experts. Subscribe on your favorite podcast platform.
          </p>
          <div className="flex gap-4">
            <a
              href="https://spotify.com/your-podcast"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-primary-500 px-4 py-2 font-medium text-white hover:bg-primary-600 dark:hover:bg-primary-400"
            >
              Listen on Spotify
            </a>
            <a
              href="https://podcasts.apple.com/your-podcast"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Apple Podcasts
            </a>
          </div>
        </div>
        <div className="container py-12">
          <div className="space-y-8">
            {podcastData.map((episode) => (
              <article
                key={episode.title}
                className="rounded-lg border border-gray-200 p-6 dark:border-gray-700"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <time className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(episode.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                    <span className="text-sm font-medium text-primary-500">{episode.duration}</span>
                  </div>
                  <h2 className="text-2xl font-bold leading-8 tracking-tight">
                    <span className="text-gray-900 dark:text-gray-100">{episode.title}</span>
                  </h2>
                  <p className="prose max-w-none text-gray-500 dark:text-gray-400">
                    {episode.description}
                  </p>
                  <div className="flex gap-3">
                    {episode.spotifyUrl && (
                      <a
                        href={episode.spotifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                      >
                        Spotify →
                      </a>
                    )}
                    {episode.appleUrl && (
                      <a
                        href={episode.appleUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                      >
                        Apple Podcasts →
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
