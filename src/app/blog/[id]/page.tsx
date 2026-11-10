import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ogImage } from '@/lib/og'

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
    content: [
      'On Sunday, October 25, 2026, EcoQuest ran a community cleanup at Friendship Park in Cerritos, from 4:00 to 7:00 PM. It was the in-person half of our October campaign, and it was inspired by National Cleanup Day and its mission of keeping communities clean. Volunteers from a local Scout troop came out to help.',
      'The format was simple on purpose. Everyone signed in at the picnic shelter, picked up a litter grabber, gloves, and a bag, and then spread out across the park and the block around it.',
      'We finished back at the shelter with a group photo and pizza. Photos from the day are on our Events page, and the park is listed in our cleanup history there along with every other cleanup we have run since 2024.',
      'Thank you to everyone who gave up a Sunday afternoon for it. If you would like to join the next one, our Events page lists what is coming up, and the Get Involved page explains how a school, troop, or family can take part.',
    ],
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
    content: [
      'This fall EcoQuest ran its first online seminar series: five free sessions on Zoom, every other Saturday from 11:00 to 11:40 AM Pacific, between September 12 and November 7, 2026. Each session was built on something EcoQuest had already done, so that we were explaining work we knew firsthand.',
      'Reading Real Wildfire Data came out of building Wildfire Watch, and covered where live fire and air-quality data comes from and what a containment percentage does and does not tell you. What a Beach Cleanup Actually Tells Us came out of our Seal Beach cleanups, and treated a cleanup as data collection. Your Home\'s Water and Energy Footprint was about reading your own utility bills and measuring whether a change made any difference. Climate Anxiety and How We Built MindMirror looked at what researchers have measured about climate worry in young people, and was specific about what MindMirror does and does not do. Conservation in Your Own Neighborhood was about finding the environmental work already happening near you and joining it.',
      'The slide deck for every session is published on this site, linked from the Events page. For the first four sessions there is also a short recorded walkthrough, between four and seven minutes long. We label these as recorded walkthroughs because that is what they are: a narrated run through the slides, recorded separately, and not a capture of the live session.',
      'The next series, the EcoQuest Winter Field Lab, starts on November 21, 2026. Its sessions are 30 minutes, and each one ends with something to go and do outside: watch where the first rain of the season goes, log what is living nearby in winter, count birds, see a king tide, or check the air before lighting a fire. The dates and sign-up links are on the Events page.',
    ],
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
    content: [
      'Our first four games were fixed scripts. Every player saw the same ocean, sorted the same items into the same bins, and got the same numbers at the end, wherever they lived. None of it had anything to do with the place the player actually lives. In September 2026 we retired all four and replaced them.',
      'The four new games begin by asking for a ZIP code, and then build themselves around that place. Storm Drain Detective asks you to predict where the water from your street ends up, and then draws the real downstream route to the sea using the U.S. Geological Survey\'s river network data. Backyard Bioblitz shows species that people have actually recorded near you on iNaturalist, with each photographer credited. Air Detective gives you real hourly air-quality data from the Copernicus Atmosphere Monitoring Service with the cause hidden, and asks you to work out what happened. Your Climate Record has you commit to a guess about your town and then shows you 75 years of temperature data for it from Open-Meteo.',
      'We set one rule for all four: every figure on the screen comes from a public scientific dataset for that place, with the source named, or it is not shown at all. Two design choices follow from that. In Air Detective, answering that the evidence is not strong enough to say is sometimes the correct answer, and it earns full marks when it is. In Your Climate Record, you are scored on how well calibrated your guess was, and not only on whether it was right.',
      'Each game ends away from the screen, with a real task to do outdoors, a printable sheet for classrooms, and a link into a project that scientists actually use. All four are free and run in a browser with no account. You can find them on the Games page.',
    ],
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
    content: [
      'The City of Cerritos publishes its adopted budget every year. It is a public document, and it is also a PDF of about 370 pages. GreenLedger is our attempt to turn that document into something a resident, or a student in a government class, can explore in a few minutes. We built it between February and April 2026.',
      'The Budget Explorer covers the city\'s seven departments across three fiscal years, 2023-24 through 2025-26. You can filter for sustainability-related spending, switch between total and per-resident figures, and open a ten-year trend chart drawn from the city\'s OpenGov data. A tax dollar calculator lets you enter a sales tax amount and see how each dollar is divided among the seven departments. A budget simulator lets you move money between departments and see the trade-offs, with some departments locked to reflect fixed obligations. A glossary explains the budget terms in plain language.',
      'Every number in GreenLedger comes from a document the city has published. The app has a sources page that lists each of the eight sources with its name, a link, the date we accessed it, and which features use it. If you think a figure is wrong, you can check it against the original.',
      'We want to be clear about what GreenLedger is. It is a student project built from public records. It is not an official City of Cerritos website, and it does not replace the adopted budget. What we hope it does is make the first ten minutes with a city budget less intimidating, so that more people get to the eleventh. GreenLedger is free to use at ecoquest-greenledger.vercel.app.',
    ],
  },
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
    title: 'MindMirror: Top 500 Finalist in the Blue Ocean Entrepreneurship Competition',
    excerpt:
      'MindMirror screens for depression risk from 60 seconds of speech. Entered in the Blue Ocean Entrepreneurship Competition, it was named a Top 500 Finalist and runs a pre-registered research study.',
    date: 'October 2025 · updated August 2026',
    category: 'Competition',
    author: 'EcoQuest Team',
    image: '🧠',
    img: '/images/apps/mindmirror.png',
    readTime: '4 min read',
    content: [
      'We are excited to share our entry into the Blue Ocean Entrepreneurship Competition: MindMirror, a mental health screening tool built by EcoQuest students. The competition asks students to find an uncontested market space rather than compete in a crowded one. The gap we went after sits between clinical depression screening, which is expensive and often means a weeks-long wait, and consumer wellness apps, which are easy to reach but carry no clinical validation at all. What got us there was environmental: research on climate anxiety in young people is what made us take youth mental health seriously as a problem worth building for.',
      'Here is what MindMirror actually does. You record about sixty seconds of unscripted speech. The app extracts acoustic features from that recording, runs them through a model, and returns an indication of depression risk along with links to real support resources. It is a screening tool, not a diagnosis — the distinction matters, and we say so inside the app. The research question behind it is whether voice features can predict scores on the PHQ-2, a short and widely used clinical depression screener. That study is pre-registered on the Open Science Framework at doi.org/10.17605/OSF.IO/CP8QA, which means the hypothesis and analysis plan were published before we looked at any results.',
      'MindMirror is built with Next.js on Vercel, with the machine learning service running separately. We have collected data from roughly 230 participants recruited through Prolific, a platform for paid research participants — real people compensated for their time, not simulated traffic. Analysis of that data is ongoing, and we are not publishing accuracy figures until it is finished. In May 2026 MindMirror was named a Top 500 Finalist in the 2026 Blue Ocean Entrepreneurship Competition, out of more than 23,000 students from 173 countries; the result is listed publicly on the competition website. One thing we have designed but not built: a climate anxiety module using the CAS-5 scale. The specification is written. Validating it properly would take far more participants than a pilot has, so it remains a design document rather than a feature, and we would rather say that than imply otherwise.',
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
      authors: [post.author],
      images: ogImage(`blog-${post.id}`, post.title),
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
                alt={post.title}
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
              <span className="bg-primary-blue/10 text-primary-blue-dark px-3 py-1 rounded-full text-sm">
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
