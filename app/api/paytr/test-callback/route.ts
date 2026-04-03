import { callGatewayV1Format, errorResponse, requireAdmin } from '@/lib/api/helpers'

export const dynamic = 'force-dynamic'

export async function GET() {
  // Production'da devre disi — sadece development'ta calisir
  if (process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production') {
    return Response.json({ error: 'Bu endpoint production ortaminda devre disidir.' }, { status: 403 })
  }

  const auth = await requireAdmin()
  if (auth instanceof Response) return auth

  try {
    return callGatewayV1Format('payment', 'testCallback', {}, auth.id)
  } catch (error) {
    return errorResponse(error)
  }
}
