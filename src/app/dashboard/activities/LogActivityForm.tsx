'use client'

import { useState, useRef } from 'react'
import { logActivity } from './actions'
import { Database } from '@/lib/supabase/database.types'

type ActivityType = Database['public']['Tables']['activity_types']['Row']

interface Props {
  activityTypes: ActivityType[]
}

const unitLabels: Record<string, string> = {
  steps: 'steg',
  km: 'kilometer',
  minutes: 'minutter',
  sessions: 'økter',
}

export default function LogActivityForm({ activityTypes }: Props) {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedType, setSelectedType] = useState<ActivityType | null>(
    activityTypes[0] || null
  )
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    setSuccess(false)

    const result = await logActivity(formData)

    if (result?.error) {
      setError(result.error)
    } else {
      setSuccess(true)
      formRef.current?.reset()
      // Reset to first activity type
      setSelectedType(activityTypes[0] || null)
    }

    setLoading(false)
  }

  function handleTypeChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const type = activityTypes.find(t => t.id === e.target.value)
    setSelectedType(type || null)
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          Aktivitet registrert!
          {selectedType && ` +${Math.round((selectedType.points_per_unit || 1) * parseFloat((document.getElementById('value') as HTMLInputElement)?.value || '0'))} poeng`}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div>
          <label htmlFor="activityTypeId" className="block text-sm font-medium text-gray-700">
            Aktivitetstype
          </label>
          <select
            name="activityTypeId"
            id="activityTypeId"
            required
            onChange={handleTypeChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            {activityTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="value" className="block text-sm font-medium text-gray-700">
            Mengde ({selectedType ? unitLabels[selectedType.unit || 'minutes'] : ''})
          </label>
          <input
            type="number"
            name="value"
            id="value"
            required
            min="0"
            step="0.1"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder={selectedType?.unit === 'steps' ? '5000' : selectedType?.unit === 'km' ? '5' : '30'}
          />
          {selectedType && (
            <p className="mt-1 text-xs text-gray-500">
              {selectedType.points_per_unit} poeng per {unitLabels[selectedType.unit || 'minutes'].slice(0, -1) || 'enhet'}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="activityDate" className="block text-sm font-medium text-gray-700">
            Dato
          </label>
          <input
            type="date"
            name="activityDate"
            id="activityDate"
            required
            defaultValue={today}
            max={today}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Registrerer...' : 'Registrer'}
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          Notater (valgfritt)
        </label>
        <input
          type="text"
          name="notes"
          id="notes"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="F.eks. Morgentur rundt vannet"
        />
      </div>
    </form>
  )
}
