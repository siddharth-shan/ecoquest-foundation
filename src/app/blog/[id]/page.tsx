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
    id: '1',
    title: 'Guardians of the Green Reaches 500 Students Milestone!',
    excerpt:
      'Our flagship educational game has now reached over 500 students across 15 schools in California. Teachers report increased engagement in environmental science topics and students developing real-world conservation thinking skills.',
    date: 'December 15, 2024',
    category: 'Impact Story',
    author: 'EcoQuest Team',
    image: '🎮',
    readTime: '3 min read',
    content: [
      'We are thrilled to announce that our flagship educational game, "Guardians of the Green," has officially reached over 500 students across 15 schools in California! This milestone represents months of hard work, dedication, and the unwavering support of educators, students, and environmental advocates.',
      'When we first launched Guardians of the Green in early 2024, our goal was simple: make environmental education engaging, interactive, and impactful. We wanted students to not just learn about ecosystems and conservation, but to experience them in a way that would inspire real-world action.',
      'The response from teachers has been overwhelmingly positive. Ms. Sarah Martinez, a 5th-grade teacher at Lincoln Elementary, shared: "My students are more engaged in environmental science than ever before. The game makes complex ecological concepts accessible and fun. I\'ve seen students apply what they learned in the game to real-life situations, like starting recycling programs at home."',
      'What makes this milestone even more special is the diversity of students we\'re reaching. From urban schools in Los Angeles to coastal communities in San Diego, students from all backgrounds are discovering the importance of environmental stewardship through interactive gameplay.',
      'The game features five distinct ecosystems—Forest, River, Meadow, Mountain, and Lake—each with unique challenges and conservation missions. Players must balance ecosystem health, biodiversity, and pollution levels while completing missions that teach real environmental science concepts.',
      'Looking ahead, we\'re working on expanding the game with new features based on teacher and student feedback. Upcoming updates will include:',
      '• Additional ecosystems (Desert and Coastal regions)',
      '• Multiplayer collaboration mode for classroom competition',
      '• Spanish language support to reach more students',
      '• Integration with Next Generation Science Standards (NGSS)',
      '• Teacher dashboard for tracking student progress',
      'Thank you to all the educators, students, parents, and supporters who have made this milestone possible. Here\'s to the next 500 students—and beyond!',
    ],
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
    content: [
      'On a beautiful Saturday morning, EcoQuest Foundation partnered with Scout Troop 405 for our most successful beach cleanup event to date. More than 30 dedicated volunteers, ranging from ages 8 to 65, gathered at La Jolla Shores in San Diego to tackle marine pollution head-on.',
      'The results exceeded our expectations: over 200 pounds of trash removed from a two-mile stretch of coastline in just three hours. The haul included plastic bottles, food wrappers, cigarette butts, fishing line, and even a discarded beach chair.',
      'Volunteer coordinator Jamie Chen explained the importance of events like this: "Beach cleanups are more than just removing trash—they\'re about education and community building. Every piece of plastic we remove is one less piece that could harm marine life or break down into microplastics."',
      'The event began with a brief educational session led by marine biologist Dr. Rebecca Torres. She explained how ocean pollution affects local wildlife, from sea turtles mistaking plastic bags for jellyfish to birds getting tangled in fishing line. This context helped volunteers understand the real-world impact of their efforts.',
      'Scout Troop 405 brought incredible energy and enthusiasm to the cleanup. Troop leader Mark Davidson shared: "This is exactly the kind of hands-on environmental education our scouts need. They\'re learning that conservation isn\'t just something you read about—it\'s something you do."',
      'Breaking down the trash collected:',
      '• Plastic bottles and containers: 85 lbs',
      '• Food wrappers and packaging: 45 lbs',
      '• Cigarette butts: 30 lbs',
      '• Fishing gear and line: 25 lbs',
      '• Miscellaneous items: 15 lbs',
      'All recyclable materials were properly sorted and sent to local recycling facilities, while non-recyclable trash was disposed of responsibly.',
      'Beyond the environmental impact, the event fostered a strong sense of community. Parents and children worked side-by-side, sharing stories and building connections. Several participants asked about future events and how they could get more involved with EcoQuest Foundation.',
      'Thank you to everyone who participated! Our next beach cleanup is scheduled for January 18, 2026, at Santa Monica Pier. We hope to see you there!',
    ],
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
    content: [
      'EcoQuest Foundation is proud to announce a groundbreaking partnership with Riverside Academy, a progressive middle school in Riverside, California. This collaboration will bring environmental education to all 450 middle school students throughout the 2024-2025 school year.',
      'Under this partnership, Riverside Academy students will have full access to our suite of educational games, including Guardians of the Green, Ocean Cleanup Challenge, Recycling Hero, and Carbon Footprint Quest. Additionally, all students will participate in our monthly EcoChallenge missions, which encourage real-world environmental action.',
      'Principal Dr. Jennifer Walsh expressed her excitement: "Environmental literacy is essential for today\'s students. This partnership with EcoQuest Foundation perfectly aligns with our commitment to hands-on, experiential learning. We\'re thrilled to integrate these innovative tools into our science curriculum."',
      'The partnership includes:',
      '• Access to all EcoQuest educational games for every student',
      '• Monthly EcoChallenge participation for all grade levels (6th-8th)',
      '• Teacher training sessions on integrating games into curriculum',
      '• Quarterly progress reports tracking student engagement and learning outcomes',
      '• Opportunities for students to participate in community cleanup events',
      'Science department chair Mr. David Lopez has been instrumental in bringing this partnership to life: "We\'ve piloted some of the EcoQuest games with select classes, and the student engagement has been remarkable. We\'re excited to expand this to our entire middle school."',
      'This partnership represents a significant step forward in EcoQuest Foundation\'s mission to make environmental education accessible, engaging, and impactful. We look forward to seeing the positive impact on Riverside Academy students and using this collaboration as a model for future school partnerships.',
      'Are you an educator interested in bringing EcoQuest programs to your school? Contact us at partnerships@ecoquest.org to learn more!',
    ],
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
    content: [
      'Emily Rodriguez, an 11th grader from San Marcos High School, discovered EcoQuest Foundation\'s Carbon Footprint Quest game through her environmental science class. What started as a class assignment turned into a family mission that reduced their household carbon footprint by 15% in just three months.',
      '"At first, I played the game just to complete the assignment," Emily explains. "But then I started thinking about all the choices my family was making every day—what we ate, how we got around, how much energy we used. I realized we could do better."',
      'Inspired by the game\'s scenarios and challenges, Emily presented a proposal to her family at Sunday dinner. Using data and examples from Carbon Footprint Quest, she outlined specific changes they could make without drastically altering their lifestyle.',
      'The Rodriguez family\'s carbon reduction strategy included:',
      '• Meatless Mondays and Wednesdays, reducing meat consumption by ~30%',
      '• Carpooling to work and school 3 days per week',
      '• Switching to LED bulbs throughout the house',
      '• Installing a programmable thermostat',
      '• Starting a backyard compost bin',
      '• Buying more local and seasonal produce',
      'Emily\'s mother, Maria Rodriguez, was initially skeptical but quickly became a champion of the changes: "I thought it would be too difficult or expensive, but Emily showed us it didn\'t have to be. Many changes actually saved us money, like carpooling and reducing our energy bill."',
      'To track their progress, Emily created a family carbon footprint spreadsheet, calculating their emissions monthly based on utility bills, grocery receipts, and transportation logs. The gamification aspect of tracking progress kept the whole family engaged.',
      '"The Carbon Footprint Quest game taught me that every choice matters," Emily says. "When I\'m deciding whether to drive or bike to a friend\'s house, or choosing between local tomatoes and imported ones, I think about the impact. It\'s become second nature."',
      'Emily\'s efforts didn\'t stop at home. She started an environmental club at her high school, introducing other students to EcoQuest\'s educational games. The club now has 24 members who regularly participate in EcoChallenge missions and organize campus sustainability initiatives.',
      'Looking ahead, the Rodriguez family plans to install solar panels and replace their older car with an electric vehicle. "Emily opened our eyes to what\'s possible," says her father, Carlos. "We\'re not perfect, but we\'re making progress—and that feels good."',
      'Stories like Emily\'s remind us why environmental education matters. When students are empowered with knowledge and tools, they become catalysts for change in their families and communities.',
    ],
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
    content: [
      'EcoQuest Foundation is excited to announce that all four of our educational games—Guardians of the Green, Ocean Cleanup Challenge, Recycling Hero, and Carbon Footprint Quest—are now fully available in Spanish!',
      'This major update represents months of work by our development team, in collaboration with bilingual educators and native Spanish speakers to ensure accurate translations and cultural relevance.',
      'Why Spanish?',
      'California has the largest Spanish-speaking population in the United States, with over 10 million Spanish speakers. Many of these are students in K-12 education who could benefit from environmental education in their primary language.',
      '"Language should never be a barrier to environmental education," says Maria Sanchez, our Lead Developer. "By offering our games in Spanish, we\'re opening doors for thousands of students who might otherwise miss out on these learning opportunities."',
      'What\'s Included:',
      '• Complete Spanish translation of all game interfaces',
      '• Spanish audio for narration and instructions',
      '• Culturally adapted scenarios and examples',
      '• Bilingual teacher resources and lesson plans',
      '• Easy language toggle feature for bilingual households',
      'The translation process went beyond literal word-for-word conversion. Our team worked carefully to ensure that scenarios, examples, and cultural references resonated with Spanish-speaking students. For example, food choices in Carbon Footprint Quest now include traditional Latin American dishes, and Ocean Cleanup Challenge references beaches and coastal communities familiar to Spanish-speaking families.',
      'Early Feedback',
      'We piloted the Spanish versions with three schools in Los Angeles County that serve predominantly Spanish-speaking students. The response has been overwhelmingly positive.',
      'Teacher Alejandra Gomez shared: "My students who struggle with English science textbooks are thriving with these games. They can focus on learning the environmental concepts without language being a barrier. I\'ve seen confidence and engagement skyrocket."',
      'Looking Forward',
      'This is just the beginning of our accessibility initiatives. We\'re currently exploring:',
      '• Additional language support (Mandarin, Vietnamese)',
      '• Screen reader compatibility for visually impaired students',
      '• Simplified text options for younger learners',
      '• Closed captioning for all audio content',
      'We believe every student deserves access to quality environmental education, regardless of language, ability, or background. This Spanish language launch is a significant step toward that goal.',
      'To access games in Spanish, simply click the language selector in the top right corner of any game. ¡Buena suerte!',
    ],
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
    content: [
      'October\'s EcoChallenge focused on native plant gardening, and the results were nothing short of spectacular! Over 100 students from 12 schools across California created pollinator-friendly native plant gardens, transforming their yards, school campuses, and community spaces.',
      'The challenge encouraged students to research native plants in their region, plan a small garden (minimum 3 square feet), and plant at least three different native species that support local pollinators like bees, butterflies, and hummingbirds.',
      'Why Native Plants Matter',
      'Native plants are perfectly adapted to local climate, soil, and wildlife. They require less water, no pesticides, and provide critical food and habitat for pollinators and other wildlife. By planting native species, students create miniature ecosystems that support biodiversity.',
      'Dr. Patricia Green, a botanist who advised on this challenge, explains: "Many pollinator species have co-evolved with specific native plants over thousands of years. When we replace native plants with exotic ornamentals, we remove food sources that pollinators depend on. These student gardens are creating vital habitat corridors."',
      'Outstanding Gardens',
      'Several students went above and beyond with their gardens. Here are a few highlights:',
      'The Chen Family Butterfly Garden (San Diego)',
      'Eighth-grader Michael Chen and his family created a 20-square-foot butterfly garden featuring California buckwheat, showy milkweed, and California fuchsia. Within two weeks, they documented 7 different butterfly species, including monarchs!',
      '"We planted milkweed specifically for monarch butterflies," Michael explains. "Monarchs lay their eggs on milkweed, and the caterpillars eat it. Without milkweed, monarchs can\'t complete their life cycle. Now we\'re seeing them in our yard almost every day!"',
      'Riverside Elementary School Garden (Riverside)',
      'Ms. Thompson\'s 5th-grade class transformed an unused corner of their schoolyard into a pollinator paradise. They planted white sage, desert marigold, and California poppy, creating both a learning space and wildlife habitat.',
      'The class now uses the garden for ongoing science observations, tracking which pollinators visit which flowers and at what times of day. They\'ve created a detailed field journal documenting their findings.',
      'The Martinez Balcony Garden (Los Angeles)',
      'Not everyone has a yard, but that didn\'t stop 6th-grader Sofia Martinez. She created a container garden on her apartment balcony using native plants suited for pots: California fuschia, seaside daisy, and Douglas iris.',
      '"I wanted to show that you don\'t need a big space to help pollinators," Sofia says. "My balcony garden attracts hummingbirds and native bees. It\'s my own little nature sanctuary in the city."',
      'Educational Impact',
      'Beyond planting, students learned to identify pollinators, understand plant-pollinator relationships, and recognize the importance of native ecosystems. Many students reported increased awareness of native plants in their neighborhoods and a desire to protect local habitats.',
      'Teachers noted that the hands-on nature of this challenge deepened student understanding of ecology concepts in ways that classroom lessons alone couldn\'t achieve.',
      'Join the Next EcoChallenge!',
      'Inspired by these native plant garden success stories? Our next EcoChallenge launches in January 2026—stay tuned for details! Follow us on social media or sign up for our newsletter to be the first to know.',
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
