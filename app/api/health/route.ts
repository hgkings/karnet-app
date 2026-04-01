import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

interface HealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: string
  version: string
  checks: {
    database: { status: 'up' | 'down'; latencyMs: number }
    memory: { usedMB: number; totalMB: number; percentUsed: number }
    uptime: number
  }
}

export async function GET(request: Request): Promise<Response> {
  // Detayli bilgi sadece cron secret ile erisebilir
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  const isAuthorized = cronSecret && authHeader === `Bearer ${cronSecret}`

  const start = Date.now()

  // DB check
  let dbStatus: 'up' | 'down' = 'down'
  let dbLatency = 0
  try {
    const dbStart = Date.now()
    const supabase = await createClient()
    const { error } = await supabase.from('profiles').select('id').limit(1)
    dbLatency = Date.now() - dbStart
    dbStatus = error ? 'down' : 'up'
  } catch {
    dbStatus = 'down'
    dbLatency = Date.now() - start
  }

  // Memory check
  const memUsage = process.memoryUsage()
  const usedMB = Math.round(memUsage.heapUsed / 1024 / 1024)
  const totalMB = Math.round(memUsage.heapTotal / 1024 / 1024)
  const percentUsed = Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100)

  // Overall status
  const overallStatus: HealthCheck['status'] =
    dbStatus === 'down' ? 'unhealthy' :
    dbLatency > 2000 || percentUsed > 90 ? 'degraded' :
    'healthy'

  const httpStatus = overallStatus === 'unhealthy' ? 503 : 200

  // Yetkilendirilmemis istekler icin sadece genel durum
  if (!isAuthorized) {
    return Response.json(
      { status: overallStatus, timestamp: new Date().toISOString() },
      { status: httpStatus, headers: { 'Cache-Control': 'no-cache, no-store' } }
    )
  }

  // Yetkili istekler icin detayli bilgi
  const health: HealthCheck = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '2.0.0',
    checks: {
      database: { status: dbStatus, latencyMs: dbLatency },
      memory: { usedMB, totalMB, percentUsed },
      uptime: process.uptime(),
    },
  }

  return Response.json(health, {
    status: httpStatus,
    headers: { 'Cache-Control': 'no-cache, no-store' },
  })
}
