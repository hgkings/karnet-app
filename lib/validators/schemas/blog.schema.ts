import { z } from 'zod'

export const CreateCommentSchema = z.object({
  slug: z.string().trim().min(1).max(300),
  authorName: z.string().trim().min(1).max(100, 'Isim en fazla 100 karakter olabilir'),
  content: z.string().trim().min(1).max(2000, 'Yorum en fazla 2000 karakter olabilir'),
}).strict()

export const ModerateCommentSchema = z.object({
  commentId: z.string().uuid(),
  action: z.enum(['approve', 'reject']),
}).strict()
