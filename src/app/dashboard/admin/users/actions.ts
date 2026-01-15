'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function inviteUser(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  // Get user's company
  const { data: profile } = await supabase
    .from('profiles')
    .select('company_id')
    .eq('id', user!.id)
    .single()

  const email = formData.get('email') as string
  const role = formData.get('role') as 'user' | 'company_admin'

  const { error } = await supabase
    .from('invitations')
    .insert({
      company_id: profile!.company_id!,
      email,
      role,
      invited_by: user!.id,
    })

  if (error) {
    if (error.code === '23505') {
      return { error: 'Denne e-postadressen er allerede invitert.' }
    }
    return { error: error.message }
  }

  revalidatePath('/dashboard/admin/users')
  return { success: true }
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
