import Link from 'next/link'
import { FaGamepad, FaBook, FaHandsHelping, FaSeedling } from 'react-icons/fa'
import ImpactDashboard from '@/components/shared/ImpactDashboard'
import CommunityVoices from '@/components/shared/Testimonials'
import NewsletterSignup from '@/components/shared/NewsletterSignup'
import UpcomingEvents from '@/components/shared/UpcomingEvents'

export const metadata = {
  alternates: { canonical: '/' },
}

interface FeaturedProgram {
  title: string
  desc: string
  badge: string
  link: string
  img: string
  /** Event photos are self-evident from the title; the game screenshots are not,
   *  so those carry their own description of what is on screen. */
  alt?: string
  /** True for the real game screenshots, which are 2:1 and must not be cropped
   *  to the card frame the way an event photo can be. */
  screenshot?: boolean
}

const featuredPrograms: FeaturedProgram[] = [
  {
    title: 'Storm Drain Detective',
    desc: 'Guess where the water on your street ends up, then trace the real answer through the USGS river network',
    badge: 'Flagship Game',
    link: '/games/storm-drain',
    img: '/images/games/storm-drain.png',
    screenshot: true,
    alt: 'Storm Drain Detective tracing a blue flowline south out of Cerritos, California, past two USGS gauges to the point where the trace ends.',
  },
  {
    title: 'Environmental Games',
    desc: 'Four free games built on live public science data for whatever ZIP code you enter',
    badge: 'K-12 Games',
    link: '/games',
    // Deliberately the climate chart rather than the Bioblitz photo round. The
    // Bioblitz still reproduces a photographer's CC BY-NC work, and a credit line
    // is only attribution if someone can read it — at this card's size the notice
    // baked into that screenshot cannot be. This chart is our own drawing of public
    // reanalysis data, so the card owes nobody a credit. /games and /impact show the
    // Bioblitz with its credit spelled out beside them.
    img: '/images/games/climate-record.png',
    screenshot: true,
    alt: 'Your Climate Record charting the average daily high in Cerritos, California by decade from the 1950s to the 2020s.',
  },
  {
    title: 'EcoChallenge',
    desc: 'Monthly interactive missions engaging students in real-world environmental actions',
    badge: 'Monthly',
    link: '/programs#ecochallenge',
    img: '/images/events/B6239CD9-5DBE-451E-A9D3-60DBD6FDA6FE.webp',
  },
  {
    title: 'Community Cleanup Events',
    desc: 'Beach and park cleanups across California, open to students, families, and community volunteers',
    badge: 'Hands-On',
    link: '/events',
    img: '/images/events/55B367F4-481D-4671-8F55-79ED524A3829.webp',
  },
]

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
            Through interactive games, free online seminars, and hands-on conservation events
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/programs/" className="btn btn-primary text-lg">
              Explore Our Programs
            </Link>
            <Link href="/get-involved/" className="btn btn-secondary text-lg">
              Get Involved
            </Link>
          </div>
        </div>
      </section>

      {/* Upcoming Events — dated, so it sits above the evergreen sections, and
          hides itself when nothing is scheduled */}
      <UpcomingEvents />

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
              { number: '4', label: 'Educational Games Built', desc: 'Interactive K-12 experiences' },
              { number: '4', label: 'Interactive Web Apps', desc: 'Wildfire Watch, Oceanaware, MindMirror, GreenLedger' },
              { number: '7+', label: 'Community Cleanups', desc: 'Beach & park conservation' },
              { number: '35+', label: 'Community Members Engaged', desc: 'Through events & programs' },
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
            <p className="text-gray-600 text-lg">Interactive digital tools built by our students for environmental awareness and community action</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: 'Wildfire Watch',
                desc: 'Track wildfires in real-time and access critical environmental safety information for your community',
                img: '/images/apps/wildfire-watch.png',
                url: 'https://ecoquest-wildfire-watch.vercel.app',
                gradient: 'from-orange-500 to-red-600',
                badge: '🏛️ Congressional App Challenge',
              },
              {
                title: 'Oceanaware Guardian',
                desc: 'Explore marine ecosystems, track ocean pollution, and learn how to protect our oceans',
                img: '/images/apps/oceanaware.png',
                url: 'https://oceanaware-guardian.vercel.app',
                gradient: 'from-blue-500 to-cyan-600',
                badge: '🌊 Youth Ocean Conservation',
              },
              {
                title: 'MindMirror',
                desc: 'A 60-second voice-based depression screening tool, motivated by research on climate anxiety in young people',
                img: '/images/apps/mindmirror.png',
                url: 'https://mindmirror-pilot.vercel.app/',
                gradient: 'from-purple-500 to-indigo-600',
                badge: '💡 Blue Ocean — Top 500 Finalist',
              },
              {
                title: 'GreenLedger',
                desc: 'Turn Cerritos’s city budget into an interactive tool — see how tax dollars fund sustainability and take on real eco-challenges',
                img: '/images/apps/greenledger.png',
                url: 'https://ecoquest-greenledger.vercel.app',
                gradient: 'from-green-600 to-emerald-700',
                badge: '🌱 Civic Sustainability',
              },
            ].map((app, i) => (
              <div key={i} className="card card-hover overflow-hidden group">
                <div className="h-48 overflow-hidden bg-gray-100 border-b border-gray-100">
                  <img
                    src={app.img}
                    alt={`${app.title} app screenshot`}
                    className="w-full h-full object-cover object-top transition-transform group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-heading font-bold text-xl mb-2 text-primary-green">{app.title}</h3>
                  <div className="bg-gray-100 rounded-full px-3 py-1 text-xs font-semibold text-gray-700 inline-block mb-3">
                    {app.badge}
                  </div>
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
            {featuredPrograms.map((program, i) => (
              <div key={i} className="card card-hover">
                <div className="h-48 relative overflow-hidden bg-gray-100">
                  {/* The game cards are real 2:1 screenshots, so they are fitted
                      rather than cropped; the event photos still fill the frame. */}
                  <img
                    src={program.img}
                    alt={program.alt ?? program.title}
                    className={`w-full h-full ${
                      program.screenshot ? 'object-contain bg-white' : 'object-cover'
                    }`}
                    loading="lazy"
                  />
                  <div className="absolute top-4 right-4 bg-black/40 text-white px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm">
                    {program.badge}
                  </div>
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

      {/* Impact Dashboard */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <ImpactDashboard />
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding">
        <div className="container-custom">
          <CommunityVoices />
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="section-padding bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="container-custom max-w-4xl">
          <NewsletterSignup />
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
            <Link href="/get-involved/" className="btn bg-white text-primary-green hover:bg-gray-100 text-lg px-10">
              Volunteer With Us
            </Link>
            <Link href="/programs/" className="btn btn-secondary text-lg px-10">
              Explore Programs
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
