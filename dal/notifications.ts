import { createAdminClient } from '@/lib/supabase-server-client'

export async function getNotificationsByUserId(userId: string, limit = 50) {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data ?? []
}

export async function markNotificationAsRead(id: string) {
  const supabase = createAdminClient()

  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', id)

  if (error) throw error
}

export async function markAllNotificationsAsRead(userId: string) {
  const supabase = createAdminClient()

  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', userId)
    .eq('is_read', false)

  if (error) throw error
}

export async function upsertNotifications(notifications: Record<string, unknown>[]) {
  if (notifications.length === 0) return

  const supabase = createAdminClient()

  const { error } = await supabase
    .from('notifications')
    .upsert(notifications, { onConflict: 'user_id, dedupe_key' })

  if (error) throw error
}
