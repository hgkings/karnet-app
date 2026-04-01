import { z } from 'zod'

export const CreateTicketSchema = z.object({
  subject: z.string().trim().min(1).max(200, 'Konu en fazla 200 karakter olabilir'),
  category: z.enum(['teknik', 'odeme', 'hesap', 'oneri', 'diger']),
  priority: z.enum(['dusuk', 'normal', 'yuksek', 'acil']).default('normal'),
  message: z.string().trim()
    .min(20, 'Mesaj en az 20 karakter olmalıdır')
    .max(5000, 'Mesaj en fazla 5000 karakter olabilir'),
}).strict()

export const TicketFilterSchema = z.object({
  status: z.enum(['acik', 'inceleniyor', 'cevaplandi', 'kapali']).optional(),
  priority: z.enum(['dusuk', 'normal', 'yuksek', 'acil']).optional(),
  category: z.enum(['teknik', 'odeme', 'hesap', 'oneri', 'diger']).optional(),
  search: z.string().trim().max(200).optional(),
}).strict()

export const AdminReplySchema = z.object({
  admin_reply: z.string().trim().min(1, 'Cevap boş olamaz').max(10000),
  status: z.enum(['acik', 'inceleniyor', 'cevaplandi', 'kapali']).optional(),
}).strict()
