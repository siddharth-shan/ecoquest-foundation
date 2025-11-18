'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Mission {
  id: number
  title: string
  description: string
  type: 'cleanup' | 'plant' | 'rescue' | 'research'
  difficulty: 'easy' | 'medium' | 'hard'
  rewards: {
    health: number
    biodiversity: number
    points: number
  }
  duration: number
  icon: string
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
}

interface Zone {
  id: string
  name: string
  type: 'forest' | 'river' | 'meadow' | 'mountain' | 'lake'
  health: number
  threats: string[]
  animals: string[]
  position: { x: number; y: number }
  color: string
}

export default function GuardiansGame() {
  const [gameStarted, setGameStarted] = useState(false)
  const [day, setDay] = useState(1)
  const [overallHealth, setOverallHealth] = useState(75)
  const [biodiversity, setBiodiversity] = useState(60)
  const [points, setPoints] = useState(0)
  const [energy, setEnergy] = useState(100)
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null)
  const [activeMissions, setActiveMissions] = useState<Mission[]>([])
  const [completedMissions, setCompletedMissions] = useState<number[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([
    { id: 'first_mission', title: 'Getting Started', description: 'Complete your first mission', icon: '🌟', unlocked: false },
    { id: 'five_missions', title: 'Dedicated Guardian', description: 'Complete 5 missions', icon: '⭐', unlocked: false },
    { id: 'high_health', title: 'Thriving Ecosystem', description: 'Reach 90% ecosystem health', icon: '💚', unlocked: false },
    { id: 'biodiversity_master', title: 'Biodiversity Master', description: 'Reach 80% biodiversity', icon: '🦋', unlocked: false },
    { id: 'points_collector', title: 'Point Collector', description: 'Earn 500 points', icon: '🏆', unlocked: false },
  ])
  const [showMissionComplete, setShowMissionComplete] = useState(false)
  const [lastReward, setLastReward] = useState({ health: 0, biodiversity: 0, points: 0 })
  const [gameOver, setGameOver] = useState(false)
  const [won, setWon] = useState(false)

  const [zones, setZones] = useState<Zone[]>([
    {
      id: 'forest',
      name: 'Ancient Forest',
      type: 'forest',
      health: 70,
      threats: ['Deforestation', 'Wildfires'],
      animals: ['🦉', '🦌', '🐻', '🦊'],
      position: { x: 15, y: 25 },
      color: 'from-green-600 to-green-800',
    },
    {
      id: 'river',
      name: 'Crystal River',
      type: 'river',
      health: 60,
      threats: ['Pollution', 'Overfishing'],
      animals: ['🐟', '🦆', '🦫', '🦦'],
      position: { x: 45, y: 40 },
      color: 'from-blue-500 to-blue-700',
    },
    {
      id: 'meadow',
      name: 'Wildflower Meadow',
      type: 'meadow',
      health: 80,
      threats: ['Pesticides', 'Habitat Loss'],
      animals: ['🦋', '🐝', '🐰', '🦗'],
      position: { x: 70, y: 30 },
      color: 'from-yellow-500 to-green-500',
    },
    {
      id: 'mountain',
      name: 'Misty Mountains',
      type: 'mountain',
      health: 65,
      threats: ['Mining', 'Climate Change'],
      animals: ['🦅', '🐐', '🦎', '🦔'],
      position: { x: 25, y: 60 },
      color: 'from-gray-600 to-gray-800',
    },
    {
      id: 'lake',
      name: 'Serene Lake',
      type: 'lake',
      health: 55,
      threats: ['Algae Blooms', 'Waste Dumping'],
      animals: ['🐸', '🦢', '🐢', '🦩'],
      position: { x: 60, y: 65 },
      color: 'from-cyan-500 to-blue-600',
    },
  ])

  const missionTemplates: Omit<Mission, 'id'>[] = [
    {
      title: 'Cleanup Crew',
      description: 'Remove pollution and debris from the ecosystem',
      type: 'cleanup',
      difficulty: 'easy',
      rewards: { health: 10, biodiversity: 5, points: 50 },
      duration: 1,
      icon: '🧹',
    },
    {
      title: 'Tree Planting Initiative',
      description: 'Plant native trees to restore the forest',
      type: 'plant',
      difficulty: 'medium',
      rewards: { health: 8, biodiversity: 12, points: 75 },
      duration: 2,
      icon: '🌳',
    },
    {
      title: 'Wildlife Rescue',
      description: 'Save injured animals and return them to the wild',
      type: 'rescue',
      difficulty: 'hard',
      rewards: { health: 5, biodiversity: 15, points: 100 },
      duration: 2,
      icon: '🦋',
    },
    {
      title: 'Ecosystem Research',
      description: 'Study the ecosystem to develop conservation strategies',
      type: 'research',
      difficulty: 'medium',
      rewards: { health: 12, biodiversity: 8, points: 80 },
      duration: 1,
      icon: '🔬',
    },
    {
      title: 'Water Quality Restoration',
      description: 'Filter pollutants and restore clean water',
      type: 'cleanup',
      difficulty: 'hard',
      rewards: { health: 15, biodiversity: 10, points: 120 },
      duration: 3,
      icon: '💧',
    },
    {
      title: 'Habitat Protection',
      description: 'Create protected zones for endangered species',
      type: 'rescue',
      difficulty: 'medium',
      rewards: { health: 10, biodiversity: 10, points: 90 },
      duration: 2,
      icon: '🏕️',
    },
  ]

  useEffect(() => {
    if (gameStarted && !gameOver) {
      // Generate new mission each day
      if (activeMissions.length < 3) {
        generateNewMission()
      }

      // Update overall health based on zones
      const avgHealth = zones.reduce((sum, zone) => sum + zone.health, 0) / zones.length
      setOverallHealth(Math.round(avgHealth))

      // Check win/lose conditions
      if (day >= 15) {
        if (overallHealth >= 80 && biodiversity >= 70) {
          setWon(true)
          setGameOver(true)
        } else if (overallHealth < 30) {
          setWon(false)
          setGameOver(true)
        }
      }

      if (overallHealth <= 0) {
        setWon(false)
        setGameOver(true)
      }

      // Check achievements
      checkAchievements()
    }
  }, [day, gameStarted, completedMissions, overallHealth, biodiversity, points])

  const generateNewMission = () => {
    const template = missionTemplates[Math.floor(Math.random() * missionTemplates.length)]
    const newMission: Mission = {
      ...template,
      id: Date.now() + Math.random(),
    }
    setActiveMissions((prev) => [...prev, newMission])
  }

  const startMission = (mission: Mission) => {
    if (energy < mission.duration * 20) {
      alert('Not enough energy! Rest to restore energy.')
      return
    }

    setEnergy((prev) => Math.max(0, prev - mission.duration * 20))

    setTimeout(() => {
      completeMission(mission)
    }, 1500) // Simulate mission duration
  }

  const completeMission = (mission: Mission) => {
    // Update stats
    setOverallHealth((prev) => Math.min(100, prev + mission.rewards.health))
    setBiodiversity((prev) => Math.min(100, prev + mission.rewards.biodiversity))
    setPoints((prev) => prev + mission.rewards.points)

    // Update zone health if zone selected
    if (selectedZone) {
      setZones((prev) =>
        prev.map((zone) =>
          zone.id === selectedZone.id
            ? { ...zone, health: Math.min(100, zone.health + mission.rewards.health) }
            : zone
        )
      )
    }

    // Show completion animation
    setLastReward(mission.rewards)
    setShowMissionComplete(true)
    setTimeout(() => setShowMissionComplete(false), 2000)

    // Remove from active missions
    setActiveMissions((prev) => prev.filter((m) => m.id !== mission.id))
    setCompletedMissions((prev) => [...prev, mission.id])

    // Generate new mission
    setTimeout(() => generateNewMission(), 500)
  }

  const advanceDay = () => {
    setDay((prev) => prev + 1)
    setEnergy(100)

    // Natural ecosystem degradation
    setZones((prev) =>
      prev.map((zone) => ({
        ...zone,
        health: Math.max(0, zone.health - Math.random() * 5),
      }))
    )

    // Random events
    if (Math.random() < 0.3) {
      const event = getRandomEvent()
      alert(event)
    }
  }

  const getRandomEvent = () => {
    const events = [
      '🌧️ Heavy rain cleaned some pollution naturally! +5 Health',
      '🔥 Wildfire threat detected! Some zones lost health.',
      '🦋 Butterfly migration increased biodiversity! +10 Biodiversity',
      '⚠️ Illegal dumping reported. River health decreased.',
      '🌟 Community volunteers joined! +50 Points',
      '🌱 Native plants spreading naturally! +5 Health',
    ]
    return events[Math.floor(Math.random() * events.length)]
  }

  const checkAchievements = () => {
    setAchievements((prev) =>
      prev.map((achievement) => {
        if (achievement.unlocked) return achievement

        switch (achievement.id) {
          case 'first_mission':
            return { ...achievement, unlocked: completedMissions.length >= 1 }
          case 'five_missions':
            return { ...achievement, unlocked: completedMissions.length >= 5 }
          case 'high_health':
            return { ...achievement, unlocked: overallHealth >= 90 }
          case 'biodiversity_master':
            return { ...achievement, unlocked: biodiversity >= 80 }
          case 'points_collector':
            return { ...achievement, unlocked: points >= 500 }
          default:
            return achievement
        }
      })
    )
  }

  const getHealthColor = (health: number) => {
    if (health >= 70) return 'text-green-500'
    if (health >= 40) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getZoneAnimals = (zone: Zone) => {
    const healthRatio = zone.health / 100
    const animalCount = Math.ceil(healthRatio * zone.animals.length)
    return zone.animals.slice(0, animalCount)
  }

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-800 to-teal-900 text-white">
        <div className="container-custom py-12">
          <div className="mb-6">
            <Link href="/games" className="text-white hover:underline">
              ← Back to Games
            </Link>
          </div>

          <div className="max-w-4xl mx-auto text-center">
            <div className="text-8xl mb-8 animate-bounce">🌳</div>
            <h1 className="text-5xl font-bold mb-6 font-heading">Guardians of the Green</h1>
            <p className="text-2xl mb-8 text-green-100">
              An Interactive Ecosystem Adventure
            </p>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 mb-8">
              <h2 className="text-3xl font-bold mb-6">Your Mission</h2>
              <p className="text-lg mb-6 text-green-100">
                You are the guardian of a diverse ecosystem facing multiple environmental threats.
                Explore five unique zones, complete missions, and make strategic decisions to restore
                balance and save endangered wildlife!
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white/10 rounded-xl p-6">
                  <div className="text-4xl mb-3">🗺️</div>
                  <h3 className="text-xl font-bold mb-2">Explore Zones</h3>
                  <p className="text-sm text-green-100">
                    Click on different ecosystem zones to discover their unique challenges and wildlife
                  </p>
                </div>
                <div className="bg-white/10 rounded-xl p-6">
                  <div className="text-4xl mb-3">🎯</div>
                  <h3 className="text-xl font-bold mb-2">Complete Missions</h3>
                  <p className="text-sm text-green-100">
                    Take on cleanup, research, rescue, and planting missions to restore health
                  </p>
                </div>
                <div className="bg-white/10 rounded-xl p-6">
                  <div className="text-4xl mb-3">⚡</div>
                  <h3 className="text-xl font-bold mb-2">Manage Energy</h3>
                  <p className="text-sm text-green-100">
                    Each mission costs energy. Plan wisely and rest when needed to continue your work
                  </p>
                </div>
                <div className="bg-white/10 rounded-xl p-6">
                  <div className="text-4xl mb-3">🏆</div>
                  <h3 className="text-xl font-bold mb-2">Unlock Achievements</h3>
                  <p className="text-sm text-green-100">
                    Earn badges for your conservation efforts and track your impact
                  </p>
                </div>
              </div>

              <div className="bg-yellow-500/20 border-2 border-yellow-400 rounded-lg p-4 mb-8">
                <p className="font-bold mb-2">🎯 WIN CONDITION:</p>
                <p className="text-sm">
                  Reach Day 15 with ecosystem health above 80% and biodiversity above 70%!
                </p>
              </div>

              <button
                onClick={() => setGameStarted(true)}
                className="bg-green-500 hover:bg-green-600 text-white font-bold text-xl px-12 py-4 rounded-full transition-transform hover:scale-105"
              >
                Begin Your Quest! 🌱
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-800 to-teal-900 text-white">
        <div className="container-custom py-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-9xl mb-8">{won ? '🏆' : '💔'}</div>
            <h1 className="text-5xl font-bold mb-6">
              {won ? 'Victory! Ecosystem Restored!' : 'Mission Failed'}
            </h1>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 mb-8">
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-white/10 rounded-lg p-6">
                  <div className="text-4xl mb-2">💚</div>
                  <div className="text-3xl font-bold">{overallHealth}%</div>
                  <div className="text-sm">Final Health</div>
                </div>
                <div className="bg-white/10 rounded-lg p-6">
                  <div className="text-4xl mb-2">🦋</div>
                  <div className="text-3xl font-bold">{biodiversity}%</div>
                  <div className="text-sm">Biodiversity</div>
                </div>
                <div className="bg-white/10 rounded-lg p-6">
                  <div className="text-4xl mb-2">⭐</div>
                  <div className="text-3xl font-bold">{points}</div>
                  <div className="text-sm">Total Points</div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-4">Missions Completed: {completedMissions.length}</h3>
                <h3 className="text-2xl font-bold mb-4">Days Survived: {day}</h3>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4">Achievements Unlocked:</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {achievements
                    .filter((a) => a.unlocked)
                    .map((achievement) => (
                      <div key={achievement.id} className="bg-yellow-500/20 rounded-lg p-3">
                        <div className="text-3xl mb-1">{achievement.icon}</div>
                        <div className="font-bold text-sm">{achievement.title}</div>
                      </div>
                    ))}
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => {
                    setGameStarted(false)
                    setGameOver(false)
                    setDay(1)
                    setOverallHealth(75)
                    setBiodiversity(60)
                    setPoints(0)
                    setEnergy(100)
                    setCompletedMissions([])
                    setActiveMissions([])
                    setAchievements((prev) => prev.map((a) => ({ ...a, unlocked: false })))
                  }}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-3 rounded-full"
                >
                  Play Again
                </button>
                <Link
                  href="/games"
                  className="bg-white/20 hover:bg-white/30 text-white font-bold px-8 py-3 rounded-full inline-block"
                >
                  Back to Games
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="container-custom py-6">
        <div className="mb-4">
          <Link href="/games" className="text-primary-green hover:underline">
            ← Back to Games
          </Link>
        </div>

        {/* Stats Header */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-xs text-gray-600 mb-1">Day</div>
            <div className="text-2xl font-bold text-primary-green">{day}/15</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-xs text-gray-600 mb-1">Ecosystem Health</div>
            <div className={`text-2xl font-bold ${getHealthColor(overallHealth)}`}>{overallHealth}%</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-xs text-gray-600 mb-1">Biodiversity</div>
            <div className="text-2xl font-bold text-blue-500">{biodiversity}%</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-xs text-gray-600 mb-1">Points</div>
            <div className="text-2xl font-bold text-purple-500">{points}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-xs text-gray-600 mb-1">Energy</div>
            <div className="text-2xl font-bold text-orange-500">{energy}%</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-xs text-gray-600 mb-1">Missions</div>
            <div className="text-2xl font-bold text-green-500">{completedMissions.length}</div>
          </div>
        </div>

        {/* Mission Complete Animation */}
        {showMissionComplete && (
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="bg-green-500 text-white rounded-2xl p-8 shadow-2xl animate-bounce">
              <div className="text-6xl mb-4">✅</div>
              <div className="text-2xl font-bold mb-2">Mission Complete!</div>
              <div className="space-y-1">
                <div>+{lastReward.health}% Health</div>
                <div>+{lastReward.biodiversity}% Biodiversity</div>
                <div>+{lastReward.points} Points</div>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Game Area - Ecosystem Map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-primary-green mb-4">🗺️ Ecosystem Map</h2>

              {/* Interactive Map */}
              <div className="relative bg-gradient-to-br from-green-200 via-blue-100 to-green-300 rounded-xl h-[500px] overflow-hidden border-4 border-green-600">
                {/* Sun/Sky */}
                <div className="absolute top-4 right-4 text-6xl animate-pulse">☀️</div>

                {/* Zones */}
                {zones.map((zone) => (
                  <button
                    key={zone.id}
                    onClick={() => setSelectedZone(zone)}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all hover:scale-110 ${
                      selectedZone?.id === zone.id ? 'scale-125 z-10' : ''
                    }`}
                    style={{ left: `${zone.position.x}%`, top: `${zone.position.y}%` }}
                  >
                    <div
                      className={`bg-gradient-to-br ${zone.color} rounded-full p-6 shadow-lg border-4 ${
                        selectedZone?.id === zone.id ? 'border-yellow-400' : 'border-white'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-4xl mb-2">
                          {zone.type === 'forest' && '🌲'}
                          {zone.type === 'river' && '🌊'}
                          {zone.type === 'meadow' && '🌻'}
                          {zone.type === 'mountain' && '⛰️'}
                          {zone.type === 'lake' && '💧'}
                        </div>
                        <div className="text-white font-bold text-sm">{zone.name}</div>
                        <div className={`text-xs font-bold ${zone.health >= 70 ? 'text-green-200' : zone.health >= 40 ? 'text-yellow-200' : 'text-red-200'}`}>
                          {zone.health.toFixed(0)}%
                        </div>
                      </div>
                    </div>

                    {/* Animals around zone */}
                    {getZoneAnimals(zone).map((animal, i) => (
                      <div
                        key={i}
                        className="absolute text-2xl animate-bounce"
                        style={{
                          top: `${-20 + i * 15}px`,
                          right: `${-20 + i * 10}px`,
                          animationDelay: `${i * 0.2}s`,
                        }}
                      >
                        {animal}
                      </div>
                    ))}
                  </button>
                ))}

                {/* Clouds */}
                <div className="absolute top-10 left-10 text-4xl opacity-70 animate-pulse">☁️</div>
                <div className="absolute top-20 right-32 text-5xl opacity-60 animate-pulse" style={{ animationDelay: '1s' }}>☁️</div>
              </div>

              {/* Zone Details */}
              {selectedZone && (
                <div className="mt-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border-2 border-green-300">
                  <h3 className="text-xl font-bold mb-3">{selectedZone.name}</h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-gray-600">Health Status</div>
                      <div className={`text-2xl font-bold ${getHealthColor(selectedZone.health)}`}>
                        {selectedZone.health.toFixed(0)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Wildlife</div>
                      <div className="text-2xl">{getZoneAnimals(selectedZone).join(' ')}</div>
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="text-sm font-semibold text-gray-700 mb-1">Active Threats:</div>
                    <div className="flex flex-wrap gap-2">
                      {selectedZone.threats.map((threat, i) => (
                        <span key={i} className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs">
                          ⚠️ {threat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Side Panel - Missions & Actions */}
          <div className="space-y-6">
            {/* Available Missions */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-primary-green mb-4">🎯 Available Missions</h3>

              {activeMissions.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <div className="text-4xl mb-2">⏳</div>
                  <p>New missions coming soon...</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeMissions.map((mission) => (
                    <div
                      key={mission.id}
                      className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border-2 border-green-200 hover:border-green-400 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="text-3xl">{mission.icon}</div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-bold ${
                            mission.difficulty === 'easy'
                              ? 'bg-green-200 text-green-700'
                              : mission.difficulty === 'medium'
                              ? 'bg-yellow-200 text-yellow-700'
                              : 'bg-red-200 text-red-700'
                          }`}
                        >
                          {mission.difficulty.toUpperCase()}
                        </span>
                      </div>
                      <h4 className="font-bold mb-1">{mission.title}</h4>
                      <p className="text-xs text-gray-600 mb-3">{mission.description}</p>

                      <div className="flex justify-between items-center text-xs mb-3">
                        <div className="flex gap-2">
                          <span className="text-green-600">+{mission.rewards.health}% HP</span>
                          <span className="text-blue-600">+{mission.rewards.biodiversity}% BD</span>
                          <span className="text-purple-600">+{mission.rewards.points} pts</span>
                        </div>
                      </div>

                      <button
                        onClick={() => startMission(mission)}
                        disabled={energy < mission.duration * 20}
                        className={`w-full py-2 rounded-lg font-bold text-sm transition-colors ${
                          energy >= mission.duration * 20
                            ? 'bg-green-500 hover:bg-green-600 text-white'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {energy >= mission.duration * 20
                          ? `Start Mission (${mission.duration * 20} energy)`
                          : 'Not Enough Energy'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-primary-green mb-4">⚡ Actions</h3>

              <button
                onClick={advanceDay}
                disabled={energy < 50}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg mb-3 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                🌙 End Day & Rest (Restore Energy)
              </button>

              <div className="text-xs text-gray-600 text-center">
                Advancing days will restore energy but ecosystems may degrade naturally
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-primary-green mb-4">🏆 Achievements</h3>

              <div className="space-y-2">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-3 rounded-lg border-2 ${
                      achievement.unlocked
                        ? 'bg-yellow-50 border-yellow-400'
                        : 'bg-gray-50 border-gray-200 opacity-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div>
                        <div className="font-bold text-sm">{achievement.title}</div>
                        <div className="text-xs text-gray-600">{achievement.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Educational Info */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-primary-green mb-4">🌍 What You're Learning</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-3xl mb-2">🔄</div>
              <h3 className="font-bold mb-2">Ecosystem Interconnection</h3>
              <p className="text-sm text-gray-700">
                Every zone affects others. Healthy forests filter water for rivers, meadows support pollinators,
                and mountains regulate climate.
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-3xl mb-2">⚖️</div>
              <h3 className="font-bold mb-2">Conservation Trade-offs</h3>
              <p className="text-sm text-gray-700">
                Real conservation requires strategic resource management. Learn to prioritize actions for maximum
                environmental impact.
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-3xl mb-2">🦋</div>
              <h3 className="font-bold mb-2">Biodiversity Importance</h3>
              <p className="text-sm text-gray-700">
                Diverse ecosystems are resilient. Protecting varied species and habitats ensures long-term
                environmental health.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
