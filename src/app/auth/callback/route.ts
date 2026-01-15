'use server'

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const invitationToken = requestUrl.searchParams.get('invitation')
  const next = requestUrl.searchParams.get('next') || '/dashboard'

  if (code) {
    const supabase = await createClient()

    // Exchange code for session
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // If there's an invitation token, mark it as accepted
      if (invitationToken) {
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
          // Get invitation details
          const { data: invitation } = await supabase
            .from('invitations')
            .select('*')
            .eq('token', invitationToken)
            .is('accepted_at', null)
            .single()

          if (invitation) {
            // Update user profile with company and role
            await supabase
              .from('profiles')
              .update({
                company_id: invitation.company_id,
                role: invitation.role,
              })
              .eq('id', user.id)

            // Mark invitation as accepted
            await supabase
              .from('invitations')
              .update({ accepted_at: new Date().toISOString() })
              .eq('id', invitation.id)
          }
        }
      }

      return NextResponse.redirect(new URL(next, requestUrl.origin))
    }
  }

  // Return to login with error
  return NextResponse.redirect(new URL('/login?error=auth_failed', requestUrl.origin))
}
