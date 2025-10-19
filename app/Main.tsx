import Link from '@/components/Link'
import Button from '@/components/Button'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'
import NewsletterForm from 'pliny/ui/NewsletterForm'
import podcastData from '@/data/podcastData'
import projectsData from '@/data/projectsData'
import tagData from 'app/tag-data.json'
import { slug } from 'github-slugger'

const MAX_DISPLAY = 5

export default function Home({ posts }) {
  return (
    <>
      {/* Hero */}
      <div className="relative pt-3 pb-5">
        {/* radial background */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.06),rgba(255,255,255,0)_60%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.12),rgba(0,0,0,0)_60%)]" />
        <div className="rounded-lg border border-gray-200 bg-white/80 px-5 py-6 shadow-sm backdrop-blur-[2px] dark:border-gray-800 dark:bg-gray-900/60">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
            {siteMetadata.title}
          </h1>
          <p className="mt-2 max-w-3xl text-base text-gray-600 dark:text-gray-400">
            {siteMetadata.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button href="/blog" variant="solid" size="sm">
              Read the Blog
            </Button>
            <Button href="/podcast" variant="outline" size="sm">
              Listen to Podcast
            </Button>
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pt-3 pb-5 md:space-y-3">
          <h1 className="text-xl leading-8 font-semibold tracking-tight text-gray-900 sm:text-2xl sm:leading-9 md:text-3xl md:leading-10 dark:text-gray-100">
            Latest
          </h1>
          <p className="text-sm leading-7 text-gray-500 dark:text-gray-400">Recent research and posts</p>
        </div>
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {!posts.length && 'No posts found.'}
          {posts.slice(0, MAX_DISPLAY).map((post) => {
            const { slug, date, title, summary, tags } = post
            return (
              <li key={slug} className="py-8">
                <article>
                  <div className="space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
                    <dl>
                      <dt className="sr-only">Published on</dt>
                      <dd className="text-base leading-6 font-medium text-gray-500 dark:text-gray-400">
                        <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
                      </dd>
                    </dl>
                    <div className="space-y-5 xl:col-span-3">
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-2xl leading-8 font-bold tracking-tight">
                            <Link
                              href={`/blog/${slug}`}
                              className="text-gray-900 dark:text-gray-100"
                            >
                              {title}
                            </Link>
                          </h2>
                          <div className="flex flex-wrap">
                            {tags.map((tag) => (
                              <Tag key={tag} text={tag} />
                            ))}
                          </div>
                        </div>
                        <div className="prose max-w-none text-gray-500 dark:text-gray-400">
                          {summary}
                        </div>
                      </div>
                      <div className="text-base leading-6 font-medium">
                        <Link
                          href={`/blog/${slug}`}
                          className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                          aria-label={`Read more: "${title}"`}
                        >
                          Read more &rarr;
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
      </div>

      {/* Podcast Highlights */}
      {podcastData?.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Podcast Highlights
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {podcastData.slice(0, 3).map((ep) => (
              <article
                key={ep.title}
                className="rounded-lg border border-gray-200 p-5 dark:border-gray-800"
              >
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {ep.title}
                </h3>
                <p className="mt-2 line-clamp-3 text-gray-600 dark:text-gray-400">
                  {ep.description}
                </p>
                <div className="mt-3 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <span>{new Date(ep.date).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{ep.duration}</span>
                </div>
                <div className="mt-4 flex gap-3">
                  {ep.spotifyUrl && (
                    <a
                      className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                      href={ep.spotifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Spotify →
                    </a>
                  )}
                  {ep.appleUrl && (
                    <a
                      className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                      href={ep.appleUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Apple →
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* Topics / Tags */}
      {tagData && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Topics
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {Object.keys(tagData)
              .sort(
                (a, b) =>
                  (tagData as Record<string, number>)[b] - (tagData as Record<string, number>)[a]
              )
              .slice(0, 12)
              .map((t) => (
                <Link
                  key={t}
                  href={`/tags/${slug(t)}`}
                  className="hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-700 dark:border-gray-700 dark:text-gray-300"
                >
                  {t} ({(tagData as Record<string, number>)[t]})
                </Link>
              ))}
          </div>
        </div>
      )}

      {/* Featured Projects/Tools */}
      {projectsData?.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Featured Projects
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {projectsData.slice(0, 2).map((p) => (
              <article
                key={p.title}
                className="rounded-lg border border-gray-200 p-5 dark:border-gray-800"
              >
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {p.title}
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">{p.description}</p>
                {p.href && (
                  <a
                    href={p.href}
                    className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 mt-3 inline-block"
                  >
                    Learn more →
                  </a>
                )}
              </article>
            ))}
          </div>
        </div>
      )}
      {posts.length > MAX_DISPLAY && (
        <div className="flex justify-end text-base leading-6 font-medium">
          <Link
            href="/blog"
            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
            aria-label="All posts"
          >
            All Posts &rarr;
          </Link>
        </div>
      )}
      {siteMetadata.newsletter?.provider && (
        <div className="flex items-center justify-center pt-4">
          <NewsletterForm />
        </div>
      )}
    </>
  )
}
