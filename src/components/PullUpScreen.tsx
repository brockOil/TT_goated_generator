'use client'

import { useState } from 'react'

interface PullUpScreenProps {
  onReveal: () => void
}

const PullUpScreen: React.FC<PullUpScreenProps> = ({ onReveal }) => {
  const [isPullingUp, setIsPullingUp] = useState(false)

  const handleClick = () => {
    setIsPullingUp(true)
    setTimeout(() => {
      onReveal()
    }, 1000) // Match this with the animation duration
  }

  return (
    <div
      className={`fixed inset-0 bg-black flex items-center justify-center cursor-pointer transition-transform duration-1000 ease-in-out ${
        isPullingUp ? '-translate-y-full' : ''
      }`}
      onClick={handleClick}
    >
      <h1 className="text-6xl font-bold text-white animate-pulse">
        Timetable Generator
      </h1>
    </div>
  )
}

export default PullUpScreen

