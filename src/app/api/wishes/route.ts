import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const invitation_id = searchParams.get('invitation_id')

    if (!invitation_id) {
      return NextResponse.json(
        { error: 'invitation_id wajib diisi' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { data: wishes, error } = await supabase
      .from('wishes')
      .select('*')
      .eq('invitation_id', invitation_id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Wishes fetch error:', error)
      return NextResponse.json(
        { error: 'Gagal memuat ucapan' },
        { status: 500 }
      )
    }

    return NextResponse.json({ wishes: wishes || [] })
  } catch (error) {
    console.error('Wishes GET API error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { invitation_id, guest_name, message } = body

    if (!invitation_id || !guest_name || !message) {
      return NextResponse.json(
        { error: 'invitation_id, guest_name, dan message wajib diisi' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { data: wish, error: wishError } = await supabase
      .from('wishes')
      .insert({
        invitation_id,
        guest_name,
        message,
      })
      .select()
      .single()

    if (wishError) {
      console.error('Wish insert error:', wishError)
      return NextResponse.json(
        { error: 'Gagal menyimpan ucapan' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, wish })
  } catch (error) {
    console.error('Wish POST API error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
