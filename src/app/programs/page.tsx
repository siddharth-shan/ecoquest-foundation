export const metadata = {
  title: 'Our Programs - EcoQuest Foundation',
  description: 'Explore educational programs including games, challenges, and hands-on conservation activities.',
}

export default function Programs() {
  return (
    <>
      <div className="bg-gradient-eco text-white text-center py-24">
        <div className="container-custom">
          <h1 className="text-5xl font-bold mb-4 font-heading">Our Programs</h1>
          <p className="text-xl">Interactive digital experiences and community conservation initiatives</p>
        </div>
      </div>

      <section id="guardians" className="section-padding">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="bg-gradient-to-br from-primary-green to-primary-green-dark rounded-2xl p-12 text-white h-96 flex items-center justify-center relative">
              <div className="absolute top-6 right-6 bg-white/20 px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm">
                Flagship Program
              </div>
              <div className="text-center">
                <div className="text-6xl mb-4">🎮</div>
                <h3 className="text-3xl font-bold">Guardians of the Green</h3>
              </div>
            </div>
            <div>
              <span className="text-primary-blue font-semibold uppercase text-sm">Educational Game</span>
              <h2 className="text-4xl font-bold mb-4 mt-2 text-primary-green font-heading">EcoQuest: Guardians of the Green</h2>
              <div className="section-underline ml-0" />
              <p className="text-lg mb-6 text-gray-700">
                Our flagship educational game designed to teach players about ecosystems, pollution, and conservation through interactive storytelling and challenges.
              </p>
              <div className="space-y-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <strong className="text-primary-green">Target Audience:</strong> Middle and High School Students (Grades 6-12)
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <strong className="text-primary-green">Standards:</strong> NGSS-aligned Environmental Science Standards
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <strong className="text-primary-green">Use Cases:</strong> Classrooms, After-school Programs, Independent Learning
                </div>
              </div>
              <div className="flex gap-4">
                <button className="btn btn-primary">Play Now</button>
                <button className="btn btn-outline">Educator Guide</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="ecochallenge" className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="order-2 md:order-1">
              <span className="text-primary-blue font-semibold uppercase text-sm">Monthly Missions</span>
              <h2 className="text-4xl font-bold mb-4 mt-2 text-primary-green font-heading">EcoChallenge</h2>
              <div className="section-underline ml-0" />
              <p className="text-lg mb-6 text-gray-700">
                Monthly interactive missions that engage students in real-world environmental actions, from reducing plastic use to creating habitat gardens.
              </p>
              <div className="space-y-3 mb-6">
                {[
                  { month: 'November 2024', title: 'Zero-Waste Week', desc: 'Reduce personal waste to near-zero for one week.' },
                  { month: 'October 2024', title: 'Native Plant Garden', desc: 'Create a garden supporting local pollinators.' },
                  { month: 'September 2024', title: 'Plastic-Free Lunch', desc: 'Pack waste-free lunches for a month.' },
                ].map((challenge, i) => (
                  <div key={i} className="border-l-4 border-primary-blue bg-white p-4 rounded">
                    <div className="text-primary-blue text-sm font-semibold">{challenge.month}</div>
                    <h4 className="font-bold text-lg">{challenge.title}</h4>
                    <p className="text-gray-600 text-sm">{challenge.desc}</p>
                  </div>
                ))}
              </div>
              <button className="btn btn-primary">Join This Month's Challenge</button>
            </div>
            <div className="bg-gradient-to-br from-primary-blue to-blue-600 rounded-2xl p-12 text-white h-96 flex items-center justify-center order-1 md:order-2">
              <div className="text-center">
                <div className="text-6xl mb-4">📅</div>
                <h3 className="text-3xl font-bold">EcoChallenge</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="bg-gradient-to-br from-accent-yellow to-accent-orange rounded-2xl p-12 text-white h-96 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">🏖️</div>
                <h3 className="text-3xl font-bold">Community Cleanups</h3>
              </div>
            </div>
            <div>
              <span className="text-primary-blue font-semibold uppercase text-sm">Hands-On Conservation</span>
              <h2 className="text-4xl font-bold mb-4 mt-2 text-primary-green font-heading">Community Conservation Events</h2>
              <div className="section-underline ml-0" />
              <p className="text-lg mb-6 text-gray-700">
                Partner with us for beach and park cleanups across California, working alongside Scouting of America troops and local organizations.
              </p>
              <ul className="space-y-3 mb-6">
                {[
                  'Beach Cleanups: Remove plastic and debris from coastal areas',
                  'Park Restoration: Native plant installation and invasive species removal',
                  'Waterway Protection: Stream cleanups and water quality monitoring',
                  'Educational Workshops: On-site learning about local ecology',
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-primary-green mr-2 font-bold">✓</span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="bg-primary-green/10 p-6 rounded-lg mb-6">
                <div className="text-5xl font-bold text-primary-green mb-2">3+</div>
                <div className="font-semibold">Beach Cleanups Completed</div>
              </div>
              <button className="btn btn-primary">View Upcoming Events</button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
