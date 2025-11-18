'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

interface TrashItem {
  id: number
  x: number
  y: number
  type: 'plastic' | 'can' | 'bottle' | 'bag' | 'straw'
  emoji: string
  points: number
}

export default function OceanCleanupGame() {
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [gameActive, setGameActive] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [trashItems, setTrashItems] = useState<TrashItem[]>([])
  const [animalsSaved, setAnimalsSaved] = useState(0)

  const trashTypes = [
    { type: 'plastic' as const, emoji: '🥤', points: 10 },
    { type: 'can' as const, emoji: '🥫', points: 15 },
    { type: 'bottle' as const, emoji: '🍾', points: 10 },
    { type: 'bag' as const, emoji: '🛍️', points: 20 },
    { type: 'straw' as const, emoji: '🥢', points: 15 },
  ]

  const spawnTrash = useCallback(() => {
    const randomTrash = trashTypes[Math.floor(Math.random() * trashTypes.length)]
    const newTrash: TrashItem = {
      id: Date.now() + Math.random(),
      x: Math.random() * 85,
      y: Math.random() * 75,
      type: randomTrash.type,
      emoji: randomTrash.emoji,
      points: randomTrash.points,
    }
    setTrashItems((prev) => [...prev, newTrash])
  }, [])

  useEffect(() => {
    if (!gameActive || gameOver) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameActive(false)
          setGameOver(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    const spawner = setInterval(() => {
      if (trashItems.length < 15) {
        spawnTrash()
      }
    }, 1500)

    return () => {
      clearInterval(timer)
      clearInterval(spawner)
    }
  }, [gameActive, gameOver, trashItems.length, spawnTrash])

  const startGame = () => {
    setScore(0)
    setTimeLeft(60)
    setGameActive(true)
    setGameOver(false)
    setTrashItems([])
    setAnimalsSaved(0)
    // Spawn initial trash
    for (let i = 0; i < 5; i++) {
      setTimeout(() => spawnTrash(), i * 300)
    }
  }

  const collectTrash = (id: number, points: number) => {
    setTrashItems((prev) => prev.filter((item) => item.id !== id))
    setScore((prev) => prev + points)

    // Every 100 points, save an animal
    if ((score + points) % 100 < points) {
      setAnimalsSaved((prev) => prev + 1)
    }
  }

  const getOceanHealth = () => {
    const health = Math.max(0, 100 - trashItems.length * 5)
    return health
  }

  const getGrade = () => {
    if (score >= 500) return { grade: 'A+', message: 'Ocean Hero! Outstanding work!' }
    if (score >= 400) return { grade: 'A', message: 'Excellent ocean cleanup!' }
    if (score >= 300) return { grade: 'B', message: 'Great effort!' }
    if (score >= 200) return { grade: 'C', message: 'Good start!' }
    return { grade: 'D', message: 'Keep practicing!' }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 via-blue-500 to-blue-700">
      <div className="container-custom py-12">
        <div className="mb-6">
          <Link href="/games" className="text-white hover:underline">
            ← Back to Games
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-5xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-primary-blue font-heading mb-2">
              🌊 Ocean Cleanup Challenge
            </h1>
            <p className="text-gray-600">Click the trash to remove it from the ocean and save marine life!</p>
          </div>

          {!gameActive && !gameOver && (
            <div className="text-center py-12">
              <div className="text-8xl mb-6">🐋</div>
              <h2 className="text-3xl font-bold mb-4">Help Clean Our Oceans!</h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Plastic pollution harms marine life. Click on trash items to remove them from the ocean.
                Race against time to clean as much as you can in 60 seconds!
              </p>
              <div className="bg-blue-50 rounded-lg p-6 mb-6 max-w-md mx-auto">
                <h3 className="font-bold mb-3">Scoring:</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span>🥤 Plastic Cup</span><span className="font-bold">10 pts</span></div>
                  <div className="flex justify-between"><span>🍾 Bottle</span><span className="font-bold">10 pts</span></div>
                  <div className="flex justify-between"><span>🥫 Can</span><span className="font-bold">15 pts</span></div>
                  <div className="flex justify-between"><span>🥢 Straws</span><span className="font-bold">15 pts</span></div>
                  <div className="flex justify-between"><span>🛍️ Plastic Bag</span><span className="font-bold">20 pts</span></div>
                </div>
              </div>
              <button onClick={startGame} className="btn btn-primary text-xl px-12 py-4">
                Start Cleanup! 🌊
              </button>
            </div>
          )}

          {gameActive && (
            <>
              {/* Stats Bar */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white p-4 rounded-lg text-center">
                  <div className="text-sm opacity-90">Score</div>
                  <div className="text-3xl font-bold">{score}</div>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-red-600 text-white p-4 rounded-lg text-center">
                  <div className="text-sm opacity-90">Time Left</div>
                  <div className="text-3xl font-bold">{timeLeft}s</div>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-4 rounded-lg text-center">
                  <div className="text-sm opacity-90">Ocean Health</div>
                  <div className="text-3xl font-bold">{getOceanHealth()}%</div>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white p-4 rounded-lg text-center">
                  <div className="text-sm opacity-90">Animals Saved</div>
                  <div className="text-3xl font-bold">{animalsSaved} 🐠</div>
                </div>
              </div>

              {/* Game Area */}
              <div className="relative bg-gradient-to-b from-blue-300 to-blue-500 rounded-xl h-96 overflow-hidden border-4 border-blue-600">
                {/* Ocean decorations */}
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-blue-800 opacity-30" />

                {/* Marine life */}
                <div className="absolute text-4xl animate-pulse" style={{ top: '20%', left: '10%' }}>🐠</div>
                <div className="absolute text-3xl animate-pulse" style={{ top: '60%', right: '15%', animationDelay: '1s' }}>🐟</div>
                <div className="absolute text-5xl animate-pulse" style={{ bottom: '20%', left: '70%', animationDelay: '0.5s' }}>🐙</div>

                {/* Trash items */}
                {trashItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => collectTrash(item.id, item.points)}
                    className="absolute text-4xl hover:scale-125 transition-transform cursor-pointer animate-bounce"
                    style={{
                      top: `${item.y}%`,
                      left: `${item.x}%`,
                      animationDuration: '2s',
                      animationDelay: `${Math.random()}s`
                    }}
                  >
                    {item.emoji}
                  </button>
                ))}

                {/* Warnings */}
                {trashItems.length > 10 && (
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-full font-bold animate-pulse">
                    ⚠️ Ocean Pollution Critical!
                  </div>
                )}
              </div>

              <div className="mt-4 text-center text-gray-600 text-sm">
                💡 Tip: Every 100 points saves a marine animal!
              </div>
            </>
          )}

          {gameOver && (
            <div className="text-center py-12">
              <div className="text-8xl mb-6">
                {score >= 400 ? '🏆' : score >= 300 ? '🎉' : '🌊'}
              </div>
              <h2 className="text-4xl font-bold mb-4">Cleanup Complete!</h2>

              <div className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white rounded-xl p-8 mb-6 max-w-md mx-auto">
                <div className="text-6xl font-bold mb-2">{score}</div>
                <div className="text-xl mb-4">Final Score</div>
                <div className="text-3xl font-bold mb-2">{getGrade().grade}</div>
                <div className="text-lg">{getGrade().message}</div>
              </div>

              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-8">
                <div className="bg-green-100 p-4 rounded-lg">
                  <div className="text-3xl mb-2">🐠</div>
                  <div className="font-bold text-2xl">{animalsSaved}</div>
                  <div className="text-sm text-gray-600">Animals Saved</div>
                </div>
                <div className="bg-blue-100 p-4 rounded-lg">
                  <div className="text-3xl mb-2">♻️</div>
                  <div className="font-bold text-2xl">{Math.floor(score / 15)}</div>
                  <div className="text-sm text-gray-600">Items Collected</div>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <button onClick={startGame} className="btn btn-primary">
                  Play Again
                </button>
                <Link href="/games" className="btn btn-outline">
                  Back to Games
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Educational Info */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-8 max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-primary-blue mb-4">Ocean Pollution Facts:</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-2">🌊 8 Million Tons</h3>
              <p className="text-gray-700 text-sm">
                Every year, 8 million tons of plastic end up in our oceans, harming marine life and ecosystems.
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-2">🐢 Marine Animals at Risk</h3>
              <p className="text-gray-700 text-sm">
                Over 100,000 marine animals die each year from plastic entanglement and ingestion.
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-2">♻️ Reduce Single-Use Plastics</h3>
              <p className="text-gray-700 text-sm">
                Use reusable bags, bottles, and straws to prevent plastic waste from reaching our oceans.
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-2">🏖️ Beach Cleanups</h3>
              <p className="text-gray-700 text-sm">
                Participate in local beach cleanups to directly remove pollution and protect coastal ecosystems.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
