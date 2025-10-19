import Link from 'next/link'

type Variant = 'solid' | 'outline' | 'ghost' | 'link'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string
  variant?: Variant
  size?: Size
}

const base =
  'inline-flex items-center justify-center font-medium transition-all rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500'

const sizes: Record<Size, string> = {
  sm: 'text-sm px-3 py-2',
  md: 'text-sm px-4 py-2.5',
  lg: 'text-base px-5 py-3',
}

const variants: Record<Variant, string> = {
  solid: 'bg-primary-500 text-white hover:bg-primary-600 dark:hover:bg-primary-400 shadow-sm',
  outline:
    'border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800',
  ghost: 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
  link: 'text-primary-500 hover:text-primary-600 dark:hover:text-primary-400',
}

export default function Button({
  href,
  variant = 'solid',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const cls = `${base} ${sizes[size]} ${variants[variant]} ${className}`
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    )
  }
  return (
    <button className={cls} {...props}>
      {children}
    </button>
  )
}
