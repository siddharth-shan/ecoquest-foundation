import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Join the EcoChallenge',
  description: 'Join an EcoQuest Foundation EcoChallenge: week-long missions at home or school that start and end with a real measurement, so you can see the difference you made.',
  alternates: { canonical: '/ecochallenge/join/' },
  openGraph: {
    title: 'Join the EcoChallenge - EcoQuest Foundation',
    description: 'Week-long environmental missions with a real before-and-after measurement.',
  },
}

export default function EcoChallengeJoinLayout({ children }: { children: React.ReactNode }) {
  return children
}
