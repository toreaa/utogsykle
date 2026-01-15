'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

export async function inviteUser(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  // Get user's company
  const { data: profile } = await supabase
    .from('profiles')
    .select('company_id, companies(name)')
    .eq('id', user!.id)
    .single()

  const email = formData.get('email') as string
  const role = formData.get('role') as 'user' | 'company_admin'

  // Create invitation record first
  const { data: invitation, error: inviteError } = await supabase
    .from('invitations')
    .insert({
      company_id: profile!.company_id!,
      email,
      role,
      invited_by: user!.id,
    })
    .select()
    .single()

  if (inviteError) {
    if (inviteError.code === '23505') {
      return { error: 'Denne e-postadressen er allerede invitert.' }
    }
    return { error: inviteError.message }
  }

  // Get the site URL from headers
  const headersList = await headers()
  const host = headersList.get('host') || 'localhost:3000'
  const protocol = host.includes('localhost') ? 'http' : 'https'
  const siteUrl = `${protocol}://${host}`

  // Send magic link invitation via Supabase Auth
  const { error: authError } = await supabase.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${siteUrl}/auth/callback?invitation=${invitation.token}`,
    data: {
      invitation_token: invitation.token,
      company_id: profile!.company_id,
      role: role,
    }
  })

  if (authError) {
    // If email sending fails, delete the invitation
    await supabase.from('invitations').delete().eq('id', invitation.id)
    return { error: `Kunne ikke sende invitasjon: ${authError.message}` }
  }

  revalidatePath('/dashboard/admin/users')
  return { success: true, message: `Invitasjon sendt til ${email}` }
}

export async function deleteInvitation(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('invitations')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/admin/users')
  return { success: true }
}

export async function updateUserRole(userId: string, role: 'user' | 'company_admin') {
  const supabase = await createClient()

  const { error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', userId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/admin/users')
  return { success: true }
}
