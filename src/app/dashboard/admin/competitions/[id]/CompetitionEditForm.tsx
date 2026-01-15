'use client'

import { useState } from 'react'
import { updateCompetition, deleteCompetition } from '../actions'
import { Database } from '@/lib/supabase/database.types'

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
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          Endringene er lagret!
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Navn *
        </label>
        <input
          type="text"
          name="name"
          id="name"
          required
          defaultValue={competition.name}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
          defaultValue={competition.description || ''}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
          Status
        </label>
        <select
          name="status"
          id="status"
          defaultValue={competition.status || 'active'}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          <option value="draft">Utkast</option>
          <option value="active">Aktiv</option>
          <option value="completed">Fullført</option>
          <option value="cancelled">Avlyst</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
            Startdato
          </label>
          <input
            type="date"
            name="startDate"
            id="startDate"
            defaultValue={competition.start_date}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
            Sluttdato
          </label>
          <input
            type="date"
            name="endDate"
            id="endDate"
            defaultValue={competition.end_date}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="flex justify-between pt-4 border-t border-gray-200">
        <div>
          {!showDeleteConfirm ? (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="text-sm text-red-600 hover:text-red-500"
            >
              Slett konkurranse
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-red-600">Er du sikker?</span>
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="px-3 py-1 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded"
              >
                Ja, slett
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3 py-1 text-sm font-medium text-gray-600 hover:text-gray-500"
              >
                Avbryt
              </button>
            </div>
          )}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Lagrer...' : 'Lagre endringer'}
        </button>
      </div>
    </form>
  )
}
