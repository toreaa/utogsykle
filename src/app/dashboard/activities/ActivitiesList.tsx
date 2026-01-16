'use client'

import { useState } from 'react'
import { deleteActivity } from './actions'
import { Database } from '@/lib/supabase/database.types'

type Activity = Database['public']['Tables']['activities']['Row'] & {
  activity_types: Database['public']['Tables']['activity_types']['Row'] | null
}

interface Props {
  activities: Activity[]
}

const unitLabels: Record<string, string> = {
  steps: 'steg',
  km: 'km',
  minutes: 'min',
  sessions: 'økter',
}

export default function ActivitiesList({ activities }: Props) {
  const [deleting, setDeleting] = useState<string | null>(null)

  async function handleDelete(id: string) {
    if (!confirm('Er du sikker på at du vil slette denne aktiviteten?')) return

    setDeleting(id)
    await deleteActivity(id)
    setDeleting(null)
  }

  if (activities.length === 0) {
    return (
      <div className="px-6 py-8 text-center text-muted-foreground">
        Ingen aktiviteter registrert ennå. Bruk skjemaet over for å registrere din første aktivitet!
      </div>
    )
  }

  return (
    <div className="divide-y divide-border">
      {activities.map((activity) => (
        <div key={activity.id} className="px-6 py-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-foreground">
                  {activity.activity_types?.name || 'Ukjent'}
                </span>
                <span className="text-sm text-muted-foreground">
                  {activity.value} {activity.activity_types ? unitLabels[activity.activity_types.unit || 'minutes'] : ''}
                </span>
              </div>
              {activity.notes && (
                <p className="mt-1 text-sm text-muted-foreground">{activity.notes}</p>
              )}
              <p className="mt-1 text-xs text-muted-foreground/70">
                {new Date(activity.activity_date).toLocaleDateString('nb-NO', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
                {activity.source !== 'manual' && ` • via ${activity.source}`}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-green-400">
                +{Math.round(activity.points || 0)} poeng
              </span>
              <button
                onClick={() => handleDelete(activity.id)}
                disabled={deleting === activity.id}
                className="text-sm text-destructive hover:text-destructive/80 disabled:opacity-50"
              >
                {deleting === activity.id ? 'Sletter...' : 'Slett'}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
