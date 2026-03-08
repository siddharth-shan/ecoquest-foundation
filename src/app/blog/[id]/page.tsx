import Link from 'next/link'
import { notFound } from 'next/navigation'

interface BlogPost {
  id: string
  title: string
  excerpt: string
  date: string
  category: string
  author: string
  image: string
  readTime: string
  content: string[]
}

const blogPosts: BlogPost[] = [
  {
    id: 'congressional-app-challenge',
    title: 'EcoQuest Wildfire Watch: Our Congressional App Challenge Submission',
    excerpt:
      'Our team built Wildfire Watch, a real-time wildfire monitoring app submitted to the Congressional App Challenge. The app features live wildfire tracking, environmental impact data, and community safety information.',
    date: 'March 2026',
    category: 'Competition',
    author: 'EcoQuest Team',
    image: '🔥',
    readTime: '4 min read',
    content: [
      'EcoQuest Foundation is proud to share our submission to the Congressional App Challenge: Wildfire Watch, a real-time wildfire monitoring application designed to keep communities informed and safe. The Congressional App Challenge is the most prestigious student software competition in the United States, hosted by members of the U.S. House of Representatives, and we were excited to put our technical skills to work on a problem that directly impacts communities across California and beyond.',
      'Wildfire Watch provides users with live wildfire tracking powered by satellite and sensor data, giving real-time updates on active fires, air quality indices, and evacuation zones. The app also surfaces environmental impact data, showing how wildfires affect local ecosystems, water quality, and biodiversity. For residents in fire-prone areas, the community safety features deliver push notifications with evacuation routes, shelter locations, and emergency contact information. Our goal was to build a tool that not only informs but empowers people to take action when it matters most.',
      'We built Wildfire Watch using React for the frontend interface and Microsoft Azure for our cloud infrastructure, including data processing and real-time notifications. The development process taught our team valuable lessons about working with geospatial data, integrating multiple public APIs, and designing for accessibility under high-stress scenarios. Submitting to the Congressional App Challenge was an incredible experience that pushed us to think critically about how technology can address real environmental threats facing our communities.',
    ],
  },
  {
    id: 'blue-ocean-competition',
    title: 'MindMirror: Competing in the Blue Ocean Entrepreneurship Competition',
    excerpt:
      'MindMirror explores the connection between environmental health and personal well-being. Submitted to the Blue Ocean Entrepreneurship Competition, it features wellness tracking, nature connection insights, and mindfulness resources.',
    date: 'March 2026',
    category: 'Competition',
    author: 'EcoQuest Team',
    image: '🧠',
    readTime: '4 min read',
    content: [
      'We are excited to share our entry into the Blue Ocean Entrepreneurship Competition: MindMirror, an application that explores the powerful connection between environmental health and personal well-being. The Blue Ocean Entrepreneurship Competition challenges students to identify untapped market spaces and develop innovative solutions, and we saw an opportunity to bridge the gap between environmental awareness and mental wellness in a way that no existing product addresses.',
      'MindMirror helps users understand how their relationship with nature affects their overall well-being. The app includes wellness tracking features that monitor mood, stress levels, and daily habits alongside environmental factors like time spent outdoors, local air quality, and seasonal changes. Nature connection insights use this data to reveal patterns between environmental engagement and personal health, while a curated library of mindfulness resources offers guided meditations, breathing exercises, and nature-based activities to help users strengthen their bond with the natural world.',
      'Built with Next.js and deployed on Vercel, MindMirror was designed for speed, accessibility, and a seamless user experience across devices. Competing in the Blue Ocean Entrepreneurship Competition pushed our team to think not just as developers but as entrepreneurs, considering market viability, user acquisition, and long-term sustainability. The experience reinforced our belief that environmental stewardship and personal health are deeply interconnected, and that technology can help people discover and nurture that connection.',
    ],
  },
  {
    id: 'bowseat-ocean-awareness',
    title: 'Oceanaware Guardian: Our Bowseat Ocean Awareness Contest Entry',
    excerpt:
      'Oceanaware Guardian raises awareness about marine ecosystems and ocean pollution. Created for the Bowseat Ocean Awareness Contest, it features marine ecosystem insights, ocean pollution data, and conservation resources.',
    date: 'March 2026',
    category: 'Competition',
    author: 'EcoQuest Team',
    image: '🌊',
    readTime: '4 min read',
    content: [
      'EcoQuest Foundation is thrilled to present Oceanaware Guardian, our entry into the Bowseat Ocean Awareness Contest hosted by bowseat.org. The Bowseat contest invites young people around the world to use their creative and technical talents to raise awareness about ocean issues, and we channeled our passion for marine conservation into building a platform that educates and inspires action to protect our oceans.',
      'Oceanaware Guardian provides users with in-depth marine ecosystem insights, covering topics from coral reef health and marine biodiversity to the migratory patterns of endangered species. The app surfaces real ocean pollution data, visualizing the scale of plastic waste, chemical runoff, and other threats facing marine environments in an accessible and compelling way. A dedicated conservation resources section connects users with organizations, volunteer opportunities, and everyday actions they can take to reduce their impact on ocean health.',
      'We built Oceanaware Guardian using Next.js and deployed it on Vercel, ensuring fast load times and a responsive design that works well on both desktop and mobile devices. Creating this project for the Bowseat Ocean Awareness Contest deepened our understanding of the urgent challenges facing marine ecosystems worldwide. The process of researching ocean pollution data and translating it into an engaging digital experience reinforced our commitment to using technology as a force for environmental education and conservation.',
    ],
  },
]

export function generateStaticParams() {
  return blogPosts.map((post) => ({
    id: post.id,
  }))
}

export function generateMetadata({ params }: { params: { id: string } }) {
  const post = blogPosts.find((p) => p.id === params.id)

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: `${post.title} - EcoQuest Foundation`,
    description: post.excerpt,
  }
}

export default function BlogPost({ params }: { params: { id: string } }) {
  const post = blogPosts.find((p) => p.id === params.id)

  if (!post) {
    notFound()
  }

  return (
    <>
      <div className="bg-gradient-eco text-white py-20">
        <div className="container-custom max-w-4xl">
          <Link href="/blog" className="text-white/80 hover:text-white mb-4 inline-flex items-center gap-2 transition-colors">
            ← Back to Blog
          </Link>
          <div className="inline-block bg-white/20 px-4 py-2 rounded-full text-sm font-semibold mb-4 backdrop-blur-sm">
            {post.category}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-heading">{post.title}</h1>
          <div className="flex items-center gap-4 text-white/90">
            <span>{post.author}</span>
            <span>•</span>
            <span>{post.date}</span>
            <span>•</span>
            <span>{post.readTime}</span>
          </div>
        </div>
      </div>

      <article className="section-padding">
        <div className="container-custom max-w-4xl">
          {/* Featured Image */}
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl h-80 flex items-center justify-center mb-12">
            <div className="text-9xl">{post.image}</div>
          </div>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            {post.content.map((paragraph, index) => (
              <p key={index} className="text-gray-700 leading-relaxed mb-6">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Share & Tags */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="text-gray-700 font-semibold">Tags:</span>
              <span className="bg-primary-green/10 text-primary-green px-3 py-1 rounded-full text-sm">
                {post.category}
              </span>
              <span className="bg-primary-blue/10 text-primary-blue px-3 py-1 rounded-full text-sm">
                Environmental Education
              </span>
              <span className="bg-accent-yellow/50 text-gray-800 px-3 py-1 rounded-full text-sm">
                Impact
              </span>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-12 flex justify-between items-center">
            <Link href="/blog" className="btn btn-outline">
              ← All Posts
            </Link>
            <Link href="/donate" className="btn btn-primary">
              Support Our Mission →
            </Link>
          </div>
        </div>
      </article>
    </>
  )
}
