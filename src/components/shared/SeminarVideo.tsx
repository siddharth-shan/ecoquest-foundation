'use client'

import { useState } from 'react'
import { HiPlay } from 'react-icons/hi'

interface SeminarVideoProps {
  src: string
  poster: string
  title: string
  durationSeconds: number
  label?: string
}

/** 377 -> '6:17' for the thumbnail badge. */
function clock(seconds: number) {
  const s = Math.round(seconds)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

/** 377 -> '6 minutes 17 seconds' for screen readers, which read '6:17' as a time of day. */
function spoken(seconds: number) {
  const s = Math.round(seconds)
  const m = Math.floor(s / 60)
  return `${m} minute${m === 1 ? '' : 's'} ${s % 60} seconds`
}

/**
 * A still with a play button until the visitor asks for the video. The <video>
 * element is not rendered before that, so a page with four recordings on it
 * downloads four small posters rather than four MP4 headers — and the bucket
 * only bills for egress when someone actually watches.
 */
export default function SeminarVideo({
  src,
  poster,
  title,
  durationSeconds,
  label = 'Recording',
}: SeminarVideoProps) {
  const [playing, setPlaying] = useState(false)
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div className="aspect-video w-full rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center p-6 text-center">
        <p className="text-sm text-gray-600">
          This recording could not be loaded right now. The slide deck covers the same material.
        </p>
      </div>
    )
  }

  if (playing) {
    return (
      <video
        src={src}
        poster={poster}
        controls
        autoPlay
        playsInline
        preload="auto"
        onError={() => setFailed(true)}
        className="aspect-video w-full rounded-xl bg-black"
      >
        <a href={src}>Download the recording</a>
      </video>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Play ${label.toLowerCase()}: ${title} (${spoken(durationSeconds)})`}
      className="group relative block aspect-video w-full overflow-hidden rounded-xl bg-gray-900 shadow-sm ring-1 ring-black/5 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-green/50"
    >
      <img
        src={poster}
        alt=""
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
      />
      <span className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" aria-hidden />
      <span
        className="absolute left-1/2 top-1/2 flex h-14 w-14 md:h-16 md:w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-primary-green shadow-lg transition-transform duration-200 group-hover:scale-110"
        aria-hidden
      >
        <HiPlay className="h-10 w-10 md:h-12 md:w-12" />
      </span>
      <span
        className="absolute bottom-2.5 left-3 text-xs font-semibold uppercase tracking-wider text-white/90"
        aria-hidden
      >
        {label}
      </span>
      <span
        className="absolute bottom-2.5 right-3 rounded bg-black/75 px-1.5 py-0.5 text-xs font-semibold tabular-nums text-white"
        aria-hidden
      >
        {clock(durationSeconds)}
      </span>
    </button>
  )
}
