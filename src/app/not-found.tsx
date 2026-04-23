import Link from 'next/link'

export const metadata = {
  title: 'Page Not Found - EcoQuest Foundation',
  description: 'The page you are looking for could not be found. Explore EcoQuest Foundation programs, games, and resources.',
}

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
      <div className="container-custom text-center px-4 py-20">
        <div className="text-8xl mb-6">🌍</div>
        <h1 className="text-5xl md:text-6xl font-bold font-heading mb-4">
          <span className="text-primary-green">404</span> - Page Not Found
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Looks like this page has gone off the trail! Let us help you find your way back to making an environmental impact.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link href="/" className="btn btn-primary text-lg">
            Go Home
          </Link>
          <Link href="/programs" className="btn btn-outline text-lg">
            Explore Programs
          </Link>
        </div>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-semibold font-heading text-gray-700 mb-6">Popular Pages</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'About Us', path: '/about' },
              { name: 'Games', path: '/games' },
              { name: 'Events', path: '/events' },
              { name: 'Blog', path: '/blog' },
              { name: 'Impact', path: '/impact' },
              { name: 'Resources', path: '/resources' },
              { name: 'Get Involved', path: '/get-involved' },
              { name: 'Contact', path: '/contact' },
            ].map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className="p-3 rounded-lg bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-primary-green font-medium text-sm"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
