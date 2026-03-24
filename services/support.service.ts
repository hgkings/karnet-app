import * as supportDal from '@/dal/support'
import { Ticket, TicketFilters, TicketStats, CreateTicketDto, UpdateTicketDto } from '@/types'

const PRIORITY_ORDER: Record<string, number> = { acil: 0, yuksek: 1, normal: 2, dusuk: 3 }

export async function getTickets(
  userId: string,
  filters?: Pick<TicketFilters, 'status'>
): Promise<Ticket[]> {
  const data = await supportDal.getTicketsByUserId(userId, filters)
  return data as Ticket[]
}

export async function createTicket(
  userId: string,
  userEmail: string,
  data: CreateTicketDto
): Promise<Ticket> {
  const ticket = await supportDal.createTicket({
    user_id: userId,
    user_email: userEmail,
    subject: data.subject,
    category: data.category,
    priority: data.priority,
    message: data.message,
  })
  return ticket as Ticket
}

export async function getAllTickets(filters?: TicketFilters): Promise<Ticket[]> {
  const tickets = await supportDal.getAllTickets(filters)
  const typed = tickets as Ticket[]

  // Öncelik → tarih sıralaması (iş mantığı)
  return typed.sort((a, b) => {
    const pa = PRIORITY_ORDER[a.priority] ?? 99
    const pb = PRIORITY_ORDER[b.priority] ?? 99
    if (pa !== pb) return pa - pb
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })
}

export async function replyToTicket(
  ticketId: string,
  data: UpdateTicketDto
): Promise<Ticket> {
  const updates: Record<string, unknown> = {}
  if (data.status) updates.status = data.status
  if (data.admin_reply) {
    updates.admin_reply = data.admin_reply
    updates.admin_replied_at = new Date().toISOString()
  }

  const ticket = await supportDal.updateTicket(ticketId, updates)
  return ticket as Ticket
}

export async function deleteTicket(ticketId: string): Promise<void> {
  await supportDal.deleteTicket(ticketId)
}

export async function getTicketStats(): Promise<TicketStats> {
  const data = await supportDal.getTicketStats()
  const today = new Date().toISOString().slice(0, 10)

  return {
    open: data.filter((t: Record<string, unknown>) => t.status === 'acik').length,
    reviewing: data.filter((t: Record<string, unknown>) => t.status === 'inceleniyor').length,
    answeredToday: data.filter(
      (t: Record<string, unknown>) => (t.admin_replied_at as string)?.slice(0, 10) === today
    ).length,
    total: data.length,
  }
}
