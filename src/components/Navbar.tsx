'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { HiMenu, HiX, HiChevronDown } from 'react-icons/hi'

const mainNavLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Programs', path: '/programs' },
  { name: 'Events', path: '/events' },
  { name: 'Blog', path: '/blog' },
]

const moreLinks = [
  { name: 'Impact Portfolio', path: '/impact' },
  { name: 'Resources', path: '/resources' },
  { name: 'Contact', path: '/contact' },
]

const apps = [
  { name: 'Wildfire Watch', url: 'https://ewfw-hugafhdag5emcjgy.westus2-01.azurewebsites.net', icon: '🔥' },
  { name: 'Oceanaware Guardian', url: 'https://oceanaware-guardian.vercel.app', icon: '🌊' },
  { name: 'MindMirror', url: 'https://mindmirror-pilot.vercel.app/', icon: '🧠' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [appsDropdownOpen, setAppsDropdownOpen] = useState(false)
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false)
  const pathname = usePathname()

  const isMoreActive = moreLinks.some((link) => pathname === link.path)

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex justify-between items-center py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0 mr-6">
            <Image
              src="/logo.png"
              alt="EcoQuest Foundation Logo"
              width={44}
              height={44}
              className="rounded-lg"
              priority
            />
            <div className="flex flex-col">
              <div className="text-xl font-bold font-heading leading-none whitespace-nowrap">
                <span className="text-primary-green">Eco</span>
                <span className="text-primary-blue">Quest</span>
              </div>
              <span className="text-[10px] font-semibold text-gray-500 tracking-wide">FOUNDATION</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden xl:flex items-center gap-1 flex-1 justify-center">
            {mainNavLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`font-medium text-sm px-3 py-2 rounded-md transition-colors relative group whitespace-nowrap ${
                  pathname === link.path
                    ? 'text-primary-green bg-green-50'
                    : 'text-gray-700 hover:text-primary-green hover:bg-gray-50'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* More Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setMoreDropdownOpen(true)}
              onMouseLeave={() => setMoreDropdownOpen(false)}
            >
              <button
                className={`font-medium text-sm px-3 py-2 rounded-md transition-colors flex items-center gap-1 whitespace-nowrap ${
                  isMoreActive
                    ? 'text-primary-green bg-green-50'
                    : 'text-gray-700 hover:text-primary-green hover:bg-gray-50'
                }`}
              >
                More
                <HiChevronDown className={`w-4 h-4 transition-transform ${moreDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {moreDropdownOpen && (
                <div className="absolute top-full left-0 pt-1 w-48 z-50">
                  <div className="bg-white rounded-lg shadow-xl border border-gray-100 py-1">
                    {moreLinks.map((link) => (
                      <Link
                        key={link.path}
                        href={link.path}
                        className={`block px-4 py-2.5 text-sm font-medium transition-colors ${
                          pathname === link.path
                            ? 'text-primary-green bg-green-50'
                            : 'text-gray-700 hover:text-primary-green hover:bg-gray-50'
                        }`}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Apps Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setAppsDropdownOpen(true)}
              onMouseLeave={() => setAppsDropdownOpen(false)}
            >
              <button className="font-medium text-sm px-3 py-2 rounded-md text-gray-700 hover:text-primary-green hover:bg-gray-50 transition-colors flex items-center gap-1 whitespace-nowrap">
                Our Apps
                <HiChevronDown className={`w-4 h-4 transition-transform ${appsDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {appsDropdownOpen && (
                <div className="absolute top-full right-0 pt-1 w-56 z-50">
                  <div className="bg-white rounded-lg shadow-xl border border-gray-100 py-1">
                    {apps.map((app) => (
                      <a
                        key={app.name}
                        href={app.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-lg">{app.icon}</span>
                        <span className="font-medium text-sm text-gray-700 hover:text-primary-green">{app.name}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* CTA Buttons - Desktop */}
          <div className="hidden xl:flex items-center gap-2 flex-shrink-0 ml-4">
            <Link
              href="/get-involved"
              className="bg-primary-green hover:bg-primary-green-dark text-white font-semibold text-sm px-4 py-2 rounded-lg transition-all hover:shadow-lg whitespace-nowrap"
            >
              Get Involved
            </Link>
            <Link
              href="/donate"
              className="bg-accent-yellow hover:bg-accent-orange text-gray-800 font-bold text-sm px-5 py-2 rounded-lg transition-all shadow-md hover:shadow-lg hover:scale-105 whitespace-nowrap"
            >
              Donate
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="xl:hidden text-gray-700 hover:text-primary-green transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <HiX size={28} /> : <HiMenu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="xl:hidden pb-4 border-t border-gray-100">
            <div className="flex flex-col space-y-1 pt-4">
              {mainNavLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`font-semibold py-3 px-2 rounded-lg transition-colors ${
                    pathname === link.path
                      ? 'text-primary-green bg-green-50'
                      : 'text-gray-700 hover:text-primary-green hover:bg-gray-50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              {/* More Links in Mobile */}
              {moreLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`font-semibold py-3 px-2 rounded-lg transition-colors ${
                    pathname === link.path
                      ? 'text-primary-green bg-green-50'
                      : 'text-gray-700 hover:text-primary-green hover:bg-gray-50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              {/* Apps in Mobile Menu */}
              <div className="pt-2 pb-4 border-t border-gray-200 mt-2">
                <div className="text-sm font-semibold text-gray-500 mb-2 px-2">Our Apps</div>
                {apps.map((app) => (
                  <a
                    key={app.name}
                    href={app.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 py-3 px-2 rounded-lg font-semibold text-gray-700 hover:text-primary-green hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-xl">{app.icon}</span>
                    <span>{app.name}</span>
                  </a>
                ))}
              </div>

              {/* CTA Links */}
              <Link
                href="/get-involved"
                onClick={() => setIsOpen(false)}
                className="font-semibold py-3 px-2 rounded-lg text-gray-700 hover:text-primary-green hover:bg-gray-50 transition-colors"
              >
                Get Involved
              </Link>

              {/* Donate Button - Mobile */}
              <div className="pt-4">
                <Link
                  href="/donate"
                  onClick={() => setIsOpen(false)}
                  className="block text-center bg-accent-yellow hover:bg-accent-orange text-gray-800 font-bold px-6 py-3.5 rounded-lg transition-colors shadow-md"
                >
                  Donate
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
