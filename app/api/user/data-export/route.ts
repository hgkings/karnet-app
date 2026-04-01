import { NextResponse } from 'next/server'
import { requireAuth, getIp, callGateway } from '@/lib/api/helpers'
import { checkRateLimit, rateLimitHeaders } from '@/lib/security/rate-limit'
import { auditLog, generateTraceId } from '@/lib/security/audit'

/**
 * GDPR Madde 20: Veri tasinabilirligi
 * Kullanicinin tum verilerini JSON olarak export eder.
 * Rate limit: gunde 3 kez.
 */
export async function GET(request: Request) {
  const auth = await requireAuth()
  if (auth instanceof Response) return auth

  const ip = getIp(request)
  const traceId = generateTraceId()

  // Rate limit — gunde 3 kez
  const rl = await checkRateLimit('api', `data-export:${auth.id}`)
  if (!rl.success) {
    return NextResponse.json(
      { error: 'Cok fazla export istegi. Lutfen yarin tekrar deneyin.' },
      { status: 429, headers: rateLimitHeaders(rl) }
    )
  }

  try {
    // Gateway uzerinden kullanici verilerini topla
    const [analyses, tickets, notifications, profile, marketplaceConnections, products] = await Promise.all([
      callGateway('analysis', 'list', {}, auth.id).then(r => r ?? []).catch(() => []),
      callGateway('support', 'listTickets', {}, auth.id).then(r => r ?? []).catch(() => []),
      callGateway('notification', 'list', {}, auth.id).then(r => r ?? []).catch(() => []),
      callGateway('user', 'getProfile', {}, auth.id).catch(() => null),
      callGateway('marketplace', 'getStatus', {}, auth.id).then(r => r ?? []).catch(() => []),
      callGateway('product', 'list', {}, auth.id).then(r => r ?? []).catch(() => []),
    ])

    const exportData = {
      exported_at: new Date().toISOString(),
      user: {
        id: auth.id,
        email: auth.email,
        profile: profile ?? null,
      },
      analyses,
      products,
      marketplace_connections: marketplaceConnections,
      support_tickets: tickets,
      notifications,
    }

    // Audit log
    await auditLog({
      action: 'user.data_export',
      userId: auth.id,
      traceId,
      ip,
    })

    return NextResponse.json(exportData, {
      headers: {
        'Content-Disposition': `attachment; filename="karnet-data-export-${auth.id.slice(0, 8)}.json"`,
        'Content-Type': 'application/json',
      },
    })
  } catch {
    return NextResponse.json({ error: 'Veri export edilemedi.' }, { status: 500 })
  }
}
