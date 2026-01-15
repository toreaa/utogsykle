'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createCompany } from '../actions'

export default function NewCompanyPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)

    const result = await createCompany(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/companies"
          className="text-sm text-blue-600 hover:text-blue-500"
        >
          &larr; Tilbake til bedrifter
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">Opprett ny bedrift</h1>
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
              Bedriftsnavn *
            </label>
            <input
              type="text"
              name="name"
              id="name"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Acme AS"
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
                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="acme.no"
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Brukere med dette e-postdomenet kan registrere seg automatisk.
            </p>
          </div>

          <div className="flex justify-end space-x-3">
            <Link
              href="/admin/companies"
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Avbryt
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Oppretter...' : 'Opprett bedrift'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
