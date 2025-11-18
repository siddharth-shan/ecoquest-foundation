'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface GameState {
  health: number
  biodiversity: number
  pollution: number
  resources: number
  turn: number
  events: string[]
  gameOver: boolean
  won: boolean
}

export default function GuardiansGame() {
  const [gameState, setGameState] = useState<GameState>({
    health: 100,
    biodiversity: 75,
    pollution: 30,
    resources: 50,
    turn: 1,
    events: ['Welcome to Guardians of the Green! Protect your ecosystem for 10 turns.'],
    gameOver: false,
    won: false,
  })

  const [showInstructions, setShowInstructions] = useState(true)

  useEffect(() => {
    // Check win/lose conditions
    if (gameState.turn > 10 && !gameState.gameOver) {
      if (gameState.health > 70 && gameState.pollution < 40) {
        setGameState(prev => ({
          ...prev,
          gameOver: true,
          won: true,
          events: [...prev.events, '🎉 Victory! You successfully protected the ecosystem!'],
        }))
      } else {
        setGameState(prev => ({
          ...prev,
          gameOver: true,
          won: false,
          events: [...prev.events, '💔 Game Over. The ecosystem collapsed.'],
        }))
      }
    }

    if (gameState.health <= 0 || gameState.pollution >= 100) {
      setGameState(prev => ({
        ...prev,
        gameOver: true,
        won: false,
        events: [...prev.events, '💔 Game Over. The ecosystem collapsed.'],
      }))
    }
  }, [gameState.turn, gameState.health, gameState.pollution, gameState.gameOver])

  const takeAction = (action: string) => {
    let newState = { ...gameState }
    let eventMessage = ''

    switch (action) {
      case 'plantTrees':
        if (newState.resources >= 20) {
          newState.resources -= 20
          newState.biodiversity += 15
          newState.health += 10
          newState.pollution -= 5
          eventMessage = '🌳 You planted trees! Biodiversity increased, pollution decreased.'
        } else {
          eventMessage = '❌ Not enough resources to plant trees.'
          setGameState(prev => ({ ...prev, events: [...prev.events, eventMessage] }))
          return
        }
        break

      case 'cleanup':
        if (newState.resources >= 15) {
          newState.resources -= 15
          newState.pollution -= 20
          newState.health += 5
          eventMessage = '🧹 Cleanup successful! Pollution significantly reduced.'
        } else {
          eventMessage = '❌ Not enough resources for cleanup.'
          setGameState(prev => ({ ...prev, events: [...prev.events, eventMessage] }))
          return
        }
        break

      case 'education':
        if (newState.resources >= 10) {
          newState.resources -= 10
          newState.resources += 25
          eventMessage = '📚 Education program launched! Community support increased resources.'
        } else {
          eventMessage = '❌ Not enough resources for education program.'
          setGameState(prev => ({ ...prev, events: [...prev.events, eventMessage] }))
          return
        }
        break

      case 'wildlife':
        if (newState.resources >= 25) {
          newState.resources -= 25
          newState.biodiversity += 20
          newState.health += 8
          eventMessage = '🦋 Wildlife sanctuary created! Biodiversity thriving.'
        } else {
          eventMessage = '❌ Not enough resources for wildlife sanctuary.'
          setGameState(prev => ({ ...prev, events: [...prev.events, eventMessage] }))
          return
        }
        break

      case 'research':
        if (newState.resources >= 15) {
          newState.resources -= 15
          newState.biodiversity += 10
          newState.pollution -= 10
          eventMessage = '🔬 Research revealed new conservation methods!'
        } else {
          eventMessage = '❌ Not enough resources for research.'
          setGameState(prev => ({ ...prev, events: [...prev.events, eventMessage] }))
          return
        }
        break
    }

    // Random events
    const random = Math.random()
    if (random < 0.2) {
      newState.pollution += 10
      eventMessage += ' ⚠️ Industrial pollution increased nearby!'
    } else if (random < 0.3) {
      newState.resources += 15
      eventMessage += ' 🎁 Community donated resources!'
    }

    // Natural decay
    newState.pollution += 5
    newState.biodiversity = Math.max(0, newState.biodiversity - 3)

    // Calculate health
    newState.health = Math.round((newState.biodiversity + (100 - newState.pollution)) / 2)

    // Clamp values
    newState.health = Math.max(0, Math.min(100, newState.health))
    newState.biodiversity = Math.max(0, Math.min(100, newState.biodiversity))
    newState.pollution = Math.max(0, Math.min(100, newState.pollution))

    newState.turn += 1
    newState.events = [...newState.events, `Turn ${newState.turn - 1}: ${eventMessage}`].slice(-5)

    setGameState(newState)
  }

  const resetGame = () => {
    setGameState({
      health: 100,
      biodiversity: 75,
      pollution: 30,
      resources: 50,
      turn: 1,
      events: ['Welcome to Guardians of the Green! Protect your ecosystem for 10 turns.'],
      gameOver: false,
      won: false,
    })
  }

  const getBarColor = (value: number, inverse = false) => {
    if (inverse) {
      if (value < 30) return 'bg-green-500'
      if (value < 60) return 'bg-yellow-500'
      return 'bg-red-500'
    }
    if (value < 30) return 'bg-red-500'
    if (value < 60) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="container-custom py-12">
        <div className="mb-6">
          <Link href="/games" className="text-primary-green hover:underline">
            ← Back to Games
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary-green font-heading mb-2">
              🌳 Guardians of the Green
            </h1>
            <p className="text-gray-600">Protect your ecosystem from pollution and preserve biodiversity!</p>
          </div>

          {showInstructions && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-6 rounded">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg mb-2">How to Play:</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Survive 10 turns while keeping ecosystem health above 70% and pollution below 40%</li>
                    <li>• Use resources wisely to take actions that improve your ecosystem</li>
                    <li>• Each turn, pollution naturally increases - stay proactive!</li>
                    <li>• Random events will challenge or help you along the way</li>
                  </ul>
                </div>
                <button
                  onClick={() => setShowInstructions(false)}
                  className="text-blue-500 hover:text-blue-700 font-bold"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-4 rounded-lg">
              <div className="text-sm opacity-90">Ecosystem Health</div>
              <div className="text-3xl font-bold">{gameState.health}%</div>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white p-4 rounded-lg">
              <div className="text-sm opacity-90">Biodiversity</div>
              <div className="text-3xl font-bold">{gameState.biodiversity}%</div>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-red-600 text-white p-4 rounded-lg">
              <div className="text-sm opacity-90">Pollution Level</div>
              <div className="text-3xl font-bold">{gameState.pollution}%</div>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white p-4 rounded-lg">
              <div className="text-sm opacity-90">Resources</div>
              <div className="text-3xl font-bold">{gameState.resources}</div>
            </div>
          </div>

          {/* Progress Bars */}
          <div className="space-y-3 mb-8">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Health</span>
                <span>{gameState.health}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${getBarColor(gameState.health)}`}
                  style={{ width: `${gameState.health}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Pollution</span>
                <span>{gameState.pollution}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${getBarColor(gameState.pollution, true)}`}
                  style={{ width: `${gameState.pollution}%` }}
                />
              </div>
            </div>
          </div>

          {/* Turn Counter */}
          <div className="text-center mb-6">
            <div className="inline-block bg-primary-green text-white px-6 py-2 rounded-full font-bold">
              Turn {gameState.turn} / 10
            </div>
          </div>

          {/* Actions */}
          {!gameState.gameOver && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              <button
                onClick={() => takeAction('plantTrees')}
                className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-lg text-left transition-colors"
              >
                <div className="font-bold text-lg mb-1">🌳 Plant Trees</div>
                <div className="text-sm opacity-90">Cost: 20 resources</div>
                <div className="text-xs mt-2">+Biodiversity, +Health, -Pollution</div>
              </button>

              <button
                onClick={() => takeAction('cleanup')}
                className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg text-left transition-colors"
              >
                <div className="font-bold text-lg mb-1">🧹 Cleanup Campaign</div>
                <div className="text-sm opacity-90">Cost: 15 resources</div>
                <div className="text-xs mt-2">--Pollution, +Health</div>
              </button>

              <button
                onClick={() => takeAction('education')}
                className="bg-purple-500 hover:bg-purple-600 text-white p-4 rounded-lg text-left transition-colors"
              >
                <div className="font-bold text-lg mb-1">📚 Education Program</div>
                <div className="text-sm opacity-90">Cost: 10 resources</div>
                <div className="text-xs mt-2">++Resources (investment)</div>
              </button>

              <button
                onClick={() => takeAction('wildlife')}
                className="bg-yellow-500 hover:bg-yellow-600 text-white p-4 rounded-lg text-left transition-colors"
              >
                <div className="font-bold text-lg mb-1">🦋 Wildlife Sanctuary</div>
                <div className="text-sm opacity-90">Cost: 25 resources</div>
                <div className="text-xs mt-2">++Biodiversity, +Health</div>
              </button>

              <button
                onClick={() => takeAction('research')}
                className="bg-indigo-500 hover:bg-indigo-600 text-white p-4 rounded-lg text-left transition-colors"
              >
                <div className="font-bold text-lg mb-1">🔬 Research Project</div>
                <div className="text-sm opacity-90">Cost: 15 resources</div>
                <div className="text-xs mt-2">+Biodiversity, -Pollution</div>
              </button>
            </div>
          )}

          {/* Events Log */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-bold mb-3">Event Log:</h3>
            <div className="space-y-2">
              {gameState.events.map((event, i) => (
                <div key={i} className="text-sm text-gray-700 border-l-2 border-primary-green pl-3">
                  {event}
                </div>
              ))}
            </div>
          </div>

          {/* Game Over */}
          {gameState.gameOver && (
            <div className={`text-center p-8 rounded-xl ${gameState.won ? 'bg-green-100' : 'bg-red-100'}`}>
              <div className="text-6xl mb-4">{gameState.won ? '🎉' : '💔'}</div>
              <h2 className="text-3xl font-bold mb-4">
                {gameState.won ? 'Congratulations!' : 'Game Over'}
              </h2>
              <p className="text-lg mb-6">
                {gameState.won
                  ? 'You successfully protected the ecosystem! Your strategic conservation efforts saved the environment.'
                  : 'The ecosystem collapsed. Try different strategies to balance health, biodiversity, and pollution control.'}
              </p>
              <div className="flex gap-4 justify-center">
                <button onClick={resetGame} className="btn btn-primary">
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
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-primary-green mb-4">What You're Learning:</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-lg mb-2">🌱 Ecosystem Balance</h3>
              <p className="text-gray-700 text-sm">
                Healthy ecosystems require balance. Biodiversity and pollution levels directly impact overall ecosystem health.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">♻️ Resource Management</h3>
              <p className="text-gray-700 text-sm">
                Conservation efforts require resources. Education and community engagement help generate sustainable support.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">🌍 Pollution Impact</h3>
              <p className="text-gray-700 text-sm">
                Pollution naturally increases without intervention. Proactive cleanup and prevention are essential.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">🦋 Biodiversity</h3>
              <p className="text-gray-700 text-sm">
                Protecting diverse species and habitats strengthens ecosystem resilience and health.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
