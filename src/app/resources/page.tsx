'use client'

import { useState } from 'react'

export default function Resources() {
  const [filter, setFilter] = useState('all')

  const resources = [
    { id: 1, type: 'video', category: 'videos', title: 'Climate Change 101', desc: 'Understanding the science of climate change', tag: '15 min' },
    { id: 2, type: 'video', category: 'videos', title: 'Ocean Conservation', desc: 'Learning about marine ecosystems and pollution', tag: '12 min' },
    { id: 3, type: 'infographic', category: 'infographics', title: 'Recycling Guide', desc: 'Visual guide to proper recycling practices', tag: 'Printable' },
    { id: 4, type: 'activity', category: 'activities', title: 'Home Energy Audit', desc: 'Worksheet for conducting home energy audits', tag: 'Grades 6-12' },
    { id: 5, type: 'blog', category: 'blog', title: 'Saving Monarch Butterflies', desc: 'A high school student explores declining monarch populations', tag: 'Student Written' },
  ]

  const filtered = filter === 'all' ? resources : resources.filter(r => r.category === filter)

  return (
    <>
      <div className="bg-gradient-eco text-white text-center py-24">
        <div className="container-custom">
          <h1 className="text-5xl font-bold mb-4 font-heading">Educational Resources</h1>
          <p className="text-xl">Videos, infographics, activities, and student-created content</p>
        </div>
      </div>

      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="section-header">
            <h2 className="section-title">Browse by Category</h2>
            <div className="section-underline" />
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {['all', 'videos', 'infographics', 'activities', 'blog'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                  filter === cat
                    ? 'bg-primary-green text-white'
                    : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-primary-green'
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
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
                <div className={`h-48 flex items-center justify-center text-white text-6xl relative ${
                  resource.type === 'video' ? 'bg-red-500' :
                  resource.type === 'infographic' ? 'bg-yellow-500' :
                  resource.type === 'activity' ? 'bg-green-500' : 'bg-blue-500'
                }`}>
                  <span className="absolute top-4 left-4 bg-white/20 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
                    {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                  </span>
                  {resource.type === 'video' ? '📹' : resource.type === 'infographic' ? '📊' : resource.type === 'activity' ? '📝' : '✍️'}
                </div>
                <div className="p-6">
                  <span className="inline-block bg-gray-100 px-3 py-1 rounded-full text-xs font-semibold text-gray-600 mb-3">
                    {resource.tag}
                  </span>
                  <h3 className="font-bold text-xl mb-2 text-primary-green">{resource.title}</h3>
                  <p className="text-gray-600 mb-4">{resource.desc}</p>
                  <button className="btn btn-outline text-sm">View Resource</button>
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
          <button className="btn bg-white text-primary-green hover:bg-gray-100 text-lg px-10">
            Access Educator Portal
          </button>
        </div>
      </section>
    </>
  )
}
