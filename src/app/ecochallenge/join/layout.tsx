import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Join the EcoChallenge',
  description: 'Join the EcoQuest Foundation monthly EcoChallenge. Take on environmental missions, complete real-world conservation tasks, and make a measurable impact.',
  alternates: { canonical: '/ecochallenge/join/' },
  openGraph: {
    title: 'Join the EcoChallenge - EcoQuest Foundation',
    description: 'Monthly environmental missions with real-world conservation tasks. Join and make a measurable impact.',
  },
}

export default function EcoChallengeJoinLayout({ children }: { children: React.ReactNode }) {
  return children
}
