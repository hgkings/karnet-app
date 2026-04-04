'use client';

import { useState, useRef, useCallback } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useAlerts } from '@/contexts/alert-context';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { ProductsTable } from '@/components/dashboard/products-table';
import { deleteAnalysis, saveAnalysis, generateId } from '@/lib/api/analyses';
import { parseCSV, analysesToXLSX, analysesToJSON } from '@/lib/csv';
import { ProductInput } from '@/types';
import { calculateProfit } from '@/utils/calculations';
import { calculateRisk } from '@/utils/risk-engine';
import { UpgradeModal } from '@/components/shared/upgrade-modal';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, Download, Lock, Settings2, Loader2, Package, RefreshCw, AlertTriangle, Store } from 'lucide-react';
import Link from 'next/link';
import { BulkUpdateModal } from '@/components/dashboard/bulk-update-modal';
import { CSVImportSection } from '@/components/dashboard/csv-import-section';
import { toast } from 'sonner';
import { isProUser } from '@/utils/access';
import { formatCurrency } from '@/components/shared/format';

export default function ProductsPage() {
  const { user } = useAuth();
  const { analyses, loading, refresh } = useAlerts();
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showBulkUpdate, setShowBulkUpdate] = useState(false);

  // Trendyol stok verileri
  const [stockLoading, setStockLoading] = useState(false);
  const [stockData, setStockData] = useState<{
    totalProducts: number; totalStock: number; outOfStock: number; lowStock: number;
    products: Array<{
      id: string; title: string; barcode: string; stockCode: string;
      salePrice: number; listPrice: number; quantity: number;
      imageUrl: string | null; categoryName: string; brand: string;
    }>;
  } | null>(null);

  const fetchStock = useCallback(async () => {
    setStockLoading(true);
    try {
      const res = await fetch('/api/marketplace/trendyol/stock');
      const data = await res.json();
      if (data.success) {
        setStockData(data);
      } else {
        toast.error(data.error || 'Stok verisi alınamadı');
      }
    } catch {
      toast.error('Stok verisi çekilemedi');
    } finally {
      setStockLoading(false);
    }
  }, []);

  const isPro = isProUser(user);

  const handleDelete = async (id: string) => {
    const result = await deleteAnalysis(id);
    if (!result.success) {
      toast.error(`Silme işlemi başarısız: ${result.error}`);
      return;
    }

    toast.success('Ürün analizi silindi.');
    await refresh();
  };

  const performImport = async (data: ProductInput[]) => {
    if (!user) return;

    if (!isPro && analyses.length + data.length > 5) {
      setShowUpgrade(true);
      toast.error('Ücretsiz planda en fazla 5 analiz yapabilirsiniz. Toplu yükleme için Pro plana geçmelisiniz.');
      return;
    }

    toast.info(`${data.length} ürün yükleniyor...`);
    for (const input of data) {
      const result = calculateProfit(input);
      const risk = calculateRisk(input, result);
      await saveAnalysis({
        id: generateId(),
        userId: user.id,
        input,
        result,
        risk,
        createdAt: new Date().toISOString(),
      });
    }
    toast.success('İçe aktarma tamamlandı.');
    await refresh();
  };

  const handleExportJSON = () => {
    if (analyses.length === 0) return;
    const json = analysesToJSON(analyses);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'urunler.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportXLSX = () => {
    if (analyses.length === 0 || !isPro) {
      if (!isPro) setShowUpgrade(true);
      return;
    }
    try {
      const buffer = analysesToXLSX(analyses);
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'karnet_urunler.xlsx';
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Excel dosyası indirildi');
    } catch {
      toast.error('Excel dosyası oluşturulamadı');
    }
  };

  if (loading && analyses.length === 0) {
    return (
      <DashboardLayout>
        <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Ürünler yükleniyor...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Ürünler</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {analyses.length} ürün analizi{!isPro && ` (Ücretsiz: maks 5)`}
              </p>
            </div>
            <Link href="/analysis/new" className="w-full sm:w-auto">
              <Button size="sm" className="w-full sm:w-auto">Yeni Analiz</Button>
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-2 -mx-1 px-1">
            <Button variant="outline" size="sm" onClick={handleExportJSON} disabled={analyses.length === 0} className="whitespace-nowrap">
              <Download className="mr-1.5 h-4 w-4" />
              JSON
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportXLSX} disabled={analyses.length === 0} className="whitespace-nowrap">
              <Download className="mr-1.5 h-4 w-4" />
              {isPro ? 'Excel' : 'Excel (Pro)'}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowBulkUpdate(true)} disabled={analyses.length === 0} className="whitespace-nowrap">
              <Settings2 className="mr-1.5 h-4 w-4" />
              Toplu Güncelle
            </Button>
          </div>
        </div>

        <CSVImportSection onImport={performImport} />

        <BulkUpdateModal
          open={showBulkUpdate}
          onOpenChange={setShowBulkUpdate}
          analyses={analyses}
          onComplete={refresh}
        />

        <ProductsTable analyses={analyses} onDelete={handleDelete} />

        {/* Trendyol Stok Bilgisi */}
        {isPro && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-amber-700 dark:text-amber-400" />
                <h2 className="text-lg font-bold">Trendyol Stok Bilgisi</h2>
              </div>
              <Button variant="outline" size="sm" onClick={fetchStock} disabled={stockLoading}>
                {stockLoading ? <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5 mr-1.5" />}
                {stockLoading ? 'Çekiliyor...' : 'Stok Çek'}
              </Button>
            </div>

            {!stockData && !stockLoading && (
              <Card className="border-border/40">
                <CardContent className="flex flex-col items-center py-8 gap-3">
                  <Store className="h-8 w-8 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">Trendyol stok verilerinizi görmek için "Stok Çek" butonuna basın.</p>
                </CardContent>
              </Card>
            )}

            {stockData && (
              <>
                {/* KPI Kartları */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <Card className="border-border/40">
                    <CardContent className="p-3">
                      <p className="text-[10px] text-muted-foreground">Toplam Ürün</p>
                      <p className="text-lg font-bold tabular-nums">{stockData.totalProducts}</p>
                    </CardContent>
                  </Card>
                  <Card className="border-border/40">
                    <CardContent className="p-3">
                      <p className="text-[10px] text-muted-foreground">Toplam Stok</p>
                      <p className="text-lg font-bold tabular-nums">{stockData.totalStock.toLocaleString('tr-TR')}</p>
                    </CardContent>
                  </Card>
                  <Card className="border-border/40">
                    <CardContent className="p-3">
                      <p className="text-[10px] text-muted-foreground">Stok Yok</p>
                      <p className="text-lg font-bold tabular-nums text-red-500">{stockData.outOfStock}</p>
                    </CardContent>
                  </Card>
                  <Card className="border-border/40">
                    <CardContent className="p-3">
                      <p className="text-[10px] text-muted-foreground">Düşük Stok (≤5)</p>
                      <p className="text-lg font-bold tabular-nums text-amber-600 dark:text-amber-400">{stockData.lowStock}</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Ürün Tablosu */}
                <Card className="border-border/40">
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border/30 bg-muted/20">
                            <th className="text-left p-3 font-medium text-muted-foreground text-xs">Ürün</th>
                            <th className="text-left p-3 font-medium text-muted-foreground text-xs">Barkod</th>
                            <th className="text-right p-3 font-medium text-muted-foreground text-xs">Satış Fiyatı</th>
                            <th className="text-right p-3 font-medium text-muted-foreground text-xs">Liste Fiyatı</th>
                            <th className="text-right p-3 font-medium text-muted-foreground text-xs">Stok</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stockData.products.slice(0, 200).map((p, i) => (
                            <tr key={i} className="border-b border-border/20 hover:bg-muted/10">
                              <td className="p-3">
                                <div className="flex items-center gap-2.5">
                                  {p.imageUrl ? (
                                    <img src={p.imageUrl} alt="" className="w-8 h-8 rounded-md object-cover border border-border/30 shrink-0" loading="lazy" />
                                  ) : (
                                    <div className="w-8 h-8 rounded-md border border-border/30 bg-muted/20 flex items-center justify-center shrink-0">
                                      <Package className="h-3 w-3 text-muted-foreground/40" />
                                    </div>
                                  )}
                                  <div className="min-w-0">
                                    <p className="text-xs font-medium truncate max-w-[200px]">{p.title}</p>
                                    <p className="text-[10px] text-muted-foreground">{p.brand} · {p.categoryName}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="p-3 text-xs tabular-nums font-mono text-muted-foreground">{p.barcode}</td>
                              <td className="p-3 text-right text-xs tabular-nums font-medium">{formatCurrency(p.salePrice)}</td>
                              <td className="p-3 text-right text-xs tabular-nums text-muted-foreground">{formatCurrency(p.listPrice)}</td>
                              <td className="p-3 text-right">
                                {p.quantity === 0 ? (
                                  <Badge variant="outline" className="text-[10px] bg-red-500/10 text-red-500 border-red-500/20">Stok Yok</Badge>
                                ) : p.quantity <= 5 ? (
                                  <span className="text-xs font-bold tabular-nums text-amber-600 dark:text-amber-400">{p.quantity}</span>
                                ) : (
                                  <span className="text-xs font-bold tabular-nums">{p.quantity}</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {stockData.products.length > 200 && (
                      <div className="p-3 text-center text-xs text-muted-foreground border-t border-border/30">
                        İlk 200 ürün gösteriliyor. Toplam: {stockData.totalProducts}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        )}
      </div>

      <UpgradeModal open={showUpgrade} onClose={() => setShowUpgrade(false)} />
    </DashboardLayout>
  );
}
