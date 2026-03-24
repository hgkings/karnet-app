import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin } from '@/lib/admin-auth'
import * as paymentsDal from '@/dal/payments'
import * as profilesDal from '@/dal/profiles'

export async function GET(req: NextRequest) {
  const auth = await verifyAdmin()
  if (!auth.authorized) return auth.response

  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status') ?? ''
  const page = parseInt(searchParams.get('page') ?? '1')
  const limit = 20
  const offset = (page - 1) * limit

  try {
    const { data: payments, count } = await paymentsDal.getPayments({
      status: status || undefined,
      limit,
      offset,
    })

    // Email'leri ayrı sorguda çek
    const userIds = Array.from(new Set(payments.map((p: Record<string, unknown>) => p.user_id as string)))
    const profiles = await profilesDal.getProfilesByIds(userIds)
    const emailMap: Record<string, string> = Object.fromEntries(
      profiles.map((p: Record<string, unknown>) => [p.id as string, p.email as string])
    )

    const result = payments.map((p: Record<string, unknown>) => ({
      ...p,
      profiles: { email: emailMap[p.user_id as string] ?? null },
    }))

    return NextResponse.json({ payments: result, total: count, page, limit })
  } catch (error) {
    console.error('Admin payments error:', error)
    return NextResponse.json({ success: false, error: 'Bir hata oluştu' }, { status: 500 })
  }
}
