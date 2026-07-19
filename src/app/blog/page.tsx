import NewsletterSignup from '@/components/shared/NewsletterSignup'
import BlogList, { type BlogPost } from '@/components/shared/BlogList'

export const metadata = {
  title: 'News & Updates',
  description: 'Latest news, competition entries, impact stories, and updates from EcoQuest Foundation. Read about our Congressional App Challenge, Blue Ocean Competition, and Bowseat Ocean Awareness Contest submissions.',
  alternates: { canonical: '/blog/' },
  openGraph: {
    title: 'News & Updates - EcoQuest Foundation',
    description: 'Latest news, competition entries, impact stories, and updates from EcoQuest Foundation.',
  },
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
      gradient: 'from-orange-400 to-amber-500',
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
      img: '/images/events/IMG_0511.JPG',
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
      gradient: 'from-orange-500 to-red-600',
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
      img: '/images/apps/wildfire-watch.png',
      readTime: '4 min read',
    },
    {
      id: 'blue-ocean-competition',
      title: 'MindMirror: Competing in the Blue Ocean Entrepreneurship Competition',
      excerpt:
        'MindMirror, our mental wellness and environmental connection platform, was named a Top 500 Finalist in the 2026 Blue Ocean Entrepreneurship Competition - and has since been validated with ~230 real users.',
      date: 'October 2025',
      category: 'Competition',
      author: 'EcoQuest Team',
      image: '🧠',
      img: '/images/apps/mindmirror.png',
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
      img: '/images/apps/oceanaware.png',
      readTime: '3 min read',
    },
  ]

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
          <BlogList posts={posts} />

          {/* Newsletter Signup */}
          <div className="max-w-2xl mx-auto">
            <NewsletterSignup variant="compact" />
          </div>
        </div>
      </section>
    </>
  )
}
