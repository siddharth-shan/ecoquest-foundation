import Link from 'next/link'

export const metadata = {
  title: 'Impact Portfolio - EcoQuest Foundation',
  description: 'Student-led environmental impact: competitions, community cleanups, educational games, and published research.',
}

export default function ImpactPortfolio() {
  const milestones = [
    { year: '2024', title: 'Founded EcoQuest Foundation', desc: 'Student-led nonprofit focused on environmental education through technology' },
    { year: '2024', title: 'Built 4 Educational Games', desc: 'Guardians of the Green, Ocean Cleanup, Recycling Hero, Carbon Quest' },
    { year: '2024', title: 'First Community Cleanups', desc: 'Organized 3 cleanups at Seal Beach, Cerritos Heritage Park, Cerritos Park East' },
    { year: '2025', title: 'Launched Interactive Apps', desc: 'Wildfire Watch, Oceanaware Guardian, and MindMirror web applications' },
    { year: '2025', title: 'National Competition Entries', desc: 'Congressional App Challenge, Blue Ocean Competition, Bowseat Contest' },
    { year: '2025', title: 'Published Student Research', desc: 'Original articles on monarch butterflies, ocean plastic, and wildfire prevention' },
  ]

  const projects = [
    {
      title: 'Wildfire Watch',
      desc: 'Real-time wildfire monitoring and tracking system providing critical community safety information.',
      competition: 'Congressional App Challenge',
      competitionUrl: 'https://www.congressionalappchallenge.us/',
      appUrl: 'https://ewfw-hugafhdag5emcjgy.westus2-01.azurewebsites.net',
      icon: '🔥',
      gradient: 'from-orange-500 to-red-600',
      skills: ['React', 'Azure', 'Real-time Data', 'GIS Mapping'],
    },
    {
      title: 'MindMirror',
      desc: 'Mental wellness platform exploring the connection between environmental health and personal well-being.',
      competition: 'Blue Ocean Entrepreneurship Competition',
      competitionUrl: '#',
      appUrl: 'https://mindmirror-pilot.vercel.app/',
      icon: '🧠',
      gradient: 'from-purple-500 to-indigo-600',
      skills: ['Next.js', 'Vercel', 'UX Design', 'Wellness Research'],
    },
    {
      title: 'Oceanaware Guardian',
      desc: 'Ocean conservation platform raising awareness about marine ecosystems and pollution.',
      competition: 'Bowseat Ocean Awareness Contest',
      competitionUrl: 'https://bowseat.org/programs/ocean-awareness-contest/contest-overview/',
      appUrl: 'https://oceanaware-guardian.vercel.app',
      icon: '🌊',
      gradient: 'from-blue-500 to-cyan-600',
      skills: ['Next.js', 'Vercel', 'Marine Science', 'Data Visualization'],
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
              { number: '3', label: 'Cleanups' },
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

      {/* Competition Projects */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="section-header">
            <h2 className="section-title">Competition Projects</h2>
            <div className="section-underline" />
            <p className="text-gray-600 text-lg">Apps submitted to national and international competitions</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {projects.map((project, i) => (
              <div key={i} className="card overflow-hidden">
                <div className={`h-40 bg-gradient-to-br ${project.gradient} flex items-center justify-center text-white`}>
                  <div className="text-6xl">{project.icon}</div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-2 text-primary-green">{project.title}</h3>
                  <div className="bg-gray-100 rounded-full px-3 py-1 text-xs font-semibold text-gray-700 inline-block mb-3">
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
                  <div className="flex gap-2">
                    <a href={project.appUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary text-sm flex-1 text-center">
                      Launch App
                    </a>
                    <a href={project.competitionUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline text-sm flex-1 text-center">
                      Competition
                    </a>
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
              <Link key={i} href={game.link} className="card card-hover p-6 text-center block">
                <div className="text-4xl mb-3">🎮</div>
                <h3 className="font-bold text-lg text-primary-green mb-1">{game.title}</h3>
                <div className="text-xs text-primary-blue font-semibold mb-2">{game.grades}</div>
                <p className="text-gray-600 text-sm">{game.desc}</p>
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
              { title: 'Seal Beach Cleanup', members: '~15 members', icon: '🏖️' },
              { title: 'Cerritos Heritage Park', members: '~10 members', icon: '🌳' },
              { title: 'Cerritos Park East', members: '~10 members', icon: '🌿' },
            ].map((event, i) => (
              <div key={i} className="card p-6 text-center">
                <div className="text-5xl mb-3">{event.icon}</div>
                <h3 className="font-bold text-lg text-primary-green mb-2">{event.title}</h3>
                <p className="text-gray-600">{event.members}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            <div className="bg-green-50 rounded-xl p-6 text-center border-2 border-green-200">
              <div className="text-3xl font-bold text-primary-green">3+</div>
              <div className="text-sm text-gray-600">Student articles published on Medium</div>
            </div>
            <div className="bg-blue-50 rounded-xl p-6 text-center border-2 border-blue-200">
              <div className="text-3xl font-bold text-primary-blue">7</div>
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

      {/* Press & Recognition Placeholder */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="section-header">
            <h2 className="section-title">Recognition & Press</h2>
            <div className="section-underline" />
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-12 text-center border-2 border-green-200">
            <div className="text-5xl mb-4">📰</div>
            <h3 className="text-xl font-bold text-primary-green mb-3">Competition Results Coming Soon</h3>
            <p className="text-gray-600 max-w-2xl mx-auto mb-6">
              We've submitted our apps to the Congressional App Challenge, Blue Ocean Entrepreneurship Competition, and Bowseat Ocean Awareness Contest. Results will be shared here as they are announced.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-white rounded-lg px-6 py-3 shadow-sm border">
                <p className="font-semibold text-sm">🏛️ Congressional App Challenge</p>
              </div>
              <div className="bg-white rounded-lg px-6 py-3 shadow-sm border">
                <p className="font-semibold text-sm">💡 Blue Ocean Competition</p>
              </div>
              <div className="bg-white rounded-lg px-6 py-3 shadow-sm border">
                <p className="font-semibold text-sm">🌊 Bowseat Ocean Awareness</p>
              </div>
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
            <Link href="/get-involved" className="btn bg-white text-primary-green hover:bg-gray-100 text-lg px-10">
              Join the Team
            </Link>
            <Link href="/contact" className="btn btn-secondary text-lg px-10">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
