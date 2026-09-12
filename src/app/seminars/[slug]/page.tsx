import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import SlideDeck from '@/components/shared/SlideDeck'
import { decks } from '@/data/decks'
import { getSeminar, seminars } from '@/data/seminars'

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
    description: seminar.description,
    alternates: { canonical: `/seminars/${seminar.slug}/` },
    openGraph: {
      title: `${seminar.title} - EcoQuest Online Seminar Series`,
      description: seminar.description,
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

  return <SlideDeck deckTitle={seminar.title} sessionDate={seminar.displayDate} slides={slides} />
}
