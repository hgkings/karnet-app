'use client';

import { useEffect, useState } from 'react';
import { SupportService } from '@/lib/support-service';
import { SupportTicket } from '@/types';
import { TicketForm } from '@/components/support/ticket-form';
import { TicketList } from '@/components/support/ticket-list';
import { TicketDetailDialog } from '@/components/support/ticket-detail-dialog';
import { Button } from '@/components/ui/button';
import { Plus, MessageSquare } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DashboardLayout } from '@/components/layout/dashboard-layout';

export default function SupportPage() {
    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
    const [detailOpen, setDetailOpen] = useState(false);

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const data = await SupportService.getUserTickets();
            setTickets(data);
        } catch (error) {
            console.error('Error fetching tickets:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    const handleTicketSelect = (ticket: SupportTicket) => {
        setSelectedTicket(ticket);
        setDetailOpen(true);
    };

    return (
        <DashboardLayout>
            <div className="space-y-8 max-w-5xl mx-auto p-4 sm:p-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight">Destek & İstek</h1>
                        <p className="text-muted-foreground">
                            Sorunlarınızı bildirin veya yeni özellikler talep edin.
                        </p>
                    </div>

                    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                        <DialogTrigger asChild>
                            <Button className="gap-2">
                                <Plus className="h-4 w-4" />
                                Yeni Talep Oluştur
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-lg">
                            <DialogHeader>
                                <DialogTitle>Yeni Destek Talebi</DialogTitle>
                            </DialogHeader>
                            <TicketForm onSuccess={() => {
                                setIsFormOpen(false);
                                fetchTickets();
                            }} />
                        </DialogContent>
                    </Dialog>
                </div>

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-24 bg-muted/40 animate-pulse rounded-xl" />
                        ))}
                    </div>
                ) : (
                    <TicketList tickets={tickets} onSelectTicket={handleTicketSelect} />
                )}

                {/* Detail Modal */}
                <TicketDetailDialog
                    ticket={selectedTicket}
                    open={detailOpen}
                    onOpenChange={setDetailOpen}
                />
            </div>
        </DashboardLayout>
    );
}
