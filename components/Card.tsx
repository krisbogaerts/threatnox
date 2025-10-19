import Image from './Image'
import Link from './Link'

const Card = ({ title, description, imgSrc, href }) => (
  <div className="md max-w-[544px] p-4 md:w-1/2">
    <div
      className={`${
        imgSrc && 'h-full'
      } focus-within:ring-primary-500 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200 focus-within:ring-1 hover:-translate-y-0.5 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900/60`}
    >
      {imgSrc &&
        (href ? (
          <Link href={href} aria-label={`Link to ${title}`}>
            <Image
              alt={title}
              src={imgSrc}
              className="object-cover object-center md:h-36 lg:h-48"
              width={544}
              height={306}
            />
          </Link>
        ) : (
          <Image
            alt={title}
            src={imgSrc}
            className="object-cover object-center md:h-36 lg:h-48"
            width={544}
            height={306}
          />
        ))}
      <div className="p-6">
        <h2 className="mb-3 text-2xl leading-8 font-bold tracking-tight">
          {href ? (
            <Link href={href} aria-label={`Link to ${title}`}>
              {title}
            </Link>
          ) : (
            title
          )}
        </h2>
        <p className="prose mb-3 max-w-none text-gray-600 dark:text-gray-400">{description}</p>
        {href && (
          <Link
            href={href}
            className="bg-primary-500 hover:bg-primary-600 dark:hover:bg-primary-400 inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-white transition-colors"
            aria-label={`Link to ${title}`}
          >
            Learn more →
          </Link>
        )}
      </div>
    </div>
  </div>
)

export default Card
