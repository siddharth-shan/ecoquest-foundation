import Link from 'next/link'
import { HiClock, HiExternalLink, HiGlobeAlt, HiLocationMarker, HiVideoCamera } from 'react-icons/hi'
import { upcomingCampaigns, type CampaignTile } from '@/data/campaigns'
import { seminarTile, upcomingSeminars } from '@/data/seminars'

// The home page's window onto /events/. Reads the same data files as that page
// and its schema.org markup, so it can only ever show an event that is really
// scheduled — and like the rest of the site it is evaluated at build time, so an
// event drops off here on the first deploy after it ends. The whole section
// hides itself when nothing is upcoming rather than showing an empty shelf.

/** How many cards to show. The rest are one click away on /events/. */
const MAX_CARDS = 4

interface UpcomingItem {
  key: string
  start: string
  kind: 'Seminar' | 'Campaign'
  title: string
  tile: CampaignTile
  when: string
  where: string
  inPerson: boolean
  href: string
  ctaLabel: string
  /** Where the event's full card lives on /events/. */
  anchor: string
}

function upcomingItems(): UpcomingItem[] {
  return [
    ...upcomingCampaigns.map((c) => ({
      key: c.slug,
      start: c.startDateTime,
      kind: 'Campaign' as const,
      title: c.title,
      tile: c.tile,
      when: c.displayTime,
      where: c.place ? `${c.place.name}, ${c.place.city}` : c.onlineWhere ?? 'Online',
      inPerson: c.attendanceMode === 'in-person',
      // Prefer the third-party listing, same as the /events/ markup does.
      href: c.listingUrl || c.registrationUrl,
      ctaLabel: c.ctaLabel,
      anchor: '/events/#campaign',
    })),
    ...upcomingSeminars.map((s) => ({
      key: s.slug,
      start: s.startDateTime,
      kind: 'Seminar' as const,
      title: s.title,
      tile: seminarTile(s),
      when: s.displayTime,
      where: 'Online via Zoom',
      inPerson: false,
      href: s.eventbriteUrl || `/events/register/?event=${encodeURIComponent(s.title)}`,
      ctaLabel: s.eventbriteUrl ? 'Register on Eventbrite' : 'Register Free',
      anchor: '/events/#seminars',
    })),
  ]
    .sort((a, b) => Date.parse(a.start) - Date.parse(b.start))
    .slice(0, MAX_CARDS)
}

export default function UpcomingEvents() {
  const items = upcomingItems()
  if (items.length === 0) return null

  return (
    <section className="section-padding bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="container-custom">
        <div className="section-header">
          <h2 className="section-title">Upcoming Events</h2>
          <div className="section-underline" />
          <p className="text-gray-600 text-lg">
            Free online seminars and hands-on community action, open to anyone
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => {
            const external = item.href.startsWith('http')
            return (
              <article
                key={item.key}
                className="card bg-white border-t-4 border-primary-green flex flex-col"
              >
                <div className="p-6 flex-1">
                  <div className="flex gap-4 mb-4">
                    <div className="shrink-0 w-16 self-start rounded-xl border border-primary-green/25 bg-primary-green/5 py-2.5 text-center">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                        {item.tile.top}
                      </div>
                      <div
                        className={`font-bold leading-tight text-primary-green-dark font-heading ${
                          item.tile.main.length > 2 ? 'text-lg' : 'text-2xl'
                        }`}
                      >
                        {item.tile.main}
                      </div>
                      <div className="text-[10px] font-semibold uppercase tracking-wide text-gray-600">
                        {item.tile.bottom}
                      </div>
                    </div>
                    <div className="min-w-0 flex flex-wrap content-start gap-1.5">
                      <span className="bg-primary-green/10 text-primary-green-dark text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                        {item.kind}
                      </span>
                      <span className="bg-amber-100 text-amber-800 text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                        Free
                      </span>
                    </div>
                  </div>

                  <h3 className="font-heading font-bold text-lg text-gray-900 leading-snug mb-3">
                    <Link href={item.anchor} className="hover:text-primary-green">
                      {item.title}
                    </Link>
                  </h3>

                  <div className="flex flex-col gap-1.5 text-sm text-gray-600">
                    <span className="inline-flex items-start gap-1.5">
                      <HiClock className="text-primary-green shrink-0 mt-0.5" aria-hidden />
                      {item.when}
                    </span>
                    <span className="inline-flex items-start gap-1.5">
                      {item.inPerson ? (
                        <HiLocationMarker className="text-primary-green shrink-0 mt-0.5" aria-hidden />
                      ) : item.kind === 'Seminar' ? (
                        <HiVideoCamera className="text-primary-green shrink-0 mt-0.5" aria-hidden />
                      ) : (
                        <HiGlobeAlt className="text-primary-green shrink-0 mt-0.5" aria-hidden />
                      )}
                      {item.where}
                    </span>
                  </div>
                </div>

                <div className="px-6 pb-6">
                  {external ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary text-sm px-4 whitespace-nowrap w-full inline-flex items-center justify-center gap-2"
                    >
                      {item.ctaLabel}
                      <HiExternalLink className="opacity-80" aria-hidden />
                    </a>
                  ) : (
                    <Link href={item.href} className="btn btn-primary text-sm px-4 whitespace-nowrap w-full text-center inline-block">
                      {item.ctaLabel}
                    </Link>
                  )}
                </div>
              </article>
            )
          })}
        </div>

        <div className="text-center mt-10">
          <Link href="/events/" className="btn btn-outline">
            See All Events →
          </Link>
        </div>
      </div>
    </section>
  )
}
