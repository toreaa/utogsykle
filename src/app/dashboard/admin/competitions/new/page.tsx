'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createCompetition } from '../actions'
import { createClient } from '@/lib/supabase/client'

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
          className="text-sm text-blue-600 hover:text-blue-500"
        >
          &larr; Tilbake til konkurranser
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">Opprett ny konkurranse</h1>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <form action={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Navn på konkurransen *
            </label>
            <input
              type="text"
              name="name"
              id="name"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Ukentlig steg-utfordring"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Beskrivelse
            </label>
            <textarea
              name="description"
              id="description"
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Beskriv konkurransens regler og mål..."
            />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Type
              </label>
              <select
                name="type"
                id="type"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="individual">Individuell</option>
                <option value="team">Lag</option>
                <option value="department">Avdeling</option>
              </select>
            </div>

            <div>
              <label htmlFor="activityTypeId" className="block text-sm font-medium text-gray-700">
                Aktivitetstype
              </label>
              <select
                name="activityTypeId"
                id="activityTypeId"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                Startdato *
              </label>
              <input
                type="date"
                name="startDate"
                id="startDate"
                required
                defaultValue={today}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                Sluttdato *
              </label>
              <input
                type="date"
                name="endDate"
                id="endDate"
                required
                defaultValue={defaultEndDate}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Link
              href="/dashboard/admin/competitions"
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Avbryt
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Oppretter...' : 'Opprett konkurranse'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
