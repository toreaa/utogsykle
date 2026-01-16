'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signIn } from '../actions/auth'
import { Activity } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)

    const result = await signIn(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary glow-primary">
              <Activity className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <h1 className="mt-4 text-center text-3xl font-bold text-foreground">
            utogsykle
          </h1>
          <h2 className="mt-6 text-center text-2xl font-semibold text-foreground">
            Logg inn på kontoen din
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Eller{' '}
            <Link href="/register" className="font-medium text-primary hover:text-primary/80">
              registrer deg her
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" action={handleSubmit}>
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground">
                E-post
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 block w-full px-3 py-2 bg-card border border-input rounded-lg shadow-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                placeholder="din@epost.no"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground">
                Passord
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="mt-1 block w-full px-3 py-2 bg-card border border-input rounded-lg shadow-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                placeholder="••••••••"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full glow-primary"
            size="lg"
          >
            {loading ? 'Logger inn...' : 'Logg inn'}
          </Button>
        </form>
      </div>
    </div>
  )
}
