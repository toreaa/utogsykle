'use client'

import { useState } from 'react'
import { updateCompany, deleteCompany } from '../actions'
import { Database } from '@/lib/supabase/database.types'
import { Button } from '@/components/ui/button'

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
          Bedriftsnavn *
        </label>
        <input
          type="text"
          name="name"
          id="name"
          required
          defaultValue={company.name}
          className="mt-1 block w-full bg-card border border-input rounded-lg shadow-sm py-2 px-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="domain" className="block text-sm font-medium text-foreground">
          E-postdomene
        </label>
        <div className="mt-1 flex rounded-lg shadow-sm">
          <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-input bg-muted text-muted-foreground sm:text-sm">
            @
          </span>
          <input
            type="text"
            name="domain"
            id="domain"
            defaultValue={company.domain || ''}
            className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-lg bg-card border border-input text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-ring focus:border-transparent sm:text-sm"
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
          className="h-4 w-4 text-primary focus:ring-ring border-input rounded bg-card"
        />
        <label htmlFor="isActive" className="ml-2 block text-sm text-foreground">
          Bedriften er aktiv
        </label>
      </div>

      <div className="flex justify-between pt-4 border-t border-border">
        <div>
          {!showDeleteConfirm ? (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 text-sm font-medium text-destructive hover:text-destructive/80"
            >
              Slett bedrift
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
