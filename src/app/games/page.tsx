import Link from 'next/link'

export const metadata = {
  title: 'Educational Games - EcoQuest Foundation',
  description: 'Play fun, interactive environmental games designed for K-12 students. Learn about ecosystems, recycling, ocean conservation, and carbon footprints.',
}

export default function GamesPage() {
  const games = [
    {
      id: 'guardians',
      title: 'Guardians of the Green',
      description: 'Protect ecosystems by balancing nature, fighting pollution, and making strategic environmental decisions.',
      difficulty: 'Medium',
      ageRange: 'Grades 6-12',
      topics: ['Ecosystems', 'Biodiversity', 'Pollution'],
      color: 'from-green-500 to-emerald-600',
      icon: '🌳',
    },
    {
      id: 'ocean-cleanup',
      title: 'Ocean Cleanup Challenge',
      description: 'Race against time to remove plastic pollution from the ocean and save marine life.',
      difficulty: 'Easy',
      ageRange: 'Grades K-8',
      topics: ['Ocean Conservation', 'Plastic Pollution', 'Marine Life'],
      color: 'from-blue-500 to-cyan-600',
      icon: '🌊',
    },
    {
      id: 'recycling-hero',
      title: 'Recycling Hero',
      description: 'Sort waste into the correct bins and learn about recycling, composting, and waste reduction.',
      difficulty: 'Easy',
      ageRange: 'Grades K-6',
      topics: ['Recycling', 'Waste Management', 'Composting'],
      color: 'from-yellow-500 to-orange-600',
      icon: '♻️',
    },
    {
      id: 'carbon-quest',
      title: 'Carbon Footprint Quest',
      description: 'Make daily choices to reduce your carbon footprint and learn about climate change.',
      difficulty: 'Medium',
      ageRange: 'Grades 4-12',
      topics: ['Climate Change', 'Carbon Footprint', 'Sustainable Living'],
      color: 'from-purple-500 to-indigo-600',
      icon: '🌍',
    },
  ]

  return (
    <>
      <div className="bg-gradient-eco text-white text-center py-24">
        <div className="container-custom">
          <h1 className="text-5xl font-bold mb-4 font-heading">Educational Games</h1>
          <p className="text-xl">Learn about environmental conservation through interactive gameplay</p>
        </div>
      </div>

      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Our games are designed to make environmental education fun and engaging for students from kindergarten through 12th grade.
              Each game teaches important concepts about conservation, sustainability, and protecting our planet.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {games.map((game) => (
              <div key={game.id} className="card card-hover overflow-hidden">
                <div className={`h-48 bg-gradient-to-br ${game.color} flex items-center justify-center text-white relative`}>
                  <div className="absolute top-4 right-4 bg-white/20 px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm">
                    {game.difficulty}
                  </div>
                  <div className="text-7xl">{game.icon}</div>
                </div>
                <div className="p-6">
                  <h3 className="font-heading font-bold text-2xl mb-2 text-primary-green">{game.title}</h3>
                  <p className="text-gray-600 mb-4">{game.description}</p>

                  <div className="mb-4">
                    <div className="text-sm font-semibold text-gray-700 mb-2">Age Range:</div>
                    <span className="inline-block bg-primary-blue/10 text-primary-blue px-3 py-1 rounded-full text-sm font-medium">
                      {game.ageRange}
                    </span>
                  </div>

                  <div className="mb-6">
                    <div className="text-sm font-semibold text-gray-700 mb-2">Learning Topics:</div>
                    <div className="flex flex-wrap gap-2">
                      {game.topics.map((topic, i) => (
                        <span key={i} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Link
                    href={`/games/${game.id}`}
                    className="btn btn-primary w-full text-center inline-block"
                  >
                    Play Now →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-8 text-primary-green font-heading">Why Educational Games?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">🎮</div>
              <h3 className="font-bold text-xl mb-2 text-primary-green">Engaging Learning</h3>
              <p className="text-gray-600">Games make environmental education interactive and memorable</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🧠</div>
              <h3 className="font-bold text-xl mb-2 text-primary-green">Critical Thinking</h3>
              <p className="text-gray-600">Develop problem-solving skills through gameplay</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🌱</div>
              <h3 className="font-bold text-xl mb-2 text-primary-green">Real-World Impact</h3>
              <p className="text-gray-600">Apply learned concepts to everyday environmental actions</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
