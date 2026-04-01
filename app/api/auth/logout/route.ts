import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { revokeAllUserTokens } from '@/lib/security/token-denylist'
import { auditLog } from '@/lib/security/audit'
import { getIp } from '@/lib/api/helpers'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      // Token'lari iptal et
      await revokeAllUserTokens(user.id, 3600)

      // Audit log
      await auditLog({
        action: 'auth.logout',
        userId: user.id,
        traceId: `logout_${Date.now()}`,
        ip: getIp(request),
      })
    }

    // Supabase session'i sonlandir
    await supabase.auth.signOut()

    // Cache-Control: no-store — tarayici onbelleklemez
    const response = NextResponse.json(
      { success: true },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Pragma': 'no-cache',
        },
      }
    )

    return response
  } catch {
    return NextResponse.json({ error: 'Cikis yapilamadi.' }, { status: 500 })
  }
}
