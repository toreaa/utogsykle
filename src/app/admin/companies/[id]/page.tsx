import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import CompanyEditForm from './CompanyEditForm'

interface Props {
  params: Promise<{ id: string }>
}

export default async function CompanyDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: company } = await supabase
    .from('companies')
    .select('*')
    .eq('id', id)
    .single()

  if (!company) {
    notFound()
  }

  // Get users in this company
  const { data: users } = await supabase
    .from('profiles')
    .select('*')
    .eq('company_id', id)
    .order('created_at', { ascending: false })

  // Get competitions
  const { data: competitions } = await supabase
    .from('competitions')
    .select('*')
    .eq('company_id', id)
    .order('created_at', { ascending: false })

  // Get activities count
  const { count: activitiesCount } = await supabase
    .from('activities')
    .select('*', { count: 'exact', head: true })
    .eq('company_id', id)

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/companies"
          className="text-sm text-primary hover:text-primary/80"
        >
          &larr; Tilbake til bedrifter
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-foreground">{company.name}</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-4 mb-8">
        <div className="bg-card overflow-hidden shadow rounded-lg p-5 border border-border">
          <dt className="text-sm font-medium text-muted-foreground truncate">Brukere</dt>
          <dd className="mt-1 text-2xl font-semibold text-foreground">{users?.length || 0}</dd>
        </div>
        <div className="bg-card overflow-hidden shadow rounded-lg p-5 border border-border">
          <dt className="text-sm font-medium text-muted-foreground truncate">Konkurranser</dt>
          <dd className="mt-1 text-2xl font-semibold text-foreground">{competitions?.length || 0}</dd>
        </div>
        <div className="bg-card overflow-hidden shadow rounded-lg p-5 border border-border">
          <dt className="text-sm font-medium text-muted-foreground truncate">Aktiviteter</dt>
          <dd className="mt-1 text-2xl font-semibold text-foreground">{activitiesCount || 0}</dd>
        </div>
        <div className="bg-card overflow-hidden shadow rounded-lg p-5 border border-border">
          <dt className="text-sm font-medium text-muted-foreground truncate">Status</dt>
          <dd className="mt-1">
            <span className={`px-2 py-1 text-sm font-semibold rounded-full ${
              company.is_active
                ? 'bg-green-500/20 text-green-400'
                : 'bg-red-500/20 text-red-400'
            }`}>
              {company.is_active ? 'Aktiv' : 'Inaktiv'}
            </span>
          </dd>
        </div>
      </div>

      {/* Edit form */}
      <div className="bg-card shadow sm:rounded-lg mb-8 border border-border">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-lg font-medium text-foreground">Bedriftsinnstillinger</h2>
        </div>
        <CompanyEditForm company={company} />
      </div>

      {/* Users list */}
      <div className="bg-card shadow sm:rounded-lg mb-8 border border-border">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-lg font-medium text-foreground">Brukere ({users?.length || 0})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Navn</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Rolle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Registrert</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users && users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                      {user.full_name || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        user.role === 'company_admin'
                          ? 'bg-purple-500/20 text-purple-400'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {user.role === 'company_admin' ? 'Admin' : 'Bruker'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString('nb-NO') : '-'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-sm text-muted-foreground">
                    Ingen brukere registrert ennå.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Competitions list */}
      <div className="bg-card shadow sm:rounded-lg border border-border">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-lg font-medium text-foreground">Konkurranser ({competitions?.length || 0})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Navn</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Periode</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {competitions && competitions.length > 0 ? (
                competitions.map((competition) => (
                  <tr key={competition.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                      {competition.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {competition.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        competition.status === 'active'
                          ? 'bg-green-500/20 text-green-400'
                          : competition.status === 'completed'
                          ? 'bg-muted text-muted-foreground'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {competition.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {new Date(competition.start_date).toLocaleDateString('nb-NO')} - {new Date(competition.end_date).toLocaleDateString('nb-NO')}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-muted-foreground">
                    Ingen konkurranser opprettet ennå.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
