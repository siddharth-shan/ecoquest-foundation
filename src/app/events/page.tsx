import Link from 'next/link'
import {
  HiCalendar,
  HiClock,
  HiExternalLink,
  HiGlobeAlt,
  HiLocationMarker,
  HiVideoCamera,
} from 'react-icons/hi'
import EventCarousel from '@/components/shared/EventCarousel'
import { CAMPAIGN_BLURB, CAMPAIGN_TITLE, upcomingCampaigns } from '@/data/campaigns'
import {
  SEMINAR_CADENCE,
  pastSeminars,
  seminarTile,
  seminars,
  upcomingSeminars,
} from '@/data/seminars'

const SITE_URL = 'https://www.ecoquestfoundation.org'

export const metadata = {
  title: 'Events & Online Seminars',
  description:
    'EcoQuest Foundation runs a free biweekly online environmental seminar series plus hands-on beach and park cleanups across California, including the October Environmental Action Campaign. See upcoming dates and register.',
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
 * Position in the series, counted over every session rather than over the
 * upcoming ones. Once session 1 has been held it leaves the upcoming list, and
 * numbering off that list would relabel session 3 as "Session 1 of 5".
 */
function sessionNumber(slug: string) {
  return seminars.findIndex((s) => s.slug === slug) + 1
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

/**
 * Marks up the time-boxed campaigns. Kept separate from the seminar markup
 * because the two differ in the field that matters most to a search engine:
 * a seminar is always online, while a campaign may be a physical event with a
 * street address, and Google treats those as different kinds of result.
 */
function CampaignJsonLd() {
  const jsonLd = upcomingCampaigns.map((campaign) => {
    // Prefer a third-party listing wherever one exists. Pointing schema.org at
    // our own form would have the site cite itself as the public record.
    const publicUrl = campaign.listingUrl || campaign.registrationUrl

    return {
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: `EcoQuest ${campaign.title}`,
      description: campaign.description,
      startDate: campaign.startDateTime,
      endDate: campaign.endDateTime,
      eventAttendanceMode:
        campaign.attendanceMode === 'in-person'
          ? 'https://schema.org/OfflineEventAttendanceMode'
          : 'https://schema.org/OnlineEventAttendanceMode',
      eventStatus: 'https://schema.org/EventScheduled',
      location:
        campaign.attendanceMode === 'in-person' && campaign.place
          ? {
              '@type': 'Place',
              name: campaign.place.name,
              address: {
                '@type': 'PostalAddress',
                streetAddress: campaign.place.street,
                addressLocality: campaign.place.city,
                addressRegion: campaign.place.region,
                postalCode: campaign.place.postalCode,
                addressCountry: 'US',
              },
            }
          : {
              '@type': 'VirtualLocation',
              url: publicUrl,
            },
      image: [`${SITE_URL}/logo.png`],
      organizer: {
        '@type': 'NonprofitOrganization',
        name: 'EcoQuest Foundation',
        url: SITE_URL,
      },
      isAccessibleForFree: true,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        url: publicUrl,
        validFrom: '2026-09-29T00:00:00-07:00',
      },
    }
  })

  if (jsonLd.length === 0) return null

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
      <CampaignJsonLd />

      <div className="bg-gradient-eco text-white text-center py-24">
        <div className="container-custom">
          <h1 className="text-5xl font-bold mb-4 font-heading">Events &amp; Online Seminars</h1>
          <p className="text-xl max-w-3xl mx-auto">
            A free biweekly online seminar series, plus hands-on beach and park cleanups across California
          </p>
        </div>
      </div>

      {/* Time-boxed campaigns. Placed above the seminar series on purpose: these
          close within weeks, and a dated thing that expires should outrank a
          recurring thing that runs all term. The section removes itself once
          every campaign in the data file has ended. */}
      {upcomingCampaigns.length > 0 && (
        <section
          id="campaign"
          className="section-padding bg-gradient-to-br from-green-50 to-emerald-50"
        >
          <div className="container-custom">
            <div className="section-header">
              <span className="inline-block mb-4 bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full">
                Open now
              </span>
              <h2 className="section-title">{CAMPAIGN_TITLE}</h2>
              <div className="section-underline" />
              <p className="text-gray-600 text-lg max-w-3xl mx-auto">{CAMPAIGN_BLURB}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto items-stretch">
              {upcomingCampaigns.map((campaign) => (
                <article
                  key={campaign.slug}
                  className="card bg-white border-t-4 border-primary-green flex flex-col"
                >
                  <div className="p-6 md:p-7 flex-1">
                    <div className="flex gap-5">
                      {/* Same date tile as the seminar cards, but the three
                          lines come from the data file rather than being split
                          out of a display string — a month-long campaign has no
                          single weekday to parse. */}
                      <div className="shrink-0 w-16 md:w-20 self-start rounded-xl border border-primary-green/25 bg-primary-green/5 py-3 text-center">
                        <div className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-500">
                          {campaign.tile.top}
                        </div>
                        <div
                          className={`font-bold leading-tight text-primary-green-dark font-heading ${
                            campaign.tile.main.length > 2
                              ? 'text-lg md:text-xl'
                              : 'text-2xl md:text-3xl'
                          }`}
                        >
                          {campaign.tile.main}
                        </div>
                        <div className="text-[10px] md:text-xs font-semibold uppercase tracking-wide text-gray-600">
                          {campaign.tile.bottom}
                        </div>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="bg-primary-green/10 text-primary-green-dark text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded">
                            {campaign.attendanceMode === 'in-person' ? 'In person' : 'Online'}
                          </span>
                          <span className="bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded">
                            Free
                          </span>
                        </div>
                        <h3 className="font-bold text-xl md:text-2xl text-gray-900 font-heading leading-snug">
                          {campaign.title}
                        </h3>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 text-sm text-gray-600 mt-5 mb-4">
                      <span className="inline-flex items-center gap-1.5">
                        <HiCalendar className="text-primary-green shrink-0" aria-hidden />
                        <span className="font-medium text-gray-800">{campaign.displayDate}</span>
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <HiClock className="text-primary-green shrink-0" aria-hidden />
                        {campaign.displayTime}
                      </span>
                      {campaign.place ? (
                        <span className="inline-flex items-start gap-1.5">
                          <HiLocationMarker
                            className="text-primary-green shrink-0 mt-0.5"
                            aria-hidden
                          />
                          <span>
                            <span className="font-medium text-gray-800">{campaign.place.name}</span>
                            <br />
                            {campaign.place.street}, {campaign.place.city}, {campaign.place.region}{' '}
                            {campaign.place.postalCode}
                          </span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5">
                          <HiGlobeAlt className="text-primary-green shrink-0" aria-hidden />
                          {campaign.onlineWhere}
                        </span>
                      )}
                    </div>

                    <p className="text-gray-700 leading-relaxed mb-5">{campaign.description}</p>

                    {campaign.details && (
                      <ul className="space-y-1.5 text-sm text-gray-700 mb-5">
                        {campaign.details.map((detail) => (
                          <li key={detail} className="flex gap-2">
                            <span className="text-primary-green font-bold shrink-0" aria-hidden>
                              •
                            </span>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    <dl className="grid gap-3 text-sm border-t border-gray-100 pt-4">
                      <div>
                        <dt className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-0.5">
                          Service hours
                        </dt>
                        <dd className="text-gray-700">{campaign.serviceHours}</dd>
                      </div>
                      <div>
                        <dt className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-0.5">
                          Who it&apos;s for
                        </dt>
                        <dd className="text-gray-700">{campaign.audience}</dd>
                      </div>
                    </dl>
                  </div>

                  <div className="bg-gray-50 border-t border-gray-100 px-6 md:px-7 py-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <a
                        href={campaign.registrationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary inline-flex items-center justify-center gap-2 whitespace-nowrap"
                      >
                        {campaign.ctaLabel}
                        <HiExternalLink className="text-base opacity-80" aria-hidden />
                      </a>
                      {/* Links out to a third-party listing only once one really
                          exists — see listingUrl in src/data/campaigns.ts. */}
                      {campaign.listingUrl && (
                        <a
                          href={campaign.listingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline whitespace-nowrap text-sm px-4"
                        >
                          View on {campaign.listingLabel}
                        </a>
                      )}
                      {campaign.place && (
                        <a
                          href={campaign.place.mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-semibold text-primary-green hover:underline whitespace-nowrap"
                        >
                          Get directions
                        </a>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-3">
                      Hosted by EcoQuest Foundation, a 501(c)(3) nonprofit
                      {campaign.supportedBy ? `, ${campaign.supportedBy}` : ''}
                    </p>
                  </div>
                </article>
              ))}
            </div>

            {/* The flyer. Every fact on it is already stated in real text in the
                cards above — this is the shareable copy, not the record. It is
                rendered from src/data/campaigns.ts by
                docs/eventbrite/gen-campaign-poster.py, so re-run that script
                when a detail changes: corrected text greps clean while a stale
                claim survives inside a PNG. */}
            <div className="mt-10 max-w-3xl mx-auto bg-white rounded-2xl border border-green-200 p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-5 sm:gap-7">
              <a
                href="/images/campaigns/october-2026-poster.png"
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0"
              >
                <img
                  src="/images/campaigns/october-2026-poster.webp"
                  alt="October Environmental Action Campaign flyer — the California Biodiversity Challenge running October 1–31, and the Friendship Park community cleanup on Sunday, October 11."
                  width={1200}
                  height={1700}
                  className="w-28 sm:w-32 h-auto rounded-lg border border-gray-200 shadow-sm"
                  loading="lazy"
                />
              </a>
              <div className="text-center sm:text-left">
                <h3 className="font-bold text-lg text-gray-900 font-heading mb-1.5">
                  Print or share the flyer
                </h3>
                <p className="text-sm text-gray-600 mb-4 max-w-prose">
                  One page with both events, the Friendship Park address, and a QR code for each
                  sign-up form — the same details as the cards above. Useful for a classroom wall,
                  a library noticeboard, or a group chat.
                </p>
                <a
                  href="/images/campaigns/october-2026-poster.png"
                  download
                  className="btn btn-outline text-sm px-4 inline-flex items-center justify-center whitespace-nowrap"
                >
                  Download the flyer
                </a>
              </div>
            </div>

            <p className="text-center text-sm text-gray-500 mt-8 max-w-2xl mx-auto">
              Questions about either one, or about logging service hours for a school or award
              program?{' '}
              <Link href="/contact/" className="text-primary-green font-semibold hover:underline">
                Get in touch
              </Link>
              .
            </p>
          </div>
        </section>
      )}

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
              {upcomingSeminars.map((seminar) => (
                <article key={seminar.slug} className="card border-l-4 border-primary-green">
                  <div className="p-6 md:p-8 flex gap-5 md:gap-7">
                    {/* Date tile. Sessions are two weeks apart, so the date is
                        the thing a reader scans for — it gets its own anchor
                        instead of a line in the meta row. Hidden on phones,
                        where a 64px column would squeeze the text into a
                        gutter; the meta row carries the date there instead. */}
                    <div className="hidden sm:block shrink-0 w-16 md:w-20 self-start rounded-xl border border-primary-green/25 bg-primary-green/5 py-3 text-center">
                      <div className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-500">
                        {seminarTile(seminar).top}
                      </div>
                      <div className="text-2xl md:text-3xl font-bold leading-tight text-primary-green-dark font-heading">
                        {seminarTile(seminar).main}
                      </div>
                      <div className="text-[10px] md:text-xs font-semibold uppercase tracking-wide text-gray-600">
                        {seminarTile(seminar).bottom}
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="bg-primary-green/10 text-primary-green-dark text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded">
                          Session {sessionNumber(seminar.slug)} of {seminars.length}
                        </span>
                        <span className="bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded">
                          Free
                        </span>
                      </div>

                      <h3 className="font-bold text-xl md:text-2xl mb-3 text-gray-900 font-heading leading-snug">
                        {seminar.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-600 mb-4">
                        <span className="sm:hidden inline-flex items-center gap-1.5">
                          <HiCalendar className="text-primary-green shrink-0" aria-hidden />
                          <span className="font-medium text-gray-800">{seminar.displayDate}</span>
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <HiClock className="text-primary-green shrink-0" aria-hidden />
                          <span className="font-medium text-gray-800">{seminar.displayTime}</span>
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <HiVideoCamera className="text-primary-green shrink-0" aria-hidden />
                          Online via Zoom
                        </span>
                      </div>

                      <p className="text-gray-700 leading-relaxed mb-5 max-w-prose">
                        {seminar.description}
                      </p>

                      <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm border-t border-gray-100 pt-4">
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
                  </div>

                  {/* Naming Eventbrite in the link text is the legitimacy
                      signal: registration is held by a ticketing platform, not
                      by a form on our own site. Their logo is deliberately not
                      used — the wordmark is their trademark and we have no
                      partnership with them to display it. */}
                  <div className="bg-gray-50 border-t border-gray-100 px-6 md:px-8 py-4 flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex flex-wrap items-center gap-3">
                      {seminar.eventbriteUrl ? (
                        <a
                          href={seminar.eventbriteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-primary inline-flex items-center justify-center gap-2 whitespace-nowrap"
                        >
                          Register on Eventbrite
                          <HiExternalLink className="text-base opacity-80" aria-hidden />
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
                    </div>
                    <p className="text-xs text-gray-500 sm:ml-auto sm:text-right">
                      Hosted by EcoQuest Foundation, a 501(c)(3) nonprofit
                    </p>
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
            Every session has a permanent slide-deck page on this site, so you can read through one
            you missed or revisit it afterward.
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
              <p className="text-gray-600 text-lg">
                The slide deck from each session stays online at a permanent link. Recaps and
                recordings are added after the session, once there is something real to report.
              </p>
            </div>
            <div className="space-y-4">
              {pastSeminars.map((seminar) => (
                <article
                  key={seminar.slug}
                  className="bg-white border border-gray-200 border-l-4 border-l-gray-300 rounded-xl p-6 shadow-sm"
                >
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500 mb-2">
                    <span className="font-semibold text-gray-700">
                      Session {sessionNumber(seminar.slug)} · {seminar.displayDate}
                    </span>
                    {/* Attendance prints only when a real number was recorded. */}
                    {typeof seminar.recap?.attendees === 'number' && (
                      <>
                        <span className="text-gray-300" aria-hidden>
                          •
                        </span>
                        <span>{seminar.recap.attendees} attended</span>
                      </>
                    )}
                  </div>

                  <h3 className="font-bold text-xl mb-2 text-gray-900 font-heading">
                    {seminar.title}
                  </h3>

                  {seminar.recap?.summary && (
                    <p className="text-gray-700 mb-4 max-w-prose">{seminar.recap.summary}</p>
                  )}

                  <div className="flex flex-wrap items-center gap-3 mt-4">
                    {seminar.hasDeck && (
                      <Link
                        href={`/seminars/${seminar.slug}/`}
                        className="btn btn-outline text-sm px-4 whitespace-nowrap"
                      >
                        View the slide deck
                      </Link>
                    )}
                    {seminar.recap?.recordingUrl && (
                      <a
                        href={seminar.recap.recordingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline text-sm px-4 whitespace-nowrap inline-flex items-center gap-2"
                      >
                        Watch the recording
                        <HiExternalLink className="text-base opacity-80" aria-hidden />
                      </a>
                    )}
                  </div>
                </article>
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
              {/* Worded off the campaign data rather than hardcoded, so this
                  does not point at a card that has since expired away. */}
              <p className="text-gray-700 text-lg max-w-2xl">
                {upcomingCampaigns.some((c) => c.attendanceMode === 'in-person')
                  ? 'Beyond the cleanup already on the calendar above, we run beach and park cleanups throughout the year, open to students, families, Scout troops, and community volunteers. Reach out and we’ll let you know when and where the next one is happening.'
                  : 'Alongside the online series, we host beach and park cleanups throughout the year, open to students, families, Scout troops, and community volunteers. Reach out and we’ll let you know when and where the next one is happening.'}
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
