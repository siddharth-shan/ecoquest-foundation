import Link from 'next/link'

export const metadata = {
  title: 'Impact Portfolio',
  description: 'See EcoQuest Foundation\'s real-world environmental impact: national competition entries, community beach and park cleanups, educational games reaching students, and youth-led conservation initiatives.',
  alternates: { canonical: '/impact/' },
  openGraph: {
    title: 'Impact Portfolio - EcoQuest Foundation',
    description: 'Student-led environmental impact: national competitions, community cleanups, educational games, and conservation initiatives.',
  },
}

export default function ImpactPortfolio() {
  const milestones = [
    { year: '2024', title: 'Founded EcoQuest Foundation', desc: 'Student-led nonprofit focused on environmental education through technology' },
    { year: '2024', title: 'Built 4 Educational Games', desc: 'Guardians of the Green, Ocean Cleanup, Recycling Hero, Carbon Quest' },
    { year: '2024', title: 'First Community Cleanups', desc: 'Launched our community cleanups at Seal Beach and Cerritos-area parks' },
    { year: '2025', title: 'Launched Interactive Apps', desc: 'Wildfire Watch, Oceanaware Guardian, and MindMirror web applications' },
    { year: '2025', title: 'National Competition Entries', desc: 'Congressional App Challenge, Blue Ocean Competition, Bowseat Contest' },
    { year: '2025', title: 'Published Student Research', desc: 'Original articles on monarch butterflies, ocean plastic, and wildfire prevention' },
    { year: '2026', title: 'Blue Ocean Top 500 Finalist', desc: 'MindMirror named a Top 500 Finalist among 23,000+ students from 173 countries' },
    { year: '2026', title: 'Launched GreenLedger', desc: 'A civic sustainability dashboard turning Cerritos’s city budget into interactive environmental action' },
  ]

  const projects = [
    {
      title: 'Wildfire Watch',
      desc: 'Real-time wildfire monitoring and tracking system providing critical community safety information.',
      competition: 'Congressional App Challenge',
      competitionUrl: 'https://www.congressionalappchallenge.us/',
      appUrl: 'https://ewfw-hugafhdag5emcjgy.westus2-01.azurewebsites.net',
      img: '/images/apps/wildfire-watch.png',
      gradient: 'from-orange-500 to-red-600',
      skills: ['React', 'Azure', 'Real-time Data', 'GIS Mapping'],
    },
    {
      title: 'MindMirror',
      desc: 'Mental wellness platform exploring the connection between environmental health and personal well-being.',
      competition: 'Blue Ocean — Top 500 Finalist',
      competitionUrl: 'https://www.blueoceancompetition.org/',
      appUrl: 'https://mindmirror-pilot.vercel.app/',
      img: '/images/apps/mindmirror.png',
      gradient: 'from-purple-500 to-indigo-600',
      skills: ['Next.js', 'Vercel', 'UX Design', 'Wellness Research'],
    },
    {
      title: 'Oceanaware Guardian',
      desc: 'Ocean conservation platform raising awareness about marine ecosystems and pollution.',
      competition: 'Bowseat Ocean Awareness Contest',
      competitionUrl: 'https://bowseat.org/programs/ocean-awareness-contest/contest-overview/',
      appUrl: 'https://oceanaware-guardian.vercel.app',
      img: '/images/apps/oceanaware.png',
      gradient: 'from-blue-500 to-cyan-600',
      skills: ['Next.js', 'Vercel', 'Marine Science', 'Data Visualization'],
    },
    {
      title: 'GreenLedger',
      desc: 'A civic sustainability dashboard turning Cerritos’s city budget into interactive environmental action for young residents.',
      competition: 'Civic Sustainability',
      appUrl: 'https://ecoquest-greenledger.vercel.app',
      img: '/images/apps/greenledger.png',
      gradient: 'from-green-600 to-emerald-700',
      skills: ['Next.js', 'Recharts', 'Civic Data', 'Sustainability'],
    },
  ]

  const games = [
    { title: 'Guardians of the Green', grades: 'Grades 6-12', desc: 'Ecosystem management simulation', link: '/games/guardians' },
    { title: 'Ocean Cleanup Challenge', grades: 'K-8', desc: 'Marine pollution awareness game', link: '/games/ocean-cleanup' },
    { title: 'Recycling Hero', grades: 'K-6', desc: 'Waste sorting and recycling education', link: '/games/recycling-hero' },
    { title: 'Carbon Footprint Quest', grades: 'Grades 4-12', desc: 'Carbon awareness and reduction', link: '/games/carbon-quest' },
  ]

  const skillsShowcase = [
    { category: 'Technical', skills: ['React/Next.js', 'TypeScript', 'Tailwind CSS', 'Azure', 'Vercel', 'Git/GitHub'] },
    { category: 'Design', skills: ['UI/UX Design', 'Responsive Design', 'Game Design', 'Data Visualization'] },
    { category: 'Leadership', skills: ['Nonprofit Management', 'Team Coordination', 'Event Planning', 'Community Outreach'] },
    { category: 'Research', skills: ['Environmental Science', 'Technical Writing', 'Content Creation', 'Marine Biology'] },
  ]

  return (
    <>
      <div className="bg-gradient-eco text-white text-center py-24">
        <div className="container-custom">
          <h1 className="text-5xl font-bold mb-4 font-heading">Impact Portfolio</h1>
          <p className="text-xl max-w-3xl mx-auto">
            A student-led nonprofit building technology for environmental education and community action
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <section className="py-8 bg-white border-b">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            {[
              { number: '7+', label: 'Cleanups' },
              { number: '35+', label: 'Volunteers' },
              { number: '4', label: 'Games' },
              { number: '3', label: 'Competition Apps' },
              { number: '3+', label: 'Published Articles' },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-3xl font-bold text-primary-green">{stat.number}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="section-header">
            <h2 className="section-title">Our Journey</h2>
            <div className="section-underline" />
          </div>
          <div className="max-w-3xl mx-auto">
            {milestones.map((milestone, i) => (
              <div key={i} className="flex gap-6 mb-8 last:mb-0">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-primary-green text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {milestone.year}
                  </div>
                  {i < milestones.length - 1 && <div className="w-0.5 flex-1 bg-green-200 mt-2" />}
                </div>
                <div className="pb-8">
                  <h3 className="font-bold text-lg text-primary-green">{milestone.title}</h3>
                  <p className="text-gray-600">{milestone.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="section-header">
            <h2 className="section-title">Featured Projects</h2>
            <div className="section-underline" />
            <p className="text-gray-600 text-lg">Interactive web apps our students designed and built</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {projects.map((project, i) => (
              <div key={i} className="card overflow-hidden flex flex-col">
                <div className="h-40 overflow-hidden bg-gray-100">
                  <img
                    src={project.img}
                    alt={`${project.title} app screenshot`}
                    className="w-full h-full object-cover object-top"
                    loading="lazy"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-bold text-xl mb-2 text-primary-green">{project.title}</h3>
                  <div className="bg-gray-100 rounded-full px-3 py-1 text-xs font-semibold text-gray-700 inline-block mb-3 self-start">
                    {project.competition}
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{project.desc}</p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.skills.map((skill, j) => (
                      <span key={j} className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                  <div className="mt-auto">
                    <div className="flex flex-col gap-2">
                      <a href={project.appUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary text-sm w-full text-center">
                        Launch App
                      </a>
                      {project.competitionUrl && (
                        <a href={project.competitionUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline text-sm w-full text-center">
                          Competition
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Educational Games */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="section-header">
            <h2 className="section-title">Educational Games</h2>
            <div className="section-underline" />
            <p className="text-gray-600 text-lg">Interactive learning experiences built for K-12 students</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {games.map((game, i) => (
              <Link key={i} href={game.link} className="card card-hover overflow-hidden block">
                <div className="h-36 overflow-hidden bg-gray-100">
                  <img
                    src={`/images/games/${game.link.split('/').pop()}.png`}
                    alt={`${game.title} gameplay screenshot`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="font-bold text-lg text-primary-green mb-1">{game.title}</h3>
                  <div className="text-xs text-primary-blue font-semibold mb-2">{game.grades}</div>
                  <p className="text-gray-600 text-sm">{game.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Community Impact */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="section-header">
            <h2 className="section-title">Community Impact</h2>
            <div className="section-underline" />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Seal Beach Cleanup', desc: 'Coastal cleanup removing plastic and debris from the shoreline', img: '/images/events/IMG_0511.JPG' },
              { title: 'Prado Park', desc: 'Park cleanup, pathway restoration, and beautification in Chino, CA', img: '/images/events/IMG_4346.JPG' },
              { title: 'Cerritos Park East', desc: 'Community park cleanup and beautification', img: '/images/events/E6EBDFFC-233D-4615-A2B4-558095CACFD0.jpeg' },
            ].map((event, i) => (
              <div key={i} className="card overflow-hidden">
                <div className="h-44 overflow-hidden bg-gray-100">
                  <img
                    src={event.img}
                    alt={`${event.title} — community conservation event`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="font-bold text-lg text-primary-green mb-2">{event.title}</h3>
                  <p className="text-gray-600 text-sm">{event.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            <div className="bg-green-50 rounded-xl p-6 text-center border-2 border-green-200">
              <div className="text-3xl font-bold text-primary-green">3+</div>
              <div className="text-sm text-gray-600">Student articles published on Medium</div>
            </div>
            <div className="bg-blue-50 rounded-xl p-6 text-center border-2 border-blue-200">
              <div className="text-3xl font-bold text-primary-blue">8</div>
              <div className="text-sm text-gray-600">Digital products built (games + apps)</div>
            </div>
            <div className="bg-purple-50 rounded-xl p-6 text-center border-2 border-purple-200">
              <div className="text-3xl font-bold text-purple-600">100%</div>
              <div className="text-sm text-gray-600">Student-led and student-built</div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Showcase */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="section-header">
            <h2 className="section-title">Skills & Capabilities</h2>
            <div className="section-underline" />
            <p className="text-gray-600 text-lg">What our team has learned and demonstrated through this initiative</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {skillsShowcase.map((category, i) => (
              <div key={i} className="card p-6">
                <h3 className="font-bold text-lg text-primary-green mb-4">{category.category}</h3>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill, j) => (
                    <span key={j} className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recognition & Competitions */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="section-header">
            <h2 className="section-title">Recognition &amp; Competitions</h2>
            <div className="section-underline" />
          </div>

          {/* Featured award */}
          <div className="card p-8 md:p-10 max-w-3xl mx-auto mb-12 text-center border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
            <div className="text-5xl mb-3">🏆</div>
            <div className="inline-block bg-primary-green/10 text-primary-green px-3 py-1 rounded-full text-sm font-semibold mb-3">
              Top 500 Finalist
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3 font-heading">
              2026 Blue Ocean Student Entrepreneur Competition
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our <strong>MindMirror</strong> app was named a <strong>Top 500 Finalist</strong> in the world&apos;s
              largest virtual pitch competition — with 23,000+ students from 173 countries, endorsed by the creators
              of Blue Ocean Strategy. MindMirror has since been validated with <strong>~230 real users</strong>.
            </p>
          </div>

          {/* Competitions list */}
          <p className="text-center text-gray-600 mb-6">
            We&apos;ve put our apps in front of national and international judges through these student competitions:
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="bg-white rounded-lg px-6 py-4 shadow-sm border">
              <p className="font-semibold text-sm">🏛️ Congressional App Challenge</p>
            </div>
            <div className="bg-white rounded-lg px-6 py-4 shadow-sm border">
              <p className="font-semibold text-sm">💡 Blue Ocean Entrepreneurship Competition</p>
            </div>
            <div className="bg-white rounded-lg px-6 py-4 shadow-sm border">
              <p className="font-semibold text-sm">🌊 Bowseat Ocean Awareness Contest</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-eco text-white">
        <div className="container-custom text-center">
          <h2 className="text-4xl font-bold mb-4 font-heading">Want to Get Involved?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join our student-led team and make a real impact on environmental education and conservation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/get-involved/" className="btn bg-white text-primary-green hover:bg-gray-100 text-lg px-10">
              Join the Team
            </Link>
            <Link href="/contact/" className="btn btn-secondary text-lg px-10">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
