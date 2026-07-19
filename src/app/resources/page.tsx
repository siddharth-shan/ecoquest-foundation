'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Resources() {
  const [filter, setFilter] = useState('all')

  const resources = [
    // Videos - Real educational content
    {
      id: 1,
      type: 'video',
      category: 'videos',
      title: 'NASA Climate Change',
      desc: 'NASA\'s comprehensive overview of climate change evidence and causes',
      tag: 'Video Series',
      url: 'https://climate.nasa.gov/resources/video/',
      external: true
    },
    {
      id: 2,
      type: 'video',
      category: 'videos',
      title: 'Ocean Conservation - National Geographic',
      desc: 'Explore ocean ecosystems and marine conservation efforts',
      tag: 'Documentary',
      url: 'https://www.nationalgeographic.com/environment/topic/oceans',
      external: true
    },
    {
      id: 3,
      type: 'video',
      category: 'videos',
      title: 'The Story of Stuff',
      desc: 'Understanding consumption, waste, and sustainability',
      tag: '21 min',
      url: 'https://www.storyofstuff.org/movies/',
      external: true
    },

    // Infographics - Real resources
    {
      id: 4,
      type: 'infographic',
      category: 'infographics',
      title: 'EPA Recycling Guide',
      desc: 'Official EPA guide to recycling and waste reduction',
      tag: 'Printable PDF',
      url: 'https://www.epa.gov/recycle',
      external: true
    },
    {
      id: 5,
      type: 'infographic',
      category: 'infographics',
      title: 'Carbon Footprint Calculator',
      desc: 'Interactive tool to measure and reduce your carbon footprint',
      tag: 'Interactive',
      url: 'https://www.nature.org/en-us/get-involved/how-to-help/carbon-footprint-calculator/',
      external: true
    },
    {
      id: 6,
      type: 'infographic',
      category: 'infographics',
      title: 'NOAA Ocean Facts',
      desc: 'Infographics about ocean ecosystems, climate, and conservation',
      tag: 'Ocean Data',
      url: 'https://oceanservice.noaa.gov/facts/',
      external: true
    },

    // Activities - Real worksheets and guides
    {
      id: 7,
      type: 'activity',
      category: 'activities',
      title: 'Energy Star Home Audit',
      desc: 'Official guide for conducting a home energy efficiency assessment',
      tag: 'Grades 6-12',
      url: 'https://www.energystar.gov/campaign/assessYourHome',
      external: true
    },
    {
      id: 8,
      type: 'activity',
      category: 'activities',
      title: 'Project Learning Tree Activities',
      desc: 'Environmental education activities for students K-12',
      tag: 'All Grades',
      url: 'https://www.plt.org/educator-tips/plt-activities/',
      external: true
    },
    {
      id: 9,
      type: 'activity',
      category: 'activities',
      title: 'Nature Scavenger Hunt',
      desc: 'Outdoor biodiversity exploration activity with printable worksheets',
      tag: 'Outdoor',
      url: 'https://www.nwf.org/Educational-Resources/Wildlife-Guide',
      external: true
    },

    // EcoQuest Apps
    {
      id: 10,
      type: 'app',
      category: 'apps',
      title: 'Wildfire Watch',
      desc: 'Real-time wildfire monitoring and tracking system for environmental awareness',
      tag: 'Live App',
      url: 'https://ewfw-hugafhdag5emcjgy.westus2-01.azurewebsites.net',
      external: true,
      color: 'bg-orange-500'
    },
    {
      id: 11,
      type: 'app',
      category: 'apps',
      title: 'Oceanaware Guardian',
      desc: 'Ocean conservation monitoring and marine ecosystem protection platform',
      tag: 'Live App',
      url: 'https://oceanaware-guardian.vercel.app',
      external: true,
      color: 'bg-blue-600'
    },
    {
      id: 12,
      type: 'app',
      category: 'apps',
      title: 'MindMirror',
      desc: 'Environmental awareness and personal reflection tool for mindful living',
      tag: 'Live App',
      url: 'https://mindmirror-pilot.vercel.app/',
      external: true,
      color: 'bg-purple-600'
    },
    {
      id: 15,
      type: 'app',
      category: 'apps',
      title: 'GreenLedger',
      desc: 'Civic sustainability dashboard turning Cerritos’s city budget into interactive environmental action',
      tag: 'Live App',
      url: 'https://ecoquest-greenledger.vercel.app',
      external: true,
      color: 'bg-green-600'
    },

    // Blog posts
    {
      id: 13,
      type: 'blog',
      category: 'blog',
      title: 'Monarch Butterfly Conservation',
      desc: 'Student research on declining monarch populations and habitat restoration',
      tag: 'Student Written',
      url: 'https://medium.com/@siddharth.shanmugaraja/monarch-butterfly-conservation-a-california-native-plants-guide-34e7ffcf660f',
      external: true
    },
    {
      id: 14,
      type: 'blog',
      category: 'blog',
      title: 'California Native Plants Guide',
      desc: 'A guide to native plants perfect for school and home gardens',
      tag: 'Student Written',
      url: 'https://medium.com/@siddharth.shanmugaraja/monarch-butterfly-conservation-a-california-native-plants-guide-34e7ffcf660f',
      external: true
    },
  ]

  const filtered = filter === 'all' ? resources : resources.filter(r => r.category === filter)

  const getResourceColor = (resource: typeof resources[0]) => {
    if (resource.color) return resource.color
    if (resource.type === 'video') return 'bg-red-500'
    if (resource.type === 'infographic') return 'bg-yellow-500'
    if (resource.type === 'activity') return 'bg-green-500'
    if (resource.type === 'app') return 'bg-primary-blue'
    return 'bg-blue-500'
  }

  const getResourceIcon = (type: string) => {
    if (type === 'video') return '📹'
    if (type === 'infographic') return '📊'
    if (type === 'activity') return '📝'
    if (type === 'app') return '🚀'
    return '✍️'
  }

  return (
    <>
      <div className="bg-gradient-eco text-white text-center py-24">
        <div className="container-custom">
          <h1 className="text-5xl font-bold mb-4 font-heading">Educational Resources</h1>
          <p className="text-xl">Videos, infographics, activities, interactive apps, and student-created content</p>
        </div>
      </div>

      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="section-header">
            <h2 className="section-title">Browse by Category</h2>
            <div className="section-underline" />
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {['all', 'videos', 'infographics', 'activities', 'apps', 'blog'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                  filter === cat
                    ? 'bg-primary-green text-white'
                    : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-primary-green'
                }`}
              >
                {cat === 'apps' ? 'Interactive Apps' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((resource) => (
              <div key={resource.id} className="card card-hover">
                <div className={`h-48 flex items-center justify-center text-white text-6xl relative ${getResourceColor(resource)}`}>
                  <span className="absolute top-4 left-4 bg-white/20 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
                    {resource.type === 'app' ? 'Interactive App' : resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                  </span>
                  {resource.external && (
                    <span className="absolute top-4 right-4 bg-white/20 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
                      🔗 External
                    </span>
                  )}
                  {getResourceIcon(resource.type)}
                </div>
                <div className="p-6">
                  <span className="inline-block bg-gray-100 px-3 py-1 rounded-full text-xs font-semibold text-gray-600 mb-3">
                    {resource.tag}
                  </span>
                  <h3 className="font-bold text-xl mb-2 text-primary-green">{resource.title}</h3>
                  <p className="text-gray-600 mb-4">{resource.desc}</p>
                  {resource.external ? (
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline text-sm inline-flex items-center gap-2"
                    >
                      {resource.type === 'app' ? 'Launch App' : 'View Resource'} →
                    </a>
                  ) : (
                    <button className="btn btn-outline text-sm">View Resource</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Apps Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="section-header">
            <h2 className="section-title">Our Interactive Apps</h2>
            <div className="section-underline" />
            <p className="text-gray-600 text-lg">Student-developed applications for environmental awareness and action</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: 'Wildfire Watch',
                img: '/images/apps/wildfire-watch.png',
                desc: 'Real-time wildfire monitoring system with up-to-date information on active fires and environmental impact.',
                url: 'https://ewfw-hugafhdag5emcjgy.westus2-01.azurewebsites.net',
              },
              {
                title: 'Oceanaware Guardian',
                img: '/images/apps/oceanaware.png',
                desc: 'Monitor ocean health, track marine conservation, and learn about protecting our seas and ecosystems.',
                url: 'https://oceanaware-guardian.vercel.app',
              },
              {
                title: 'MindMirror',
                img: '/images/apps/mindmirror.png',
                desc: 'A mental wellness check-in addressing climate anxiety and the link between environmental and personal well-being.',
                url: 'https://mindmirror-pilot.vercel.app/',
              },
              {
                title: 'GreenLedger',
                img: '/images/apps/greenledger.png',
                desc: 'A civic sustainability dashboard turning Cerritos’s city budget into interactive environmental action.',
                url: 'https://ecoquest-greenledger.vercel.app',
              },
            ].map((app) => (
              <div key={app.title} className="card card-hover overflow-hidden flex flex-col">
                <div className="relative h-40 overflow-hidden bg-gray-100">
                  <img
                    src={app.img}
                    alt={`${app.title} app screenshot`}
                    className="w-full h-full object-cover object-top"
                    loading="lazy"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                    <h3 className="text-lg font-bold text-white drop-shadow font-heading">{app.title}</h3>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <p className="text-gray-600 text-sm mb-4 flex-1">{app.desc}</p>
                  <a
                    href={app.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary w-full text-center text-sm"
                  >
                    Launch App →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-gradient-eco text-white">
        <div className="container-custom text-center">
          <h2 className="text-4xl font-bold mb-4 font-heading">Educator Resources</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Access lesson plans, NGSS alignment guides, and assessment tools designed for educators.
          </p>
          <Link href="/contact/" className="btn bg-white text-primary-green hover:bg-gray-100 text-lg px-10">
            Contact Us for Educator Access
          </Link>
        </div>
      </section>
    </>
  )
}
