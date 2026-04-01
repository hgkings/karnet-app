import { createClient } from '@/lib/supabase/server'

// ----------------------------------------------------------------
// Kaynak sahiplik dogrulama yardimcilari
// API route'larda kullanilir — sahiplik kontrolu yapar.
// false donerse 403 donmeli, exception firlatmaz.
// ----------------------------------------------------------------

/**
 * Analiz sahibini dogrular.
 */
export async function assertOwnsAnalysis(userId: string, analysisId: string): Promise<boolean> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('analyses')
    .select('id')
    .eq('id', analysisId)
    .eq('user_id', userId)
    .single()

  return !!data
}

/**
 * Destek talebi sahibini dogrular.
 */
export async function assertOwnsTicket(userId: string, ticketId: string): Promise<boolean> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('tickets')
    .select('id')
    .eq('id', ticketId)
    .eq('user_id', userId)
    .single()

  return !!data
}

/**
 * Marketplace baglanti sahibini dogrular.
 */
export async function assertOwnsMarketplace(userId: string, connectionId: string): Promise<boolean> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('marketplace_connections')
    .select('id')
    .eq('id', connectionId)
    .eq('user_id', userId)
    .single()

  return !!data
}

/**
 * Bildirim sahibini dogrular.
 */
export async function assertOwnsNotification(userId: string, notificationId: string): Promise<boolean> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('notifications')
    .select('id')
    .eq('id', notificationId)
    .eq('user_id', userId)
    .single()

  return !!data
}
