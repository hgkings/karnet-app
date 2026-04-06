'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { toast } from 'sonner';
import { Loader2, Truck, FileText, XCircle, Package, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface OrderActionsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface PendingOrder {
  orderNumber: string;
  shipmentPackageId: number;
  status: string;
  orderDate: number;
  lines: Array<{
    productName?: string;
    barcode?: string;
    quantity?: number;
    lineId?: number;
  }>;
}

export function OrderActionsSheet({ open, onOpenChange }: OrderActionsSheetProps) {
  const [orders, setOrders] = useState<PendingOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetch('/api/marketplace/trendyol/orders/pending')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.success) {
          const raw = (data.orders ?? []) as Array<Record<string, unknown>>;
          setOrders(raw.map(o => ({
            orderNumber: String(o.orderNumber ?? ''),
            shipmentPackageId: Number(o.shipmentPackageId ?? 0),
            status: String(o.shipmentPackageStatus ?? o.status ?? ''),
            orderDate: Number(o.orderDate ?? 0),
            lines: ((o.lines ?? o.orderItems ?? []) as Array<Record<string, unknown>>).map(l => ({
              productName: String(l.productName ?? ''),
              barcode: String(l.barcode ?? ''),
              quantity: Number(l.quantity ?? 1),
              lineId: Number(l.lineId ?? l.id ?? 0),
            })),
          })));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [open]);

  const handleAction = async (action: string, shipmentPackageId: number, extra?: Record<string, unknown>) => {
    const key = `${action}-${shipmentPackageId}`;
    setActionLoading(key);
    const t = toast.loading('Islem yapiliyor...');
    try {
      const res = await fetch('/api/marketplace/trendyol/orders/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, shipmentPackageId, ...extra }),
      });
      const data = await res.json();
      toast.dismiss(t);
      if (data.success) {
        toast.success('Islem basarili!');
        // Listeyi guncelle
        setOrders(prev => prev.filter(o => o.shipmentPackageId !== shipmentPackageId));
      } else {
        toast.error(data.error || 'Islem basarisiz.');
      }
    } catch {
      toast.dismiss(t);
      toast.error('Baglanti hatasi.');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusLabel = (status: string) => {
    const map: Record<string, { label: string; color: string }> = {
      Created: { label: 'Yeni', color: 'bg-blue-500/10 text-blue-600' },
      Picking: { label: 'Hazirlaniyor', color: 'bg-amber-500/10 text-amber-600' },
      Awaiting: { label: 'Beklemede', color: 'bg-orange-500/10 text-orange-600' },
      Invoiced: { label: 'Faturalanmis', color: 'bg-purple-500/10 text-purple-600' },
    };
    return map[status] ?? { label: status, color: 'bg-muted text-muted-foreground' };
  };

  const getTimeSince = (ts: number) => {
    if (!ts) return '';
    const hours = Math.floor((Date.now() - ts) / (1000 * 60 * 60));
    if (hours < 1) return 'az once';
    if (hours < 24) return `${hours} saat once`;
    return `${Math.floor(hours / 24)} gun once`;
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Bekleyen Siparisler
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-3">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 text-sm text-muted-foreground">
              Bekleyen siparis yok
            </div>
          ) : (
            orders.map(order => {
              const statusInfo = getStatusLabel(order.status);
              const isOver24h = order.orderDate > 0 && (Date.now() - order.orderDate) > 24 * 60 * 60 * 1000;
              return (
                <div key={order.shipmentPackageId} className="rounded-xl border border-border/40 bg-card p-4 space-y-3">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-semibold text-foreground">#{order.orderNumber}</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge variant="outline" className={`text-[10px] ${statusInfo.color}`}>
                          {statusInfo.label}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {getTimeSince(order.orderDate)}
                        </span>
                        {isOver24h && (
                          <span className="text-[10px] text-red-500 font-medium">24h+</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Ürünler */}
                  <div className="space-y-1">
                    {order.lines.slice(0, 3).map((line, i) => (
                      <div key={i} className="text-xs text-muted-foreground truncate">
                        {line.quantity}x {line.productName || line.barcode || 'Urun'}
                      </div>
                    ))}
                    {order.lines.length > 3 && (
                      <span className="text-[10px] text-muted-foreground">+{order.lines.length - 3} urun daha</span>
                    )}
                  </div>

                  {/* Aksiyonlar */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-border/20">
                    {order.status === 'Created' && (
                      <Button
                        size="sm"
                        className="h-7 text-xs"
                        disabled={actionLoading !== null}
                        onClick={() => handleAction('updateStatus', order.shipmentPackageId, { status: 'Picking' })}
                      >
                        <Truck className="h-3 w-3 mr-1" />
                        Hazirla
                      </Button>
                    )}
                    {(order.status === 'Created' || order.status === 'Picking') && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs"
                        disabled={actionLoading !== null}
                        onClick={() => handleAction('updateStatus', order.shipmentPackageId, { status: 'Invoiced' })}
                      >
                        <FileText className="h-3 w-3 mr-1" />
                        Faturala
                      </Button>
                    )}
                    {order.status === 'Invoiced' && (
                      <Button
                        size="sm"
                        className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700"
                        disabled={actionLoading !== null}
                        onClick={() => handleAction('updateStatus', order.shipmentPackageId, { status: 'Shipped' })}
                      >
                        <Truck className="h-3 w-3 mr-1" />
                        Kargola
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs text-red-500 border-red-500/30 hover:bg-red-500/10"
                      disabled={actionLoading !== null}
                      onClick={() => {
                        const lineItems = order.lines.map(l => ({ lineId: l.lineId ?? 0, quantity: l.quantity ?? 1 }));
                        handleAction('markUnsupplied', order.shipmentPackageId, { lineItems });
                      }}
                    >
                      <XCircle className="h-3 w-3 mr-1" />
                      Tedarik Edilemez
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
