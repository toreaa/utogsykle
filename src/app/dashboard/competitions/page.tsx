import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import JoinLeaveButton from './JoinLeaveButton'
import { Button } from '@/components/ui/button'

export default async function CompetitionsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  // Get user's company
  const { data: profile } = await supabase
    .from('profiles')
    .select('company_id')
    .eq('id', user!.id)
    .single()

  const companyId = profile?.company_id

  // Get all active competitions
  const { data: competitions } = companyId ? await supabase
    .from('competitions')
    .select(`
      *,
      activity_types(name),
      competition_participants(user_id)
    `)
    .eq('company_id', companyId)
    .in('status', ['active', 'draft'])
    .order('start_date', { ascending: true }) : { data: null }

  // Get user's participations
  const { data: myParticipations } = await supabase
    .from('competition_participants')
    .select('competition_id')
    .eq('user_id', user!.id)

  const myCompetitionIds = new Set(myParticipations?.map(p => p.competition_id) || [])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Konkurranser</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Finn og bli med i konkurranser i din bedrift.
        </p>
      </div>

      {/* Competition cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {competitions && competitions.length > 0 ? (
          competitions.map((competition) => {
            const isParticipating = myCompetitionIds.has(competition.id)
            const participantCount = (competition.competition_participants as unknown as { user_id: string }[])?.length || 0
            const daysLeft = Math.ceil((new Date(competition.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))

            return (
              <div key={competition.id} className="bg-card shadow rounded-lg overflow-hidden border border-border">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-foreground">
                        {competition.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {competition.type === 'individual' ? 'Individuell' :
                         competition.type === 'team' ? 'Lag' : 'Avdeling'}
                        {competition.activity_types && ` • ${competition.activity_types.name}`}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      competition.status === 'active'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {competition.status === 'active' ? 'Aktiv' : 'Kommer'}
                    </span>
                  </div>

                  {competition.description && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {competition.description}
                    </p>
                  )}

                  <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
                    <span>{participantCount} deltakere</span>
                    <span>
                      {daysLeft > 0 ? `${daysLeft} dager igjen` : 'Avsluttet'}
                    </span>
                  </div>

                  <div className="flex space-x-3">
                    <Button variant="outline" asChild className="flex-1">
                      <Link href={`/dashboard/competitions/${competition.id}`}>
                        Se detaljer
                      </Link>
                    </Button>
                    <JoinLeaveButton
                      competitionId={competition.id}
                      isParticipating={isParticipating}
                      isActive={competition.status === 'active'}
                    />
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div className="col-span-full bg-card shadow rounded-lg p-8 text-center text-muted-foreground border border-border">
            <p>Ingen aktive konkurranser for øyeblikket.</p>
            <p className="text-sm mt-2">Be din administrator om å opprette en konkurranse.</p>
          </div>
        )}
      </div>
    </div>
  )
}
