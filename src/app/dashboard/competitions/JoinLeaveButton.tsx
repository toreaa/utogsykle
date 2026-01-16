'use client'

import { useState } from 'react'
import { joinCompetition, leaveCompetition } from './actions'
import { Button } from '@/components/ui/button'

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
      <Button
        disabled
        variant="outline"
        className="opacity-50 cursor-not-allowed"
      >
        Ikke startet
      </Button>
    )
  }

  return (
    <Button
      onClick={handleClick}
      disabled={loading}
      variant={participating ? 'destructive' : 'default'}
      className={!participating ? 'glow-primary' : ''}
    >
      {loading
        ? 'Laster...'
        : participating
        ? 'Meld av'
        : 'Bli med'}
    </Button>
  )
}
