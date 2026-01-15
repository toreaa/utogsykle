'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function createCompetition(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  // Get user's company
  const { data: profile } = await supabase
    .from('profiles')
    .select('company_id')
    .eq('id', user!.id)
    .single()

  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const type = formData.get('type') as 'individual' | 'team' | 'department'
  const startDate = formData.get('startDate') as string
  const endDate = formData.get('endDate') as string
  const activityTypeId = formData.get('activityTypeId') as string

  const { data, error } = await supabase
    .from('competitions')
    .insert({
      company_id: profile!.company_id!,
      name,
      description: description || null,
      type,
      start_date: startDate,
      end_date: endDate,
      activity_type_id: activityTypeId || null,
      status: 'active',
      created_by: user!.id,
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/admin/competitions')
  redirect(`/dashboard/admin/competitions/${data.id}`)
}

export async function updateCompetition(id: string, formData: FormData) {
  const supabase = await createClient()

  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const status = formData.get('status') as 'draft' | 'active' | 'completed' | 'cancelled'
  const startDate = formData.get('startDate') as string
  const endDate = formData.get('endDate') as string

  const { error } = await supabase
    .from('competitions')
    .update({
      name,
      description: description || null,
      status,
      start_date: startDate,
      end_date: endDate,
    })
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/admin/competitions')
  revalidatePath(`/dashboard/admin/competitions/${id}`)
  return { success: true }
}

export async function deleteCompetition(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('competitions')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/admin/competitions')
  redirect('/dashboard/admin/competitions')
}
