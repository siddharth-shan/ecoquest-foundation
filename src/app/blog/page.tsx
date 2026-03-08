import Link from 'next/link'
import NewsletterSignup from '@/components/shared/NewsletterSignup'

export const metadata = {
  title: 'News & Updates - EcoQuest Foundation',
  description: 'Latest news, impact stories, and updates from EcoQuest Foundation',
}

interface BlogPost {
  id: string
  title: string
  excerpt: string
  date: string
  category: string
  author: string
  image: string
  readTime: string
  externalUrl?: string // Optional external link (e.g., Medium)
}

export default function BlogPage() {
  const posts: BlogPost[] = [
    {
      id: 'monarch-butterfly',
      title: 'Monarch Butterfly Conservation: A California Native Plants Guide',
      excerpt:
        'A comprehensive student-written guide to saving monarch butterflies through California native plant gardening. Learn which milkweed species to plant, essential nectar sources, and how to create your own monarch waystation.',
      date: 'November 18, 2025',
      category: 'Student Story',
      author: 'Student Conservation Team',
      image: '🦋',
      readTime: '12 min read',
      externalUrl: 'https://medium.com/@siddharth.shanmugaraja/monarch-butterfly-conservation-a-california-native-plants-guide-34e7ffcf660f',
    },
    {
      id: 'ocean-plastic',
      title: 'The Ocean Plastic Crisis: What I Learned After 100 Days of Beach Cleanups',
      excerpt:
        'A student\'s 100-day journey collecting beach trash reveals shocking truths about ocean plastic pollution. Complete with data, wildlife encounters, and actionable solutions everyone can implement today.',
      date: 'November 18, 2025',
      category: 'Student Story',
      author: 'Student Conservation Team',
      image: '🌊',
      readTime: '15 min read',
      externalUrl: 'https://medium.com/@siddharth.shanmugaraja/the-ocean-plastic-crisis-what-i-learned-after-many-days-of-beach-cleanups-e9f5afe35bba',
    },
    {
      id: 'wildfire-prevention',
      title: 'Creating Defensible Space: A Student\'s Guide to Wildfire Prevention in California',
      excerpt:
        'Everything you need to know about protecting your home from wildfires. A comprehensive guide covering defensible space zones, fire-resistant landscaping, home hardening, and community action.',
      date: 'November 18, 2025',
      category: 'Student Story',
      author: 'Student Conservation Team',
      image: '🔥',
      readTime: '18 min read',
      externalUrl: 'https://medium.com/@siddharth.shanmugaraja/wildfire-prevention-a142b111d97f',
    },
    {
      id: 'congressional-app-challenge',
      title: 'EcoQuest Wildfire Watch: Our Congressional App Challenge Submission',
      excerpt:
        'Our team submitted Wildfire Watch to the Congressional App Challenge - a real-time wildfire monitoring app built to help communities stay informed and safe during California\'s fire season.',
      date: 'October 2025',
      category: 'Competition',
      author: 'EcoQuest Team',
      image: '🏛️',
      readTime: '4 min read',
    },
    {
      id: 'blue-ocean-competition',
      title: 'MindMirror: Competing in the Blue Ocean Entrepreneurship Competition',
      excerpt:
        'MindMirror, our mental wellness and environmental connection platform, was submitted to the Blue Ocean Entrepreneurship Competition - exploring the intersection of personal well-being and environmental health.',
      date: 'October 2025',
      category: 'Competition',
      author: 'EcoQuest Team',
      image: '🧠',
      readTime: '3 min read',
    },
    {
      id: 'bowseat-ocean-awareness',
      title: 'Oceanaware Guardian: Our Bowseat Ocean Awareness Contest Entry',
      excerpt:
        'We created Oceanaware Guardian as our entry to the Bowseat Ocean Awareness Contest - a platform dedicated to raising awareness about marine ecosystems, ocean pollution, and conservation.',
      date: 'October 2025',
      category: 'Competition',
      author: 'EcoQuest Team',
      image: '🌊',
      readTime: '3 min read',
    },
  ]

  const categories = ['All', 'Student Story', 'Competition']

  return (
    <>
      <div className="bg-gradient-eco text-white text-center py-24">
        <div className="container-custom">
          <h1 className="text-5xl font-bold mb-4 font-heading">News & Updates</h1>
          <p className="text-xl">Stories of impact, program updates, and environmental education insights</p>
        </div>
      </div>

      <section className="section-padding">
        <div className="container-custom">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                  category === 'All'
                    ? 'bg-primary-green text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Featured Post */}
          <div className="mb-16">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center p-12">
                  <div className="text-9xl">{posts[0].image}</div>
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <div className="flex gap-2 mb-3">
                    <div className="inline-block bg-primary-green/10 text-primary-green px-3 py-1 rounded-full text-sm font-semibold">
                      Featured Story
                    </div>
                    {posts[0].externalUrl && (
                      <div className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                        Student Written
                      </div>
                    )}
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-3">{posts[0].title}</h2>
                  <p className="text-gray-600 mb-4">{posts[0].excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                    <span>{posts[0].date}</span>
                    <span>•</span>
                    <span>{posts[0].readTime}</span>
                  </div>
                  {posts[0].externalUrl ? (
                    <a
                      href={posts[0].externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary inline-block w-fit"
                    >
                      Read on Medium →
                    </a>
                  ) : (
                    <Link
                      href={`/blog/${posts[0].id}`}
                      className="btn btn-primary inline-block w-fit"
                    >
                      Read Full Story →
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Blog Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {posts.slice(1).map((post) => (
              <div key={post.id} className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow overflow-hidden">
                <div className="bg-gradient-to-br from-primary-green to-emerald-600 h-48 flex items-center justify-center">
                  <div className="text-7xl">{post.image}</div>
                </div>
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
                      href={`/blog/${post.id}`}
                      className="text-primary-green font-semibold hover:underline"
                    >
                      Read More →
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Newsletter Signup */}
          <div className="max-w-2xl mx-auto">
            <NewsletterSignup variant="compact" />
          </div>
        </div>
      </section>
    </>
  )
}
