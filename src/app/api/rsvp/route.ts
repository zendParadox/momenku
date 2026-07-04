import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      invitation_id,
      guest_id,
      guest_name,
      attendance_status,
      guest_count,
      companion_names,
      wish_message,
    } = body

    if (!invitation_id || !guest_name || !attendance_status) {
      return NextResponse.json(
        { error: 'invitation_id, guest_name, dan attendance_status wajib diisi' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Get IP and user agent for analytics
    const ip_address = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const user_agent = request.headers.get('user-agent') || 'unknown'

    // Insert RSVP
    const { data: rsvp, error: rsvpError } = await supabase
      .from('rsvps')
      .insert({
        invitation_id,
        guest_id: guest_id || null,
        guest_name,
        attendance_status,
        guest_count: guest_count || 1,
        companion_names: companion_names || null,
        wish_message: wish_message || null,
        ip_address,
        user_agent,
      })
      .select()
      .single()

    if (rsvpError) {
      console.error('RSVP insert error:', rsvpError)
      return NextResponse.json(
        { error: 'Gagal menyimpan RSVP' },
        { status: 500 }
      )
    }

    // If guest_id is provided, update the guest's attendance status
    if (guest_id) {
      await supabase
        .from('guests')
        .update({ attendance_status })
        .eq('id', guest_id)
    }

    // Increment RSVP count on invitation
    const { data: currentInv } = await supabase
      .from('invitations')
      .select('rsvp_count')
      .eq('id', invitation_id)
      .single()

    if (currentInv) {
      await supabase
        .from('invitations')
        .update({ rsvp_count: (currentInv.rsvp_count || 0) + 1 })
        .eq('id', invitation_id)
    }

    return NextResponse.json({ success: true, rsvp })
  } catch (error) {
    console.error('RSVP API error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
