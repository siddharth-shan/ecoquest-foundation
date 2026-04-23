import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Event Registration',
  description: 'Register for EcoQuest Foundation community conservation events. Sign up for beach cleanups, park restoration days, and environmental education workshops.',
  alternates: { canonical: '/events/register/' },
  openGraph: {
    title: 'Event Registration - EcoQuest Foundation',
    description: 'Register for community conservation events, beach cleanups, and environmental education workshops.',
  },
}

export default function EventRegisterLayout({ children }: { children: React.ReactNode }) {
  return children
}
