'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { HiMenu, HiX, HiChevronDown } from 'react-icons/hi'

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Programs', path: '/programs' },
  { name: 'Games', path: '/games' },
  { name: 'Blog', path: '/blog' },
  { name: 'Events', path: '/events' },
  { name: 'Resources', path: '/resources' },
  { name: 'Get Involved', path: '/get-involved' },
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
  const pathname = usePathname()

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex flex-col">
            <div className="text-2xl md:text-3xl font-bold font-heading leading-none">
              <span className="text-primary-green">Eco</span>
              <span className="text-primary-blue">Quest</span>
            </div>
            <span className="text-xs font-semibold text-gray-600">Foundation</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`font-semibold transition-colors relative group ${
                  pathname === link.path
                    ? 'text-primary-green'
                    : 'text-gray-700 hover:text-primary-green'
                }`}
              >
                {link.name}
                <span
                  className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary-green transition-transform origin-left ${
                    pathname === link.path ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </Link>
            ))}

            {/* Apps Dropdown */}
            <div className="relative" onMouseEnter={() => setAppsDropdownOpen(true)} onMouseLeave={() => setAppsDropdownOpen(false)}>
              <button className="font-semibold text-gray-700 hover:text-primary-green transition-colors flex items-center gap-1 py-2">
                Our Apps
                <HiChevronDown className={`transition-transform ${appsDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {appsDropdownOpen && (
                <div className="absolute top-full right-0 pt-2 w-64">
                  <div className="bg-white rounded-lg shadow-xl border border-gray-100 py-2">
                    {apps.map((app) => (
                      <a
                        key={app.name}
                        href={app.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-2xl">{app.icon}</span>
                        <span className="font-semibold text-gray-700 hover:text-primary-green">{app.name}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Donate Button - Desktop */}
            <Link
              href="/donate"
              className="bg-accent-yellow hover:bg-accent-orange text-gray-800 font-bold px-6 py-2 rounded-lg transition-all shadow-md hover:shadow-lg hover:scale-105"
            >
              💚 Donate
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-gray-700 hover:text-primary-green transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <HiX size={28} /> : <HiMenu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden pb-4">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`font-semibold transition-colors ${
                    pathname === link.path
                      ? 'text-primary-green'
                      : 'text-gray-700 hover:text-primary-green'
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              {/* Apps in Mobile Menu */}
              <div className="pt-4 border-t border-gray-200">
                <div className="text-sm font-semibold text-gray-500 mb-3">Our Apps</div>
                {apps.map((app) => (
                  <a
                    key={app.name}
                    href={app.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 py-2 font-semibold text-gray-700 hover:text-primary-green transition-colors"
                  >
                    <span className="text-xl">{app.icon}</span>
                    <span>{app.name}</span>
                  </a>
                ))}
              </div>

              {/* Donate Button - Mobile */}
              <div className="pt-4">
                <Link
                  href="/donate"
                  onClick={() => setIsOpen(false)}
                  className="block text-center bg-accent-yellow hover:bg-accent-orange text-gray-800 font-bold px-6 py-3 rounded-lg transition-colors shadow-md"
                >
                  💚 Donate
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
