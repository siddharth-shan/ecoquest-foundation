'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface WasteItem {
  id: number
  name: string
  emoji: string
  category: 'recycle' | 'compost' | 'trash' | 'hazardous'
  description: string
}

export default function RecyclingHeroGame() {
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [lives, setLives] = useState(3)
  const [currentItem, setCurrentItem] = useState<WasteItem | null>(null)
  const [gameOver, setGameOver] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [itemsSorted, setItemsSorted] = useState(0)
  const [feedback, setFeedback] = useState<{ show: boolean; correct: boolean; message: string }>({
    show: false,
    correct: false,
    message: '',
  })

  const wasteItems: WasteItem[] = [
    { id: 1, name: 'Plastic Bottle', emoji: '🧴', category: 'recycle', description: 'Clean plastic bottles are recyclable' },
    { id: 2, name: 'Banana Peel', emoji: '🍌', category: 'compost', description: 'Food scraps make great compost' },
    { id: 3, name: 'Cardboard Box', emoji: '📦', category: 'recycle', description: 'Cardboard is highly recyclable' },
    { id: 4, name: 'Apple Core', emoji: '🍎', category: 'compost', description: 'Fruit waste is compostable' },
    { id: 5, name: 'Aluminum Can', emoji: '🥫', category: 'recycle', description: 'Aluminum is 100% recyclable' },
    { id: 6, name: 'Pizza Box (Greasy)', emoji: '🍕', category: 'trash', description: 'Greasy pizza boxes cannot be recycled' },
    { id: 7, name: 'Glass Bottle', emoji: '🍾', category: 'recycle', description: 'Glass is endlessly recyclable' },
    { id: 8, name: 'Coffee Grounds', emoji: '☕', category: 'compost', description: 'Coffee grounds enrich compost' },
    { id: 9, name: 'Plastic Bag', emoji: '🛍️', category: 'trash', description: 'Most plastic bags go in trash (or special recycling)' },
    { id: 10, name: 'Newspaper', emoji: '📰', category: 'recycle', description: 'Paper products are recyclable' },
    { id: 11, name: 'Eggshells', emoji: '🥚', category: 'compost', description: 'Eggshells add calcium to compost' },
    { id: 12, name: 'Styrofoam Cup', emoji: '🥤', category: 'trash', description: 'Styrofoam is not recyclable in most areas' },
    { id: 13, name: 'Vegetable Scraps', emoji: '🥬', category: 'compost', description: 'Vegetable waste makes excellent compost' },
    { id: 14, name: 'Battery', emoji: '🔋', category: 'hazardous', description: 'Batteries require special disposal' },
    { id: 15, name: 'Steel Can', emoji: '🥫', category: 'recycle', description: 'Steel cans are magnetically sorted for recycling' },
    { id: 16, name: 'Lightbulb', emoji: '💡', category: 'hazardous', description: 'Contains materials needing special handling' },
    { id: 17, name: 'Tea Bag', emoji: '🫖', category: 'compost', description: 'Natural tea bags are compostable' },
    { id: 18, name: 'Chip Bag', emoji: '🍿', category: 'trash', description: 'Multi-material packaging is not recyclable' },
  ]

  useEffect(() => {
    if (gameStarted && !gameOver && currentItem === null) {
      pickNewItem()
    }
  }, [gameStarted, gameOver, currentItem])

  useEffect(() => {
    if (lives <= 0) {
      setGameOver(true)
    }
  }, [lives])

  const pickNewItem = () => {
    const randomItem = wasteItems[Math.floor(Math.random() * wasteItems.length)]
    setCurrentItem(randomItem)
  }

  const startGame = () => {
    setScore(0)
    setStreak(0)
    setLives(3)
    setItemsSorted(0)
    setGameOver(false)
    setGameStarted(true)
    setCurrentItem(null)
  }

  const handleSort = (selectedCategory: string) => {
    if (!currentItem) return

    const isCorrect = selectedCategory === currentItem.category

    if (isCorrect) {
      const points = 10 + streak * 2
      setScore(score + points)
      setStreak(streak + 1)
      setFeedback({
        show: true,
        correct: true,
        message: `✅ Correct! +${points} points! ${currentItem.description}`,
      })
    } else {
      setLives(lives - 1)
      setStreak(0)
      setFeedback({
        show: true,
        correct: false,
        message: `❌ Wrong! ${currentItem.name} goes in ${getCategoryName(currentItem.category)}. ${currentItem.description}`,
      })
    }

    setItemsSorted(itemsSorted + 1)

    setTimeout(() => {
      setFeedback({ show: false, correct: false, message: '' })
      setCurrentItem(null)
    }, 2500)
  }

  const getCategoryName = (category: string) => {
    const names: Record<string, string> = {
      recycle: 'Recycling ♻️',
      compost: 'Compost 🌱',
      trash: 'Trash 🗑️',
      hazardous: 'Hazardous ⚠️',
    }
    return names[category] || category
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      recycle: 'from-blue-500 to-cyan-600',
      compost: 'from-green-500 to-emerald-600',
      trash: 'from-gray-600 to-gray-700',
      hazardous: 'from-orange-500 to-red-600',
    }
    return colors[category] || 'from-gray-400 to-gray-500'
  }

  const getGrade = () => {
    const accuracy = itemsSorted > 0 ? ((itemsSorted - (3 - lives)) / itemsSorted) * 100 : 0
    if (accuracy >= 90) return { grade: 'A+', message: 'Recycling Expert!' }
    if (accuracy >= 80) return { grade: 'A', message: 'Excellent Sorting!' }
    if (accuracy >= 70) return { grade: 'B', message: 'Good Job!' }
    if (accuracy >= 60) return { grade: 'C', message: 'Keep Learning!' }
    return { grade: 'D', message: 'Practice More!' }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-green-50">
      <div className="container-custom py-12">
        <div className="mb-6">
          <Link href="/games" className="text-primary-green hover:underline">
            ← Back to Games
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-primary-green font-heading mb-2">
              ♻️ Recycling Hero
            </h1>
            <p className="text-gray-600">Sort waste into the correct bins and become a recycling champion!</p>
          </div>

          {!gameStarted && !gameOver && (
            <div className="text-center py-12">
              <div className="text-8xl mb-6">♻️</div>
              <h2 className="text-3xl font-bold mb-4">Learn to Sort Waste Correctly!</h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Proper waste sorting is crucial for recycling and composting. Learn which items go in which bin
                and help reduce waste going to landfills!
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-2xl mx-auto">
                {(['recycle', 'compost', 'trash', 'hazardous'] as const).map((cat) => (
                  <div key={cat} className={`bg-gradient-to-br ${getCategoryColor(cat)} text-white p-4 rounded-lg`}>
                    <div className="font-bold">{getCategoryName(cat)}</div>
                  </div>
                ))}
              </div>

              <button onClick={startGame} className="btn btn-primary text-xl px-12 py-4">
                Start Sorting! ♻️
              </button>
            </div>
          )}

          {gameStarted && !gameOver && (
            <>
              {/* Stats */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-yellow-500 to-orange-600 text-white p-4 rounded-lg text-center">
                  <div className="text-sm opacity-90">Score</div>
                  <div className="text-3xl font-bold">{score}</div>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-4 rounded-lg text-center">
                  <div className="text-sm opacity-90">Streak</div>
                  <div className="text-3xl font-bold">{streak} 🔥</div>
                </div>
                <div className="bg-gradient-to-br from-red-500 to-pink-600 text-white p-4 rounded-lg text-center">
                  <div className="text-sm opacity-90">Lives</div>
                  <div className="text-3xl font-bold">{'❤️'.repeat(lives)}</div>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white p-4 rounded-lg text-center">
                  <div className="text-sm opacity-90">Sorted</div>
                  <div className="text-3xl font-bold">{itemsSorted}</div>
                </div>
              </div>

              {/* Current Item */}
              {currentItem && !feedback.show && (
                <div className="text-center mb-8 py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
                  <div className="text-9xl mb-4 animate-bounce">{currentItem.emoji}</div>
                  <h3 className="text-3xl font-bold text-gray-800">{currentItem.name}</h3>
                  <p className="text-gray-600 mt-2">Where does this belong?</p>
                </div>
              )}

              {/* Feedback */}
              {feedback.show && (
                <div
                  className={`text-center mb-8 py-12 rounded-xl ${
                    feedback.correct ? 'bg-green-100' : 'bg-red-100'
                  }`}
                >
                  <div className="text-6xl mb-4">{feedback.correct ? '✅' : '❌'}</div>
                  <p className="text-xl font-bold px-4">{feedback.message}</p>
                </div>
              )}

              {/* Bins */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(['recycle', 'compost', 'trash', 'hazardous'] as const).map((category) => (
                  <button
                    key={category}
                    onClick={() => handleSort(category)}
                    disabled={feedback.show}
                    className={`bg-gradient-to-br ${getCategoryColor(category)} text-white p-8 rounded-xl hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <div className="text-4xl mb-2">
                      {category === 'recycle' && '♻️'}
                      {category === 'compost' && '🌱'}
                      {category === 'trash' && '🗑️'}
                      {category === 'hazardous' && '⚠️'}
                    </div>
                    <div className="font-bold text-lg">{getCategoryName(category).split(' ')[0]}</div>
                  </button>
                ))}
              </div>

              <div className="mt-6 text-center text-sm text-gray-600">
                💡 Tip: Streaks give bonus points! Sort correctly in a row to maximize your score.
              </div>
            </>
          )}

          {gameOver && (
            <div className="text-center py-12">
              <div className="text-8xl mb-6">
                {itemsSorted >= 15 ? '🏆' : '♻️'}
              </div>
              <h2 className="text-4xl font-bold mb-4">Game Over!</h2>

              <div className="bg-gradient-to-br from-yellow-500 to-orange-600 text-white rounded-xl p-8 mb-6 max-w-md mx-auto">
                <div className="text-6xl font-bold mb-2">{score}</div>
                <div className="text-xl mb-4">Final Score</div>
                <div className="text-3xl font-bold mb-2">{getGrade().grade}</div>
                <div className="text-lg">{getGrade().message}</div>
              </div>

              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-8">
                <div className="bg-green-100 p-4 rounded-lg">
                  <div className="text-3xl mb-2">📊</div>
                  <div className="font-bold text-2xl">{itemsSorted}</div>
                  <div className="text-sm text-gray-600">Items Sorted</div>
                </div>
                <div className="bg-blue-100 p-4 rounded-lg">
                  <div className="text-3xl mb-2">✅</div>
                  <div className="font-bold text-2xl">{itemsSorted + lives - 3}</div>
                  <div className="text-sm text-gray-600">Correct Sorts</div>
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
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-primary-green mb-4">Waste Sorting Guide:</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-2">♻️ Recycling</h3>
              <p className="text-gray-700 text-sm mb-2">
                Clean paper, cardboard, plastic bottles, metal cans, and glass.
              </p>
              <p className="text-xs text-gray-600">Items must be clean and dry!</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-2">🌱 Compost</h3>
              <p className="text-gray-700 text-sm mb-2">
                Food scraps, fruit/vegetable peels, coffee grounds, eggshells, yard waste.
              </p>
              <p className="text-xs text-gray-600">No meat, dairy, or oils!</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-2">🗑️ Trash</h3>
              <p className="text-gray-700 text-sm mb-2">
                Contaminated items, styrofoam, plastic bags, greasy pizza boxes.
              </p>
              <p className="text-xs text-gray-600">When in doubt, check local guidelines!</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-2">⚠️ Hazardous</h3>
              <p className="text-gray-700 text-sm mb-2">
                Batteries, electronics, lightbulbs, chemicals, paint.
              </p>
              <p className="text-xs text-gray-600">Take to special collection sites!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
