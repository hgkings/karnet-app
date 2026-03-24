import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server-client'
import * as analysesDal from '@/dal/analyses'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })

    const count = await analysesDal.getAnalysisCount(user.id)
    return NextResponse.json({ count })
  } catch (error) {
    console.error('GET /api/analyses/count error:', error)
    return NextResponse.json({ error: 'Bir hata oluştu' }, { status: 500 })
  }
}
