import Link from 'next/link'
import { slug } from 'github-slugger'
interface Props {
  text: string
}

const Tag = ({ text }: Props) => {
  return (
    <Link
      href={`/tags/${slug(text)}`}
      className="border-primary-100 bg-primary-50 text-primary-700 hover:bg-primary-100 dark:border-primary-400/20 dark:bg-primary-400/10 dark:text-primary-300 dark:hover:bg-primary-400/20 mr-2 inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium transition-colors"
    >
      {text.split(' ').join('-')}
    </Link>
  )
}

export default Tag
