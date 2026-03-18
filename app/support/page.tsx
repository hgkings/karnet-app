'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { TicketForm } from '@/components/support/ticket-form'
import { TicketList } from '@/components/support/ticket-list'
import { TicketDetailDialog } from '@/components/support/ticket-detail-dialog'
import { useSupportTickets } from '@/hooks/use-support-tickets'
import { Ticket } from '@/types'
import { toast } from 'sonner'
import { ChevronDown, ChevronUp } from 'lucide-react'

export default function SupportPage() {
  const { tickets, loading, createTicket, refetch } = useSupportTickets()
  const [formOpen, setFormOpen] = useState(true)
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleCreateSuccess = () => {
    toast.success('Destek talebiniz oluşturuldu.')
    setFormOpen(false)
    refetch()
  }

  const handleSelectTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket)
    setDialogOpen(true)
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-8 p-4 sm:p-0">
        <div className="pt-4">
          <h1 className="text-2xl font-bold tracking-tight">Destek</h1>
          <p className="text-muted-foreground text-sm mt-1">Yeni talep oluştur veya mevcut taleplerinizi görüntüleyin.</p>
        </div>

        {/* Yeni Talep Formu */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <button
            onClick={() => setFormOpen(v => !v)}
            className="w-full flex items-center justify-between px-5 py-4 text-sm font-semibold hover:bg-muted/30 transition-colors"
          >
            <span>Yeni Destek Talebi Oluştur</span>
            {formOpen
              ? <ChevronUp className="h-4 w-4 text-muted-foreground" />
              : <ChevronDown className="h-4 w-4 text-muted-foreground" />
            }
          </button>
          {formOpen && (
            <div className="px-5 pb-5 border-t border-border">
              <div className="pt-4">
                <TicketForm
                  onSuccess={handleCreateSuccess}
                  onCreate={createTicket}
                />
              </div>
            </div>
          )}
        </div>

        {/* Mevcut Talepler */}
        <div className="space-y-3">
          <h2 className="text-base font-semibold">Taleplerim</h2>
          <TicketList
            tickets={tickets}
            loading={loading}
            onSelectTicket={handleSelectTicket}
          />
        </div>

        {/* Doğrudan İletişim */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Doğrudan İletişim
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Acil durumlar veya destek talebi dışındaki sorularınız için bize doğrudan ulaşabilirsiniz.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">E-posta</p>
                <a href="mailto:karnet.destek@gmail.com" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
                  karnet.destek@gmail.com
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Telefon</p>
                <a href="tel:+905433824521" className="text-sm font-medium text-gray-900 dark:text-white hover:underline">
                  +90 543 382 45 21
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TicketDetailDialog
        ticket={selectedTicket}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </DashboardLayout>
  )
}
