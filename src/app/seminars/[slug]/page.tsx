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
  const slides = decks[slug]

  if (!seminar || !slides) notFound()

  return <SlideDeck deckTitle={seminar.title} sessionDate={seminar.displayDate} slides={slides} />
}
