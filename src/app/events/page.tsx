import Image from 'next/image'
import Link from 'next/link'
import { HiCalendar, HiClock, HiVideoCamera } from 'react-icons/hi'
import { SiEventbrite } from 'react-icons/si'
import EventCarousel from '@/components/shared/EventCarousel'
import { SEMINAR_CADENCE, pastSeminars, seminars, upcomingSeminars } from '@/data/seminars'

const SITE_URL = 'https://www.ecoquestfoundation.org'

export const metadata = {
  title: 'Events & Online Seminars',
  description:
    'EcoQuest Foundation runs a free biweekly online environmental seminar series plus hands-on beach and park cleanups across California. See upcoming session dates and register.',
  alternates: { canonical: '/events/' },
  openGraph: {
    title: 'Events & Online Seminars - EcoQuest Foundation',
    description:
      'Free biweekly online environmental seminars and hands-on community conservation events in California.',
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
  /** Set when the event was run jointly with another organization. */
  coHosted?: string
}

/**
 * Marks up the seminar series so search engines index each session as a real
 * event rather than as text on a page. Verify output with Google's Rich Results
 * Test after deploying.
 */
function SeminarSeriesJsonLd() {
  const jsonLd = upcomingSeminars.map((seminar) => ({
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: seminar.title,
    description: seminar.description,
    startDate: seminar.startDateTime,
    endDate: seminar.endDateTime,
    eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: {
      '@type': 'VirtualLocation',
      // Point at the registration page, not the raw Zoom room — a join link
      // published in page source invites uninvited guests.
      url: seminar.eventbriteUrl || `${SITE_URL}/events/`,
    },
    image: [`${SITE_URL}/logo.png`],
    organizer: {
      '@type': 'NonprofitOrganization',
      name: 'EcoQuest Foundation',
      url: SITE_URL,
    },
    performer: {
      '@type': 'Organization',
      name: 'EcoQuest Foundation',
    },
    isAccessibleForFree: true,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: seminar.eventbriteUrl || `${SITE_URL}/events/`,
      validFrom: '2026-08-29T00:00:00-07:00',
    },
  }))

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export default function Events() {
  const featuredEvents: FeaturedEvent[] = [
    {
      title: 'Seal Beach Cleanup',
      date: 'March 2025',
      location: 'Seal Beach, CA',
      image: '/images/events/IMG_1601.webp',
      desc: 'Volunteers combed the shoreline and jetty at Seal Beach, filling reusable totes with plastic and debris.',
    },
    {
      title: 'Prado Park Restoration & Beautification',
      date: 'September 2024',
      location: 'Chino, CA',
      image: '/images/events/IMG_4346.webp',
      desc: 'Volunteers cleaned pathways, cleared debris, and repainted park markers to help restore Prado Park.',
    },
    {
      title: 'Heritage Park Cleanup',
      date: '2026',
      location: 'Cerritos, CA',
      image: '/images/events/55B367F4-481D-4671-8F55-79ED524A3829.webp',
      desc: 'Student volunteers gathered to clean up green spaces and keep our local parks welcoming for the whole community.',
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
        {
          name: 'Cerritos Regional Park Cleanup',
          location: 'Cerritos, CA',
          coHosted: 'Co-hosted with a local Scout troop',
        },
        { name: 'Artesia Park Cleanup', location: 'Artesia, CA' },
      ],
    },
    {
      year: '2024',
      events: [
        { name: 'Save Our Beach Cleanup', location: 'Seal Beach, CA', when: 'December' },
        { name: 'Prado Park Restoration & Beautification', location: 'Chino, CA', when: 'September' },
        {
          name: 'Campus Cleanup',
          location: 'Cerritos, CA',
          when: 'February',
          coHosted: 'Co-hosted with a local Scout troop',
        },
      ],
    },
  ]

  return (
    <>
      <SeminarSeriesJsonLd />

      <div className="bg-gradient-eco text-white text-center py-24">
        <div className="container-custom">
          <h1 className="text-5xl font-bold mb-4 font-heading">Events &amp; Online Seminars</h1>
          <p className="text-xl max-w-3xl mx-auto">
            A free biweekly online seminar series, plus hands-on beach and park cleanups across California
          </p>
        </div>
      </div>

      {/* Online Seminar Series — the recurring, open-to-anyone program */}
      <section id="seminars" className="section-padding">
        <div className="container-custom">
          <div className="section-header">
            <h2 className="section-title">Online Seminar Series</h2>
            <div className="section-underline" />
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Free 40-minute sessions on Zoom, open to anyone. Each one is built on work EcoQuest has
              actually done — our apps, our cleanups, and our monthly challenges.
            </p>
            <p className="inline-block mt-5 bg-primary-green/10 text-primary-green-dark font-semibold px-5 py-2 rounded-full text-sm">
              🗓️ {SEMINAR_CADENCE}
            </p>
          </div>

          {upcomingSeminars.length > 0 ? (
            <div className="space-y-6 max-w-5xl mx-auto">
              {upcomingSeminars.map((seminar, index) => (
                <article
                  key={seminar.slug}
                  className="card overflow-hidden p-0 flex flex-col md:flex-row"
                >
                  {/* Session cover — the same art as the Eventbrite listing */}
                  <div className="relative w-full md:w-56 lg:w-64 shrink-0 aspect-[2/1] md:aspect-auto md:self-stretch bg-primary-green/5">
                    <Image
                      src={`/images/seminars/${seminar.slug}-square.webp`}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 256px"
                      loading={index === 0 ? 'eager' : 'lazy'}
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col">
                    <div className="p-6 md:p-7 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="bg-primary-green/10 text-primary-green-dark text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded">
                          Session {index + 1} of {seminars.length}
                        </span>
                        <span className="bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded">
                          Free
                        </span>
                      </div>

                      <h3 className="font-bold text-xl md:text-2xl mb-3 text-gray-900 font-heading leading-snug">
                        {seminar.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-600 mb-4">
                        <span className="inline-flex items-center gap-1.5">
                          <HiCalendar className="text-primary-green shrink-0" aria-hidden />
                          <span className="font-medium text-gray-800">{seminar.displayDate}</span>
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <HiClock className="text-primary-green shrink-0" aria-hidden />
                          {seminar.displayTime}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <HiVideoCamera className="text-primary-green shrink-0" aria-hidden />
                          Online via Zoom
                        </span>
                      </div>

                      <p className="text-gray-700 leading-relaxed mb-5 max-w-prose">
                        {seminar.description}
                      </p>

                      <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm border-t border-gray-100 pt-4">
                        <div>
                          <dt className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-0.5">
                            Who it&apos;s for
                          </dt>
                          <dd className="text-gray-700">{seminar.audience}</dd>
                        </div>
                        <div>
                          <dt className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-0.5">
                            Built on
                          </dt>
                          <dd className="text-gray-700">{seminar.builtOn}</dd>
                        </div>
                      </dl>
                    </div>

                    {/* Actions. The Eventbrite mark is a legitimacy signal: the
                        session is a real listing on a ticketing platform, not a
                        form on our own site. */}
                    <div className="bg-gray-50 border-t border-gray-100 px-6 md:px-7 py-4 flex flex-wrap items-center gap-3">
                      {seminar.eventbriteUrl ? (
                        <a
                          href={seminar.eventbriteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-primary inline-flex items-center justify-center gap-2 whitespace-nowrap"
                        >
                          <SiEventbrite className="text-lg" aria-hidden />
                          Register on Eventbrite
                        </a>
                      ) : (
                        <Link
                          href={`/events/register/?event=${encodeURIComponent(seminar.title)}`}
                          className="btn btn-primary inline-flex items-center justify-center gap-2 whitespace-nowrap"
                        >
                          Register Free
                        </Link>
                      )}
                      {seminar.hasDeck && (
                        <Link
                          href={`/seminars/${seminar.slug}/`}
                          className="btn btn-outline whitespace-nowrap text-sm px-4"
                        >
                          Preview Slides
                        </Link>
                      )}
                      <p className="text-xs text-gray-500 sm:ml-auto">
                        Hosted by EcoQuest Foundation, a 501(c)(3) nonprofit
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">
              Dates for the next series are being finalized.{' '}
              <Link href="/contact/" className="text-primary-green font-semibold hover:underline">
                Contact us
              </Link>{' '}
              to be notified.
            </p>
          )}

          <p className="text-center text-sm text-gray-500 mt-8 max-w-2xl mx-auto">
            Sessions are recorded and posted here afterward, so you can catch up if you miss one.
            Registration is free and there is no minimum age.
          </p>
        </div>
      </section>

      {/* Past Sessions — renders only once a session has actually been held */}
      {pastSeminars.length > 0 && (
        <section className="section-padding pt-0">
          <div className="container-custom max-w-5xl">
            <div className="section-header">
              <h2 className="section-title">Past Sessions</h2>
              <div className="section-underline" />
              <p className="text-gray-600 text-lg">Recordings and recaps from sessions we have run</p>
            </div>
            <div className="space-y-4">
              {pastSeminars.map((seminar) => (
                <div key={seminar.slug} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500 mb-2">
                    <span className="font-semibold text-primary-blue">{seminar.displayDate}</span>
                    <span className="text-gray-300" aria-hidden>
                      •
                    </span>
                    <span>{seminar.recap?.attendees} attended</span>
                  </div>
                  <h3 className="font-bold text-xl mb-2 text-primary-green font-heading">
                    {seminar.title}
                  </h3>
                  <p className="text-gray-700 mb-4">{seminar.recap?.summary}</p>
                  <div className="flex flex-wrap gap-4 text-sm font-semibold">
                    {seminar.recap?.recordingUrl && (
                      <a
                        href={seminar.recap.recordingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-green hover:underline"
                      >
                        ▶ Watch the recording
                      </a>
                    )}
                    {seminar.hasDeck && (
                      <Link
                        href={`/seminars/${seminar.slug}/`}
                        className="text-primary-green hover:underline"
                      >
                        📊 View the slides
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Cleanup CTA */}
      <section className="section-padding pt-0">
        <div className="container-custom">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 md:p-12 border-2 border-green-200 grid md:grid-cols-[1fr_auto] gap-6 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-primary-green mb-3 font-heading">
                Join Our Next Cleanup
              </h2>
              <p className="text-gray-700 text-lg max-w-2xl">
                Alongside the online series, we host beach and park cleanups throughout the year, open to
                students, families, Scout troops, and community volunteers. Reach out and we&apos;ll let you
                know when and where the next one is happening.
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
            <h2 className="section-title">Featured Cleanups</h2>
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
            <h2 className="section-title">Cleanup History</h2>
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
                      <span className="text-primary-green text-xl mt-0.5" aria-hidden>
                        📍
                      </span>
                      <div>
                        <h3 className="font-bold text-gray-800">{event.name}</h3>
                        <p className="text-sm text-gray-500">
                          {event.when ? `${event.when} ${group.year} · ` : ''}
                          {event.location}
                        </p>
                        {event.coHosted && (
                          <p className="text-sm text-gray-500 italic mt-1">{event.coHosted}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="max-w-2xl mx-auto mt-10 space-y-2">
            <p className="text-center text-sm text-gray-500">
              Several of our cleanups are run jointly with local Scout troops, schools, and community
              partners. Where that is the case we have noted it — the service hours belong to everyone who
              showed up.
            </p>
            <p className="text-center text-sm text-gray-400">
              Photos are available for select events; more coming as we document each cleanup.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
