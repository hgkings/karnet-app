'use client';

import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { ProductsTable } from '@/components/dashboard/products-table';
import { getStoredAnalyses, deleteAnalysis, saveAnalysis, generateId, getUserAnalysisCount } from '@/lib/storage';
import { parseCSV, analysesToCSV, analysesToJSON } from '@/lib/csv';
import { calculateProfit } from '@/utils/calculations';
import { calculateRisk } from '@/utils/risk-engine';
import { UpgradeModal } from '@/components/shared/upgrade-modal';
import { Analysis } from '@/types';
import { Button } from '@/components/ui/button';
import { Upload, Download, Lock } from 'lucide-react';
import Link from 'next/link';

export default function ProductsPage() {
  const { user } = useAuth();
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [csvErrors, setCsvErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) setAnalyses(getStoredAnalyses(user.id));
  }, [user]);

  const isPro = user?.plan === 'pro';

  const handleDelete = (id: string) => {
    deleteAnalysis(id);
    if (user) setAnalyses(getStoredAnalyses(user.id));
  };

  const handleCSVImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!isPro) {
      setShowUpgrade(true);
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const { data, errors } = parseCSV(text);
      setCsvErrors(errors);

      if (data.length > 0) {
        data.forEach((input) => {
          const result = calculateProfit(input);
          const risk = calculateRisk(input, result);
          saveAnalysis({
            id: generateId(),
            userId: user.id,
            input,
            result,
            risk,
            createdAt: new Date().toISOString(),
          });
        });
        setAnalyses(getStoredAnalyses(user.id));
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
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

  const handleExportCSV = () => {
    if (analyses.length === 0 || !isPro) return;
    const csv = analysesToCSV(analyses);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'urunler.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Urunler</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {analyses.length} urun analizi{!isPro && ` (Ucretsiz: maks 5)`}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleCSVImport}
            />
            {isPro ? (
              <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                <Upload className="mr-1.5 h-4 w-4" />
                CSV Yukle
              </Button>
            ) : (
              <Button variant="outline" size="sm" disabled>
                <Lock className="mr-1.5 h-4 w-4" />
                CSV Yukle (Pro)
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={handleExportJSON} disabled={analyses.length === 0}>
              <Download className="mr-1.5 h-4 w-4" />
              JSON
            </Button>
            {isPro ? (
              <Button variant="outline" size="sm" onClick={handleExportCSV} disabled={analyses.length === 0}>
                <Download className="mr-1.5 h-4 w-4" />
                CSV
              </Button>
            ) : (
              <Button variant="outline" size="sm" disabled>
                <Lock className="mr-1.5 h-4 w-4" />
                CSV (Pro)
              </Button>
            )}
            <Link href="/analysis/new">
              <Button size="sm">Yeni Analiz</Button>
            </Link>
          </div>
        </div>

        {csvErrors.length > 0 && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/30">
            <p className="text-sm font-medium text-red-700 dark:text-red-400">CSV iceri aktarma hatalari:</p>
            <ul className="mt-2 space-y-1">
              {csvErrors.map((err, i) => (
                <li key={i} className="text-xs text-red-600 dark:text-red-400">{err}</li>
              ))}
            </ul>
          </div>
        )}

        <ProductsTable analyses={analyses} onDelete={handleDelete} />
      </div>

      <UpgradeModal open={showUpgrade} onClose={() => setShowUpgrade(false)} />
    </DashboardLayout>
  );
}
