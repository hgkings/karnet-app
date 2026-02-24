'use client';

import { SupportTicket } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface TicketListProps {
    tickets: SupportTicket[];
    onSelectTicket: (ticket: SupportTicket) => void;
}

const statusMap: Record<string, { label: string; color: string }> = {
    open: { label: 'Açık', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    in_progress: { label: 'İşleniyor', color: 'bg-amber-100 text-amber-700 border-amber-200' },
    resolved: { label: 'Çözüldü', color: 'bg-green-100 text-green-700 border-green-200' },
    closed: { label: 'Kapalı', color: 'bg-gray-100 text-gray-700 border-gray-200' },
};

const priorityMap: Record<string, { label: string; color: string }> = {
    low: { label: 'Düşük', color: 'bg-gray-100 text-gray-600' },
    medium: { label: 'Orta', color: 'bg-blue-50 text-blue-600' },
    high: { label: 'Yüksek', color: 'bg-red-50 text-red-600' },
};

export function TicketList({ tickets, onSelectTicket }: TicketListProps) {
    if (tickets.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-xl">
                Henüz bir destek talebiniz bulunmuyor.
            </div>
        );
    }

    return (
        <div className="grid gap-4">
            {tickets.map((ticket) => (
                <div
                    key={ticket.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-card rounded-xl border hover:shadow-sm transition-all cursor-pointer"
                    onClick={() => onSelectTicket(ticket)}
                >
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold">{ticket.subject}</span>
                            <Badge variant="outline" className={statusMap[ticket.status].color}>
                                {statusMap[ticket.status].label}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{new Date(ticket.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}</span>
                            <span>•</span>
                            <span>{priorityMap[ticket.priority].label} Öncelik</span>
                            <span>•</span>
                            <span className="capitalize">{ticket.category}</span>
                        </div>
                    </div>

                    <Badge variant="secondary" className="mt-4 sm:mt-0 w-fit">
                        Detayları Gör
                    </Badge>
                </div>
            ))}
        </div>
    );
}
