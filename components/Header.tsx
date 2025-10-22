'use client'

import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Image from 'next/image'
import Link from './Link'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import SearchButton from './SearchButton'
import { useEffect, useMemo, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'

const Header = () => {
  const pathname = usePathname()
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key.toLowerCase() === 'g') {
        const handler = (ev: KeyboardEvent) => {
          const k = ev.key.toLowerCase()
          if (k === 'n') router.push('/threat-news')
          if (k === 'a') router.push('/threat-actors')
          if (k === 'b') router.push('/blog')
          if (k === 't') router.push('/tags')
          if (k === 'p') router.push('/projects')
          if (k === 'o') router.push('/about')
          if (k === 'c') router.push('/podcast')
          window.removeEventListener('keydown', handler, true)
        }
        window.addEventListener('keydown', handler, true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [router])

  const headerClass = useMemo(() => {
    let base =
      'relative z-50 flex flex-nowrap w-full items-center justify-between border-b border-gray-200 bg-white/90 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-950/60 '
    base += scrolled ? 'py-2' : 'py-3'
    if (siteMetadata.stickyNav) base += ' sticky top-0 z-50'
    return base
  }, [scrolled])

  return (
    <header className={headerClass}>
      <Link href="/" aria-label={siteMetadata.headerTitle}>
        <div className="flex shrink-0 items-center gap-0 whitespace-nowrap">
          <div className="mr-0 ml-0 shrink-0">
            <div className="flex h-[60px] w-[60px] items-center justify-center overflow-visible rounded-none sm:h-24 sm:w-24 md:h-28 md:w-28">
              <Image
                src={siteMetadata.siteLogo}
                alt="THREATNOX logo"
                width={100}
                height={100}
                priority
                unoptimized
                className="h-full w-full border-0 object-contain"
              />
            </div>
          </div>
          {typeof siteMetadata.headerTitle === 'string' ? (
            <div className="text-2xl leading-tight font-extrabold md:text-3xl">
              {siteMetadata.headerTitle}
            </div>
          ) : (
            siteMetadata.headerTitle
          )}
        </div>
      </Link>
      <div className="ml-auto flex items-center space-x-1 pl-8 leading-5 sm:space-x-0 sm:pl-10">
        <div className="hidden items-center gap-x-0 sm:flex">
          {headerNavLinks
            .filter((link) => link.href !== '/')
            .map((link) => (
              <Link
                key={link.title}
                href={link.href}
                aria-current={pathname === link.href ? 'page' : undefined}
                className={`m-0 rounded-md px-2 py-2 text-lg font-bold hover:bg-gray-100 hover:text-gray-900 sm:text-xl dark:hover:bg-gray-800 dark:hover:text-white ${
                  pathname === link.href
                    ? 'text-gray-900 underline decoration-2 underline-offset-6 dark:text-white'
                    : 'text-gray-700 dark:text-gray-200'
                }`}
              >
                {link.title}
              </Link>
            ))}
        </div>
        <SearchButton />
        <ThemeSwitch />
        <MobileNav />
      </div>
    </header>
  )
}

export default Header
