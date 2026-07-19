import Link from 'next/link'
import EventCarousel from '@/components/shared/EventCarousel'

export const metadata = {
  title: 'Events',
  description: 'Join EcoQuest Foundation community conservation events including beach cleanups, park restoration, and environmental education workshops in California and beyond.',
  alternates: { canonical: '/events/' },
  openGraph: {
    title: 'Events - EcoQuest Foundation',
    description: 'Community conservation events including beach cleanups, park restoration, and environmental education workshops.',
  },
}

interface FeaturedEvent {
  title: string
  date: string
  location: string
  image: string
  desc: string
}

interface TimelineEvent {
  name: string
  location: string
  when?: string
}

export default function Events() {
  const featuredEvents: FeaturedEvent[] = [
    {
      title: 'Heritage Park Cleanup',
      date: '2026',
      location: 'Cerritos, CA',
      image: '/images/events/55B367F4-481D-4671-8F55-79ED524A3829.jpeg',
      desc: 'Student volunteers gathered to clean up green spaces and keep our local parks welcoming for the whole community.',
    },
    {
      title: 'Seal Beach Cleanup',
      date: 'March 2025',
      location: 'Seal Beach, CA',
      image: '/images/events/IMG_1601.jpeg',
      desc: 'Volunteers combed the shoreline and jetty at Seal Beach, filling reusable totes with plastic and debris.',
    },
    {
      title: 'Prado Park Restoration & Beautification',
      date: 'September 2024',
      location: 'Chino, CA',
      image: '/images/events/IMG_4346.JPG',
      desc: 'Volunteers cleaned pathways, cleared debris, and repainted park markers to help restore Prado Park.',
    },
  ]

  const timeline: { year: string; events: TimelineEvent[] }[] = [
    {
      year: '2026',
      events: [
        { name: 'Seal Beach Cleanup', location: 'Seal Beach, CA' },
        { name: 'Artesia Park Cleanup', location: 'Artesia, CA' },
        { name: 'Heritage Park Cleanup', location: 'Cerritos, CA' },
      ],
    },
    {
      year: '2025',
      events: [
        { name: 'Seal Beach Cleanup', location: 'Seal Beach, CA' },
        { name: 'Cerritos Regional Park Cleanup', location: 'Cerritos, CA' },
        { name: 'Artesia Park Cleanup', location: 'Artesia, CA' },
      ],
    },
    {
      year: '2024',
      events: [
        { name: 'Save Our Beach Cleanup', location: 'Seal Beach, CA', when: 'December' },
        { name: 'Prado Park Restoration & Beautification', location: 'Chino, CA', when: 'September' },
        { name: 'Campus Cleanup', location: 'Cerritos, CA', when: 'February' },
      ],
    },
  ]

  return (
    <>
      <div className="bg-gradient-eco text-white text-center py-24">
        <div className="container-custom">
          <h1 className="text-5xl font-bold mb-4 font-heading">Community Events</h1>
          <p className="text-xl">Hands-on conservation across California — beach and park cleanups open to all</p>
        </div>
      </div>

      {/* Get Involved CTA */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 md:p-12 border-2 border-green-200 grid md:grid-cols-[1fr_auto] gap-6 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-primary-green mb-3 font-heading">
                Join Our Next Cleanup
              </h2>
              <p className="text-gray-700 text-lg max-w-2xl">
                We host beach and park cleanups throughout the year, open to students, families, Scout troops,
                and community volunteers. Reach out and we&apos;ll let you know when and where the next one is happening.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row md:flex-col gap-3">
              <Link href="/contact/" className="btn btn-primary text-center whitespace-nowrap">
                Get Involved →
              </Link>
              <Link href="/get-involved/" className="btn btn-outline text-center whitespace-nowrap">
                Volunteer Roles
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events (photo tiles) */}
      <section className="section-padding pt-0">
        <div className="container-custom">
          <div className="section-header">
            <h2 className="section-title">Featured Events</h2>
            <div className="section-underline" />
            <p className="text-gray-600 text-lg">A closer look at some of our recent conservation events</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {featuredEvents.map((event, i) => (
              <div key={i} className="card card-hover overflow-hidden flex flex-col">
                <div className="h-56 overflow-hidden bg-gray-100">
                  <img
                    src={event.image}
                    alt={`${event.title} — ${event.location}, ${event.date}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-sm text-primary-blue font-semibold mb-2">
                    <span>{event.date}</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-gray-500">{event.location}</span>
                  </div>
                  <h3 className="font-bold text-xl mb-3 text-primary-green font-heading">{event.title}</h3>
                  <p className="text-gray-600 text-sm">{event.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Photo Gallery Carousel */}
      <section className="section-padding bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="container-custom">
          <div className="section-header">
            <h2 className="section-title">Photo Gallery</h2>
            <div className="section-underline" />
            <p className="text-gray-600 text-lg">
              Moments from our community conservation events and environmental education programs
            </p>
          </div>
          <EventCarousel />
        </div>
      </section>

      {/* Event History Timeline */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom max-w-4xl">
          <div className="section-header">
            <h2 className="section-title">Event History</h2>
            <div className="section-underline" />
            <p className="text-gray-600 text-lg">Our community conservation events, year by year</p>
          </div>
          <div className="space-y-10">
            {timeline.map((group) => (
              <div key={group.year} className="grid md:grid-cols-[auto_1fr] gap-6">
                <div className="md:pt-1">
                  <div className="inline-block bg-primary-green text-white font-bold text-lg px-5 py-2 rounded-full font-heading">
                    {group.year}
                  </div>
                </div>
                <div className="space-y-3">
                  {group.events.map((event, i) => (
                    <div
                      key={i}
                      className="bg-white border-l-4 border-primary-green rounded-lg p-4 flex items-start gap-3 shadow-sm"
                    >
                      <span className="text-primary-green text-xl mt-0.5" aria-hidden>📍</span>
                      <div>
                        <h3 className="font-bold text-gray-800">{event.name}</h3>
                        <p className="text-sm text-gray-500">
                          {event.when ? `${event.when} ${group.year} · ` : ''}
                          {event.location}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-gray-400 mt-10">
            Photos are available for select 2024 events; more coming as we document each cleanup.
          </p>
        </div>
      </section>
    </>
  )
}
