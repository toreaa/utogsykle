'use client'

import { useState } from 'react'
import { joinCompetition, leaveCompetition } from './actions'

interface Props {
  competitionId: string
  isParticipating: boolean
  isActive: boolean
}

export default function JoinLeaveButton({ competitionId, isParticipating, isActive }: Props) {
  const [loading, setLoading] = useState(false)
  const [participating, setParticipating] = useState(isParticipating)

  async function handleClick() {
    setLoading(true)

    if (participating) {
      const result = await leaveCompetition(competitionId)
      if (!result?.error) {
        setParticipating(false)
      }
    } else {
      const result = await joinCompetition(competitionId)
      if (!result?.error) {
        setParticipating(true)
      }
    }

    setLoading(false)
  }

  if (!isActive && !participating) {
    return (
      <button
        disabled
        className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-400 bg-gray-50 cursor-not-allowed"
      >
        Ikke startet
      </button>
    )
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`flex-1 px-4 py-2 border rounded-md shadow-sm text-sm font-medium disabled:opacity-50 ${
        participating
          ? 'border-red-300 text-red-700 bg-red-50 hover:bg-red-100'
          : 'border-transparent text-white bg-blue-600 hover:bg-blue-700'
      }`}
    >
      {loading
        ? 'Laster...'
        : participating
        ? 'Meld av'
        : 'Bli med'}
    </button>
  )
}
