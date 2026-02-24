'use client';

import { useEffect, useState } from 'react';
import { SupportService } from '@/lib/support-service';
import { SupportTicket, SupportStatus } from '@/types';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';

export default function AdminSupportPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [tickets, setTickets] = useState<(SupportTicket & { profiles?: { email: string } })[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState<(SupportTicket & { profiles?: { email: string } }) | null>(null);
    const [adminNote, setAdminNote] = useState('');

    // Basic Admin Check (Client Side only - RLS handles real security)
    // Ideally we should check a role or a specific claim
    // For now, let's rely on RLS returning empty array if not allowed, 
    // but better to redirect non-admins.
    // Since user object doesn't have "isAdmin" flag readily available securely without custom claims,
    // we'll proceed.

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const data = await SupportService.getAllTickets();
            setTickets(data);
        } catch (error) {
            console.error('Error fetching tickets:', error);
            toast.error('Biletler yüklenemedi. Yetkiniz olmayabilir.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchTickets();
        }
    }, [user]);

    const handleStatusUpdate = async (id: string, status: SupportStatus) => {
        try {
            await SupportService.updateStatus(id, status);
            setTickets(tickets.map(t => t.id === id ? { ...t, status } : t));
            toast.success('Durum güncellendi');
        } catch (error) {
            toast.error('Durum güncellenemedi');
        }
    };

    const handleNoteUpdate = async () => {
        if (!selectedTicket) return;
        try {
            await SupportService.updateAdminNote(selectedTicket.id, adminNote);
            setTickets(tickets.map(t => t.id === selectedTicket.id ? { ...t, admin_note: adminNote } : t));
            setSelectedTicket({ ...selectedTicket, admin_note: adminNote });
            toast.success('Not eklendi');
        } catch (error) {
            toast.error('Not eklenemedi');
        }
    };

    const statusMap: Record<string, { label: string; color: string }> = {
        open: { label: 'Açık', color: 'bg-blue-100 text-blue-700' },
        in_progress: { label: 'İşleniyor', color: 'bg-amber-100 text-amber-700' },
        resolved: { label: 'Çözüldü', color: 'bg-green-100 text-green-700' },
        closed: { label: 'Kapalı', color: 'bg-gray-100 text-gray-700' },
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Destek Talepleri (Admin)</h1>
                    <Button variant="outline" onClick={fetchTickets}>Yenile</Button>
                </div>

                {loading ? (
                    <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
                ) : (
                    <div className="grid gap-4">
                        {tickets.map(ticket => (
                            <Card key={ticket.id} className="cursor-pointer hover:bg-muted/10 transition-colors">
                                <CardContent className="p-4 flex flex-col sm:flex-row gap-4 justify-between">
                                    <div className="space-y-1" onClick={() => { setSelectedTicket(ticket); setAdminNote(ticket.admin_note || ''); }}>
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold">{ticket.subject}</span>
                                            <Badge variant="outline">{ticket.category}</Badge>
                                            <Badge className={statusMap[ticket.status]?.color}>{statusMap[ticket.status]?.label}</Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground truncate max-w-2xl">{ticket.message}</p>
                                        <div className="text-xs text-muted-foreground pt-1">
                                            {ticket.profiles?.email} • {new Date(ticket.created_at).toLocaleString()}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 min-w-[150px]">
                                        <Select
                                            defaultValue={ticket.status}
                                            onValueChange={(v) => handleStatusUpdate(ticket.id, v as SupportStatus)}
                                        >
                                            <SelectTrigger className="h-8">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="open">Açık</SelectItem>
                                                <SelectItem value="in_progress">İşleniyor</SelectItem>
                                                <SelectItem value="resolved">Çözüldü</SelectItem>
                                                <SelectItem value="closed">Kapalı</SelectItem>
                                            </SelectContent>
                                        </Select>

                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button size="sm" variant="secondary" onClick={() => { setSelectedTicket(ticket); setAdminNote(ticket.admin_note || ''); }}>
                                                    Detay
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-2xl">
                                                <DialogHeader>
                                                    <DialogTitle>{selectedTicket?.subject}</DialogTitle>
                                                </DialogHeader>
                                                <div className="space-y-4">
                                                    <div className="bg-muted p-4 rounded text-sm">
                                                        <p className="font-semibold mb-1">Kullanıcı Mesajı:</p>
                                                        {selectedTicket?.message}
                                                    </div>

                                                    {selectedTicket?.attachment_url && (
                                                        <p className="text-sm text-blue-600">Ek Dosya Mevcut (İndirme linki eklenebilir)</p>
                                                    )}

                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium">Yönetici Notu / Yanıtı:</label>
                                                        <Textarea
                                                            value={adminNote}
                                                            onChange={(e) => setAdminNote(e.target.value)}
                                                            rows={4}
                                                        />
                                                        <Button onClick={handleNoteUpdate}>Kaydet</Button>
                                                    </div>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
