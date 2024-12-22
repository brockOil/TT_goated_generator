'use client'

import { useState } from 'react'
import TimetableGenerator from '../components/TimetableGenerator'
import PullUpScreen from '../components/PullUpScreen'

export default function Home() {
  const [showContent, setShowContent] = useState(false)

  return (
    <main className="min-h-screen bg-gradient-to-br from-red-600 via-black to-white p-4 sm:p-8 relative overflow-hidden">
      <PullUpScreen onReveal={() => setShowContent(true)} />
      {showContent && (
        <div className="max-w-6xl mx-auto animate-fade-in-down">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white text-center mb-8">
            Welcome to Timetable Generator
          </h1>
          <TimetableGenerator />
        </div>
      )}
    </main>
  )
}

