import { createAdminClient } from '@/lib/supabase-server-client'
import { TicketFilters } from '@/types'

const TICKET_COLUMNS = 'id, user_id, user_email, subject, category, priority, status, message, admin_reply, admin_replied_at, created_at, updated_at'

export async function createTicket(data: {
  user_id: string
  user_email: string
  subject: string
  category: string
  priority: string
  message: string
}) {
  const supabase = createAdminClient()

  const { data: ticket, error } = await supabase
    .from('tickets')
    .insert({ ...data, status: 'acik' })
    .select(TICKET_COLUMNS)
    .single()

  if (error) throw error
  return ticket
}

export async function getTicketsByUserId(userId: string, filters?: Pick<TicketFilters, 'status'>) {
  const supabase = createAdminClient()

  let query = supabase
    .from('tickets')
    .select(TICKET_COLUMNS)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (filters?.status) query = query.eq('status', filters.status)

  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

export async function getTicketById(ticketId: string, userId: string) {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('tickets')
    .select(TICKET_COLUMNS)
    .eq('id', ticketId)
    .eq('user_id', userId)
    .single()

  if (error) throw error
  return data
}

export async function getAllTickets(filters?: TicketFilters) {
  const supabase = createAdminClient()

  let query = supabase
    .from('tickets')
    .select(TICKET_COLUMNS)

  if (filters?.status) query = query.eq('status', filters.status)
  if (filters?.priority) query = query.eq('priority', filters.priority)
  if (filters?.category) query = query.eq('category', filters.category)

  // SQL injection koruması: özel karakterleri escape et
  if (filters?.search) {
    const sanitized = filters.search
      .replace(/[%_\\]/g, '\\$&')
      .substring(0, 100)
    query = query.or(`user_email.ilike.%${sanitized}%,subject.ilike.%${sanitized}%`)
  }

  const { data, error } = await query.order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function updateTicket(ticketId: string, updates: Record<string, unknown>) {
  const supabase = createAdminClient()

  const { data: ticket, error } = await supabase
    .from('tickets')
    .update(updates)
    .eq('id', ticketId)
    .select(TICKET_COLUMNS)
    .single()

  if (error) throw error
  return ticket
}

export async function deleteTicket(ticketId: string) {
  const supabase = createAdminClient()

  const { error } = await supabase
    .from('tickets')
    .delete()
    .eq('id', ticketId)

  if (error) throw error
}

export async function getTicketStats() {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('tickets')
    .select('status, admin_replied_at')

  if (error) throw error

  return data ?? []
}
