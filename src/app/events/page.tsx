import Link from 'next/link'
import EventCarousel from '@/components/shared/EventCarousel'

export const metadata = {
  title: 'Events - EcoQuest Foundation',
  description: 'Join community conservation events including beach cleanups, park restoration, and educational workshops.',
}

export default function Events() {
  const pastEvents = [
    { title: 'Seal Beach Cleanup', date: '2024', members: '~15', icon: '🏖️' },
    { title: 'Cerritos Heritage Park Cleanup', date: '2024', members: '~10', icon: '🌳' },
    { title: 'Cerritos Park East Cleanup', date: '2024', members: '~10', icon: '🌿' },
  ]

  return (
    <>
      <div className="bg-gradient-eco text-white text-center py-24">
        <div className="container-custom">
          <h1 className="text-5xl font-bold mb-4 font-heading">Community Events</h1>
          <p className="text-xl">Join us for hands-on conservation activities and environmental workshops</p>
        </div>
      </div>

      <section className="section-padding">
        <div className="container-custom">
          <div className="section-header">
            <h2 className="section-title">Upcoming Events</h2>
            <div className="section-underline" />
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-12 text-center border-2 border-green-200">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-2xl font-bold text-primary-green mb-3">Coming Soon!</h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-6">
              We're planning exciting new community conservation events. Sign up for our newsletter to be the first to know!
            </p>
            <Link href="/contact" className="btn btn-primary inline-block">
              Get Notified →
            </Link>
          </div>
        </div>
      </section>

      {/* Photo Carousel */}
      <section className="section-padding bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="container-custom">
          <div className="section-header">
            <h2 className="section-title">Past Activities Gallery</h2>
            <div className="section-underline" />
            <p className="text-gray-600 text-lg">
              Explore moments from our community conservation events and environmental education programs
            </p>
          </div>
          <EventCarousel />
        </div>
      </section>

      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="section-header">
            <h2 className="section-title">Past Events Highlights</h2>
            <div className="section-underline" />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {pastEvents.map((event, i) => (
              <div key={i} className="card">
                <div className="bg-primary-blue/20 h-48 flex items-center justify-center text-6xl">
                  {event.icon}
                </div>
                <div className="p-6">
                  <div className="text-primary-blue text-sm font-semibold mb-2">{event.date}</div>
                  <h3 className="font-bold text-xl mb-4 text-primary-green">{event.title}</h3>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary-green">{event.members}</div>
                    <div className="text-sm text-gray-600">Community Members</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
