import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Donate',
  description: 'Support EcoQuest Foundation\'s mission to empower youth through environmental education. Your donation funds educational games, community cleanups, and conservation programs.',
  alternates: { canonical: '/donate/' },
  openGraph: {
    title: 'Donate - EcoQuest Foundation',
    description: 'Support environmental education for youth. Fund games, cleanups, and conservation programs.',
  },
}

export default function DonateLayout({ children }: { children: React.ReactNode }) {
  return children
}
