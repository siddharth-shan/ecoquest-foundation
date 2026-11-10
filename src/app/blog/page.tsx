import NewsletterSignup from '@/components/shared/NewsletterSignup'
import BlogList, { type BlogPost } from '@/components/shared/BlogList'
import { ogImage } from '@/lib/og'

export const metadata = {
  title: 'News & Updates',
  description: 'Latest news, competition entries, impact stories, and updates from EcoQuest Foundation. Read about our Congressional App Challenge and Blue Ocean Competition submissions and our youth-led ocean conservation work.',
  alternates: { canonical: '/blog/' },
  openGraph: {
    title: 'News & Updates - EcoQuest Foundation',
    description: 'Latest news, competition entries, impact stories, and updates from EcoQuest Foundation.',
    images: ogImage('blog', 'EcoQuest Foundation news and updates'),
  },
}

export default function BlogPage() {
  const posts: BlogPost[] = [
    {
      id: 'friendship-park-cleanup',
      title: 'An Afternoon at Friendship Park',
      excerpt:
        'On Sunday, October 25, 2026, we ran a community cleanup at Friendship Park in Cerritos. Here is how the afternoon went.',
      date: 'November 2026',
      category: 'Event',
      author: 'EcoQuest Team',
      image: '🧹',
      img: '/images/events/friendship-park-2026-3.webp',
      readTime: '2 min read',
    },
    {
      id: 'fall-seminar-series',
      title: 'Our First Online Seminar Series',
      excerpt:
        'This fall EcoQuest ran its first series of free online seminars: five 40-minute sessions on Zoom, each built on a project we had already done. The slides for every session are on this site.',
      date: 'November 2026',
      category: 'Event',
      author: 'EcoQuest Team',
      image: '🎓',
      img: '/images/seminars/wildfire-data.webp',
      readTime: '3 min read',
    },
    {
      id: 'games-rebuilt',
      title: 'Why We Rebuilt All Four of Our Games',
      excerpt:
        'Our first four games showed every player the same ocean and the same numbers. In September 2026 we retired them and built four new ones that start from the player\'s own ZIP code and use public scientific data.',
      date: 'November 2026',
      category: 'Project',
      author: 'EcoQuest Team',
      image: '🎮',
      img: '/images/games/climate-record.png',
      readTime: '3 min read',
    },
    {
      id: 'greenledger',
      title: 'GreenLedger: A City Budget You Can Actually Read',
      excerpt:
        'The City of Cerritos publishes its adopted budget as a PDF of about 370 pages. GreenLedger is our attempt to turn that document into something a resident, or a student, can explore in a few minutes.',
      date: 'November 2026',
      category: 'Project',
      author: 'EcoQuest Team',
      image: '📊',
      img: '/images/apps/greenledger.png',
      readTime: '3 min read',
    },
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
      readTime: '5 min read',
      externalUrl: 'https://medium.com/@siddharth.shanmugaraja/monarch-butterfly-conservation-a-california-native-plants-guide-34e7ffcf660f',
    },
    {
      id: 'ocean-plastic',
      title: 'The Ocean Plastic Crisis: What I Learned After Many Days of Beach Cleanups',
      excerpt:
        'What a student learned about ocean plastic pollution from collecting beach trash. Complete with data, wildlife encounters, and actionable solutions everyone can implement today.',
      date: 'November 18, 2025',
      category: 'Student Story',
      author: 'Student Conservation Team',
      image: '🌊',
      img: '/images/events/IMG_0511.webp',
      readTime: '8 min read',
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
      readTime: '8 min read',
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
      title: 'MindMirror: Top 500 Finalist in the Blue Ocean Entrepreneurship Competition',
      excerpt:
        'MindMirror screens for depression risk from 60 seconds of speech. It was named a Top 500 Finalist in the 2026 Blue Ocean Entrepreneurship Competition, and has collected data from ~230 Prolific research participants.',
      date: 'October 2025 · updated August 2026',
      category: 'Competition',
      author: 'EcoQuest Team',
      image: '🧠',
      img: '/images/apps/mindmirror.png',
      readTime: '3 min read',
    },
    {
      id: 'oceanaware-guardian',
      title: 'Oceanaware Guardian: A Youth Ocean Conservation Platform',
      excerpt:
        'We created Oceanaware Guardian as a youth-led ocean awareness initiative - a platform dedicated to raising awareness about marine ecosystems, ocean pollution, and conservation.',
      date: 'October 2025',
      category: 'Project',
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
