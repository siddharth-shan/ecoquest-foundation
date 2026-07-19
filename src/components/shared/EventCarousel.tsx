'use client'

import { useState } from 'react'
import Image from 'next/image'
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi'

interface EventPhoto {
  src: string
  alt: string
  caption: string
}

export default function EventCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const photos: EventPhoto[] = [
    {
      src: '/images/events/EE83102A-D888-452C-B533-214BEC1FC508.jpeg',
      alt: 'EcoQuest volunteers gathered at a community cleanup',
      caption: 'Team Impact - Our volunteers coming together to make a difference',
    },
    {
      src: '/images/events/55B367F4-481D-4671-8F55-79ED524A3829.jpeg',
      alt: 'Student volunteers with cleanup tools at a community park',
      caption: 'Park Cleanup - Student volunteers gearing up to clean a local community park',
    },
    {
      src: '/images/events/94CA3FA5-D08C-4111-B568-35BDC69DF002.jpeg',
      alt: 'Community members at environmental event',
      caption: 'Community Engagement - Building environmental awareness through hands-on activities',
    },
    {
      src: '/images/events/B6239CD9-5DBE-451E-A9D3-60DBD6FDA6FE.jpeg',
      alt: 'Youth participating in conservation activity',
      caption: 'Youth Conservation - Empowering the next generation of environmental stewards',
    },
    {
      src: '/images/events/C8784219-22B0-4698-9DB4-6D4D8AAA11CE.jpeg',
      alt: 'Volunteers and a Scout troop gathering at a park cleanup',
      caption: 'Community Volunteers - Students and local Scout troops gathering for a park cleanup',
    },
    {
      src: '/images/events/E6EBDFFC-233D-4615-A2B4-558095CACFD0.jpeg',
      alt: 'Volunteers at a community center park cleanup',
      caption: 'Community Cleanup - Volunteers at a Cerritos community park event',
    },
    {
      src: '/images/events/beach_cleanup1.jpeg',
      alt: 'Collected trash from a beach cleanup',
      caption: 'Beach Cleanup - Every piece of trash removed protects marine life',
    },
    {
      src: '/images/events/20240210_101158.jpg',
      alt: 'Student volunteers with cleanup bags and grabbers at a campus cleanup',
      caption: 'Campus Cleanup (Feb 2024) - Students clearing litter from school grounds in Cerritos',
    },
    {
      src: '/images/events/IMG_4346.JPG',
      alt: 'Volunteers restoring a park pathway at Prado Park in Chino',
      caption: 'Prado Park Restoration (Sept 2024) - Cleaning and beautifying Prado Park in Chino, CA',
    },
    {
      src: '/images/events/IMG_4358.JPG',
      alt: 'Volunteer repainting a wooden park post during a Prado Park beautification event',
      caption: 'Prado Park Beautification (Sept 2024) - Repainting park markers and clearing debris in Chino, CA',
    },
    {
      src: '/images/events/IMG_0511.JPG',
      alt: 'Save Our Beach cleanup event with volunteer tents',
      caption: 'Save Our Beach Cleanup (Dec 2024) - Joining the community beach cleanup at Seal Beach',
    },
    {
      src: '/images/events/IMG_1601.jpeg',
      alt: 'Student volunteer collecting litter along the shoreline with reusable totes',
      caption: 'Seal Beach Cleanup (2025) - Collecting litter along the shoreline with reusable Save Our Beach totes',
    },
    {
      src: '/images/events/IMG_1602.jpeg',
      alt: 'Two student volunteers combing the beach and jetty for trash',
      caption: 'Seal Beach Cleanup (2025) - Volunteers combing the beach and jetty for trash',
    },
    {
      src: '/images/events/IMG_1605.jpeg',
      alt: 'Volunteers clearing debris along the tideline at Seal Beach',
      caption: 'Seal Beach Cleanup (2025) - Clearing debris along the tideline',
    },
    {
      src: '/images/events/IMG_3250.JPG',
      alt: 'Students repainting a community basketball court',
      caption: 'Community Beautification (June 2024) - Refreshing a neighborhood basketball court',
    },
    {
      src: '/images/events/IMG_3287.JPG',
      alt: 'Volunteer repainting parking-lot lines at a community park',
      caption: 'Community Beautification (June 2024) - Repainting parking-lot lines to spruce up a community space',
    },
  ]

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + photos.length) % photos.length)
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % photos.length)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="relative">
        {/* Main Image */}
        <div className="relative h-[400px] md:h-[500px] lg:h-[600px] bg-gray-100">
          <Image
            src={photos[currentIndex].src}
            alt={photos[currentIndex].alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            priority={currentIndex === 0}
          />

          {/* Gradient Overlay for Caption */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

          {/* Caption */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <p className="text-white text-lg md:text-xl font-semibold drop-shadow-lg">
              {photos[currentIndex].caption}
            </p>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all hover:scale-110"
            aria-label="Previous photo"
          >
            <HiChevronLeft size={24} />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all hover:scale-110"
            aria-label="Next photo"
          >
            <HiChevronRight size={24} />
          </button>
        </div>

        {/* Thumbnail Navigation */}
        <div className="bg-gray-50 p-4">
          <div className="grid grid-cols-4 md:grid-cols-8 gap-2 max-w-5xl mx-auto">
            {photos.map((photo, index) => (
              <button
                key={index}
                type="button"
                onClick={() => goToSlide(index)}
                aria-label={`Show ${photo.alt}`}
                aria-current={index === currentIndex ? 'true' : undefined}
                className={`relative aspect-square rounded-lg overflow-hidden transition-all ${
                  index === currentIndex
                    ? 'ring-4 ring-primary-green scale-105'
                    : 'ring-2 ring-gray-200 hover:ring-primary-green opacity-60 hover:opacity-100'
                }`}
              >
                <Image
                  src={photo.src}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="100px"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Dot Indicators (Mobile Alternative) */}
        <div className="md:hidden flex justify-center gap-2 py-4 bg-gray-50">
          {photos.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => goToSlide(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-primary-green w-8'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to photo ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Photo Counter */}
      <div className="bg-gray-50 px-6 py-3 text-center">
        <p className="text-sm text-gray-600">
          Photo <span className="font-bold text-primary-green">{currentIndex + 1}</span> of{' '}
          <span className="font-bold">{photos.length}</span>
        </p>
      </div>
    </div>
  )
}
