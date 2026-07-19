'use client'

import { useState } from 'react'
import Link from 'next/link'

export interface BlogPost {
  id: string
  title: string
  excerpt: string
  date: string
  category: string
  author: string
  image: string
  img?: string // Optional real photo/screenshot; falls back to a styled emoji header
  gradient?: string // Header gradient when no photo
  readTime: string
  externalUrl?: string // Optional external link (e.g., Medium)
}

const categories = ['All', 'Student Story', 'Competition']

export default function BlogList({ posts }: { posts: BlogPost[] }) {
  const [filter, setFilter] = useState('All')

  const filtered = filter === 'All' ? posts : posts.filter((p) => p.category === filter)
  const featured = filtered[0]
  const rest = filtered.slice(1)

  return (
    <>
      {/* Category Filter */}
      <div className="flex flex-wrap gap-3 justify-center mb-12">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setFilter(category)}
            aria-pressed={filter === category}
            className={`px-6 py-2 rounded-full font-semibold transition-colors ${
              filter === category
                ? 'bg-primary-green text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-gray-500 mb-12">No posts in this category yet.</p>
      ) : (
        <>
          {/* Featured Post */}
          {featured && (
            <div className="mb-16">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="grid md:grid-cols-2 gap-8">
                  {featured.img ? (
                    <div className="bg-gray-100 overflow-hidden min-h-[260px]">
                      <img
                        src={featured.img}
                        alt={featured.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className={`bg-gradient-to-br ${featured.gradient ?? 'from-green-500 to-emerald-600'} flex flex-col items-center justify-center p-12 text-white`}>
                      <div className="text-7xl mb-3">{featured.image}</div>
                      <div className="uppercase tracking-wide text-sm font-semibold text-white/90">{featured.category}</div>
                    </div>
                  )}
                  <div className="p-8 flex flex-col justify-center">
                    <div className="flex gap-2 mb-3">
                      <div className="inline-block bg-primary-green/10 text-primary-green px-3 py-1 rounded-full text-sm font-semibold">
                        Featured Story
                      </div>
                      {featured.externalUrl && (
                        <div className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                          Student Written
                        </div>
                      )}
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-3">{featured.title}</h2>
                    <p className="text-gray-600 mb-4">{featured.excerpt}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                      <span>{featured.date}</span>
                      <span>•</span>
                      <span>{featured.readTime}</span>
                    </div>
                    {featured.externalUrl ? (
                      <a
                        href={featured.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary inline-block w-fit"
                      >
                        Read on Medium →
                      </a>
                    ) : (
                      <Link
                        href={`/blog/${featured.id}/`}
                        className="btn btn-primary inline-block w-fit"
                      >
                        Read Full Story →
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Blog Grid */}
          {rest.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {rest.map((post) => (
                <div key={post.id} className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow overflow-hidden">
                  {post.img ? (
                    <div className="h-48 overflow-hidden bg-gray-100">
                      <img
                        src={post.img}
                        alt={post.title}
                        className="w-full h-full object-cover object-top"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className={`bg-gradient-to-br ${post.gradient ?? 'from-primary-green to-emerald-600'} h-48 flex flex-col items-center justify-center text-white`}>
                      <div className="text-6xl mb-2">{post.image}</div>
                      <div className="uppercase tracking-wide text-xs font-semibold text-white/90">{post.category}</div>
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex gap-2 mb-3 flex-wrap">
                      <div className="inline-block bg-primary-blue/10 text-primary-blue px-3 py-1 rounded-full text-xs font-semibold">
                        {post.category}
                      </div>
                      {post.externalUrl && (
                        <div className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                          Student Written
                        </div>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">{post.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <span>{post.date}</span>
                      <span>{post.readTime}</span>
                    </div>
                    {post.externalUrl ? (
                      <a
                        href={post.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-green font-semibold hover:underline inline-flex items-center gap-1"
                      >
                        Read on Medium →
                      </a>
                    ) : (
                      <Link
                        href={`/blog/${post.id}/`}
                        className="text-primary-green font-semibold hover:underline"
                      >
                        Read More →
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </>
  )
}
