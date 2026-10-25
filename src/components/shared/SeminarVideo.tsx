'use client'

import { useRef, useState } from 'react'
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
 * sits underneath with preload="none", so a page with four recordings on it
 * downloads four small posters rather than four MP4 headers — and the bucket
 * only bills for egress when someone actually watches.
 *
 * play() is called inside the click handler itself. Mounting a fresh
 * <video autoPlay> after a re-render loses the user gesture, and Safari then
 * refuses to start playback with sound — the video just sits paused.
 */
export default function SeminarVideo({
  src,
  poster,
  title,
  durationSeconds,
  label = 'Recorded walkthrough',
}: SeminarVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const [failed, setFailed] = useState(false)

  function start() {
    setPlaying(true)
    // If the browser still refuses, the native controls are showing by now,
    // so a second press on its own play button will work.
    videoRef.current?.play().catch(() => {})
  }

  if (failed) {
    return (
      <div className="aspect-video w-full rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center p-6 text-center">
        <p className="text-sm text-gray-600">
          This recording could not be loaded right now. The slide deck covers the same material.
        </p>
      </div>
    )
  }

  return (
    <div className="relative aspect-video w-full">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        controls={playing}
        playsInline
        preload="none"
        onError={() => setFailed(true)}
        className="h-full w-full rounded-xl bg-black"
      >
        <a href={src}>Download the recording</a>
      </video>
      {!playing && (
        <button
          type="button"
          onClick={start}
          aria-label={`Play ${label.toLowerCase()}: ${title} (${spoken(durationSeconds)})`}
          className="group absolute inset-0 block overflow-hidden rounded-xl bg-gray-900 shadow-sm ring-1 ring-black/5 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-green/50"
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
      )}
    </div>
  )
}
