import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'

export default async function CompetitionsAdminPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  // Get user's company
  const { data: profile } = await supabase
    .from('profiles')
    .select('company_id')
    .eq('id', user!.id)
    .single()

  const companyId = profile?.company_id

  // Get all competitions
  const { data: competitions } = companyId ? await supabase
    .from('competitions')
    .select(`
      *,
      activity_types(name),
      competition_participants(count)
    `)
    .eq('company_id', companyId)
    .order('created_at', { ascending: false }) : { data: null }

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Konkurranser</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Opprett og administrer konkurranser for bedriften.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button asChild className="glow-primary">
            <Link href="/dashboard/admin/competitions/new">
              Opprett konkurranse
            </Link>
          </Button>
        </div>
      </div>

      {/* Competitions list */}
      <div className="bg-card shadow overflow-hidden sm:rounded-lg border border-border">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Konkurranse
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Deltakere
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Periode
              </th>
              <th className="relative px-6 py-3">
                <span className="sr-only">Handlinger</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {competitions && competitions.length > 0 ? (
              competitions.map((competition) => (
                <tr key={competition.id}>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-foreground">
                      {competition.name}
                    </div>
                    {competition.activity_types && (
                      <div className="text-sm text-muted-foreground">
                        {competition.activity_types.name}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {competition.type === 'individual' ? 'Individuell' :
                     competition.type === 'team' ? 'Lag' : 'Avdeling'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {(competition.competition_participants as unknown as { count: number }[])?.[0]?.count || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      competition.status === 'active'
                        ? 'bg-green-500/20 text-green-400'
                        : competition.status === 'completed'
                        ? 'bg-muted text-muted-foreground'
                        : competition.status === 'draft'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {competition.status === 'active' ? 'Aktiv' :
                       competition.status === 'completed' ? 'Fullført' :
                       competition.status === 'draft' ? 'Utkast' : 'Avlyst'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {new Date(competition.start_date).toLocaleDateString('nb-NO')} -{' '}
                    {new Date(competition.end_date).toLocaleDateString('nb-NO')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/dashboard/admin/competitions/${competition.id}`}
                      className="text-primary hover:text-primary/80"
                    >
                      Rediger
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                  Ingen konkurranser opprettet ennå.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
