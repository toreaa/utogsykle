import { createClient } from '@/lib/supabase/server'
import InviteUserForm from './InviteUserForm'
import UsersList from './UsersList'

export default async function UsersPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  // Get user's company
  const { data: profile } = await supabase
    .from('profiles')
    .select('company_id')
    .eq('id', user!.id)
    .single()

  const companyId = profile?.company_id

  // Get all users in company (only if companyId exists)
  const { data: users } = companyId ? await supabase
    .from('profiles')
    .select('*')
    .eq('company_id', companyId)
    .order('created_at', { ascending: false }) : { data: null }

  // Get pending invitations
  const { data: invitations } = companyId ? await supabase
    .from('invitations')
    .select('*')
    .eq('company_id', companyId)
    .is('accepted_at', null)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false }) : { data: null }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Brukere</h1>
        <p className="mt-1 text-sm text-gray-500">
          Administrer brukere og invitasjoner for bedriften.
        </p>
      </div>

      {/* Invite form */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Inviter ny bruker</h2>
        <InviteUserForm />
      </div>

      {/* Pending invitations */}
      {invitations && invitations.length > 0 && (
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Ventende invitasjoner ({invitations.length})
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {invitations.map((invitation) => (
              <div key={invitation.id} className="px-6 py-4 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-900">{invitation.email}</p>
                  <p className="text-sm text-gray-500">
                    {invitation.role === 'company_admin' ? 'Administrator' : 'Bruker'}
                    {' • '}
                    Utløper {new Date(invitation.expires_at!).toLocaleDateString('nb-NO')}
                  </p>
                </div>
                <form action={async () => {
                  'use server'
                  const { deleteInvitation } = await import('./actions')
                  await deleteInvitation(invitation.id)
                }}>
                  <button
                    type="submit"
                    className="text-sm text-red-600 hover:text-red-500"
                  >
                    Slett
                  </button>
                </form>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Users list */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Brukere ({users?.length || 0})
          </h2>
        </div>
        <UsersList users={users || []} currentUserId={user!.id} />
      </div>
    </div>
  )
}
