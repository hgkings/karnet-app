import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server-client'
import * as analysisService from '@/services/analysis.service'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })

    const analyses = await analysisService.getUserAnalyses(user.id)
    return NextResponse.json(analyses)
  } catch (error) {
    console.error('GET /api/analyses error:', error)
    return NextResponse.json({ error: 'Bir hata oluştu' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })

    const body = await request.json()
    const analysis = { ...body, userId: user.id }
    const result = await analysisService.createAnalysis(user.id, analysis)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('POST /api/analyses error:', error)
    return NextResponse.json({ error: 'Bir hata oluştu' }, { status: 500 })
  }
}
