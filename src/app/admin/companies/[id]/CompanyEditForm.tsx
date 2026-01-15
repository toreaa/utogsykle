'use client'

import { useState } from 'react'
import { updateCompany, deleteCompany } from '../actions'
import { Database } from '@/lib/supabase/database.types'

type Company = Database['public']['Tables']['companies']['Row']

interface Props {
  company: Company
}

export default function CompanyEditForm({ company }: Props) {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    setSuccess(false)

    const result = await updateCompany(company.id, formData)
    if (result?.error) {
      setError(result.error)
    } else {
      setSuccess(true)
    }
    setLoading(false)
  }

  async function handleDelete() {
    setLoading(true)
    const result = await deleteCompany(company.id)
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
          Bedriftsnavn *
        </label>
        <input
          type="text"
          name="name"
          id="name"
          required
          defaultValue={company.name}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="domain" className="block text-sm font-medium text-gray-700">
          E-postdomene
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
            @
          </span>
          <input
            type="text"
            name="domain"
            id="domain"
            defaultValue={company.domain || ''}
            className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          name="isActive"
          id="isActive"
          value="true"
          defaultChecked={company.is_active ?? true}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
          Bedriften er aktiv
        </label>
      </div>

      <div className="flex justify-between pt-4 border-t border-gray-200">
        <div>
          {!showDeleteConfirm ? (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-500"
            >
              Slett bedrift
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
