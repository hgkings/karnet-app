'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Loader2, Package } from 'lucide-react';
import { formatCurrency } from '@/components/shared/format';
import type { StockItem } from '@/components/dashboard/products-table';

interface StockPriceItem {
  barcode: string;
  productName: string;
  currentQuantity: number;
  currentPrice: number;
  newQuantity: number;
  newPrice: number;
}

interface StockPriceUpdateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedProducts: Array<{
    barcode: string;
    productName: string;
    stock?: StockItem;
  }>;
  onComplete: () => void;
}

export function StockPriceUpdateModal({ open, onOpenChange, selectedProducts, onComplete }: StockPriceUpdateModalProps) {
  const [items, setItems] = useState<StockPriceItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Modal açılınca items'ı hazırla — barcode yoksa stock'tan al
  const initItems = () => {
    setItems(selectedProducts
      .map(p => {
        const bc = p.barcode || p.stock?.barcode || '';
        return {
          barcode: bc,
          productName: p.productName,
          currentQuantity: p.stock?.quantity ?? 0,
          currentPrice: p.stock?.salePrice ?? 0,
          newQuantity: p.stock?.quantity ?? 0,
          newPrice: p.stock?.salePrice ?? 0,
        };
      })
      .filter(p => p.barcode)
    );
  };

  const handleUpdate = async () => {
    const changed = items.filter(i =>
      i.newQuantity !== i.currentQuantity || i.newPrice !== i.currentPrice
    );

    if (changed.length === 0) {
      toast.info('Degisiklik yapilmadi.');
      return;
    }

    setLoading(true);
    const t = toast.loading(`${changed.length} urun Trendyol'a gonderiliyor...`);
    try {
      const res = await fetch('/api/marketplace/trendyol/stock/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: changed.map(i => ({
            barcode: i.barcode,
            quantity: i.newQuantity,
            salePrice: i.newPrice,
            listPrice: i.newPrice,
          })),
        }),
      });
      const data = await res.json();
      toast.dismiss(t);
      if (data.success) {
        toast.success(`${changed.length} urunun stok/fiyati Trendyol'da guncellendi.`);
        onOpenChange(false);
        onComplete();
      } else {
        toast.error(data.error || 'Guncelleme basarisiz.');
      }
    } catch {
      toast.dismiss(t);
      toast.error('Guncelleme sirasinda hata olustu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (v) initItems(); onOpenChange(v); }}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Stok & Fiyat Guncelle
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Degisiklikleri yapin, &quot;Trendyol&apos;a Gonder&quot; butonuna basin.
          </p>
        </DialogHeader>

        <div className="space-y-3 my-4">
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Secili urunlerde barkod bilgisi yok. Once &quot;Urunleri Senkronla&quot; yapin.
            </p>
          ) : (
            <>
              <div className="grid grid-cols-[1fr_80px_100px] gap-2 text-xs font-medium text-muted-foreground px-1">
                <span>Urun</span>
                <span className="text-center">Stok</span>
                <span className="text-right">Fiyat</span>
              </div>
              {items.map((item, idx) => (
                <div key={item.barcode} className="grid grid-cols-[1fr_80px_100px] gap-2 items-center rounded-lg border border-border/40 p-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{item.productName}</p>
                    <p className="text-[10px] text-muted-foreground font-mono">{item.barcode}</p>
                  </div>
                  <Input
                    type="number"
                    min={0}
                    className="h-8 text-center text-sm"
                    value={item.newQuantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      setItems(prev => prev.map((it, i) => i === idx ? { ...it, newQuantity: val } : it));
                    }}
                  />
                  <Input
                    type="number"
                    min={0}
                    step={0.01}
                    className="h-8 text-right text-sm"
                    value={item.newPrice}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      setItems(prev => prev.map((it, i) => i === idx ? { ...it, newPrice: val } : it));
                    }}
                  />
                </div>
              ))}
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Vazgec
          </Button>
          <Button onClick={handleUpdate} disabled={loading || items.length === 0}>
            {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
            Trendyol&apos;a Gonder ({items.filter(i => i.newQuantity !== i.currentQuantity || i.newPrice !== i.currentPrice).length} degisiklik)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
