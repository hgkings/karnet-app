import { callGatewayV1Format, errorResponse } from '@/lib/api/helpers'

export const dynamic = 'force-dynamic'

export async function GET() {
  // Production'da devre disi — sadece development'ta calisir
  if (process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production') {
    return Response.json({ error: 'Bu endpoint production ortaminda devre disidir.' }, { status: 403 })
  }

  try {
    return callGatewayV1Format('payment', 'testCallback', {}, 'system')
  } catch (error) {
    return errorResponse(error)
  }
}
