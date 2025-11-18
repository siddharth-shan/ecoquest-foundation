import Link from 'next/link'
import { FaGamepad, FaBook, FaHandsHelping, FaSeedling } from 'react-icons/fa'

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center justify-center bg-gradient-eco text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 container-custom text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 font-heading animate-fade-in">
            Empowering Youth to Protect Our Planet
          </h1>
          <p className="text-xl md:text-2xl mb-8 font-light max-w-3xl mx-auto">
            Through interactive games, digital experiences, and hands-on conservation events
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/programs" className="btn btn-primary text-lg">
              Explore Our Programs
            </Link>
            <Link href="/get-involved" className="btn btn-secondary text-lg">
              Get Involved
            </Link>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="section-header">
            <h2 className="section-title">Our Mission</h2>
            <div className="section-underline" />
          </div>
          <p className="text-xl text-center text-gray-700 max-w-4xl mx-auto mb-12 leading-relaxed">
            At EcoQuest Foundation, our mission is to <strong>inspire and educate youth and the broader public about environmental conservation and sustainability</strong> through innovative, interactive, and engaging digital experiences.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <FaGamepad className="w-12 h-12" />, title: 'Digital Learning', desc: 'Age-appropriate games and challenges making ecology fun and impactful' },
              { icon: <FaBook className="w-12 h-12" />, title: 'Educational Standards', desc: 'Content aligned with environmental science standards' },
              { icon: <FaHandsHelping className="w-12 h-12" />, title: 'Community Action', desc: 'Beach and park cleanups with local organizations' },
              { icon: <FaSeedling className="w-12 h-12" />, title: 'Youth-Driven', desc: 'Designed by students, for students' },
            ].map((item, i) => (
              <div key={i} className="card card-hover p-6 text-center">
                <div className="text-primary-green flex justify-center mb-4">{item.icon}</div>
                <h3 className="font-heading font-bold text-xl mb-3 text-primary-green">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="section-padding bg-gradient-eco text-white">
        <div className="container-custom">
          <div className="section-header">
            <h2 className="section-title">Our Impact</h2>
            <div className="section-underline" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { number: '1', label: 'Educational Game Launched', desc: 'EcoQuest: Guardians of the Green' },
              { number: '3+', label: 'Beach Cleanups Organized', desc: 'Along California Coast' },
              { number: '100+', label: 'Youth Engaged', desc: 'Through programs & events' },
              { number: '12', label: 'Monthly EcoChallenges', desc: 'Interactive missions' },
            ].map((stat, i) => (
              <div key={i} className="p-6">
                <div className="text-5xl md:text-6xl font-bold mb-2">{stat.number}</div>
                <div className="text-xl font-semibold mb-1">{stat.label}</div>
                <div className="text-sm opacity-90">{stat.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Apps Section */}
      <section className="section-padding bg-gradient-to-br from-gray-50 to-white">
        <div className="container-custom">
          <div className="section-header">
            <h2 className="section-title">Our Interactive Apps</h2>
            <div className="section-underline" />
            <p className="text-gray-600 text-lg">Real-time environmental data and awareness tools built for the community</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Wildfire Watch',
                desc: 'Track wildfires in real-time and access critical environmental safety information for your community',
                icon: '🔥',
                url: 'https://ewfw-hugafhdag5emcjgy.westus2-01.azurewebsites.net',
                gradient: 'from-orange-500 to-red-600',
              },
              {
                title: 'Oceanaware Guardian',
                desc: 'Explore marine ecosystems, track ocean pollution, and learn how to protect our oceans',
                icon: '🌊',
                url: 'https://oceanaware-guardian.vercel.app',
                gradient: 'from-blue-500 to-cyan-600',
              },
              {
                title: 'MindMirror',
                desc: 'Discover the connection between environmental health and personal well-being through mindfulness',
                icon: '🧠',
                url: 'https://mindmirror-pilot.vercel.app/',
                gradient: 'from-purple-500 to-indigo-600',
              },
            ].map((app, i) => (
              <div key={i} className="card card-hover overflow-hidden group">
                <div className={`h-48 bg-gradient-to-br ${app.gradient} flex items-center justify-center text-white relative transition-transform group-hover:scale-105`}>
                  <div className="text-7xl">{app.icon}</div>
                </div>
                <div className="p-6">
                  <h3 className="font-heading font-bold text-xl mb-3 text-primary-green">{app.title}</h3>
                  <p className="text-gray-600 mb-6">{app.desc}</p>
                  <a
                    href={app.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary text-sm w-full text-center inline-block"
                  >
                    Launch App →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Programs */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="section-header">
            <h2 className="section-title">Featured Programs</h2>
            <div className="section-underline" />
            <p className="text-gray-600 text-lg">Explore our innovative digital experiences and community initiatives</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: 'EcoQuest: Guardians of the Green',
                desc: 'Our flagship educational game teaching about ecosystems, pollution, and conservation',
                badge: 'Flagship Game',
                link: '/games/guardians',
                color: 'bg-primary-green',
                emoji: '🎮',
              },
              {
                title: 'Educational Games',
                desc: 'Four interactive games teaching recycling, ocean cleanup, carbon footprint, and more',
                badge: 'K-12 Games',
                link: '/games',
                color: 'bg-purple-500',
                emoji: '♻️',
              },
              {
                title: 'EcoChallenge',
                desc: 'Monthly interactive missions engaging students in real-world environmental actions',
                badge: 'Monthly',
                link: '/programs#ecochallenge',
                color: 'bg-primary-blue',
                emoji: '📅',
              },
              {
                title: 'Community Cleanup Events',
                desc: 'Beach and park cleanups across California with scouts and local organizations',
                badge: 'Hands-On',
                link: '/events',
                color: 'bg-accent-yellow',
                emoji: '🏖️',
              },
            ].map((program, i) => (
              <div key={i} className="card card-hover">
                <div className={`h-48 ${program.color} flex items-center justify-center text-white relative`}>
                  <div className="absolute top-4 right-4 bg-white/20 px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm">
                    {program.badge}
                  </div>
                  <div className="text-6xl opacity-90">{program.emoji}</div>
                </div>
                <div className="p-6">
                  <h3 className="font-heading font-bold text-xl mb-3 text-primary-green">{program.title}</h3>
                  <p className="text-gray-600 mb-4">{program.desc}</p>
                  <Link href={program.link} className="btn btn-outline text-sm">
                    {program.link.startsWith('/games') ? 'Play Now →' : 'Learn More →'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-primary-blue to-primary-green text-white">
        <div className="container-custom text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 font-heading">Ready to Join the Quest?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Whether you're an educator, student, scout troop, or community organization—there's a place for you at EcoQuest Foundation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/get-involved" className="btn bg-white text-primary-green hover:bg-gray-100 text-lg px-10">
              Volunteer With Us
            </Link>
            <Link href="/programs" className="btn btn-secondary text-lg px-10">
              Explore Programs
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
