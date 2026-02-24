'use client';

import { useState } from 'react';
import { SupportService } from '@/lib/support-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { SupportPriority } from '@/types';
import { Loader2, Upload } from 'lucide-react';
import { toast } from 'sonner';

interface TicketFormProps {
    onSuccess: () => void;
}

export function TicketForm({ onSuccess }: TicketFormProps) {
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        subject: '',
        category: '',
        message: '',
        priority: 'medium' as SupportPriority,
    });
    const [file, setFile] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await SupportService.createTicket({
                ...formData,
                attachment: file,
            });

            toast.success('Destek talebiniz oluşturuldu.');

            setFormData({
                subject: '',
                category: '',
                message: '',
                priority: 'medium',
            });
            setFile(null);
            onSuccess();
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || 'Bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="category">Kategori</Label>
                    <Select
                        value={formData.category}
                        onValueChange={(v) => setFormData({ ...formData, category: v })}
                        required
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Kategori Seçin" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="technical">Teknik Sorun</SelectItem>
                            <SelectItem value="billing">Fatura / Ödeme</SelectItem>
                            <SelectItem value="feature">Özellik İsteği</SelectItem>
                            <SelectItem value="other">Diğer</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="priority">Öncelik</Label>
                    <Select
                        value={formData.priority}
                        onValueChange={(v) => setFormData({ ...formData, priority: v as SupportPriority })}
                        required
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Öncelik Seçin" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="low">Düşük</SelectItem>
                            <SelectItem value="medium">Orta</SelectItem>
                            <SelectItem value="high">Yüksek</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="subject">Konu</Label>
                <Input
                    id="subject"
                    placeholder="Örn: Raporlama hatası"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="message">Mesaj</Label>
                <Textarea
                    id="message"
                    placeholder="Sorununuzu detaylı açıklayın..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    className="min-h-[120px]"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="attachment">Ek Dosya (İsteğe bağlı)</Label>
                <div className="flex items-center gap-2">
                    <Input
                        id="attachment"
                        type="file"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        className="cursor-pointer"
                    />
                </div>
                <p className="text-xs text-muted-foreground">Maksimum 5MB. Ekran görüntüsü veya belge yükleyebilirsiniz.</p>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Gönderiliyor...
                    </>
                ) : (
                    'Talebi Gönder'
                )}
            </Button>
        </form>
    );
}
