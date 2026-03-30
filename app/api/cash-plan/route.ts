import { NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAuth, errorResponse } from '@/lib/api/helpers'
import { createAdminClient } from '@/lib/supabase/admin'

const CashPlanRowSchema = z.object({
  month: z.string().min(1, 'Ay bilgisi zorunludur'),
  opening_cash: z.number({ required_error: 'Açılış nakdi zorunludur' }),
  cash_in: z.number({ required_error: 'Nakit giriş zorunludur' }),
  cash_out: z.number({ required_error: 'Nakit çıkış zorunludur' }),
  closing_cash: z.number({ required_error: 'Kapanış nakdi zorunludur' }),
})

const CashPlanSchema = z.array(CashPlanRowSchema).min(1, 'En az bir satır gerekli')

export async function GET() {
  try {
    const user = await requireAuth()
    if (user instanceof Response) return user

    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('cash_plan')
      .select('*')
      .eq('user_id', user.id)

    if (error) {
      return NextResponse.json({ error: 'Nakit planı yüklenemedi' }, { status: 500 })
    }

    return NextResponse.json(data ?? [])
  } catch (error) {
    return errorResponse(error)
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth()
    if (user instanceof Response) return user

    const body = await request.json()

    const parsed = CashPlanSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Doğrulama hatası', details: parsed.error.errors },
        { status: 422 }
      )
    }

    const rows = parsed.data
    const supabase = createAdminClient()
    const { error } = await supabase.from('cash_plan').upsert(
      rows.map((r) => ({
        user_id: user.id,
        month: r.month,
        opening_cash: r.opening_cash,
        cash_in: r.cash_in,
        cash_out: r.cash_out,
        closing_cash: r.closing_cash,
      })),
      { onConflict: 'user_id, month' }
    )

    if (error) {
      return NextResponse.json({ error: 'Nakit planı kaydedilemedi' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return errorResponse(error)
  }
}
