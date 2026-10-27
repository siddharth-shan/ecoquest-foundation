// Self-paced EcoChallenge missions. Each one is a week of concrete steps with a
// before/after measurement, because "reduce your energy use" with nothing to
// compare against is a pledge, not a mission.
//
// Missions are self-reported. Nothing here promises service hours — the dated
// campaigns in campaigns.ts are the ones with a verification rule for that.

export interface EcoMission {
  slug: string
  title: string
  summary: string
  /** How long the mission runs, as shown on the card. */
  duration: string
  steps: string[]
  /** What the participant sends back, so the result is something checkable. */
  evidence: string
}

export const ecoMissions: EcoMission[] = [
  {
    slug: 'energy',
    title: 'Energy Conservation Challenge',
    summary: 'Measure your household electricity use, change three habits, and measure again.',
    duration: '1 week',
    steps: [
      'Day 1: photograph your electric meter, or note the kWh on your last bill.',
      'For seven days: unplug idle chargers, switch off lights when you leave a room, and pick one more habit of your own.',
      'Day 8: photograph the meter again and work out the difference.',
    ],
    evidence: 'Both meter readings and the three habits you kept.',
  },
  {
    slug: 'zero-waste',
    title: 'Zero-Waste Week',
    summary: 'Count what you throw away, swap out disposables one at a time, and compare.',
    duration: '1 week',
    steps: [
      'Day 1: keep a tally of every item you throw away on an ordinary day.',
      'Days 2–7: keep tallying, and replace one disposable each day — a bottle, a bag, a lunch wrapper.',
      'Day 7: compare your last tally with your first.',
    ],
    evidence: 'Your daily tally and the swaps you made.',
  },
  {
    slug: 'water',
    title: 'Water Conservation Mission',
    summary: 'Check your home for leaks, time your showers, and cut back for a week.',
    duration: '1 week',
    steps: [
      'Day 1: do the EPA WaterSense dye test — a few drops of food coloring in the toilet tank; color in the bowl after 15 minutes means a leak.',
      'Time your showers for three days to get a baseline.',
      'For the rest of the week: shorter showers and the tap off while brushing. Time them again.',
    ],
    evidence: 'Your before and after shower times and the leak-test result.',
  },
]
