import Link from 'next/link'
import EventCarousel from '@/components/shared/EventCarousel'

export const metadata = {
  title: 'Events - EcoQuest Foundation',
  description: 'Join community conservation events including beach cleanups, park restoration, and educational workshops.',
}

export default function Events() {
  const upcomingEvents = [
    { date: { month: 'JAN', day: '18', year: '2026' }, type: 'Beach Cleanup', title: 'Santa Monica Beach Cleanup', location: 'Santa Monica Pier, CA', time: '9:00 AM - 12:00 PM' },
    { date: { month: 'FEB', day: '08', year: '2026' }, type: 'Workshop', title: 'Marine Life Conservation Workshop', location: 'Aquarium of the Pacific, Long Beach', time: '10:00 AM - 2:00 PM' },
    { date: { month: 'FEB', day: '22', year: '2026' }, type: 'Park Cleanup', title: 'Huntington Beach State Park Restoration', location: 'Huntington Beach State Park', time: '8:00 AM - 1:00 PM' },
    { date: { month: 'MAR', day: '14', year: '2026' }, type: 'Beach Cleanup', title: 'Venice Beach Spring Cleanup', location: 'Venice Beach, CA', time: '9:00 AM - 12:30 PM' },
    { date: { month: 'MAR', day: '28', year: '2026' }, type: 'Workshop', title: 'Native Plant Gardening Workshop', location: 'LA County Arboretum, Arcadia', time: '1:00 PM - 4:00 PM' },
    { date: { month: 'APR', day: '18', year: '2026' }, type: 'Park Cleanup', title: 'Earth Day Park Restoration', location: 'Griffith Park, Los Angeles', time: '8:00 AM - 2:00 PM' },
  ]

  const pastEvents = [
    { title: 'Venice Beach Cleanup', date: 'November 2024', volunteers: '45', collected: '200+ lbs' },
    { title: 'Topanga State Park Restoration', date: 'October 2024', volunteers: '30', collected: '150 plants' },
    { title: 'Dockweiler Beach Cleanup', date: 'September 2024', volunteers: '60+', collected: '300+ lbs' },
  ]

  return (
    <>
      <div className="bg-gradient-eco text-white text-center py-24">
        <div className="container-custom">
          <h1 className="text-5xl font-bold mb-4 font-heading">Community Events</h1>
          <p className="text-xl">Join us for hands-on conservation activities and environmental workshops</p>
        </div>
      </div>

      <section className="section-padding">
        <div className="container-custom">
          <div className="section-header">
            <h2 className="section-title">Upcoming Events</h2>
            <div className="section-underline" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event, i) => (
              <div key={i} className="card flex flex-col md:flex-row">
                <div className="bg-primary-green text-white p-6 flex flex-col items-center justify-center min-w-[100px]">
                  <div className="text-sm font-semibold">{event.date.month}</div>
                  <div className="text-4xl font-bold my-1">{event.date.day}</div>
                  <div className="text-sm">{event.date.year}</div>
                </div>
                <div className="flex-1 p-6">
                  <span className="text-primary-blue text-xs font-semibold uppercase">{event.type}</span>
                  <h3 className="font-bold text-xl mt-1 mb-3 text-primary-green">{event.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">📍 {event.location}</p>
                  <p className="text-gray-600 text-sm mb-4">🕐 {event.time}</p>
                  <Link
                    href={`/events/register?event=${encodeURIComponent(event.title)}`}
                    className="btn btn-primary text-sm inline-block text-center"
                  >
                    Register Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Photo Carousel */}
      <section className="section-padding bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="container-custom">
          <div className="section-header">
            <h2 className="section-title">Past Activities Gallery</h2>
            <div className="section-underline" />
            <p className="text-gray-600 text-lg">
              Explore moments from our community conservation events and environmental education programs
            </p>
          </div>
          <EventCarousel />
        </div>
      </section>

      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="section-header">
            <h2 className="section-title">Past Events Highlights</h2>
            <div className="section-underline" />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {pastEvents.map((event, i) => (
              <div key={i} className="card">
                <div className="bg-primary-blue/20 h-48 flex items-center justify-center text-6xl">
                  🌊
                </div>
                <div className="p-6">
                  <div className="text-primary-blue text-sm font-semibold mb-2">{event.date}</div>
                  <h3 className="font-bold text-xl mb-4 text-primary-green">{event.title}</h3>
                  <div className="flex gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary-green">{event.volunteers}</div>
                      <div className="text-sm text-gray-600">Volunteers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary-green">{event.collected}</div>
                      <div className="text-sm text-gray-600">Collected</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
