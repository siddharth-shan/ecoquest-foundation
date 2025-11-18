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
      date: 'December 18, 2024',
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
      date: 'December 18, 2024',
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
      date: 'December 18, 2024',
      category: 'Student Story',
      author: 'Student Conservation Team',
      image: '🔥',
      readTime: '18 min read',
      externalUrl: 'https://medium.com/@siddharth.shanmugaraja/wildfire-prevention-a142b111d97f',
    },
    {
      id: '1',
      title: 'Guardians of the Green Reaches 500 Students Milestone!',
      excerpt:
        'Our flagship educational game has now reached over 500 students across 15 schools in California. Teachers report increased engagement in environmental science topics and students developing real-world conservation thinking skills.',
      date: 'December 15, 2024',
      category: 'Impact Story',
      author: 'EcoQuest Team',
      image: '🎮',
      readTime: '3 min read',
    },
    {
      id: '2',
      title: 'Beach Cleanup Success: 200+ Pounds of Trash Removed',
      excerpt:
        'Our latest beach cleanup event in partnership with Scout Troop 405 was a huge success! Over 30 volunteers collected more than 200 pounds of trash from the San Diego coastline, including plastics, fishing gear, and recyclables.',
      date: 'December 8, 2024',
      category: 'Event Recap',
      author: 'Sarah Martinez',
      image: '🏖️',
      readTime: '4 min read',
    },
    {
      id: '3',
      title: 'New Partnership with Riverside Academy',
      excerpt:
        'We\'re thrilled to announce our partnership with Riverside Academy! All 450 middle school students will have access to our educational games and participate in our EcoChallenge monthly missions throughout the 2024-2025 school year.',
      date: 'December 1, 2024',
      category: 'Announcement',
      author: 'EcoQuest Team',
      image: '🤝',
      readTime: '2 min read',
    },
    {
      id: '4',
      title: 'Student Spotlight: How Emily Reduced Her Family\'s Carbon Footprint',
      excerpt:
        'After playing our Carbon Footprint Quest game, 11th grader Emily Rodriguez led her family in making sustainable lifestyle changes. Read her inspiring story about reducing their carbon footprint by 15% in just three months.',
      date: 'November 22, 2024',
      category: 'Student Story',
      author: 'EcoQuest Team',
      image: '🌟',
      readTime: '5 min read',
    },
    {
      id: '5',
      title: 'Educational Games Now Available in Spanish',
      excerpt:
        'In our commitment to accessibility and inclusion, we\'re excited to announce that all four of our educational games are now available in Spanish! This expansion will help us reach thousands more students across California.',
      date: 'November 15, 2024',
      category: 'Product Update',
      author: 'Development Team',
      image: '🌐',
      readTime: '3 min read',
    },
    {
      id: '6',
      title: 'October EcoChallenge: Native Plant Garden Success Stories',
      excerpt:
        'Over 100 students participated in our October EcoChallenge to create native plant gardens supporting local pollinators. See the beautiful gardens created and learn about the importance of native plant species.',
      date: 'November 5, 2024',
      category: 'EcoChallenge',
      author: 'Challenge Team',
      image: '🌻',
      readTime: '4 min read',
    },
  ]

  const categories = ['All', 'Impact Story', 'Event Recap', 'Announcement', 'Student Story', 'Product Update', 'EcoChallenge']

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
