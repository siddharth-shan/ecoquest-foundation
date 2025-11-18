'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Choice {
  text: string
  carbon: number
  feedback: string
  icon: string
}

interface Scenario {
  id: number
  title: string
  description: string
  emoji: string
  choices: Choice[]
}

export default function CarbonQuestGame() {
  const [currentScenario, setCurrentScenario] = useState(0)
  const [totalCarbon, setTotalCarbon] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [lastChoice, setLastChoice] = useState<Choice | null>(null)
  const [choicesMade, setChoicesMade] = useState<{scenario: string; choice: string; carbon: number}[]>([])

  const scenarios: Scenario[] = [
    {
      id: 1,
      title: 'Morning Routine',
      description: 'Time to get ready for school! How will you start your day?',
      emoji: '🌅',
      choices: [
        { text: 'Take a 20-minute hot shower', carbon: 15, feedback: 'Long hot showers use lots of energy for heating water', icon: '🚿' },
        { text: 'Take a 5-minute shower', carbon: 4, feedback: 'Great! Short showers save energy and water', icon: '💧' },
        { text: 'Skip the shower today', carbon: 0, feedback: 'Zero water and energy used! Not showering occasionally is okay', icon: '✨' },
      ],
    },
    {
      id: 2,
      title: 'Breakfast Time',
      description: 'What will you have for breakfast?',
      emoji: '🍳',
      choices: [
        { text: 'Bacon and eggs', carbon: 12, feedback: 'Meat production has a high carbon footprint', icon: '🥓' },
        { text: 'Cereal with milk', carbon: 5, feedback: 'Dairy has moderate carbon emissions', icon: '🥣' },
        { text: 'Oatmeal with fruit', carbon: 2, feedback: 'Excellent! Plant-based meals have the lowest carbon footprint', icon: '🍓' },
      ],
    },
    {
      id: 3,
      title: 'Getting to School',
      description: 'How will you get to school today?',
      emoji: '🎒',
      choices: [
        { text: 'Drive alone in a car', carbon: 20, feedback: 'Single-occupancy vehicles produce the most emissions per person', icon: '🚗' },
        { text: 'Carpool with friends', carbon: 7, feedback: 'Good choice! Carpooling reduces emissions per person', icon: '🚙' },
        { text: 'Take the school bus', carbon: 3, feedback: 'Great! Buses are efficient for transporting many people', icon: '🚌' },
        { text: 'Bike or walk', carbon: 0, feedback: 'Perfect! Zero emissions and healthy exercise', icon: '🚴' },
      ],
    },
    {
      id: 4,
      title: 'Lunchtime',
      description: 'What\'s for lunch today?',
      emoji: '🍱',
      choices: [
        { text: 'Fast food burger and fries', carbon: 15, feedback: 'Fast food has high carbon costs from production and packaging', icon: '🍔' },
        { text: 'Packed lunch from home', carbon: 3, feedback: 'Smart! Home-packed meals reduce packaging waste', icon: '🥪' },
        { text: 'Vegetarian school lunch', carbon: 5, feedback: 'Good choice! Vegetarian meals have lower carbon footprints', icon: '🥗' },
      ],
    },
    {
      id: 5,
      title: 'After School',
      description: 'Time to relax! What will you do?',
      emoji: '🏠',
      choices: [
        { text: 'Play video games for 3 hours', carbon: 8, feedback: 'Gaming consoles use electricity. Take breaks to save energy!', icon: '🎮' },
        { text: 'Watch TV for 2 hours', carbon: 5, feedback: 'TVs use energy. Streaming also has a carbon cost', icon: '📺' },
        { text: 'Read a book', carbon: 0, feedback: 'Excellent! Reading uses no electricity', icon: '📚' },
        { text: 'Play outside', carbon: 0, feedback: 'Perfect! Outdoor activities are carbon-free and healthy', icon: '⚽' },
      ],
    },
    {
      id: 6,
      title: 'Shopping Trip',
      description: 'You need to buy some items. How will you shop?',
      emoji: '🛒',
      choices: [
        { text: 'Buy everything new', carbon: 18, feedback: 'New products require resources and energy to manufacture', icon: '🏬' },
        { text: 'Buy some used/thrifted items', carbon: 7, feedback: 'Good! Buying used reduces demand for new production', icon: '♻️' },
        { text: 'Borrow or rent what you need', carbon: 2, feedback: 'Excellent! Sharing economy reduces overall consumption', icon: '🤝' },
      ],
    },
    {
      id: 7,
      title: 'Dinner Plans',
      description: 'Your family is planning dinner. What do you suggest?',
      emoji: '🍽️',
      choices: [
        { text: 'Order delivery from across town', carbon: 16, feedback: 'Delivery vehicles add emissions, especially from far away', icon: '🚗' },
        { text: 'Cook a meat-based meal at home', carbon: 10, feedback: 'Cooking at home is good, but meat has high emissions', icon: '🥩' },
        { text: 'Cook a plant-based meal with local ingredients', carbon: 3, feedback: 'Perfect! Local, plant-based meals have the lowest carbon footprint', icon: '🥦' },
      ],
    },
    {
      id: 8,
      title: 'Evening Temperature',
      description: 'It\'s a bit warm this evening. What will you do?',
      emoji: '🌡️',
      choices: [
        { text: 'Turn AC to 65°F (18°C)', carbon: 14, feedback: 'Very cold AC uses lots of energy. Every degree matters!', icon: '❄️' },
        { text: 'Set AC to 75°F (24°C)', carbon: 6, feedback: 'Better! Moderate AC settings save significant energy', icon: '🌬️' },
        { text: 'Open windows and use a fan', carbon: 1, feedback: 'Great! Natural ventilation and fans use much less energy', icon: '🪟' },
      ],
    },
  ]

  const startGame = () => {
    setGameStarted(true)
    setGameOver(false)
    setCurrentScenario(0)
    setTotalCarbon(0)
    setChoicesMade([])
  }

  const makeChoice = (choice: Choice) => {
    setLastChoice(choice)
    setShowFeedback(true)
    setTotalCarbon(totalCarbon + choice.carbon)
    setChoicesMade([
      ...choicesMade,
      {
        scenario: scenarios[currentScenario].title,
        choice: choice.text,
        carbon: choice.carbon,
      },
    ])

    setTimeout(() => {
      setShowFeedback(false)
      if (currentScenario < scenarios.length - 1) {
        setCurrentScenario(currentScenario + 1)
      } else {
        setGameOver(true)
      }
    }, 3000)
  }

  const getResult = () => {
    if (totalCarbon < 30) {
      return {
        title: '🌟 Carbon Champion!',
        grade: 'A+',
        message: 'Outstanding! Your choices show excellent environmental awareness. You\'re making a real difference!',
        color: 'from-green-500 to-emerald-600',
      }
    } else if (totalCarbon < 50) {
      return {
        title: '🌱 Eco-Friendly!',
        grade: 'A',
        message: 'Great job! You made many low-carbon choices. Keep up the good work!',
        color: 'from-green-400 to-green-600',
      }
    } else if (totalCarbon < 70) {
      return {
        title: '♻️ Good Effort!',
        grade: 'B',
        message: 'You\'re on the right track! There\'s room for improvement in some areas.',
        color: 'from-yellow-500 to-orange-500',
      }
    } else if (totalCarbon < 90) {
      return {
        title: '🌍 Keep Learning!',
        grade: 'C',
        message: 'You can make more sustainable choices. Review the feedback to learn how!',
        color: 'from-orange-500 to-red-500',
      }
    } else {
      return {
        title: '🔥 High Carbon Footprint',
        grade: 'D',
        message: 'Your choices have a high carbon impact. Let\'s learn ways to reduce it!',
        color: 'from-red-500 to-red-700',
      }
    }
  }

  const getAnnualEstimate = () => {
    return (totalCarbon * 365 / 1000).toFixed(1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
      <div className="container-custom py-12">
        <div className="mb-6">
          <Link href="/games" className="text-primary-green hover:underline">
            ← Back to Games
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-purple-600 font-heading mb-2">
              🌍 Carbon Footprint Quest
            </h1>
            <p className="text-gray-600">Make daily choices and discover your environmental impact!</p>
          </div>

          {!gameStarted && !gameOver && (
            <div className="text-center py-12">
              <div className="text-8xl mb-6">🌍</div>
              <h2 className="text-3xl font-bold mb-4">Discover Your Carbon Impact!</h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Every choice we make affects our carbon footprint. Experience a day in your life and see
                how your decisions impact the environment. Can you keep your carbon footprint low?
              </p>

              <div className="bg-purple-50 rounded-lg p-6 mb-8 max-w-lg mx-auto">
                <h3 className="font-bold text-lg mb-3">What You'll Learn:</h3>
                <ul className="text-left space-y-2 text-sm text-gray-700">
                  <li>• How daily activities contribute to carbon emissions</li>
                  <li>• The environmental impact of transportation choices</li>
                  <li>• How food choices affect your carbon footprint</li>
                  <li>• Energy-saving strategies for home and school</li>
                </ul>
              </div>

              <button onClick={startGame} className="btn btn-primary text-xl px-12 py-4">
                Start Quest! 🌍
              </button>
            </div>
          )}

          {gameStarted && !gameOver && !showFeedback && (
            <>
              {/* Progress */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-semibold">Scenario {currentScenario + 1} of {scenarios.length}</span>
                  <span className="font-semibold">Current Carbon: {totalCarbon} kg CO₂</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-indigo-600 h-3 rounded-full transition-all"
                    style={{ width: `${((currentScenario + 1) / scenarios.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Scenario */}
              <div className="text-center mb-8 py-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
                <div className="text-7xl mb-4">{scenarios[currentScenario].emoji}</div>
                <h3 className="text-2xl font-bold mb-2">{scenarios[currentScenario].title}</h3>
                <p className="text-gray-600 text-lg">{scenarios[currentScenario].description}</p>
              </div>

              {/* Choices */}
              <div className="space-y-3">
                {scenarios[currentScenario].choices.map((choice, index) => (
                  <button
                    key={index}
                    onClick={() => makeChoice(choice)}
                    className="w-full bg-white border-2 border-gray-200 hover:border-purple-500 hover:bg-purple-50 p-4 rounded-lg text-left transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{choice.icon}</span>
                        <span className="font-semibold text-lg group-hover:text-purple-600">
                          {choice.text}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500 font-mono">
                        {choice.carbon} kg CO₂
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}

          {showFeedback && lastChoice && (
            <div className="text-center py-16">
              <div className="text-8xl mb-6">{lastChoice.icon}</div>
              <div className="bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl p-8 max-w-lg mx-auto">
                <div className="text-6xl font-bold mb-2">+{lastChoice.carbon}</div>
                <div className="text-xl mb-4">kg CO₂</div>
                <p className="text-lg font-semibold mb-2">{lastChoice.feedback}</p>
              </div>
            </div>
          )}

          {gameOver && (
            <div className="py-8">
              <div className="text-center mb-8">
                <div className="text-7xl mb-4">
                  {totalCarbon < 30 ? '🏆' : totalCarbon < 50 ? '🌟' : totalCarbon < 70 ? '♻️' : '🌍'}
                </div>
                <h2 className="text-4xl font-bold mb-2">{getResult().title}</h2>
              </div>

              <div className={`bg-gradient-to-br ${getResult().color} text-white rounded-xl p-8 mb-8 text-center`}>
                <div className="text-7xl font-bold mb-2">{totalCarbon}</div>
                <div className="text-2xl mb-4">kg CO₂ Today</div>
                <div className="text-4xl font-bold mb-2">{getResult().grade}</div>
                <p className="text-lg mb-4">{getResult().message}</p>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mt-4">
                  <div className="text-sm opacity-90 mb-1">Annual Estimate</div>
                  <div className="text-3xl font-bold">{getAnnualEstimate()} tons CO₂/year</div>
                </div>
              </div>

              {/* Breakdown */}
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <h3 className="font-bold text-xl mb-4 text-center">Your Choices:</h3>
                <div className="space-y-3">
                  {choicesMade.map((choice, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg border-l-4 border-purple-500">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-semibold text-gray-800">{choice.scenario}</div>
                          <div className="text-sm text-gray-600">{choice.choice}</div>
                        </div>
                        <div className="font-bold text-purple-600">{choice.carbon} kg</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <button onClick={startGame} className="btn btn-primary">
                  Try Again
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
          <h2 className="text-2xl font-bold text-purple-600 mb-4">Understanding Carbon Footprint:</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-2">🚗 Transportation</h3>
              <p className="text-gray-700 text-sm">
                Transportation is a major source of carbon emissions. Walking, biking, and public transit are the most sustainable options.
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-2">🍽️ Food Choices</h3>
              <p className="text-gray-700 text-sm">
                Plant-based diets have significantly lower carbon footprints than meat-heavy diets. Local, seasonal foods also reduce emissions.
              </p>
            </div>
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-2">⚡ Energy Use</h3>
              <p className="text-gray-700 text-sm">
                Heating, cooling, and electronics use energy. Small changes like adjusting thermostats and turning off devices make a big difference.
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-2">♻️ Consumption</h3>
              <p className="text-gray-700 text-sm">
                Manufacturing new products requires energy and resources. Buying less, buying used, and repairing items reduces your footprint.
              </p>
            </div>
          </div>

          <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
            <p className="text-sm text-gray-700">
              <strong>Did you know?</strong> The average American produces about 16 tons of CO₂ per year.
              Small daily choices can significantly reduce this number and help combat climate change!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
