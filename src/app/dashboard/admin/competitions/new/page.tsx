'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createCompetition } from '../actions'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

export default function NewCompetitionPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [activityTypes, setActivityTypes] = useState<Array<{ id: string; name: string }>>([])

  useEffect(() => {
    async function loadActivityTypes() {
      const supabase = createClient()
      const { data } = await supabase
        .from('activity_types')
        .select('id, name')
        .eq('is_default', true)

      if (data) {
        setActivityTypes(data)
      }
    }

    loadActivityTypes()
  }, [])

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)

    const result = await createCompetition(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  // Default dates
  const today = new Date().toISOString().split('T')[0]
  const nextMonth = new Date()
  nextMonth.setMonth(nextMonth.getMonth() + 1)
  const defaultEndDate = nextMonth.toISOString().split('T')[0]

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/dashboard/admin/competitions"
          className="text-sm text-primary hover:text-primary/80"
        >
          &larr; Tilbake til konkurranser
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-foreground">Opprett ny konkurranse</h1>
      </div>

      <div className="bg-card shadow sm:rounded-lg border border-border">
        <form action={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-foreground">
              Navn på konkurransen *
            </label>
            <input
              type="text"
              name="name"
              id="name"
              required
              className="mt-1 block w-full bg-card border border-input rounded-lg shadow-sm py-2 px-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent sm:text-sm"
              placeholder="Ukentlig steg-utfordring"
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
              className="mt-1 block w-full bg-card border border-input rounded-lg shadow-sm py-2 px-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent sm:text-sm"
              placeholder="Beskriv konkurransens regler og mål..."
            />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-foreground">
                Type
              </label>
              <select
                name="type"
                id="type"
                className="mt-1 block w-full bg-card border border-input rounded-lg shadow-sm py-2 px-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent sm:text-sm"
              >
                <option value="individual">Individuell</option>
                <option value="team">Lag</option>
                <option value="department">Avdeling</option>
              </select>
            </div>

            <div>
              <label htmlFor="activityTypeId" className="block text-sm font-medium text-foreground">
                Aktivitetstype
              </label>
              <select
                name="activityTypeId"
                id="activityTypeId"
                className="mt-1 block w-full bg-card border border-input rounded-lg shadow-sm py-2 px-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent sm:text-sm"
              >
                <option value="">Alle aktiviteter</option>
                {activityTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-foreground">
                Startdato *
              </label>
              <input
                type="date"
                name="startDate"
                id="startDate"
                required
                defaultValue={today}
                className="mt-1 block w-full bg-card border border-input rounded-lg shadow-sm py-2 px-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-foreground">
                Sluttdato *
              </label>
              <input
                type="date"
                name="endDate"
                id="endDate"
                required
                defaultValue={defaultEndDate}
                className="mt-1 block w-full bg-card border border-input rounded-lg shadow-sm py-2 px-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent sm:text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-border">
            <Button variant="outline" asChild>
              <Link href="/dashboard/admin/competitions">
                Avbryt
              </Link>
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="glow-primary"
            >
              {loading ? 'Oppretter...' : 'Opprett konkurranse'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
