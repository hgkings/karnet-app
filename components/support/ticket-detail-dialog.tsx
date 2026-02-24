'use client';

import { SupportTicket } from '@/types';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { SupportService } from '@/lib/support-service';
import { useState, useEffect } from 'react';

interface TicketDetailDialogProps {
    ticket: SupportTicket | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function TicketDetailDialog({ ticket, open, onOpenChange }: TicketDetailDialogProps) {
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

    useEffect(() => {
        if (ticket?.attachment_url) {
            SupportService.getAttachmentUrl(ticket.attachment_url).then(url => {
                if (url) setDownloadUrl(url);
            });
        } else {
            setDownloadUrl(null);
        }
    }, [ticket]);

    if (!ticket) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <DialogTitle className="text-xl">{ticket.subject}</DialogTitle>
                            <DialogDescription>
                                Talep ID: {ticket.id.slice(0, 8)} • Kategori: {ticket.category}
                            </DialogDescription>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            <Badge variant="outline">{ticket.status}</Badge>
                            <span className="text-xs text-muted-foreground">{new Date(ticket.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                </DialogHeader>

                <Separator />

                <ScrollArea className="flex-1 pr-4">
                    <div className="space-y-6 py-4">
                        {/* User Message */}
                        <div className="space-y-2">
                            <h4 className="text-sm font-medium text-muted-foreground">Mesajınız</h4>
                            <div className="bg-muted/30 p-4 rounded-lg text-sm whitespace-pre-wrap">
                                {ticket.message}
                            </div>
                        </div>

                        {/* Attachment */}
                        {downloadUrl && (
                            <div className="space-y-2">
                                <h4 className="text-sm font-medium text-muted-foreground">Ek Dosya</h4>
                                <Button variant="outline" size="sm" asChild>
                                    <a href={downloadUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                        <Download className="h-4 w-4" />
                                        Dosyayı İndir
                                    </a>
                                </Button>
                            </div>
                        )}

                        {/* Admin Response */}
                        {ticket.admin_note && (
                            <div className="space-y-2">
                                <h4 className="text-sm font-medium text-blue-600 dark:text-blue-400">Yönetici Yanıtı</h4>
                                <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg text-sm border border-blue-100 dark:border-blue-900 whitespace-pre-wrap">
                                    {ticket.admin_note}
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
