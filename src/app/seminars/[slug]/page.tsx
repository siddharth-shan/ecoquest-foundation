import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import SlideDeck from '@/components/shared/SlideDeck'
import { decks } from '@/data/decks'
import { getSeminar, seminars, SERIES } from '@/data/seminars'
import { ogImage } from '@/lib/og'

/** Static export: one page per seminar that has a deck. */
export function generateStaticParams() {
  return seminars.filter((s) => s.hasDeck).map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const seminar = getSeminar(slug)
  if (!seminar) return {}

  return {
    title: `${seminar.title} — Seminar Slides`,
    description: seminar.metaDescription,
    alternates: { canonical: `/seminars/${seminar.slug}/` },
    openGraph: {
      title: `${seminar.title} - ${SERIES[seminar.series].name}`,
      description: seminar.metaDescription,
      images: ogImage(`seminar-${seminar.slug}`, `${seminar.title} — ${SERIES[seminar.series].name}`),
    },
  }
}

export default async function SeminarDeckPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const seminar = getSeminar(slug)
  const deck = decks[slug]

  if (!seminar || !deck) notFound()

  // Pick the public fields out explicitly rather than spreading the slide.
  // Speaker notes must not reach the browser, and a static export serializes
  // whatever is handed to a client component straight into the page source —
  // so anything not listed here is what keeps them off the site.
  const slides = deck.map(({ title, eyebrow, bullets, callout }) => ({
    title,
    eyebrow,
    bullets,
    callout,
  }))

  return (
    <>
      <SlideDeck
        deckTitle={seminar.title}
        seriesName={SERIES[seminar.series].name}
        sessionDate={seminar.displayDate}
        slides={slides}
      />

      {/* The deck above is a client component that shows one slide at a time, so
          on its own the page's HTML holds only the first slide. This section is
          rendered on the server and carries the whole deck as text: readable
          without stepping through, and by search engines and screen readers. */}
      <section className="container-custom pb-16">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-bold text-primary-green font-heading mb-3">
            About this session
          </h2>
          <p className="text-gray-700 text-lg mb-4">{seminar.description}</p>
          <dl className="text-gray-700 space-y-1 mb-10">
            <div>
              <dt className="inline font-semibold">When: </dt>
              <dd className="inline">
                {seminar.displayDate}, {seminar.displayTime}
              </dd>
            </div>
            <div>
              <dt className="inline font-semibold">For: </dt>
              <dd className="inline">{seminar.audience}</dd>
            </div>
            <div>
              <dt className="inline font-semibold">Built on: </dt>
              <dd className="inline">{seminar.builtOn}</dd>
            </div>
          </dl>

          <h2 className="text-2xl font-bold text-primary-green font-heading mb-6">
            Slide outline
          </h2>
          <ol className="space-y-6">
            {slides.map((slide, i) => (
              <li key={i} className="border-l-4 border-gray-200 pl-5">
                <h3 className="text-lg font-bold text-gray-900">
                  {i + 1}. {slide.title}
                </h3>
                {slide.callout && <p className="text-gray-800 font-semibold mt-1">{slide.callout}</p>}
                {slide.bullets && (
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700">
                    {slide.bullets.map((bullet, j) => (
                      <li key={j}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  )
}
