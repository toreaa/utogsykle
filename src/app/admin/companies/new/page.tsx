'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createCompany } from '../actions'
import { Button } from '@/components/ui/button'

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
          className="text-sm text-primary hover:text-primary/80"
        >
          &larr; Tilbake til bedrifter
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-foreground">Opprett ny bedrift</h1>
      </div>

      <div className="bg-card shadow sm:rounded-lg border border-border">
        <form action={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Company info */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-foreground">Bedriftsinformasjon</h2>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground">
                Bedriftsnavn *
              </label>
              <input
                type="text"
                name="name"
                id="name"
                required
                className="mt-1 block w-full bg-card border border-input rounded-lg shadow-sm py-2 px-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent sm:text-sm"
                placeholder="Acme AS"
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
                  className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-lg bg-card border border-input text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-ring focus:border-transparent sm:text-sm"
                  placeholder="acme.no"
                />
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Brukere med dette e-postdomenet kan registrere seg automatisk.
              </p>
            </div>
          </div>

          {/* Admin user */}
          <div className="space-y-4 pt-6 border-t border-border">
            <h2 className="text-lg font-medium text-foreground">Bedriftsadministrator</h2>
            <p className="text-sm text-muted-foreground">
              Opprett en administrator som kan logge inn og invitere ansatte.
            </p>

            <div>
              <label htmlFor="adminName" className="block text-sm font-medium text-foreground">
                Fullt navn *
              </label>
              <input
                type="text"
                name="adminName"
                id="adminName"
                required
                className="mt-1 block w-full bg-card border border-input rounded-lg shadow-sm py-2 px-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent sm:text-sm"
                placeholder="Ola Nordmann"
              />
            </div>

            <div>
              <label htmlFor="adminEmail" className="block text-sm font-medium text-foreground">
                E-postadresse *
              </label>
              <input
                type="email"
                name="adminEmail"
                id="adminEmail"
                required
                className="mt-1 block w-full bg-card border border-input rounded-lg shadow-sm py-2 px-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent sm:text-sm"
                placeholder="admin@acme.no"
              />
            </div>

            <div>
              <label htmlFor="adminPassword" className="block text-sm font-medium text-foreground">
                Midlertidig passord *
              </label>
              <input
                type="text"
                name="adminPassword"
                id="adminPassword"
                required
                minLength={8}
                className="mt-1 block w-full bg-card border border-input rounded-lg shadow-sm py-2 px-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent sm:text-sm"
                placeholder="Minimum 8 tegn"
              />
              <p className="mt-1 text-sm text-muted-foreground">
                Brukeren bør endre passordet ved første innlogging.
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-border">
            <Button variant="outline" asChild>
              <Link href="/admin/companies">
                Avbryt
              </Link>
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="glow-primary"
            >
              {loading ? 'Oppretter...' : 'Opprett bedrift og administrator'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
