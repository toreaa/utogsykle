'use client'

import { useState } from 'react'
import { updateCompetition, deleteCompetition } from '../actions'
import { Database } from '@/lib/supabase/database.types'
import { Button } from '@/components/ui/button'

type Competition = Database['public']['Tables']['competitions']['Row']

interface Props {
  competition: Competition
}

export default function CompetitionEditForm({ competition }: Props) {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    setSuccess(false)

    const result = await updateCompetition(competition.id, formData)
    if (result?.error) {
      setError(result.error)
    } else {
      setSuccess(true)
    }
    setLoading(false)
  }

  async function handleDelete() {
    setLoading(true)
    const result = await deleteCompetition(competition.id)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <form action={handleSubmit} className="p-6 space-y-6">
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-lg">
          Endringene er lagret!
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-foreground">
          Navn *
        </label>
        <input
          type="text"
          name="name"
          id="name"
          required
          defaultValue={competition.name}
          className="mt-1 block w-full bg-card border border-input rounded-lg shadow-sm py-2 px-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-foreground">
          Beskrivelse
        </label>
        <textarea
          name="description"
          id="description"
          rows={3}
          defaultValue={competition.description || ''}
          className="mt-1 block w-full bg-card border border-input rounded-lg shadow-sm py-2 px-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-foreground">
          Status
        </label>
        <select
          name="status"
          id="status"
          defaultValue={competition.status || 'active'}
          className="mt-1 block w-full bg-card border border-input rounded-lg shadow-sm py-2 px-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent sm:text-sm"
        >
          <option value="draft">Utkast</option>
          <option value="active">Aktiv</option>
          <option value="completed">Fullført</option>
          <option value="cancelled">Avlyst</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-foreground">
            Startdato
          </label>
          <input
            type="date"
            name="startDate"
            id="startDate"
            defaultValue={competition.start_date}
            className="mt-1 block w-full bg-card border border-input rounded-lg shadow-sm py-2 px-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-foreground">
            Sluttdato
          </label>
          <input
            type="date"
            name="endDate"
            id="endDate"
            defaultValue={competition.end_date}
            className="mt-1 block w-full bg-card border border-input rounded-lg shadow-sm py-2 px-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent sm:text-sm"
          />
        </div>
      </div>

      <div className="flex justify-between pt-4 border-t border-border">
        <div>
          {!showDeleteConfirm ? (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="text-sm text-destructive hover:text-destructive/80"
            >
              Slett konkurranse
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-destructive">Er du sikker?</span>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={loading}
              >
                Ja, slett
              </Button>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3 py-1 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Avbryt
              </button>
            </div>
          )}
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="glow-primary"
        >
          {loading ? 'Lagrer...' : 'Lagre endringer'}
        </Button>
      </div>
    </form>
  )
}
