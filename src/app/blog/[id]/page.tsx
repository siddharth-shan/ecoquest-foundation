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
  img?: string
  readTime: string
  content: string[]
}

const blogPosts: BlogPost[] = [
  {
    id: 'congressional-app-challenge',
    title: 'EcoQuest Wildfire Watch: Our Congressional App Challenge Submission',
    excerpt:
      'Our team built Wildfire Watch, a real-time wildfire monitoring app submitted to the Congressional App Challenge. The app features live wildfire tracking, environmental impact data, and community safety information.',
    date: 'October 2025',
    category: 'Competition',
    author: 'EcoQuest Team',
    image: '🔥',
    img: '/images/apps/wildfire-watch.png',
    readTime: '4 min read',
    content: [
      'EcoQuest Foundation is proud to share our submission to the Congressional App Challenge: Wildfire Watch, a real-time wildfire monitoring application designed to keep communities informed and safe. The Congressional App Challenge is a nationwide student coding competition hosted by members of the U.S. House of Representatives, and we were excited to put our technical skills to work on a problem that directly impacts communities across California and beyond.',
      'Wildfire Watch provides users with live wildfire tracking powered by satellite and sensor data, giving real-time updates on active fires, air quality indices, and evacuation zones. The app also surfaces environmental impact data, showing how wildfires affect local ecosystems, water quality, and biodiversity. For residents in fire-prone areas, the community safety features deliver push notifications with evacuation routes, shelter locations, and emergency contact information. Our goal was to build a tool that not only informs but empowers people to take action when it matters most.',
      'We built Wildfire Watch using React for the frontend interface and Microsoft Azure for our cloud infrastructure, including data processing and real-time notifications. The development process taught our team valuable lessons about working with geospatial data, integrating multiple public APIs, and designing for accessibility under high-stress scenarios. Submitting to the Congressional App Challenge was an incredible experience that pushed us to think critically about how technology can address real environmental threats facing our communities.',
    ],
  },
  {
    id: 'blue-ocean-competition',
    title: 'MindMirror: Competing in the Blue Ocean Entrepreneurship Competition',
    excerpt:
      'MindMirror screens for depression risk from 60 seconds of speech. Entered in the Blue Ocean Student Entrepreneur Competition, it was named a Top 500 Finalist and runs a pre-registered research study.',
    date: 'October 2025',
    category: 'Competition',
    author: 'EcoQuest Team',
    image: '🧠',
    img: '/images/apps/mindmirror.png',
    readTime: '4 min read',
    content: [
      'We are excited to share our entry into the Blue Ocean Student Entrepreneur Competition: MindMirror, a mental health screening tool built by EcoQuest students. The competition asks students to find an uncontested market space rather than compete in a crowded one. The gap we went after sits between clinical depression screening, which is expensive and often means a weeks-long wait, and consumer wellness apps, which are easy to reach but carry no clinical validation at all. What got us there was environmental: research on climate anxiety in young people is what made us take youth mental health seriously as a problem worth building for.',
      'Here is what MindMirror actually does. You record about sixty seconds of unscripted speech. The app extracts acoustic features from that recording, runs them through a model, and returns an indication of depression risk along with links to real support resources. It is a screening tool, not a diagnosis — the distinction matters, and we say so inside the app. The research question behind it is whether voice features can predict scores on the PHQ-2, a short and widely used clinical depression screener. That study is pre-registered on the Open Science Framework at doi.org/10.17605/OSF.IO/CP8QA, which means the hypothesis and analysis plan were published before we looked at any results.',
      'MindMirror is built with Next.js on Vercel, with the machine learning service running separately. We have collected data from roughly 230 participants recruited through Prolific, a platform for paid research participants — real people compensated for their time, not simulated traffic. Analysis of that data is ongoing, and we are not publishing accuracy figures until it is finished. In May 2026 MindMirror was named a Top 500 Finalist in the 2026 Blue Ocean Student Entrepreneur Competition, out of more than 23,000 students from 173 countries; the result is listed publicly on the competition website. One thing we have designed but not built: a climate anxiety module using the CAS-5 scale. The specification is written. Validating it properly would take far more participants than a pilot has, so it remains a design document rather than a feature, and we would rather say that than imply otherwise.',
    ],
  },
  {
    id: 'oceanaware-guardian',
    title: 'Oceanaware Guardian: A Youth Ocean Conservation Platform',
    excerpt:
      'Oceanaware Guardian raises awareness about marine ecosystems and ocean pollution. Built by students, it features marine ecosystem insights, ocean pollution data, and conservation resources.',
    date: 'October 2025',
    category: 'Project',
    author: 'EcoQuest Team',
    image: '🌊',
    img: '/images/apps/oceanaware.png',
    readTime: '4 min read',
    content: [
      'EcoQuest Foundation is glad to share Oceanaware Guardian, our youth-led platform for ocean awareness and marine conservation education. We built it because young people are inheriting the consequences of ocean plastic, warming waters, and coastal erosion, and we wanted a place where students could see what is actually happening to the ocean and what they can do about it.',
      'Oceanaware Guardian provides users with in-depth marine ecosystem insights, covering topics from coral reef health and marine biodiversity to the migratory patterns of endangered species. The app surfaces real ocean pollution data, visualizing the scale of plastic waste, chemical runoff, and other threats facing marine environments in an accessible and compelling way. A dedicated conservation resources section connects users with organizations, volunteer opportunities, and everyday actions they can take to reduce their impact on ocean health.',
      'We built Oceanaware Guardian using Next.js and deployed it on Vercel, ensuring fast load times and a responsive design that works well on both desktop and mobile devices. Building it deepened our understanding of the urgent challenges facing marine ecosystems worldwide. The process of researching ocean pollution data and translating it into an engaging digital experience reinforced our commitment to using technology as a force for environmental education and conservation.',
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
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.id}/` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
    },
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
          <Link href="/blog/" className="text-white/80 hover:text-white mb-4 inline-flex items-center gap-2 transition-colors">
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
          {post.img ? (
            <div className="rounded-2xl h-80 overflow-hidden bg-gray-100 mb-12 shadow-md">
              <img
                src={post.img}
                alt={`${post.title} screenshot`}
                className="w-full h-full object-cover object-top"
              />
            </div>
          ) : (
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl h-80 flex items-center justify-center mb-12">
              <div className="text-9xl">{post.image}</div>
            </div>
          )}

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
            <Link href="/blog/" className="btn btn-outline">
              ← All Posts
            </Link>
            <Link href="/donate/" className="btn btn-primary">
              Support Our Mission →
            </Link>
          </div>
        </div>
      </article>
    </>
  )
}
