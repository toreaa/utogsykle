'use client'

import { useState } from 'react'
import { updateUserRole } from './actions'
import { Database } from '@/lib/supabase/database.types'

type Profile = Database['public']['Tables']['profiles']['Row']

interface Props {
  users: Profile[]
  currentUserId: string
}

export default function UsersList({ users, currentUserId }: Props) {
  const [updating, setUpdating] = useState<string | null>(null)

  async function handleRoleChange(userId: string, newRole: 'user' | 'company_admin') {
    setUpdating(userId)
    await updateUserRole(userId, newRole)
    setUpdating(null)
  }

  if (users.length === 0) {
    return (
      <div className="px-6 py-8 text-center text-muted-foreground">
        Ingen brukere registrert ennå.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-border">
        <thead className="bg-muted">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Bruker
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Rolle
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Registrert
            </th>
          </tr>
        </thead>
        <tbody className="bg-card divide-y divide-border">
          {users.map((user) => (
            <tr key={user.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 bg-muted rounded-full flex items-center justify-center">
                    <span className="text-muted-foreground font-medium">
                      {user.full_name?.charAt(0)?.toUpperCase() || '?'}
                    </span>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-foreground">
                      {user.full_name || 'Uten navn'}
                      {user.id === currentUserId && (
                        <span className="ml-2 text-xs text-muted-foreground">(deg)</span>
                      )}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {user.id === currentUserId ? (
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-500/20 text-purple-400">
                    Administrator
                  </span>
                ) : (
                  <select
                    value={user.role || 'user'}
                    onChange={(e) => handleRoleChange(user.id, e.target.value as 'user' | 'company_admin')}
                    disabled={updating === user.id}
                    className="text-sm bg-card border border-input rounded-lg px-2 py-1 text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  >
                    <option value="user">Bruker</option>
                    <option value="company_admin">Administrator</option>
                  </select>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                {user.created_at ? new Date(user.created_at).toLocaleDateString('nb-NO') : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
