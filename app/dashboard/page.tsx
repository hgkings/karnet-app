'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { getStoredAnalyses } from '@/lib/storage';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { KPICard } from '@/components/shared/kpi-card';
import { ProductsTable } from '@/components/dashboard/products-table';
import { RiskChart } from '@/components/dashboard/risk-chart';
import { formatCurrency, formatPercent } from '@/components/shared/format';
import { deleteAnalysis } from '@/lib/storage';
import { Analysis } from '@/types';
import { TrendingUp, Percent, AlertTriangle, Star } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [analyses, setAnalyses] = useState<Analysis[]>([]);

  useEffect(() => {
    if (user) {
      setAnalyses(getStoredAnalyses(user.id));
    }
  }, [user]);

  const handleDelete = (id: string) => {
    deleteAnalysis(id);
    if (user) {
      setAnalyses(getStoredAnalyses(user.id));
    }
  };

  const totalProfit = analyses.reduce((sum, a) => sum + a.result.monthly_net_profit, 0);
  const avgMargin = analyses.length > 0
    ? analyses.reduce((sum, a) => sum + a.result.margin_pct, 0) / analyses.length
    : 0;
  const riskyCount = analyses.filter((a) => a.risk.level === 'risky' || a.risk.level === 'dangerous').length;
  const mostProfitable = analyses.length > 0
    ? analyses.reduce((best, a) => a.result.monthly_net_profit > best.result.monthly_net_profit ? a : best, analyses[0])
    : null;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Panel</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Urunlerinizin kar ve risk ozetini gorun.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Tahmini Aylik Kar"
            value={formatCurrency(totalProfit)}
            subtitle={totalProfit >= 0 ? 'Toplam kar' : 'Toplam zarar'}
            icon={TrendingUp}
            trend={totalProfit >= 0 ? 'up' : 'down'}
          />
          <KPICard
            title="Ortalama Marj"
            value={formatPercent(avgMargin)}
            subtitle={`${analyses.length} urun`}
            icon={Percent}
            trend={avgMargin >= 15 ? 'up' : avgMargin >= 0 ? 'neutral' : 'down'}
          />
          <KPICard
            title="Riskli Urun"
            value={riskyCount.toString()}
            subtitle={riskyCount > 0 ? 'Dikkat gerekli' : 'Her sey yolunda'}
            icon={AlertTriangle}
            trend={riskyCount > 0 ? 'down' : 'up'}
          />
          <KPICard
            title="En Karli Urun"
            value={mostProfitable ? mostProfitable.input.product_name.slice(0, 20) : '-'}
            subtitle={mostProfitable ? formatCurrency(mostProfitable.result.monthly_net_profit) + '/ay' : 'Henuz urun yok'}
            icon={Star}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="mb-4 text-lg font-semibold">Son Analizler</h2>
            <ProductsTable analyses={analyses.slice(0, 10)} onDelete={handleDelete} />
          </div>
          <div>
            <h2 className="mb-4 text-lg font-semibold">Risk Dagilimi</h2>
            <RiskChart analyses={analyses} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
