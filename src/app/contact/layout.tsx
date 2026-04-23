import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with EcoQuest Foundation. Ask questions about our programs, partnerships, volunteer opportunities, or how to support environmental education.',
  alternates: { canonical: '/contact/' },
  openGraph: {
    title: 'Contact Us - EcoQuest Foundation',
    description: 'Reach out about programs, partnerships, volunteer opportunities, or supporting environmental education.',
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
