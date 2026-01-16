'use client'

import { useState, useRef } from 'react'
import { inviteUser } from './actions'
import { Button } from '@/components/ui/button'

export default function InviteUserForm() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    setSuccess(false)

    const result = await inviteUser(formData)

    if (result?.error) {
      setError(result.error)
    } else {
      setSuccess(true)
      formRef.current?.reset()
    }

    setLoading(false)
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-lg">
          Invitasjon sendt!
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label htmlFor="email" className="block text-sm font-medium text-foreground">
            E-postadresse
          </label>
          <input
            type="email"
            name="email"
            id="email"
            required
            className="mt-1 block w-full bg-card border border-input rounded-lg shadow-sm py-2 px-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent sm:text-sm"
            placeholder="kollega@bedrift.no"
          />
        </div>

        <div className="sm:w-48">
          <label htmlFor="role" className="block text-sm font-medium text-foreground">
            Rolle
          </label>
          <select
            name="role"
            id="role"
            className="mt-1 block w-full bg-card border border-input rounded-lg shadow-sm py-2 px-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent sm:text-sm"
          >
            <option value="user">Bruker</option>
            <option value="company_admin">Administrator</option>
          </select>
        </div>

        <div className="flex items-end">
          <Button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto glow-primary"
          >
            {loading ? 'Sender...' : 'Send invitasjon'}
          </Button>
        </div>
      </div>
    </form>
  )
}
