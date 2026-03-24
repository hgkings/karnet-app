import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server-client'
import * as notificationsDal from '@/dal/notifications'

export const dynamic = 'force-dynamic'

export async function PATCH() {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })

    await notificationsDal.markAllNotificationsAsRead(user.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('PATCH /api/notifications/read-all error:', error)
    return NextResponse.json({ error: 'Bir hata oluştu' }, { status: 500 })
  }
}
