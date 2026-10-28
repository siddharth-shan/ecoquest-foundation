import Link from 'next/link'
import { upcomingCampaigns } from '@/data/campaigns'
import { ecoMissions } from '@/data/ecochallenges'
import { HideAfter } from '@/components/shared/EventTiming'

export const metadata = {
  title: 'Our Programs',
  description: 'Explore EcoQuest Foundation educational programs including interactive environmental games, self-paced EcoChallenge missions, and hands-on community conservation activities for K-12 students.',
  alternates: { canonical: '/programs/' },
  openGraph: {
    title: 'Our Programs - EcoQuest Foundation',
    description: 'Interactive environmental games, self-paced EcoChallenge missions, and community conservation activities for K-12 students.',
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

      <section id="games" className="section-padding">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="rounded-2xl overflow-hidden h-96 relative shadow-lg bg-gradient-to-br from-primary-blue to-blue-800 flex items-center justify-center">
              <span className="text-8xl" aria-hidden="true">&#128167;</span>
              <div className="absolute top-6 right-6 bg-black/40 text-white px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm">
                Flagship Program
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                <h3 className="text-3xl font-bold text-white drop-shadow">Storm Drain Detective</h3>
              </div>
            </div>
            <div>
              <span className="text-primary-blue-dark font-semibold uppercase text-sm">Environmental Games</span>
              <h2 className="text-4xl font-bold mb-4 mt-2 text-primary-green font-heading">Games Built on Real Local Data</h2>
              <div className="section-underline ml-0" />
              <p className="text-lg mb-6 text-gray-700">
                Four free browser games that rebuild themselves around whatever ZIP code a student
                enters. Our flagship, Storm Drain Detective, asks players to guess where the water
                on their street ends up — then traces the real answer through the U.S. Geological
                Survey&rsquo;s river network, naming the actual stream gauges it passes on the way
                to the sea.
              </p>
              <div className="space-y-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <strong className="text-primary-green">Target Audience:</strong> Grades 3&ndash;12, depending on the game
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <strong className="text-primary-green">Data Sources:</strong> USGS, iNaturalist, Copernicus, and Open-Meteo &mdash; each named on the page it appears
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <strong className="text-primary-green">Use Cases:</strong> Classrooms, After-school Programs, Independent Learning &mdash; each game has a printable companion sheet
                </div>
              </div>
              <div className="flex gap-4">
                <Link href="/games/storm-drain/" className="btn btn-primary">Play Storm Drain Detective</Link>
                <Link href="/games/" className="btn btn-outline">All Games</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="seminars" className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <span className="text-primary-blue-dark font-semibold uppercase text-sm">Biweekly · Free · Online</span>
              <h2 className="text-4xl font-bold mb-4 mt-2 text-primary-green font-heading">Online Seminar Series</h2>
              <div className="section-underline ml-0" />
              <p className="text-lg mb-6 text-gray-700">
                Free 40-minute sessions on Zoom, every other Saturday, open to anyone. Each session is built
                on work EcoQuest has actually done — our apps, our cleanups, and our EcoChallenge missions.
              </p>
              <ul className="space-y-3 mb-6">
                {[
                  'Reading Real Wildfire Data — how to read public fire and air-quality data',
                  'What a Beach Cleanup Actually Tells Us — turning a cleanup into usable data',
                  "Your Home's Water and Energy Footprint — reading your own utility bills",
                  'Climate Anxiety and How We Built MindMirror — the research, and what we learned building a screening tool',
                  'Conservation in Your Own Neighborhood — finding and joining local work',
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-primary-green mr-2 font-bold">✓</span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-gray-600 mb-6 text-sm">
                Sessions are recorded and the slides stay online permanently, so you can catch up any time.
              </p>
              <Link href="/events/#seminars" className="btn btn-primary inline-block">
                See Dates &amp; Register
              </Link>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg bg-gray-100 aspect-[2/1]">
              <img
                src="/images/seminar-series-banner.png"
                alt="EcoQuest Foundation Online Seminar Series — free, every other Saturday, 11:00 to 11:40 AM Pacific on Zoom"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="ecochallenge" className="section-padding">
        <div className="container-custom">
          <div className="grid md:grid-cols-[3fr_2fr] gap-12 items-start mb-10">
            <div>
              <span className="text-primary-blue-dark font-semibold uppercase text-sm">At Home or School</span>
              <h2 className="text-4xl font-bold mb-4 mt-2 text-primary-green font-heading">EcoChallenge</h2>
              <div className="section-underline ml-0" />
              <p className="text-lg mb-4 text-gray-700">
                Week-long missions you can start any time. Each one begins with a measurement, asks
                you to change something for seven days, and ends with the same measurement again — so
                you finish with a real before-and-after, not just a promise.
              </p>
              <p className="text-gray-600">
                Pick a mission, sign up so we know you are taking part, and send us your results when
                you finish. Results are self-reported.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden h-64 relative shadow-lg bg-gray-100">
              <img
                src="/images/events/IMG_3250.webp"
                alt="Student volunteers repainting a community basketball court"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>

          {/* A dated, verified campaign beats the self-paced missions while it is open. */}
          {upcomingCampaigns
            .filter((c) => c.attendanceMode === 'online')
            .map((c) => (
              <HideAfter key={c.slug} endsAt={c.endDateTime}>
                <div className="mb-10 rounded-2xl border-2 border-primary-green bg-green-50 p-6 md:p-8 grid md:grid-cols-[1fr_auto] gap-6 items-center">
                  <div>
                    <span className="bg-primary-green text-white text-xs font-bold uppercase tracking-wider px-2 py-1 rounded">
                      Running now · {c.displayDate}
                    </span>
                    <h3 className="font-heading font-bold text-2xl text-primary-green mt-3 mb-2">{c.title}</h3>
                    <p className="text-gray-700 mb-2">{c.description}</p>
                    <p className="text-sm text-gray-600">
                      <strong>Service hours:</strong> {c.serviceHours}
                    </p>
                  </div>
                  <a
                    href={c.registrationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary whitespace-nowrap"
                  >
                    {c.ctaLabel} →
                  </a>
                </div>
              </HideAfter>
            ))}

          <div className="grid md:grid-cols-3 gap-6">
            {ecoMissions.map((m) => (
              <div key={m.slug} className="card p-6 flex flex-col border-t-4 border-primary-blue">
                <div className="flex items-baseline justify-between gap-3 mb-2">
                  <h3 className="font-heading font-bold text-xl text-primary-green">{m.title}</h3>
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary-blue-dark whitespace-nowrap">
                    {m.duration}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4">{m.summary}</p>
                <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-700 mb-4">
                  {m.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
                <p className="text-sm text-gray-600 mb-5">
                  <strong className="text-gray-800">What to send us:</strong> {m.evidence}
                </p>
                <Link
                  href={`/ecochallenge/join/?challenge=${encodeURIComponent(m.title)}`}
                  className="btn btn-outline text-sm mt-auto self-start"
                >
                  Join this mission
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="rounded-2xl overflow-hidden h-96 relative shadow-lg bg-gray-100">
              <img
                src="/images/events/IMG_1601.webp"
                alt="EcoQuest volunteer collecting litter along the shoreline at a Seal Beach cleanup"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                <h3 className="text-3xl font-bold text-white drop-shadow">Community Cleanups</h3>
              </div>
            </div>
            <div>
              <span className="text-primary-blue-dark font-semibold uppercase text-sm">Hands-On Conservation</span>
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
                <div className="text-5xl font-bold text-primary-green mb-2">8+</div>
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
            <span className="text-primary-blue-dark font-semibold uppercase text-sm">Digital Initiatives</span>
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
                  href="https://ecoquest-wildfire-watch.vercel.app"
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
                  <p className="text-xs font-semibold text-blue-700">🌊 Youth-built ocean conservation initiative</p>
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
                  A 60-second voice-based depression screening tool, motivated by research on climate anxiety in young people. A pre-registered student research pilot, not a diagnosis — with data collected from ~230 Prolific participants.
                </p>
                <ul className="space-y-2 mb-6 text-sm">
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2 font-bold">✓</span>
                    <span className="text-gray-600">60-second voice recording</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2 font-bold">✓</span>
                    <span className="text-gray-600">Study pre-registered on the Open Science Framework</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2 font-bold">✓</span>
                    <span className="text-gray-600">Links to mental health support resources</span>
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
