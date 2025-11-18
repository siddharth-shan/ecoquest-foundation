'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { HiMenu, HiX, HiChevronDown } from 'react-icons/hi'

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Programs', path: '/programs' },
  { name: 'Events', path: '/events' },
  { name: 'Blog', path: '/blog' },
  { name: 'Resources', path: '/resources' },
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
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="EcoQuest Foundation Logo"
              width={50}
              height={50}
              className="rounded-lg"
              priority
            />
            <div className="flex flex-col">
              <div className="text-xl md:text-2xl font-bold font-heading leading-none">
                <span className="text-primary-green">Eco</span>
                <span className="text-primary-blue">Quest</span>
              </div>
              <span className="text-xs font-semibold text-gray-600">Foundation</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden xl:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`font-semibold text-[15px] transition-colors relative group py-2 ${
                  pathname === link.path
                    ? 'text-primary-green'
                    : 'text-gray-700 hover:text-primary-green'
                }`}
              >
                {link.name}
                <span
                  className={`absolute -bottom-1 left-0 w-full h-0.5 bg-primary-green transition-transform origin-left ${
                    pathname === link.path ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </Link>
            ))}

            {/* Apps Dropdown */}
            <div className="relative" onMouseEnter={() => setAppsDropdownOpen(true)} onMouseLeave={() => setAppsDropdownOpen(false)}>
              <button className="font-semibold text-[15px] text-gray-700 hover:text-primary-green transition-colors flex items-center gap-1 py-2">
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

            {/* CTA Buttons - Desktop */}
            <div className="flex items-center gap-3 ml-2">
              <Link
                href="/get-involved"
                className="bg-primary-green hover:bg-primary-green-dark text-white font-semibold px-5 py-2.5 rounded-lg transition-all hover:shadow-lg"
              >
                Get Involved
              </Link>
              <Link
                href="/donate"
                className="bg-accent-yellow hover:bg-accent-orange text-gray-800 font-bold px-6 py-2.5 rounded-lg transition-all shadow-md hover:shadow-lg hover:scale-105"
              >
                💚 Donate
              </Link>
            </div>
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
              {navLinks.map((link) => (
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

              {/* Additional Links */}
              <Link
                href="/get-involved"
                onClick={() => setIsOpen(false)}
                className="font-semibold py-3 px-2 rounded-lg text-gray-700 hover:text-primary-green hover:bg-gray-50 transition-colors"
              >
                Get Involved
              </Link>
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="font-semibold py-3 px-2 rounded-lg text-gray-700 hover:text-primary-green hover:bg-gray-50 transition-colors"
              >
                Contact Us
              </Link>

              {/* Donate Button - Mobile */}
              <div className="pt-4">
                <Link
                  href="/donate"
                  onClick={() => setIsOpen(false)}
                  className="block text-center bg-accent-yellow hover:bg-accent-orange text-gray-800 font-bold px-6 py-3.5 rounded-lg transition-colors shadow-md"
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
