# EcoQuest Foundation: Data Cleanup & Enhancement Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Remove all fabricated data from the EcoQuest Foundation website, replace with real achievements and placeholders, add an Impact Portfolio page, competition badges, social media integration, and community engagement features.

**Architecture:** Modify existing Next.js 14 App Router pages and components in-place. Create one new page (`/impact`). Update the Testimonials component to a Community Voices invitation. Add competition context to apps and programs. Update Footer for social media. All changes are frontend-only (no backend).

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, React Icons

---

### Task 1: Update ImpactDashboard with Real Metrics

**Files:**
- Modify: `src/components/shared/ImpactDashboard.tsx`

**Step 1: Replace fabricated metrics with real data**

Replace the entire metrics array and targetValues in `ImpactDashboard.tsx`. The new metrics should be:

```tsx
const [metrics, setMetrics] = useState<ImpactMetric[]>([
  {
    icon: '🏖️',
    value: 0,
    label: 'Community Cleanups',
    suffix: '',
    color: 'from-yellow-500 to-orange-600',
    description: 'Seal Beach, Cerritos Heritage Park, Cerritos Park East',
  },
  {
    icon: '👥',
    value: 0,
    label: 'Community Members Engaged',
    suffix: '+',
    color: 'from-blue-500 to-cyan-600',
    description: 'Volunteers across our cleanup events',
  },
  {
    icon: '🎮',
    value: 0,
    label: 'Educational Games Built',
    suffix: '',
    color: 'from-green-600 to-teal-600',
    description: 'Interactive learning experiences for K-12 students',
  },
  {
    icon: '🚀',
    value: 0,
    label: 'Apps in National Competitions',
    suffix: '',
    color: 'from-purple-500 to-indigo-600',
    description: 'Congressional App Challenge, Blue Ocean, Bowseat',
  },
  {
    icon: '✍️',
    value: 0,
    label: 'Student Articles Published',
    suffix: '+',
    color: 'from-indigo-500 to-purple-600',
    description: 'Original research and guides on Medium',
  },
])

const targetValues = [3, 35, 4, 3, 3]
```

**Step 2: Update the 2026 Goal section**

Replace the goal text (lines 126-130) with:
```tsx
<p className="text-gray-700">
  Expand our digital initiatives, grow community cleanups, and
  <strong> increase youth participation</strong> through interactive apps and educational programs
</p>
```

**Step 3: Update the heading**

Change "Our Impact in 2024" (line 95) to "Our Impact So Far".

**Step 4: Verify the build compiles**

Run: `cd /Users/work/projects/ecoquest-foundation && npx next build 2>&1 | tail -20`
Expected: Build succeeds

**Step 5: Commit**

```bash
git add src/components/shared/ImpactDashboard.tsx
git commit -m "fix: replace fabricated impact metrics with real data"
```

---

### Task 2: Update Homepage Impact Statistics

**Files:**
- Modify: `src/app/page.tsx` (lines 66-71)

**Step 1: Replace the impact stats array**

Replace the stats array in the "Our Impact" section with:
```tsx
{[
  { number: '4', label: 'Educational Games Built', desc: 'Interactive K-12 experiences' },
  { number: '3', label: 'Community Cleanups', desc: 'Beach & park conservation' },
  { number: '3', label: 'National Competition Entries', desc: 'Apps submitted to prestigious programs' },
  { number: '35+', label: 'Community Members Engaged', desc: 'Through events & programs' },
].map((stat, i) => (
```

**Step 2: Commit**

```bash
git add src/app/page.tsx
git commit -m "fix: update homepage impact stats with real numbers"
```

---

### Task 3: Update Events Page with Real Data

**Files:**
- Modify: `src/app/events/page.tsx`

**Step 1: Replace upcoming events with Coming Soon placeholder**

Replace the `upcomingEvents` array (lines 10-17) and its rendering section (lines 34-63) with a Coming Soon card:

```tsx
// Remove the upcomingEvents array entirely

// Replace the Upcoming Events section (lines 34-63) with:
<section className="section-padding">
  <div className="container-custom">
    <div className="section-header">
      <h2 className="section-title">Upcoming Events</h2>
      <div className="section-underline" />
    </div>
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-12 text-center border-2 border-green-200">
      <div className="text-6xl mb-4">📅</div>
      <h3 className="text-2xl font-bold text-primary-green mb-3">Coming Soon!</h3>
      <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-6">
        We're planning exciting new community conservation events. Sign up for our newsletter to be the first to know!
      </p>
      <Link href="/contact" className="btn btn-primary inline-block">
        Get Notified →
      </Link>
    </div>
  </div>
</section>
```

**Step 2: Replace past events with real data**

Replace the `pastEvents` array (lines 19-23) with:
```tsx
const pastEvents = [
  { title: 'Seal Beach Cleanup', date: '2024', members: '~15', icon: '🏖️' },
  { title: 'Cerritos Heritage Park Cleanup', date: '2024', members: '~10', icon: '🌳' },
  { title: 'Cerritos Park East Cleanup', date: '2024', members: '~10', icon: '🌿' },
]
```

Update the Past Events Highlights rendering to use `members` instead of `volunteers`/`collected`, showing only the member count (no fabricated lbs). Remove the dual-stat layout:

```tsx
{pastEvents.map((event, i) => (
  <div key={i} className="card">
    <div className="bg-primary-green/20 h-48 flex items-center justify-center text-6xl">
      {event.icon}
    </div>
    <div className="p-6">
      <div className="text-primary-blue text-sm font-semibold mb-2">{event.date}</div>
      <h3 className="font-bold text-xl mb-4 text-primary-green">{event.title}</h3>
      <div className="text-center">
        <div className="text-3xl font-bold text-primary-green">{event.members}</div>
        <div className="text-sm text-gray-600">Community Members</div>
      </div>
    </div>
  </div>
))}
```

**Step 3: Verify build**

Run: `cd /Users/work/projects/ecoquest-foundation && npx next build 2>&1 | tail -20`

**Step 4: Commit**

```bash
git add src/app/events/page.tsx
git commit -m "fix: replace fabricated events with real cleanup data and coming soon placeholder"
```

---

### Task 4: Replace Testimonials with Community Voices

**Files:**
- Modify: `src/components/shared/Testimonials.tsx`

**Step 1: Replace entire component**

Replace the full `Testimonials.tsx` with a simpler Community Voices invitation component:

```tsx
export default function CommunityVoices() {
  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-xl p-8">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-primary-green mb-2 font-heading">Community Voices</h2>
        <p className="text-gray-600 text-lg">We'd love to hear about your experience with EcoQuest Foundation</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {[
          { icon: '🎓', title: 'Educators', desc: 'Share how our games and resources have impacted your classroom' },
          { icon: '👨‍👩‍👧‍👦', title: 'Families', desc: 'Tell us how EcoQuest has inspired environmental action at home' },
          { icon: '🌱', title: 'Volunteers', desc: 'Share your experience at our community cleanup events' },
        ].map((category, i) => (
          <div key={i} className="bg-white rounded-xl p-6 text-center border-2 border-gray-100 hover:border-green-300 transition-colors">
            <div className="text-5xl mb-3">{category.icon}</div>
            <h3 className="font-bold text-lg text-primary-green mb-2">{category.title}</h3>
            <p className="text-gray-600 text-sm">{category.desc}</p>
          </div>
        ))}
      </div>

      <div className="text-center bg-white rounded-lg p-6">
        <p className="text-gray-700 mb-4">Have an EcoQuest story to share? We'd love to feature it!</p>
        <a
          href="/contact"
          className="inline-block bg-primary-green hover:bg-primary-green-dark text-white font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          Share Your Story →
        </a>
      </div>
    </div>
  )
}
```

Note: Remove the `'use client'` directive, `useState` import, and the `Testimonial` interface since this component no longer needs client-side state.

**Step 2: Commit**

```bash
git add src/components/shared/Testimonials.tsx
git commit -m "fix: replace fabricated testimonials with Community Voices invitation"
```

---

### Task 5: Clean Up Blog Posts

**Files:**
- Modify: `src/app/blog/page.tsx`

**Step 1: Remove fabricated blog posts**

Keep only posts with `externalUrl` (the real Medium articles) and add new posts about competition submissions. Replace the `posts` array (lines 22-125) with:

```tsx
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
```

**Step 2: Update categories array**

Replace the categories (line 127) with:
```tsx
const categories = ['All', 'Student Story', 'Competition']
```

**Step 3: Commit**

```bash
git add src/app/blog/page.tsx
git commit -m "fix: remove fabricated blog posts, add real competition submission posts"
```

---

### Task 6: Clean Up Contact Page

**Files:**
- Modify: `src/app/contact/page.tsx`

**Step 1: Remove fake phone number**

Remove the phone section (lines 99-105). Replace lines 98-105 with nothing (delete the phone block entirely).

**Step 2: Remove Office Hours section**

Remove lines 116-119 (the office hours block) since this is student-led, not a staffed office.

**Step 3: Commit**

```bash
git add src/app/contact/page.tsx
git commit -m "fix: remove fake phone number and office hours from contact page"
```

---

### Task 7: Clean Up Donate Page

**Files:**
- Modify: `src/app/donate/page.tsx`

**Step 1: Update sidebar impact stats**

Replace the "2024 Impact So Far" section (lines 318-334) with real data:

```tsx
<div className="bg-gradient-to-br from-green-600 to-emerald-700 text-white rounded-2xl shadow-xl p-6">
  <h3 className="text-xl font-bold mb-4">Our Impact So Far</h3>
  <div className="space-y-4">
    <div>
      <div className="text-4xl font-bold">3</div>
      <div className="text-sm opacity-90">Community Cleanups</div>
    </div>
    <div>
      <div className="text-4xl font-bold">35+</div>
      <div className="text-sm opacity-90">Community Members Engaged</div>
    </div>
    <div>
      <div className="text-4xl font-bold">7</div>
      <div className="text-sm opacity-90">Apps & Games Built</div>
    </div>
    <div>
      <div className="text-4xl font-bold">3</div>
      <div className="text-sm opacity-90">National Competition Entries</div>
    </div>
  </div>
</div>
```

**Step 2: Commit**

```bash
git add src/app/donate/page.tsx
git commit -m "fix: update donate page impact stats with real numbers"
```

---

### Task 8: Add Competition Badges to Programs Page

**Files:**
- Modify: `src/app/programs/page.tsx`

**Step 1: Add competition context to each app card**

After each app's feature list and before the "Launch App" button, add a competition badge. For Wildfire Watch (after line 167):
```tsx
<div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
  <p className="text-xs font-semibold text-orange-700">🏛️ Submitted to Congressional App Challenge</p>
</div>
```

For Oceanaware Guardian (after line 202):
```tsx
<div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
  <p className="text-xs font-semibold text-blue-700">🌊 Created for Bowseat Ocean Awareness Contest</p>
</div>
```

For MindMirror (after line 237):
```tsx
<div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
  <p className="text-xs font-semibold text-purple-700">💡 Submitted to Blue Ocean Entrepreneurship Competition</p>
</div>
```

**Step 2: Commit**

```bash
git add src/app/programs/page.tsx
git commit -m "feat: add competition badges to program app cards"
```

---

### Task 9: Add Competition Badges to Homepage Apps Section

**Files:**
- Modify: `src/app/page.tsx`

**Step 1: Add competition field to apps array**

Update the apps array in the Interactive Apps section (lines 91-112) to include competition info:

```tsx
{[
  {
    title: 'Wildfire Watch',
    desc: 'Track wildfires in real-time and access critical environmental safety information for your community',
    icon: '🔥',
    url: 'https://ewfw-hugafhdag5emcjgy.westus2-01.azurewebsites.net',
    gradient: 'from-orange-500 to-red-600',
    badge: '🏛️ Congressional App Challenge',
  },
  {
    title: 'Oceanaware Guardian',
    desc: 'Explore marine ecosystems, track ocean pollution, and learn how to protect our oceans',
    icon: '🌊',
    url: 'https://oceanaware-guardian.vercel.app',
    gradient: 'from-blue-500 to-cyan-600',
    badge: '🌊 Bowseat Ocean Awareness Contest',
  },
  {
    title: 'MindMirror',
    desc: 'Discover the connection between environmental health and personal well-being through mindfulness',
    icon: '🧠',
    url: 'https://mindmirror-pilot.vercel.app/',
    gradient: 'from-purple-500 to-indigo-600',
    badge: '💡 Blue Ocean Competition',
  },
].map((app, i) => (
  <div key={i} className="card card-hover overflow-hidden group">
    <div className={`h-48 bg-gradient-to-br ${app.gradient} flex items-center justify-center text-white relative transition-transform group-hover:scale-105`}>
      <div className="text-7xl">{app.icon}</div>
    </div>
    <div className="p-6">
      <h3 className="font-heading font-bold text-xl mb-2 text-primary-green">{app.title}</h3>
      <div className="bg-gray-100 rounded-full px-3 py-1 text-xs font-semibold text-gray-700 inline-block mb-3">
        {app.badge}
      </div>
      <p className="text-gray-600 mb-6">{app.desc}</p>
      <a
        href={app.url}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-primary text-sm w-full text-center inline-block"
      >
        Launch App →
      </a>
    </div>
  </div>
))}
```

**Step 2: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: add competition badges to homepage app cards"
```

---

### Task 10: Update Footer Social Links

**Files:**
- Modify: `src/components/Footer.tsx`

**Step 1: Replace social icons**

Replace Facebook, Twitter, YouTube with Instagram and LinkedIn. Update imports (line 2):
```tsx
import { FaInstagram, FaLinkedin } from 'react-icons/fa'
```

Replace the social links section (lines 16-29):
```tsx
<div className="flex space-x-4">
  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary-green transition-colors" aria-label="Instagram">
    <FaInstagram size={24} />
  </a>
  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary-green transition-colors" aria-label="LinkedIn">
    <FaLinkedin size={24} />
  </a>
</div>
<p className="text-xs text-gray-500 mt-2">Social accounts coming soon!</p>
```

**Step 2: Update copyright year**

Change `© 2024` (line 65) to `© 2025`.

**Step 3: Commit**

```bash
git add src/components/Footer.tsx
git commit -m "feat: update footer with Instagram/LinkedIn, remove unused social icons"
```

---

### Task 11: Update About Page with Milestone Timeline

**Files:**
- Modify: `src/app/about/page.tsx`

**Step 1: Update "What We've Done" section**

Replace the accomplishments array (lines 46-51) with real milestones:

```tsx
{[
  { icon: '🎮', title: 'Built 4 Educational Games', desc: 'Guardians of the Green, Ocean Cleanup Challenge, Recycling Hero, and Carbon Footprint Quest for K-12 students.' },
  { icon: '🏛️', title: 'Entered National Competitions', desc: 'Submitted apps to Congressional App Challenge, Blue Ocean Entrepreneurship Competition, and Bowseat Ocean Awareness Contest.' },
  { icon: '🏖️', title: '3 Community Cleanups', desc: 'Organized cleanups at Seal Beach, Cerritos Heritage Park, and Cerritos Park East with 35+ volunteers.' },
  { icon: '✍️', title: 'Student-Published Research', desc: 'Original articles on monarch conservation, ocean plastic crisis, and wildfire prevention published on Medium.' },
].map((item, i) => (
```

**Step 2: Commit**

```bash
git add src/app/about/page.tsx
git commit -m "fix: update about page with real accomplishments"
```

---

### Task 12: Create Impact Portfolio Page

**Files:**
- Create: `src/app/impact/page.tsx`

**Step 1: Create the impact portfolio page**

Create a new file at `src/app/impact/page.tsx` with a comprehensive impact portfolio:

```tsx
import Link from 'next/link'

export const metadata = {
  title: 'Impact Portfolio - EcoQuest Foundation',
  description: 'Student-led environmental impact: competitions, community cleanups, educational games, and published research.',
}

export default function ImpactPortfolio() {
  const milestones = [
    { year: '2024', title: 'Founded EcoQuest Foundation', desc: 'Student-led nonprofit focused on environmental education through technology' },
    { year: '2024', title: 'Built 4 Educational Games', desc: 'Guardians of the Green, Ocean Cleanup, Recycling Hero, Carbon Quest' },
    { year: '2024', title: 'First Community Cleanups', desc: 'Organized 3 cleanups at Seal Beach, Cerritos Heritage Park, Cerritos Park East' },
    { year: '2025', title: 'Launched Interactive Apps', desc: 'Wildfire Watch, Oceanaware Guardian, and MindMirror web applications' },
    { year: '2025', title: 'National Competition Entries', desc: 'Congressional App Challenge, Blue Ocean Competition, Bowseat Contest' },
    { year: '2025', title: 'Published Student Research', desc: 'Original articles on monarch butterflies, ocean plastic, and wildfire prevention' },
  ]

  const projects = [
    {
      title: 'Wildfire Watch',
      desc: 'Real-time wildfire monitoring and tracking system providing critical community safety information.',
      competition: 'Congressional App Challenge',
      competitionUrl: 'https://www.congressionalappchallenge.us/',
      appUrl: 'https://ewfw-hugafhdag5emcjgy.westus2-01.azurewebsites.net',
      icon: '🔥',
      gradient: 'from-orange-500 to-red-600',
      skills: ['React', 'Azure', 'Real-time Data', 'GIS Mapping'],
    },
    {
      title: 'MindMirror',
      desc: 'Mental wellness platform exploring the connection between environmental health and personal well-being.',
      competition: 'Blue Ocean Entrepreneurship Competition',
      competitionUrl: '#',
      appUrl: 'https://mindmirror-pilot.vercel.app/',
      icon: '🧠',
      gradient: 'from-purple-500 to-indigo-600',
      skills: ['Next.js', 'Vercel', 'UX Design', 'Wellness Research'],
    },
    {
      title: 'Oceanaware Guardian',
      desc: 'Ocean conservation platform raising awareness about marine ecosystems and pollution.',
      competition: 'Bowseat Ocean Awareness Contest',
      competitionUrl: 'https://bowseat.org/programs/ocean-awareness-contest/contest-overview/',
      appUrl: 'https://oceanaware-guardian.vercel.app',
      icon: '🌊',
      gradient: 'from-blue-500 to-cyan-600',
      skills: ['Next.js', 'Vercel', 'Marine Science', 'Data Visualization'],
    },
  ]

  const games = [
    { title: 'Guardians of the Green', grades: 'Grades 6-12', desc: 'Ecosystem management simulation', link: '/games/guardians' },
    { title: 'Ocean Cleanup Challenge', grades: 'K-8', desc: 'Marine pollution awareness game', link: '/games/ocean-cleanup' },
    { title: 'Recycling Hero', grades: 'K-6', desc: 'Waste sorting and recycling education', link: '/games/recycling-hero' },
    { title: 'Carbon Footprint Quest', grades: 'Grades 4-12', desc: 'Carbon awareness and reduction', link: '/games/carbon-quest' },
  ]

  const skillsShowcase = [
    { category: 'Technical', skills: ['React/Next.js', 'TypeScript', 'Tailwind CSS', 'Azure', 'Vercel', 'Git/GitHub'] },
    { category: 'Design', skills: ['UI/UX Design', 'Responsive Design', 'Game Design', 'Data Visualization'] },
    { category: 'Leadership', skills: ['Nonprofit Management', 'Team Coordination', 'Event Planning', 'Community Outreach'] },
    { category: 'Research', skills: ['Environmental Science', 'Technical Writing', 'Content Creation', 'Marine Biology'] },
  ]

  return (
    <>
      <div className="bg-gradient-eco text-white text-center py-24">
        <div className="container-custom">
          <h1 className="text-5xl font-bold mb-4 font-heading">Impact Portfolio</h1>
          <p className="text-xl max-w-3xl mx-auto">
            A student-led nonprofit building technology for environmental education and community action
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <section className="py-8 bg-white border-b">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            {[
              { number: '3', label: 'Cleanups' },
              { number: '35+', label: 'Volunteers' },
              { number: '4', label: 'Games' },
              { number: '3', label: 'Competition Apps' },
              { number: '3+', label: 'Published Articles' },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-3xl font-bold text-primary-green">{stat.number}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="section-header">
            <h2 className="section-title">Our Journey</h2>
            <div className="section-underline" />
          </div>
          <div className="max-w-3xl mx-auto">
            {milestones.map((milestone, i) => (
              <div key={i} className="flex gap-6 mb-8 last:mb-0">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-primary-green text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {milestone.year}
                  </div>
                  {i < milestones.length - 1 && <div className="w-0.5 flex-1 bg-green-200 mt-2" />}
                </div>
                <div className="pb-8">
                  <h3 className="font-bold text-lg text-primary-green">{milestone.title}</h3>
                  <p className="text-gray-600">{milestone.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Competition Projects */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="section-header">
            <h2 className="section-title">Competition Projects</h2>
            <div className="section-underline" />
            <p className="text-gray-600 text-lg">Apps submitted to national and international competitions</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {projects.map((project, i) => (
              <div key={i} className="card overflow-hidden">
                <div className={`h-40 bg-gradient-to-br ${project.gradient} flex items-center justify-center text-white`}>
                  <div className="text-6xl">{project.icon}</div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-2 text-primary-green">{project.title}</h3>
                  <div className="bg-gray-100 rounded-full px-3 py-1 text-xs font-semibold text-gray-700 inline-block mb-3">
                    {project.competition}
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{project.desc}</p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.skills.map((skill, j) => (
                      <span key={j} className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <a href={project.appUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary text-sm flex-1 text-center">
                      Launch App
                    </a>
                    <a href={project.competitionUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline text-sm flex-1 text-center">
                      Competition
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Educational Games */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="section-header">
            <h2 className="section-title">Educational Games</h2>
            <div className="section-underline" />
            <p className="text-gray-600 text-lg">Interactive learning experiences built for K-12 students</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {games.map((game, i) => (
              <Link key={i} href={game.link} className="card card-hover p-6 text-center block">
                <div className="text-4xl mb-3">🎮</div>
                <h3 className="font-bold text-lg text-primary-green mb-1">{game.title}</h3>
                <div className="text-xs text-primary-blue font-semibold mb-2">{game.grades}</div>
                <p className="text-gray-600 text-sm">{game.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Community Impact */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="section-header">
            <h2 className="section-title">Community Impact</h2>
            <div className="section-underline" />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Seal Beach Cleanup', members: '~15 members', icon: '🏖️' },
              { title: 'Cerritos Heritage Park', members: '~10 members', icon: '🌳' },
              { title: 'Cerritos Park East', members: '~10 members', icon: '🌿' },
            ].map((event, i) => (
              <div key={i} className="card p-6 text-center">
                <div className="text-5xl mb-3">{event.icon}</div>
                <h3 className="font-bold text-lg text-primary-green mb-2">{event.title}</h3>
                <p className="text-gray-600">{event.members}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            <div className="bg-green-50 rounded-xl p-6 text-center border-2 border-green-200">
              <div className="text-3xl font-bold text-primary-green">3+</div>
              <div className="text-sm text-gray-600">Student articles published on Medium</div>
            </div>
            <div className="bg-blue-50 rounded-xl p-6 text-center border-2 border-blue-200">
              <div className="text-3xl font-bold text-primary-blue">7</div>
              <div className="text-sm text-gray-600">Digital products built (games + apps)</div>
            </div>
            <div className="bg-purple-50 rounded-xl p-6 text-center border-2 border-purple-200">
              <div className="text-3xl font-bold text-purple-600">100%</div>
              <div className="text-sm text-gray-600">Student-led and student-built</div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Showcase */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="section-header">
            <h2 className="section-title">Skills & Capabilities</h2>
            <div className="section-underline" />
            <p className="text-gray-600 text-lg">What our team has learned and demonstrated through this initiative</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {skillsShowcase.map((category, i) => (
              <div key={i} className="card p-6">
                <h3 className="font-bold text-lg text-primary-green mb-4">{category.category}</h3>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill, j) => (
                    <span key={j} className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Press & Recognition Placeholder */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="section-header">
            <h2 className="section-title">Recognition & Press</h2>
            <div className="section-underline" />
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-12 text-center border-2 border-green-200">
            <div className="text-5xl mb-4">📰</div>
            <h3 className="text-xl font-bold text-primary-green mb-3">Competition Results Coming Soon</h3>
            <p className="text-gray-600 max-w-2xl mx-auto mb-6">
              We've submitted our apps to the Congressional App Challenge, Blue Ocean Entrepreneurship Competition, and Bowseat Ocean Awareness Contest. Results will be shared here as they are announced.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-white rounded-lg px-6 py-3 shadow-sm border">
                <p className="font-semibold text-sm">🏛️ Congressional App Challenge</p>
              </div>
              <div className="bg-white rounded-lg px-6 py-3 shadow-sm border">
                <p className="font-semibold text-sm">💡 Blue Ocean Competition</p>
              </div>
              <div className="bg-white rounded-lg px-6 py-3 shadow-sm border">
                <p className="font-semibold text-sm">🌊 Bowseat Ocean Awareness</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-eco text-white">
        <div className="container-custom text-center">
          <h2 className="text-4xl font-bold mb-4 font-heading">Want to Get Involved?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join our student-led team and make a real impact on environmental education and conservation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/get-involved" className="btn bg-white text-primary-green hover:bg-gray-100 text-lg px-10">
              Join the Team
            </Link>
            <Link href="/contact" className="btn btn-secondary text-lg px-10">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
```

**Step 2: Verify build**

Run: `cd /Users/work/projects/ecoquest-foundation && npx next build 2>&1 | tail -20`

**Step 3: Commit**

```bash
git add src/app/impact/page.tsx
git commit -m "feat: add Impact Portfolio page for showcasing achievements"
```

---

### Task 13: Add Impact Portfolio to Navigation

**Files:**
- Modify: `src/components/Navbar.tsx`

**Step 1: Add Impact link to navLinks**

Add to the `navLinks` array (after Blog, before Resources):
```tsx
{ name: 'Impact', path: '/impact' },
```

**Step 2: Add Impact link to Footer**

Modify `src/components/Footer.tsx` - add to Quick Links list:
```tsx
<li><Link href="/impact" className="text-gray-400 hover:text-primary-green transition-colors">Impact Portfolio</Link></li>
```

**Step 3: Commit**

```bash
git add src/components/Navbar.tsx src/components/Footer.tsx
git commit -m "feat: add Impact Portfolio to navigation and footer"
```

---

### Task 14: Add Social Sharing & Open Graph Meta Tags

**Files:**
- Modify: `src/app/layout.tsx`

**Step 1: Add Open Graph meta tags to the root layout**

Add OG meta tags to the metadata export in layout.tsx for rich link previews when shared on social media:

```tsx
export const metadata = {
  title: 'EcoQuest Foundation - Empowering Youth to Protect Our Planet',
  description: 'Student-led nonprofit building interactive games, web apps, and community conservation events for environmental education.',
  openGraph: {
    title: 'EcoQuest Foundation',
    description: 'Student-led nonprofit building interactive games, web apps, and community conservation events for environmental education.',
    url: 'https://ecoquestfoundation.org',
    siteName: 'EcoQuest Foundation',
    type: 'website',
  },
}
```

**Step 2: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat: add Open Graph meta tags for social media sharing"
```

---

### Task 15: Final Build Verification

**Step 1: Full build check**

Run: `cd /Users/work/projects/ecoquest-foundation && npx next build 2>&1 | tail -30`
Expected: Build succeeds with no errors

**Step 2: Final commit if any fixes needed**

---

## Promotion Strategy Document (Not Code)

Save this as a reference in the design doc. No code changes needed:

### Instagram Strategy
- Post beach cleanup before/after photos
- Share app screenshots and demo clips
- Team spotlights showing the students behind EcoQuest
- Competition submission announcements
- Tag @congressionalappchallenge, @bowseat in relevant posts

### LinkedIn Strategy
- Create organization page
- Share competition entries as professional achievements
- Post student-written articles from Medium
- Connect with local schools and community organizations
- Highlight the technical skills being developed

### Content Calendar Ideas
- "Behind the Build" series showing app development
- "Meet the Team" student profiles
- Event recap posts with photos
- Competition milestone updates
- Reshare Medium articles with LinkedIn commentary
