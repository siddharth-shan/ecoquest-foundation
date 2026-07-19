import Link from 'next/link'

export const metadata = {
  title: 'Our Programs',
  description: 'Explore EcoQuest Foundation educational programs including interactive environmental games, monthly EcoChallenges, and hands-on community conservation activities for K-12 students.',
  alternates: { canonical: '/programs/' },
  openGraph: {
    title: 'Our Programs - EcoQuest Foundation',
    description: 'Interactive environmental games, monthly EcoChallenges, and community conservation activities for K-12 students.',
  },
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
            <div className="rounded-2xl overflow-hidden h-96 relative shadow-lg bg-gray-100">
              <img
                src="/images/games/guardians.png"
                alt="Guardians of the Green gameplay — the interactive ecosystem map"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute top-6 right-6 bg-black/50 text-white px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm">
                Flagship Program
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                <h3 className="text-3xl font-bold text-white drop-shadow">Guardians of the Green</h3>
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
                <Link href="/games/guardians/" className="btn btn-primary">Play Now</Link>
                <Link href="/games/" className="btn btn-outline">All Games</Link>
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
              <p className="text-gray-600 mb-4">Example missions students can take on:</p>
              <div className="space-y-3 mb-6">
                {[
                  { title: 'Energy Conservation Challenge', desc: 'Reduce household energy use through mindful daily habits.' },
                  { title: 'Zero-Waste Week', desc: 'Cut personal waste to as close to zero as possible for one week.' },
                  { title: 'Water Conservation Mission', desc: 'Track and reduce water usage at home and school.' },
                ].map((challenge, i) => (
                  <div key={i} className="border-l-4 border-primary-blue bg-white p-4 rounded">
                    <h4 className="font-bold text-lg">{challenge.title}</h4>
                    <p className="text-gray-600 text-sm">{challenge.desc}</p>
                  </div>
                ))}
              </div>
              <Link href="/ecochallenge/join/?challenge=Energy%20Conservation%20Challenge" className="btn btn-primary inline-block">
                Join a Challenge
              </Link>
            </div>
            <div className="rounded-2xl overflow-hidden h-96 relative shadow-lg bg-gray-100 order-1 md:order-2">
              <img
                src="/images/events/B6239CD9-5DBE-451E-A9D3-60DBD6FDA6FE.jpeg"
                alt="Youth taking part in a hands-on environmental activity"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                <h3 className="text-3xl font-bold text-white drop-shadow">EcoChallenge</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="rounded-2xl overflow-hidden h-96 relative shadow-lg bg-gray-100">
              <img
                src="/images/events/EE83102A-D888-452C-B533-214BEC1FC508.jpeg"
                alt="EcoQuest volunteers gathered at a community cleanup event"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                <h3 className="text-3xl font-bold text-white drop-shadow">Community Cleanups</h3>
              </div>
            </div>
            <div>
              <span className="text-primary-blue font-semibold uppercase text-sm">Hands-On Conservation</span>
              <h2 className="text-4xl font-bold mb-4 mt-2 text-primary-green font-heading">Community Conservation Events</h2>
              <div className="section-underline ml-0" />
              <p className="text-lg mb-6 text-gray-700">
                Join us for beach and park cleanups across California. Our events welcome students, families, local Scout troops, and community volunteers.
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
                <div className="text-5xl font-bold text-primary-green mb-2">7+</div>
                <div className="font-semibold">Community Cleanups Completed</div>
              </div>
              <Link href="/events/" className="btn btn-primary inline-block">
                View Upcoming Events
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="text-primary-blue font-semibold uppercase text-sm">Digital Initiatives</span>
            <h2 className="text-4xl font-bold mb-4 mt-2 text-primary-green font-heading">Interactive Web Applications</h2>
            <div className="section-underline" />
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Explore the suite of interactive web applications our students have built to raise environmental awareness and put real data and civic action in the community&apos;s hands.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Wildfire Watch */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
              <div className="relative h-44 overflow-hidden bg-gray-100">
                <img
                  src="/images/apps/wildfire-watch.png"
                  alt="Wildfire Watch app dashboard screenshot"
                  className="w-full h-full object-cover object-top"
                  loading="lazy"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <h3 className="text-2xl font-bold text-white drop-shadow">Wildfire Watch</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-4">
                  Real-time wildfire monitoring and tracking system providing critical environmental awareness and safety information for communities.
                </p>
                <ul className="space-y-2 mb-6 text-sm">
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2 font-bold">✓</span>
                    <span className="text-gray-600">Live wildfire tracking</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2 font-bold">✓</span>
                    <span className="text-gray-600">Environmental impact data</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2 font-bold">✓</span>
                    <span className="text-gray-600">Community safety alerts</span>
                  </li>
                </ul>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                  <p className="text-xs font-semibold text-orange-700">🏛️ Submitted to Congressional App Challenge</p>
                </div>
                <a
                  href="https://ewfw-hugafhdag5emcjgy.westus2-01.azurewebsites.net"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary w-full text-center inline-block"
                >
                  Launch App
                </a>
              </div>
            </div>

            {/* Oceanaware Guardian */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
              <div className="relative h-44 overflow-hidden bg-gray-100">
                <img
                  src="/images/apps/oceanaware.png"
                  alt="Oceanaware Guardian app dashboard screenshot"
                  className="w-full h-full object-cover object-top"
                  loading="lazy"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <h3 className="text-2xl font-bold text-white drop-shadow">Oceanaware Guardian</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-4">
                  Ocean conservation platform dedicated to raising awareness about marine ecosystems, pollution, and the importance of protecting our oceans.
                </p>
                <ul className="space-y-2 mb-6 text-sm">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 font-bold">✓</span>
                    <span className="text-gray-600">Marine ecosystem insights</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 font-bold">✓</span>
                    <span className="text-gray-600">Ocean pollution tracking</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 font-bold">✓</span>
                    <span className="text-gray-600">Conservation resources</span>
                  </li>
                </ul>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <p className="text-xs font-semibold text-blue-700">🌊 Created for Bowseat Ocean Awareness Contest</p>
                </div>
                <a
                  href="https://oceanaware-guardian.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary w-full text-center inline-block"
                >
                  Launch App
                </a>
              </div>
            </div>

            {/* MindMirror */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
              <div className="relative h-44 overflow-hidden bg-gray-100">
                <img
                  src="/images/apps/mindmirror.png"
                  alt="MindMirror app screenshot"
                  className="w-full h-full object-cover object-top"
                  loading="lazy"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <h3 className="text-2xl font-bold text-white drop-shadow">MindMirror</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-4">
                  A 60-second mental wellness check-in that addresses climate anxiety and the link between environmental and personal well-being — validated with ~230 real users.
                </p>
                <ul className="space-y-2 mb-6 text-sm">
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2 font-bold">✓</span>
                    <span className="text-gray-600">Wellness tracking</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2 font-bold">✓</span>
                    <span className="text-gray-600">Nature connection insights</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2 font-bold">✓</span>
                    <span className="text-gray-600">Mindfulness resources</span>
                  </li>
                </ul>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
                  <p className="text-xs font-semibold text-purple-700">🏆 Top 500 Finalist — 2026 Blue Ocean Student Entrepreneur Competition</p>
                </div>
                <a
                  href="https://mindmirror-pilot.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary w-full text-center inline-block"
                >
                  Launch App
                </a>
              </div>
            </div>

            {/* GreenLedger */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
              <div className="relative h-44 overflow-hidden bg-gray-100">
                <img
                  src="/images/apps/greenledger.png"
                  alt="GreenLedger civic sustainability dashboard screenshot"
                  className="w-full h-full object-cover object-top"
                  loading="lazy"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <h3 className="text-2xl font-bold text-white drop-shadow">GreenLedger</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-4">
                  A youth-friendly civic dashboard that turns Cerritos&apos;s 370-page city budget into an interactive experience — connecting budget literacy with real environmental action.
                </p>
                <ul className="space-y-2 mb-6 text-sm">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2 font-bold">✓</span>
                    <span className="text-gray-600">Interactive budget &amp; sustainability explorer</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2 font-bold">✓</span>
                    <span className="text-gray-600">Real-world eco-challenges tied to city goals</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2 font-bold">✓</span>
                    <span className="text-gray-600">Community priorities survey &amp; impact tracker</span>
                  </li>
                </ul>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                  <p className="text-xs font-semibold text-green-700">🌱 Aligned with the Cerritos Strategic Plan 2025–2027</p>
                </div>
                <a
                  href="https://ecoquest-greenledger.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary w-full text-center inline-block"
                >
                  Launch App
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
